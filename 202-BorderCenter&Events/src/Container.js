class Container extends Node {
  constructor(nodeName, layout) {
    super(nodeName, undefined, layout);
    this.setName(nodeName);
    this.setLayout(layout);
  }
  addNode(node, location) {
    node.parent = this;
    this.layout.addNode(node, location);
  }
  handleClick(x, y) {
    for (const node of this.layout.getAllNodes()) {
      if (node.handleClick && node.handleClick(x, y)) {
        return true;
      }
    }
    return false;
  }
  handleMove(x, y) {
    for (const node of this.layout.getAllNodes()) {
      if (node.handleMove && node.handleMove(x, y)) {
        return true;
      }
    }
    return false;
  }
  measure() {
    const layoutSize = this.layout.measure(this);
    return layoutSize;
  }
  arrange(parent, startX = 0, startY = 0) {
    // Let my layout arrange its children
    this.layout.arrange(this, startX, startY);
  }
  render(pen) {
    if (!this.visible) {
      return;
    }
    // Container color based on layout type
    let bgColor = "#eaeaeaff";
    if (this.layout instanceof HList) {
      bgColor = "rgba(243, 251, 255, 1)";
    } else if (this.layout instanceof VList) {
      bgColor = "#e2b9e2ff";
    } else if (this.layout instanceof BorderLayout) {
      bgColor = "#bde49bff";
    } else if (this.layout instanceof BorderCenter) {
      bgColor = "#fed6a7ff";
    }
    pen.fillRectObj(this.getScreenRect(), bgColor);
    pen.strokeRectObj(this.getScreenRect(), "#000000ff", 2);
    for (const node of this.layout.getAllNodes()) {
      node.render(pen);
    }
    // Text
    // pen.text(
    //   `${this.getName()} (${this.measure().w}, ${this.measure().h})`,
    //   this.position.x + 200,
    //   this.position.y + 100
    // );
  }
}
