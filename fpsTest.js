/*
var frames = 1;
function fpsTest(){
  document.getElementById("debug").innerHTML = frames + " current fps: " + (1000/frameTime).toFixed(1) + " fps at 250: " + fps25 + " fps at 500: " + fps50 + " fps at 750: " + fps75 + " fps at 1000: " + fps100 + " fps at 5000: " + fps500 + " fps at 10000: " + fps1000;
  clear();
  drawGrid();
  frames++;
}

var filterStrength = 35;
var frameTime = 0, lastLoop = new Date, thisLoop;
var fps25 = 0;
var fps50 = 0;
var fps75 = 0;
var fps100 = 0;
var fps500 = 0;
var fps1000 = 0;

async function fpsTestStart() {
  for(var i = 0; i <= 10000; i++) {
    fpsTest();
    drawGrid();
    var thisFrameTime = (thisLoop=new Date) - lastLoop;
    frameTime+= (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
    if(i == 250) {
      fps25 = (1000/frameTime).toFixed(1);
    } else if(i == 500) {
      fps50 = (1000/frameTime).toFixed(1);
    } else if(i == 750) {
      fps75 = (1000/frameTime).toFixed(1);
    } else if(i == 1000) {
      fps100 = (1000/frameTime).toFixed(1);
    } else if(i == 5000) {
      fps500 = (1000/frameTime).toFixed(1);
    } else if(i == 9999) {
      fps1000 = (1000/frameTime).toFixed(1);
    }
  }
}

//fpsTestStart();
*/