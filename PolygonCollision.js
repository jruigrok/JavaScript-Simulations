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
var speed = 500;
var colPresicion = 0.05;
var hitboxes = [];
var pressedKeys = [];
var collisions = [];
var groups = [];
var debugMode = true;
var debugColor = 'rgb(0,255,0)';
var objects = [];
var mouseDown = false;
var mouseX = 0;
var mouseY = 0;
var click = false;
var Xinfo = [];
var Yinfo = [];
var mode = 'polygon';
var r = 1;
var debugObjects = [];
var t = 0;
var energyLoss = .6;
var pause = true;

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

  gameArea.addEventListener('mousemove', function(e) {
    getMousePosition('gameArea', e);
  });

  window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
  window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random()*16)];
    }
    return color;
  }

  function drawCircle(x, y, r, c,fill) {
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineWidth = 1;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = c;
    if(fill){
      ctx.fill();
    }
    ctx.stroke();
  }

  function drawPolygon(x,y,c,fill){
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.moveTo(x[0],y[0]);
    for(var i = 1; i < x.length; i++){
      ctx.lineTo(x[i],y[i]);
    }
    if(fill){
      ctx.fillStyle = c;
      ctx.fill();
    }
    ctx.stroke();
  }

  function debug(){
    if(debugMode){
      if(!click && mouseDown){
        click++;
        if(mode == 'polygon'){
          Xinfo.push(mouseX);
          Yinfo.push(mouseY);
        }else{
          Xinfo = mouseX;
          Yinfo = mouseY;
        }        
      }
      if(pressedKeys[32]){
        if(pressedKeys[17]){
          for(var i = 0; i < debugObjects.length; i++){
            if(debugObjects[i].type == 'debugPolygon'){
              console.log('[' + debugObjects[i].x + ']' + ',' + '[' + debugObjects[i].y + ']');
            }else{
              console.log(debugObjects[i].x + ','+ debugObjects[i].y + ',' + debugObjects[i].r);
            } 
          }
        }else{
          if(mode == 'polygon'){
            console.log('[' + Xinfo + ']' + ',' + '[' + Yinfo + ']');
          }else{
            console.log(Xinfo + ','+ Yinfo + ',' + r);
          }
        }
        pressedKeys[32] = false;
      }
      if(pressedKeys[8]){
        if(pressedKeys[17]){
          debugObjects.pop();
        }else{
          if(mode == 'polygon'){
            Xinfo = [];
            Yinfo = [];
          }else{
            Xinfo = 0;
            Yinfo = 0;
          }
          r = 1;
        }
        pressedKeys[8] = false;
      }
      if(pressedKeys[67]){
        Xinfo = undefined;
        Yinfo = undefined;
        r = 1;
        mode = 'circle';
        pressedKeys[67] = false;
      }
      if(pressedKeys[80]){
        Xinfo = [];
        Yinfo = [];
        mode = 'polygon';
        pressedKeys[80] = false;
      }
      if(pressedKeys[187]){
        r++;
        pressedKeys[187] = false;
      }
      if(pressedKeys[189] && r > 1){
        r--;
        pressedKeys[189] = false;
      }
      if(pressedKeys[13]){
        console.log('X: ' + mouseX + ' Y: ' + mouseY);
        pressedKeys[13] = false;
      }
      if(pressedKeys[16]){
        if(mode == 'polygon'){
          if(!isNaN(Xinfo[0])){
            if(Xinfo.length > 2){
              debugObjects.push(new debugPolygon(Xinfo,Yinfo));
              pressedKeys[8] = true;
            }else{
              console.log('you must have 3 or more points');
            }
          }else{
            console.log('no values entered');
          }
        }
        if(mode == 'circle'){
          if(!isNaN(Xinfo)){
            debugObjects.push(new debugCircle(Xinfo,Yinfo,r));
            pressedKeys[8] = true;
          }else{
            console.log('no values entered');
          }
        }
        pressedKeys[16] = false;
      }
      drawCircle(mouseX,mouseY,5,debugColor,mouseDown);
      if(mode == 'polygon'){
        if(Xinfo.length > 1){
          Xinfo.push(Xinfo[0]);
          Yinfo.push(Yinfo[0]);
          drawPolygon(Xinfo,Yinfo,debugColor,false);
          Xinfo.pop();
          Yinfo.pop();
        }
      }else{
        if(!isNaN(Xinfo) && !isNaN(Yinfo)){
          drawCircle(Xinfo,Yinfo,r,debugColor,false);
        }
      }
      for(var i = 0; i < hitboxes.length; i++){
        hitboxes[i].drawBounds();
      }
      if(pressedKeys[78]){
        if(pause){
          pause = false;
          
        }else{
          pause = true;
        }
        pressedKeys[78] = false;
      }
    }
  }

  var debugPolygon = function(x,y){
    this.x = x;
    this.y = y;
    this.type = 'debugPolygon';
  }

  debugPolygon.prototype.render = function(){
    this.x.push(this.x[0]);
    this.y.push(this.y[0]);
    drawPolygon(this.x,this.y,debugColor,false);
    this.x.pop();
    this.y.pop();
  }

  debugPolygon.prototype.delete = function() {
    var indexToDelete = debugPolygons.indexOf(this);
    debugPolygons.splice(indexToDelete, 1);
    deleted += 1;
  }

  var debugCircle = function(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
    this.type = 'debugCircle';
  }

  debugCircle.prototype.render = function(){
    drawCircle(this.x,this.y,this.r,debugColor,false);
  }

  debugCircle.prototype.delete = function() {
    var indexToDelete = debugCircles.indexOf(this);
    debugCircles.splice(indexToDelete, 1);
    deleted += 1;
  }

  function checkObjects(ob1,ob2){
    if(!(ob1.maxX >= ob2.maxX && ob2.maxX <= ob1.minX || ob2.minX >= ob1.maxX && ob2.maxX >= ob1.maxX || ob1.maxY >= ob2.maxY && ob2.maxY <= ob1.minY || ob2.minY >= ob1.maxY && ob2.maxY >= ob1.maxY) && !pause){
      if(ob2.col != ob1.ID && ob2.ID != ob1.ID && ob2.colType != 'none' && ob1.anchorObj != ob2.anchorObj){
        if(ob1.anchorObj.group == false || ob2.anchorObj.group == false){
          detectCollision(ob1,ob2);
        }else if(ob1.anchorObj.group != ob2.anchorObj.group){
          detectCollision(ob1,ob2);
        }
      }
    }
  }

  function detectCollision(ob1,ob2){
    if(ob1.type == 'circleHitBox' && ob2.type == 'circleHitBox'){
      var dx = ob2.x - ob1.x;
      var dy = ob2.y - ob1.y;
      var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      if(d + colPresicion < ob1.r + ob2.r){
        var s = (ob1.r + ob2.r) - d;
        var nx = dx/d;
        var ny = dy/d;
        var a = Math.atan(dy/dx);
        collisions.push(new collision(ob1,ob2,s,-nx,ny,(Math.cos(a) * ob1.r) + ob1.x ,(Math.sin(a) * ob1.r) + ob1.y));
        collisions[collisions.length - 1].resolve();
      }
    }else if(ob1.type == 'polygonHitBox' && ob2.type == 'polygonHitBox'){
      var smallestOverlap = Infinity;
      var cx = 0;
      var cy = 0;
      var col = true;
      var X = 0;
      var Y = 0;
      var pointX = 0;
      var pointY = 0;
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
          var dy = (gameArea.height - ob2.y[j - ob1.numSides]) - (gameArea.height - ob2.y[j - ob1.numSides + 1]);
          var dx = ob2.x[j - ob1.numSides] - ob2.x[j - ob1.numSides + 1];
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
            X = ob1GX;
          }else{
            var overlap = ob2GX - ob1SX;
            X = ob1SX;
          }
          if(Math.abs(overlap) < Math.abs(smallestOverlap)){
            smallestOverlap = overlap;
            cx = ax;
            cy = ay;
            pointX = X;
          }
        }
      } 
      if(col){
        collisions.push(new collision(ob1,ob2,smallestOverlap,cx,cy,pointX,100));
        collisions[collisions.length - 1].resolve();
      }
    }else if((ob1.type == 'circleHitBox' && ob2.type == 'polygonHitBox') || (ob2.type == 'circleHitBox' && ob1.type == 'polygonHitBox')){
      var col = true;
      var closestX = -Infinity;
      var closestY = -Infinity;
      var sideCol = false;
      var inside = 0;
      var overlap = Infinity;
      var d = Infinity;
      var cx = 0;
      var cy = 0;
      if(ob1.type == 'circleHitBox'){
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
          if(Math.floor(PolygonSX) == Math.floor(newPolygonX[i])){
            if(newCircleY < newY2 && newCircleY > newY && newCircleX < newPolygonX[i]){
              sideCol = true;
            }
          }else{
            if(newCircleY < newY2 && newCircleY > newY && newCircleX > newPolygonX[i]){
              sideCol = true;
            }
          }
          if(newCircleX < PolygonGX && newCircleX > PolygonSX){
            inside += 1;
            if(Math.abs(newCircleX - PolygonGX) > Math.abs(newCircleX - PolygonSX)){
              var closestPolygon = PolygonSX;
              var closestCircle = CircleGX;
            }else{
              var closestPolygon = PolygonGX;
              var closestCircle = CircleSX;
            }
            overlap = closestPolygon - closestCircle;
            if(Math.abs(d) > Math.abs(overlap)){
              d = overlap;
              cx = -ax;
              cy = -ay;
            }
          }
          if(sideCol && col || inside == Polygon.numSides){
            if(inside != Polygon.numSides){
              if(Math.abs(newCircleX - PolygonGX) > Math.abs(newCircleX - PolygonSX)){
                var closestPolygon = PolygonSX;
                var closestCircle = CircleGX;
              }else{
                var closestPolygon = PolygonGX;
                var closestCircle = CircleSX;
              }
              d = closestPolygon - closestCircle;
              cx = -ax;
              cy = -ay;
              break;
            }else{
              break;
            }
          }
        }
      }
      if(col && sideCol || inside == Polygon.numSides){

        collisions.push(new collision(Polygon,Circle,d,cx,cy,200,200));
        collisions[collisions.length - 1].resolve();
      }else if(col){
        for(var i = 0; i < Polygon.numSides; i++){
          var x = Math.pow(Circle.x - Polygon.x[i],2);
          var y = Math.pow(Circle.y - Polygon.y[i],2);
          if(x + y < Math.pow(Circle.x - closestX,2) + Math.pow(Circle.y - closestY,2)){
            closestX = Polygon.x[i];
            closestY = Polygon.y[i];
            pointNum = i;
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
          collisions.push(new collision(Polygon,Circle,Circle.r - d,-dx/d,-dy/d,Polygon.x[i],Polygon.y[i]));
          collisions[collisions.length - 1].resolve();
        }
      }
    }else if(ob1.type == 'pointHitBox' && ob2.type == 'circleHitBox' || ob2.type == 'pointHitBox' && ob1.type == 'circleHitBox'){
      if(ob1.type == 'circleHitBox'){
        var Circle = ob1;
        var Point = ob2;
      }else{
        var Circle = ob2;
        var Point = ob1;
      }
      var dx = Circle.x - Point.x;
      var dy = Circle.y - Point.y;
      var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      if(d + colPresicion < Circle.r){
        var s = (Circle.r) - d;
        var nx = dx/d;
        var ny = dy/d;
        collisions.push(new collision(Point,Circle,s,-nx,ny,Point.x,Point.y));
        collisions[collisions.length - 1].resolve();
      }
    }else if(ob1.type == 'pointHitBox' && ob2.type == 'polygonHitBox' || ob2.type == 'pointHitBox' && ob1.type == 'polygonHitBox'){
      var col = true;
      var closestPolygon = 0;
      var d = 0;
      var closestD = Infinity;
      var cx = 0;
      var cy = 0;
      if(ob1.type == 'pointHitBox'){
        var Point = ob1;
        var Polygon = ob2;
      }else{
        var Point = ob2;
        var Polygon = ob1;
      }
      for(var i = 0; i < Polygon.numSides; i++){
        var dy = (gameArea.height - Polygon.y[i]) - (gameArea.height - Polygon.y[i + 1]);
        var dx = Polygon.x[i] - Polygon.x[i + 1];
        var s = dy / dx;
        var a = Math.atan(-1/s);
        var newPolygonX = [];
        var ax = Math.cos(a);
        var ay = Math.sin(a);
        var newPointX = (Point.x * ax) - (Point.y * ay);
        for(var j = 0; j < Polygon.numSides; j++){
          newPolygonX[j] = (Polygon.x[j] * ax) - (Polygon.y[j] * ay);
        }
        var PolygonGX = Math.max(...newPolygonX);
        var PolygonSX = Math.min(...newPolygonX);
        if(newPointX > PolygonGX || newPointX < PolygonSX){
          col = false;
          break;
        }else{
          if(Math.abs(newPointX - PolygonGX) > Math.abs(newPointX - PolygonSX)){
            closestPolygon = PolygonSX;
          }else{
            closestPolygon = PolygonGX;
          }
          d = closestPolygon - newPointX;
          if(Math.abs(d) < Math.abs(closestD)){
            closestD = d;
            cx = -ax;
            cy = -ay;
          }
        } 
      }
      if(col){
        collisions.push(new collision(Polygon,Point,closestD,cx,cy,Point.x,Point.y));
        collisions[collisions.length - 1].resolve();
      }
    }
  }

  var collision = function(ob1,ob2,overlap,cx,cy,x,y){
    this.ob1 = ob1;
    this.ob2 = ob2;
    this.overlap = overlap;
    this.cx = cx;
    this.cy = cy;
    this.x = x;
    this.y = y;
    this.ob1.collisions.push(new collisionInfo(ob1,ob2,cx,-cy));
    this.ob2.collisions.push(new collisionInfo(ob2,ob1,-cx,cy));
  }

  collision.prototype.resolve = function(){
    //drawCircle(this.x,this.y,2,'rgb(255,255,255)',true);
    this.ob1.col = this.ob2.ID;
    this.ob2.col = this.ob1.ID;
    let k = -2 * ((this.ob2.anchorObj.xVel - this.ob1.anchorObj.xVel) * this.cx + (this.ob2.anchorObj.yVel - this.ob1.anchorObj.yVel) * -this.cy) / (1 / this.ob2.m + 1 / this.ob1.m);
    let k2 = -2 * ((this.ob2.anchorObj.xVel - this.ob1.anchorObj.xVel) * this.cx + (this.ob2.anchorObj.yVel - this.ob1.anchorObj.yVel) * -this.cy);
    if(this.ob1.colType != 'noResolve' && this.ob2.colType != 'noResolve'){
      if(this.ob1.colType == 'static' && this.ob2.colType == 'static'){
        if(this.ob1.colPriority < this.ob2.colPriority){
          this.ob2.anchorObj.move(-(this.overlap * this.cx),-(this.overlap * -this.cy));
        }else{
          this.ob1.anchorObj.move((this.overlap * this.cx),(this.overlap * -this.cy)); 
        }
      }else if(this.ob1.colType == 'static'){
        this.ob2.anchorObj.move(-(this.overlap * this.cx),-(this.overlap * -this.cy));
      }else if(this.ob2.colType == 'static'){
        this.ob1.anchorObj.move((this.overlap * this.cx),(this.overlap * -this.cy));
      }else{
        this.ob2.anchorObj.move(-(this.overlap * this.cx)/2,-(this.overlap * -this.cy)/2);
        this.ob1.anchorObj.move((this.overlap * this.cx)/2,(this.overlap * -this.cy)/2);
      }
      if(this.ob1.colType == 'bounce'){
        if(this.ob2.colType != 'bounce'){
          this.ob1.anchorObj.xVel -= (k2 * this.cx) * this.ob2.bounciness;
          this.ob1.anchorObj.yVel -= (k2 * -this.cy) * this.ob2.bounciness;
        }else{
          this.ob1.anchorObj.xVel -= (k * this.cx / this.ob1.m) * this.ob2.bounciness;
          this.ob1.anchorObj.yVel -= (k * -this.cy / this.ob1.m) * this.ob2.bounciness;
        }
      }
      if(this.ob2.colType == 'bounce'){
        if(this.ob1.colType != 'bounce'){
          this.ob2.anchorObj.xVel += (k2 * this.cx) * this.ob1.bounciness;
          this.ob2.anchorObj.yVel += (k2 * -this.cy) * this.ob1.bounciness;
        }else{
          this.ob2.anchorObj.xVel += (k * this.cx / this.ob2.m) * this.ob1.bounciness;
          this.ob2.anchorObj.yVel += (k * -this.cy / this.ob2.m) * this.ob1.bounciness;
        }
      }
    }
  }

  collision.prototype.delete = function() {
    var indexToDelete = collisions.indexOf(this);
    collisions.splice(indexToDelete, 1);
    deleted += 1;
  }

  var collisionInfo = function(ob1,ob2,ax,ay){
    this.ob1 = ob1;
    this.ob2 = ob2;
    this.ax = ax;
    this.ay = ay;
  }

  var polygonHitBox = function(anchorObj,fit,m,colType,x,y){
    this.fit = fit;
    this.anchorObj = anchorObj;
    if(this.fit){
      if(anchorObj.type == 'image'){
        this.x = [anchorObj.x,anchorObj.x + anchorObj.w,anchorObj.x + anchorObj.w,anchorObj.x];
        this.y = [anchorObj.y,anchorObj.y,anchorObj.y + anchorObj.h,anchorObj.y + anchorObj.h];
      }else{
        this.x = anchorObj.x;
        this.y = anchorObj.y;
      }
      this.dx = 0;
      this.dy = 0;
    }else{
      this.x = x;
      this.y = y;
      if(anchorObj.type == 'circle' || anchorObj.type == 'image' || anchorObj.type == 'blank'){
        this.dx = anchorObj.x - this.x[0];
        this.dy = anchorObj.y - this.y[0];
      }else if(anchorObj.type == 'polygon'){
        this.dx = anchorObj.x[0] - this.x[0];
        this.dy = anchorObj.y[0] - this.y[0];
      }
    }
    this.col = false;
    this.numSides = this.x.length;
    this.type = 'polygonHitBox';
    this.x.push(this.x[0]);
    this.y.push(this.y[0]);
    this.m = m;
    this.colType = colType;
    this.ID = hitboxes.length - 1;
    this.colPriority = this.ID;
    this.anchorObj.addObject(this);
    this.collisions = [];
    this.bounciness = 1;
    this.area = 0;  
    this.COMx = 0;
    this.COMy = 0;
    this.getMinMax();
    this.centerOfMass();
    this.COMdx = this.COMx - this.x[0];
    this.COMdy = this.COMy - this.y[0];
  }

  polygonHitBox.prototype.centerOfMass = function(){
    if(this.numSides > 3){
      var x = ((this.maxX - this.minX)/2) + this.minX;
      var y = ((this.maxY - this.minY)/2) + this.minY;
      var areas = [];
      var COMXs = [];
      var COMYs = [];
      for(var i = 0; i < this.numSides; i++){
        var dxa = x - this.x[i];
        var dya = y - this.y[i];
        var dxb = x - this.x[i + 1];
        var dyb = y - this.y[i + 1];
        areas.push(Math.abs(((dxa * dyb) - (dxb * dya))/2));
        COMXs.push((this.x[i] + this.x[i+1] + x)/3);
        COMYs.push((this.y[i] + this.y[i+1] + y)/3);
      }
      this.area = 0;
      for(var i = 0; i < areas.length; i++){
        this.area += areas[i];
      }
      this.COMx = 0;
      this.COMy = 0;
      for(var i = 0; i < COMXs.length; i++){
        this.COMx += (COMXs[i] * areas[i]);
        this.COMy += (COMYs[i] * areas[i]);
      }
      this.COMx /= this.area;
      this.COMy /= this.area;
    }else{
      this.COMx = (this.x[0] + this.x[1] + this.x[2])/3;
      this.COMy = (this.y[0] + this.y[1] + this.y[2])/3;
      var dxa = this.x[2] - this.x[0];
      var dya = this.y[2] - this.y[0];
      var dxb = this.x[2] - this.x[1];
      var dyb = this.y[2] - this.y[1];
      this.area = Math.abs(((dxa * dyb) - (dxb * dya))/2);
    }
  }

  polygonHitBox.prototype.render = function(){
    if(this.colType != 'none'){
      for(var i = 0; i < hitboxes.length; i++){
        checkObjects(this,hitboxes[i]);
      } 
    }
  }

  polygonHitBox.prototype.drawBounds = function(){
    drawPolygon(this.x,this.y,debugColor,this.fill);
  }

  polygonHitBox.prototype.move = function(x,y){
    for(var i = 0; i < this.numSides + 1; i++){
      this.x[i] += x;
      this.y[i] += y;
    }
    this.COMx += x;
    this.COMy += y;
    this.getMinMax();
  }

  polygonHitBox.prototype.moveTo = function(x,y){
    var dx = this.x[0] - x;
    var dy = this.y[0] - y;
    for(var i = 0; i < this.numSides + 1; i++){
      this.x[i] -= dx;
      this.y[i] -= dy;
    }
    this.COMx = this.x[0] + this.COMdx;
    this.COMy = this.y[0] + this.COMdy;
    this.getMinMax();
  }

  polygonHitBox.prototype.getMinMax = function(){
    this.maxX = Math.max(...this.x);
    this.minX = Math.min(...this.x);
    this.maxY = Math.max(...this.y);
    this.minY = Math.min(...this.y);
  }

  polygonHitBox.prototype.delete = function() {
    var indexToDelete = hitboxes.indexOf(this);
    hitboxes.splice(indexToDelete, 1);
    deleted += 1;
  }

  var circleHitBox = function(anchorObj,fit,m,colType,x,y,r){
    this.fit = fit;
    this.anchorObj = anchorObj;
    if(this.fit){
      this.x = anchorObj.x;
      this.y = anchorObj.y;
      this.r = anchorObj.r;
      this.dx = 0;
      this.dy = 0;
    }else{
      this.x = x;
      this.y = y;
      this.r = r;
      if(anchorObj.type == 'circle' || anchorObj.type == 'image' || anchorObj.type == 'blank'){
        this.dx = anchorObj.x - this.x;
        this.dy = anchorObj.y - this.y;
      }else if(anchorObj.type == 'polygon'){
        this.dx = anchorObj.x[0] - this.x;
        this.dy = anchorObj.y[0] - this.y;
      }
    }
    this.col = false;
    this.type = 'circleHitBox';
    this.m = m;
    this.colType = colType;
    this.ID = hitboxes.length - 1;
    this.colPriority = this.ID;
    this.anchorObj.addObject(this);
    this.collisions = [];
    this.bounciness = 1;
    this.COMx = this.x;
    this.COMy = this.y;
    this.getMinMax();
  }

  circleHitBox.prototype.render = function(){
    for(var i = 0; i < hitboxes.length; i++){
      checkObjects(this,hitboxes[i]);
    }
  }

  circleHitBox.prototype.drawBounds = function(){
    drawCircle(this.x,this.y,this.r,debugColor,false);
  }

  circleHitBox.prototype.move = function(x,y){
    this.x += x;
    this.y += y;
    this.COMx = this.x;
    this.COMy = this.y;
    this.getMinMax();
  }

  circleHitBox.prototype.moveTo = function(x,y){
    this.x = x;
    this.y = y;
    this.COMx = this.x;
    this.COMy = this.y;
    this.getMinMax();
  }

  circleHitBox.prototype.getMinMax = function(){
    this.maxX = this.x + this.r;
    this.minX = this.x - this.r;
    this.maxY = this.y + this.r;
    this.minY = this.y - this.r;
  }

  circleHitBox.prototype.delete = function() {
    var indexToDelete = hitboxes.indexOf(this);
    hitboxes.splice(indexToDelete, 1);
    deleted += 1;
  }

  var pointHitBox = function(anchorObj,fit,m,colType,x,y){
    this.fit = fit;
    this.anchorObj = anchorObj;
    this.x = x;
    this.y = y;
    if(this.fit){
      this.x = anchorObj.x;
      this.y = anchorObj.y;
      this.dx = 0;
      this.dy = 0;
    }else{
      if(anchorObj.type == 'circle' || anchorObj.type == 'image' || anchorObj.type == 'blank'){
        this.dx = anchorObj.x - this.x;
        this.dy = anchorObj.y - this.y;
      }else if(anchorObj.type == 'polygon'){
        this.dx = anchorObj.x[0] - this.x;
        this.dy = anchorObj.y[0] - this.y;
      }
    }
    this.col = false;
    this.type = 'pointHitBox';
    this.m = m;
    this.colType = colType;
    this.ID = hitboxes.length - 1;
    this.colPriority = this.ID;
    this.anchorObj.addObject(this);
    this.collisions = [];
    this.bounciness = 1;
    this.getMinMax();
  }

  pointHitBox.prototype.render = function(){
    for(var i = 0; i < hitboxes.length; i++){
      checkObjects(this,hitboxes[i]);
    } 
  }

  pointHitBox.prototype.drawBounds = function(){
    ctx.beginPath();
    ctx.fillStyle = debugColor;
    ctx.fillRect(this.x,this.y,1,1); 
    ctx.stroke();
    drawCircle(this.x,this.y,5,debugColor,false);
  }

  pointHitBox.prototype.move = function(x,y){
    this.x += x;
    this.y += y;
    this.getMinMax();
  }

  pointHitBox.prototype.moveTo = function(x,y){
    this.x = x;
    this.y = y;
    this.getMinMax();
  }

  pointHitBox.prototype.getMinMax = function(){
    this.maxX = this.x;
    this.minX = this.x;
    this.maxY = this.y;
    this.minY = this.y;
  }

  var circle = function(x,y,r,c,layer){
    this.x = x;
    this.y = y;
    this.c = c;
    this.r = r; 
    this.fill = true;
    this.xVel = 0;
    this.yVel = 0;
    this.ax = 0;
    this.ay = 0;
    this.objects = [];
    this.layer = layer;
    this.type = 'circle';
    this.timeChange = t;
    this.group = false;
  }

  circle.prototype.render = function(){
    var time = t - this.timeChange;
    this.timeChange = t;
    this.xVel += this.ax * time/100;
    this.yVel += this.ay * time/100;
    this.move(this.xVel * time/100,this.yVel * time/100);
    drawCircle(this.x,this.y,this.r,this.c,this.fill);
  }

  circle.prototype.addObject = function(object){
    this.objects.push(object);
  }

  circle.prototype.moveTo = function(x,y){
    this.x = x;
    this.y = y;
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].moveTo(this.x - this.objects[i].dx,this.y - this.objects[i].dy);
    }
  }

  circle.prototype.move = function(x,y){
    this.x += x;
    this.y += y;
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].moveTo(this.x - this.objects[i].dx,this.y - this.objects[i].dy);
    }
  }

  circle.prototype.delete = function() {
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].delete();
    }
    var indexToDelete = objects.indexOf(this);
    objects.splice(indexToDelete, 1);
    deleted += 1;
  }

  var polygon = function(x,y,c,layer){
    this.x = x;
    this.y = y;
    this.c = c; 
    this.fill = true;
    this.xVel = 0;
    this.yVel = 0;
    this.ax = 0;
    this.ay = 0;
    this.objects = [];
    this.layer = layer;
    this.type = 'polygon';
    this.timeChange = t;
    this.group = false;
  }

  polygon.prototype.render = function(){
    var time = t - this.timeChange;
    this.timeChange = t;
    this.xVel += this.ax * time/100;
    this.yVel += this.ay * time/100;
    this.move(this.xVel * time/100,this.yVel * time/100);
    drawPolygon(this.x,this.y,this.c,this.fill);
  }

  polygon.prototype.moveTo = function(x,y){
    var dx = this.x[0] - x;
    var dy = this.y[0] - y;
    for(var i = 0; i < this.x.length; i++){
      this.x[i] -= dx;
      this.y[i] -= dy;
    }
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].moveTo(this.x[0] - this.objects[i].dx,this.y[0] - this.objects[i].dy);
    }
  }

  polygon.prototype.move = function(x,y){
    for(var i = 0; i < this.x.length; i++){
      this.x[i] += x;
      this.y[i] += y;
    }
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].moveTo(this.x[0] - this.objects[i].dx,this.y[0] - this.objects[i].dy);
    }
  }

  polygon.prototype.addObject = function(object){
    this.objects.push(object);
  }

  polygon.prototype.delete = function() {
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].delete();
    }
    var indexToDelete = objects.indexOf(this);
    objects.splice(indexToDelete, 1);
    deleted += 1; 
  }

  var image = function(img,x,y,w,h,layer){
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.layer = layer;
    this.xVel = 0;
    this.yVel = 0;
    this.ax = 0;
    this.ay = 0;
    this.objects = [];
    this.type = 'image';
    this.timeChange = t;
    this.group = false;
  }

  image.prototype.render = function(){
    var time = t - this.timeChange;
    this.timeChange = t;
    this.xVel += this.ax * time/100;
    this.yVel += this.ay * time/100;
    this.move(this.xVel * time/100,this.yVel * time/100);
    ctx.drawImage(this.img,this.x,this.y,this.w,this.h);
  }

  image.prototype.addObject = function(object){
    this.objects.push(object);
  }

  image.prototype.moveTo = function(x,y){
    this.x = x;
    this.y = y;
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].moveTo(this.x - this.objects[i].dx,this.y - this.objects[i].dy);
    }
  }

  image.prototype.move = function(x,y){
    this.x += x;
    this.y += y;
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].moveTo(this.x - this.objects[i].dx,this.y - this.objects[i].dy);
    }
  }

  image.prototype.delete = function() {
    var indexToDelete = objects.indexOf(this);
    objects.splice(indexToDelete, 1);
    deleted += 1;
    for(var i = 0; i < objects.length; i++){
      objects[i].delete;
    }
  }

  var blank = function(x,y,layer){
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.fill = true;
    this.xVel = 0;
    this.yVel = 0;
    this.ax = 0;
    this.ay = 0;
    this.objects = [];
    this.type = 'blank';
    this.timeChange = t;
    this.group = false;
  }

  blank.prototype.render = function(){
    var time = t - this.timeChange;
    this.timeChange = t;
    this.xVel += this.ax * time/100;
    this.yVel += this.ay * time/100;
    this.move(this.xVel * time/100,this.yVel * time/100);
  }

  blank.prototype.addObject = function(object){
    this.objects.push(object);
  }

  blank.prototype.moveTo = function(x,y){
    this.x = x;
    this.y = y;
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].moveTo(this.x - this.objects[i].dx,this.y - this.objects[i].dy);
    }
  }

  blank.prototype.move = function(x,y){
    this.x += x;
    this.y += y;
    for(var i = 0; i < this.objects.length; i++){
      //this.objects[i].moveTo(this.x - this.objects[i].dx,this.y - this.objects[i].dy);
    }
  }

  blank.prototype.delete = function() {
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].delete();
    }
    var indexToDelete = objects.indexOf(this);
    objects.splice(indexToDelete, 1);
    deleted += 1;
  }

  var group = function(objects){
    this.objects = objects;
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].group = this;
    }
    this.xVel = 0;
    this.yVel = 0;
    this.ax = 0;
    this.ay = 0;
    this.timeChange = t;
  }

  group.prototype.render = function(){
    var time = t - this.timeChange;
    this.timeChange = t;
    this.xVel += this.ax * time/100;
    this.yVel += this.ay * time/100;
    this.move(this.xVel * time/100,this.yVel * time/100);
  }

  group.prototype.move = function(x,y){
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].move(x,y);
    }
  }

  group.prototype.delete = function() {
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].group = false;
    }
    var indexToDelete = groups.indexOf(this);
    groups.splice(indexToDelete, 1);
    deleted += 1; 
  }

  function resetCollisions(){
    collisions = [];
    for(var i = 0; i < hitboxes.length; i++){
      hitboxes[i].col = -1;
      hitboxes[i].collisions = [];
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

  function regularPolygon(x,y,r,c,layer,n,dirz){
    var X = [];
    var Y = [];
    var a = 0;
    for(var i = 0; i < n; i++){
      X[i] = (Math.sin(a + dirz) * r + x);
      Y[i] = (Math.cos(a + dirz) * r + y);
      a += (Math.PI * 2)/n; 
    }
    objects.push(new polygon(X,Y,c,layer));
  }
  objects.push(new polygon([0,gameArea.width,gameArea.width,0],[gameArea.height,gameArea.height,gameArea.height-50,gameArea.height-50],'rgb(255,0,0)',1));
  hitboxes.push(new polygonHitBox(objects[0],true,1,'static'));
  objects.push(new polygon([0,50,50,0],[gameArea.height,gameArea.height,0,0],'rgb(255,0,0)',1));
  hitboxes.push(new polygonHitBox(objects[1],true,1,'static'));
  objects.push(new polygon([gameArea.width,gameArea.width-50,gameArea.width-50,gameArea.width],[gameArea.height,gameArea.height,0,0],'rgb(255,0,0)',1));
  hitboxes.push(new polygonHitBox(objects[2],true,1,'static'));
  objects.push(new polygon([0,gameArea.width,gameArea.width,0],[0,0,50,50],'rgb(255,0,0)',1));
  hitboxes.push(new polygonHitBox(objects[3],true,1,'static'));
  objects.push(new polygon([0,gameArea.width/2 - 100,0],[gameArea.height/2 + 100,gameArea.height,gameArea.height],'rgb(0,255,0)',1));
  hitboxes.push(new polygonHitBox(objects[4],true,1,'static'));
  objects.push(new polygon([gameArea.width,gameArea.width/2 + 100,gameArea.width],[gameArea.height/2 + 100,gameArea.height,gameArea.height],'rgb(0,255,0)',1));
  hitboxes.push(new polygonHitBox(objects[5],true,1,'static'));
  for(var i = 0; i < 6; i++){
    hitboxes[i].bounciness = .6;
  }
  groups.push(new group(objects.slice(0,6)));
  for(var i = 0; i < 100; i++){
    var r = getRndInteger(5,12);
    objects.push(new circle(getRndInteger(70,gameArea.width-70),getRndInteger(70,gameArea.height-370),r,generateRandomColor(),0));
    hitboxes.push(new circleHitBox(objects[objects.length - 1],true,Math.pow(r,2),'bounce'));
    objects[objects.length - 1].ay = 500;
    hitboxes[hitboxes.length-1].bounciness = 1;
    r = getRndInteger(5,12);
    regularPolygon(getRndInteger(70,gameArea.width-70),getRndInteger(70,gameArea.height-370),r,generateRandomColor(),0,getRndInteger(3,8),getRndInteger(0,Math.PI*200)/100);
    hitboxes.push(new polygonHitBox(objects[objects.length - 1],true,Math.pow(r,2),'bounce'));
    objects[objects.length - 1].ay = 500;
    hitboxes[hitboxes.length-1].bounciness = 1;
  }

  var time = setInterval(Timer, 10);

  function Timer() {
    if(!pause){
      t++;
    }
  }

  function refresh(){
    draw.clearRect(0, 0, gameArea.width, gameArea.height);
    renderObject(groups);
    renderObject(objects);
    renderObject(hitboxes);
    renderObject(debugObjects);
    moveObject(objects[0]);
    debug();

    //put collision based reactions here

    resetCollisions();
    window.requestAnimationFrame(refresh);
  }
  window.requestAnimationFrame(refresh);
}

draw();