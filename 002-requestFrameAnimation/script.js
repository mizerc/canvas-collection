window.onload = () => {
  // Get canvas from DOM
  const canvas = document.getElementById("mycanvas");
  canvas.width = 600;
  canvas.height = 600;

  // Get context 2d
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Error getting context2d");
  }

  function draw(time) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stroke canvas border
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Fill text at 10,10
    {
      ctx.font = "12px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(`CURRENT TIME: ${time} MS`, 10, 20);
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
};
