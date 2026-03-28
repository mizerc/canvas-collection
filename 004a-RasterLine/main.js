class Raster {
  constructor(canvas) {
    this.canvas = canvas;
    this.pixelSize = 1;
    this.ctx = canvas.getContext("2d");
    this.currentColor = { r: 0, g: 0, b: 0, a: 255 };
    this.imageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height
    );
    this.pixelData = this.imageData.data; // Uint8ClampedArray
  }
  setPixelSize(size) {
    this.pixelSize = size;
  }
  setCanvasSize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
  }
  setColor(r, g, b, a = 255) {
    this.currentColor = { r, g, b, a };
  }
  clear() {
    const data = this.pixelData;
    const w = this.canvas.width;
    const h = this.canvas.height;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const index = (y * w + x) * 4;
        data[index + 0] = 255;
        data[index + 1] = 255;
        data[index + 2] = 255;
        data[index + 3] = 255;
      }
    }
  }
  putPixel(x, y) {
    const data = this.pixelData;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const px = x;
    const py = y;
    if (px < 0 || px >= w || py < 0 || py >= h) {
      return;
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
  /**
   * Digital Differential Analyzer (DDA) Line Raster Algorithm
   * DDA uses floating-point arithmetic;
   * DDA is essentially linear interpolation;
   */
  strokeLineDDA(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    // Steps = max(|dx|, |dy|)
    // Slope = dy / dx = how much hike per walk
    const biggestStep =
      Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);
    const xInc = dx / biggestStep;
    const yInc = dy / biggestStep;
    let x = x0;
    let y = y0;
    for (let i = 0; i <= biggestStep; i++) {
      this.putPixel(Math.round(x), Math.round(y));
      x += xInc;
      y += yInc;
    }
  }
  rasterLine(x0, y0, x1, y1) {
    this.strokeLineDDA(x0, y0, x1, y1);
  }
  putImageData() {
    // this.putImageDataWithoutScale();
    this.putImageDataWithScale();
  }
  putImageDataWithoutScale() {
    this.ctx.save();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.scale(this.pixelSize, this.pixelSize);
    // putImageData() ignores transforms such as scale()
    this.ctx.putImageData(this.imageData, 0, 0);
    this.ctx.restore();
  }
  putImageDataWithScale() {
    const W = this.imageData.width;
    const H = this.imageData.height;

    // offscreen canvas stores raw pixels
    const offCanvas = document.createElement("canvas");
    offCanvas.width = W;
    offCanvas.height = H;
    const offCtx = offCanvas.getContext("2d");

    // write raw pixels 1:1
    offCtx.putImageData(this.imageData, 0, 0);

    // draw scaled onto main canvas
    this.ctx.save();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.drawImage(
      offCanvas,
      0,
      0,
      W,
      H, // source
      0,
      0,
      W * this.pixelSize,
      H * this.pixelSize // destination (scaled)
    );
    this.ctx.restore();
  }
}
class Pen {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }
  setCanvasSize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
  }
  clear() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  text(text, x, y) {
    this.ctx.fillStyle = "black";
    this.ctx.font = "16px Arial";
    this.ctx.fillText(text, x, y);
  }
  strokeLine(x0, y0, x1, y1, color = "red", lineWidth = 2) {
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth;
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.stroke();
  }
  strokeCircle(x, y, r, color = "red") {
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.stroke();
  }
  fillCircle(x, y, r, color = "red") {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fill();
  }
  fillRect(x, y, w, h, color = "red") {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }
}
class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  draw(pen) {
    pen.fillCircle(this.x, this.y, 5, "blue");
  }
  mousemove(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return `Mouse(${this.x.toFixed(0)}, ${this.y.toFixed(0)})`;
  }
}
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isOver = false;
  }
  isPointOver(px, py, radius) {
    const dx = this.x - px;
    const dy = this.y - py;
    return dx * dx + dy * dy <= radius * radius;
  }
  mousemove(px, py) {
    if (this.isPointOver(px, py, 10)) {
      this.isOver = true;
    } else {
      this.isOver = false;
    }
    if (this.isDragging) {
      this.x = px;
      this.y = py;
    }
  }
  mousedown(px, py) {
    if (this.isPointOver(px, py, 5)) {
      this.isDragging = true;
    }
  }
  mouseup(px, py) {
    this.isDragging = false;
  }
  raster(raster) {
    if (this.isOver) {
      raster.setColor(255, 0, 0, 255);
    } else {
      raster.setColor(0, 0, 0, 255);
    }
    raster.putPixel(this.x, this.y);
  }
  draw(pen) {
    pen.fillCircle(this.x, this.y, 4, this.isOver ? "red" : "gray");
  }
  toString() {
    return `Point(${this.x.toFixed(0)}, ${this.y.toFixed(0)})`;
  }
}
class Line {
  constructor(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
  }
  mousedown(mx, my) {
    this.p0.mousedown(mx, my);
    this.p1.mousedown(mx, my);
  }
  mousemove(mx, my) {
    this.p0.mousemove(mx, my);
    this.p1.mousemove(mx, my);
  }
  mouseup(mx, my) {
    this.p0.mouseup(mx, my);
    this.p1.mouseup(mx, my);
  }
  raster(raster) {
    raster.setColor(0, 0, 255, 255);
    raster.rasterLine(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
    this.p0.raster(raster);
    this.p1.raster(raster);
  }
  draw(pen) {
    this.p0.draw(pen);
    this.p1.draw(pen);
  }
}
window.onload = () => {
  const W = 400;
  const H = 400;
  const N = W * H;
  const PIXELSIZE = 20;
  const WW = W / PIXELSIZE;
  const HH = H / PIXELSIZE;
  const NN = WW * HH;
  const canvas = document.getElementById("mycanvas");
  const pen = new Pen(canvas);
  pen.setCanvasSize(W, H);
  const raster = new Raster(canvas);
  raster.setPixelSize(PIXELSIZE);
  const mouse = new Mouse();
  const line = new Line(new Point(5, 5), new Point(15, 15));
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // Convert canvas to grid coordinates
    const rx = Math.floor(mx / raster.pixelSize);
    const ry = Math.floor(my / raster.pixelSize);
    mouse.mousemove(mx, my);
    line.mousemove(rx, ry);
  });
  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // Convert canvas to grid coordinates
    const rx = Math.floor(mx / raster.pixelSize);
    const ry = Math.floor(my / raster.pixelSize);
    line.mousedown(rx, ry);
  });
  canvas.addEventListener("mouseup", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // Convert canvas to grid coordinates
    const rx = Math.floor(mx / raster.pixelSize);
    const ry = Math.floor(my / raster.pixelSize);
    line.mouseup(rx, ry);
  });
  function loop() {
    pen.clear();
    raster.clear();
    line.raster(raster);
    raster.putImageData();
    mouse.draw(pen);
    [
      `mouse: ${mouse.toString()}`,
      `p0: ${line.p0.toString()}`,
      `p1: ${line.p1.toString()}`,
    ].map((text, idx) => {
      const textY = 20 + 22 * idx;
      pen.fillRect(5, textY - 16, 160, 20, "#b4b4b4ff");
      pen.text(text, 10, textY);
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
};
