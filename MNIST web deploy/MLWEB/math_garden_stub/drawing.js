const BACKGROUND_COLOR = "#000000";
const LINE_COLOR = "#FFFFFF";
const LINE_WIDTH = 15;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var isPainting = false;

var canvas;
var context;

const btn = document.getElementById("checkAnswer");

function prepareCanvas() {
  //console.log("Preparing Canvas");
  canvas = document.getElementById("myCanvas");
  context = canvas.getContext("2d");

  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  context.strokeStyle = LINE_COLOR;
  context.lineWidth = LINE_WIDTH;
  // Desktop-Mouse Events
  document.addEventListener("mousedown", function (event) {
    //console.log("Mouse Pressed");
    isPainting = true;
    currentX = event.clientX - canvas.offsetLeft;
    currentY = event.clientY - canvas.offsetTop;
  });

  canvas.addEventListener("mouseleave", function (event) {
    //console.log("Mouse left the canvas");
    isPainting = false;
  });

  document.addEventListener("mousemove", function (event) {
    if (isPainting) {
      previousX = currentX;
      currentX = event.clientX - canvas.offsetLeft;
      previousY = currentY;
      currentY = event.clientY - canvas.offsetTop;
      // console.log("X coordinate: " + currentX);
      // console.log("Y coordinate: " + currentY);

      draw();
      context.lineJoin = "round";
    }
  });

  document.addEventListener("mouseup", function (event) {
    //console.log("Mouse Released");
    isPainting = false;
  });

  //Touch Events
  canvas.addEventListener("touchstart", function (event) {
    //console.log("Touched!!");
    isPainting = true;
    currentX = event.touches[0].clientX - canvas.offsetLeft;
    currentY = event.touches[0].clientY - canvas.offsetTop;
  });
  document.addEventListener("touchmove", function (event) {
    if (isPainting) {
      previousX = currentX;
      currentX = event.touches[0].clientX - canvas.offsetLeft;
      previousY = currentY;
      currentY = event.touches[0].clientY - canvas.offsetTop;
      // console.log("X coordinate: " + currentX);
      // console.log("Y coordinate: " + currentY);

      draw();
      context.lineJoin = "round";
    }
  });
  canvas.addEventListener("touchend", function (event) {
    isPainting = false;
  });
  canvas.addEventListener("touchcancel", function (event) {
    isPainting = false;
  });
}
prepareCanvas();
function draw() {
  context.beginPath();
  context.moveTo(previousX, previousY);
  context.lineTo(currentX, currentY);
  context.closePath();
  context.stroke();
}

function clearCanvas() {
  currentX = 0;
  currentY = 0;
  previousX = 0;
  previousY = 0;
  //console.log("Clearing Canvas");
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  isPainting = false;
}

btn.addEventListener("click", function () {
  checkAnswer();
  clearCanvas();
  nextQuestion();
});
