import { HList } from "../layouts/HList";
import { VList } from "../layouts/VList";
import {
  BorderLayout,
  BorderLayoutLocationType,
} from "../layouts/BorderLayout";
import { WindowLayout } from "../layouts/WindowLayout";
import { Layout } from "./Layout";
import { Size } from "../utils/Size";
import { Node } from "./Node";
import { Position } from "../utils/Position";
import { Pen } from "../utils/Pen";
import { Box } from "./Box";
import { Debugger } from "../utils/Debugger";

/**
 * A Container extends Node and adds Measure/Arrange/Layout to handle size/position of its child.
 */
export class Container extends Box {
  layout: Layout;

  constructor(nodeName: string, layout: Layout) {
    super(nodeName);
    super.setName(nodeName);

    // A container must have a layout instance
    this.layout = layout;
    this.layout.owner = this;

    // Each container have its own canvas to allow canvas cutting thru canvas.drawImage
    // this.containerPen = new Pen(document.createElement("canvas"));
  }

  /**
   * Container.add()
   * This adds a child to its layout.
   * The Container.layout instance is responsible for storing nodes.
   * - location is only used by BorderLayout
   */
  add(newNode: Box, location: BorderLayoutLocationType = "CENTER"): void {
    console.log(` [C].<${this.name}> add <${newNode.name}>`);
    newNode.parent = this;
    this.layout.add(newNode, location);
  }

  arrange(position: Position) {
    Debugger.yellow(` [C].<${this.name}> arrange start`);
    // Parent tells me where I start
    this.setPosition(position);
    // Propagate start position to layout
    this.layout.arrange(position);
    Debugger.orange(` [C].<${this.name}> arrange end`);
  }

  measure(): Size {
    Debugger.yellow(` [C].<${this.name}> measure start`);
    const contentSize = this.layout.measure();
    this.setSize(contentSize);
    Debugger.orange(` [C].<${this.name}> measure end ${contentSize}`);
    return contentSize;
  }

  update(): void {
    console.log(` [C].<${this.name}> update`);
    for (const node of this.layout.list) {
      node.update();
    }
  }

  render(pen: Pen): void {
    if (!this.visible) {
      return;
    }

    // if(this.name === "c1") debugger

    Debugger.yellow(` [C].<${this.name}> render start`);

    const containerRect = this.getRect();

    // Fill
    // Define which fillColor to use based on Layout instance
    let bgColor = "rgb(236, 210, 210)";

    if (this.layout instanceof HList) {
      bgColor = "rgb(119, 137, 225)";
    } else if (this.layout instanceof VList) {
      bgColor = "rgb(190, 160, 190)";
    } else if (this.layout instanceof BorderLayout) {
      bgColor = "rgb(146, 182, 186)";
    } else if (this.layout instanceof WindowLayout) {
      bgColor = "hsl(127, 100%, 88%)";
    }

    pen.fillRectObj(containerRect, {
      fillColor: bgColor,
    });

    // Stroke
    pen.strokeRectObj(containerRect, {
      strokeWidth: 1,
      strokeColor: "black",
      strokeDash: [8, 4],
    });

    // Render each node of this container
    for (const node of this.layout.list) {
      node.render(pen);
    }

    Debugger.yellow(` [C].<${this.name}> render end`);

    // pen.image(this.containerPen.getImage(), 0, 0, 0, 0, 0, 0);
  }

  // === EVENTS METHODS ===

  /**
   * Container.handleOnMouseDown()
   * On a container, handleOnMouseDown just propagates event to its child
   * until a child returns true.
   */
  handleOnMouseDown(px: number, py: number): boolean {
    if (!this.visible) return false;

    // Iterate from topmost to bottommost if draw order matters
    const list = this.layout.list;
    for (let i = list.length - 1; i >= 0; i--) {
      const child = list[i];
      if (child.handleOnMouseDown(px, py)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Container.handleOnMouseUp()
   * A container just propagates.
   */
  handleOnMouseUp(px: number, py: number): boolean {
    if (!this.visible) return false;
    const list = this.layout.list;
    for (let i = list.length - 1; i >= 0; i--) {
      const child = list[i];
      if (child.handleOnMouseUp(px, py)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Container.handleOnMouseMove()
   * A container just propagates.
   */
  handleOnMouseMove(px: number, py: number): boolean {
    if (!this.visible) return false;
    for (let i = this.layout.list.length - 1; i >= 0; i--) {
      const child = this.layout.list[i];
      if (child.handleOnMouseMove(px, py)) {
        return true;
      }
    }
    return false;
  }
}
