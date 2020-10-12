var deleted = 0;
var polygons = [];
var moveObject = 0;
function draw() {

  gameArea.width = window.innerWidth;
  gameArea.height = window.innerHeight;
  var ctx = gameArea.getContext('2d');

  if (gameArea.getContext) {
    var draw = gameArea.getContext('2d');
  }

  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 37) {moveObject.xVel = -1; }
    if (e.keyCode == 39) {moveObject.xVel = 1; }
    if (e.keyCode == 38) {moveObject.yVel = -1; }
    if (e.keyCode == 40) {moveObject.yVel = 1; }
  })
  window.addEventListener('keyup', function (e) {
    if (e.keyCode == 37 || e.keyCode == 39) {moveObject.xVel = 0; }
    if (e.keyCode == 38 || e.keyCode == 40) {moveObject.yVel = 0; }
  })


  function collision(ob1,ob2){
    if(ob1.type == 'circle' && ob2.type == 'circle'){
      let dx = ob2.x - ob1.x;
      let dy = ob2.y - ob1.y;
      let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      let s = (ob1.r + ob2.r) - d;
      let nx = dx / d;
      let ny = dy / d;
      ob1.x -= (nx * s / 2);
      ob1.y -= (ny * s / 2);
      ob2.x += (nx * s / 2);
      ob2.y += (ny * s / 2);
      ob2.col = ob1;
      ob1.col = ob2;

    }else if(ob1.type == 'polygon' && ob2.type == 'polygon'){
      var newOb1X = [];
      var newOb2X = [];
      var dx = 0;
      var dy = 0;
      var s = 0;
      var a = 0;
      var smallestOverlap = Infinity;
      var changeX = 0;
      var changeY = 0;
      var col = true;
      var d = 0;
      for(var j = 0; j < ob1.numSides + ob2.numSides; j++){
        if(col){
          if(j < ob1.numSides){
            dy = (gameArea.height - ob1.y[j]) - (gameArea.height - ob1.y[j + 1]);
            dx = ob1.x[j] - ob1.x[j + 1];
          }else{
            dy = (gameArea.height - ob2.y[(j - ob1.numSides)]) - (gameArea.height - ob2.y[(j - ob1.numSides) + 1]);
            dx = ob2.x[(j - ob1.numSides)] - ob2.x[(j - ob1.numSides) + 1];
          }
          d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
          s = dy / dx;
          a = Math.atan(-1/s);
          for(var i = 0; i < ob1.numSides; i++){
            newOb1X.push((ob1.x[i] * Math.cos(a)) - (ob1.y[i] * Math.sin(a)));
          }
          for(var i = 0; i < ob2.numSides; i++){
              newOb2X.push((ob2.x[i] * Math.cos(a)) - (ob2.y[i] * Math.sin(a)));
          }
          
          var ob1GX = Math.max(...newOb1X);
          var ob1SX = Math.min(...newOb1X);
          var ob2GX = Math.max(...newOb2X);
          var ob2SX = Math.min(...newOb2X);
          
          if(ob1GX < ob2SX && ob1SX < ob2GX || ob2GX < ob1SX && ob2SX < ob1GX){
            col = false;
          }else{
            if(Math.abs(ob2SX - ob1GX) < Math.abs(ob2GX - ob1SX)){
              overlap = ob2SX - ob1GX;
            }else{
              overlap = ob2GX - ob1SX;
            }
            if(Math.abs(overlap) < Math.abs(smallestOverlap)){
              smallestOverlap = overlap;
              changeX = Math.cos(a);
              changeY = Math.sin(a);
            }
          }
          newOb1X = [];
          newOb2X = [];
          newOb1Y = [];
          newOb2Y = [];
        }
      } 
      console.log(col);
      if(col){
        console.log(smallestOverlap);
        ob1.move((smallestOverlap * changeX)/2,(smallestOverlap * -changeY)/2);
        ob2.move(-(smallestOverlap * changeX)/2,-(smallestOverlap * -changeY)/2);
        ob1.col = true;
        ob2.col = true;
      }
    }
  }
 
  var polygon = function(color,xVel,yVel){
    this.color = color;
    this.x = [];
    this.y = [];
    this.xVel = xVel;
    this.yVel = yVel;
    this.col = false;
    var i = 3;  
  	while(arguments[i] != false){
      this.x.push(arguments[i]);
      this.y.push(arguments[i + 1]);
      i += 2;
    }
    this.x.push(arguments[3]);
    this.y.push(arguments[4]);
    this.numSides = (arguments.length/2) - 2;
    this.type = 'polygon';
  }

  polygon.prototype.render = function(){
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineCap = 'round';
    ctx.moveTo(this.x[0],this.y[0]);
    for(var i = 1; i < this.x.length - 1; i++){
      ctx.lineTo(this.x[i],this.y[i]);
    }
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
    this.move(this.xVel,this.yVel);
    for(var i = 0; i < polygons.length; i++){
      if(polygons[i].col == false && polygons[i] != this){
        collision(this,polygons[i]);
      }
    }
    this.col = false;
  }
  polygon.prototype.move = function(x,y){
    for(var i = 0; i < this.numSides + 1; i++){
      this.x[i] += x;
      this.y[i] += y;
    }
  }

  polygon.prototype.delete = function() {
    var indexToDelete = polygons.indexOf(this);
    polygons.splice(indexToDelete, 1);
    deleted += 1;
  }

  function renderObject(object) {
    deleted = 0;
    for (var i = 0; i < object.length; i++) {
      deleted = 0;
      object[i].render();
      i -= deleted;
    }
  }

  polygons.push(new polygon('rgb(0,255,0)',0,0,300,100,325,150,375,150,400,125,350,90,false));
  polygons.push(new polygon('rgb(255,0,0)',0,0,100,80,125,10,150,80,125,150,false));
  polygons.push(new polygon('rgb(0,0,255)',0,0,400,300,500,300,450,350,false));
  polygons.push(new polygon('rgb(0,255,255)',0,0,100,200,200,200,200,300,100,300,false));
  moveObject = polygons[0];
  function refresh(){
    draw.clearRect(0, 0, gameArea.width, gameArea.height);
    renderObject(polygons);
    window.requestAnimationFrame(refresh);
  }
  window.requestAnimationFrame(refresh);
}

draw();
