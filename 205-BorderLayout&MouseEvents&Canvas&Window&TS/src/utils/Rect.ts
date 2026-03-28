import { Point } from "./Point";
import { Geometry } from "./Geometry";

/**
 * A rect that holds (position.x, position.y, size.w, size.h)
 * It is NOT two coordinates like rect(p1.x,p1.y,p2.x,p2.y), it is position + size.
 */
export class Rect {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  toString(): string {
    return `Rect(${this.x}, ${this.y}, ${this.w}, ${this.h})`;
  }

  clone(): Rect {
    return new Rect(this.x, this.y, this.w, this.h);
  }

  containsPoint(p: Point): boolean {
    return Geometry.pointInRect(p, this);
  }

  intersects(other: Rect): boolean {
    return Geometry.rectIntersect(this, other);
  }

  containsRect(other: Rect): boolean {
    return Geometry.rectContainsRect(this, other);
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  center(): Point {
    return Geometry.centerOfRect(this);
  }
}
