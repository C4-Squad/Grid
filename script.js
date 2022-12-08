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
3 limestone + mine - 2
4 quarts + mine - 3
1 water + pump - 1
2 oil + pump - 1
3 petroleum + pump - 2
4 nitrogen + pump - 3
3 puritys | 1 impure 2 normal 3 pure
*/
/*colors + solid resorce - liquid resorce
blue #55B3B4 + iron - water
red #E53838 + copper - oil
yellow #F6B128 + limestone - petroleum
purple #B26CB2 + quarts - nitrogen
*/
//nodes
function Iron() {
  this.id = "iron";
  this.type = "mine";
  this.colorVal = "#55B3B4";
  this.color = "blue";
  this.output = 10; //per second
  this.offset1 = 0;
  this.offset2 = 1;
  this.xLoc = 0;
  this.yLoc = 0;
  this.tier = 1;
  this.level = 2;
  this.name = "level " + this.level + " " + this.id + " node";
  this.update = function() {
    ctx.fillStyle = this.colorVal;
    ctx.fillRect((this.xLoc-this.offset1)*gs, (this.yLoc-this.offset1)*gs, (this.offset2)*gs, (this.offset2)*gs);
  }
}
function Copper() {
  this.id = "copper";
  this.type = "mine";
  this.colorVal = "#E53838";
  this.color = "red";
  this.output = 10; //per second
  this.offset1 = 0;
  this.offset2 = 1;
  this.xLoc = 0;
  this.yLoc = 0;
  this.tier = 1;
  this.level = 2;
  this.name = "level " + this.level + " " + this.id + " node";
  this.update = function() {
    ctx.fillStyle = this.colorVal;
    ctx.fillRect((this.xLoc-this.offset1)*gs, (this.yLoc-this.offset1)*gs, (this.offset2)*gs, (this.offset2)*gs);
  }
}
function Limestone() {
  this.id = "limestone";
  this.type = "mine";
  this.colorVal = "#F6B128";
  this.color = "yellow";
  this.output = 10; //per second
  this.offset1 = 0;
  this.offset2 = 1;
  this.xLoc = 0;
  this.yLoc = 0;
  this.tier = 2;
  this.level = 2;
  this.name = "level " + this.level + " " + this.id + " node";
  this.update = function() {
    ctx.fillStyle = this.colorVal;
    ctx.fillRect((this.xLoc-this.offset1)*gs, (this.yLoc-this.offset1)*gs, (this.offset2)*gs, (this.offset2)*gs);
  }
}
function Quarts() {
  this.id = "quarts";
  this.type = "mine";
  this.colorVal = "#B26CB2";
  this.color = "purple";
  this.output = 10; //per second
  this.offset1 = 0;
  this.offset2 = 1;
  this.xLoc = 0;
  this.yLoc = 0;
  this.tier = 3;
  this.level = 2;
  this.name = "level " + this.level + " " + this.id + " node";
  this.update = function() {
    ctx.fillStyle = this.colorVal;
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
  this.node = 0;
  this.working = false;
  this.name = "tier " + this.tier + " " + this.color + " " + this.id;
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
    if(nodes[this.node].tier <= this.tier){
      this.running = true;
    }
    this.name = (this.running == true ? "running " : "not running ") + "tier " + this.tier + " " + this.color + " " + this.id;
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
  this.node = 0;
  this.running = false;
  this.name = "tier " + this.tier + " " + this.color + " " + this.id;
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
    if(nodes[this.node].tier <= this.tier){
      this.running = true;
    }
    this.name = (this.running == true ? "running " : "not running ") + "tier " + this.tier + " " + this.color + " " + this.id;
    drawImage(this.img, this.xLoc, this.yLoc, imgScale, this.rot);
  }
}
//vars
var i=0;
var money=100;
var gs=15;
var gxs=40, gys=20;
var ox=9, oy=49;
var ocx=0, ocy=0;
var x=0, y=0;
var gwx=0, gwy=0;
var o=0
var cxs=gxs*gs, cys=gys*gs;
var imgScale=gs/50;
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
var buildings = ["conveyor","pipe","smelter","fabricator","filter","mixer","small storage","large storage","small tank","large tank","hub"];
var selBuldOrder = ["conveyor","mine","smelter","fabricator","small storage","large storage","constructor","pipe","pump","filter","mixer","small tank","large tank","hub"]
var placedObjects = [];
var selObject;
var solidNodes = 2;
var liquidNodes = 2;
var nodes = [];
var cor;
var debug = false;
btn = "";
var showGrid = true;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.lineCap = "round";
ctx.lineJoin = "round";
canvas.width=cxs, canvas.height=cys;
canvas.onmousemove = function(event) {mm(event)};
canvas.onclick = function(event) {mc(event)};
document.getElementById("canvas").innerHTML = canvas;
requestAnimationFrame(gameLoopF);
var timeout;
gameLoopS();

function gameLoopS(){
  btn = "";
  for(i = 1; i <= 14; i++){
    btn = "buld" + i.toString();
    if(buildingsUnlocked.includes(selBuldOrder[i-1]) == true || extractorsUnlocked.includes(selBuldOrder[i-1]) == true){
      document.getElementById(btn).style.color = "#ffffff";
    }else{
      document.getElementById(btn).style.color = "#000000";
    }
  }

  timeout = setTimeout(function(){gameLoopS();}, 1000);
}

function gameLoopF(timeStamp){
  clear();
  if(showGrid == true){
    drawGrid(bx,by)
  }
  document.getElementById("building").innerHTML = selObject;
  document.getElementById("money").innerHTML = "money:$" + money;

  cor = "Coordinates: (" + x + "," + y + ")" + "  Coordinates Offset: (" + ocx + "," + ocy + ")" + " Box Coordinates: (" + bx + "," + by + ")" + " Clicked Coordinates: (" + cx + "," + cy + ")";
  document.getElementById("cor").innerHTML = cor;
  console.log(cor);
  //document.getElementById("debug2").innerHTML = placedObjects;
  hovered = checkSpace(bx,by,false);
  if(hoveredNode == false){
    document.getElementById("debug").innerHTML = "hovering: " + hovered + " object: " + (hovered == true ? placedObjects[curBuld].name : " ")+ " X: " + (hovered == true ? placedObjects[curBuld].xLoc : 0) + " Y: " + (hovered == true ? placedObjects[curBuld].yLoc : 0);
  }else{
    document.getElementById("debug").innerHTML = "hovering: " + hovered + " object: " + (hovered == true ? nodes[curBuld].name : " ") + " X: " + (hovered == true ? nodes[curBuld].xLoc : 0) + " Y: " + (hovered == true ? nodes[curBuld].yLoc : 0);
  }
  if(hoveredNode == true){
    if(nodes[curBuld].type == "mine" && selObject == "mine"){
      drawImage(extractorsUnlockedImgs[0],bx,by,imgScale,plcRot);  
    }else if(nodes[curBuld].type == "pump" && selObject == "pump"){
      ctx.drawImage(extractorsUnlockedImgs[1],bx*gs,by*gs,gs,gs);  
    }
  }
  requestAnimationFrame(gameLoopF);
}

function start() {
  if(debug == true){
    ox=9;
    oy=174;
  }else{
    document.getElementById("cor").style.display = "none";
    document.getElementById("debug").style.display = "none";
    document.getElementById("debug2").style.display = "none";
    document.getElementById("btn").style.display = "none";
  }
  btn = "";
  for(i = 1; i <= 14; i++){
    btn = "buld" + i.toString();
    document.getElementById(btn).style.backgroundImage = "url('" + "assets/grey mine.svg" + "')";
    document.getElementById(btn).style.backgroundPosition = "center center";
    document.getElementById(btn).style.margin = "10px";
    document.getElementById(btn).style.borderRadius = "10px";
    document.getElementById(btn).style.backgroundColor = "#cccccc";
    document.getElementById(btn).style.borderColor = "#cccccc";
  }
  document.getElementById("money").style.margin = "10px";
  document.getElementById("money").style.borderRadius = "10px";
  document.getElementById("money").style.backgroundColor = "#cccccc";
  document.getElementById("money").style.borderColor = "#cccccc";
  document.getElementById("money").style.textAlign = "center";
  document.getElementById("building").style.margin = "10px";
  document.getElementById("building").style.borderRadius = "10px";
  document.getElementById("building").style.backgroundColor = "#cccccc";
  document.getElementById("building").style.borderColor = "#cccccc";
  document.getElementById("building").style.textAlign = "center";
  document.getElementById("b1").style.margin = "10px";
  document.getElementById("b1").style.borderRadius = "10px";
  document.getElementById("b1").style.backgroundColor = "#cccccc";
  document.getElementById("b1").style.borderColor = "#cccccc";
  document.getElementById("b1").style.textAlign = "center";
  document.getElementById("b2").style.margin = "10px";
  document.getElementById("b2").style.borderRadius = "10px";
  document.getElementById("b2").style.backgroundColor = "#cccccc";
  document.getElementById("b2").style.borderColor = "#cccccc";
  document.getElementById("b2").style.textAlign = "center";
  setBtn();
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
  generateWorld();
}

start();

function mm(e) {
  x = e.clientX, y = e.clientY;
  bx = Math.floor((x-ox)/gs), by = Math.floor((y-oy)/gs);
  ocx = x-ox, ocy = y-oy;
}

function mc() {
  clear();
  if (checkSpace(bx,by,false) == true && hoveredNode == false && mode == "place") {
    var curTier=placedObjects[curBuld].tier;
    if(money >= 10 && curTier <  3){
      placedObjects[curBuld].tier = curTier + 1;
      placedObjects[curBuld].update();
    }
  }else if (mode == "place" && checkSpace(bx,by,false) == true && hoveredNode == true) {
    len = placedObjects.length;
    if(nodes[curBuld].type == "mine" && extractorsUnlocked.includes("mine") == true && selObject == "mine") {
      placedObjects[len] = new Mine();
    }else if(nodes[curBuld].type == "pump" && extractorsUnlocked.includes("pump") == true && selObject == "pump"){
      placedObjects[len] = new Pump();
    }
    placedObjects[len].xLoc = bx;
    placedObjects[len].yLoc = by;
    placedObjects[len].rot = plcRot;
    placedObjects[len].node = curBuld;
    placedObjects[len].color = nodes[curBuld].color;
    placedObjects[len].colorUp();
    placedObjects[len].imgUp();
    placedObjects[len].update();
  }else if(mode == "place" && checkSpace(bx,by,false) == false && hoveredNode == false){
    cx = bx, cy = by;
    hoveredBuld="";
  }else if (mode == "place") {
    let len = placedObjects.length;
    placedObjects[len].xLoc = bx;
    placedObjects[len].yLoc = bx;
    placedObjects[len].rot = plcRot;
    placedObjects[len].imgUp();
    placedObjects[len].update();
  } else if (checkSpace(cx,cy,false) == true && mode == "erase") {
    delete placedObjects[curBuld];
  }
}

function checkSpace(inX,inY,object) {
  if(placedObjects.length != 0){
    for(i = 0; i < placedObjects.length; i++) {
      if(placedObjects[i] != undefined) {
        if(placedObjects[i].xLoc == inX && placedObjects[i].yLoc == inY) {
          curBuld=i;
          hoveredNode=false;
          if(object == false){
            return true;
          }else{
            return i;
          }
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
          if(object == false){
            return true;
          }else{
            return i;
          }
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
  for(i = 0; i < solidNodes; i++){
    len = nodes.length;
    gwx = Math.floor(Math.random() * (gxs - 0) + 0);
    gwy = Math.floor(Math.random() * (gys - 0) + 0);
    nodes[len] = new Iron();
    nodes[len].xLoc = gwx;
    nodes[len].yLoc = gwy;
  }
  for(i = 0; i < solidNodes; i++){
    len = nodes.length;
    gwx = Math.floor(Math.random() * (gxs - 0) + 0);
    gwy = Math.floor(Math.random() * (gys - 0) + 0);
    nodes[len] = new Copper();
    nodes[len].xLoc = gwx;
    nodes[len].yLoc = gwy;
  }
  for(i = 0; i < solidNodes; i++){
    len = nodes.length;
    gwx = Math.floor(Math.random() * (gxs - 0) + 0);
    gwy = Math.floor(Math.random() * (gys - 0) + 0);
    nodes[len] = new Limestone();
    nodes[len].xLoc = gwx;
    nodes[len].yLoc = gwy;
  }
  for(i = 0; i < solidNodes; i++){
    len = nodes.length;
    gwx = Math.floor(Math.random() * (gxs - 0) + 0);
    gwy = Math.floor(Math.random() * (gys - 0) + 0);
    nodes[len] = new Quarts();
    nodes[len].xLoc = gwx;
    nodes[len].yLoc = gwy;
  }
  clear();
}

function selBuld(btn){
  selObject = selBuldOrder[btn-1];
  document.getElementById("building").innerHTML = selObject;
}

function setBtn(){
  btn = "";
  for(i = 1; i <= 14; i++){
    btn = "buld" + i.toString();
    document.getElementById(btn).innerHTML = selBuldOrder[i-1];
  }
}