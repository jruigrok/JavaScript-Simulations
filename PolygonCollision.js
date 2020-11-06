/*
Copyright (c) 2020 Jordan Ruigrok

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var deleted = 0;
var speed = 1;
var colPresicion = 0.4;
var hitboxes = [];
var test = true;
var pressedKeys = [];
var hitBoxColor = 'rgb(255,0,0)';
var debug = true;
function draw() {
  gameArea.width = window.innerWidth;
  gameArea.height = window.innerHeight;
  var ctx = gameArea.getContext('2d');

  if (gameArea.getContext) {
    var draw = gameArea.getContext('2d');
  }

  function moveObject(obj){
    if(pressedKeys[37]){
        obj.xVel = -speed;
    }
    if(pressedKeys[39]){
        obj.xVel = speed;
    }
    if(pressedKeys[38]){
        obj.yVel = -speed;
    }
    if(pressedKeys[40]){
        obj.yVel = speed;
    }
    if(!pressedKeys[37] && !pressedKeys[39]){
        obj.xVel = 0;
    }
    if(!pressedKeys[38] && !pressedKeys[40]){
        obj.yVel = 0;
    }
  }

  window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
  window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function drawCircle(x, y, r, c,fill) {
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineWidth = 1;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    if(fill){
      ctx.fill();
    }
    ctx.stroke();
  }

  function checkObjects(obj){
    for(var i = 0; i < hitboxes.length; i++){
      if(!(obj.maxX >= hitboxes[i].maxX && hitboxes[i].maxX <= obj.minX || hitboxes[i].minX >= obj.maxX && hitboxes[i].maxX >= obj.maxX || obj.maxY >= hitboxes[i].maxY && hitboxes[i].maxY <= obj.minY || hitboxes[i].minY >= obj.maxY && hitboxes[i].maxY >= obj.maxY)){
        if(hitboxes[i].col != obj.ID && hitboxes[i].ID != obj.ID && hitboxes[i].colType != 'none' && this.col != hitboxes[i].ID && obj.layer == hitboxes[i].layer){
          collision(obj,hitboxes[i]);
        }
      }
    }
  }

  function collision(ob1,ob2){
    if(ob1.type == 'circle' && ob2.type == 'circle'){
      var dx = ob2.x - ob1.x;
      var dy = ob2.y - ob1.y;
      var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      if(d + colPresicion < ob1.r + ob2.r){
        var s = (ob1.r + ob2.r) - d;
        var nx = dx/d;
        var ny = dy/d;
        resolveCollision(ob1,ob2,s,-nx,ny);
      }

    }else if(ob1.type == 'polygon' && ob2.type == 'polygon'){
      var smallestOverlap = Infinity;
      var cx = 0;
      var cy = 0;
      var col = true;
      for(var j = 0; j < ob1.numSides + ob2.numSides; j++){
        if(!col){
          break;
        }
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
        var ax = Math.cos(a);
        var ay = Math.sin(a);
        for(var i = 0; i < ob1.numSides; i++){
          newOb1X.push((ob1.x[i] * ax) - (ob1.y[i] * ay));
        }
        for(var i = 0; i < ob2.numSides; i++){
          newOb2X.push((ob2.x[i] * ax) - (ob2.y[i] * ay));
        }
        var ob1GX = Math.max(...newOb1X);
        var ob1SX = Math.min(...newOb1X);
        var ob2GX = Math.max(...newOb2X);
        var ob2SX = Math.min(...newOb2X);
        if((ob1GX - colPresicion <= ob2SX && ob1SX - colPresicion <= ob2GX) || (ob2GX - colPresicion <= ob1SX && ob2SX - colPresicion <= ob1GX)){
          col = false;
          break;
        }else{
          if(Math.abs(ob2SX - ob1GX) < Math.abs(ob2GX - ob1SX)){
            var overlap = ob2SX - ob1GX;
          }else{
            var overlap = ob2GX - ob1SX;
          }
          if(Math.abs(overlap) < Math.abs(smallestOverlap)){
            smallestOverlap = overlap;
            cx = ax;
            cy = ay;
          }
        }
      } 
      if(col){
        resolveCollision(ob1,ob2,smallestOverlap,cx,cy)
      }
    }
    if((ob1.type == 'circle' && ob2.type == 'polygon') || (ob2.type == 'circle' && ob1.type == 'polygon')){
      var col = true;
      var closestX = -Infinity;
      var closestY = -Infinity;
      var sideCol = false;
      if(ob1.type == 'circle'){
        var Circle = ob1;
        var Polygon = ob2;
      }else{
        var Circle = ob2;
        var Polygon = ob1;
      }
      for(var i = 0; i < Polygon.numSides; i++){
        var dy = (gameArea.height - Polygon.y[i]) - (gameArea.height - Polygon.y[i + 1]);
        var dx = Polygon.x[i] - Polygon.x[i + 1];
        var s = dy / dx;
        var a = Math.atan(-1/s);
        var newPolygonX = [];
        var newPolygonY = [];
        var smallestOverlap = Infinity;
        var ax = Math.cos(a);
        var ay = Math.sin(a);
        var newCircleX = (Circle.x * ax) - (Circle.y * ay);
        var newCircleY = (Circle.x * ay) + (Circle.y * ax);
        for(var j = 0; j < Polygon.numSides; j++){
          newPolygonX[j] = (Polygon.x[j] * ax) - (Polygon.y[j] * ay);
          newPolygonY[j] = (Polygon.x[j] * ay) + (Polygon.y[j] * ax);
        }
        newPolygonY[newPolygonY.length] = (Polygon.x[0] * ay) + (Polygon.y[0] * ax);
        var PolygonGX = Math.max(...newPolygonX);
        var PolygonSX = Math.min(...newPolygonX);
        var CircleGX = newCircleX + Circle.r;
        var CircleSX = newCircleX - Circle.r;
        if((PolygonGX - colPresicion <= CircleSX && PolygonSX - colPresicion <= CircleGX) 
        || (CircleGX - colPresicion <= PolygonSX && CircleSX - colPresicion <= PolygonGX)){
          col = false;
          break;
        }else{
          var newY = newPolygonY[i];
          var newY2 = newPolygonY[i + 1];
          if(newY2 < newY){
            var mem = newY2;
            newY2 = newY;
            newY = mem;
          }
          /*console.log('i:' + newPolygonX[i]);
          console.log('gx: ' + PolygonGX);
          console.log('sx: ' + PolygonSX);
          console.log('circleX: ' + newCircleX);*/
          if(Math.floor(PolygonSX) == Math.floor(newPolygonX[i])){
            if(newCircleY < newY2 && newCircleY > newY && newCircleX < newPolygonX[i]){
              sideCol = true;
            }
          }else if(Math.floor(PolygonGX) == Math.floor(newPolygonX[i])){
            if(newCircleY < newY2 && newCircleY > newY && newCircleX > newPolygonX[i]){
              sideCol = true;
            }
          }else if(Circle.y < Polygon.maxY && Circle.y > Polygon.minY && Circle.x < Polygon.maxX && Circle.x > Polygon.minX){
            sideCol = true;
          }
          if(sideCol && col){
            if(Math.abs(newCircleX - PolygonGX) > Math.abs(newCircleX - PolygonSX)){
              var closestPolygon = PolygonSX;
              var closestCircle = CircleGX;
            }else{
              var closestPolygon = PolygonGX;
              var closestCircle = CircleSX;
            }
            var d = closestPolygon - closestCircle;
            var cx = -ax;
            var cy = -ay;
            break;
          }
        }
      }
      if(col && sideCol){
        resolveCollision(Polygon,Circle,d,cx,cy);
      }
      if(col && !sideCol){
        for(var i = 0; i < Polygon.numSides; i++){
          var x = Math.pow(Circle.x - Polygon.x[i],2);
          var y = Math.pow(Circle.y - Polygon.y[i],2);
          if(x + y < Math.pow(Circle.x - closestX,2) + Math.pow(Circle.y - closestY,2)){
            closestX = Polygon.x[i];
            closestY = Polygon.y[i];
          }
        }
  
        var col = true
        var dy = (gameArea.height - Circle.y) - (gameArea.height - closestY);
        var dx = Circle.x - closestX;
        var s = dy / dx;
        var a = Math.atan(s);
        var ax = Math.cos(a);
        var ay = Math.sin(a);
        var newPolygonX = (closestX * ax) - (closestY * ay);
        var newCircleX = (Circle.x * ax) - (Circle.y * ay);
        var d = Math.sqrt(Math.pow(Circle.x - closestX,2) + Math.pow(Circle.y - closestY,2));
        if(Math.abs(Circle.r/2 - d) + colPresicion > Math.abs(Circle.r)/2){
          col = false;
        }
        if(col){
          resolveCollision(Polygon,Circle,Circle.r - d,-dx/d,-dy/d);
        }
      }
    }
  }
  
  function resolveCollision(ob1,ob2,overlap,cx,cy){
    ob1.col = ob2.ID;
    ob2.col = ob1.ID;
    let k = -2 * ((ob2.xVel - ob1.xVel) * cx + (ob2.yVel - ob1.yVel) * -cy) / (1 / ob2.m + 1 / ob1.m);
    let k2 = -2 * ((ob2.xVel - ob1.xVel) * cx + (ob2.yVel - ob1.yVel) * -cy);
    if(ob1.colType != 'noResolve' && ob2.colType != 'noResolve'){
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
  }

  var polygon = function(x,y,colType,m,xVel,yVel,layer){
    this.x = x;
    this.y = y;
    this.col = false;
    this.numSides = (this.x.length);
    this.type = 'polygon';
    this.maxX = Math.max(...x);
    this.minX = Math.min(...x);
    this.maxY = Math.max(...y);
    this.minY = Math.min(...y);
    this.x.push(this.x[0]);
    this.y.push(this.y[0]);
    this.colType = colType;
    this.ID = hitboxes.length - 1;
    if(isNaN(layer)){
      this.layer = 0;
    }else{
      this.layer = layer;
    }
    if(isNaN(m)){
      this.m = 1;
    }else{
      this.m = m;
    }
    if(isNaN(yVel)){
      this.yVel = 0;
    }else{
      this.yVel = yVel;
    }
    if(isNaN(xVel)){
      this.xVel = 0;
    }else{
      this.xVel = xVel;
    }
  }

  polygon.prototype.render = function(){
    this.move(this.xVel,this.yVel);
    if(this.colType != 'none'){
      checkObjects(this);
    }
    if(debug){
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = hitBoxColor;
      ctx.lineCap = 'round';
      ctx.moveTo(this.x[0],this.y[0]);
      for(var i = 1; i < this.x.length; i++){
        ctx.lineTo(this.x[i],this.y[i]);
      }
      ctx.stroke();
    }
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
    var indexToDelete = hitboxes.indexOf(this);
    hitboxes.splice(indexToDelete, 1);
    deleted += 1;
  }

  var circle = function(x,y,r,colType,m,xVel,yVel,layer){
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = false;
    this.type = 'circle';
    this.colType = colType;
    this.maxX = this.x + this.r;
    this.minX = this.x - this.r;
    this.maxY = this.y + this.r;
    this.minY = this.y - this.r;
    this.ID = hitboxes.length - 1;
    if(isNaN(layer)){
      this.layer = 0;
    }else{
      this.layer = layer;
    }
    if(isNaN(m)){
      this.m = 1;
    }else{
      this.m = m;
    }
    if(isNaN(yVel)){
      this.yVel = 0;
    }else{
      this.yVel = yVel;
    }
    if(isNaN(xVel)){
      this.xVel = 0;
    }else{
      this.xVel = xVel;
    }
  }

  circle.prototype.render = function(){
    this.move(this.xVel,this.yVel);
    if(this.colType != 'none'){
      checkObjects(this);
    }
    if(debug){
      drawCircle(this.x,this.y,this.r,hitBoxColor,false);
    }
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
    var indexToDelete = hitboxes.indexOf(this);
    hitboxes.splice(indexToDelete, 1);
    deleted += 1;
  }

  function resetCollisions(){
    for(var i = 0; i < hitboxes.length; i++){
      hitboxes[i].col = -1;
    }
  }

  function renderObject(object) {
    deleted = 0;
    for (var i = 0; i < object.length; i++) {
      deleted = 0;
      object[i].render();
      i -= deleted;
    }
  }

  function regularPolygon(x,y,xVel,yVel,r,colType,layer,m,n,dirz){
    var X = [];
    var Y = [];
    var a = 0;
    for(var i = 0; i < n; i++){
      X[i] = (Math.sin(a + dirz) * r + x);
      Y[i] = (Math.cos(a + dirz) * r + y);
      a += (Math.PI * 2)/n; 
    }
    hitboxes.push(new polygon(X,Y,colType,m,xVel,yVel,layer));
  }
  //hitboxes.push(new polygon([100,150,200],[100,150,100],'static',1,0,0,0));
  //hitboxes.push(new circle(200,200,25,'move',1,0,0,0));
  hitboxes.push(new polygon([0,0,50,50],[0,gameArea.height,gameArea.height,0],'static',1,0,0,0));
  hitboxes.push(new polygon([gameArea.width,gameArea.width,gameArea.width - 50,gameArea.width - 50],[0,gameArea.height,gameArea.height,0],'static',1,0,0,0));
  hitboxes.push(new polygon([0,gameArea.width - 100,gameArea.width - 100,0],[0,0,50,50],'static',1,0,0,0));
  hitboxes.push(new polygon([0,gameArea.width - 100,gameArea.width - 100,0],[gameArea.height,gameArea.height,gameArea.height - 50,gameArea.height - 50],'static',1,0,0,0));


  for(var i = 0 ; i < 50; i++){
    regularPolygon(getRndInteger(gameArea.width - 100,100),getRndInteger(gameArea.height - 100,100),getRndInteger(-3,3),getRndInteger(-3,3),getRndInteger(15,30),'bounce',0,1,getRndInteger(3,8),getRndInteger(31415,0)/1000);
    hitboxes.push(new circle(getRndInteger(gameArea.width - 100,100),getRndInteger(gameArea.height - 100,100),getRndInteger(15,30),'bounce',1,getRndInteger(-3,3),getRndInteger(-3,3),0));
  }
  function refresh(){
    draw.clearRect(0, 0, gameArea.width, gameArea.height);
    renderObject(hitboxes);
    //put collision based reactions here
    resetCollisions();
    moveObject(hitboxes[0]);
    window.requestAnimationFrame(refresh);
  }
  window.requestAnimationFrame(refresh);
}

draw();