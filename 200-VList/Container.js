class Container {
  constructor(canvas) {
    this.canvas = canvas;
    this.pen = new Pen(canvas, canvas.width, canvas.height);
    this.rect = new Rect(0, 0, canvas.width, canvas.height);
    this.list = [];
  }
  add(el) {
    this.list.push(el);
  }
  handleClick(x, y) {
    // Delegate to children
    for (const el of this.list) {
      if (el.hitTest) el.hitTest(x, y);
    }
  }
  update() {
    let offsetY = 0;
    for (const el of this.list) {
      el.update(0, offsetY);
      offsetY += el.h;
    }
  }
  render() {
    const pen = this.pen;
    pen.fillRectObj(this.rect, "#ccc");
    pen.strokeRectObj(this.rect, "red");
    for (const el of this.list) {
      el.render(pen);
    }
  }
}
class VList {
  constructor() {
    this.list = [];
    this.rect = new Rect(0, 0, 0, 0);
  }
  add(el) {
    this.list.push(el);
    this.recalculateSize();
  }
  recalculateSize() {
    this.rect.w = 0;
    this.rect.h = 0;
    for (const el of this.list) {
      this.rect.w = Math.max(this.rect.w, el.w);
      this.rect.h += el.h;
    }
  }
  hitTest(px, py) {
    // delegate to children
    for (const el of this.list) {
      if (el.hitTest && el.hitTest(px, py)) return true;
    }
    return false;
  }
  update(x, y) {
    this.recalculateSize();
    let offsetY = y;
    for (const el of this.list) {
      el.update(x, offsetY);
      offsetY += el.h;
    }
  }
  render(pen) {
    pen.fillRectObj(this.rect, "#a6cdffff");
    pen.strokeRectObj(this.rect, "#233aaaff");
    for (const el of this.list) {
      el.render(pen);
    }
  }
}

class Box {
  constructor(w = 100, h = 40, callback = () => {}) {
    this.rect = new Rect(0, 0, w, h);
    this.onClick = callback;
  }
  update(x, y) {
    this.rect.x = x;
    this.rect.y = y;
  }
  render(pen) {
    pen.fillRectObj(this.rect, "#aebc95ff");
    pen.strokeRectObj(this.rect, "#18501cff");
  }
  hitTest(px, py) {
    const point = new Point(px, py);
    if (this.rect.containsPoint(point)) {
      this.onClick(this);
      return true;
    }
    return false;
  }
  get w() {
    return this.rect.w;
  }
  get h() {
    return this.rect.h;
  }
}
