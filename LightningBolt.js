function draw() {
  var draw = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

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

  function drawCloud(x, y, w) {
    draw.strokeStyle = "#666699";
    drawCircle(x - 18, y, 15, "#666699");
    drawCircle(x, y, 20, "#666699");
    drawCircle(x + 18, y, 15, "#666699");
  }

  function drawLBolt(x, y, x2, y2, n, w, t) {
    var countY = 0;
    var countX = 0;
    var xpos = 0;
    var draw = canvas.getContext('2d');
    for (var i = 0; i < n - 1; i++) {
      countX += (x2 - x) / n;
      draw.beginPath();
      draw.lineWidth = w;
      draw.strokeStyle = "#0044ff";
      draw.moveTo(x + xpos + countX, y + countY);
      xpos = getRndInteger(-t, t);
      draw.lineTo(x + xpos + countX + (x2 - x) / n, y + countY + (y2 - y) / n);
      draw.stroke();

      countY += (y2 - y) / n;
    }
    draw.beginPath();
    draw.moveTo(x + xpos + countX + (x2 - x) / n, y + countY);
    draw.lineTo(x2, y2 + (y2 - y) / n);
    draw.stroke();
    drawCloud(x, y, 30);
  }
  if (canvas.getContext) {
    var draw = canvas.getContext('2d');
  }
  var timerSet = setInterval(myTimer, 50);
  var time = 0;

  function myTimer() {
    time += 1;
    draw.clearRect(0, 0, canvas.width, canvas.height);
    drawLBolt(75, 50, 75 + getRndInteger(20, -20), 150, 25, 2, 10);
    drawLBolt(200, 50, 200, 150, 25, 2, 10);
    /*if (time >= 100) {
      clearInterval(timerSet);
      time = 0;
    }*/
  }
}
draw();