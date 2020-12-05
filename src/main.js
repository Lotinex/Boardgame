
var isMyTurn = true;
var isMoving = false;
var action;
var current = 0;
const _ = HTMLElement;
_.prototype.append = function(value){
	this.innerHTML += value
}
/**
 * return element
 * @param {string} id 
 * @returns {HTMLElement}
 */
function get(id){
	return document.querySelector(id)
}
$("#move").on("click", () => {
	action = "move"
})
$("#pile").on("click", () => {
	action = "pile"
})
function AL(value){
	$("#alert").text(value)
	$("#alert").show()
	setTimeout(() => {
		$("#alert").fadeOut(1000)
	}, 500)
}
for(let i=0;i<49;i++){
	$("#board").append(`<div id='f${i}' class='can' onclick='executeAction("#f${i}")' tower="0">`)
}
$("#player").css('left', $("#f0").offset().left) //플레이어의 위치를
$("#player").css('top', $("#f0").offset().top) //시작점으로 맞춘다.

for(let j=0; j<49; j++){
	console.log(`f${j} : ${$(`#f${j}`).offset().left} , ${Math.floor($(`#f${j}`).offset().top)}`)
}

function levelOf(id){
	return Number($(id).attr('tower'))
}
function executeAction(id){
	if(action == "move"){
		move(id)
	}else if(action == "pile"){
		pile(id)
	}else {
		AL("행동을 선택해주세요.")
	}
}
function turnEnd(){
	action = null
}
function pile(id){
	if(!isMyTurn) return turnEnd();
	let moveRL = Math.floor($("#player").css('left').replace("px","")) != Math.floor($(id).offset().left)
	let moveTB = Math.floor($("#player").css('top').replace("px","")) != Math.floor($(id).offset().top)

	if(moveRL && moveTB) return AL("대각선으로 설치할 수 없습니다!"); //대각선으로 설치하려 할 때
	let direc = moveRL ? "RL" : "TB"

	if(direc == "RL" && Math.abs(Math.floor($(id).offset().left) - Math.floor($("#player").css('left').replace("px",""))) != 70) return AL("설치 가능 거리를 초과했습니다!")
	if(direc == "TB" && Math.abs(Math.floor($(id).offset().top) - Math.floor($("#player").css('top').replace("px",""))) != 70) return AL("설치 가능 거리를 초과했습니다!")

	if(levelOf(id) == 4) return AL("봉인된 탑에 더 쌓을 수 없습니다.")
	$(id).addClass(`tower${levelOf(id) + 1}`)
	$(id).attr('tower', levelOf(id) + 1)
	
	switch(levelOf(id)){
		case 1:
			$(id).html('<div>1</div>')
			break;
		case 2:
			$(id).html('<div>2</div>')
			break;
		case 3:
			$(id).html('<div>3</div>')
			break;
		case 4:
			$(id).html('<i class="fas fa-lock"></i>')
			break;
	}
	$(id).addClass("zoomIn")
	setTimeout(() => {
		$(id).removeClass("zoomIn")
	}, 200)
	turnEnd()
}
function move(id){
	if(isMoving) return turnEnd(); //이미 이동 중일 때
	if(!isMyTurn) return turnEnd(); //내 턴이 아닐 때
	if(levelOf(id) == 4) return AL("봉인된 탑은 이용할 수 없습니다.")
	if(levelOf(id) - current >= 2) return AL("이동하려는 탑이 너무 높습니다!")

	let moveRL = Math.floor($("#player").css('left').replace("px","")) != Math.floor($(id).offset().left)
	let moveTB = Math.floor($("#player").css('top').replace("px","")) != Math.floor($(id).offset().top)

	if(moveRL && moveTB) return AL("대각선으로 이동할 수 없습니다!"); //대각선으로 이동하려 할 때
	let direc = moveRL ? "RL" : "TB"

	if(direc == "RL" && Math.abs(Math.floor($(id).offset().left) - Math.floor($("#player").css('left').replace("px",""))) != 70) return AL("한 칸만 이동할 수 있습니다!")
	if(direc == "TB" && Math.abs(Math.floor($(id).offset().top) - Math.floor($("#player").css('top').replace("px",""))) != 70) return AL("한 칸만 이동할 수 있습니다!")

	isMoving = true
	$("#player").animate({
		left : Math.floor($(id).offset().left),
		top : Math.floor($(id).offset().top)
	})
	isMoving = false
	current = levelOf(id)
	turnEnd()
}