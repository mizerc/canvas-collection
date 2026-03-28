function example1() {
  // DOM Canvas
  const canvas = document.getElementById("mycanvas");
  canvas.width = 1000;
  canvas.height = 1000;

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
/**
 * Example 2 will test button and toggle and NavigatorContainer
 */
function example2() {
  // DOM Canvas
  const canvas = document.getElementById("mycanvas");
  canvas.width = W;
  canvas.height = H;

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
  b1.setOnMouseClickCallback((box) => {
    if (box.state.toggle) {
      box.style.backgroundColor = "red";
      box.state.toggle = false;
    } else {
      box.style.backgroundColor = "green";
      box.state.toggle = true;
    }
  });
  b1.setOnMouseMoveCallback((box) => {
    // box.style.backgroundColor = "orange";
  });
  b1.setOnMouseHoverStartCallback((box) => {
    box.style.backgroundColor = "blue";
  });
  b1.setOnMouseHoverEndCallback((box) => {
    box.style.backgroundColor = "purple";
  });
  const b2 = new Box("b2", new Size(100, 100));
  b2.setOnMouseClickCallback((box) => {
    // frame.navigate("page2")
  });
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

  c2.add(new Box("b4", new Size(200, 25)));
  c2.add(new Box("b5", new Size(50, 100)));
  c2.add(new Box("b6", new Size(50, 50)));

  c3.add(
    new Box("a1", new Size(50, 50), {
      onMouseClickCallback: (box) => {
        c4.navigate("page1");
      },
      onMouseHoverStartCallback: (box) => {
        box.style.backgroundColor = "yellow";
      },
      onMouseHoverEndCallback: (box) => {
        box.style.backgroundColor = "green";
      },
    }),
  );
  c3.add(
    new Box("a2", new Size(50, 50), {
      onMouseClickCallback: (box) => {
        c4.navigate("page2");
      },
    }),
  );
  c3.add(new Button("a"));
  c3.add(new Button("b"));
  c3.add(new ToggleButton("t1"));

  // You must propagate events from browser to frame manually.
  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    frame.handleOnMouseDown(e.clientX - rect.left, e.clientY - rect.top);
  });
  canvas.addEventListener("mouseup", (e) => {
    const rect = canvas.getBoundingClientRect();
    frame.handleOnMouseUp(e.clientX - rect.left, e.clientY - rect.top);
  });
  // canvas.addEventListener("click", (e) => {
  //   console.log("browser mouse click event");
  //   const rect = canvas.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;
  //   frame.handleOnMouseClick(x, y);
  // });
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
/**
 * Example 3 will test WindowContainer & Window
 */
function example3() {
  // DOM Canvas
  const canvas = document.getElementById("mycanvas");
  canvas.width = 800;
  canvas.height = 800;

  // One frame per canvas
  const frame = new Frame(
    canvas,
    new Container("root", new BorderLayout("root")),
  );

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
      onMouseClickCallback: () => {
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
  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    frame.handleOnMouseDown(e.clientX - rect.left, e.clientY - rect.top);
  });
  canvas.addEventListener("mouseup", (e) => {
    const rect = canvas.getBoundingClientRect();
    frame.handleOnMouseUp(e.clientX - rect.left, e.clientY - rect.top);
  });
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    frame.handleOnMouseMove(x, y);
  });

  // You must call update and render manually.
  const loop = () => {
    frame.update();
    frame.render();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function example4() {
  // DOM Canvas
  const canvas = document.getElementById("mycanvas");
  canvas.width = 800;
  canvas.height = 800;

  // One frame per canvas
  const frame = new Frame(
    canvas,
    new Container("root", new BorderLayout("root")),
  );

  // Several containers inside frame
  const ctop = new Container("c1", new HList("c1"));
  const ccenter = new Container("c2", new WindowLayout("c2"));
  const cbottom = new Container("c3", new HList("c3"));

  frame.add(ctop, BorderLayout.TOP);
  frame.add(ccenter, BorderLayout.CENTER);
  frame.add(cbottom, BorderLayout.BOTTOM);

  ctop.add(
    new Button("Add Window", new Size(200, 50), {
      onMouseClickCallback: () => {
        console.log("Adding new little window");
        ccenter.add(new WindowFrame("Window"));
      },
    }),
  );
  ctop.add(
    new Button("Add Canvas Box", new Size(200, 50), {
      onMouseClickCallback: () => {
        console.log("Adding new little window");
        const wc = new WindowFrame("WindowCanvas");
        ccenter.add(wc);
      },
    }),
  );

  cbottom.add(new Button("b"));
  cbottom.add(new Button("b"));

  // You must propagate events from browser to frame manually.
  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    frame.handleOnMouseDown(e.clientX - rect.left, e.clientY - rect.top);
  });
  canvas.addEventListener("mouseup", (e) => {
    const rect = canvas.getBoundingClientRect();
    frame.handleOnMouseUp(e.clientX - rect.left, e.clientY - rect.top);
  });
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    frame.handleOnMouseMove(x, y);
  });
  // You must call update and render manually.
  const loop = () => {
    frame.update();
    frame.render();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

window.onload = () => {
  // example1();
  // example2();
  // example3();
  example4();
};
