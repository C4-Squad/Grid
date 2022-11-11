/*buildings + functions
1 conveyor + move resorces
2 pipe + move fluids
3 mine + collect raw resorces
4 smelter + make refined resorces
5 fabrictor + make solid products
6 pump + collect crude fluids
7 filter + make refined fluids
8 mixer + make fluid products
9 constructor + make products with fluids and solids
10 small and large storage + stores resorces
11 small and large tank + stores fluids
*/
var gs=50;
var gxs=15, gys=10;
var ox=9, oy=111;
var cxs=gxs*gs, cys=gys*gs;
var bx=0, by=0;
var cx=0, cy=0;
var clicked=false;
var clickedon=0;//1-blank 2-building 3-select
var clickedDir=0;//1-top 2-top left 3-left 4-bottom left 5-bottom 6-bottom right 7-right 8-top right
var buildingsUnlocked = ["mine","pump"];
var buildingsColored = [[],[],[],[]];//1-blue 2-red 3-yellow 4-purple 5-grey| 1-mine dc 2-mine c 3-pump dc 4-pump dc
var buildingsConnectedImgs = [];//mine and pump are blank
var buildingsDisconnectedImgs = [];//mine and pump are blank
var buildings = ["conveyor","pipe","mine","smelter","fabricator","pump","filter","mixer","small storage","large storage","small tank","large tank"];
var canvas = document.createElement("CANVAS");
var ctx = canvas.getContext("2d");
canvas.width=cxs, canvas.height=cys;
document.body.appendChild(this.canvas);
canvas.style="border:1px solid #ff0000;";
canvas.onmousemove = function(event) {mm(event)};
canvas.onclick = function(event) {mc(event)};
var timeout;

function start() {
  buildingsColored[0][0] = new Image();
  buildingsColored[0][0].src = "assets/blue mine dc.svg";
  buildingsColored[0][1] = new Image();
  buildingsColored[0][1].src = "assets/blue mine.svg";
  buildingsColored[1][0] = new Image();
  buildingsColored[1][0].src = "assets/red mine dc.svg";
  buildingsColored[1][1] = new Image();
  buildingsColored[1][1].src = "assets/red mine.svg";
  buildingsColored[2][0] = new Image();
  buildingsColored[2][0].src = "assets/yellow mine dc.svg";
  buildingsColored[2][1] = new Image();
  buildingsColored[2][1].src = "assets/yellow mine.svg";
  buildingsColored[3][0] = new Image();
  buildingsColored[3][0].src = "assets/purple mine dc.svg";
  buildingsColored[3][1] = new Image();
  buildingsColored[3][1].src = "assets/purple mine.svg";
  buildingsColored[3][0] = new Image();
  buildingsColored[3][0].src = "assets/grey mine dc.svg";
  buildingsColored[4][1] = new Image();
  buildingsColored[4][1].src = "assets/grey mine.svg";
  buildingsColored[3][3] = new Image();
  buildingsColored[3][3].src = "assets/grey pump dc.svg";
  buildingsColored[4][4] = new Image();
  buildingsColored[4][4].src = "assets/grey pump.svg";
  for (let i = 0; i != buildingsUnlocked.length; i++) {
    let curBuld = buildingsUnlocked[i];
    if(curBuld.equals("mine")) {
      buildingsUnlocked[i] = buildingsColored[3][0];
    }else if(curBuld.equals("pump")) {
      buildingsUnlocked[i] = buildingsColored[3][3];
    }
  }
}

start();

function mm(e) {
  var x = e.clientX, y = e.clientY;
  bx = Math.floor((x-ox)/gs), by = Math.floor((y-oy)/gs);
  var cor = "Coordinates: (" + x + "," + y + ")";
  document.getElementById("cor").innerHTML = cor;
  var bcor = "Box Coordinates: (" + bx + "," + by + ")";
  document.getElementById("bcor").innerHTML = bcor;
  document.getElementById("debug").innerHTML = "buildings: " + buildingsUnlocked;
  if(clicked == false) {
    clear();
    drawGrid();
    ctx.fillStyle = "#ff0000";
    ctx.drawImage(buildingsColored[0][0], bx*gs, by*gs, gs, gs);
    //clearTimeout(timeout);
    //timeout = setTimeout(function(){clear();}, 1000);
  }else if(clicked == true) {
    var buld = buildingsUnlocked.length;
    var m = ((buld - 1)/2);
    if(buld % 2 == 0){
      m = 0.5 + ((buld)/2)
    }
    if(clickedDir==1) {
      //        right            left              down            up
      if(bx > (cx + m + 1) || bx < (cx - m - 1) || by > (cy + 1) || by < (cy - 2)) {
        clicked = false;
      }
    }else if(clickedDir==3) {
      //        right            left              down            up
      if(bx > (cx + 2) || bx < (cx - 1) || by > (cy + m + 1) || by < (cy - m - 1)) {
        clicked = false;
      }
    }else if(clickedDir==5) {
      //        right            left              down            up
      if(bx > (cx + m + 1) || bx < (cx - m - 1) || by > (cy + 1) || by < (cy - 1)) {
        clicked = false;
      }
    }else if(clickedDir==7) {
      //        right            left              down            up
      if(bx > (cx + 1) || bx < (cx - 2) || by > (cy + m + 1) || by < (cy - m - 1)) {
        clicked = false;
      }
    }
  }
}
function mc(e) {
  clear();
  drawGrid();
  if (clicked == false) {
    clicked=true
    cx=bx, cy=by;
    bSel();
  } else if (clicked == true) {
    clicked = false;
    clear();
    drawGrid();
  }
}
function clear() {
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

function drawGrid(){
  for (let i=1; i<gxs; i++) {
    ctx.moveTo(i*gs, 0);
    ctx.lineTo(i*gs, cys);
  }
  for (let j=1; j<gys; j++) {
    ctx.moveTo(0, j*gs);
    ctx.lineTo(cxs, j*gs);
  }
  ctx.stroke();
}

function distB(y){
  return gys - y;
}

function distR(x){
  return gxs - x;
}

function bSel() {
  var buld = buildingsUnlocked.length;
  var m = ((buld - 1)/2);
  if(buld % 2 == 0){
    m = -0.5 + ((buld)/2)
  }
  //bottom left
  if(bx <= m-1 && by >= gys-m-1){
    clickedDir=4;
    ctx.fillStyle = "#000000";
    ctx.fillRect((bx+1)*gs, (by-buld+distB(by))*gs, gs, (buld*gs));
    ctx.fillStyle = "#ff0000";
  //top left
  }else if(bx <= m-1 && by <= m){
    clickedDir=2;
    ctx.fillStyle = "#000000";
    ctx.fillRect((bx+1)*gs, (by-by)*gs, gs, (buld*gs));
    ctx.fillStyle = "#ff0000";
  //top right
  }else if(bx >= gys-m-1 && by <= m){
    clickedDir=8
    ctx.fillStyle = "#000000";
    ctx.fillRect((bx-1)*gs, (by-by)*gs, gs, (buld*gs));
    ctx.fillStyle = "#ff0000";
  //bottom right
  }else if(bx >= gys-m-1 && by >= gys-m-1){
    clickedDir=6;
    ctx.fillStyle = "#000000";
    ctx.fillRect((bx-1)*gs, (by-buld+distB(by))*gs, gs, (buld*gs));
    ctx.fillStyle = "#ff0000";
  //right
  }else if(bx >= gxs-m-1) {
    clickedDir=7;
    ctx.fillStyle = "#00ffff";
    ctx.fillRect((bx-1)*gs, (by-m)*gs, gs,(buld*gs));
    ctx.fillStyle = "#ff0000";
  //left
  }else if(bx <= m) {
    clickedDir=3;
    ctx.fillStyle = "#ffff00";
    ctx.fillRect((bx+1)*gs, (by-m)*gs, gs, (buld*gs));
    ctx.fillStyle = "#ff0000";
  //up
  }else if(by <= 2) {
    clickedDir=1;
    ctx.fillStyle = "#00ff00";
    ctx.fillRect((bx-m)*gs, (by+1)*gs, (buld*gs), gs);
    ctx.fillStyle = "#ff0000";
  //down
  }else if(by >= 2) {
    clickedDir=5;
    for(let j = buld; j != 0; j--) {
      var rgb = rgbToHex(j*25,j*25,j*25);
      ctx.fillStyle = rgb;
      document.getElementById("debug").innerHTML = "hex: " + rgb;
      ctx.fillRect((bx-m+j-1)*gs, (by-1)*gs, gs, gs);
      ctx.drawImage(buildingsUnlocked[j],(bx-m+j-1)*gs, (by-1)*gs, gs, gs)
    }
  }
}

function rgbToHex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}