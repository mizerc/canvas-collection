class VList extends Layout {
  measure() {
    // Measure will compute the size of this layout to fit all children
    // It is a content-driven approach where the layout adjust it size to fit content
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
