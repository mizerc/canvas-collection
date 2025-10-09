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

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Stroke canvas border
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Fill text at 10,10
  {
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("HELLO WORLD!", 10, 20);
  }

  const canvasMidX = canvas.width / 2;
  const canvasMidY = canvas.height / 2;

  // Stroke red full circle at middle of canvas
  {
    const radius = 50;
    const startAngleRad = 0;
    const endAngleRad = Math.PI * 2;
    ctx.beginPath();
    ctx.arc(canvasMidX, canvasMidY, radius, startAngleRad, endAngleRad);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
  }

  // Stroke blue half circle at middle of canvas
  {
    ctx.beginPath();
    ctx.arc(canvasMidX, canvasMidY, 100, 0, Math.PI);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.closePath();
  }

  // Stroke green line from 100,100 to 200,200
  {
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(200, 200);
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.closePath();
  }

  // Fill yellow rectangle at 400,400 with width 50 and height 100
  {
    ctx.fillStyle = "yellow";
    ctx.fillRect(400, 400, 50, 100);
  }

  // Stroke and Fill purple rectangle at 300,300 with width 100 and height 50
  {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 5;
    ctx.fillRect(300, 300, 100, 50);
    ctx.strokeRect(300, 300, 100, 50);
  }

  // Draw image at 100,300 with size 100x100
  {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 100, 300, 100, 100);
    };
    img.src = "image1.png";
  }

  // Clipping region example
  {
    // Start clip region constraints
    ctx.save();
    ctx.beginPath();
    // Define clipping region
    ctx.rect(100, 450, 200, 100);
    // Apply the clipping region
    ctx.clip();
    // Draw a large rectangle that will be clipped
    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Remove clip region constraints
    ctx.restore();
  }

  // Curve using bezierCurveTo
  {
    ctx.beginPath();
    ctx.moveTo(50, 500);
    ctx.bezierCurveTo(150, 400, 250, 600, 350, 500);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  }

  // Curve using quadraticCurveTo
  {
    ctx.beginPath();
    ctx.moveTo(400, 500);
    ctx.quadraticCurveTo(500, 400, 550, 500);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  }

  // Pattern example
  {
    const img = new Image();
    img.onload = () => {
      const pattern = ctx.createPattern(img, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(350, 50, 200, 200);
      }
    };
    img.src = "image1.png";
  }

  // Gradient example
  {
    const gradient = ctx.createLinearGradient(50, 50, 250, 250);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "blue");
    ctx.fillStyle = gradient;
    ctx.fillRect(50, 50, 200, 200);
  }

  // Global alpha example
  {
    ctx.fillStyle = "green";
    ctx.globalAlpha = 0.5; // Set alpha to 0.9
    ctx.fillRect(150, 150, 250, 225);
    ctx.globalAlpha = 1.0; // Reset alpha
  }
};
