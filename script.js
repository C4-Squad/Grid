//vars

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.lineCap = "round";
ctx.lineJoin = "round";
canvas.width=cxs, canvas.height=cys;
canvas.onmousemove = function(event) {mm(event)};
canvas.onclick = function(event) {mc(event)};
document.getElementById("canvas").innerHTML = canvas;
requestAnimationFrame(gameLoopF);

function gameLoopF(timeStamp){
  clear();
  cor = "Coordinates: (" + x + "," + y + ")" + "  Coordinates Offset: (" + ocx + "," + ocy + ")" + " Box Coordinates: (" + bx + "," + by + ")" + " Clicked Coordinates: (" + cx + "," + cy + ")";
  document.getElementById("cor").innerHTML = cor;
  console.log(cor);
  requestAnimationFrame(gameLoopF);
}

function start() {
}

start();

//mouse move
function mm(e) {
  x = e.clientX, y = e.clientY;
}

//mouse click
function mc(e) {
  x = e.clientX, y = e.clientY;
  ctx.moveTo(x, y);
  ctx.lineTo(x+10, y+10);
}