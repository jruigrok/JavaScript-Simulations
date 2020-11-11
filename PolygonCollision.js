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
var speed = 2;
var colPresicion = 0.4;
var hitboxes = [];
var test = true;
var pressedKeys = [];
var collisions = [];
var debug = true;
var debugColor = 'rgb(0,255,0)';
var objects = [];
var canada = new Image();
canada.src = 'Images/Among_Us_Character.png';

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
    ctx.fillStyle = c;
    if(fill){
      ctx.fill();
    }
    ctx.stroke();
  }

  function checkObjects(obj){
    for(var i = 0; i < hitboxes.length; i++){
      if(!(obj.maxX >= hitboxes[i].maxX && hitboxes[i].maxX <= obj.minX || hitboxes[i].minX >= obj.maxX && hitboxes[i].maxX >= obj.maxX || obj.maxY >= hitboxes[i].maxY && hitboxes[i].maxY <= obj.minY || hitboxes[i].minY >= obj.maxY && hitboxes[i].maxY >= obj.maxY)){
        if(hitboxes[i].col != obj.ID && hitboxes[i].ID != obj.ID && hitboxes[i].colType != 'none' && obj.anchorObj != hitboxes[i].anchorObj){
          detectCollision(obj,hitboxes[i]);
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
        collisions.push(new collision(ob1,ob2,s,-nx,ny));
        collisions[collisions.length - 1].resolve();
      }

    }else if(ob1.type == 'polygonHitBox' && ob2.type == 'polygonHitBox'){
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
        collisions.push(new collision(ob1,ob2,smallestOverlap,cx,cy));
        collisions[collisions.length - 1].resolve();
      }
    }
    if((ob1.type == 'circleHitBox' && ob2.type == 'polygonHitBox') || (ob2.type == 'circleHitBox' && ob1.type == 'polygonHitBox')){
      var col = true;
      var closestX = -Infinity;
      var closestY = -Infinity;
      var sideCol = false;
      var inside = 0;
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
          }
          if(sideCol && col || col && inside == Polygon.numSides){
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
      if(col && sideCol || inside == Polygon.numSides){
        collisions.push(new collision(Polygon,Circle,d,cx,cy));
        collisions[collisions.length - 1].resolve();
      }else if(col){
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
          collisions.push(new collision(Polygon,Circle,Circle.r - d,-dx/d,-dy/d));
          collisions[collisions.length - 1].resolve();
        }
      }
    }
  }

  var collision = function(ob1,ob2,overlap,cx,cy){
    this.ob1 = ob1;
    this.ob2 = ob2;
    this.overlap = overlap;
    this.cx = cx;
    this.cy = cy;
  }

  collision.prototype.resolve = function(){
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
          this.ob1.anchorObj.xVel -= k2 * this.cx;
          this.ob1.anchorObj.yVel -= k2 * -this.cy;
        }else{
          this.ob1.anchorObj.xVel -= k * this.cx / this.ob1.m;
          this.ob1.anchorObj.yVel -= k * -this.cy / this.ob1.m;
        }
      }
      if(this.ob2.colType == 'bounce'){
        if(this.ob1.colType != 'bounce'){
          this.ob2.anchorObj.xVel += k2 * this.cx;
          this.ob2.anchorObj.yVel += k2 * -this.cy;
        }else{
          this.ob2.anchorObj.xVel += k * this.cx / this.ob2.m;
          this.ob2.anchorObj.yVel += k * -this.cy / this.ob2.m;
        }
      }
    }
  }

  collision.prototype.delete = function() {
    var indexToDelete = collisions.indexOf(this);
    collisions.splice(indexToDelete, 1);
    deleted += 1;
  }

  var polygonHitBox = function(anchorObj,fit,m,colType,x,y){
    this.fit = fit;
    this.anchorObj = anchorObj;
    if(this.fit){
      this.x = anchorObj.x;
      this.y = anchorObj.y;41
      this.dx = 0;
      this.dy = 0;
    }else{
      this.x = x;
      this.y = y;
      if(anchorObj.type == 'circle' || anchorObj.type == 'image'){
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
    this.maxX = Math.max(...this.x);
    this.minX = Math.min(...this.x);
    this.maxY = Math.max(...this.y);
    this.minY = Math.min(...this.y);
    this.x.push(this.x[0]);
    this.y.push(this.y[0]);
    this.m = m;
    this.colType = colType;
    this.ID = hitboxes.length - 1;
    this.colPriority = this.ID;
    this.anchorObj.addObject(this);
  }

  polygonHitBox.prototype.render = function(){
    if(this.colType != 'none'){
      checkObjects(this);
      checkBoarders(this);
    }
    if(debug){
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = debugColor;
      ctx.lineCap = 'round';
      ctx.moveTo(this.x[0],this.y[0]);
      for(var i = 1; i < this.x.length; i++){
        ctx.lineTo(this.x[i],this.y[i]);
      }
      ctx.fillStyle = debugColor;
      ctx.stroke();
    }
  }

  polygonHitBox.prototype.move = function(x,y){
    for(var i = 0; i < this.numSides + 1; i++){
      this.x[i] += x;
      this.y[i] += y;
    }
    this.getMinMax();
  }

  polygonHitBox.prototype.moveTo = function(x,y){
    var dx = this.x[0] - x;
    var dy = this.y[0] - y;
    for(var i = 0; i < this.numSides + 1; i++){
      this.x[i] -= dx;
      this.y[i] -= dy;
    }
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
      if(anchorObj.type == 'circle' || anchorObj.type == 'image'){
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
    this.maxX = this.x + this.r;
    this.minX = this.x - this.r;
    this.maxY = this.y + this.r;
    this.minY = this.y - this.r;
    this.ID = hitboxes.length - 1;
    this.colPriority = this.ID;
    this.anchorObj.addObject(this);
  }

  circleHitBox.prototype.render = function(){
    if(this.colType != 'none'){
      checkObjects(this);
      checkBoarders(this);
    }
    if(debug){
      drawCircle(this.x,this.y,this.r,debugColor,false);
    }
  }

  circleHitBox.prototype.move = function(x,y){
    this.x += x;
    this.y += y;
    this.getMinMax();
  }

  circleHitBox.prototype.moveTo = function(x,y){
    this.x = x;
    this.y = y;
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
  }

  circle.prototype.render = function(){
    this.xVel += this.ax;
    this.yVel += this.ay;
    this.move(this.xVel,this.yVel);
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
  }

  polygon.prototype.render = function(){
    this.xVel += this.ax;
    this.yVel += this.ay;
    this.move(this.xVel,this.yVel);
    ctx.beginPath();
    ctx.strokeStyle = this.c;
    ctx.fillStyle = this.c;
    ctx.moveTo(this.x[0],this.y[0]);
    for(var i = 1; i < this.x.length; i++){
      ctx.lineTo(this.x[i],this.y[i]);
    } 
    ctx.fill();
    ctx.stroke();
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
  }

  image.prototype.render = function(){
    this.xVel += this.ax;
    this.yVel += this.ay;
    this.move(this.xVel,this.yVel);
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

  function resetCollisions(){
    collisions = [];
    for(var i = 0; i < hitboxes.length; i++){
      hitboxes[i].col = -1;
    }
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

  //objects.push(new polygon([100,200,300,200],[100,100,200,250],'rgb(255,0,0)',0));
  //objects.push(new image(canada,50,50,50,50,0));
  //hitboxes.push(new circleHitBox(objects[0],false,1,'move',150,150,100));
  //objects.push(new circle(300,300,50,'rgb(0,0,255)',0));
  //hitboxes.push(new polygonHitBox(objects[1],false,1,'static',[200,300,400,300],[200,200,300,350]));
  //hitboxes.push(new polygonHitBox(objects[0],false,1,'static',[200,300,400,300],[200,200,300,350]));
  for(var i = 0; i < 100; i++){
    objects.push(new circle(gameArea.width/2 + getRndInteger(-20,20),gameArea.height/2 + getRndInteger(-20,20),getRndInteger(10,20),'rgb(255,0,0)',0));
    hitboxes.push(new circleHitBox(objects[objects.length - 1],true,1,'move'));
    regularPolygon(gameArea.width/2,gameArea.height/2,getRndInteger(10,20),'rgb(255,0,0)',0,getRndInteger(3,8),getRndInteger(0,Math.PI*200)/100);
    hitboxes.push(new polygonHitBox(objects[objects.length - 1],true,1,'move'));
  }

  function refresh(){
    draw.clearRect(0, 0, gameArea.width, gameArea.height);
    renderObject(objects);
    renderObject(hitboxes);

    //put collision based reactions here
    resetCollisions();
    moveObject(objects[0]);
    window.requestAnimationFrame(refresh);
  }
  window.requestAnimationFrame(refresh);
}

draw();