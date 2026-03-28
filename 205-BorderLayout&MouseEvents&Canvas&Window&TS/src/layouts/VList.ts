import { Position } from "../utils/Position";
import { Size } from "../utils/Size";
import { Layout } from "../core/Layout";

export class VList extends Layout {
  measure(): Size {
    let accumulatedH = 0;
    let maxW = 0;
    for (const child of this.list) {
      const childSize = child.measure();
      accumulatedH += childSize.h;
      maxW = Math.max(maxW, childSize.w);
    }
    return new Size(maxW, accumulatedH);
  }
  arrange(position: Position): void {
    let offsetY = position.y;
    for (const child of this.list) {
      child.arrange(new Position(position.x, offsetY));
      const childSize = child.measure();
      offsetY += childSize.h + 10;
    }
  }
}
