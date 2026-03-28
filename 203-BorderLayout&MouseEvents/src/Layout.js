/**
 * Layout is a abstract class that define a contract.
 */
class Layout {
  constructor(owner) {
    this.owner = owner;
    this.list = [];
  }
  add(node) {
    this.list.push(node);
  }
  measure() {
    throw new Error("Layout.measure must be overridden in subclass");
  }
  arrange() {
    throw new Error("Layout.arrange must be overridden in subclass");
  }
}
/**
 * BorderLayout holds a SINGLE node is one of 5 location.
 */
class BorderLayout extends Layout {
  constructor(owner) {
    super(owner);
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
  add(node, location = "CENTER") {
    if (!["TOP", "BOTTOM", "LEFT", "RIGHT", "CENTER"].includes(location)) {
      throw new Error(`BorderLayout.add: invalid location ${location}`);
    }
    this[location] = node;
    this.list.push(node);
  }
  /**
   * Measure()
   * It will compute the necessary size to fit all children.
   * It is a content-driven approach where the layout adjust it size to fit content.
   * Must return a new Size() instance.
   */
  measure() {
    const topSize = this.TOP ? this.TOP.measure() : new Size(0, 0);
    const bottomSize = this.BOTTOM ? this.BOTTOM.measure() : new Size(0, 0);
    const leftSize = this.LEFT ? this.LEFT.measure() : new Size(0, 0);
    const rightSize = this.RIGHT ? this.RIGHT.measure() : new Size(0, 0);
    const centerSize = this.CENTER ? this.CENTER.measure() : new Size(0, 0);
    const totalWidth = Math.max(
      leftSize.w + centerSize.w + rightSize.w,
      topSize.w,
      bottomSize.w,
    );
    const middleHeight = Math.max(centerSize.h, leftSize.h, rightSize.h);
    const totalHeight = topSize.h + middleHeight + bottomSize.h;
    return new Size(totalWidth, totalHeight);
  }
  arrange(container, x, y) {
    const { w, h } = container.getSize();
    let topH = 0,
      bottomH = 0,
      leftW = 0,
      rightW = 0;
    if (this.TOP) {
      const s = this.TOP._measuredSize || this.TOP.measure();
      this.TOP.setPosition(new Position(x, y));
      this.TOP.setSize(new Size(w, s.h));
      this.TOP.arrange?.(this.TOP, x, y);
      topH = s.h;
    }
    if (this.BOTTOM) {
      const s = this.BOTTOM._measuredSize || this.BOTTOM.measure();
      this.BOTTOM.setPosition(new Position(x, y + h - s.h));
      this.BOTTOM.setSize(new Size(w, s.h));
      this.BOTTOM.arrange?.(this.BOTTOM, x, y + h - s.h);
      bottomH = s.h;
    }
    const centerY = y + topH;
    const availableH = h - topH - bottomH;
    if (this.LEFT) {
      const s = this.LEFT._measuredSize || this.LEFT.measure();
      this.LEFT.setPosition(new Position(x, centerY));
      this.LEFT.setSize(new Size(s.w, availableH));
      this.LEFT.arrange?.(this.LEFT, x, centerY);
      leftW = s.w;
    }
    if (this.RIGHT) {
      const s = this.RIGHT._measuredSize || this.RIGHT.measure();
      this.RIGHT.setPosition(new Position(x + w - s.w, centerY));
      this.RIGHT.setSize(new Size(s.w, availableH));
      this.RIGHT.arrange?.(this.RIGHT, x + w - s.w, centerY);
      rightW = s.w;
    }
    // if (this.CENTER) {
    //   const centerX = x + leftW;
    //   const centerW = w - leftW - rightW;
    //   this.CENTER.setPosition(new Position(centerX, centerY));
    //   this.CENTER.setSize(new Size(centerW, availableH));
    //   this.CENTER.arrange?.(this.CENTER, centerX, centerY);
    // }
    if (this.CENTER) {
      const s = this.CENTER._measuredSize || this.CENTER.measure();

      // Space left in the middle region
      const centerX = x + leftW;
      const centerY = y + topH;
      const availableW = w - leftW - rightW;
      const availableH = h - topH - bottomH;

      // If the child is smaller than available, center it
      const offsetX = centerX + (availableW - s.w) / 2;
      const offsetY = centerY + (availableH - s.h) / 2;

      // Don't stretch the CENTER; just place it centered
      this.CENTER.setPosition(new Position(offsetX, offsetY));
      this.CENTER.setSize(new Size(s.w, s.h));
      this.CENTER.arrange?.(this.CENTER, offsetX, offsetY);
    }
  }
}
BorderLayout.CENTER = "CENTER";
BorderLayout.TOP = "TOP";
BorderLayout.BOTTOM = "BOTTOM";
BorderLayout.LEFT = "LEFT";
BorderLayout.RIGHT = "RIGHT";
/**
 * VList is a Stack Layout.
 * A stack keeps adding a node over a single direction.
 */
class VList extends Layout {
  /**
   * Measure()
   * It will compute the necessary size to fit all children.
   * It is a content-driven approach where the layout adjust it size to fit content.
   * Must return a new Size() instance.
   */
  measure() {
    let accumulatedH = 0;
    let maxW = 0;
    for (const child of this.list) {
      const childSize = child.measure();
      child._measuredSize = childSize;
      accumulatedH += childSize.h;
      maxW = Math.max(maxW, childSize.w);
    }
    // Return layout size that fits internal content
    return new Size(maxW, accumulatedH);
  }
  /**
   * Arranje()
   * It will update the position and size of each children.
   * Size is defined by the Box node only.
   * Layout never change the size of its children.
   * It is a content-driven approach where the layout adjust it size to fit content.
   */
  arrange(container, x, y) {
    let offsetY = y;
    for (const child of this.list) {
      // Update position
      child.setPosition(new Position(x, offsetY));
      // Commit size
      const childSize = child._measuredSize || child.getSize(); // use cached measure
      child.setSize(childSize);
      // Recurse into containers
      if (child instanceof Container) {
        child.arrange(container, x, offsetY);
      }
      offsetY += childSize.h;
    }
  }
}
/**
 * HList is a Stack Layout.
 * A stack keeps adding a node over a single direction.
 */
class HList extends Layout {
  measure() {
    let accumulatedW = 0;
    let maxH = 0;
    for (const child of this.list) {
      const childSize = child.measure();
      child._measuredSize = childSize;
      accumulatedW += childSize.w;
      maxH = Math.max(maxH, childSize.h);
    }
    return new Size(accumulatedW, maxH);
  }
  arrange(container, x, y) {
    let offsetX = x;
    for (const child of this.list) {
      child.setPosition(new Position(offsetX, y));
      const childSize = child._measuredSize || child.getSize(); // use cached measure
      child.setSize(childSize);
      if (child instanceof Container) {
        child.arrange(container, offsetX, y);
      }
      offsetX += childSize.w;
    }
  }
}
