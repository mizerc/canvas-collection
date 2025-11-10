class Pen {
  constructor(canvas, w, h) {
    this.canvas = canvas;
    this.setSize(w, h);
    this.ctx = canvas.getContext("2d");
    this.imageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height
    );
    this.pixelData = this.imageData.data; // Uint8ClampedArray
  }
  setSize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
  }
  line = (x1, y1, x2, y2, color = "red") => {
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  };
  strokeRect(x, y, w, h, color = "red") {
    this.ctx.fillStyle = color;
    this.ctx.strokeRect(x, y, w, h);
  }
  putPixel(x, y, r, g, b, a = 255) {
    const data = this.pixelData;
    if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height)
      return;
    const index = (y * this.canvas.width + x) * 4;
    data[index + 0] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = a;
  }
  circle(x, y, r, color = "red") {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();
  }
  text(text, x, y, color, font) {
    this.ctx.fillStyle = "white";
    this.ctx.font = "16px Arial";
    this.ctx.fillText(text, x, y);
  }
  fillRect(x, y, w, h, color = "red") {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }
  putImageData() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
  clear(color = "black") {
    // Canvas api
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // Raster
    this.imageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height
    );
    this.pixelData = this.imageData.data;
  }
}
