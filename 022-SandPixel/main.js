const PALETTE = [
  [255, 220, 100],
  [255, 255, 255],
  [100, 180, 255],
  [255, 80, 80],
  [80, 255, 80],
  [180, 180, 180],
  [255, 160, 0],
  [200, 100, 255],
];
class Pen {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.pixelData = null;
    this.imageData = null;
  }
  setCanvasSize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.imageData = this.ctx.createImageData(w, h);
    this.pixelData = this.imageData.data;
  }
  putPixelIdx(idx, r, g, b, a = 255) {
    this.pixelData[idx] = r;
    this.pixelData[idx + 1] = g;
    this.pixelData[idx + 2] = b;
    this.pixelData[idx + 3] = a;
  }
  putPixel(x, y, r, g, b, a = 255) {
    const index = (y * this.canvas.width + x) * 4;
    this.pixelData[index] = r;
    this.pixelData[index + 1] = g;
    this.pixelData[index + 2] = b;
    this.pixelData[index + 3] = a;
  }
  putImageData() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}
class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.isDown = false;
  }
  mousemove(e) {
    const rect = e.target.getBoundingClientRect();
    this.x = Math.floor(
      ((e.clientX - rect.left) / rect.width) * e.target.width
    );
    this.y = Math.floor(
      ((e.clientY - rect.top) / rect.height) * e.target.height
    );
  }
}
class PaletteButtons {
  constructor() {
    this.btnSize = 20;
    this.x = 0;
    this.y = 0;
    this.padding = 6;
  }
  resize(w, h) {
    this.x = w - this.btnSize - 8;
    this.y = 4;
  }
  clickPalette(x, y, callback) {
    for (let i = 0; i < PALETTE.length; i++) {
      const bx = this.x;
      const by = this.y + i * (this.btnSize + this.padding);
      if (
        x >= bx &&
        x < bx + this.btnSize &&
        y >= by &&
        y < by + this.btnSize
      ) {
        callback(i);
        return true;
      }
    }
    return false;
  }
  draw(pen, currentColor) {
    const ctx = pen.ctx;
    for (let i = 0; i < PALETTE.length; i++) {
      const [r, g, b] = PALETTE[i];
      const x = this.x;
      const y = this.y + i * (this.btnSize + this.padding);
      // Button fill
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, this.btnSize, this.btnSize);
      // Outline
      const isEnabled = i === currentColor;
      ctx.strokeStyle = isEnabled ? "red" : "white";
      ctx.lineWidth = isEnabled ? 4 : 1;
      ctx.strokeRect(
        x - (isEnabled ? 2 : 0),
        y - (isEnabled ? 2 : 0),
        this.btnSize + (isEnabled ? 4 : 0),
        this.btnSize + (isEnabled ? 4 : 0)
      );
    }
  }
}
class SandContainer {
  constructor(W, H) {
    this.EMPTY = 255;
    this.W = W;
    this.H = H;
    this.sandSize = 10;
    this.sand = new Uint8Array(W * H).fill(this.EMPTY);
    this.currentColorIdx = 0;
  }
  resize(W, H) {
    this.sand = new Uint8Array(W * H).fill(this.EMPTY);
    this.W = W;
    this.H = H;
  }
  increaseSandSize() {
    this.sandSize += 10;
    if (this.sandSize > 100) {
      this.sandSize = 100;
    }
  }
  decreaseSandSize() {
    this.sandSize -= 10;
    if (this.sandSize < 10) {
      this.sandSize = 10;
    }
  }
  setCurrentColor(colorIdx) {
    this.currentColorIdx = colorIdx;
  }
  dropSand(x, y) {
    console.log("dropSand", x, y);
    const SIZE = this.sandSize;
    const W = this.W;
    const H = this.H;
    for (let dy = -SIZE; dy <= SIZE; dy++) {
      for (let dx = -SIZE; dx <= SIZE; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
          const idx = ny * W + nx;
          this.sand[idx] = this.currentColorIdx;
        }
      }
    }
  }
  update() {
    const W = this.W;
    const H = this.H;
    const sand = this.sand;
    // Iterate bottom-up so falling grains don't immediately cascade twice
    for (let y = H - 2; y >= 0; y--) {
      for (let x = 0; x < W; x++) {
        const currIdx = y * W + x;
        // 1) Skip empty cells
        if (sand[currIdx] === this.EMPTY) {
          continue;
        }
        // 2) Try to move sand straight down
        const idxBelow = currIdx + W;
        if (sand[idxBelow] === this.EMPTY) {
          sand[idxBelow] = sand[currIdx];
          sand[currIdx] = this.EMPTY;
          continue;
        }
        // 3) Down-left / down-right availability
        const canLeft = x > 0 && sand[idxBelow - 1] === this.EMPTY;
        const canRight = x < W - 1 && sand[idxBelow + 1] === this.EMPTY;
        if (canLeft && canRight) {
          const dir = Math.random() < 0.5 ? -1 : 1;
          const idxDownLeftOrRight = idxBelow + dir;
          sand[idxDownLeftOrRight] = sand[currIdx];
          sand[currIdx] = this.EMPTY;
        } else if (canLeft) {
          const idxBelowLeft = idxBelow - 1;
          sand[idxBelowLeft] = sand[currIdx];
          sand[currIdx] = this.EMPTY;
        } else if (canRight) {
          const idxBelowRight = idxBelow + 1;
          sand[idxBelowRight] = sand[currIdx];
          sand[currIdx] = this.EMPTY;
        }
        // 4) Else: trapped — do nothing
      }
    }
  }
  draw(pen) {
    const sand = this.sand;
    for (let sandIdx = 0; sandIdx < sand.length; sandIdx++) {
      const bufferIdx = sandIdx * 4;
      const currentColorIdx = sand[sandIdx];
      if (currentColorIdx !== this.EMPTY) {
        const [r, g, b] = PALETTE[currentColorIdx];
        pen.putPixelIdx(bufferIdx, r, g, b, 255);
      } else {
        pen.putPixelIdx(bufferIdx, 0, 0, 0, 255);
      }
    }
  }
}
window.onload = () => {
  const canvasEl = document.getElementById("mycanvas");
  const PEN = new Pen(canvasEl);
  const sandContainer = new SandContainer(250, 250);
  const paletteButtons = new PaletteButtons();
  const mouse = new Mouse();
  function loop() {
    const t0 = performance.now();
    if (mouse.isDown) {
      const wasOverPalette = paletteButtons.clickPalette(
        mouse.x,
        mouse.y,
        (idx) => {
          sandContainer.setCurrentColor(idx);
        }
      );
      if (!wasOverPalette) {
        sandContainer.dropSand(mouse.x, mouse.y);
      }
    }
    const t1 = performance.now();
    sandContainer.update();
    sandContainer.draw(PEN);
    PEN.putImageData();
    paletteButtons.draw(PEN, sandContainer.currentColorIdx);
    const t2 = performance.now();
    const yellowPixelCount = sandContainer.sand.reduce(
      (a, b) => a + (b === 0 ? 1 : 0),
      0
    );
    [
      `FPS: ${(1000 / (t2 - t1)).toFixed(1)}`,
      `dropSandTime: ${(t1 - t0).toFixed(0)}ms`,
      `deltaTimeMs: ${(t2 - t1).toFixed(0)}ms`,
      `yellowPixelCount: ${yellowPixelCount}`,
    ].map((text, idx) => {
      const textY = idx * 22 + 20;
      PEN.ctx.fillStyle = "white";
      PEN.ctx.fillRect(5, textY - 15, 200, 20);
      PEN.ctx.fillStyle = "black";
      PEN.ctx.font = "16px Arial";
      PEN.ctx.fillText(text, 10, textY);
    });
    requestAnimationFrame(loop);
  }

  // Event listeners
  canvasEl.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
      mouse.isDown = true;
    }
  });
  canvasEl.addEventListener("mouseup", () => {
    mouse.isDown = false;
  });
  canvasEl.addEventListener("mouseleave", () => {
    mouse.isDown = false;
  });
  canvasEl.addEventListener("mousemove", (e) => {
    mouse.mousemove(e);
  });
  window.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") {
      const idx = parseInt(e.key, 10);
      if (idx < PALETTE.length) {
        sandContainer.setCurrentColor(idx - 1);
      }
    }
    if (e.key === "=") {
      sandContainer.increaseSandSize();
    }
    if (e.key === "-") {
      sandContainer.decreaseSandSize();
    }
  });
  function handleResize() {
    const parent = canvasEl.parentElement;
    const newW = Math.floor(parent.clientWidth);
    const newH = Math.floor(parent.clientHeight);
    PEN.setCanvasSize(newW, newH);
    sandContainer.resize(newW, newH);
    paletteButtons.resize(newW, newH);
  }
  window.addEventListener("resize", handleResize);
  handleResize();
  requestAnimationFrame(loop);
};
