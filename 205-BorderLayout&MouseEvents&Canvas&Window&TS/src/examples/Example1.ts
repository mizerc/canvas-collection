import { Size } from "../utils/Size";
import { Frame } from "../core/Frame";
import { Container } from "../core/Container";
import { BorderLayout } from "../layouts/BorderLayout";
import { WindowLayout } from "../layouts/WindowLayout";
import { HList } from "../layouts/HList";
import { WindowFrame } from "../derivated/WindowFrame";
import { Button } from "../derivated/Button";
import { Expander } from "../derivated/Expander";

function example1() {
  // DOM Canvas
  const canvas = document.getElementById(
    "mycanvas",
  ) as HTMLCanvasElement | null;
  if (!canvas) {
    throw new Error('Canvas element with id "mycanvas" was not found');
  }
  canvas.width = 800;
  canvas.height = 800;

  // One frame per canvas
  const frame = new Frame(canvas);

  // Several containers inside frame
  const c1 = new Container("c1", new VList("c1"));
  const c2 = new Container("c2", new HList("c2"));
  const c3 = new Container("c3", new HList("c3"));

  frame.add(c1, BorderLayout.CENTER);
  frame.add(c2, BorderLayout.TOP);
  frame.add(c3, BorderLayout.BOTTOM);

  // Several box inside container
  const b1 = new Button("bb1", new Size(150, 80));
  const b2 = new Button("bb2", new Size(100, 100));
  const b3 = new Box("B3", new Size(30, 150));
  b3.setOnMouseClickCallback((box) => {
    if (box.state.toggle) {
      box.style.backgroundColor = "red";
      box.state.toggle = false;
    } else {
      box.style.backgroundColor = "yellow";
      box.state.toggle = true;
    }
  });
  b3.setOnMouseHoverStartCallback((box) => {
    box.style.backgroundColor = "blue";
  });
  b3.setOnMouseHoverEndCallback((box) => {
    box.style.backgroundColor = "purple";
  });

  c1.add(b1);
  c1.add(b2);
  c1.add(b3);

  c2.add(new Button("bb4", new Size(200, 25)));
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
