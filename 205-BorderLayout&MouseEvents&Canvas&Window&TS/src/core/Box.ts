import { Point } from "../utils/Point";
import { Size } from "../utils/Size";
import { Pen } from "../utils/Pen";
import { Position } from "../utils/Position";
import { FrameTimeUtil } from "./FrameTimeUtil";
import { Node } from "./Node";
import { Debugger } from "../utils/Debugger";

export type MouseCallback = (node: Box, point: Point) => void;

export type BoxStyle = {
  padding?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
};

export type BoxProps<T extends Box = Box> = {
  style?: BoxStyle;
  onMouseClickCallback?: MouseCallback;
  onMouseDownCallback?: MouseCallback;
  onMouseUpCallback?: MouseCallback;
  onMouseMoveCallback?: MouseCallback;
  onMouseHoverStartCallback?: MouseCallback;
  onMouseHoverEndCallback?: MouseCallback;
};

/**
 * A box is a Node with support for Events and Styles!
 */
export class Box extends Node {
  style: BoxStyle = {};

  onMouseClickCallback?: MouseCallback;
  onMouseDownCallback?: MouseCallback;
  onMouseUpCallback?: MouseCallback;
  onMouseMoveCallback?: MouseCallback;
  onMouseHoverStartCallback?: MouseCallback;
  onMouseHoverEndCallback?: MouseCallback;

  isDown: boolean;
  isOver: boolean;
  mouseDownStartTime: number;

  constructor(
    name: string,
    size: Size = new Size(10, 10),
    props: BoxProps = {},
  ) {
    super(name, size);

    this.setStyle({
      padding: 0,
      borderWidth: 2,
      borderColor: "#18501cff",
      backgroundColor: "rgb(195, 236, 123)",
      ...props.style,
    });

    // Variables to hold the callbacks
    this.onMouseClickCallback = props.onMouseClickCallback;
    this.onMouseDownCallback = props.onMouseDownCallback;
    this.onMouseUpCallback = props.onMouseUpCallback;
    this.onMouseMoveCallback = props.onMouseMoveCallback;
    this.onMouseHoverStartCallback = props.onMouseHoverStartCallback;
    this.onMouseHoverEndCallback = props.onMouseHoverEndCallback;

    // Stateful to handle click event
    this.isDown = false;
    this.isOver = false;
    this.mouseDownStartTime = Date.now();
  }

  /**
   * Box nao precisa computar its size from its child.
   * Box just return its user defined size.
   */
  measure() {
    Debugger.purple(`   [Box].<${this.name}> measure start`);
    const parentSize = this.parent?.getSize();
    Debugger.purple(`   [Box].<${this.name}> measure end parentSize=${parentSize?.toString()}`);
    return this.getSize();
  }

  /**
   * Box nao tem childs.
   * Logo Box nao precisa reposicionar seus childs.
   * Apenas se posiciona pra itself.
   */
  arrange(position: Position) {
    Debugger.purple(`   [Box].<${this.name}> arrange`);
    this.setPosition(position);
  }

  setStyle(style: BoxStyle) {
    this.style = style;
  }

  update(): void {}

  render(pen: Pen): void {
    if (!this.visible) {
      return;
    }

    // Rect (pos.x,pos.y, size.w, size.h)
    const boxRect = this.getRect();

    // Fill
    pen.fillRectObj(boxRect, {
      fillColor: this.style.backgroundColor,
    });

    // Stroke
    pen.strokeRectObj(boxRect, {
      strokeColor: this.style.borderColor,
      strokeWidth: this.style.borderWidth,
      strokeDash: [],
    });

    // Label
    pen.text(`${this.name}`, boxRect.x + 5, boxRect.y + 20);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // =-= SAVE CALLBACKS METHODS
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  setOnMouseClickCallback(callback: MouseCallback): void {
    this.onMouseClickCallback = callback;
  }

  setOnMouseDownCallback(callback: MouseCallback): void {
    this.onMouseDownCallback = callback;
  }

  setOnMouseUpCallback(callback: MouseCallback): void {
    this.onMouseUpCallback = callback;
  }

  setOnMouseMoveCallback(callback: MouseCallback): void {
    this.onMouseMoveCallback = callback;
  }

  setOnMouseHoverStartCallback(callback: MouseCallback): void {
    this.onMouseHoverStartCallback = callback;
  }

  setOnMouseHoverEndCallback(callback: MouseCallback): void {
    this.onMouseHoverEndCallback = callback;
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // =-= HANDLERS METHODS
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  handleOnMouseDown(px: number, py: number): boolean {
    if (!this.visible) return false;
    if (!this.hitTest(px, py)) return false;

    this.isDown = true;
    this.mouseDownStartTime = Date.now();

    if (this.onMouseDownCallback) {
      this.onMouseDownCallback(this, new Point(px, py));
    }

    FrameTimeUtil.needUpdateOrRender = true;
    return true;
  }

  handleOnMouseUp(px: number, py: number): boolean {
    if (!this.visible) return false;

    const wasDown = this.isDown;
    const isInside = this.hitTest(px, py);
    this.isDown = false;

    if (wasDown && this.onMouseUpCallback) {
      this.onMouseUpCallback(this, new Point(px, py));
      FrameTimeUtil.needUpdateOrRender = true;
    }

    if (wasDown && isInside && this.onMouseClickCallback) {
      const downDuration = Date.now() - this.mouseDownStartTime;
      if (downDuration < 100) {
        this.onMouseClickCallback(this, new Point(px, py));
        FrameTimeUtil.needUpdateOrRender = true;
      }
    }

    return wasDown || isInside;
  }

  handleOnMouseMove(px: number, py: number): boolean {
    const wasOver = this.isOver;
    const isNowOver = this.hitTest(px, py);

    // Hover End
    if (wasOver && !isNowOver && this.onMouseHoverEndCallback) {
      this.onMouseHoverEndCallback(this, new Point(px, py));
      FrameTimeUtil.needUpdateOrRender = true;
    }

    // Hover Start
    if (!wasOver && isNowOver && this.onMouseHoverStartCallback) {
      this.onMouseHoverStartCallback(this, new Point(px, py));
      FrameTimeUtil.needUpdateOrRender = true;
    }

    this.isOver = isNowOver;

    // Move
    if (isNowOver && this.onMouseMoveCallback) {
      this.onMouseMoveCallback(this, new Point(px, py));
      FrameTimeUtil.needUpdateOrRender = true;
      return true;
    }

    return false;
  }
}
