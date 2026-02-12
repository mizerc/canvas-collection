function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
async function readFile(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP response error, status=${responde.status}`);
    }
    const data = await response.text();
    return data;
  } catch (err) {
    console.err(err);
  }
}
class Model {
  constructor() {}
  setModelName(name) {
    this.modelName = name;
  }
  setQntTriangles(n) {
    this.qntTriangles = n;
  }
}
function parseObjFile(data) {
  // Allocate a new model in memory
  const m = new Model();
  // Get trimmed lines
  const lines = data.split("\n").map((l) => l.trim());
  // Parse line by line
  for (const line of lines) {
    // Handles: "Object name = COW"
    if (line.startWith("Object name")) {
      const value = line.split("=")[1].trim();
      m.setModelName(value);
    }
    // Handles "# triangles = 8373"
    else if (line.startWith("# triangles")) {
      const value = Number(line.split("=")[1].trim());
    }
    // Handles: "Material count = 1"
    else if (line.startsWith("Material count")) {
      data.materialCount = Number(line.split("=")[1].trim());
    }
    // Handles: "ambient color 0.000 0.000 0.000"
    else if (line.startsWith("ambient color")) {
      // slice(negative) count from the end, including last element.
      data.ambient = line.split(" ").slice(-3).map(Number);
    }
    // Handles: "diffuse color 0.306 0.259 0.220"
    else if (line.startsWith("diffuse color")) {
      // diffuse = [0.306, 0.259, 0.220]
      data.diffuse = line.split(" ").slice(-3).map(number);
    }
    // Handles: "specular color 0.900 0.900 0.900"
    else if (line.startsWith("specular color")) {
      data.specular = line.split(" ").slice(-3).map(Number);
    }
    // Handles: "material shine 0.000"
    else if (line.startsWith("material shine")) {
      data.shine = Number(line.split(" ").pop());
    }
    // Extract vertex data: 
    // "v<index> <x> <y> <z> <nx> <ny> <nz> <colorIndex>"
    // "v0 299.877 -435.272 165.128 -0.700 -0.304 -0.646 0"
    // "face normal <x> <y> <z>"
  }
}
readFile("gisel.v").then((data) => parseObjFile(data));

class Raster {
  constructor(w, h) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = w;
    this.canvas.height = h;
    this.imageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height
    );
    this.pixelData = this.imageData.data; // Uint8ClampedArray
  }
  setCanvasSize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.imageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height
    );
    this.pixelData = this.imageData.data; // Uint8ClampedArray
  }
  putPixel(x, y, color) {
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;

    // Asset x is valid number positive integer
    assert(
      typeof x === "number" && x >= 0 && x < canvasW,
      "x is not a valid number positive integer"
    );
    assert(
      typeof y === "number" && y >= 0 && y < canvasH,
      "y is not a valid number positive integer"
    );
    assert(
      typeof color === "object" &&
        color.r >= 0 &&
        color.r <= 255 &&
        color.g >= 0 &&
        color.g <= 255 &&
        color.b >= 0 &&
        color.b <= 255,
      "color is not a valid color object {r: 0-255, g: 0-255, b: 0-255}"
    );

    const index = (y * canvasW + x) * 4;
    const data = this.pixelData;
    const r = color.r;
    const g = color.g;
    const b = color.b;
    data[index + 0] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = 255;
  }
  writeCanvasToDestinationCanvas(dstCanvas) {
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;

    // First, write the imageData to our internal canvas
    this.ctx.putImageData(this.imageData, 0, 0);

    // Then scale it to the destination canvas with pixelated effect
    const dstCtx = dstCanvas.getContext("2d");
    dstCtx.imageSmoothingEnabled = false; // Disable smoothing for pixelated effect
    dstCtx.drawImage(
      this.canvas,
      // 0,0,100,100
      0,
      0,
      canvasW,
      canvasH,
      // 0,0,400,400
      0,
      0,
      dstCanvas.width,
      dstCanvas.height
    );
  }
}

let gridSize = 100;
let raster = null;
window.setGridSize = (size) => {
  gridSize = size;
  raster.setCanvasSize(gridSize, gridSize);
};
window.onload = () => {
  // Grab canvas from DOM tree
  const domCanvas = document.getElementById("mycanvas");
  const domCanvasCtx = domCanvas.getContext("2d");
  // Set canvas size
  const domCanvasSize = 400;
  domCanvas.width = domCanvasSize;
  domCanvas.height = domCanvasSize;
  // Create the wrap to allow us to easily draw stuff
  raster = new Raster(gridSize, gridSize);
  // Animate
  function loop() {
    const t0 = window.performance.now();
    for (let i = 0; i < gridSize; i++) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      const r = Math.random() * 255;
      const g = Math.random() * 255;
      const b = Math.random() * 255;
      raster.putPixel(x, y, { r, g, b });
    }
    const t1 = window.performance.now();
    raster.writeCanvasToDestinationCanvas(domCanvas);
    const t2 = window.performance.now();
    [
      `putPixel: ${t1 - t0}ms`,
      `writeCanvasToDestinationCanvas: ${t2 - t1}ms`,
      `canvas size: ${domCanvasSize}x${domCanvasSize}`,
      `grid size: ${gridSize}x${gridSize}`,
    ].map((text, idx) => {
      const padding = 5;
      const textY = 20 + (20 + padding) * idx;
      domCanvasCtx.fillStyle = "#fffd";
      domCanvasCtx.fillRect(5, textY - 15, 300, 20);
      domCanvasCtx.fillStyle = "black";
      domCanvasCtx.font = "16px monospace";
      domCanvasCtx.fillText(text, 10, textY);
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
};
