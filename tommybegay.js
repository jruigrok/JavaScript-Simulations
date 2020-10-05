var xPos = 0;
var List = [];
function draw(){
	var draw = canvas.getContext('2d');
  	canvas.width = window.innerWidth-50;
  	canvas.height = window.innerHeight-50;


  	
  if (canvas.getContext) {
   	var draw = canvas.getContext('2d');
  }
  var timerSet = setInterval(myTimer, 10);


  function myTimer(){
  	xPos += 1;
    draw.clearRect(0, 0, canvas.width, canvas.height);
    draw.beginPath();
  	draw.fillStyle = "rgb(255,0,0)";
  	draw.fillRect(xPos,100,100,20);
  	draw.stroke();
   }
}
draw();