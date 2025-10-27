const W = 600;
const H = 600;

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.fx = 0;
    this.fy = 0;
    this.m = Utils.randomInt(1, 20);
    this.cR = Utils.randomInt(0, 255);
    this.cG = Utils.randomInt(0, 255);
    this.cB = Utils.randomInt(0, 255);
    this.life = 100;
  }
  update(dtSec) {
    this.ax = (this.fx / this.m) * dtSec;
    this.ay = (this.fy / this.m) * dtSec;

    this.vx += this.ax * dtSec;
    this.vy += this.ay * dtSec;

    this.x += this.vx * dtSec;
    this.y += this.vy * dtSec;

    this.force = 0;

    this.life = this.life - 0.01;
  }
  paint(canvas) {
    canvas.circle(
      this.x,
      this.y,
      this.m,
      `rgb(${this.cR},${this.cG},${this.cB})`
    );
  }
}
window.onload = () => {
  const canvas = new Canvas(document.getElementById("mycanvas"), W, H);
  const nodes = [];

  //
  // for (let i = 0; i < 90; i++) {
  //   nodes.push(
  //     new Node(Utils.randomInt(10, W - 20), Utils.randomInt(10, H - 20))
  //   );
  // }

  canvas.setOnMouseClick((mx, my) => {
    console.log(mx, my);
    nodes.push(
      new Node(
        Utils.randomInt(mx - 20, mx + 20),
        Utils.randomInt(my - 20, my + 20)
      )
    );
  });

  const loop = () => {
    canvas.clear("#000");
    for (const n of nodes) {
      n.fx = W / 2 - n.x;
      n.fy = H / 2 - n.y;
      for (let i = 0; i < 100; i++) {
        n.update(16 / 10000);
      }
      if (n.x > W) {
        n.x = 0;
      }
      if (n.y > H) {
        n.y = 0;
      }
      n.paint(canvas);
    }

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};
