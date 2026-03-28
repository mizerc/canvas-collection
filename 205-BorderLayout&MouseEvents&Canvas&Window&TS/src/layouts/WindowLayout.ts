import { Container } from "../core/Container";
import { Position } from "../utils/Position";
import { Rect } from "../utils/Rect";
import { Size } from "../utils/Size";
import { Layout } from "../core/Layout";

/**
 * WindowLayout
 * It is a container that allows inner windows to be created.
 * User must define the size of the desktop area (like a box),
 * but it also holds WindowFrame instances inside like a container.
 * A Window must also define its own size.
 */
export class WindowLayout extends Layout {
  measure(): Size {
    // FIXME
    if (!this.owner) {
      throw new Error("WindowLayout.arrange must have a owner");
    }
    // Eu retorno o size disponivel do meu pai
    // O size dispoivel é setado pelo arrange do BorderLayout.CENTER
    if (this.owner instanceof Container) {
      const parentSize = this.owner.getAvailableSize();
      if (parentSize) {
        return new Size(parentSize.w, parentSize.h);
      }
    }
    return new Size(400, 400);
  }

  arrange(position: Position): void {
    for (const child of this.list) {
      // We always let our child (WindowFrame) arrange itself
      // child.setPosition(new Position(0, 0));
      // child.update();
    }

    if (!this.owner) {
      throw new Error("WindowLayout.arrange must have a owner");
    }

    // But if some child tries to go over boundaries, we fight back
    for (const child of this.list) {
      // Get the region of current layout
      const childPos = child.getPosition();
      const childSize = child.getSize();
      const parentPos = this.owner.getPosition();
      const parentSize = this.owner.getSize();
      const border = new Rect(
        parentPos.x,
        parentPos.y,
        parentSize.w,
        parentSize.h,
      );
      // Left
      if (childPos.x < border.x) {
        childPos.x = border.x;
      }
      // Top
      if (childPos.y < border.y) {
        childPos.y = border.y;
      }
      // Right
      if (childPos.x + childSize.w > border.x + border.w) {
        childPos.x = border.x + border.w - childSize.w;
      }
      // Bottom
      if (childPos.y + childSize.h > border.y + border.h) {
        childPos.y = border.y + border.h - childSize.h;
      }
    }
  }
}
