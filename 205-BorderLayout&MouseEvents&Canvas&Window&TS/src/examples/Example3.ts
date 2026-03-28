import { Size } from "../utils/Size";
import { Frame } from "../core/Frame";
import { Container } from "../core/Container";
import { BorderLayout } from "../layouts/BorderLayout";
import { WindowLayout } from "../layouts/WindowLayout";
import { HList } from "../layouts/HList";
import { WindowFrame } from "../derivated/WindowFrame";
import { Button } from "../derivated/Button";
import { Expander } from "../derivated/Expander";

/**
 * Example 3 will test WindowContainer & Window
 */
export function example3(): void {
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
  const frame = new Frame(canvas, new Container("root", new BorderLayout()));

  // Several containers inside frame
  const ctop = new Container("c1", new HList("c1"));
  const ccenter = new Container("c2", new WindowLayout("c2"));
  const cbottom = new Container("c3", new HList("c3"));

  frame.add(ctop, BorderLayout.TOP);
  frame.add(ccenter, BorderLayout.CENTER);
  frame.add(cbottom, BorderLayout.BOTTOM);

  // Several box inside container
  ctop.add(
    new Button("b1", new Size(50, 50), {
      onMouseClickCallback: (): void => {
        console.log("Adding new little window");
        ccenter.add(new WindowFrame("b"));
      },
    }),
  );

  ctop.add(new Button("b"));
  ctop.add(new Button("b"));
  ctop.add(new Button("b"));

  ccenter.add(new WindowFrame("b"));
  ccenter.add(new WindowFrame("b"));
  ccenter.add(new WindowFrame("b"));

  cbottom.add(new ToggleButton("b"));
  cbottom.add(new ToggleButton("b"));
  cbottom.add(new ToggleButton("b"));
  cbottom.add(new ToggleButton("b"));

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

  // You must call update and render manually.
  const loop = (): void => {
    frame.update();
    frame.render();
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}
