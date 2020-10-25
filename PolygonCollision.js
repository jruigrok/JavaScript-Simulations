var deleted = 0;
var polygons = [];
var circles = [];
var moveObject = 0;
var speed = 2;
var colPresicion = 0.4;
function draw() {

  gameArea.width = window.innerWidth;
  gameArea.height = window.innerHeight;
  var ctx = gameArea.getContext('2d');

  if (gameArea.getContext) {
    var draw = gameArea.getContext('2d');
  }

  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 37) {moveObject.xVel = -speed; }
    if (e.keyCode == 39) {moveObject.xVel = speed; }
    if (e.keyCode == 38) {moveObject.yVel = -speed; }
    if (e.keyCode == 40) {moveObject.yVel = speed; }
  })
  window.addEventListener('keyup', function (e) {
    if (e.keyCode == 37 || e.keyCode == 39) {moveObject.xVel = 0; }
    if (e.keyCode == 38 || e.keyCode == 40) {moveObject.yVel = 0; }
  })

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function drawCircle(x, y, r, c) {
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineWidth = r;
    ctx.arc(x, y, r / 2, 0, 2 * Math.PI);
    ctx.stroke();
  }

  function checkObjects(obj){
    for(var i = 0; i < polygons.length; i++){
      if(polygons[i].col != obj && polygons[i] != obj && polygons[i].colType != 'none' && this.col != polygons[i]){
        collision(obj,polygons[i]);
      }
    }
    for(var i = 0; i < circles.length; i++){
      if(circles[i].col != obj && circles[i] != obj && polygons[i].colType != 'none'){
        collision(obj,circles[i]);
      }
    }
  }

  function collision(ob1,ob2){
    if(ob1.type == 'circle' && ob2.type == 'circle'){
      let dx = ob2.x - ob1.x;
      let dy = ob2.y - ob1.y;
      let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      if(d < ob1.r + ob2.r){
        let s = (ob1.r + ob2.r) - d;
        let nx = dx/d;
        let ny = dy/d;
        resolveCollision(ob1,ob2,s,nx,ny);
      }

    }else if(ob1.type == 'polygon' && ob2.type == 'polygon'){
      var smallestOverlap = Infinity;
      var cx = 0;
      var cy = 0;
      var col = true;
      if(ob1.maxX >= ob2.maxX && ob2.maxX <= ob1.minX){
        col = false;
      }else if(ob2.minX >= ob1.maxX && ob2.maxX >= ob1.maxX){
        col = false;
      }else if(ob1.maxY >= ob2.maxY && ob2.maxY <= ob1.minY){
        col = false;
      }else if(ob2.minY >= ob1.maxY && ob2.maxY >= ob1.maxY){
        col = false;
      }
      for(var j = 0; j < ob1.numSides + ob2.numSides; j++){
        if(col){
          var newOb1X = [];
          var newOb2X = [];
          if(j < ob1.numSides){
            var dy = (gameArea.height - ob1.y[j]) - (gameArea.height - ob1.y[j + 1]);
            var dx = ob1.x[j] - ob1.x[j + 1];
          }else{
            var dy = (gameArea.height - ob2.y[(j - ob1.numSides)]) - (gameArea.height - ob2.y[(j - ob1.numSides) + 1]);
            var dx = ob2.x[(j - ob1.numSides)] - ob2.x[(j - ob1.numSides) + 1];
          }
          var s = dy / dx;
          var a = Math.atan(-1/s);
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
          if((ob1GX - colPresicion <= ob2SX && ob1SX - colPresicion <= ob2GX) || (ob2GX - colPresicion <= ob1SX && ob2SX - colPresicion <= ob1GX)){
            col = false;
            break;
          }else{
            if(Math.abs(ob2SX - ob1GX) <= Math.abs(ob2GX - ob1SX)){
              var overlap = ob2SX - ob1GX;
            }else{
              var overlap = ob2GX - ob1SX;
            }
            if(Math.abs(overlap) < Math.abs(smallestOverlap)){
              smallestOverlap = overlap;
              cx = Math.cos(a);
              cy = Math.sin(a);
            }
          }
        }
      } 
      if(col){
        console.log(col);
        resolveCollision(ob1,ob2,smallestOverlap,cx,cy)
      }
    }
    /*if((ob1.type == 'circle' && ob2.type == 'polygon') || (ob2.type == 'circle' && ob1.type == 'polygon')){
      var smallestOverlap = Infinity;
      var cx = 0;
      var cy = 0;
      var col = true;
      if(ob1.type == 'circle'){
        var Circle = ob1;
        var Polygon = ob2;
      }else{
        var Circle = ob2;
        var Polygon = ob1;
      }
      //console.log(Circle);
      //console.log(Polygon);
      for(j = 0; j < Polygon.numSides; j++){
        var newPolygonX = [];
        var newCircleX = 0;
        var dy = (gameArea.height - Circle.y) - (gameArea.height - Polygon.y[j]);
        var dx = Circle.x - Polygon.x[j];
        var s = dy / dx;
        var a = Math.atan(-1/s);
        for(var i = 0; i < Polygon.numSides; i++){
          newPolygonX.push((Polygon.x[i] * Math.cos(a)) - (Polygon.y[i] * Math.sin(a)));
        }
        newCircleX = ((Circle.x * Math.cos(a)) - (Circle.y * Math.sin(a)));

        var polygonGX = Math.max(...newPolygonX);
        var polygonSX = Math.min(...newPolygonX);

        //console.log(newCircleX + ',' + polygonGX + ',' + polygonSX);

        if(newCircleX - Circle.r > polygonGX || newCircleX + Circle.r < polygonSX){
          col = false;
          break;
        }else{
          if(Math.abs((newCircleX - Circle.r) - polygonGX) < Math.abs((newCircleX + Circle.r) - polygonSX)){
            var overlap = (newCircleX - Circle.r) - polygonGX;
          }else{
            var overlap = (newCircleX + Circle.r) - polygonSX;
          }
          if(Math.abs(overlap) < Math.abs(smallestOverlap)){
            smallestOverlap = overlap;
            cx = Math.cos(a);
            cy = Math.sin(a);
          }
        }
      }
      if(col){
        //console.log(col);
        //resolveCollision(ob1,ob2,smallestOverlap,cx,cy)
      }
    }*/
  }
  

  function resolveCollision(ob1,ob2,overlap,cx,cy){
    ob1.col = ob2;
    ob2.col = ob1;
    let k = -2 * ((ob2.xVel - ob1.xVel) * cx + (ob2.yVel - ob1.yVel) * -cy) / (1 / ob2.m + 1 / ob1.m);
    let k2 = -2 * ((ob2.xVel - ob1.xVel) * cx + (ob2.yVel - ob1.yVel) * -cy);
    if(ob1.colType == 'static'){
      ob2.move(-(overlap * cx),-(overlap * -cy));
    }else if(ob2.colType == 'static'){
      ob1.move((overlap * cx),(overlap * -cy)); 
    }else{
      ob2.move(-(overlap * cx)/2,-(overlap * -cy)/2);
      ob1.move((overlap * cx)/2,(overlap * -cy)/2);
    }

    if(ob1.colType == 'bounce'){
      if(ob2.colType != 'bounce'){
        ob1.xVel -= k2 * cx;
        ob1.yVel -= k2 * -cy;
      }else{
        ob1.xVel -= k * cx / ob1.m;
        ob1.yVel -= k * -cy / ob1.m;
      }
    }
    if(ob2.colType == 'bounce'){
      if(ob1.colType != 'bounce'){
        ob2.xVel += k2 * cx;
        ob2.yVel += k2 * -cy;
      }else{
        ob2.xVel += k * cx / ob2.m;
        ob2.yVel += k * -cy / ob2.m;
      }
    }
  }

  var polygon = function(color,xVel,yVel,x,y,m,colType){
    this.color = color;
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.col = false;
    this.numSides = (this.x.length);
    this.type = 'polygon';
    this.maxX = Math.max(...x);
    this.minX = Math.min(...x);
    this.maxY = Math.max(...y);
    this.minY = Math.min(...y);
    this.x.push(this.x[0]);
    this.y.push(this.y[0]);
    this.m = m;
    this.colType = colType;
  }

  polygon.prototype.render = function(){
    ctx.lineWidth = 1;
    if(this.colType != 'none'){
      checkObjects(this);
      checkBoarders(this);
    }
    this.move(this.xVel,this.yVel);
    this.col = false;
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineCap = 'round';
    ctx.moveTo(this.x[0],this.y[0]);
    for(var i = 1; i < this.x.length; i++){
      ctx.lineTo(this.x[i],this.y[i]);
    }
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }

  polygon.prototype.move = function(x,y){
    for(var i = 0; i < this.numSides + 1; i++){
      this.x[i] += x;
      this.y[i] += y;
    }
    this.maxX = Math.max(...this.x);
    this.minX = Math.min(...this.x);
    this.maxY = Math.max(...this.y);
    this.minY = Math.min(...this.y);
  }

  polygon.prototype.delete = function() {
    var indexToDelete = polygons.indexOf(this);
    polygons.splice(indexToDelete, 1);
    deleted += 1;
  }

  function checkBoarders(obj){
      if(obj.minY < 0){
        obj.move(0,-obj.minY);
        if(obj.colType == 'bounce'){
          obj.yVel *= -1;
        }
      }
      if(obj.maxY > gameArea.height){
        obj.move(0,gameArea.height - obj.maxY); 
        if(obj.colType == 'bounce'){
          obj.yVel *= -1;
        }      
      }
      if(obj.maxX > gameArea.width){
        obj.move(gameArea.width - obj.maxX,0); 
        if(obj.colType == 'bounce'){
          obj.xVel *= -1;
        }      
      }
      if(obj.minX < 0){
        obj.move(-obj.minX,0); 
        if(obj.colType == 'bounce'){
          obj.xVel *= -1;
        }      
      }
  }

  var circle = function(x,y,xVel,yVel,r,c,m,colType){
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.r = r;
    this.c = c;
    this.col = false;
    this.type = 'circle';
    this.m = m;
    this.colType = colType;
    this.maxX = this.x + this.r;
    this.minX = this.x - this.r;
    this.maxY = this.y + this.r;
    this.minY = this.y - this.r;
  }

  circle.prototype.render = function(){
    this.move(this.xVel,this.yVel);
    checkObjects(this);
    drawCircle(this.x,this.y,this.r,this.c);
  }

  circle.prototype.move = function(x,y){
    this.x += x;
    this.y += y;
    this.maxX = this.x + this.r;
    this.minX = this.x - this.r;
    this.maxY = this.y + this.r;
    this.minY = this.y - this.r;
  }

  circle.prototype.delete = function() {
    var indexToDelete = circles.indexOf(this);
    circles.splice(indexToDelete, 1);
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

  function regularPolygon(xVel,yVel,x,y,r,c,n,dirz,colType){
    var X = [];
    var Y = [];
    var a = 0;
    for(var i = 0; i < n; i++){
      X[i] = (Math.sin(a + dirz) * r + x);
      Y[i] = (Math.cos(a + dirz) * r + y);
      a += (Math.PI * 2)/n; 
    }
    polygons.push(new polygon(c,xVel,yVel,X,Y,r * r,colType));
  }

  regularPolygon(0,0,gameArea.width/2,gameArea.height/2,50,'rgb(0,255,0)',4,0,'static');
  for(var i = 0; i < 10; i++){
    regularPolygon(getRndInteger(-5,5),getRndInteger(-5,5),gameArea.width/2,gameArea.height/2,getRndInteger(20,50),'rgb(255,0,0)',getRndInteger(3,10),getRndInteger(0,Math.PI*200)/100,'bounce');
  }
  //circles.push(new circle(250,150,-1,0,20,'rgb(255,0,0)',Math.PI * 400,'bounce'));
  moveObject = polygons[0];
  function refresh(){
    draw.clearRect(0, 0, gameArea.width, gameArea.height);
    renderObject(circles);
    renderObject(polygons);
    window.requestAnimationFrame(refresh);
  }
  window.requestAnimationFrame(refresh);
}

draw();