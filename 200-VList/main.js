const W = 600;
const H = 600;

window.onload = () => {
  const canvas = document.getElementById("mycanvas");
  const pen = new Pen(canvas, W, H);

  // Example usage
  const container = new Container(canvas);
  const vlist = new VList();
  vlist.add(
    new Box(80, 30, () => {
      console.log("BOX1 CLICK");
    })
  );
  vlist.add(new Box(120, 50));
  vlist.add(new Box(100, 40));
  vlist.add(new Box(200, 40));
  vlist.add(new Box(100, 40));
  vlist.add(new Box(100, 40));
  container.add(vlist);
  container.render();

  // Events
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    container.handleClick(x, y);
  });

  pen.setOnMouseClick((mx, my) => {
    console.log(mx, my);
  });

  const loop = () => {
    pen.clear("#878787ff");

    container.update();
    container.render();

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};
