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

    pen.fillRectObj(new Rect(5, textY, 200, textGap), "#eeea");
    pen.text(`UpdateCount: ${FrameTimeUtil.updateCount}`, 10 + 2, textY + 18);
    textY += textGap + rectSpacing;

    pen.fillRectObj(new Rect(5, textY, 200, textGap), "#eeaa");
    pen.text(`RenderCount: ${FrameTimeUtil.renderCount}`, 10 + 2, textY + 18);
    textY += textGap + rectSpacing;
  }
}
/**
 * A Frame is a instance that holds a single container and canvas.
 */
class Frame {
  constructor(canvas, layout = new VList("FRAME")) {
    if (!canvas) {
      throw new Error("Window must define canvas");
    }
    if (!layout) {
      throw new Error("Window must define layout");
    }
    // Frame owns one single container
    this.rootContainer = new Container("root", layout);
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
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.rootContainer.setSize(new Size(W, H));

    // Update Container._measuredSize
    this.rootContainer.measure();

    // RootContainer starts at 0,0 of canvas
    this.rootContainer.arrange(this, 0, 0);
  }
  render() {
    if (!FrameTimeUtil.needUpdateOrRender) return;
    FrameTimeUtil.renderCount += 1;

    // Clear canvas
    this.pen.clear("#878787ff");
    this.rootContainer.render(this.pen);
    FrameTimeUtil.render(this.pen);

    FrameTimeUtil.needUpdateOrRender = false;
  }
  /**
   * Propagate click event to its children.
   */
  handleOnMouseClick(px, py) {
    FrameTimeUtil.needUpdateOrRender = true;
    console.log("EV-1: container on mouse click");
    this.rootContainer.handleOnMouseClick(px, py);
  }
  handleOnMouseMove(x, y) {
    // FrameTimeUtil.needUpdateOrRender = true;
    this.rootContainer.handleOnMouseMove(x, y);
  }
}
class Node {
  constructor(name, size, layout) {
    if (!name) {
      throw new Error("Node must have name defined!");
    }
    this.parent = null;
    this.visible = true;
    this.name = name;
    this.position = new Position(0, 0);
    this.size = size ?? new Size(0, 0);
    // Container
    this.layout = layout ?? new Size(0, 0);
    // For users to save state
    this.state = {};
  }
  log(text) {
    console.log(`[${this.name}]: ${text}`);
  }
  setLayout(layout) {
    if (layout !== null && !(layout instanceof Layout)) {
      throw new Error("Node must have layout defined");
    }
    this.layout = layout;
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
  setOnMouseClick = (callback) => {
    this.onMouseClick = callback;
  };
  setOnMouseMove(callback) {
    this.onMouseMove = callback;
  }
  setOnMouseHoverStart(callback) {
    this.onMouseHoverStart = callback;
  }
  setOnMouseHoverEnd(callback) {
    this.onMouseHoverEnd = callback;
  }
  /**
   * The handle* methods are called by Frame or Container only.
   */
  handleOnMouseMove(px, py) {
    throw new Error("Must be overwriten by extends class!");
  }
  handleOnMouseClick(px, py) {
    throw new Error("Must be overwriten by extends class!");
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
 * A Container Node must have a layout which holds more nodes.
 */
class Container extends Node {
  constructor(name, layout) {
    super(name, undefined, layout);
    super.setName(name);
    super.setLayout(layout);
  }
  /**
   * Container.add()
   * A container can store node inside it.
   * The Container.layout instance is responsible for storing nodes.
   */
  add(node, location) {
    node.parent = this;
    this.layout.add(node, location);
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
  /**
   * Container.measure()
   * A container ask its layout to measure the needed size to fit all childs.
   * Then store/cache the Size() in _measuredSize.
   */
  measure() {
    const contentSize = this.layout.measure(this);
    this._measuredSize = contentSize.clone();
    return this._measuredSize;
  }
  render(pen) {
    if (!this.visible) {
      return;
    }
    let bgColor = "#eaeaeaff";
    if (this.layout instanceof HList) {
      bgColor = "#bbd1ddff";
    } else if (this.layout instanceof VList) {
      bgColor = "#ddbbddff";
    } else if (this.layout instanceof BorderLayout) {
      bgColor = "rgb(222, 215, 199)";
    }
    pen.fillRectObj(this.getRect(), bgColor);
    pen.strokeRectObj(this.getRect(), "#444444", 3);
    for (const node of this.layout.list) {
      node.render(pen);
    }
  }
  // === EVENTS METHODS ===
  /**
   * Container.handleOnMouseClick()
   * On a container, handleOnMouseClick just propagate event to its child.
   * Until a child return true.
   * If not a single child returns true, then return false.
   */
  handleOnMouseClick(px, py) {
    console.log(`EV-2a: container<${this.name}> on mouse click`);

    // A container just propagate
    if (!this.visible) return false;

    // Iterate from topmost to bottommost if draw order matters
    const list = this.layout.list;
    for (let i = list.length - 1; i >= 0; i--) {
      const child = list[i];
      if (child.handleOnMouseClick && child.handleOnMouseClick(px, py)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Container.handleOnMouseClick()
   * On a container, handleOnMouseClick just propagate event to its child.
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
 * A Box Node is terminal and can't hold nodes inside it.
 */
class Box extends Node {
  constructor(name, size) {
    super(name, size, undefined);
    if (!size || !(size instanceof Size)) {
      throw new Error("Box must have size defined!");
    }
    super.setName(name);
    super.setSize(size);
    super.setLayout(null);
    this.style = {
      padding: 0,
      borderWidth: 1.5,
      borderColor: "#18501cff",
      backgroundColor: "#acd95eff",
      onHoverColor: "#9b9f5cff",
    };
    /**
     * To be able to track mouseHoverStart and mouseHoverEnd
     * we need a state, because they are edge events (state transition).
     */
    this.isOver = false;
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
  render(pen) {
    if (!this.visible) {
      return;
    }

    // Fill
    pen.fillRectObj(this.getRect(), this.style.backgroundColor);

    // Stroke
    pen.strokeRectObj(
      this.getRect(),
      this.style.borderColor,
      this.style.borderWidth,
    );

    // Label
    pen.text(
      `${this.name}: ${this.style.backgroundColor}`,
      this.position.x + 5,
      this.position.y + 20,
    );

    // Icon
  }
  // === EVENTS METHOD ===
  /**
   * Box.handleOnMouseClick
   */
  handleOnMouseClick(px, py) {
    console.log(`EV-2b: Box<${this.name}> on mouse click`);
    if (this.hitTest(px, py)) {
      console.log(`EV-3: Box<${this.name}> click hit test true`);
      if (this.onMouseClick) {
        console.log(`EV-3: Box<${this.name}> calling callback!`);
        this.onMouseClick(this);
        return true;
      } else {
        console.log(`EV-3: Box<${this.name}> no callback defined`);
      }
    }
    console.log(`EV-3: Box<${this.name}> click hit test FALSE`);
    return false;
  }
  /**
   * Box.handleOnMouseMove()
   * We call this method when the mouse is moving OVER the box region.
   */
  handleOnMouseMove(px, py) {
    // Check if mouse move event is over the box region.
    const wasOver = this.isOver;
    const isNowOver = this.hitTest(px, py);
    // STATE TRANSITION EVENTS
    // onHoverEnd
    if (wasOver && !isNowOver && this.onMouseHoverEnd) {
      // State transition from over to not-over (onHoverEnd)
      this.onMouseHoverEnd(this);
      FrameTimeUtil.needUpdateOrRender = true;
    }
    // onHoverStart
    // When mouse goes inside Box
    if (!wasOver && isNowOver && this.onMouseHoverStart) {
      // State transition from not-over to over (onHoverStart)
      this.onMouseHoverStart(this);
      FrameTimeUtil.needUpdateOrRender = true;
    }
    this.isOver = isNowOver;

    // STATELESS EVENTS
    // When mouse is moving over Box.
    if (isNowOver) {
      // Check if the user defined a callback for move events.
      if (this.onMouseMove) {
        // Call the Box.callback for move events
        this.onMouseMove(this);
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
