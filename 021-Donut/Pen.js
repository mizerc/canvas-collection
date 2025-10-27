class Pen {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }
  setSize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
  }
  setPixel(x, y, color) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }
  clearCanvas(color = "white") {
    const ctx = this.ctx;
    ctx.fillStyle = color
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawText(text, x, y, font = "16px Arial", color = "black") {
    const ctx = this.ctx;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }
  fillArray(arrBaseAddr, W, H, value = 0) {
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        const xy_to_index = Math.floor(x + W * y);
        arrBaseAddr[xy_to_index] = value;
      }
    }
  }
}
