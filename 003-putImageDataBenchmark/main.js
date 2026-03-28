class Canvas {
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

  putPixel(x, y, r, g, b, a = 255) {
    const data = this.pixelData;
    if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) {
      return;
    }
    const index = (y * this.canvas.width + x) * 4;
    data[index + 0] = r; // Red
    data[index + 1] = g; // Green
    data[index + 2] = b; // Blue
    data[index + 3] = a; // Alpha
  }

  text(text, x, y) {
    this.ctx.fillStyle = "black";
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
}

window.onload = () => {
  const W = 400;
  const H = 400;
  const N = W * H;
  const canvas = new Canvas(document.getElementById("mycanvas"), W, H);
  const t0 = window.performance.now();
  for (let i = 0; i < N; i++) {
    const x = Math.floor(Math.random() * W);
    const y = Math.floor(Math.random() * H);
    canvas.putPixel(
      x,
      y,
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    );
  }
  const t1 = window.performance.now();
  canvas.putImageData();
  const t2 = window.performance.now();
  canvas.fillRect(0, 0, 200, 50, "#FFFA");
  canvas.text(`uint8 write: ${t1 - t0} ms`, 10, 20);
  canvas.text(`putImageData: ${t2 - t1} ms`, 10, 40);
};
