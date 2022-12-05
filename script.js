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
  this.id = "iron";
  this.type = "mine";
  this.xLoc = 0;
  this.yLoc = 0;
  this.level = 2;
  this.name = "level " + this.level + " iron node";
  this.update = function() {
    ctx.fillStyle = "#55B3B4";
    ctx.fillRect((this.xLoc-0.5)*gs, (this.yLoc-0.5)*gs, (2)*gs, (2)*gs);
  }
}
//buildings
function Mine() {
  this.id = "mine";
  this.color = "grey";
  this.imgdc = "assets/grey mine dc.svg";
  this.imgc = "assets/grey mine.svg";
  this.img = new Image();
  this.connected = false;
  this.xLoc = 0;
  this.yLoc = 0;
  this.rot = 0;
  this.tier = 1;
  this.name = "tier " + this.tier + " mine";
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
    this.name = "tier " + this.tier + " mine";
    drawImage(this.img, this.xLoc, this.yLoc, imgScale, this.rot);
  }
};
function Pump() {
  this.id = "pump";
  this.color = "grey";
  this.imgdc = "assets/grey pump dc.svg";
  this.imgc = "assets/grey pump.svg";
  this.img = new Image();
  this.connected = false;
  this.xLoc = 0;
  this.yLoc = 0;
  this.rot = 0;
  this.tier = 1;
  this.name = "tier " + this.tier + " pump";
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
    this.name = "tier " + this.tier + " pump";
    drawImage(this.img, this.xLoc, this.yLoc, imgScale, this.rot);
  }
}
//vars
var i=0;
var money=100;
var gs=20;
var gxs=30, gys=15;
var ox=10, oy=195;
var ocx=0, ocy=0;
var o=0
var cxs=gxs*gs, cys=gys*gs;
var imgScale=gs/50;
var sel = 0;//0 if far left or bottom
var bx=0, by=0;
var cx=0, cy=0;
var plcRot=0;
var clicked=false;
var hoveredNode=false;
var mode="place";//place erase
var hoveredBuld="";
var hovered=false;
var clickedBuld=false;
var curBuld=0;
var clickedDir=0;//1-top 2-top left 3-left 4-bottom left 5-bottom 6-bottom right 7-right 8-top right
var extractorsUnlocked = ["mine","pump"];
var extractorsUnlockedImgs = [];
var buildingsUnlocked = ["smelter","fabricator"];
var buildingsUnlockedImgs = [];
var buildingsColored = [[],[],[],[],[]];//1-blue 2-red 3-yellow 4-purple 5-grey| 1-mine dc 2-mine c 3-pump dc 4-pump dc
var buildingsConnectedImgs = [];//mine and pump are blank
var buildingsDisconnectedImgs = [];//mine and pump are blank
var extractors = ["mine","pump"];
var buildings = ["conveyor","pipe","smelter","fabricator","filter","mixer","small storage","large storage","small tank","large tank"];
var placedObjects = [];
var selBounds = [[],[],[],[],[]];
var solidNodes = 5, liquidNodes = 5;
var nodes = [];
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
  for(i = 0; i < buildingsUnlocked.length; i ++){
    buildingsUnlockedImgs[i] = new Image();
    buildingsUnlockedImgs[i].src = "assets/grey mine.svg";
  }
  for(i = 0; i < extractorsUnlocked.length; i ++){
    if(extractorsUnlocked[i] == "mine"){
      extractorsUnlockedImgs[i] = new Image();
      extractorsUnlockedImgs[i].src = "assets/grey mine.svg";
    }else if(extractorsUnlocked[i] == "pump"){
      extractorsUnlockedImgs[i] = new Image();
      extractorsUnlockedImgs[i].src = "assets/grey pump.svg";
    }
  }
}

start();

function mm(e) {
  var x = e.clientX, y = e.clientY;
  bx = Math.floor((x-ox)/gs), by = Math.floor((y-oy)/gs);
  ocx = x-ox, ocy = y-oy;
  var cor = "Coordinates: (" + x + "," + y + ")" + "  Coordinates Offset: (" + ocx + "," + ocy + ")" + " Box Coordinates: (" + bx + "," + by + ")" + " Clicked Coordinates: (" + cx + "," + cy + ")"  + " Bounds 1 Coordinates: (X:" + selBounds[0][0] + "," + selBounds[0][1] + " Y:" + selBounds[0][2] + "," + selBounds[0][3] + ")"  + " Bounds 2 Coordinates: (X:" + selBounds[1][0] + "," + selBounds[1][1] + " Y:" + selBounds[1][2] + "," + selBounds[1][3] + ")";
  document.getElementById("cor").innerHTML = cor;
  document.getElementById("money").innerHTML = "money:$" + money;
  document.getElementById("debug2").innerHTML = buildingsUnlockedImgs;
  hovered = checkSpace(bx,by);
  if(hoveredNode == false){
    document.getElementById("debug").innerHTML = "hovering: " + hovered + " object: " + (hovered == true ? placedObjects[curBuld].name : " ")+ " X: " + (hovered == true ? placedObjects[curBuld].xLoc : 0) + " Y: " + (hovered == true ? placedObjects[curBuld].yLoc : 0) + " clicked dir: " + clickedDir;
  }else{
    document.getElementById("debug").innerHTML = "hovering: " + hovered + " object: " + (hovered == true ? nodes[curBuld].name : " ")+ " X: " + (hovered == true ? nodes[curBuld].xLoc : 0) + " Y: " + (hovered == true ? nodes[curBuld].yLoc : 0 + " clicked dir: " + clickedDir);
  }
  if(clicked == false) {
    if(hoveredNode == false){
      drawGrid(bx,by);
    }else if(hoveredNode == true){
      if(nodes[curBuld].id == "mine"){
        clear();
        ctx.drawImage(extractorsUnlockedImgs[extractorsUnlocked.find("mine")],bx*gs,by*gs,gs,gs);  
      }
    }
    //clearTimeout(timeout);
    //timeout = setTimeout(function(){clear();}, 1000);
  }else if(clicked == true && hovered == false) {
    var buld = buildingsUnlocked.length;
    var m = ((buld - 1)/2);
    if(buld % 2 == 0){
      m = 0.5 + ((buld)/2);
      o = 0.5;
    }
    o = 0;
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
      for(i = 0; i < buld; i++) {
        ctx.drawImage(selBounds[i][4],selBounds[i][0],selBounds[i][2], gs, gs);
      }
      for(i = 0; i < buld; i++) {
        if(ocx >= selBounds[i][0] && ocx < selBounds[i][1] && ocy >= selBounds[i][2] && ocy < selBounds[i][3]) {
          ctx.fillStyle = "00000050";
          ctx.fillRect((selBounds[i][0]), (selBounds[i][2]), gs, gs);
          hoveredBuld=buildingsUnlocked[i];
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
  }else{
    clicked = false;
  }
}

function mc() {
  clear();
  if (clicked == true && cx != 0 && cy != 0) {
    cx=0, cy=0;
    clicked = false;
    clear();
  }else if (clicked == false && checkSpace(bx,by) == true && hoveredNode == false && mode == "place") {
    var curTier=placedObjects[curBuld].tier;
    if(money >= 10 && curTier <  3){
      placedObjects[curBuld].tier = curTier + 1;
      placedObjects[curBuld].update();
    }
  }else if (clicked == false && mode == "place" && checkSpace(bx,by) == true && hoveredNode == true) {
    document.getElementById(" ").innerHTML = "11";
    if(nodes[curBuld].id == "mine" && extractorsUnlocked.find("mine") != undefined) {
      placedObjects[len] = new Mine();
    }else if(nodes[curBuld].id == "pump" && extractorsUnlocked.find("pump") != undefined){
      placedObjects[len] = new Pump();
    }
    placedObjects[len].xLoc = bx;
    placedObjects[len].yLoc = by;
    placedObjects[len].rot = plcRot;
    placedObjects[len].imgUp();
    placedObjects[len].update();
  }else if(clicked == false && mode == "place" && checkSpace(bx,by) == false && hoveredNode == false){
    cx = bx, cy = by;
    hoveredBuld="";
    clicked=true;
    bSel();
  }else if (clicked == true && mode == "place") {
    let len = placedObjects.length;
    placedObjects[len].xLoc = bx;
    placedObjects[len].yLoc = bx;
    placedObjects[len].rot = plcRot;
    placedObjects[len].imgUp();
    placedObjects[len].update();
  } else if (clicked == false && checkSpace(cx,cy) == true && mode == "erase") {
    delete placedObjects[curBuld];
  }
}

function checkSpace(inX,inY) {
  if(nodes.length != 0){
    for(i = 0; i < nodes.length; i++) {
      if(nodes[i] != undefined) {
        if(nodes[i].xLoc == inX && nodes[i].yLoc == inY) {
          curBuld=i;
          hoveredNode=true;
          return true;
        }
      }
    }
  }
  if(placedObjects.length != 0){
    for(i = 0; i < placedObjects.length; i++) {
      if(placedObjects[i] != undefined) {
        if(placedObjects[i].xLoc == inX && placedObjects[i].yLoc == inY) {
          curBuld=i;
          hoveredNode=false;
          return true;
        }
      }
    }
  }
  hoveredNode=false;
  return false;
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(nodes.length != 0) {
    nodes.forEach(updateObjs);
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
    o = 0.5;
  }
  o = 0;
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
    for(let i = 0; i < buld; i++) {
      if(checkSpace(cx,cy) == false) {
        selBounds[i][0] = (bx-m+i)*gs; // x1
        selBounds[i][1] = (bx-m+i+1)*gs; // x2
        selBounds[i][2] = (by-1)*gs; //y1
        selBounds[i][3] = (by)*gs; //y2
        selBounds[i][4] = buildingsUnlockedImgs[i];
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
  plcRot += 90;
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
  len = nodes.length;
  var gwx = Math.floor(Math.random() * (gxs - 0) + 0);
  var gwy = Math.floor(Math.random() * (gys - 0) + 0);
  nodes[len] = new Iron();
  nodes[len].xLoc = gwx;
  nodes[len].yLoc = gwy;
  clear();
}
