import { Size } from "../utils/Size";
import { Frame } from "../core/Frame";
import { Container } from "../core/Container";
import { BorderLayout } from "../layouts/BorderLayout";
import { WindowLayout } from "../layouts/WindowLayout";
import { HList } from "../layouts/HList";
import { WindowFrame } from "../derivated/WindowFrame";
import { Button } from "../derivated/Button";
import { Expander } from "../derivated/Expander";

export function example4(): void {
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
  const frame = new Frame(canvas, new Container("croot", new BorderLayout()));

  // Several containers inside frame
  const ctop = new Container("ctop", new HList("HList"));
  const ccenter = new Container("ccenter", new WindowLayout("WindowLayout"));
  const cbottom = new Container("cbottom", new HList("HList"));

  frame.add(ctop, BorderLayout.TOP);
  frame.add(ccenter, BorderLayout.CENTER);
  // frame.add(cbottom, BorderLayout.BOTTOM);

  const wc = new WindowFrame("WindowFrame1");
  ccenter.add(wc);

  ctop.add(
    new Button("Add Canvas Box", new Size(200, 80), {
      onMouseClickCallback: (): void => {
        console.log("Adding new little window");
        const wc = new WindowFrame("WindowFrame2");
        ccenter.add(wc);
      },
    }),
  );

  ctop.add(new Expander());

  ctop.add(
    new Button("Add Window", new Size(200, 80), {
      onMouseClickCallback: (): void => {
        console.log("Adding new little window");
        ccenter.add(new WindowFrame());
      },
    }),
  );

  // cbottom.add(new Button("b1"));
  // cbottom.add(new Button("b2"));
  // cbottom.add(new Button("b3"));

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
