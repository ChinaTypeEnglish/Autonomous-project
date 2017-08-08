var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

// 月份是从0开始，而不是从1开始，但是日期却是从1开始而不是从0开始
// 这里表示2017年8月11日16点58分42秒
const endTime = new Date(2017,7,11,16,58,42);
var curShowTimeSeconds = 0;

var balls = [];
const colors = ['#33e5b5','#0099cc','#aa66cc','#9933cc','#99cc00','#669900','#ffbb33','#ff8800','#ff4444','#cc0000'];


window.onload = function () {
	var canvas = document.getElementById("Canvas");
	var context = canvas.getContext("2d");

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	curShowTimeSeconds = GetCurrentShowTimeSeconds();
	render(context)

	// 进行倒计时所需要的匿名函数
	setInterval(
		function(){
			render(context);
			update();
		},50
	)
}

function GetCurrentShowTimeSeconds () {
	var currTime = new Date();
	// getTime()获取当前时间到1970年1月1日0零时零分零秒的毫秒数
	// 以此可以判断两个时间节点的差值
	var ret = endTime.getTime() - currTime.getTime();
	ret = Math.round(ret / 1000);
	return ret >= 0 ? ret : 0;
}

function update () {
	var nextShowTimeSeconds = GetCurrentShowTimeSeconds();

	var nextHours = parseInt(nextShowTimeSeconds / 3600);
	var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
	var nextSeconds = nextShowTimeSeconds % 60;

	var curHours = parseInt(curShowTimeSeconds / 3600);
	var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
	var curSeconds = curShowTimeSeconds % 60;

	if(nextSeconds != curSeconds){
		// 时
		if(parseInt(curHours / 10) != parseInt(nextHours / 10)){
			addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10));
		}
		if(parseInt(curHours % 10) != parseInt(nextHours % 10)){
			addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours / 10));
		}
		// 分
		if(parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)){
			addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
		}
		if(parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)){
			addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
		}
		// 秒
		if(parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)){
			addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
		}
		if(parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)){
			addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds % 10));
		}

		curShowTimeSeconds = nextShowTimeSeconds;
	}

	updateBalls();

}

function updateBalls() {
	for(var i = 0; i < balls.length; i++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if(balls[i].y >= WINDOW_HEIGHT - RADIUS){
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			balls[i].vy = -balls[i].vy * 0.75;
		}
	}
}

function addBalls(x, y, num) {
	for(var i = 0; i < digit[num].length; i++){
		for(var j = 0; j < digit[num][i].length; j++){
			if(digit[num][i][j] == 1){
				// 注册一个小球对象
				var aBall = {
					x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
					y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
					g: 1.5 + Math.random(),
					vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
					vy: -5,
					color: colors[Math.floor(Math.random()*colors.length)]
				}
				// 将小球push到balls这个数组中
				balls.push(aBall);
			}
		}
	}
}


function render(cxt) {
	// clearRect是对矩形空间内的内容进行一次刷新操作，避免前后两次显示的数据叠加在一起
	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

	var hours = parseInt(curShowTimeSeconds / 3600);
	var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
	var seconds = parseInt(curShowTimeSeconds % 60);

	// RADIUS + 1 为半径
	// (2 * 7 + 1) * (RADIUS + 1) = 7 * 2 * (RADIUS + 1) + 1 * (RADIUS + 1)
	// 7为y轴的总数量，2 * (RADIUS + 1)为直径
	// 时
	renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt)
	renderDigit(MARGIN_LEFT + (2 * 7 + 1) * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10),cxt);
	renderDigit(MARGIN_LEFT + 120 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10),cxt);
	renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt)
	// 分
	renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt)
	renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10),cxt);
	renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt)
	// 秒
	renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt)
	renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10),cxt);

	// 绘制彩色小球
	for(var i = 0; i < balls.length; i++){
		cxt.fillStyle = balls[i].color;

		cxt.beginPath();
		cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI, true);
		cxt.closePath();

		cxt.fill();
	}


}

function renderDigit(x, y, num, cxt){

	cxt.fillStyle = "rgb(0,102,153)";

	for(var i = 0; i < digit[num].length; i++){
		for(var j = 0; j < digit[num][i].length; j++){
			if(digit[num][i][j] == 1){
				cxt.beginPath();
				cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2*Math.PI);
				cxt.closePath();

				cxt.fill();
			}
		}
	}
}