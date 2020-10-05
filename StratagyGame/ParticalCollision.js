
//dont change these values
var particals = [];
var walls = [];
var time = 0;
var ID = 0;
var mouseDown = false;
var mouseX = 0;
var mouseY = 0;
var click = false;
var pause = false;


function draw() {
  gameArea.width = window.innerWidth;
  gameArea.height = window.innerHeight;
  var ctx = gameArea.getContext('2d');

  if (gameArea.getContext) {
    var draw = gameArea.getContext('2d');
  }

  var gh = gameArea.height;
  var gw = gameArea.width;
  function background(){
    ctx.fillStyle = 'rgba(0,0,0)';
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
  }
  

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  document.body.onmousedown = function() { 
    ++mouseDown;
  }
  document.body.onmouseup = function() {
    --mouseDown;
    click = false;
  }
  
  function getMousePosition(canvas, event) { 
    let rect = gameArea.getBoundingClientRect(); 
    mouseX = event.clientX - rect.left; 
    mouseY = event.clientY - rect.top;  
  } 


  gameArea.addEventListener('mousemove', function(e){
    getMousePosition('gameArea', e);
  });


  function drawCircle(x,y,r,c){
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineWidth = r;
    ctx.arc(x, y, r/2, 0, 2 * Math.PI);
    ctx.stroke();
  }


  function Sbutton(x1,y1,x2,y2){
    if(mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2){
      return true;
    }else{
      return false;
    }
  }

  function Cbutton(x,y,r){
    if(Math.sqrt(Math.pow(mouseX - x,2) + Math.pow(mouseY - y,2)) <= r){
      return true;
    }else{
      return false;
    }
  }

  function settings(){
    drawCircle(gw-25,25,10,'#00627d');
    ctx.beginPath();
    ctx.fillStyle = '#00627d';
    ctx.lineCap = "round";
    if(Sbutton(gw - 60, 15, gw - 45, 35)  && mouseDown && !click){
      if(pause){
        --pause;
      }else{
        ++pause;
      }
      click = true;
    }
    if(Cbutton(gw-25,25,10) && mouseDown && !click){
      console.log('pog');
      click = true;
    }
    if(!pause){
      ctx.fillRect(gw - 50,15,5,20);
      ctx.fillRect(gw - 60,15,5,20);
    }else{
      ctx.beginPath();
      ctx.moveTo(gw - 60, 15);
      ctx.lineTo(gw - 60, 35);
      ctx.lineTo(gw - 45, 25);
      ctx.fill();
    }
    ctx.lineCap = "butt";
    ctx.stroke;
  }

  var partical = function(x,y,angle,speed,r,color,colType){
    ID ++;
    this.x = x;
    this.y = y;
    this.yVel = Math.sin(angle) * speed;
    this.xVel = Math.cos(angle) * speed;
    this.r = r;
    this.color = color;
    this.spawnTime = time;
    this.ID = ID;
    this.m = Math.PI * Math.pow(this.r,2);
    this.ax = 0;
    this.ay = 0;
    this.col = false;
    this.colType = colType;
  }



  partical.prototype.render = function(){
    drawCircle(this.x,this.y,this.r,this.color);
    if(!pause){
    this.xVel += this.ax;
    this.yVel += this.ay;
      for(var i = 0; i < particals.length;i++){
        if(particals[i].ID != this.ID && this.col != particals[i]){
          let dx = particals[i].x - this.x;
          let dy = particals[i].y - this.y;
          let d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
          if(d < this.r + particals[i].r){
            this.particalCollision(this,particals[i],dx,dy,d);
          }
        }
      }
      this.x += this.xVel;
      this.wallCollision('x');  
      this.y += this.yVel;
      this.wallCollision('y');  
      this.col = false;
    }
  }


  partical.prototype.particalCollision = function(ob1,ob2,dx,dy,d){
    let s = (ob1.r + ob2.r) - d;
    let nx = dx / d;
    let ny = dy / d;
    k = -2 * ((ob2.xVel - ob1.xVel) * nx + (ob2.yVel - ob1.yVel) * ny) / (1/ob2.m + 1/ob1.m);
    if(ob1.colType == 'bounce'){
      ob1.xVel -= k * nx / ob1.m;
      ob1.yVel -= k * ny / ob1.m;
    }
    if(ob2.colType == 'bounce'){
      ob2.xVel += k * nx / ob2.m;
      ob2.yVel += k * ny / ob2.m;
    }
    ob1.m / ob2.m;
    ob1.x -= (nx * s/2);
    ob1.wallCollision('x');  
    ob1.y -= (ny * s/2);
    ob1.wallCollision('y');
    ob2.x += (nx * s/2);
    ob2.wallCollision('x');
    ob2.y += (ny * s/2);
    ob2.wallCollision('y'); 
    ob2.col = ob1;

  }
  partical.prototype.wallCollision = function(value){

    for(var i = 0; i < walls.length; i++){
      if((this.y + this.r > walls[i].y1 && this.y - this.r < walls[i].y2) && (this.x - this.r < walls[i].x2 && this.x + this.r > walls[i].x1)){

        if(value == 'x'){
          if(Math.abs(this.x - walls[i].x2) < Math.abs(this.x - walls[i].x1)){
            this.x += (-this.x + this.r) + walls[i].x2;
          }else{
            this.x -= (this.x + this.r) - walls[i].x1;
          }
          this.xVel = -this.xVel;
        }else{
          if(Math.abs(this.y - walls[i].y2) < Math.abs(this.y - walls[i].y1)){
            this.y += (-this.y + this.r) + walls[i].y2;
          }else{
            this.y -= (this.y + this.r) - walls[i].y1;
          }
          this.yVel = -this.yVel;
        }
      }
    }
  }

  partical.prototype.delete = function(){
      var indexToDelete = particals.indexOf(this);
      particals.splice(indexToDelete,1);
      deleted += 1;
  }


  var wall = function(x1,y1,x2,y2,color){
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.color = color;
  }


  wall.prototype.render = function(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x1,this.y1,this.x2 - this.x1,this.y2 - this.y1);
    ctx.stroke();
  }

  function renderObject(object){
    var deleted = 0;
    for(var i = 0; i < object.length; i++){
      deleted = 0;
      object[i].render();
      i -= deleted;
    }
  }


  function trackMouse(){

    if(mouseDown){
      drawCircle(mouseX,mouseY,5,'rgb(0,255,0)');
    }
  }
  for(var i = 0; i < 40; i++){
    particals.push(new partical(getRndInteger(gw/2 -2,gw/2 + 20),getRndInteger(gh/2 - 20,gh/2 + 20),getRndInteger(0,2 * Math.PI),2,getRndInteger(10,40),"#01378c",'bounce'));
  }
  //particals.push(new partical(50,gh/2,0,5,25,'rgb(0,255,0)','bounce'));
  //particals.push(new partical(gw - 50,gh/2,Math.PI,5,5,'rgb(0,255,0)','bounce'));
  walls.push(new wall(gw - 50,0,gw,gh,'#00122e'));
  walls.push(new wall(0,0,50,gh,'#00122e'));
  walls.push(new wall(0,0,gw,50,'#00122e'));
  walls.push(new wall(0,gh - 50,gw,gh,'#00122e'));
  
  function refresh(){
    
    draw.clearRect(0, 0, gameArea.width, gameArea.height);
    background();
    renderObject(particals);
    renderObject(walls);
    trackMouse();
    settings();
    
    window.requestAnimationFrame(refresh);
  }
  window.requestAnimationFrame(refresh);

  setInterval(timer, 1);

  function timer(){
    time++;
  }
}

draw();