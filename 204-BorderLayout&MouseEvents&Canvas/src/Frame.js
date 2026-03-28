/**
 * FrameTimeUtil
 * This class is responsible to accumulate time and handle when it is necessary repaint.
 */
class FrameTimeUtil {
  static needUpdateOrRender = true;
  static updateCount = 0;
  static renderCount = 0;
  static render(pen) {
    let textY = 20;
    const textGap = 25;
    const rectSpacing = 2;

    pen.fillRectObj(new Rect(5, textY, 200, textGap), { fillColor: "#eeaa" });
    pen.text(`UpdateCount: ${FrameTimeUtil.updateCount}`, 10 + 2, textY + 18);
    textY += textGap + rectSpacing;

    pen.fillRectObj(new Rect(5, textY, 200, textGap), { fillColor: "#eeaa" });
    pen.text(`RenderCount: ${FrameTimeUtil.renderCount}`, 10 + 2, textY + 18);
    textY += textGap + rectSpacing;
  }
}
/**
 * A Frame is a instance that holds a single container and canvas.
 */
class Frame {
  constructor(
    canvas,
    rootContainer = new Container("root", new BorderLayout("root")),
  ) {
    if (!canvas) {
      throw new Error("Window must define canvas");
    }
    // Frame owns one single container
    this.rootContainer = rootContainer;
    // For rendering only
    this.canvas = canvas;
    this.pen = new Pen(canvas);
  }
  add(node, location) {
    this.rootContainer.add(node, location);
  }
  update() {
    if (!FrameTimeUtil.needUpdateOrRender) return;
    FrameTimeUtil.updateCount += 1;

    // Frame and its RootContainer occupy entire canvas
    // User sets size of Browser.canvas, then the library adjust itself to fit that size
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.rootContainer.setSize(new Size(W, H));

    // Update Container._measuredSize
    this.rootContainer.measure();

    // RootContainer starts at 0,0 of canvas
    this.rootContainer.arrange(this, 0, 0);

    // Propagate update
    this.rootContainer.update();
  }
  render() {
    if (!FrameTimeUtil.needUpdateOrRender) return;
    FrameTimeUtil.renderCount += 1;

    // Clear entire Browser.canvas
    this.pen.clear("rgb(208, 190, 190)");

    // Render content
    this.rootContainer.render(this.pen);

    // Debug
    FrameTimeUtil.render(this.pen);
    FrameTimeUtil.needUpdateOrRender = false;
  }
  /**
   * Propagate down/up event to its children.
   */
  handleOnMouseDown(px, py) {
    FrameTimeUtil.needUpdateOrRender = true;
    console.log("EV-1: container on mouse click");
    this.rootContainer.handleOnMouseDown(px, py);
  }
  handleOnMouseUp(px, py) {
    FrameTimeUtil.needUpdateOrRender = true;
    console.log("EV-1: container on mouse click");
    this.rootContainer.handleOnMouseUp(px, py);
  }
  handleOnMouseMove(x, y) {
    // FrameTimeUtil.needUpdateOrRender = true;
    this.rootContainer.handleOnMouseMove(x, y);
  }
}
class Node {
  constructor(name, size) {
    if (!name) {
      throw new Error("Node must have name defined!");
    }
    this.parent = null;
    this.visible = true;
    this.name = name;
    this.position = new Position(0, 0);
    this.size = size ?? new Size(0, 0);
    // For users to save state
    this.state = {};
  }
  log(text) {
    console.log(`[${this.name}]: ${text}`);
  }

  setName(name) {
    this.name = name;
  }
  // Arrange/update final position/size (top-down).
  setPosition(position) {
    if (!(position instanceof Position)) {
      throw new Error("size must be instanceof Size");
    }
    console.log(`[P] Node(${this.name}).setPosition called for ${this.name}`);
    this.position = new Position(position.x, position.y);
  }
  setSize(size) {
    if (!(size instanceof Size)) {
      throw new Error("size must be instanceof Size");
    }
    this.size = new Size(size.w, size.h);
    console.log(
      `[S] Node(${this.name}).setSize called: ${this.size.w}x${this.size.h}`,
    );
  }
  getSize() {
    return new Size(this.size.w, this.size.h);
  }
  getRect() {
    return new Rect(this.position.x, this.position.y, this.size.w, this.size.h);
  }
  measure() {
    throw new Error("Node.measure must be overridden in subclass");
  }
  update() {
    throw new Error("Node.update must be overridden in subclass");
  }
  render(_pen) {
    throw new Error("Node.render must be overridden in subclass");
  }
  // === EVENTS METHODS ===
  /**
   * The user of the library can use the following to set a callback.
   */
  setOnMouseClickCallback = (callback) => {
    this.onMouseClickCallback = callback;
  };
  setOnMouseDownCallback = (callback) => {
    this.onMouseDownCallback = callback;
  };
  setOnMouseUpCallback = (callback) => {
    this.onMouseUpCallback = callback;
  };
  setOnMouseMoveCallback(callback) {
    this.onMouseMoveCallback = callback;
  }
  setOnMouseHoverStartCallback(callback) {
    this.onMouseHoverStartCallback = callback;
  }
  setOnMouseHoverEndCallback(callback) {
    this.onMouseHoverEndCallback = callback;
  }
  /**
   * The handle* methods are called by Frame or Container only.
   */
  handleOnMouseMove(px, py) {
    throw new Error("handleOnMouseMove Must be overwriten by extends class!");
  }
  handleOnMouseUp(px, py) {
    throw new Error("handleOnMouseUp Must be overwriten by extends class!");
  }
  handleOnMouseDown(px, py) {
    throw new Error("handleOnMouseDown Must be overwriten by extends class!");
  }
  /**
   * Util method used by both Container and Node.
   */
  hitTest(px, py) {
    if (!this.visible) return false;
    const clickPosition = new Point(px, py);
    const rectangle = this.getRect();
    return rectangle.containsPoint(clickPosition);
  }
}
/**
 * A Container Node holds an instance of a Layout.
 * The Layout holds multiple childs.
 */
class Container extends Node {
  constructor(nodeName, layout) {
    super(nodeName, undefined);
    super.setName(nodeName);
    // A container must have a layout instance
    this.layout = layout;
    this.layout.owner = this;

    // Each container have its own canvas to allow canvas cutting thru canvas.drawImage
    // this.containerPen = new Pen(document.createElement("canvas"));
  }
  /**
   * Container.add()
   * This adds a child to its layout.
   * The Container.layout instance is responsible for storing nodes.
   * - location is only used by BorderLayout
   */
  add(newNode, location) {
    newNode.parent = this;
    this.layout.add(newNode, location);
  }
  /**
   * Container.arrange()
   * The caller (another Container.layout) always define the containre position.
   * Then we propage the arrange() to my childs.
   */
  arrange(parent, new_x = 0, new_y = 0) {
    this.setPosition(new Position(new_x, new_y));
    this.layout.arrange(this, new_x, new_y);
  }
  // setSize(newSize) {
  //   super.setSize(newSize);
  //   this.containerPen.canvas.width = newSize.w;
  //   this.containerPen.canvas.height = newSize.h;
  // }
  /**
   * Container.measure()
   * A container ask its layout to measure the needed size to fit all childs.
   * Then store/cache the Size() in _measuredSize.
   */
  measure() {
    // Measure size of content
    const contentSize = this.layout.measure(this);

    // Cache content size
    this._measuredSize = contentSize.clone();

    // Update the size of the canvas of the container
    // if (contentSize.w <= 0 || contentSize.h <= 0) {
    // } else {
    //   this.containerPen.canvas.width = contentSize.w;
    //   this.containerPen.canvas.height = contentSize.h;
    // }

    // Return size of container
    return this._measuredSize;
  }
  update() {
    for (const node of this.layout.list) {
      node.update();
    }
  }
  render(pen) {
    if (!this.visible) {
      return;
    }

    // Fill
    // Define which fillColor to use based on Layout instance
    let bgColor = "rgb(236, 210, 210)";
    if (this.layout instanceof HList) {
      bgColor = "rgb(223, 228, 255)";
    } else if (this.layout instanceof VList) {
      bgColor = "rgb(255, 231, 255)";
    } else if (this.layout instanceof BorderLayout) {
      bgColor = "rgb(225, 253, 255)";
    } else if (this.layout instanceof FloatLayout) {
      bgColor = "hsl(42, 100%, 88%)";
    } else if (this.layout instanceof WindowLayout) {
      bgColor = "hsl(127, 100%, 88%)";
    }
    pen.fillRectObj(this.getRect(), {
      fillColor: bgColor,
    });
    // Stroke
    pen.strokeRectObj(this.getRect(), {
      strokeWidth: 1,
      strokeColor: "black",
      strokeDash: [8, 4],
    });

    // Render each node of this container
    for (const node of this.layout.list) {
      // Create a new canvas to be able to cut content if bigger than container
      // const pen = new Pen(document.createElement("canvas"));
      node.render(pen);
    }
    // pen.image(this.containerPen.getImage(), 0, 0, 0, 0, 0, 0);
  }
  // === EVENTS METHODS ===
  /**
   * Container.handleOnMouseUp()
   * On a container, handleOnMouseUp just propagate event to its child.
   * Until a child return true.
   * If not a single child returns true, then return false.
   */
  handleOnMouseDown(px, py) {
    // A container just propagate
    if (!this.visible) return false;
    // Iterate from topmost to bottommost if draw order matters
    const list = this.layout.list;
    for (let i = list.length - 1; i >= 0; i--) {
      const child = list[i];
      if (child.handleOnMouseDown && child.handleOnMouseDown(px, py)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Container.handleOnMouseUp()
   * A container just propagate
   */
  handleOnMouseUp(px, py) {
    if (!this.visible) return false;
    // Iterate from topmost to bottommost if draw order matters
    const list = this.layout.list;
    for (let i = list.length - 1; i >= 0; i--) {
      const child = list[i];
      if (child.handleOnMouseUp && child.handleOnMouseUp(px, py)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Container.handleOnMouseMove()
   * A container just propagate
   */
  handleOnMouseMove(px, py) {
    // A container just propagate
    if (!this.visible) return false;

    // Iterate from topmost to bottommost if draw order matters
    for (let i = this.layout.list.length - 1; i >= 0; i--) {
      const child = this.layout.list[i];
      if (child.handleOnMouseMove && child.handleOnMouseMove(px, py)) {
        return true;
      }
    }
    return false;
  }
}
/**
 * A Navigator is a Container that can have one layout per page
 */
class NavigatorContainer extends Node {
  constructor(nodeName, pages = { default: new VList("default") }) {
    super(nodeName, undefined);
    super.setName(nodeName);
    this.pages = pages;
    this.currentPage = "default";
  }
  setPage(pageName, layout) {
    this.pages[pageName] = layout;
  }
  navigate(pageName) {
    this.currentPage = pageName;
  }
  /**
   * Container.add()
   * This adds a child to its layout.
   * The Container.layout instance is responsible for storing nodes.
   * - location is only used by BorderLayout
   */
  add(newNode, location) {
    newNode.parent = this;
    const currentLayout = this.pages[this.currentPage];
    currentLayout.add(newNode, location);
  }
  /**
   * Container.arrange()
   * The caller (another Container.layout) always define the containre position.
   * Then we propage the arrange() to my childs.
   */
  arrange(parent, new_x = 0, new_y = 0) {
    const currentLayout = this.pages[this.currentPage];
    this.setPosition(new Position(new_x, new_y));
    currentLayout.arrange(this, new_x, new_y);
  }
  /**
   * Container.measure()
   * A container ask its layout to measure the needed size to fit all childs.
   * Then store/cache the Size() in _measuredSize.
   */
  measure() {
    const currentLayout = this.pages[this.currentPage];
    const contentSize = currentLayout.measure(this);
    this._measuredSize = contentSize.clone();
    return this._measuredSize;
  }
  render(pen) {
    if (!this.visible) {
      return;
    }

    // Define which fillColor to use
    let bgColor = "rgb(209, 209, 209)";
    if (this.layout instanceof HList) {
      bgColor = "rgb(223, 228, 255)";
    } else if (this.layout instanceof VList) {
      bgColor = "rgb(255, 231, 255)";
    } else if (this.layout instanceof BorderLayout) {
      bgColor = "rgb(225, 253, 255)";
    } else if (this.layout instanceof FloatLayout) {
      bgColor = "hsl(42, 100%, 88%)";
    }

    // Fill
    pen.fillRectObj(this.getRect(), {
      fillColor: bgColor,
    });

    // Stroke
    pen.strokeRectObj(this.getRect(), {
      strokeWidth: 1,
      strokeColor: "black",
      strokeDash: [8, 4],
    });

    const currentLayout = this.pages[this.currentPage];
    for (const node of currentLayout.list) {
      node.render(pen);
    }
  }
  // === EVENTS METHODS ===
  /**
   * Navigator.handleOnMouseUp()
   * On a container, handleOnMouseUp just propagate event to its child.
   * Until a child return true.
   * If not a single child returns true, then return false.
   */
  handleOnMouseDown(px, py) {
    // A container just propagate
    if (!this.visible) return false;
    // Iterate from topmost to bottommost if draw order matters
    const currentLayout = this.pages[this.currentPage];
    const list = currentLayout.list;
    for (let i = list.length - 1; i >= 0; i--) {
      const child = list[i];
      if (child.handleOnMouseDown && child.handleOnMouseDown(px, py)) {
        return true;
      }
    }
    return false;
  }
  handleOnMouseUp(px, py) {
    // A container just propagate
    if (!this.visible) return false;
    // Iterate from topmost to bottommost if draw order matters
    const currentLayout = this.pages[this.currentPage];
    const list = currentLayout.list;
    for (let i = list.length - 1; i >= 0; i--) {
      const child = list[i];
      if (child.handleOnMouseUp && child.handleOnMouseUp(px, py)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Navigator.handleOnMouseMove()
   * On a container, handleOnMouseMove just propagate event to its child.
   */
  handleOnMouseMove(px, py) {
    // A container just propagate
    if (!this.visible) return false;

    // Iterate from topmost to bottommost if draw order matters
    const currentLayout = this.pages[this.currentPage];
    for (let i = currentLayout.list.length - 1; i >= 0; i--) {
      const child = currentLayout.list[i];
      if (
        child.handleOnMouseMoveCallback &&
        child.handleOnMouseMoveCallback(px, py)
      ) {
        return true;
      }
    }
    return false;
  }
}

/**
 * A Box Node is terminal and can't hold nodes inside it.
 */
class Box extends Node {
  constructor(name, size, props = {}) {
    super(name, size, undefined);
    if (!size || !(size instanceof Size)) {
      throw new Error("Box must have size defined!");
    }
    // super.setName(name);
    // super.setSize(size);
    this.style = {
      padding: 0,
      borderWidth: 2,
      borderColor: "#18501cff",
      backgroundColor: "rgb(195, 236, 123)",
      ...props.style,
    };
    // Events
    this.onMouseClickCallback = props.onMouseClickCallback;
    this.onMouseDownCallback = props.onMouseDownCallback;
    this.onMouseUpCallback = props.onMouseUpCallback;
    this.onMouseMoveCallback = props.onMouseMoveCallback;
    this.onMouseHoverStartCallback = props.onMouseHoverStartCallback;
    this.onMouseHoverEndCallback = props.onMouseHoverEndCallback;
    /**
     * To be able to track mouseHoverStart and mouseHoverEnd
     * we need a state, because they are edge events (state transition).
     */
    this.isDown = false;
    this.isOver = false;
    this.mouseDownStartTime = Date.now();
  }
  /**
   * Box.measure()
   * Return my size.
   * My size is always defined by user.
   */
  measure() {
    return this.getSize();
  }
  /**
   * Box.arrange()
   * Let caller (Container.layout) to define my position.
   */
  arrange(parent, new_x = 0, new_y = 0) {
    this.setPosition(new Position(new_x, new_y));

    // I must not call layout.arrange because a Box don't have a layout.
    // Only Containers have layouts!
    // this.layout.arrange(this, new_x, new_y);
  }
  /**
   * Box.add()
   * Only Containers can store inner childs!
   */
  add() {
    throw new Error("Box can't have children, only Container can!");
  }
  update() {}
  render(pen) {
    if (!this.visible) {
      return;
    }

    // Fill
    pen.fillRectObj(this.getRect(), {
      fillColor: this.style.backgroundColor,
    });

    // Stroke
    pen.strokeRectObj(this.getRect(), {
      strokeColor: this.style.borderColor,
      strokeWidth: this.style.borderWidth,
      strokeDash: [],
    });

    // Label
    pen.text(`${this.name}`, this.position.x + 5, this.position.y + 20);

    // Icon
  }
  // === EVENTS METHOD ===
  /**
   * Box.handleOnMouseDown/Up
   * Here, this event can produce 3 more events depending of current box.state!
   */
  handleOnMouseDown(px, py) {
    if (!this.visible) return false;
    if (!this.hitTest(px, py)) return false;

    this.isDown = true;
    this.mouseDownStartTime = Date.now();

    // MOUSE DOWN
    if (this.onMouseDownCallback) {
      this.onMouseDownCallback(this, new Point(px, py));
    }

    FrameTimeUtil.needUpdateOrRender = true;
    return true;
  }
  handleOnMouseUp(px, py) {
    if (!this.visible) return false;

    const wasDown = this.isDown;
    const isInside = this.hitTest(px, py);
    this.isDown = false;

    // MOUSE UP EVENT
    if (wasDown && this.onMouseUpCallback) {
      this.onMouseUpCallback(this, new Point(px, py));
      FrameTimeUtil.needUpdateOrRender = true;
    }

    // CLICK EVENT
    // Click event is trigger when transition from down to up happens quickly!
    if (wasDown && isInside && this.onMouseClickCallback) {
      const downDuration = Date.now() - this.mouseDownStartTime;
      if (downDuration < 100) {
        this.onMouseClickCallback(this, new Point(px, py));
        FrameTimeUtil.needUpdateOrRender = true;
      }
    }

    return wasDown || isInside;
  }
  /**
   * Box.handleOnMouseMove()
   * We call this method when the mouse is moving OVER the box region.
   * Here, this event can produce 3 more events depending of current box.state!
   */
  handleOnMouseMove(px, py) {
    // Check if mouse move event is over the box region.
    const wasOver = this.isOver;
    const isNowOver = this.hitTest(px, py);
    // STATE TRANSITION EVENTS
    // (1) onHoverEnd
    if (wasOver && !isNowOver && this.onMouseHoverEndCallback) {
      // State transition from over to not-over (onHoverEnd)
      this.onMouseHoverEndCallback(this, new Point(px, py));
      FrameTimeUtil.needUpdateOrRender = true;
    }
    // (2) onHoverStart
    // When mouse goes inside Box
    if (!wasOver && isNowOver && this.onMouseHoverStartCallback) {
      // State transition from not-over to over (onHoverStart)
      this.onMouseHoverStartCallback(this, new Point(px, py));
      FrameTimeUtil.needUpdateOrRender = true;
    }
    this.isOver = isNowOver;
    // STATELESS EVENTS
    // (3) When mouse is moving over Box.
    if (isNowOver) {
      // Check if the user defined a callback for move events.
      if (this.onMouseMoveCallback) {
        // Call the Box.callback for move events
        this.onMouseMoveCallback(this, new Point(px, py));
        /**
         * Make dirty!
         * Once we hit a box with mouse move event x,y that returns true
         * We can tell the frame to re-render to let the callback take effect.
         */
        FrameTimeUtil.needUpdateOrRender = true;
        // Return true to stop testing other Box in the tree.
        return true;
      }
    }
    // Return false to let other Box candidates to test itself
    return false;
  }
}
/**
 * A Window is part of WindowLayout.
 * A Window is a box, but also a Frame that holds a rootContainer.
 */
class WindowFrame extends Box {
  constructor(
    name = "wf",
    size = new Size(200, 200),
    rootContainer = new Container("wf", new VList("v")),
    props,
  ) {
    super(name, size, {
      fillColor: "white",
    });

    this.isDragging = false;
    this.dragOffset = new Point(0, 0);

    this.rootContainer = rootContainer;
    // this.rootContainer = new Container("wf", new VList("v"));
    // this.rootContainer = new Container("root", new BorderLayout("root"));
    this.rootContainer.add(new Button("top"), BorderLayout.TOP);
    this.rootContainer.add(new Button("bottom"), BorderLayout.BOTTOM);

    // Whole Window Rect
    const X = this.position.x;
    const Y = this.position.y;
    const W = this.size.w;
    // const H = this.size.h;

    // WindowBar Rect
    this.windowBarH = 30;
    this.windowBarRect = new Rect(X, Y, W, this.windowBarH);
    this.windowBarContainer = new Container("WindowBar", new HList(""));
    this.windowBarContainer.add(
      new Button("X", new Size(this.windowBarH, this.windowBarH), {}),
    );
    this.windowBarContainer.add(
      new Button("===", new Size(this.windowBarH, this.windowBarH), {}),
    );

    // Events handling
    this.setOnMouseDownCallback((box, mousePoint) => {
      // WindowFrame Dragging Logic
      // One drag if mouse position is over BarRect
      if (this.windowBarRect.containsPoint(mousePoint)) {
        this.isDragging = true;
        this.dragOffset = new Position(
          mousePoint.x - this.position.x,
          mousePoint.y - this.position.y,
        );
      }

      // Propagate to WindowFrame.Container
      this.rootContainer.handleOnMouseDown(mousePoint.x, mousePoint.y);
      this.windowBarContainer.handleOnMouseDown(mousePoint.x, mousePoint.y);
    });
    this.setOnMouseUpCallback((box, mousePoint) => {
      // WindowFrame Dragging Logic
      this.isDragging = false;

      // Propagate to WindowFrame.Container
      this.rootContainer.handleOnMouseUp(mousePoint.x, mousePoint.y);
      this.windowBarContainer.handleOnMouseUp(mousePoint.x, mousePoint.y);
    });
    this.setOnMouseMoveCallback((box, mousePoint) => {
      // WindowFrame Dragging Logic
      if (this.isDragging) {
        const newPos = new Position(
          mousePoint.x - this.dragOffset.x,
          mousePoint.y - this.dragOffset.y,
        );
        this.setPosition(newPos);
      }

      // Propagate to WindowFrame.Container
      this.rootContainer.handleOnMouseMove(mousePoint.x, mousePoint.y);
      this.windowBarContainer.handleOnMouseMove(mousePoint.x, mousePoint.y);
    });
  }
  arrange() {}
  update() {
    // Frame and its RootContainer occupy entire canvas
    const X = this.position.x;
    const Y = this.position.y;
    const W = this.size.w;
    const H = this.size.h;

    // Container must be WindowFrame size
    this.rootContainer.setSize(new Size(W, H - this.windowBarH));
    // Update Container._measuredSize
    this.rootContainer.measure();
    // RootContainer starts at WindowFrame position
    this.rootContainer.arrange(this, X, Y + this.windowBarH);

    // TopBarContainer
    this.windowBarContainer.setSize(new Size(W, this.windowBarH));
    this.windowBarContainer.measure();
    this.windowBarContainer.arrange(this, X, Y);

    // Update WindowBarRect
    this.windowBarRect = new Rect(X, Y, W, this.windowBarH);
  }
  getWindowRect() {
    return this.getRect();
  }
  getBarRect() {
    return this.windowBarRect;
  }
  getContentRect() {}
  render(pen) {
    if (!this.visible) {
      return;
    }
    // Window
    pen.fillRectObj(this.getWindowRect(), {
      fillColor: this.isDragging ? "yellow" : "white",
    });
    pen.strokeRectObj(this.getWindowRect(), {});
    pen.text(`${this.name}`, this.position.x + 5, this.position.y + 20);

    // WindowBar
    pen.fillRectObj(this.getBarRect(), {
      fillColor: "#4398ff",
    });
    pen.text(`${this.name}`, this.getBarRect().x + 5, this.getBarRect().y + 15);

    // Content
    this.rootContainer.render(pen);
    this.windowBarContainer.render(pen);
  }
}
/**
 * A CanvasBox is a box that has it own canvas inside.
 */
class CanvasBox extends Box {
  constructor() {
    super("canvasbox", new Size(100, 100), {});
    this.canvas = document.createElement("canvas");
    this.canvas.width = 100;
    this.canvas.height = 100;
  }
  render(pen) {
    pen.image(this.canvas, 0, 0, 100, 100, 0, 0, 100, 100);
  }
}
/**
 * A button is a box that defines mouse event behaviors.
 */
class Button extends Box {
  static defaultBgColor = "white";
  static defaultBgColorEnabled = "lightgreen";
  constructor(name = "bto", size = new Size(50, 50), props) {
    super(name, size, {
      style: {
        backgroundColor: ToggleButton.defaultBgColor,
        borderColor: "black",
        borderWidth: 2,
      },
      onMouseClickCallback: (box) => {
        // box.style.backgroundColor = "green";
        props?.onMouseClickCallback?.();
      },
      onMouseDownCallback: (box) => {
        box.style.borderWidth = 4;
      },
      onMouseUpCallback: (box) => {
        box.style.borderWidth = 2;
      },
      onMouseHoverStartCallback: (box) => {
        box.style.borderColor = "red";
      },
      onMouseHoverEndCallback: (box) => {
        box.style.borderColor = "black";
      },
    });
  }
}
/**
 * A toogle hold states when user click over it
 */
class ToggleButton extends Box {
  static defaultBgColor = "white";
  constructor(name = "toggle", size = new Size(50, 50), props) {
    super(name, size, {
      style: {
        backgroundColor: ToggleButton.defaultBgColor,
        borderColor: "black",
        borderWidth: 2,
      },
      onMouseClickCallback: (box) => {
        if (box.state.toggle) {
          box.state.toggle = false;
          box.style.backgroundColor = "white";
        } else {
          box.style.backgroundColor = "green";
          box.state.toggle = true;
        }
      },
      onMouseDownCallback: (box) => {
        box.style.borderWidth = 4;
      },
      onMouseUpCallback: (box) => {
        box.style.borderWidth = 2;
      },
      onMouseHoverStartCallback: (box) => {
        box.style.borderColor = "red";
      },
      onMouseHoverEndCallback: (box) => {
        box.style.borderColor = "black";
      },
    });
    this.state.toggle = false;
  }
}
