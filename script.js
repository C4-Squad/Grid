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
5 tiers
*/
//buildings
function Mine() {
  this.color = "grey";
  this.imgdc = "assets/grey mine dc.svg";
  this.imgc = "assets/grey mine.svg";
  this.img = new Image();
  this.connected = false;
  this.xLoc = 0;
  this.yLoc = 0;
  this.tier = 1;
  this.colorUp = function() {
    this.imgdc = "assets/" + this.color + " mine dc.svg";
    this.imgdc = "assets/" + this.color + " mine.svg";
  },
  this.imgUp = function(){
    if(this.connected) {
      this.img.src = this.imgc;
    }else{
      this.img.src = this.imgdc;
    }
  },
 this.update = function() {
    ctx.drawImage(this.img, this.xLoc*gs, this.yLoc*gs, gs, gs);
  }
};
function Pump() {
  this.color = "grey";
  this.imgdc = "assets/grey pump dc.svg";
  this.imgc = "assets/grey pump.svg";
  this.img = new Image();
  this.connected = false;
  this.xLoc = 0;
  this.yLoc = 0;
  this.tier = 1;
  this.colorUp = function() {
    this.imgdc = "assets/" + this.color + " pump dc.svg";
    this.imgdc = "assets/" + this.color + " pump.svg";
  },
  this.imgUp = function(){
    if(this.connected) {
      this.img.src = this.imgc;
    }else{
      this.img.src = this.imgdc;
    }
  },
 this.update = function() {
    ctx.drawImage(this.img, this.xLoc*gs, this.yLoc*gs, gs, gs);
  }
}
//vars
var gs=50;
var gxs=20, gys=10;
var ox=10, oy=120;
var ocx=0, ocy=0;
var cxs=gxs*gs, cys=gys*gs;
var sel = 0;//0 if far left or bottom
var bx=0, by=0;
var cx=0, cy=0;
var clicked=false;
var hoveredBuld="";
var clickedon=0;//1-blank 2-building 3-select
var clickedDir=0;//1-top 2-top left 3-left 4-bottom left 5-bottom 6-bottom right 7-right 8-top right
var buildingsUnlocked = ["mine","pump"];
var buildingsUnlockedImgs = [new Image(), new Image()];
var buildingsColored = [[],[],[],[],[]];//1-blue 2-red 3-yellow 4-purple 5-grey| 1-mine dc 2-mine c 3-pump dc 4-pump dc
var buildingsConnectedImgs = [];//mine and pump are blank
var buildingsDisconnectedImgs = [];//mine and pump are blank
var buildings = ["conveyor","pipe","mine","smelter","fabricator","pump","filter","mixer","small storage","large storage","small tank","large tank"];
var placedObjects = [];
var selBounds = [[],[],[]];
var canvas = document.createElement("CANVAS");
var ctx = canvas.getContext("2d");
canvas.width=cxs, canvas.height=cys;
document.body.appendChild(this.canvas);
canvas.style="border:1px solid #ff0000;";
canvas.onmousemove = function(event) {mm(event)};
canvas.onclick = function(event) {mc(event)};
var timeout;

function setImgs() {
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
  buildingsColored[4][0] = new Image();
  buildingsColored[4][0].src = "assets/grey mine dc.svg";
  buildingsColored[4][1] = new Image();
  buildingsColored[4][1].src = "assets/grey mine.svg";
  buildingsColored[4][2] = new Image();
  buildingsColored[4][2].src = "assets/grey pump dc.svg";
  buildingsColored[4][3] = new Image();
  buildingsColored[4][3].src = "assets/grey pump.svg";
}

function imgs(item, index) {
  if(item == "mine") {
    buildingsUnlockedImgs[index].src = "assets/grey mine dc.svg";
  }else if(item == "pump") {
    buildingsUnlockedImgs[index].src = "assets/grey pump dc.svg";
  }
}

setImgs();
buildingsUnlocked.forEach(imgs);

function mm(e) {
  var x = e.clientX, y = e.clientY;
  bx = Math.floor((x-ox)/gs), by = Math.floor((y-oy)/gs);
  ocx = x-ox, ocy = y-oy;
  var cor = "Coordinates: (" + x + "," + y + ")" + "  Coordinates Offset: (" + ocx + "," + ocy + ")" + " Box Coordinates: (" + bx + "," + by + ")";
  document.getElementById("cor").innerHTML = cor;
  document.getElementById("bcor").innerHTML = placedObjects.length;
  if(clicked == false) {
    clear();
    drawGrid();
    ctx.drawImage(buildingsColored[4][0], bx*gs, by*gs, gs, gs);
    //clearTimeout(timeout);
    //timeout = setTimeout(function(){clear();}, 1000);
  }else if(clicked == true) {
    var buld = buildingsUnlocked.length;
    var m = ((buld - 1)/2);
    if(buld % 2 == 0){
      m = 0.5 + ((buld)/2);
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
      for(let j = buld; j != 0; j--) {
        if(ocx >= selBounds[j-1][0] && ocx <= selBounds[j-1][1] && ocy >= selBounds[j-1][2] && ocy <= selBounds[j-1][3]) {
          ctx.fillRect(selBounds[0], selBounds[2], gs, gs);
          hoveredBuld="mine";
          break;
        }else{
          hoveredBuld="";
        }
      }
      //        right            left              down            up
      if(bx > (cx + m + 1) || bx < (cx - m - 1) || by > (cy + 1) || by < (cy - 2)) {
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
    hoveredBuld="";
    clicked=true;
    cx=bx, cy=by;
    bSel();
  } else if (clicked == true && hoveredBuld != "") {
    let len = placedObjects.length;
    placedObjects[len] = new Mine();
    placedObjects[len].xLoc = cx;
    placedObjects[len].yLoc = cy;
    placedObjects[len].imgUp();
    placedObjects[len].update();
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
  ctx.fillStyle = "#ffffff";
  for (let xx=1; xx<gxs; xx++) {
    ctx.moveTo(xx*gs, 0);
    ctx.lineTo(xx*gs, cys);
  }
  for (let yy=1; yy<gys; yy++) {
    ctx.moveTo(0, yy*gs);
    ctx.lineTo(cxs, yy*gs);
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
    m = -0.5 + ((buld)/2);
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
      ctx.fillRect((bx-m+j-1)*gs, (by-1)*gs, gs, gs);
      ctx.drawImage(buildingsUnlockedImgs[j-1],(bx-m+j-1)*gs, (by-1)*gs, gs, gs);
      selBounds[j-1][0] = (bx-m+j-1)*gs; // x1
      selBounds[j-1][1] = ((bx-m+j-1)*gs)+gs; // x2
      selBounds[j-1][2] = (by-1)*gs; //y1
      selBounds[j-1][3] = ((by-1)*gs)+gs; //y2
    }
  }
}

function rgbToHex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}