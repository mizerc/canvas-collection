const W = 600;
const H = 600;

window.onload = () => {
  // DOM Canvas
  const canvas = document.getElementById("mycanvas");
  canvas.width = W;
  canvas.height = H;
  const pen = new Pen(canvas);

  // Create user interface over canvas
  const frame = new Frame(canvas, new BorderLayout("FRAME"));
  const c1 = new Container("c1", new VList("c1"));
  const b1 = new Box("b1", new Size(140, 80));
  const b2 = new Box("b2", new Size(40, 100));
  const b3 = new Box("b3", new Size(30, 150));
  c1.add(b1);
  c1.add(b2);
  c1.add(b3);
  frame.add(c1, BorderLayout.CENTER);
  const c2 = new Container("c2", new HList("c2"));
  frame.add(c2, BorderLayout.TOP);
  c2.add(new Box("b4", new Size(200, 25)));
  c2.add(new Box("b5", new Size(50, 100)));
  c2.add(new Box("b6", new Size(50, 50)));

  // Events
  // canvas.addEventListener("click", (e) => {
  //   const rect = canvas.getBoundingClientRect();
  //   const x = event.clientX - rect.left;
  //   const y = event.clientY - rect.top;
  //   window.handleClick(x, y);
  // });
  // canvas.addEventListener("mousemove", (e) => {
  //   const rect = canvas.getBoundingClientRect();
  //   const x = event.clientX - rect.left;
  //   const y = event.clientY - rect.top;
  //   window.handleMove(x, y);
  // });

  // Event loop
  const loop = () => {
    pen.clear("#878787ff");
    frame.update();
    frame.render();
    // requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};
