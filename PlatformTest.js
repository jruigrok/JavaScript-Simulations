var platformY1 = [];
var platformX1 = [];
var platformY2 = [];
var platformX2 = [];
var platformType = [];
var ParticalColor = [];
var ParticalSize = [];
var Particalx = [];
var Particaly = [];
var ParticalxVel = [];
var ParticalyVel = [];
var ParticalLifeTime = [];
var ParticalLT = [];
var ParticalOE = [];
var movingPlatformX = [];
var movingPlatformX2 = [];
var movingPlatformY = [];
var movingPlatformY2 = [];
var movingPlatformX3 = [];
var movingPlatformY3 = []
var movingPlatformSpeed = [];
var movingPlatformWidth = [];
var movingPlatformHeight = [];
var shooterX = [];
var shooterY = [];
var fireRate = [];
var bulletSpeed = [];
var bulletDistance = [];
var numMP = 0;
var num3 = 0;
var num4 = 0;
var slopeY;
var slopeX;
var numParticals = 0;
var numShooters = 0;
var gravity = 0;
var s = 0;
var yVel = 0;
var xVel = 0;
var Xpos = 0;
var Ypos = 0;
var num = 0;
var num2 = 0;
var dead = false;
var numPlatform = 0;
var yVelChange = "true";
var playerX = 150;
var playerY = 100;
var xVelChange = "true";
var hitSide;
var Alpha = 1;
function draw() {
  var draw = canvas.getContext('2d');
  canvas.width = window.innerWidth-50;
  canvas.height = window.innerHeight-50;

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
  function platform(x, y, x2, y2, t) {
    if(t == "bad"){
      draw.fillStyle = "#C71515";
    }else{
    if(t == "bnc"){
     draw.fillStyle =  "#4d0099";
     if(getRndInteger(0,10) == 3){
          partical.new(getRndInteger(x,x2-5),y,0,-1,5, "rgba(77,0,153,",30,"fade"); 
      }   
    }else{
      draw.fillStyle = "#0044ff";
    }
    }
    draw.beginPath();
    draw.fillRect(x, y, x2 - x, y2 - y);
    draw.stroke();
    numPlatform += 1;
    platformX1[numPlatform] = x;
    platformX2[numPlatform] = x2;
    platformY1[numPlatform] = y;
    platformY2[numPlatform] = y2;
    platformType[numPlatform] = t;
  }
  
  var movingPlatform = function(num){
    slopeY = ((movingPlatformY3[num] - movingPlatformY2[num])/100)* movingPlatformSpeed[num];
    slopeX = ((movingPlatformX3[num] - movingPlatformX2[num])/100)* movingPlatformSpeed[num];
    movingPlatformX[num] += slopeX;
    movingPlatformY[num] += slopeY;
    s = movingPlatformSpeed[num];
    platform(movingPlatformX[num],movingPlatformY[num],movingPlatformX[num] + movingPlatformWidth[num],movingPlatformY[num] + movingPlatformHeight[num],"reg");
    if(Math.round(movingPlatformY[num]/s)*s == Math.round(movingPlatformY3[num]/s)*s && Math.round(movingPlatformX[num]/s)*s == Math.round(movingPlatformX3[num]/s)*s || Math.round(movingPlatformY[num]/s)*s == Math.round(movingPlatformY2[num]/s)*s && Math.round(movingPlatformX[num]/s)*s == Math.round(movingPlatformX2[num]/s)*s){
       movingPlatformSpeed[num] *= -1;
       
    }
     
  }

  movingPlatform.new = function(x,y,x2,y2,width,height,speed){
    numMP += 1;
    movingPlatformX[numMP] = x;
    movingPlatformX2[numMP] = x;
    movingPlatformY[numMP] = y;
    movingPlatformY2[numMP] = y;
    movingPlatformX3[numMP] = x2;
    movingPlatformY3[numMP] = y2;
    movingPlatformSpeed[numMP] = speed;
    movingPlatformHeight[numMP] = height;
    movingPlatformWidth[numMP] = width;

  }
  movingPlatform.refresh = function(){
    num3 = 0;
    for(i = 0; i < numMP; i++){
      num3 += 1;
      movingPlatform(num3);
    }
  }


  function typeCheck(x){
    if(platformType[x] == "bad"){
      Respawn();
    }
    if(platformType[x] == "bnc"){
      yVel = -6;
    }
  }
  function Respawn(){
    playerX = 150;
    playerY = 100;
    yVel = 0;
    xVel = 0;
  }
  function Collision(){
     for(var i = 0; i < numPlatform; i++){
        num += 1;
   
    if(playerY + 10 >= platformY1[num] && playerX + 8 >= platformX1[num] && playerX - 8 <= platformX2[num] && playerY - 10 <= platformY2[num]){
        yVelChange = "false";
        typeCheck(num);
        if(yVel < 0 && playerY - 10 <= platformY2[num] && playerX + 8 >= platformX1[num] && playerX - 8  <= platformX2[num] && playerY + 10 >= platformY2[num]){
          yVel = 0;
          yVelChange = "true";
          while(playerY - 10 <= platformY2[num]){
              playerY += 1;
          }
        }else{
          while(playerY + 9 >= platformY1[num] && playerX + 2 >= platformX1[num] && playerX - 2 <= platformX2[num] && playerY - 9 <= platformY2[num]){
            playerY -= 1;
          }
        }
    }
    if(playerX + 10 >= platformX1[num] && playerX - 10 <= platformX2[num] && playerY - 2 >= platformY1[num] && playerY + 2 <= platformY2[num]){
        xVelChange = "false";
        typeCheck(num);
        if(playerX - 2 >= platformX1[num]){
          hitSide = "left";
          while(playerX + 9 >= platformX1[num] && playerX - 9 <= platformX2[num] && playerY - 2 >= platformY1[num] && playerY + 2 <= platformY2[num]){
            playerX += 1;
          }
        }
        if(playerX + 2 <= platformX2[num]){
          hitSide = "right";
          while(playerX + 9 >= platformX1[num] && playerX - 9 <= platformX2[num] && playerY - 2 >= platformY1[num] && playerY + 2 <= platformY2[num]){
            playerX -= 1;
          }
        }
    
    }

  }
    num = 0;
      if(playerY >= 300){
        yVelChange = "false";
      }

      if(hitSide == "left" && xVel > 0 || hitSide == "right" && xVel < 0){
      

      }else if(xVelChange == "false"){
        xVel = 0;
      }
    if(yVelChange == "true"){
      yVel += 0.1;
    }else{
      if(yVel >= 0){
      yVel = 0;
    }
    }
  }
  var partical = function(num){
    dead = false;
    
    partical.xVel = ParticalxVel[num];
    partical.yVel = ParticalyVel[num];
    partical.Size = ParticalSize[num];
    partical.Color = ParticalColor[num];
    Particalx[num] += partical.xVel;
    Particaly[num]+= partical.yVel;
    ParticalLifeTime[num] -= 1;
    partical.x = Particalx[num];
    partical.y = Particaly[num];
    partical.LifeTime = ParticalLifeTime[num];
    
    draw.beginPath();
    if(ParticalOE[num] == "fade"){
    draw.fillStyle = partical.Color + partical.LifeTime/ParticalLT[num] + ")";
    }else{
    draw.fillStyle = partical.Color + 1 + ")";
    }
    draw.fillRect(partical.x,partical.y,partical.Size,partical.Size);
    draw.stroke();
    
    if(partical.LifeTime <= 0){
      
      numParticals -= 1;
      dead = true;
      Particalx.splice(num,1);
      Particaly.splice(num,1);
      ParticalxVel.splice(num,1);
      ParticalyVel.splice(num,1);
      ParticalColor.splice(num,1);
      ParticalSize.splice(num,1);
      ParticalLifeTime.splice(num,1);
      ParticalLT.splice(num,1);
      
     
    }
    

  }
  partical.new = function(x,y,xVel,yVel,Size,Color,LifeTime,OutEffect){
    numParticals += 1;
    Particalx[numParticals] = x;
    Particaly[numParticals] = y;
    ParticalxVel[numParticals] = xVel;
    ParticalyVel[numParticals] = yVel;
    ParticalColor[numParticals] = Color;
    ParticalSize[numParticals] = Size;
    ParticalLifeTime[numParticals] = LifeTime;
    ParticalLT[numParticals] = LifeTime;
    ParticalOE[numParticals] = OutEffect;
  }
  partical.render = function(){
    num2 = 0;
    for(i = 0; i <= numParticals; i++){
      if(dead == false){
      
      num2 += 1;
    }
      partical(num2);
    }
  }
  var shooter = function(num){
    drawCircle(shooterX[num],shooterY[num],15,"#C71515");
    draw.beginPath();
    draw.save();
    draw.fillStyle = "#C71515";
    draw.translate(shooterX[num],shooterY[num]);
    draw.rotate(Math.atan2(shooterY[num] - playerY,shooterX[num] - playerX));
    draw.fillRect(0,-10, -50,20);
    draw.restore();
    draw.stroke();
    
  }
  shooter.render = function(){
    num4 = 0;
    for(i = 0; i < numShooters; i++){
      num4 += 1;
      shooter(num4);
    }
  }
  shooter.new = function(x,y,fireRate, bulletSpeed,bulletDistance){
    numShooters += 1;
    shooterX[numShooters] = x;
    shooterY[numShooters] = y;
    fireRate[numShooters] = fireRate;
    bulletSpeed[numShooters] = bulletSpeed;
    bulletDistance[numShooters] = bulletDistance;

  }
  if (canvas.getContext) {
    var draw = canvas.getContext('2d');
  }
    shooter.new(100,100,0,0,0);
    shooter.new(50,50,0,0,0);
    movingPlatform.new(0,300, 0, 200, 100,20, 1);
		var timerSet = setInterval(myTimer, 10);
    function myTimer() {
    yVelChange = "true";
    xVelChange = "true";
    numPlatform = 0;
    draw.clearRect(0, 0, canvas.width, canvas.height);   
    document.onkeydown = checkKeyDown;
    document.onkeyup = checkKeyUp; 
    partical.render();
    shooter.render();
    player(10);
  	platform(100, 250, 400, 270,"reg");
    platform(180, 200, 200, 270,"bad");
    platform(350, 200, 370, 270,"reg");
    platform(300, 180, 370, 200,"reg");
    platform(400, 250, 500, 270,"bnc");
    platform(500, 300, 600, 320,"bnc");
    movingPlatform.refresh();
    Collision();
    
  }
}
draw();