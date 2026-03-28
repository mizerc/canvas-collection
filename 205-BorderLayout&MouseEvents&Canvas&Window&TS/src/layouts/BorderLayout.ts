import { Box } from "../core/Box";
import { Container } from "../core/Container";
import { Node } from "../core/Node";
import { Position } from "../utils/Position";
import { Size } from "../utils/Size";
import { Layout } from "../core/Layout";

export type BorderLayoutLocationType =
  | "TOP"
  | "BOTTOM"
  | "LEFT"
  | "RIGHT"
  | "CENTER";

/**
 * BorderLayout holds a SINGLE node in one of 5 locations.
 */
export class BorderLayout extends Layout {
  static CENTER = "CENTER" as const;
  static TOP = "TOP" as const;
  static BOTTOM = "BOTTOM" as const;
  static LEFT = "LEFT" as const;
  static RIGHT = "RIGHT" as const;

  TOP: Box | null;
  BOTTOM: Box | null;
  LEFT: Box | null;
  RIGHT: Box | null;
  CENTER: Box | null;

  constructor() {
    super("BorderLayout");
    this.TOP = null;
    this.BOTTOM = null;
    this.LEFT = null;
    this.RIGHT = null;
    this.CENTER = null;
  }

  /**
   * Add()
   * It adds a Node (Box or Container) to a location.
   */
  add(node: Box, location: BorderLayoutLocationType = "CENTER"): void {
    if (!["TOP", "BOTTOM", "LEFT", "RIGHT", "CENTER"].includes(location)) {
      throw new Error(`BorderLayout.add: invalid location ${location}`);
    }
    this[location] = node;
    this.list.push(node);
  }

  /**
   * Parent tells where to start (x,y)
   */
  arrange({ x, y }: Position): void {
    console.log(`[L.BL] arrange.start pos=${new Position(x, y).toString()}`);
    if (!this.owner) {
      throw new Error("Layout.owner is undefined!");
    }
    const ownerSize = this.owner.getSize();

    let topH = 0;
    let bottomH = 0;
    let leftW = 0;
    let rightW = 0;

    if (this.TOP) {
      const topSize = this.TOP.measure();
      this.TOP.setSize(new Size(ownerSize.w, topSize.h));
      this.TOP.setPosition(new Position(x, y));
      this.TOP.arrange(new Position(x, y)); // Container needs

      topH = topSize.h;
    }

    if (this.BOTTOM) {
      const bottomContentSize = this.BOTTOM.measure();
      // The layuot tells the parent Container its size
      this.BOTTOM.setSize(new Size(ownerSize.w, bottomContentSize.h));
      // And its position
      this.BOTTOM.setPosition(
        new Position(x, y + ownerSize.h - bottomContentSize.h),
      );
      // Propagate arrange to child
      this.BOTTOM.arrange(
        new Position(x, y + ownerSize.h - bottomContentSize.h),
      );

      bottomH = bottomContentSize.h;
    }
    const centerY = y + topH;
    const availableH = ownerSize.h - topH - bottomH;

    if (this.LEFT) {
      const s = this.LEFT.measure();
      this.LEFT.setSize(new Size(s.w, availableH));
      this.LEFT.setPosition(new Position(x, centerY));
      this.LEFT.arrange(new Position(x, centerY));

      leftW = s.w;
    }

    if (this.RIGHT) {
      const s = this.RIGHT.measure();
      this.RIGHT.setSize(new Size(s.w, availableH));
      this.RIGHT.setPosition?.(new Position(x + ownerSize.w - s.w, centerY));
      this.RIGHT.arrange?.(new Position(x + ownerSize.w - s.w, centerY));

      rightW = s.w;
    }

    if (this.CENTER) {
      const s = this.CENTER.measure();
      this.CENTER.setSize(new Size(s.w, s.h));

      const centerX = x + leftW;
      const centerY = y + topH;
      const availableW = ownerSize.w - leftW - rightW;
      const availableH = ownerSize.h - topH - bottomH;
      
      if (this.CENTER instanceof Container) {
        this.CENTER.setAvailableSize(new Size(availableW, availableH));
      }

      const offsetX = centerX + (availableW - s.w) / 2;
      const offsetY = centerY + (availableH - s.h) / 2;
      this.CENTER.setPosition(new Position(offsetX, offsetY));

      this.CENTER.arrange(new Position(offsetX, offsetY));
    }

    console.log(`[L.BL] arrange.end`);
  }

  /**
   * Layout.Measure()
   * It will compute the necessary size to fit all children.
   * It is a content-driven approach where the layout adjusts its size to fit content.
   * Must return a new Size() instance.
   */
  measure(): Size {
    console.log(`[L.BL] measure().start`);

    const topSize = this.TOP ? this.TOP.getSize() : new Size(0, 0);
    const bottomSize = this.BOTTOM ? this.BOTTOM.getSize() : new Size(0, 0);
    const leftSize = this.LEFT ? this.LEFT.getSize() : new Size(0, 0);
    const rightSize = this.RIGHT ? this.RIGHT.getSize() : new Size(0, 0);
    const centerSize = this.CENTER ? this.CENTER.getSize() : new Size(0, 0);

    const totalWidth = Math.max(
      leftSize.w + centerSize.w + rightSize.w,
      topSize.w,
      bottomSize.w,
    );

    const middleHeight = Math.max(leftSize.h, centerSize.h, rightSize.h);
    const totalHeight = topSize.h + middleHeight + bottomSize.h;

    // return new Size(totalWidth, totalHeight);

    // ----- test 2 (return available size instead of content size)

    // Get available size from parent
    if (!this.owner) {
      throw new Error("Layout.owner is undefined!");
    }
    const availableSize = this.owner.getSize();
    console.log(`[L.BL] measure().end ${availableSize.toString()}`);

    return availableSize;
  }
}
