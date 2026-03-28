```js
ctx.font = "12px Arial";
ctx.fillStyle = "black";
ctx.fillText("HELLO WORLD!", 10, 20);

ctx.strokeStyle = isEnabled ? "red" : "white";
ctx.lineWidth = isEnabled ? 4 : 1;

this.canvas.width = w;
this.canvas.height = h;
this.imageData = this.ctx.createImageData(w, h);
this.pixelData = this.imageData.data;
// setPixel(x, y, rgba)
const idx = (y * this.canvas.width + x) * 4;
this.pixelData[idx + 0] = r;
this.pixelData[idx + 1] = g;
this.pixelData[idx + 2] = b;
this.pixelData[idx + 3] = a;
this.ctx.putImageData(this.imageData, 0, 0);

const rect = e.target.getBoundingClientRect();

// EVENTS
canvas.addEventListener("mousemove", (evt) => {
  const rect = canvas.getBoundingClientRect();
  const x = evt.clientX - rect.left;
  const y = evt.clientY - rect.top;
});
```
