let currentColor = "black";
let canDraw = false;
let mouseX = 0;
let mouseY = 0;
let undoStack = [];

let screen = document.querySelector("#screen");
let ctx = screen.getContext("2d");

document.querySelectorAll(".colorArea .color").forEach((item) => {
  item.addEventListener("click", colorClickEvent);
});

screen.addEventListener("mousedown", mouseDownEvent);
screen.addEventListener("mousemove", mouseMoveEvent);
screen.addEventListener("mouseup", mouseUpEvent);
document.querySelector(".clear").addEventListener("click", clearScreen);

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey && e.key === "z") || e.key === "Z") {
    undoLast();
  }
});

function colorClickEvent(e) {
  let color = e.target.getAttribute("data-color");
  currentColor = color;

  document.querySelector(".color.active").classList.remove("active");
  e.target.classList.add("active");
}

function mouseDownEvent(e) {
  canDraw = true;
  mouseX = e.pageX - screen.offsetLeft;
  mouseY = e.pageY - screen.offsetTop;

  saveState();
}

function mouseMoveEvent(e) {
  if (canDraw) {
    draw(e.pageX, e.pageY);
  }
}

function mouseUpEvent() {
  canDraw = false;
}

function draw(x, y) {
  let pointX = x - screen.offsetLeft;
  let pointY = y - screen.offsetTop;

  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.moveTo(mouseX, mouseY);
  ctx.lineTo(pointX, pointY);
  ctx.closePath();
  ctx.strokeStyle = currentColor;
  ctx.stroke();

  mouseX = pointX;
  mouseY = pointY;
}

function clearScreen() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function saveState() {
  undoStack.push(screen.toDataURL());
}

function undoLast() {
  if (undoStack.length > 0) {
    let canvasPic = new Image();
    canvasPic.src = undoStack.pop();
    canvasPic.onload = function () {
      clearScreen();
      ctx.drawImage(canvasPic, 0, 0);
    };
  }
}
