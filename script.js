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
12 hub + sell resorces and unlock buildings
3 tiers | mines and pumps only
*/
/*resorces + buildings - tier required
1 iron + mine - 1
2 copper + mine - 1
3 bronze + mine - 2
4 quarts + mine - 3
1 water + pump - 1
2 oil + pump - 1
3 petroleum + pump - 2
4 nitrogen + pump - 3
3 puritys | 1 impure 2 normal 3 pure
*/
/*colors
blue #55B3B4
red #E53838
yellow #F6B128
purple #B26CB2
*/
//nodes
function Iron() {
  this.xLoc = 0;
  this.yLoc = 0;
  this.level = 2;
  this.name = "level " + this.level + " iron node";
  this.update = function() {
    ctx.fillStyle = "#55B3B4";
    ctx.fillRect((this.xLoc-0.5)*gs, (this.yLoc-0.5)*gs, gs*2, gs*2);
  }
}
//buildings
function Mine() {
  this.color = "grey";
  this.imgdc = "assets/grey mine dc.svg";
  this.imgc = "assets/grey mine.svg";
  this.img = new Image();
  this.connected = false;
  this.xLoc = 0;
  this.yLoc = 0;
  this.rot = 0;
  this.tier = 1;
  this.name = "teir " + this.tier + " mine";
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
    drawImage(this.img, this.xLoc, this.yLoc, imgScale, this.rot);
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
  this.rot = 0;
  this.tier = 1;
  this.name = "teir " + this.tier + " pump";
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
    drawImage(this.img, this.xLoc, this.yLoc, imgScale, this.rot);
  }
}
//vars
var money=100;
var gs=20;
var gxs=30, gys=15;
var ox=10, oy=155;
var ocx=0, ocy=0;
var cxs=gxs*gs, cys=gys*gs;
var imgScale=gs/50;
var sel = 0;//0 if far left or bottom
var bx=0, by=0;
var cx=0, cy=0;
var plcRot=0;
var clicked=false;
var mode="place";//place erase
var hoveredBuld="";
var hovered=false;
var clickedBuld=false;
var curBuld=0;
var clickedDir=0;//1-top 2-top left 3-left 4-bottom left 5-bottom 6-bottom right 7-right 8-top right
var buildingsUnlocked = ["mine","pump"];
var buildingsUnlockedImgs = [new Image(), new Image()];
var buildingsColored = [[],[],[],[],[]];//1-blue 2-red 3-yellow 4-purple 5-grey| 1-mine dc 2-mine c 3-pump dc 4-pump dc
var buildingsConnectedImgs = [];//mine and pump are blank
var buildingsDisconnectedImgs = [];//mine and pump are blank
var buildings = ["conveyor","pipe","mine","smelter","fabricator","pump","filter","mixer","small storage","large storage","small tank","large tank"];
var placedObjects = [];
var placedObjectsX = [];
var placedObjectsY = [];
var selBounds = [[],[],[]];
var solidNodes = 5, liquidNodes = 5;
var underSolids = [];
var aboveSolids = [];
var underLiquids = [];
var aboveLiquids = [];
var timeout;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.lineCap = "round";
ctx.lineJoin = "round";

canvas.width=cxs, canvas.height=cys;
canvas.onmousemove = function(event) {mm(event)};
canvas.onclick = function(event) {mc(event)};
document.getElementById("canvas").innerHTML = canvas;

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

function start() {
}

function imgs(item, index) {
  if(item == "mine") {
    buildingsUnlockedImgs[index].src = "assets/grey mine dc.svg";
  }else if(item == "pump") {
    buildingsUnlockedImgs[index].src = "assets/grey pump dc.svg";
  }
}

start();
buildingsUnlocked.forEach(imgs);

function mm(e) {
  var x = e.clientX, y = e.clientY;
  bx = Math.floor((x-ox)/gs), by = Math.floor((y-oy)/gs);
  ocx = x-ox, ocy = y-oy;
  var cor = "Coordinates: (" + x + "," + y + ")" + "  Coordinates Offset: (" + ocx + "," + ocy + ")" + " Box Coordinates: (" + bx + "," + by + ")";
  document.getElementById("cor").innerHTML = cor;
  document.getElementById("money").innerHTML = "money:$" + money;
  hovered = checkSpace(bx,by);
  document.getElementById("debug2").innerHTML = "above solids: " + aboveSolids;
  document.getElementById("debug").innerHTML = "hovering: " + hovered + " object: " + (hovered == true ? placedObjects[curBuld].name : " ")+ " X: " + (hovered == true ? placedObjects[curBuld].xLoc : 0) + " Y: " + (hovered == true ? placedObjects[curBuld].yLoc : 0);
  if(clicked == false) {
    drawGrid(bx,by);
    //clearTimeout(timeout);
    //timeout = setTimeout(function(){clear();}, 1000);
  }else if(clicked == true && hovered == false) {
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
      drawGrid(cx,cy);
      for(let i = buld; i != 0; i--) {
        ctx.drawImage(selBounds[i-1][4],selBounds[i-1][0],selBounds[i-1][2], gs, gs);
      }
      for(let j = buld; j != 0; j--) {
        if(ocx >= selBounds[j-1][0] && ocx <= selBounds[j-1][1] && ocy >= selBounds[j-1][2] && ocy <= selBounds[j-1][3]) {
          if(checkSpace(cx,cy) == false && clicked == true) {
            ctx.fillStyle = "00000050";
            ctx.fillRect(selBounds[j-1][0], selBounds[j-1][2], gs, gs);
            hoveredBuld=buildingsUnlocked[j-1];
            break;
          }
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
  }else{
    clicked = false;
  }
}

function mc() {
  clear();
  if (clicked == false && mode == "place") {
    cx = bx, cy = by;
    hoveredBuld="";
    clicked=true;
    bSel();
  } else if (clicked == false && checkSpace(cx,cy) == true && mode == "place") {
    var curTier=placedObjects[curBuld].tier;
    if(money >= 10 && curTier <= 5){
      placedObjects[curBuld].tier = curTier + 1;
    }
  } else if (clicked == true && hoveredBuld != "" && mode == "place") {
    let len = placedObjects.length;
    if(hoveredBuld=="mine") {
      placedObjects[len] = new Mine();
    }else if(hoveredBuld=="pump"){
      placedObjects[len] = new Pump();
    }
    placedObjects[len].xLoc = cx;
    placedObjects[len].yLoc = cy;
    placedObjects[len].rot = plcRot;
    placedObjects[len].imgUp();
    placedObjects[len].update();
    placedObjectsX[len] = cx;
    placedObjectsY[len] = cy;
  } else if (clicked == false && checkSpace(cx,cy) == true && mode == "erase") {
    delete placedObjects[curBuld];
    delete placedObjectsX[curBuld];
    delete placedObjectsY[curBuld];
  } else if (clicked == true) {
    cx=0, cy=0;
    clicked = false;
    clear();
  }
}

function checkSpace(inX,inY) {
  if(placedObjects.length != 0){
    for(i = 0; i < placedObjects.length; i++) {
      if(placedObjects[i] != undefined) {
        if(placedObjects[i].xLoc == inX && placedObjects[i].yLoc == inY) {
          curBuld=i;
          return true;
        }
      }
    }
  }else if(aboveSolids.length != 0){
    for(i = 0; i < aboveSolids.length; i++) {
      if(aboveSolids[i] != undefined) {
        if(aboveSolids[i].xLoc == inX && aboveSolids[i].yLoc == inY) {
          curBuld=i;
          return true;
        }
      }
    }
  }else if(underSolids.length != 0){
    for(i = 0; i < underSolids.length; i++) {
      if(underSolids[i] != undefined) {
        if(underSolids[i].xLoc == inX && underSolids[i].yLoc == inY) {
          curBuld=i;
          return true;
        }
      }
    }
  }
  return false;
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(aboveSolids.length != 0) {
    aboveSolids.forEach(updateObjs);
  }
  if(underSolids.length != 0) {
    underSolids.forEach(updateObjs);
  }
  if(aboveLiquids.length != 0) {
    aboveLiquids.forEach(updateObjs);
  }
  if(underLiquids.length != 0) {
    underSolids.forEach(updateObjs);
  }
  if(placedObjects.length != 0) {
    placedObjects.forEach(updateObjs);
  }
}

function updateObjs(item) {
  item.update();
}

function drawGrid(x,y){
  clear();
  ctx.beginPath();
  ctx.moveTo((x)*gs, (y-0.5)*gs);
  ctx.lineTo((x)*gs, (y+1.5)*gs);
  ctx.moveTo((x+1)*gs, (y-0.5)*gs);
  ctx.lineTo((x+1)*gs, (y+1.5)*gs);
  ctx.moveTo((x-0.5)*gs, y*gs);
  ctx.lineTo((x+1.5)*gs, y*gs);
  ctx.moveTo((x-0.5)*gs, (y+1)*gs);
  ctx.lineTo((x+1.5)*gs, (y+1)*gs);
  ctx.strokeStyle = "#00000050";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc((x+0.5)*gs, (y+0.5)*gs, gs/2-5, 0, 2 * Math.PI);
  ctx.fillStyle = "#00000050";
  ctx.fill();
}

function distB(y){
  return gys - y;
}

function distR(x){
  return gxs - x;
}

function bSel() {
  drawGrid(bx,by);
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
  //top right
  }else if(bx >= gys-m-1 && by <= m){
    clickedDir=8
    ctx.fillStyle = "#000000";
    ctx.fillRect((bx-1)*gs, (by-by)*gs, gs, (buld*gs));
  //bottom right
  }else if(bx >= gys-m-1 && by >= gys-m-1){
    clickedDir=6;
    ctx.fillStyle = "#000000";
    ctx.fillRect((bx-1)*gs, (by-buld+distB(by))*gs, gs, (buld*gs));
  //right
  }else if(bx >= gxs-m-1) {
    clickedDir=7;
    ctx.fillStyle = "#00ffff";
    ctx.fillRect((bx-1)*gs, (by-m)*gs, gs,(buld*gs));
  //left
  }else if(bx <= m) {
    clickedDir=3;
    ctx.fillStyle = "#ffff00";
    ctx.fillRect((bx+1)*gs, (by-m)*gs, gs, (buld*gs));
  //up
  }else if(by <= 2) {
    clickedDir=1;
    ctx.fillStyle = "#00ff00";
    ctx.fillRect((bx-m)*gs, (by+1)*gs, (buld*gs), gs);
  //down
  }else if(by >= 2) {
    clickedDir=5;
    for(let j = buld; j != 0; j--) {
      if(checkSpace(bx,by) == false) {
        selBounds[j-1][0] = (bx-m+j-1)*gs; // x1
        selBounds[j-1][1] = ((bx-m+j-1)*gs)+gs; // x2
        selBounds[j-1][2] = (by-1)*gs; //y1
        selBounds[j-1][3] = ((by-1)*gs)+gs; //y2
        selBounds[j-1][4] = buildingsUnlockedImgs[j-1]
      }
    }
  }
}

function rgbToHex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

function erase() {
  if(mode == "place"){
    document.getElementById("b1").innerHTML = "erase";
    mode = "erase";
  }else if(mode == "erase") {
    document.getElementById("b1").innerHTML = "place";
    mode = "place";
  }
}

function rt() {
  plcRot += 90; // add 90 degrees, you can change this as you want
  if (plcRot === 360) { 
    plcRot = 0;
  }
}

function drawImage(image, x, y, scale, rotation){
  ctx.setTransform(scale, 0, 0, scale, (x*gs)+(gs/2), (y*gs)+(gs/2));
  ctx.rotate(rotation * (Math.PI/180));
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  ctx.setTransform(1,0,0,1,0,0);
} 

function generateWorld() {
  len = aboveSolids.length;
  aboveSolids[len] = new Iron();
  aboveSolids[len].xLoc = maht.ran;
  aboveSolids[len].yLoc = 5;
}
