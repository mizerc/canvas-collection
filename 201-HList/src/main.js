const W = 600;
const H = 600;

window.onload = () => {
  const canvas = document.getElementById("mycanvas");
  canvas.width = W;
  canvas.height = H;
  const pen = new Pen(canvas);

  // Setup interface
  const frame = new Frame(canvas);
  const container = new Container("container", new HList("container"));
  container.add(new Box("b1", new Size(50, 50)));
  container.add(new Box("b2", new Size(50, 50)));
  container.add(new Box("b3", new Size(50, 100)));
  container.add(new Box("b4", new Size(50, 50)));
  frame.add(container);

  // Event loop
  const loop = () => {
    pen.clear("#878787ff");
    frame.update();
    frame.render();
    // requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};
