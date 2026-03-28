const W = 600;
const H = 600;

window.onload = () => {
  const canvas = document.getElementById("mycanvas");
  canvas.width = W;
  canvas.height = H;
  const pen = new Pen(canvas);

  const frame = new Frame(canvas, new BorderCenter("FRAME"));
  const c1 = new Container("c1", new VList("c1"));
  const b1 = new Button({
    name: "b1",
    title: "Button B1",
    size: new Size(200, 75),
    onClick: () => {
      console.log("BUTTON b1 CLICKED!");
    },
  });
  const b2 = new Box({
    name: "b2",
    title: "Box B2",
    size: new Size(200, 75),
    onClick: () => {
      console.log("BOX b2 CLICKED!");
    },
  });
  const state = { setVisible: true };
  const b3 = new Box({
    name: "b3",
    title: "Toggle B1",
    size: new Size(200, 75),
    onClick: () => {
      console.log("BOX b3 CLICKED!");
      if (state.setVisible) {
        b1.setVisible(true);
        state.setVisible = false;
      } else {
        b1.setVisible(false);
        state.setVisible = true;
      }
    },
    onMouseOverChange: (bto, isOver) => {
      if (isOver) {
        bto.setStyle({ backgroundColor: "#ff0000" });
      } else {
        bto.setStyle({ backgroundColor: "#416306ff" });
      }
    },
  });
  c1.addNode(b1);
  c1.addNode(b2);
  c1.addNode(b3);
  frame.addNode(c1);

  // Events
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    frame.handleClick(x, y);
  });
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    frame.handleMove(x, y);
  });

  // Event loop
  const loop = () => {
    pen.clear("#ff7e7eff");
    frame.update();
    frame.render();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};
