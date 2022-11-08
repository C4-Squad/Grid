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
var gs=25;
var gxs=30, gys=20;
var cxs=gxs*gs, cys=gys*gs;
var bx=0, by=0;
var cx=0, cy=0;
var clicked=false;
var clickedon=0;//1-blank 2-building 3-select
var clickedDir=0;//1-top 2-top left 3-left 4-bottom left 5-bottom 6-bottom right 7-right 8-top right
var buildingsUnlocked = ["conveyor","mine","smelter","fabricator","small storage"];
var canvas = document.createElement("CANVAS");
var ctx = canvas.getContext("2d");
canvas.width=cxs, canvas.height=cys;
document.body.appendChild(this.canvas);
canvas.style="border:1px solid #ff0000;";
canvas.onmousemove = function(event) {mm(event)};
canvas.onclick = function(event) {mc(event)};
var timeout;
function mm(e) {
  var x = e.clientX, y = e.clientY;
  bx = Math.floor((x-10)/gs), by = Math.floor((y-70)/gs);
  var cor = "Coordinates: (" + x + "," + y + ")";
  document.getElementById("cor").innerHTML = cor;
  var bcor = "Box Coordinates: (" + bx + "," + by + ")";
  document.getElementById("bcor").innerHTML = bcor;
  if(clicked == false) {
    clear();
    drawGrid();
    ctx.fillStyle = "#ff0000";
    img = new Image();
    img.src = "blue mine.svg";
    ctx.drawImage(img, bx*gs, by*gs, gs, gs);
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
    ctx.fillStyle = "#0000ff";
    ctx.fillRect((bx-m)*gs, (by-1)*gs, (buld*gs), gs);
    ctx.fillStyle = "#ff0000";
    for(i = buld; i !=0; i--) {
      ctx.fillRect((bx-m)*gs, (by-1)*gs, (i*gs), gs);
    }
  }
}

function selectg(){
  console.log("nan")
}
