const W = 800;
const H = 800;

function example1() {
  // DOM Canvas
  const canvas = document.getElementById("mycanvas");
  canvas.width = W;
  canvas.height = H;

  // One frame per canvas
  const frame = new Frame(canvas, new BorderLayout("FRAME"));

  // Several containers inside frame
  const c1 = new Container("c1", new VList("c1"));
  const c2 = new Container("c2", new HList("c2"));
  const c3 = new Container("c3", new HList("c3"));

  frame.add(c1, BorderLayout.CENTER);
  frame.add(c2, BorderLayout.TOP);
  frame.add(c3, BorderLayout.BOTTOM);

  // Several box inside container
  const b1 = new Box("b1", new Size(150, 80));
  b1.setName("B1");
  b1.setOnMouseClick((box) => {
    if (box.state.toggle) {
      box.style.backgroundColor = "red";
      box.state.toggle = false;
    } else {
      box.style.backgroundColor = "green";
      box.state.toggle = true;
    }
  });
  b1.setOnMouseMove((box) => {
    // box.style.backgroundColor = "orange";
  });
  b1.setOnMouseHoverStart((box) => {
    box.style.backgroundColor = "blue";
  });
  b1.setOnMouseHoverEnd((box) => {
    box.style.backgroundColor = "purple";
  });
  const b2 = new Box("b2", new Size(100, 100));
  const b3 = new Box("b3", new Size(30, 150));
  b3.setOnMouseClick((box) => {
    if (box.state.toggle) {
      box.style.backgroundColor = "red";
      box.state.toggle = false;
    } else {
      box.style.backgroundColor = "yellow";
      box.state.toggle = true;
    }
  });
  b3.setOnMouseHoverStart((box) => {
    box.style.backgroundColor = "blue";
  });
  b3.setOnMouseHoverEnd((box) => {
    box.style.backgroundColor = "purple";
  });

  c1.add(b1);
  c1.add(b2);
  c1.add(b3);

  c2.add(new Box("b4", new Size(200, 25)));
  c2.add(new Box("b5", new Size(50, 100)));
  c2.add(new Box("b6", new Size(50, 50)));

  c3.add(new Box("a", new Size(50, 50)));
  c3.add(new Box("a", new Size(50, 50)));
  c3.add(new Box("a", new Size(50, 50)));

  // You must propagate events from browser to frame manually.
  canvas.addEventListener("click", (e) => {
    console.log("browser mouse click event");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    frame.handleOnMouseClick(x, y);
  });
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    frame.handleOnMouseMove(x, y);
  });

  // You must call update and render manually.
  const loop = () => {
    // Compute sizes
    frame.update();
    // Draw lines
    frame.render();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
window.onload = () => {
  example1();
};
