import { Size } from "../utils/Size";
import { Point } from "../utils/Point";
import { Position } from "../utils/Position";
import { Rect } from "../utils/Rect";
import { Pen } from "../utils/Pen";
import { Container } from "../core/Container";
import { Node } from "../core/Node";
import { Layout } from "../layouts/Layout";
import { VList } from "../layouts/VList";
import { BorderLayout } from "../layouts/BorderLayout";
import { HList } from "../layouts/HList";

/**
 * A Navigator is a Container that can have one layout per page.
 */
export class NavigatorContainer extends Node {
  pages: Record<string, Layout>;
  currentPage: string;
  _measuredSize!: Size;

  constructor(
    nodeName: string,
    pages: Record<string, Layout> = { default: new VList() },
  ) {
    super(nodeName, undefined);
    super.setName(nodeName);
    this.pages = pages;
    this.currentPage = "default";
  }

  setPage(pageName: string, layout: Layout): void {
    this.pages[pageName] = layout;
  }

  navigate(pageName: string): void {
    this.currentPage = pageName;
  }

  /**
   * Container.add()
   * This adds a child to its layout.
   * The Container.layout instance is responsible for storing nodes.
   * - location is only used by BorderLayout
   */
  add(newNode: Node, location?: unknown): void {
    newNode.parent = this;
    const currentLayout = this.pages[this.currentPage];
    currentLayout.add(newNode, location);
  }

  /**
   * Container.arrange()
   * The caller (another Container.layout) always defines the container position.
   * Then we propagate the arrange() to my children.
   */
  arrange(parent: Node, new_x: number = 0, new_y: number = 0): void {
    const currentLayout = this.pages[this.currentPage];
    this.setPosition(new Position(new_x, new_y));
    currentLayout.arrange(this, new_x, new_y);
  }

  /**
   * Container.measure()
   * A container asks its layout to measure the needed size to fit all children.
   * Then stores/caches the Size() in _measuredSize.
   */
  measure(): Size {
    const currentLayout = this.pages[this.currentPage];
    const contentSize = currentLayout.measure(this);
    this._measuredSize = contentSize.clone();
    return this._measuredSize;
  }

  update(): void {
    const currentLayout = this.pages[this.currentPage];
    for (const node of currentLayout.list) {
      node.update();
    }
  }

  render(pen: Pen): void {
    if (!this.visible) {
      return;
    }

    const currentLayout = this.pages[this.currentPage];

    // Define which fillColor to use
    let bgColor = "rgb(209, 209, 209)";
    if (currentLayout instanceof HList) {
      bgColor = "rgb(223, 228, 255)";
    } else if (currentLayout instanceof VList) {
      bgColor = "rgb(255, 231, 255)";
    } else if (currentLayout instanceof BorderLayout) {
      bgColor = "rgb(225, 253, 255)";
    }

    // Fill
    pen.fillRectObj(this.getRect(), {
      fillColor: bgColor,
    });

    // Stroke
    pen.strokeRectObj(this.getRect(), {
      strokeWidth: 1,
      strokeColor: "black",
      strokeDash: [8, 4],
    });

    for (const node of currentLayout.list) {
      node.render(pen);
    }
  }

  // === EVENTS METHODS ===

  /**
   * Navigator.handleOnMouseDown()
   * On a container, handleOnMouseDown just propagates event to its child
   * until a child returns true.
   */
  handleOnMouseDown(px: number, py: number): boolean {
    if (!this.visible) return false;

    const currentLayout = this.pages[this.currentPage];
    const list = currentLayout.list;

    for (let i = list.length - 1; i >= 0; i--) {
      const child = list[i];
      if (child.handleOnMouseDown(px, py)) {
        return true;
      }
    }

    return false;
  }

  handleOnMouseUp(px: number, py: number): boolean {
    if (!this.visible) return false;

    const currentLayout = this.pages[this.currentPage];
    const list = currentLayout.list;

    for (let i = list.length - 1; i >= 0; i--) {
      const child = list[i];
      if (child.handleOnMouseUp(px, py)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Navigator.handleOnMouseMove()
   * On a container, handleOnMouseMove just propagates event to its child.
   */
  handleOnMouseMove(px: number, py: number): boolean {
    if (!this.visible) return false;

    const currentLayout = this.pages[this.currentPage];
    for (let i = currentLayout.list.length - 1; i >= 0; i--) {
      const child = currentLayout.list[i];
      if (child.handleOnMouseMove(px, py)) {
        return true;
      }
    }

    return false;
  }
}
