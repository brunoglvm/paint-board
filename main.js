let canDraw = false;
let canErase = false;
let mouseX = 0;
let mouseY = 0;
let currentColor = "rgb(0, 0, 0)";
const backgroundColor = "rgb(255, 255, 255)";
const undoStack = [];
const redoStack = [];

const screen = document.querySelector("#screen");
const ctx = screen.getContext("2d");
const modal = document.querySelector("#modal");

function initializeEvents() {
  document.querySelector("#save").addEventListener("click", saveImage);
  document.querySelector("#clear").addEventListener("click", () => {
    modal.style.display = "flex";
  });
  document.querySelector("#confirmClear").addEventListener("click", () => {
    clearScreen(true);
    modal.style.display = "none";
  });
  document.querySelector("#cancelClear").addEventListener("click", () => {
    modal.style.display = "none";
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
  screen.addEventListener("mousedown", mouseDownEvent);
  screen.addEventListener("mousemove", mouseMoveEvent);
  screen.addEventListener("mouseup", mouseUpEvent);
  screen.addEventListener("mouseleave", mouseLeaveEvent);
  document
    .querySelector("#colorPicker")
    .addEventListener("change", changeColor);
  document.querySelector("#erase").addEventListener("click", toggleEraser);
  document.addEventListener("DOMContentLoaded", loadInitialSettings);
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

function changeColor() {
  const color = this.jscolor.toHEXString();
  currentColor = color;
  localStorage.setItem("selected-color", currentColor);
}

function toggleEraser() {
  canErase = !canErase;

  const eraserIcon = document.querySelector("#eraserIcon");
  const penIcon = document.querySelector("#penIcon");

  if (canErase) {
    currentColor = backgroundColor;
    screen.style.cursor = "url(/src/assets/eraser-cursor.png) 0 30, progress";
    eraserIcon.style.display = "none";
    penIcon.style.display = "inline";
  } else {
    const savedColor = localStorage.getItem("selected-color");
    screen.style.cursor = "url(/src/assets/pen-cursor.png) 0 30, progress";
    eraserIcon.style.display = "inline";
    penIcon.style.display = "none";
    if (savedColor) {
      currentColor = savedColor;
    }
  }
}

function draw(x, y) {
  const penLineWidth = 5;
  const eraserLineWidth = 10;
  const pointX = x - screen.offsetLeft;
  const pointY = y - screen.offsetTop;
  ctx.beginPath();
  ctx.lineWidth = canErase ? eraserLineWidth : penLineWidth;
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
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (clearStorage) {
    localStorage.removeItem("paint-board");
  }
}

function saveState() {
  undoStack.push(screen.toDataURL());
  redoStack.length = 0;
}

async function saveImage() {
  const image = await screen.toDataURL("image/png");

  if (window.showSaveFilePicker) {
    const options = {
      suggestedName: "paint-board.png",
      types: [
        {
          description: "PNG file",
          accept: { "image/png": [".png"] },
        },
      ],
    };

    try {
      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();
      await writable.write(await (await fetch(image)).blob());
      await writable.close();
    } catch (err) {
      console.error("An error occurred while saving the file:", err);
    }
  } else {
    const link = document.createElement("a");
    link.href = image;
    link.download = "paint-board.png";
    link.click();
  }
}

function loadInitialSettings() {
  const savedColor = localStorage.getItem("selected-color");
  if (savedColor) {
    currentColor = savedColor;
    document.querySelector("#colorPicker").jscolor.fromString(savedColor);
  }

  loadDrawing();
}

initializeEvents();
