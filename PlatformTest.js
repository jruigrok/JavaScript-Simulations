var platformY1 = [];
var platformX1 = [];
var platformY2 = [];
var platformX2 = [];
var gravity = 0;
var yVel = 0;
var xVel = 0;
var Xpos = 0;
var Ypos = 0;
var num = 0;
var numPlatform = 0;
var yVelChange = "true";
var playerX = 100;
var playerY = 0;
var xVelChange = "true";
var hitSide;
function draw() {
  var draw = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 500;

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function drawCircle(x, y, r, c) {
    draw.beginPath();
    draw.lineWidth = r;
    draw.strokeStyle = c;
    draw.arc(x, y, r / 2, 0, 2 * Math.PI);
    draw.stroke();
  }

function checkKeyDown(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
      if(yVelChange == "false"){
        yVel = -4;
      }
    }
    else if (e.keyCode == '37') {
      xVel = -1;
    }
    else if (e.keyCode == '39') {
     xVel = 1;
    }


}
function checkKeyUp(e) {

    e = e || window.event;

    if (e.keyCode == '37') {
      xVel = 0;
    }
    else if (e.keyCode == '39') {
     xVel = 0;
    }

}

  function player(s) {
    playerX += xVel;
    playerY += yVel;
    drawCircle(playerX, playerY, s, "#0044ff");

  }
  function platform(x, y, x2, y2) {
    
    draw.beginPath();
    draw.fillStyle = "#0044ff";
    draw.fillRect(x, y, x2 - x, y2 - y);
    draw.stroke();
    numPlatform += 1;
    platformX1[numPlatform] = x;
    platformX2[numPlatform] = x2;
    platformY1[numPlatform] = y;
    platformY2[numPlatform] = y2;
   
  }

  if (canvas.getContext) {
    var draw = canvas.getContext('2d');
  }

		var timerSet = setInterval(myTimer, 10);
 function myTimer() {
    yVelChange = "true";
    xVelChange = "true";
    numPlatform = 0;
    draw.clearRect(0, 0, canvas.width, canvas.height);
    
    document.onkeydown = checkKeyDown;
    document.onkeyup = checkKeyUp;

   
  	platform(100, 150, 300, 170);
    platform(180, 100, 200, 210);
 for(var i = 0; i < numPlatform; i++){
        num += 1;
    
    if(playerY +10 >= platformY1[num] && playerX >= platformX1[num] && playerX <= platformX2[num] && playerY -10 <= platformY2[num]){
        yVelChange = "false";
        while(playerY +9 >= platformY1[num] && playerX >= platformX1[num] && playerX <= platformX2[num] && playerY -9 <= platformY2[num] && yVel > 0){

          playerY -= 1;
        }
    }
    if(playerX +10 >= platformX1[num] && playerX -10 <= platformX2[num] && playerY -2 >= platformY1[num] && playerY +2 <= platformY2[num]){
        xVelChange = "false";
        if(playerX - 2 >= platformX1[num]){
          hitSide = "left";
          console.log(xVel);
          console.log(hitSide);
          while(playerX + 9 >= platformX1[num] && playerX - 9 <= platformX2[num] && playerY -2 >= platformY1[num] && playerY +2 <= platformY2[num] && yVel > 0){
            playerX += 1;
          }
        }
        if(playerX + 2 <= platformX2[num]){
          hitSide = "right";
          console.log(xVel);
          console.log(hitSide);
          while(playerX + 9 >= platformX1[num] && playerX - 9 <= platformX2[num] && playerY -2 >= platformY1[num] && playerY +2 <= platformY2[num] && yVel > 0){
            playerX -= 1;
          }
        }
    if(yVel < 0 && playerY -10 <= platformY2[num] && playerX - 10 >= platformX1[num] && playerX + 10 <= platformX2[num]){
        while(playerY -10 <= platformY2[num]){
        playerY += 1;
      }
        yVel = 0;
       yVelChange = "true";
    }

    }
  
  }
    num = 0;
      if(playerY >= 200){
        yVelChange = "false";
      }
    if(xVelChange == "false"){
      if(hitSide == "left" && xVel > 0){

      }else{
      if(hitSide == "right" && xVel < 0){

      }else{
      xVel = 0;
    }
    }
    }
    if(yVelChange == "true"){
      yVel += 0.1;
    }else{
      if(yVel >= 0){
      yVel = 0;
    }
    }
   player(10);
  }
}
draw();