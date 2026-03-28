class Node {
  constructor(name, size, layout) {
    if (!name) {
      throw new Error("Node must have name defined!");
    }
    this.parent = null;
    this.position = new Position(0, 0);
    this.size = size ?? new Size(0, 0);
    this.layout = layout ?? new Size(0, 0);
    this.visible = true;
  }
  log(text) {
    console.log(`[${this.name}]: ${text}`);
  }
  setLayout(layout) {
    if (!layout || !(layout instanceof Layout)) {
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
      `[S] Node(${this.name}).setSize called: ${this.size.w}x${this.size.h}`
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
  hitTest(px, py) {
    if (!this.visible) return false;
    const clickPosition = new Point(px, py);
    const rectangle = this.getRect();
    return rectangle.containsPoint(clickPosition);
  }
  handleClick(px, py) {
    if (this.hitTest(px, py)) {
      if (this.onClick) {
        this.onClick(this);
        return true;
      }
    }
    return false;
  }
}
