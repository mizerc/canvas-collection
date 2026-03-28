console.log("hi");

class Ship {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}

window.addEventListener("load", () => {
  console.log("loaded");
  const w = new Wrap("mycanvas", 400, 400, 10, 10);
  function loop() {
    w.setPixel(0, 0, 255, 0, 0);
    w.deploy();
  }
  window.requestAnimationFrame(loop);
});

function assert(boolean) {
  if (!boolean) {
    throw new Error("Assert failed!");
  }
}

class Wrap {
  constructor(id, w, h, vw, vh) {
    // Try to find canvas with provided id
    this.dstCanvas = document.getElementById(id);
    if (!this.dstCanvas) {
      throw new Error("Can't find canvas with provided id");
    }
    // Set the dom size
    this.dstCanvas.width = w;
    this.dstCanvas.height = h;
    // Grab the context2d api
    this.dstCtx = this.dstCanvas.getContext("2d");
    // Disable smooth
    this.dstCtx.imageSmoothingEnabled = false; // Disable smoothing for pixelated effect

    // Create canvas to hold pixel
    this.viewportCanvas = document.createElement("canvas");
    this.viewportCanvas.width = vh;
    this.viewportCanvas.height = vh;
    this.viewportCtx = this.viewportCanvas.getContext("2d");
    // Save the viewport size
    // Create the image to hold pixels from viewport size
    this.imageData = this.viewportCtx.createImageData(vw, vh);
    // Grad data addr
    this.pixelData = this.imageData.data; // Uint8ClampedArray
  }

  // Expose a few methods to let the user to interact
  setPixel(x, y, r, g, b) {
    // Assert x,y is inside viewport rectangle
    const vw = this.viewportCanvas.width;
    const vh = this.viewportCanvas.height;
    assert(x >= 0);
    assert(y >= 0);
    assert(x < vw);
    assert(y < vh);
    const index = 4 * (vw * y + x);
    this.pixelData[index + 0] = r;
    this.pixelData[index + 1] = g;
    this.pixelData[index + 2] = b;
    this.pixelData[index + 3] = 255;
  }

  deploy() {
    // First, write the imageData to our internal canvas
    this.viewportCtx.putImageData(this.imageData, 0, 0);

    // Send viewport to dst canvas
    this.dstCtx.drawImage(
      this.viewportCanvas,
      // 0,0,100,100
      0,
      0,
      this.viewportCanvas.width,
      this.viewportCanvas.height,
      // 0,0,400,400
      0,
      0,
      this.dstCanvas.width,
      this.dstCanvas.height
    );
  }
}
