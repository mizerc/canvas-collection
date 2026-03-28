import { Size } from "../utils/Size";
import { Point } from "../utils/Point";
import { Position } from "../utils/Position";
import { Rect } from "../utils/Rect";
import { Pen } from "../utils/Pen";
import { Container } from "./Container";
import { Node } from "./Node";
import { FrameTimeUtil } from "./FrameTimeUtil";
import {
  BorderLayout,
  BorderLayoutLocationType,
} from "../layouts/BorderLayout";
import { Box } from "./Box";

/**
 * A Frame is an instance that holds a single container and canvas.
 */
export class Frame {
  rootContainer: Container;
  pen: Pen;

  constructor(
    canvas: HTMLCanvasElement,
    rootContainer: Container = new Container("root", new BorderLayout()),
  ) {
    // For rendering only
    if (!canvas) {
      throw new Error("Window must define canvas");
    }
    this.pen = new Pen(canvas);

    // Frame owns one single container
    this.rootContainer = rootContainer;
  }

  add(newNode: Box, location?: BorderLayoutLocationType): void {
    this.rootContainer.add(newNode, location);
  }

  update(): void {
    if (!FrameTimeUtil.needUpdateOrRender) return;
    FrameTimeUtil.updateCount += 1;

    console.log(`[Frame] update.start`);

    // Frame and its RootContainer occupy entire canvas
    // User sets size of Browser.canvas, then the library adjust itself to fit that size
    const W = this.pen.canvas.width;
    const H = this.pen.canvas.height;
    this.rootContainer.setSize(new Size(W - 200, H - 200));
    this.rootContainer.arrange(new Position(100, 100));
    // this.rootContainer.measure();
    // Redo arrange to apply available space data
    // this.rootContainer.arrange(new Position(0, 0));

    // Propagate update
    this.rootContainer.update();

    console.log(`[Frame] update.end`);
  }

  render(): void {
    if (!FrameTimeUtil.needUpdateOrRender) return;
    FrameTimeUtil.renderCount += 1;

    // Clear entire Browser.canvas
    this.pen.clear("rgb(208, 190, 190)");

    // Render content
    this.rootContainer.render(this.pen);

    // Debug
    FrameTimeUtil.render(this.pen);
    FrameTimeUtil.needUpdateOrRender = false;
  }

  /**
   * Propagate down/up event to its children.
   */
  handleOnMouseDown(px: number, py: number): void {
    FrameTimeUtil.needUpdateOrRender = true;
    console.log("EV-1: container on mouse down");
    this.rootContainer.handleOnMouseDown(px, py);
  }

  handleOnMouseUp(px: number, py: number): void {
    FrameTimeUtil.needUpdateOrRender = true;
    console.log("EV-1: container on mouse up");
    this.rootContainer.handleOnMouseUp(px, py);
  }

  handleOnMouseMove(x: number, y: number): void {
    // FrameTimeUtil.needUpdateOrRender = true;
    // console.log("EV-1: container on mouse move");
    this.rootContainer.handleOnMouseMove(x, y);
  }
}
