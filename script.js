/*buildings + functions - btn id
1 conveyor + move resorces - buld1
2 pipe + move fluids - buld8
3 mine + collect raw resorces - buld2
4 smelter + make refined resorces - buld3
5 fabrictor + make solid products - buld4
6 pump + collect crude fluids - buld9
7 filter + make refined fluids - buld10
8 mixer + make fluid products - buld11
9 constructor + make products with fluids and solids - buld7
10 small storage + stores resorces - buld5
11 large storage + stores resorces - buld6
12 small tank + stores fluids - buld12
13 large tank + stores fluids - buld13
14 hub + sell resorces and unlock buildings - buld14
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
  this.offset1 = 0;
  this.offset2 = 1;
  this.xLoc = 0;
  this.yLoc = 0;
  this.level = 2;
  this.name = "level " + this.level + " iron node";
  this.update = function() {
    ctx.fillStyle = "#55B3B4";
    ctx.fillRect((this.xLoc-this.offset1)*gs, (this.yLoc-this.offset1)*gs, (this.offset2)*gs, (this.offset2)*gs);
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
var ox=9, oy=214;
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
var buildings = ["conveyor","pipe","smelter","fabricator","filter","mixer","small storage","large storage"  ,"small tank","large tank"];
var selBuldOrder = ["conveyor","mine","smelter","fabricator","small storage","large storage","constructor"]
var placedObjects = [];
var selObject = 0
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

function myFunction() {
  document.getElementById("demo").innerHTML = ages.find(checkAge);
}

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
  document.getElementById("debug2").innerHTML = extractorsUnlockedImgs;
  hovered = checkSpace(bx,by);
  if(hoveredNode == false){
    document.getElementById("debug").innerHTML = "hovering: " + hovered + " object: " + (hovered == true ? placedObjects[curBuld].name : " ")+ " X: " + (hovered == true ? placedObjects[curBuld].xLoc : 0) + " Y: " + (hovered == true ? placedObjects[curBuld].yLoc : 0) + " clicked dir: " + clickedDir;
  }else{
    document.getElementById("debug").innerHTML = "hovering: " + hovered + " object: " + (hovered == true ? nodes[curBuld].name : " ") + " X: " + (hovered == true ? nodes[curBuld].xLoc : 0) + " Y: " + (hovered == true ? nodes[curBuld].yLoc : 0 + " clicked dir: " + clickedDir);
  }
  if(clicked == false) {
    if(hoveredNode == false){
      drawGrid(bx,by);
    }else if(hoveredNode == true){
      clear();
      if(nodes[curBuld].type == "mine"){
        ctx.drawImage(extractorsUnlockedImgs[extractorsUnlocked.includes("mine")],bx*gs,by*gs,gs,gs);  
      }else if(nodes[curBuld].type == "pump"){
        ctx.drawImage(extractorsUnlockedImgs[extractorsUnlocked.includes("pump")],bx*gs,by*gs,gs,gs);  
      }
    }
    //clearTimeout(timeout);
    //timeout = setTimeout(function(){clear();}, 1000);
  }
}

function mc() {
  clear();
  if (checkSpace(bx,by) == true && hoveredNode == false && mode == "place") {
    var curTier=placedObjects[curBuld].tier;
    if(money >= 10 && curTier <  3){
      placedObjects[curBuld].tier = curTier + 1;
      placedObjects[curBuld].update();
    }
  }else if (mode == "place" && checkSpace(bx,by) == true && hoveredNode == true) {
    document.getElementById("debug2").innerHTML = "1";
    if(nodes[curBuld].type == "mine" && extractorsUnlocked.includes("mine") == true) {
      document.getElementById("debug2").innerHTML = "2";
      placedObjects[len] = new Mine();
    }else if(nodes[curBuld].type == "pump" && extractorsUnlocked.includes("pump") == true){
      document.getElementById("debug2").innerHTML = "22";
      placedObjects[len] = new Pump();
    }
    document.getElementById("debug2").innerHTML = "3";
    placedObjects[len].xLoc = bx;
    placedObjects[len].yLoc = by;
    placedObjects[len].rot = plcRot;
    placedObjects[len].imgUp();
    placedObjects[len].update();
    document.getElementById("debug2").innerHTML = "4";
  }else if(mode == "place" && checkSpace(bx,by) == false && hoveredNode == false){
    cx = bx, cy = by;
    hoveredBuld="";
  }else if (mode == "place") {
    let len = placedObjects.length;
    placedObjects[len].xLoc = bx;
    placedObjects[len].yLoc = bx;
    placedObjects[len].rot = plcRot;
    placedObjects[len].imgUp();
    placedObjects[len].update();
  } else if (checkSpace(cx,cy) == true && mode == "erase") {
    delete placedObjects[curBuld];
  }
}

function checkSpace(inX,inY) {
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

function setbuld(btn){
}