import { Box, BoxProps } from "../core/Box";
import { Container } from "../core/Container";
import { BorderLayout } from "../layouts/BorderLayout";
import { HList } from "../layouts/HList";
import { VList } from "../layouts/VList";
import { Pen } from "../utils/Pen";
import { Point } from "../utils/Point";
import { Position } from "../utils/Position";
import { Rect } from "../utils/Rect";
import { Size } from "../utils/Size";
import { Button } from "./Button";

export class WindowFrame extends Box {
  isDragging: boolean;
  dragOffset: Point;
  rootContainer: Container;
  windowBarH: number;
  windowBarContainer: Container;

  constructor(
    name: string = "WindowFrame",
    size: Size = new Size(200, 200),
    rootContainer: Container = new Container("cWindowFrame", new VList("VL")),
    props?: BoxProps,
  ) {
    super(name, size, {});

    this.isDragging = false;
    this.dragOffset = new Point(0, 0);

    this.rootContainer = rootContainer;
    this.rootContainer.add(new Button("top"), BorderLayout.TOP);
    this.rootContainer.add(new Button("bottom"), BorderLayout.BOTTOM);

    // Whole Window Rect
    const position = this.getPosition();
    const X = position.x;
    const Y = position.y;
    const W = size.w;

    // WindowBar Rect
    this.windowBarH = 30;
    // this.windowBarRect = new Rect(X, Y, W, this.windowBarH);
    this.windowBarContainer = new Container("WindowBar", new HList("HL"));
    // this.windowBarContainer.add(
    //   new Button("X", new Size(this.windowBarH, this.windowBarH), {}),
    // );
    // this.windowBarContainer.add(
    //   new Button("===", new Size(this.windowBarH, this.windowBarH), {}),
    // );

    // Events handling
    this.setOnMouseDownCallback((box: Box, mousePoint: Point): void => {
      // WindowFrame Dragging Logic
      // One drag if mouse position is over BarRect
      const position = this.getPosition();
      if (this.windowBarContainer.getRect().containsPoint(mousePoint)) {
        this.isDragging = true;
        this.dragOffset = new Position(
          mousePoint.x - position.x,
          mousePoint.y - position.y,
        );
      }

      // Propagate to WindowFrame.Container
      this.rootContainer.handleOnMouseDown(mousePoint.x, mousePoint.y);
      this.windowBarContainer.handleOnMouseDown(mousePoint.x, mousePoint.y);
    });

    this.setOnMouseUpCallback((_: Box, mousePoint: Point): void => {
      // WindowFrame Dragging Logic
      this.isDragging = false;

      // Propagate to WindowFrame.Container
      this.rootContainer.handleOnMouseUp(mousePoint.x, mousePoint.y);
      this.windowBarContainer.handleOnMouseUp(mousePoint.x, mousePoint.y);
    });

    this.setOnMouseMoveCallback((_: Box, mousePoint: Point): void => {
      // WindowFrame Dragging Logic
      if (this.isDragging) {
        const newPos = new Position(
          mousePoint.x - this.dragOffset.x,
          mousePoint.y - this.dragOffset.y,
        );
        this.setPosition(newPos);
      }

      // Propagate to WindowFrame.Container
      this.rootContainer.handleOnMouseMove(mousePoint.x, mousePoint.y);
      this.windowBarContainer.handleOnMouseMove(mousePoint.x, mousePoint.y);
    });
  }

  getWindowRect(): Rect {
    return this.getRect();
  }

  getBarRect(): Rect {
    return this.windowBarContainer.getRect();
  }

  getContentRect(): Rect | void {}

  arrange(): void {}

  update(): void {
    // Frame and its RootContainer occupy entire canvas
    const position = this.getPosition();
    console.log(`WindowFrame.update pos=${position.toString()}`);
    const size = this.getSize();
    const X = position.x;
    const Y = position.y;
    const W = size.w;
    const H = size.h;

    // Container must have the entire size of window frame
    this.rootContainer.setSize(new Size(W, H - this.windowBarH));
    // Let container computs its size
    this.rootContainer.measure();
    // RootContainer starts at WindowFrame position
    this.rootContainer.arrange(new Position(X, Y + this.windowBarH));

    // TopBarContainer
    this.windowBarContainer.setSize(new Size(W, this.windowBarH));
    this.windowBarContainer.measure();
    this.windowBarContainer.arrange(new Position(X, Y));
  }

  render(pen: Pen): void {
    if (!this.visible) {
      return;
    }

    // Window
    const position = this.getPosition();
    pen.fillRectObj(this.getWindowRect(), {
      fillColor: this.isDragging ? "yellow" : "white",
    });
    // pen.strokeRectObj(this.getWindowRect(), {});
    // pen.text(`${this.name}`, position.x + 5, position.y + 20);

    // WindowBar
    // pen.fillRectObj(this.getBarRect(), {
    //   fillColor: "#2872cd",
    // });
    pen.text(
      `${this.name} ${this.isDragging ? "d" : "nd"}`,
      this.getBarRect().x + 5,
      this.getBarRect().y + 15,
    );

    // Content
    this.rootContainer.render(pen);
    this.windowBarContainer.render(pen);
  }
}
