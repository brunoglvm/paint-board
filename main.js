let canDraw = false;
let canErase = false;
let mouseX = 0;
let mouseY = 0;
let currentDrawing = null;
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
    document.body.style.overflow = "hidden";
  });
  document.querySelector("#confirmClear").addEventListener("click", () => {
    clearScreen(true);
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  });
  document.querySelector("#cancelClear").addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  window.addEventListener("resize", setCanvasSize);

  screen.addEventListener("mousedown", mouseDownEvent);
  screen.addEventListener("mousemove", mouseMoveEvent);
  screen.addEventListener("mouseup", mouseUpEvent);
  screen.addEventListener("mouseleave", mouseLeaveEvent);

  screen.addEventListener("touchstart", touchStartEvent);
  screen.addEventListener("touchmove", touchMoveEvent);
  screen.addEventListener("touchend", touchEndEvent);
  screen.addEventListener("touchcancel", touchCancelEvent);

  document
    .querySelector("#colorPicker")
    .addEventListener("change", changeColor);
  document.querySelector("#erase").addEventListener("click", toggleEraser);
  document.addEventListener("DOMContentLoaded", loadInitialSettings);
}

function setCanvasSize() {
  currentDrawing = new Image();
  currentDrawing.src = screen.toDataURL();

  const windowWidth = window.innerWidth;
  let canvasHeight = 1200;

  if (windowWidth >= 768) {
    canvasHeight = 600;
  }

  screen.width = 1200;
  screen.height = canvasHeight;

  if (currentDrawing) {
    currentDrawing.onload = function () {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(currentDrawing, 0, 0);
    };
  }
}

setCanvasSize();

function getMousePos(e) {
  const rect = screen.getBoundingClientRect();
  const scaleX = screen.width / rect.width;
  const scaleY = screen.height / rect.height;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

function mouseDownEvent(e) {
  if (e.button === 0) {
    const pos = getMousePos(e);
    startDrawing(pos.x, pos.y);
  }
}

function mouseMoveEvent(e) {
  const pos = getMousePos(e);
  draw(pos.x, pos.y);
}

function mouseUpEvent() {
  endDrawing();
}

function mouseLeaveEvent() {
  endDrawing();
}

function touchStartEvent(e) {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    const pos = getMousePos(touch);
    startDrawing(pos.x, pos.y);
  }
}

function touchMoveEvent(e) {
  e.preventDefault();
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    const pos = getMousePos(touch);
    draw(pos.x, pos.y);
  }
}

function touchEndEvent() {
  endDrawing();
}

function touchCancelEvent() {
  endDrawing();
}

function startDrawing(x, y) {
  canDraw = true;
  mouseX = x;
  mouseY = y;
  saveState();
}

function draw(x, y) {
  if (canDraw) {
    const penLineWidth = 5;
    const eraserLineWidth = 10;
    ctx.beginPath();
    ctx.lineWidth = canErase ? eraserLineWidth : penLineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.moveTo(mouseX, mouseY);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.strokeStyle = currentColor;
    ctx.stroke();
    mouseX = x;
    mouseY = y;
  }
}

function endDrawing() {
  if (canDraw) {
    canDraw = false;
    saveDrawing();
  }
}

function changeColor() {
  const color = this.jscolor.toHEXString();
  currentColor = color;
  localStorage.setItem("selected-color", currentColor);

  if (canErase) {
    toggleEraser();
  }
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
