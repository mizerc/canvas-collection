import { Size } from "../utils/Size";
import { Frame } from "../core/Frame";
import { Container } from "../core/Container";
import { BorderLayout } from "../layouts/BorderLayout";
import { WindowLayout } from "../layouts/WindowLayout";
import { HList } from "../layouts/HList";
import { WindowFrame } from "../derivated/WindowFrame";
import { Button } from "../derivated/Button";
import { Expander } from "../derivated/Expander";
import { VList } from "../layouts/VList";

export function example5(): void {
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
  const frame = new Frame(
    canvas,
    new Container("croot", new VList("croot-hlist")),
  );

  const cdiv = new Container("cdiv", new VList("c1-hlist"));
  frame.add(cdiv);

  const c1 = new Container("c1", new HList("c1-hlist"));
  c1.add(new Button("b1"));
  c1.add(new Expander("Ex1"));
  c1.add(new Button("b2"));
  c1.add(new Button("b3"));
  cdiv.add(c1);

  const c2 = new Container("c2", new HList("c1-hlist"));
  c2.add(new Button("b1"));
  c2.add(new Expander("Ex1"));
  c2.add(new Button("b2"));
  c2.add(new Button("b3"));
  cdiv.add(c2);

  // You must propagate events from browser to frame manually.
  canvas.addEventListener("mousedown", (e: MouseEvent): void => {
    const rect = canvas.getBoundingClientRect();
    frame.handleOnMouseDown(e.clientX - rect.left, e.clientY - rect.top);
  });
  canvas.addEventListener("mouseup", (e: MouseEvent): void => {
    const rect = canvas.getBoundingClientRect();
    frame.handleOnMouseUp(e.clientX - rect.left, e.clientY - rect.top);
  });
  canvas.addEventListener("mousemove", (e: MouseEvent): void => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    frame.handleOnMouseMove(x, y);
  });
  const loop = (): void => {
    frame.update();
    frame.render();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
