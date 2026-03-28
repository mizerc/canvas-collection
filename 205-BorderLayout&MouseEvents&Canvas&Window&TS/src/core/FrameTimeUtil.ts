import { Size } from "../utils/Size";
import { Point } from "../utils/Point";
import { Position } from "../utils/Position";
import { Rect } from "../utils/Rect";
import { Pen } from "../utils/Pen";

export class FrameTimeUtil {
  static needUpdateOrRender: boolean = true;
  static updateCount: number = 0;
  static renderCount: number = 0;

  static render(pen: Pen): void {
    let textY = 20;
    const textGap = 25;
    const rectSpacing = 2;

    pen.fillRectObj(new Rect(5, textY, 200, textGap), { fillColor: "#eeaa" });
    pen.text(`UpdateCount: ${FrameTimeUtil.updateCount}`, 12, textY + 18);
    textY += textGap + rectSpacing;

    pen.fillRectObj(new Rect(5, textY, 200, textGap), { fillColor: "#eeaa" });
    pen.text(`RenderCount: ${FrameTimeUtil.renderCount}`, 12, textY + 18);
    textY += textGap + rectSpacing;
  }
}
