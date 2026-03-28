class Size {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
}
class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Geometry {
  static pointInRect(p, r) {
    return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
  }

  static rectIntersect(r1, r2) {
    return !(
      r2.x > r1.x + r1.w ||
      r2.x + r2.w < r1.x ||
      r2.y > r1.y + r1.h ||
      r2.y + r2.h < r1.y
    );
  }

  static rectContainsRect(r1, r2) {
    return (
      r2.x >= r1.x &&
      r2.y >= r1.y &&
      r2.x + r2.w <= r1.x + r1.w &&
      r2.y + r2.h <= r1.y + r1.h
    );
  }

  static distance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static centerOfRect(r) {
    return new Point(r.x + r.w / 2, r.y + r.h / 2);
  }
}

class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  add(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  sub(other) {
    return new Point(this.x - other.x, this.y - other.y);
  }

  distanceTo(other) {
    return Geometry.distance(this, other);
  }
}

class Rect {
  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  toString() {
    return `Rect(${this.x}, ${this.y}, ${this.w}, ${this.h})`;
  }

  clone() {
    return new Rect(this.x, this.y, this.w, this.h);
  }

  containsPoint(p) {
    return Geometry.pointInRect(p, this);
  }

  intersects(other) {
    return Geometry.rectIntersect(this, other);
  }

  containsRect(other) {
    return Geometry.rectContainsRect(this, other);
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  center() {
    return Geometry.centerOfRect(this);
  }
}
