class Node {
  #nodeName;
  constructor(nodeName, size, layout) {
    if (!nodeName) {
      throw new Error("Node must have nodeName defined!");
    }
    this.parent = null;
    this.position = new Position(0, 0);
    this.size = size ?? new Size(0, 0);
    this.layout = layout ?? new Size(0, 0);
    this.visible = true;
  }
  log(text) {
  }
  setLayout(layout) {
    if (!layout || !(layout instanceof Layout)) {
      throw new Error("Node must have layout defined");
    }
    this.layout = layout;
  }
  handleClick(px, py) {
    throw new Error("Node.handleClick must be overridden in subclass");
  }
  setName(name) {
    this.#nodeName = name;
  }
  getName() {
    return this.#nodeName;
  }
  // Arrange/update final position/size (top-down).
  setPosition(position) {
    if (!(position instanceof Position)) {
      throw new Error("size must be instanceof Size");
    }
    this.position = new Position(position.x, position.y);
  }
  setSize(size) {
    if (!(size instanceof Size)) {
      throw new Error("size must be instanceof Size");
    }
    this.size = new Size(size.w, size.h);
  }
  getSize() {
    return this.size;
  }
  getScreenRect() {
    return new Rect(this.position.x, this.position.y, this.size.w, this.size.h);
  }
  arrange(parent, x = 0, y = 0) {
    throw new Error("Node.arrange must be overridden in subclass");
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
    const rectangle = this.getScreenRect();
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
