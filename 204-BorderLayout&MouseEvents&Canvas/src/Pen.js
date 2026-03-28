class Pen {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    
    // Pixel methods
    this.imageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height,
    );
    this.pixelData = this.imageData.data; // Uint8ClampedArray
  }

  applyProps(props) {
    if (!props) {
      props = {};
    }
    if (!(props instanceof Object)) {
      throw new Error("PEN ERROR: props must be a object");
    }
    if (!props.strokeColor) {
      props.strokeColor = "red";
    }
    if (!props.strokeDash) {
      // setLineDash([8, 4])
      props.strokeDash = [];
    }
    if (!props.strokeWidth) {
      props.strokeWidth = 2;
    }
    if (!props.fillColor) {
      props.fillColor = "black";
    }
    if (!props.font) {
      props.font = "16px Arial";
    }
    this.ctx.setLineDash(props.strokeDash);
    this.ctx.lineWidth = props.strokeWidth;
    this.ctx.strokeStyle = props.strokeColor;
    this.ctx.fillStyle = props.fillColor;
    this.ctx.font = props.font;
  }

  setSize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // =-= PIXEL METHODS
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

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

  putImageData() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // =-= IMAGE METHODS
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  /**
   * Draw src (canvas image) on current canvas
   */
  image(src, sx, sy, sw, sh, dx, dy, dw, dh) {
    const ctx = this.ctx;
    // With cropping
    // ctx.drawImage(src, sx, sy, sw, sh, dx, dy, dw, dh);
    // No cropping
    ctx.drawImage(src, dx, dy);
  }
  /**
   * Return the canvas image of this canvas
   */
  getImage() {
    return this.ctx.canvas;
  }
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // =-= CORE METHODS
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  clear(color = "black") {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  strokeRect(x, y, w, h, props) {
    this.ctx.save();
    this.applyProps(props);
    this.ctx.strokeRect(x, y, w, h);
    this.ctx.restore();
  }

  fillRect(x, y, w, h, props) {
    this.ctx.save();
    this.applyProps(props);
    this.ctx.fillRect(x, y, w, h);
    this.ctx.restore();
  }

  circle(x, y, r, props) {
    this.ctx.save();
    this.applyProps(props);
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  text(text, x, y, props) {
    this.ctx.save();
    this.applyProps(props);
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // =-= DERIVATED METHODS
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  strokeRectObj(rect, props) {
    if (!rect) return;
    this.strokeRect(rect.x, rect.y, rect.w, rect.h, props);
  }

  fillRectObj(rect, props) {
    if (!rect) return;
    this.fillRect(rect.x, rect.y, rect.w, rect.h, props);
  }
}
