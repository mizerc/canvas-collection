class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(vec) {
    this.x += vec.x;
    this.y += vec.x;
    return new Vec2(this.x, this.y);
  }
  scale(k) {
    this.x = this.x * k;
    this.y = this.y * k;
    return new Vec2(this.x, this.y);
  }
  scalarDiv(k) {
    this.x = this.x / k;
    this.y = this.y / k;
    return new Vec2(this.x, this.y);
  }
  static from(vec) {
    return new Vec2(vec.x, vec.y);
  }
}
