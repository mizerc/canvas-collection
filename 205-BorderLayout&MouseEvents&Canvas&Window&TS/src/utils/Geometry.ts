import { Point } from "./Point";
import { Rect } from "./Rect";

export class Geometry {
  static pointInRect(p: Point, r: Rect): boolean {
    return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
  }

  static rectIntersect(r1: Rect, r2: Rect): boolean {
    return !(
      r2.x > r1.x + r1.w ||
      r2.x + r2.w < r1.x ||
      r2.y > r1.y + r1.h ||
      r2.y + r2.h < r1.y
    );
  }

  static rectContainsRect(r1: Rect, r2: Rect): boolean {
    return (
      r2.x >= r1.x &&
      r2.y >= r1.y &&
      r2.x + r2.w <= r1.x + r1.w &&
      r2.y + r2.h <= r1.y + r1.h
    );
  }

  static distance(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static centerOfRect(r: Rect): Point {
    return new Point(r.x + r.w / 2, r.y + r.h / 2);
  }
}
