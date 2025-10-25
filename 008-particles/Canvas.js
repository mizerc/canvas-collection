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
    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      // left: distance from viewport left edge,
      // top: distance from viewport top edge,
      // width: canvas width in CSS pixels,
      // height: canvas height in CSS pixels,
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      this.onMouseClick(mx, my);
    });
  }

  setOnMouseClick = (callback) => {
    this.onMouseClick = callback;
  };

  onMouseClick = (mx, my) => {
    console.log("CLICK:", mx, my);
  };

  setSize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
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

  text(text, x, y) {
    this.ctx.fillStyle = "black";
    this.ctx.font = "16px Arial";
    this.ctx.fillText(text, x, y);
  }

  strokeRect(x, y, w, h, color = "red") {
    this.ctx.fillStyle = color;
    this.ctx.strokeRect(x, y, w, h);
  }

  fillRect(x, y, w, h, color = "red") {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  putImageData() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  clear(color = "black") {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
