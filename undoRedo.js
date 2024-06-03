document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
    undoLast();
  } else if (
    (e.ctrlKey || e.metaKey) &&
    e.shiftKey &&
    e.key.toLowerCase() === "z"
  ) {
    redoLast();
  }
});

function undoLast() {
  if (undoStack.length > 0) {
    redoStack.push(screen.toDataURL());
    let canvasPic = new Image();
    canvasPic.src = undoStack.pop();
    canvasPic.onload = function () {
      clearScreen();
      ctx.drawImage(canvasPic, 0, 0);
    };
  }
}

function redoLast() {
  if (redoStack.length > 0) {
    undoStack.push(screen.toDataURL());
    let canvasPic = new Image();
    canvasPic.src = redoStack.pop();
    canvasPic.onload = function () {
      clearScreen();
      ctx.drawImage(canvasPic, 0, 0);
    };
  }
}
