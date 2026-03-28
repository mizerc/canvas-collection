const CANVAS_W = 500;
const CANVAS_H = 500;
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("mycanvas");
  const pen = new Pen(canvas);
  pen.setSize(CANVAS_W, CANVAS_H);
  // Screen distance from camera
  let K1 = 600;
  // Torus distance from camera
  let K2 = 900;
  // Torus size
  let R1 = 50;
  let R2 = 80;
  // Torus orientation
  let RX = Math.PI / 3;
  let RY = 0;
  let RZ = 0;
  function loop() {
    RX += 0.005;
    // RY += 0.001;
    RZ += 0.005;
    pen.clearCanvas("#111");
    const t0 = performance.now();
    renderDonut(pen, CANVAS_W, CANVAS_H, RX, RY, RZ, R1, R2, K1, K2);
    const t1 = performance.now();
    pen.drawText(
      `Render Time: ${(t1 - t0).toFixed(2)} ms`,
      10,
      20,
      "16px Arial",
      "orange"
    );
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});
