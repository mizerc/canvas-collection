import { Geometry } from "./Geometry";

export class Point {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  clone(): Point {
    return new Point(this.x, this.y);
  }

  add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }

  sub(other: Point): Point {
    return new Point(this.x - other.x, this.y - other.y);
  }

  distanceTo(other: Point): number {
    return Geometry.distance(this, other);
  }

  toString(): string {
    return `<${this.x.toFixed(0)},${this.y.toFixed(0)}>`;
  }
}
