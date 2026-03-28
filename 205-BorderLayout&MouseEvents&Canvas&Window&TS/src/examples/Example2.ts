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
 * Example 2 will test Button, ToggleButton, and NavigatorContainer.
 */
function example2(): void {
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

  const c4 = new NavigatorContainer("c4", { page1: new VList("page1") });
  c4.setPage("page2", new VList(""));
  c4.navigate("page1");
  c4.add(new Box("c4-p1-b1", new Size(150, 80)));
  c4.add(new Box("c4-p1-b2", new Size(150, 80)));
  c4.navigate("page2");
  c4.add(new Box("c4-p2-b1", new Size(150, 80)));
  c4.add(new Box("c4-p2-b2", new Size(150, 80)));

  frame.add(c1, BorderLayout.CENTER);
  frame.add(c2, BorderLayout.TOP);
  frame.add(c3, BorderLayout.BOTTOM);
  frame.add(c4, BorderLayout.RIGHT);

  // Several box inside container
  const b1 = new Box("b1", new Size(150, 80));
  b1.setName("B1");

  b1.setOnMouseClickCallback((box: Box): void => {
    const toggleBox = box as Box & {
      state: Record<string, unknown> & { toggle?: boolean };
    };

    if (toggleBox.state.toggle) {
      toggleBox.style.backgroundColor = "red";
      toggleBox.state.toggle = false;
    } else {
      toggleBox.style.backgroundColor = "green";
      toggleBox.state.toggle = true;
    }
  });

  b1.setOnMouseMoveCallback((_box: Box): void => {
    // box.style.backgroundColor = "orange";
  });

  b1.setOnMouseHoverStartCallback((box: Box): void => {
    box.style.backgroundColor = "blue";
  });

  b1.setOnMouseHoverEndCallback((box: Box): void => {
    box.style.backgroundColor = "purple";
  });

  const b2 = new Box("b2", new Size(100, 100));
  b2.setOnMouseClickCallback((_box: Box): void => {
    // frame.navigate("page2")
  });

  const b3 = new Box("B3", new Size(30, 150));
  b3.setOnMouseClickCallback((box: Box): void => {
    const toggleBox = box as Box & {
      state: Record<string, unknown> & { toggle?: boolean };
    };

    if (toggleBox.state.toggle) {
      toggleBox.style.backgroundColor = "red";
      toggleBox.state.toggle = false;
    } else {
      toggleBox.style.backgroundColor = "yellow";
      toggleBox.state.toggle = true;
    }
  });

  b3.setOnMouseHoverStartCallback((box: Box): void => {
    box.style.backgroundColor = "blue";
  });

  b3.setOnMouseHoverEndCallback((box: Box): void => {
    box.style.backgroundColor = "purple";
  });

  c1.add(b1);
  c1.add(b2);
  c1.add(b3);

  c2.add(new Box("b4", new Size(200, 25)));
  c2.add(new Box("b5", new Size(50, 100)));
  c2.add(new Box("b6", new Size(50, 50)));

  c3.add(
    new Box("a1", new Size(50, 50), {
      onMouseClickCallback: (_box: Box): void => {
        c4.navigate("page1");
      },
      onMouseHoverStartCallback: (box: Box): void => {
        box.style.backgroundColor = "yellow";
      },
      onMouseHoverEndCallback: (box: Box): void => {
        box.style.backgroundColor = "green";
      },
    }),
  );

  c3.add(
    new Box("a2", new Size(50, 50), {
      onMouseClickCallback: (_box: Box): void => {
        c4.navigate("page2");
      },
    }),
  );

  c3.add(new Button("a"));
  c3.add(new Button("b"));
  c3.add(new ToggleButton("t1"));

  // You must propagate events from browser to frame manually.
  canvas.addEventListener("mousedown", (e: MouseEvent): void => {
    const rect = canvas.getBoundingClientRect();
    frame.handleOnMouseDown(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.addEventListener("mouseup", (e: MouseEvent): void => {
    const rect = canvas.getBoundingClientRect();
    frame.handleOnMouseUp(e.clientX - rect.left, e.clientY - rect.top);
  });

  // canvas.addEventListener("click", (e: MouseEvent): void => {
  //   console.log("browser mouse click event");
  //   const rect = canvas.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;
  //   frame.handleOnMouseClick(x, y);
  // });

  canvas.addEventListener("mousemove", (e: MouseEvent): void => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    frame.handleOnMouseMove(x, y);
  });

  // You must call update and render manually.
  const loop = (): void => {
    // Compute sizes
    frame.update();
    // Draw lines
    frame.render();
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}
