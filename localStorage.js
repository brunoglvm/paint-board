function saveDrawing() {
  const dataURL = screen.toDataURL();
  localStorage.setItem("paint-board", dataURL);
}

function loadDrawing() {
  const savedDrawing = localStorage.getItem("paint-board");
  if (savedDrawing) {
    const img = new Image();
    img.src = savedDrawing;
    img.onload = () => ctx.drawImage(img, 0, 0);
  }
}

loadDrawing();
