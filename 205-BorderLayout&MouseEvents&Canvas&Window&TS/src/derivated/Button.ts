import { Size } from "../utils/Size";
import { Point } from "../utils/Point";
import { Position } from "../utils/Position";
import { Rect } from "../utils/Rect";
import { Pen } from "../utils/Pen";
import { Container } from "../core/Container";
import { Box, BoxProps } from "../core/Box";

/**
 * A button is a box that defines mouse callbacks.
 */
export class Button extends Box {
  static defaultBgColor: string = "white";
  static defaultBgColorEnabled: string = "lightgreen";

  constructor(
    name: string = "bto",
    size: Size = new Size(50, 50),
    props?: BoxProps,
  ) {
    super(name, size, {
      style: {
        backgroundColor: Button.defaultBgColor,
        borderColor: "black",
        borderWidth: 2,
      },
      onMouseClickCallback: (box: Box, mouse: Point): void => {
        props?.onMouseClickCallback?.(box, mouse);
      },
      onMouseDownCallback: (box: Box): void => {
        box.style.borderWidth = 4;
      },
      onMouseUpCallback: (box: Box): void => {
        box.style.borderWidth = 2;
      },
      onMouseHoverStartCallback: (box: Box): void => {
        box.style.borderColor = "red";
      },
      onMouseHoverEndCallback: (box: Box): void => {
        box.style.borderColor = "black";
      },
    });
  }
}
