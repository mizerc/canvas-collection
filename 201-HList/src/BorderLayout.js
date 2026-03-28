// Region based layouts
class BorderLayout extends Layout {
  constructor(owner) {
    super(owner);
    this.TOP = null;
    this.BOTTOM = null;
    this.LEFT = null;
    this.RIGHT = null;
    this.CENTER = null;
  }
  add(node, location = "CENTER") {
    if (!["TOP", "BOTTOM", "LEFT", "RIGHT", "CENTER"].includes(location)) {
      throw new Error(`BorderLayout.add: invalid location ${location}`);
    }
    this[location] = node;
    this.list.push(node);
  }
  measure() {
    const topSize = this.TOP ? this.TOP.measure() : new Size(0, 0);
    const bottomSize = this.BOTTOM ? this.BOTTOM.measure() : new Size(0, 0);
    const leftSize = this.LEFT ? this.LEFT.measure() : new Size(0, 0);
    const rightSize = this.RIGHT ? this.RIGHT.measure() : new Size(0, 0);
    const centerSize = this.CENTER ? this.CENTER.measure() : new Size(0, 0);
    const totalWidth = Math.max(
      leftSize.w + centerSize.w + rightSize.w,
      topSize.w,
      bottomSize.w
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
