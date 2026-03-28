import { Container } from "../core/Container";
import { Position } from "../utils/Position";
import { Debugger } from "../utils/Debugger";
import { Size } from "../utils/Size";
import { Layout } from "../core/Layout";
import { Node } from "../core/Node";
import { Expander } from "../derivated/Expander";

/**
 * HList is a Stack Layout.
 * A stack keeps adding nodes in a single direction.
 */
export class HList extends Layout {
  measure(): Size {
    Debugger.blue(`  [HList<${this.name}>] measure.start`);
    let accumulatedW = 0;
    let maxH = 0;
    for (const child of this.list) {
      const childSize = child.measure();
      accumulatedW += childSize.w;
      maxH = Math.max(maxH, childSize.h);
    }
    Debugger.darkblue(`  [HList<${this.name}>] measure.end`);
    return new Size(accumulatedW, maxH);
  }
  arrange(position: Position): void {
    Debugger.blue(` [HList<${this.name}>] arrange.start`);
    let offsetX = position.x;
    for (const child of this.list) {
      child.arrange(new Position(offsetX, position.y));
      const childSize = child.measure();
      offsetX += childSize.w + 10;
    }
    Debugger.darkblue(` [HList<${this.name}>] arrange.end`);
  }
}
