class Frame {
  constructor(canvas, layout = new VList("FRAME")) {
    if (!canvas) {
      throw new Error("Window must define canvas");
    }
    if (!layout) {
      throw new Error("Window must define layout");
    }
    this.canvas = canvas;
    this.pen = new Pen(canvas);
    this.rootContainer = new Container("root", layout);
  }
  add(node, location) {
    this.rootContainer.add(node, location);
  }
  update() {
    this.rootContainer.measure();
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.rootContainer.setSize(new Size(W, H));
    this.rootContainer.arrange(this, 0, 0);
  }
  render() {
    this.rootContainer.render(this.pen);
  }
}
class Container extends Node {
  constructor(name, layout) {
    super(name, undefined, layout);
    this.setName(name);
    this.setLayout(layout);
  }
  add(node, location) {
    node.parent = this;
    this.layout.add(node, location);
  }
  arrange(parent, x = 0, y = 0) {
    this.setPosition(new Position(x, y));
    this.layout.arrange(this, x, y);
  }
  measure() {
    const contentSize = this.layout.measure(this);
    this._measuredSize = new Size(contentSize.w, contentSize.h);
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
      bgColor = "#dddbbaff";
    }
    pen.fillRectObj(this.getRect(), bgColor);
    pen.strokeRectObj(this.getRect(), "#444444", 3);
    for (const node of this.layout.list) {
      node.render(pen);
    }
  }
}
class Box extends Node {
  constructor(name, size) {
    super(name, size, undefined);
    if (!size || !(size instanceof Size)) {
      throw new Error("Box must have size defined!");
    }
    this.setName(name);
    this.setSize(size);
    this.style = {
      padding: 0,
      backgroundColor: "#acd95eff",
      onHoverColor: "#9b9f5cff",
      borderColor: "#18501cff",
      borderWidth: 1.5,
    };
  }
  add() {
    throw new Error("Box can't have children, only Container can!");
  }
  measure() {
    return this.getSize();
  }
  render(pen) {
    if (!this.visible) {
      return;
    }
    pen.fillRectObj(
      this.getRect(),
      this.isOver ? this.style.onHoverColor : this.style.backgroundColor
    );
    pen.strokeRectObj(
      this.getRect(),
      this.style.borderColor,
      this.style.borderWidth
    );
    pen.text(this.name, this.position.x + 5, this.position.y + 20);
  }
}
