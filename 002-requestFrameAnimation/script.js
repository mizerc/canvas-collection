class App {
  constructor() {
    // Get canvas from DOM
    const canvas = document.getElementById("mycanvas");
    canvas.width = 600;
    canvas.height = 600;
    this.canvas = canvas;

    // Get context 2d
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Error getting context2d");
    }
    this.ctx = ctx;
  }

  init() {
    window.requestAnimationFrame(this.loop);
  }

  loop = (timeMs) => {
    this.draw(timeMs);
    window.requestAnimationFrame(this.loop);
  };

  draw = (timeMs = 0) => {
    let time = "";
    if (timeMs) {
      time = timeMs.toString();
    }

    const canvas = this.canvas;
    const ctx = this.ctx;
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stroke canvas border
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`CURRENT TIME: ${time} MS`, 10, 20);
  };
}
window.onload = () => {
  const app = new App();
  app.init();
};
