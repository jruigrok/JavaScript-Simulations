//dont change these values
var particles = [];
var walls = [];
var sliders = [];
var time = 0;
var mouseDown = false;
var mouseX = 0;
var mouseY = 0;
var click = false;
var pause = false;
var menu = false;
var deleted = 0;
var newRadius = 25;
var newVelocity = 3;
var newAngle = 180;
var selected = 'none';
var mode = 'select';

function draw() {

  gameArea.width = window.innerWidth;
  gameArea.height = window.innerHeight;
  var ctx = gameArea.getContext('2d');

  if (gameArea.getContext) {
    var draw = gameArea.getContext('2d');
  }
  ctx.textBaseline = "top";
  var gh = gameArea.height;
  var gw = gameArea.width;


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


  gameArea.addEventListener('mousemove', function(e) {
    getMousePosition('gameArea', e);
  });


  function drawCircle(x, y, r, c) {
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineWidth = r;
    ctx.arc(x, y, r / 2, 0, 2 * Math.PI);
    ctx.stroke();
  }


  function Sbutton(x1, y1, x2, y2) {
    if (mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2) {
      return true;
    } else {
      return false;
    }
  }

  function Cbutton(x, y, r) {
    if (Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2)) <= r) {
      return true;
    } else {
      return false;
    }
  }


  var slider = function(x, y, x2, min, max, knobX) {
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.min = min;
    this.max = max;
    this.knobX = knobX;
    this.click = false;
  }

  slider.prototype.render = function() {
    if (Cbutton(this.knobX, this.y, 8) && mouseDown && !this.click) {
      this.click = true;
    }
    if (Cbutton(this.knobX, mouseY, 8) && this.click) {
      if (this.knobX >= this.x && this.knobX <= this.x2) {
        this.knobX = mouseX;
      }
      if (this.knobX < this.x) {
        this.knobX = this.x;
      } else if (this.knobX > this.x2) {
        this.knobX = this.x2;
      }
    }
    if (!mouseDown) {
      this.click = false;
    }
    if (!menu) {
      this.delete();
    }
    ctx.beginPath();
    ctx.strokeStyle = '#1b1b2f';
    ctx.lineCap = "round";
    ctx.lineWidth = 6;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x2, this.y);
    ctx.stroke();
    drawCircle(this.knobX, this.y, 5, '#1f4068');
    ctx.textAlign = "end";
    ctx.font = "bold 10px Arial";
    ctx.fillStyle = '#1b1b2f';
    ctx.fillText(this.min, this.x - 5, this.y - 5);
    ctx.textAlign = "start";
    ctx.fillText(this.max, this.x2 + 5, this.y - 5);
    ctx.textAlign = "center";
    if (sliders[0] == this) {
      ctx.fillText(Math.floor(newRadius), this.knobX, this.y - 15);
    } else if (sliders[1] == this) {
      ctx.fillText(newVelocity, this.knobX, this.y - 15);
    } else {
      ctx.fillText(newAngle, this.knobX, this.y - 15);
    }

  }

  slider.prototype.changeVar = function() {
    return this.knobX - this.x;
  }

  slider.prototype.delete = function() {
    var indexToDelete = sliders.indexOf(this);
    sliders.splice(indexToDelete, 1);
    deleted += 1;
  }

  function createparticle() {
    if (mouseDown && !click && mouseX <= gw - 100 && mouseX >= 100 && mouseY <= gh - 100 && mouseY >= 100 && !(gw - 250 <= mouseX && mouseY <= 350) && mode == 'spawn') {
      particles.push(new particle(mouseX, mouseY, newAngle / 180 * Math.PI, newVelocity, newRadius, "#e43f5a", 'bounce'));
      click = true;
    }
  }

  function renderMenu() {
    ctx.beginPath();
    ctx.fillStyle = '#e43f5a';
    ctx.fillRect(gw - 250, 50, 200, 300);
    ctx.textBaseline = "top";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "start";
    ctx.fillStyle = '#1b1b2f';
    ctx.fillText("Settings", gw - 205, 55);
    ctx.font = "bold 20px Arial";
    ctx.fillText("Radius:", gw - 235, 100);
    ctx.fillText("Angle:", gw - 235, 140);
    ctx.fillText("Velocity:", gw - 235, 180);
    ctx.textAlign = 'center';
    ctx.font = "bold 20px Arial";

    ctx.fillText("Mode", gw - 150, 210);
    if (mode == 'select') {
      ctx.fillRect(gw - 242, 238, 84, 34);
      ctx.fillRect(gw - 140, 240, 80, 30);
    } else {
      ctx.fillRect(gw - 240, 240, 80, 30);
      ctx.fillRect(gw - 142, 238, 84, 34);
    }
    ctx.font = "bold 15px Arial";
    ctx.fillStyle = '#e43f5a';
    ctx.fillText("Select", gw - 200, 247.5);
    ctx.fillText("Spawn", gw - 100, 247.5);
    ctx.stroke();
    if (Sbutton(gw - 240, 240, gw - 160, 275) && mouseDown && !click) {
      click = true;
      mode = 'select';
    } else if (Sbutton(gw - 140, 240, gw - 60, 275) && mouseDown && !click) {
      click = true;
      mode = 'spawn';
    }
    newRadius = sliders[0].changeVar() / 1.5 + 10;
    newVelocity = Math.floor(sliders[1].changeVar() / 5);
    newAngle = sliders[2].changeVar() * 6;
  }

  function settings() {
    drawCircle(gw - 25, 25, 10, '#e43f5a');
    if (Sbutton(gw - 60, 15, gw - 45, 35) && mouseDown && !click) {
      if (pause) {
        --pause;
      } else {
        ++pause;
      }
      click = true;
    }
    if (Cbutton(gw - 25, 25, 10) && mouseDown && !click) {
      if (!menu) {
        ++menu;
        sliders.push(new slider(gw - 135, 110, gw - 75, 10, 50, gw - 150 + newRadius * 1.5));
        sliders.push(new slider(gw - 135, 190, gw - 75, 0, 12, gw - 135 + newVelocity * 5));
        sliders.push(new slider(gw - 135, 150, gw - 75, 0, 360, gw - 135 + newAngle / 6));
      } else {
        --menu;
      }
      click = true;

    }
    if (menu) {
      renderMenu();
    }
    if (!pause) {
      ctx.fillStyle = '#e43f5a';
      ctx.fillRect(gw - 50, 15, 5, 20);
      ctx.fillRect(gw - 60, 15, 5, 20);
    } else {
      ctx.fillStyle = '#e43f5a';
      ctx.beginPath();
      ctx.moveTo(gw - 60, 15);
      ctx.lineTo(gw - 60, 35);
      ctx.lineTo(gw - 45, 25);
      ctx.fill();
    }
    ctx.lineCap = "butt";
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = '#e43f5a';
    ctx.textAlign = "start";
    ctx.fillText("Particle Collision Simulator", 10, 10);
    ctx.stroke;
  }

  var particle = function(x, y, angle, speed, r, color, colType) {
    this.x = x;
    this.y = y;
    this.yVel = Math.sin(angle) * speed;
    this.xVel = Math.cos(angle) * speed;
    this.r = r;
    this.color = color;
    this.spawnTime = time;
    this.ID = particles.length;
    this.m = Math.PI * Math.pow(this.r, 2);
    this.ax = 0;
    this.ay = 0;
    this.col = false;
    this.colType = colType;
    this.selected = false;
  }



  particle.prototype.render = function() {
    if (this.selected) {
      drawCircle(this.x, this.y, this.r + 5, 'rgb(0,0,0)');
    }
    drawCircle(this.x, this.y, this.r, this.color);

    if (!pause) {
      this.xVel += this.ax;
      this.yVel += this.ay;
      for (var i = 0; i < particles.length; i++) {
        if (particles[i].ID != this.ID && this.col != particles[i]) {
          let dx = particles[i].x - this.x;
          let dy = particles[i].y - this.y;
          let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
          if (d < this.r + particles[i].r) {
            this.particleCollision(this, particles[i], dx, dy, d);
          }
        }
      }
      this.x += this.xVel;
      this.wallCollision('x');
      this.y += this.yVel;
      this.wallCollision('y');
      this.col = false;
    }
    if (Cbutton(this.x, this.y, this.r) && mouseDown && !click && mode == 'select') {
      if (this.selected) {
        this.selected = false;
        selected = 'none';
        click = true;
      } else {
        click = true;
        this.selected = true;
        if (selected != 'none') {
          particles[selected].selected = false;
        }
        selected = this.ID;
      }
    }
  }


  particle.prototype.particleCollision = function(ob1, ob2, dx, dy, d) {
    let s = (ob1.r + ob2.r) - d;
    let nx = dx / d;
    let ny = dy / d;
    let k = -2 * ((ob2.xVel - ob1.xVel) * nx + (ob2.yVel - ob1.yVel) * ny) / (1 / ob2.m + 1 / ob1.m);
    if (ob1.colType == 'bounce') {
      ob1.xVel -= k * nx / ob1.m;
      ob1.yVel -= k * ny / ob1.m;
    }
    if (ob2.colType == 'bounce') {
      ob2.xVel += k * nx / ob2.m;
      ob2.yVel += k * ny / ob2.m;
    }
    ob1.x -= (nx * s / 2);
    ob1.wallCollision('x');
    ob1.y -= (ny * s / 2);
    ob1.wallCollision('y');
    ob2.x += (nx * s / 2);
    ob2.wallCollision('x');
    ob2.y += (ny * s / 2);
    ob2.wallCollision('y');
    ob2.col = ob1;

  }
  particle.prototype.wallCollision = function(value) {

    for (var i = 0; i < walls.length; i++) {
      if ((this.y + this.r > walls[i].y1 && this.y - this.r < walls[i].y2) && (this.x - this.r < walls[i].x2 && this.x + this.r > walls[i].x1)) {

        if (value == 'x') {
          if (Math.abs(this.x - walls[i].x2) < Math.abs(this.x - walls[i].x1)) {
            this.x += (-this.x + this.r) + walls[i].x2;
          } else {
            this.x -= (this.x + this.r) - walls[i].x1;
          }
          this.xVel = -this.xVel;
        } else {
          if (Math.abs(this.y - walls[i].y2) < Math.abs(this.y - walls[i].y1)) {
            this.y += (-this.y + this.r) + walls[i].y2;
          } else {
            this.y -= (this.y + this.r) - walls[i].y1;
          }
          this.yVel = -this.yVel;
        }
      }
    }
  }

  particle.prototype.delete = function() {
    var indexToDelete = particles.indexOf(this);
    particles.splice(indexToDelete, 1);
    deleted += 1;
  }


  var wall = function(x1, y1, x2, y2, color) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.color = color;
  }


  wall.prototype.render = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
    ctx.stroke();
  }

  function renderObject(object) {
    deleted = 0;
    for (var i = 0; i < object.length; i++) {
      deleted = 0;
      object[i].render();
      i -= deleted;
    }
  }

  //for(var i = 0; i < 40; i++){
  //  particles.push(new particle(getRndInteger(gw/2 -2,gw/2 + 20),getRndInteger(gh/2 - 20,gh/2 + 20),getRndInteger(0,2 * Math.PI),2,getRndInteger(10,40),"#e43f5a",'bounce'));
  //}
  particles.push(new particle(50, gh / 2, 0, 5, 25, 'rgb(0,255,0)', 'bounce'));
  particles.push(new particle(gw - 50, gh / 2, Math.PI, 5, 15, 'rgb(0,255,0)', 'bounce'));
  walls.push(new wall(gw - 50, 0, gw, gh, '#1f4068'));
  walls.push(new wall(0, 0, 50, gh, '#1f4068'));
  walls.push(new wall(0, 0, gw, 50, '#1f4068'));
  walls.push(new wall(0, gh - 50, gw, gh, '#1f4068'));

  function refresh() {


    draw.clearRect(0, 0, gameArea.width, gameArea.height);
    renderObject(particles);
    renderObject(walls);
    trackMouse();
    settings();
    renderObject(sliders);
    createparticle();
    window.requestAnimationFrame(refresh);
  }
  window.requestAnimationFrame(refresh);

  setInterval(timer, 1);

  function timer() {
    time++;
  }
}

draw();
