var CamX = 0;
var CamY = 0;
var xVel = 0;
var yVel = 0;
var mouseX = 0;
var mouseY = 0;
var particles = [];
var enemies = [];
var starsX = [];
var starsY = [];
var mouseDown = false;
var dead = 0;
var score = 0;
var playerY = window.innerHeight/2;
var playerX = window.innerWidth/2;
var time = 0;
var level = 200
var spawnDistance = 800;
var bulletSpeed = 7;
var movementSpeed = 1.5;
var enemyMoveSpeed = 2.5;
var enemiespawnRate = 500;
var enemyBulletSpeed = 4;
var enemyFireRate = 100;
var play = false;
var arenaSize = 1000;
var attack = false;
var move = false;
var shield = false;
var prevMouseY = 0;
var prevMouseX = 0;

function draw() {
  var draw = canvas.getContext('2d');
  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - 50;

  function randomNumber(minimum, maximum) {
    var num = Math.floor(Math.random() * (maximum - minimum)) + minimum;
    return num;
  }

  if (canvas.getContext) {
    var draw = canvas.getContext('2d');
  }

  

  function playButton(){
    draw.beginPath();
    draw.fillStyle = "rgb(150,150,150)";
    draw.fillRect(window.innerWidth/2 - 80, window.innerHeight/2 - 50,160,100);
    draw.font = "30px Arial";
    draw.fillStyle  = "rgb(150,150,150)"
    draw.fillText("Score: " + score,10,50);
    draw.fillStyle = "rgb(0,0,0)";
    draw.font = "40px Arial";
    draw.fillText("Play", window.innerWidth/2 - 40, window.innerHeight/2 + 10);
    draw.stroke();
    if(mouseX > window.innerWidth/2 - 80 && mouseX < window.innerWidth/2 + 80 && mouseY > window.innerHeight/2 - 50 && mouseY <  window.innerHeight/2 + 50 && mouseDown){
      play = true;
      score = 0;
    }
  }

  function makeStars(){
    for(var i = 0; i < 100; i++){
      starsX[i] = randomNumber(-arenaSize,arenaSize);
      starsY[i] = randomNumber(arenaSize,-arenaSize);
    }
  }

  function drawStars(){
    draw.beginPath();
    draw.lineWidth = 4;
    draw.strokeStyle = "rgb(255,255,255)";
    for(var i = 0; i < starsX.length; i++){
      draw.moveTo(starsX[i] + CamX + playerX,starsY[i] + CamY + playerY);
      draw.lineTo(starsX[i] - 4 + CamX + playerX,starsY[i] + CamY + playerY);
    }
    draw.stroke();
  }

  function shoot(){
  	if(mouseDown && fire == true){
  		particles.push(new particle(playerX - CamX, playerY - CamY - 2.5,  Math.cos(Math.atan2(mouseY - playerY, mouseX - playerX)) * bulletSpeed, Math.sin(Math.atan2(mouseY - playerY, mouseX - playerX)) * bulletSpeed,5,5,"rgb(0,0,255)", 600,"none", "bulletG","square"));
  		mouseDown = false;
  	}
  }

  function Respawn(){
    play = false;
  	CamX = 0;
  	CamY = 0;
  	enemies = [];
  	particles = [];
  }

  function enemiespawn(){
  	if(randomNumber(enemiespawnRate,0) == 1){
      var angle = Math.random() * Math.PI * 2;
      var x = Math.cos(angle) * spawnDistance;
      var y = Math.sin(angle) * spawnDistance;
      var randomNum = randomNumber(1,6);
      if(randomNum == 5){
        enemies.push(new enemy(playerX + x - CamX, playerY + y - CamY, "shooter",enemyMoveSpeed/2,"rgb(100,100,100)"));
      }else if(randomNum == 4){
        enemies.push(new enemy(playerX + x - CamX, playerY + y - CamY, "exploder",enemyMoveSpeed, "rgb(255,0,0)"));
      }else if(randomNum == 3){
        enemies.push(new enemy(playerX + x - CamX, playerY + y - CamY, "scatter",enemyMoveSpeed/3, "rgb(255,255,0)"));
      }else if(randomNum == 2){
        enemies.push(new enemy(playerX + x - CamX, playerY + y - CamY, "tank",enemyMoveSpeed/2, "rgb(255,0,255)"));
      }else{
        enemies.push(new enemy(playerX + x - CamX, playerY + y - CamY, "reg",enemyMoveSpeed, "rgb(255,170,0)"));
      }
  	  
  	}
  }

  function drawPlayer(){
    checkMovemnt();
  	playerMovement();
  	drawCircle(playerX,playerY,10,"rgb(0,0,255)");
  	draw.lineWidth	= 10;
  	draw.strokeStyle = "rgb(0,0,255)";
  	draw.beginPath();
  	draw.save();
  	draw.translate(playerX,playerY);
  	draw.rotate(Math.atan2(playerY - prevMouseY,playerX - prevMouseX));
  	draw.moveTo(0,0);
  	draw.lineTo(-30,0);
  	draw.stroke();
  	draw.restore();
  }

  function drawCircle(x, y, radius, color) {
    draw.beginPath();
    draw.lineWidth = radius;
    draw.strokeStyle = color;
    draw.arc(x, y, radius / 2, 0, 2 * Math.PI);
    draw.stroke();
  }

   function checkMovemnt(){
    if(CamX > 1000 && xVel < 0){
      xVel = 0;
    }
    if(CamX < -1000 && xVel > 0){
      xVel = 0;
    }
    if(CamY > 1000 && yVel < 0){
      yVel = 0;
    }
    if(CamY < -1000 && yVel > 0){
      yVel = 0;
    }
  }

  function playerMovement(){
    CamX -= xVel;
    CamY -= yVel;
  }

  window.addEventListener('mousemove', function (e){
    mouseX = e.x -7;
    mouseY = e.y -7;
    if(fire == true){
      prevMouseX = e.x -7;
      prevMouseY = e.y -7;
    }
  });

  window.addEventListener('mousedown', function(e){
  	mouseDown = true;
  });

  window.addEventListener('mouseup', function(e){
  	mouseDown = false;
  });

  window.addEventListener('keydown', function(e){
    if (e.keyCode == '81') {
      fire = true;
      move = false;
      shield = false;
    }
  });

  window.addEventListener('keyup', function(e){

  	if (e.keyCode == '65') {
    	xVel = 0;
    }
    if (e.keyCode == '68') {
    	xVel = 0;
    }
    if (e.keyCode == '87') {
    	yVel = 0;
    }
    if (e.keyCode == '83') {
    	yVel = 0;
    }
  });

  window.addEventListener('keydown', function(e){
    
    if (e.keyCode == '65' && CamX < 1000) {
  	  xVel = -movementSpeed;
    }
  
    if (e.keyCode == '68' && CamX > -1000) {
      xVel = movementSpeed;
    }
    
    if (e.keyCode == '87' && CamY < 1000) {
      yVel = -movementSpeed;
    }
   
    if (e.keyCode == '83' && CamY > -1000) {
      yVel = movementSpeed;
    }
  });


   var particle = function(x,y,xVel,yVel,Width,Height,Color,LifeTime,OutEffect,type,shape){
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.Width = Width;
    this.Height = Height;
    this.Color = Color;
    this.LifeTime = LifeTime;
    this.OriginalLifeTime = LifeTime;
    this.OutEffect = OutEffect;
    this.type = type;
    this.angle = Math.atan(yVel/xVel);
    this.shape = shape;
  }

  particle.prototype.Render = function(){
    this.x += CamX;
    this.y += CamY;
    
    this.x += this.xVel;
    this.y += this.yVel;
    this.LifeTime -= 1;

    if(this.OutEffect == "fade"){
      draw.fillStyle = this.Color + this.LifeTime/this.OriginalLifeTime + ")";
    }else{
      draw.fillStyle = this.Color;
    }
    
    if(this.shape == "square"){
      draw.beginPath();
      draw.save();
      draw.translate(this.x,this.y);
      draw.rotate(this.angle);
      draw.fillRect(0, 0, this.Height, this.Width);
      draw.restore();
      draw.stroke();
    }
    if(this.shape == "circle"){
      if(this.OutEffect == "fade"){
        drawCircle(this.x,this.y,this.Width,this.Color + this.LifeTime/this.OriginalLifeTime + ")");
      }else{
        drawCircle(this.x,this.y,this.Width,this.Color);
      } 
    }
    if(this.shape.includes("polygon")){
      draw.save();
      draw.translate(this.x,this.y);
      draw.rotate(Math.abs(this.angle));
      drawPolygon(0,0,this.shape.charAt(this.shape.length - 1),this.Width, 5, this.Color,0,90,0,false);
      draw.restore();
    	
    }
    
    if(this.type == "bulletB" || this.type == "bulletG"){
      this.Collision();
    }

    this.x -= CamX;
    this.y -= CamY;

    if(this.LifeTime == 0){
      this.Delete();
    }
  }

  particle.prototype.Collision = function(){
  if(playerY + 10 >= this.y && playerX + 10 >= this.x - this.Width && playerX - 10 <= this.x && playerY - 10 <= this.y + this.Height && this.type == "bulletB"){
    Respawn();
    this.Delete();
 	}
 	if(this.type == "bulletG"){
 	  for(var i = 0; i < enemies.length; i++){
 	    if(this.y - this.Height < enemies[i].y + 10 + CamY && this.y + this.Height > enemies[i].y - 10 + CamY && this.x - this.Width < enemies[i].x + 10 + CamX && this.x + this.Width > enemies[i].x - 10 + CamX){
        if(enemies[i].type == "exploder"){
          var angle = 0;
          for(var b = 0;b < 15; b++){
            angle += Math.PI / 7.5;
            particles.push(new particle(enemies[i].x,enemies[i].y, Math.cos(angle) * -enemyBulletSpeed, Math.sin(angle) * -enemyBulletSpeed, 5,5,"rgb(255,0,0)", 400, "none", "bulletB","square"));
          }
        }else{
          for(var a = 0; a < 10; a++){
            particles.push(new particle(enemies[i].x,enemies[i].y, randomNumber(5,-5), randomNumber(5,-5),randomNumber(2,10),randomNumber(2,10),enemies[i].color.substring(0,enemies[i].color.length-1) + ",",randomNumber(100,200),"fade", "reg", "square"));
          }
        }
 	      if(enemies[i].health == 1){
          enemies[i].Delete();
          dead -= 1;
          score ++;
        }else{
          enemies[i].health -= 1;
        }
 	      this.Delete();
 	    }
 	  }
 	}

  }

  particle.prototype.Delete = function(){
      var indexToDelete = particles.indexOf(this);
      particles.splice(indexToDelete,1);
      dead += 1;
  }

  var enemy = function(x,y,type,speed,color){
  	this.x = x;
  	this.y = y;
  	this.type = type;
  	this.speed = speed;
  	this.number = 0;
  	this.xVel = 0;
  	this.yVel = 0;
    this.playerDistance;
    this.color = color;
    if(this.type == "tank"){
      this.health = 7;
    }else{
      this.health = 1;
    }
  }

  enemy.prototype.Render = function(){
    this.playerDistance = Math.sqrt(Math.pow(this.x - playerX + CamX,2) + Math.pow(this.y - playerY + CamY,2));
  	this.xVel = Math.cos(Math.atan2(this.y - playerY + CamY, this.x - playerX + CamX));
  	this.yVel = Math.sin(Math.atan2(this.y - playerY + CamY, this.x - playerX + CamX));
    if(this.playerDistance < 550 && this.type == "shooter"){

    }else{
      this.x -= this.xVel * this.speed;
      this.y -= this.yVel * this.speed;
    }
    if(this.playerDistance < 500 && this.type == "shooter"){
      this.x -= this.xVel * -this.speed;
      this.y -= this.yVel * -this.speed;
    }
    
  	drawCircle(this.x + CamX,this.y + CamY,10,this.color);
    this.Collision();
  	this.number += 1;
  	this.attack();
	}
  enemy.prototype.Collision = function(){
  	if(this.x + 10 + CamX > playerX - 10 && this.x - 10 + CamX < playerX + 10 && this.y + 10 + CamY > playerY - 10 && this.y - 10 + CamY < playerY + 10){
      Respawn();
  	}
  }

  enemy.prototype.attack = function(){
    if(this.number % enemyFireRate == 0 && this.type == "shooter"){
      particles.push(new particle(this.x,this.y, this.xVel * -enemyBulletSpeed, this.yVel * -enemyBulletSpeed, 5,5,"rgb(255,0,0)", 300, "none", "bulletB","square"));
    }
    if(this.number % enemyFireRate == 0 && this.type == "scatter"){
      var angle = this.number;
      for(var i = 0; i < 4;i++){
        angle += Math.PI/2;
        particles.push(new particle(this.x,this.y, Math.cos(angle) * -enemyBulletSpeed, Math.sin(angle) * -enemyBulletSpeed, 5,5,"rgb(255,0,0)", 300, "none", "bulletB","square"));
      }  
    }
    
    if(this.playerDistance < 200 && this.type == "exploder"){
      var angle = 0;
      for(var i = 0;i < 15; i++){
        angle += Math.PI / 7.5;
        particles.push(new particle(this.x,this.y, Math.cos(angle) * -enemyBulletSpeed, Math.sin(angle) * -enemyBulletSpeed, 5,5,"rgb(255,0,0)", 400, "none", "bulletB","square"));
      }
      this.Delete();
    }
  }

  enemy.prototype.Delete = function(){
  	var indexToDelete = enemies.indexOf(this);
    enemies.splice(indexToDelete,1);
    dead += 1;
  }

  function Render(){
    for(var i = 0; i < enemies.length; i++){
      dead = 0;
      enemies[i].Render();
      i -= dead;  
    }
    for(var i = 0; i < particles.length; i++){
      dead = 0;
      particles[i].Render();
      i -= dead;  
    }
  }

  

  makeStars();
  var timerSet = setInterval(Refresh, 10);
  
  function Refresh(){ 
  	draw.clearRect(0, 0, canvas.width, canvas.height);
    if(play == true){
      drawStars();
      draw.font = "30px Arial";
      draw.fillStyle  = "rgb(150,150,150)"
      draw.fillText("Score: " + score,10,50);
      Render();
      shoot();
      enemiespawn();
      drawPlayer();
    }else{
      playButton();
    }
    
  }
}

draw();
