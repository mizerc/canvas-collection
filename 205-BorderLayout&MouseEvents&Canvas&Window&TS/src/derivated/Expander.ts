import { Size } from "../utils/Size";
import { Point } from "../utils/Point";
import { Position } from "../utils/Position";
import { Rect } from "../utils/Rect";
import { Pen } from "../utils/Pen";
import { Container } from "../core/Container";
import { Box, BoxProps } from "../core/Box";

export class Expander extends Box {
  constructor(
    name: string = "Exp",
    size: Size = new Size(50, 50),
    props?: BoxProps,
  ) {
    super(name, size, {
      style: {
        backgroundColor: "rgb(54, 211, 43)",
      },
    });
  }
}
