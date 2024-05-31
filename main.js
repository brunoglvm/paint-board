let canDraw = false;
let mouseX = 0;
let mouseY = 0;
let screen = document.querySelector("#screen");
let ctx = screen.getContext("2d");
let modal = document.querySelector("#modal");

document.querySelector("#clear").addEventListener("click", function () {
  modal.style.display = "flex";
});

document.querySelector("#confirmClear").addEventListener("click", function () {
  clearScreen(true);
  modal.style.display = "none";
});

document.querySelector("#cancelClear").addEventListener("click", function () {
  modal.style.display = "none";
});

modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

screen.addEventListener("mousedown", mouseDownEvent);
screen.addEventListener("mousemove", mouseMoveEvent);
screen.addEventListener("mouseup", mouseUpEvent);
screen.addEventListener("mouseleave", mouseLeaveEvent);

document.querySelector("#colorPicker").addEventListener("change", function () {
  let color = this.jscolor.toHEXString();
  currentColor = color;
  document.querySelector(".color.active").classList.remove("active");
});

function colorClickEvent(e) {
  let color = e.target.getAttribute("data-color");
  currentColor = color;

  document.querySelector(".color.active").classList.remove("active");
  e.target.classList.add("active");
}

function mouseDownEvent(e) {
  if (e.button === 0) {
    canDraw = true;
    mouseX = e.pageX - screen.offsetLeft;
    mouseY = e.pageY - screen.offsetTop;

    saveState();
  }
}

function mouseMoveEvent(e) {
  if (canDraw) {
    draw(e.pageX, e.pageY);
  }
}

function mouseUpEvent() {
  if (canDraw) {
    canDraw = false;

    saveDrawing();
  }
}

function mouseLeaveEvent() {
  if (canDraw) {
    canDraw = false;

    saveDrawing();
  }
}

function draw(x, y) {
  let pointX = x - screen.offsetLeft;
  let pointY = y - screen.offsetTop;

  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.moveTo(mouseX, mouseY);
  ctx.lineTo(pointX, pointY);
  ctx.closePath();
  ctx.strokeStyle = currentColor;
  ctx.stroke();

  mouseX = pointX;
  mouseY = pointY;
}

function clearScreen(clearStorage = false) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (clearStorage) {
    localStorage.removeItem("paint-board");
  }
}

function saveState() {
  undoStack.push(screen.toDataURL());
  redoStack.length = 0;
}
