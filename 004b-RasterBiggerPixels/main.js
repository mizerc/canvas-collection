class Raster {
  constructor(canvas) {
    this.canvas = canvas;
    this.pixelSize = 1;
    this.ctx = canvas.getContext("2d");
    this.currentColor = { r: 0, g: 0, b: 0, a: 255 };
  }
  createPixelData() {
    this.imageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height
    );
    this.pixelData = this.imageData.data; // Uint8ClampedArray
  }
  setPixelSize(size) {
    this.pixelSize = size;
  }
  getGridW() {
    return Math.floor(this.canvas.width / this.pixelSize);
  }
  getGridH() {
    return Math.floor(this.canvas.height / this.pixelSize);
  }
  setCanvasSize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
  }
  setColor(r, g, b, a = 255) {
    this.currentColor = { r, g, b, a };
  }
  putPixel(x, y) {
    const data = this.pixelData;
    const size = this.pixelSize;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const baseX = x * size;
    const baseY = y * size;
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const px = baseX + dx;
        const py = baseY + dy;
        if (px < 0 || px >= w || py < 0 || py >= h) {
          continue;
        }
        const index = (py * w + px) * 4;
        const r = this.currentColor.r;
        const g = this.currentColor.g;
        const b = this.currentColor.b;
        const a = this.currentColor.a;
        data[index + 0] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = a;
      }
    }
  }
  fillCircle(x, y, r, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fill();
  }
  strokeCircle(x, y, r, color = "red") {
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.stroke();
  }
  fillRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }
  text(text, x, y, font = "16px sans-serif", color = "black") {
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }
  putImageData() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}
window.onload = () => {
  const W = 400;
  const H = 400;
  const canvas = document.getElementById("mycanvas");
  const raster = new Raster(canvas);
  window.setGridSize = function (size) {
    raster.setPixelSize(size);
  };
  raster.setCanvasSize(W, H);
  raster.setPixelSize(20);
  raster.createPixelData();
  function loop() {
    const t0 = window.performance.now();
    const gridW = raster.getGridW();
    const gridH = raster.getGridH();
    const gridSize = gridW * gridH;
    for (let i = 0; i < gridSize; i++) {
      const x = Math.floor(Math.random() * gridW);
      const y = Math.floor(Math.random() * gridH);
      const r = Math.random() * 255;
      const g = Math.random() * 255;
      const b = Math.random() * 255;
      raster.setColor(r, g, b, 255);
      raster.putPixel(x, y);
    }
    const t1 = window.performance.now();
    raster.putImageData();
    const t2 = window.performance.now();
    [`putPixel calls: ${t1 - t0}ms`, `putImageData calls: ${t2 - t1}ms`].map(
      (text, idx) => {
        const textY = 40 + 30 * idx;
        raster.fillRect(0, textY - 20, 200, 20, "#b4b4b4ff");
        raster.text(text, 10, textY);
      }
    );
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
};
