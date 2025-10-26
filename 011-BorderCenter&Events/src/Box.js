class Box extends Node {
  constructor({
    name,
    size,
    title,
    onClick = () => {},
    onMouseOverChange = () => {},
  }) {
    super(name, size, undefined);
    if (!size || !(size instanceof Size)) {
      throw new Error("Box must have size defined!");
    }
    this.setName(name);
    this.setSize(size);
    this.title = title;
    this.onClick = onClick;
    this.onMouseOverChange = onMouseOverChange;
    this.isOver = false;
    this.style = {
      padding: 0,
      backgroundColor: "#c5ff62ff",
      borderColor: "#18501cff",
      borderWidth: 1.5,
    };
  }
  hitTest(px, py) {
    const point = new Point(px, py);
    if (this.getScreenRect().containsPoint(point)) {
      return true;
    }
    return false;
  }
  handleClick(px, py) {
    if (!this.visible) {
      return false;
    }
    if (this.hitTest(px, py)) {
      if (this.onClick) {
        this.onClick(this);
      }
      return true;
    }
    return false;
  }
  setStyle(style) {
    this.style = { ...this.style, ...style };
  }
  handleMove(px, py) {
    if (!this.visible) {
      return false;
    }
    const isCurrentlyOver = this.isOver;
    this.isOver = this.hitTest(px, py);
    if (isCurrentlyOver !== this.isOver) {
      this.onMouseOverChange(this, this.isOver);
      return true;
    }
    return false;
  }
  setVisible(visible) {
    this.visible = visible;
  }
  addNode() {
    throw new Error("Box can't have children, only Container can!");
  }
  measure() {
    if (!this.visible) {
      return new Size(0, 0);
    }
    const size = new Size(this.size.w, this.size.h);
    return size;
  }
  render(pen) {
    if (!this.visible) {
      return;
    }
    pen.fillRectObj(this.getScreenRect(), this.style.backgroundColor);
    pen.strokeRectObj(this.getScreenRect(), this.style.borderColor, 2);
    // Text
    pen.text(`${this.title}`, this.position.x + 5, this.position.y + 20);
    // pen.text(
    //   `${this.getName()} (${this.measure().w}, ${this.measure().h})`,
    //   this.position.x + 5,
    //   this.position.y + 20
    // );
  }
}
