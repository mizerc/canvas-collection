function handleFileInput(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const blob = new Blob([file], { type: file.type });
    processImage(blob);
  }
}
function handleDrop(event) {
  event.preventDefault();
  if (event.dataTransfer.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0];
    const blob = new Blob([file], { type: file.type });
    processImage(blob);
  }
}
function useDefaultImage() {
  async function loadDefaultImage() {
    const response = await fetch("default.png");
    if (!response.ok) {
      throw new Error("Failed to load default image");
    }
    const blob = await response.blob();
    processImage(blob);
  }
  loadDefaultImage();
}
function processImage(blob) {
  const domCanvas = document.getElementById("mycanvas");
  const domCanvasCtx = domCanvas.getContext("2d");
  const domCanvasSize = 400;
  domCanvas.width = domCanvasSize;
  domCanvas.height = domCanvasSize;
  // INSERT_YOUR_CODE
  const img = new Image();
  img.onload = function () {
    // Fill canvas with white background (optional, for transparency handling)
    domCanvasCtx.clearRect(0, 0, domCanvasSize, domCanvasSize);
    domCanvasCtx.fillStyle = "#fff";
    domCanvasCtx.fillRect(0, 0, domCanvasSize, domCanvasSize);

    // INSERT_YOUR_CODE

    // Apply a 3x3 kernel to render a border around non-white (non-background) pixels.
    // Simple border kernel (detects strong difference with neighbors, marks border)
    // We'll use a threshold on grayscale value difference to detect "edge".

    // 1. Draw the image to a temporary in-memory canvas to access pixels
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = domCanvasSize;
    tempCanvas.height = domCanvasSize;
    const tempCtx = tempCanvas.getContext("2d");
    // Fill white background, exactly like main canvas
    tempCtx.fillStyle = "#fff";
    tempCtx.fillRect(0, 0, domCanvasSize, domCanvasSize);

    // Draw image scaled-to-fit, as in main canvas' drawImage logic
    const ratio = Math.min(
      domCanvasSize / img.width,
      domCanvasSize / img.height
    );
    const newWidth = img.width * ratio;
    const newHeight = img.height * ratio;
    const offsetX = (domCanvasSize - newWidth) / 2;
    const offsetY = (domCanvasSize - newHeight) / 2;
    tempCtx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

    // 2. Get pixel data
    const imageData = tempCtx.getImageData(0, 0, domCanvasSize, domCanvasSize);
    const data = imageData.data;

    // 3. Create array to store border mask (same size, 1 if border, 0 if not)
    const borderMask = new Uint8Array(domCanvasSize * domCanvasSize);

    // Helper to get grayscale value at (x,y)
    function getGray(x, y) {
      if (x < 0 || x >= domCanvasSize || y < 0 || y >= domCanvasSize)
        return 255;
      
      const i = (y * domCanvasSize + x) * 4;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      // Standard NTSC luma (Y) approximation:
      return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // 4. Loop through all pixels, check if any 4-connected neighbor has high difference --> mark as border
    // Treat white (background) as no-edge.
    // You can tweak the threshold if needed.
    const threshold = 50; // grayscale difference to be considered edge

    for (let y = 0; y < domCanvasSize; ++y) {
      for (let x = 0; x < domCanvasSize; ++x) {
        const idx = y * domCanvasSize + x;
        const g = getGray(x, y);

        // If this is full white, skip (treat as background)
        if (g > 250) continue;

        // 4-connected neighbors
        const neighbors = [
          getGray(x - 1, y),
          getGray(x + 1, y),
          getGray(x, y - 1),
          getGray(x, y + 1),
        ];

        // If any neighbor is "more white" than us by a margin, it's a border
        if (neighbors.some((n) => n > g + threshold)) {
          borderMask[idx] = 1;
        }
      }
    }

    // 5. Overlay the border on top of the image
    // Let's draw a black border pixel per border location (single-pixel width)
    const borderColor = [0, 0, 0, 255]; // RGBA black

    for (let y = 0; y < domCanvasSize; ++y) {
      for (let x = 0; x < domCanvasSize; ++x) {
        const idx = y * domCanvasSize + x;
        if (borderMask[idx]) {
          const di = idx * 4;
          data[di] = borderColor[0];
          data[di + 1] = borderColor[1];
          data[di + 2] = borderColor[2];
          data[di + 3] = borderColor[3];
        }
      }
    }
    // 6. Write back to main canvas BEFORE actual drawing
    domCanvasCtx.putImageData(imageData, 0, 0);

    // domCanvasCtx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
  };
  img.src = URL.createObjectURL(blob);
}
