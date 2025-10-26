// Stack layout
class HList extends Layout {
  measure() {
    // Go over all children to accumulate their sizes
    let accumulatedW = 0;
    let maxH = 0;
    for (const child of this.getAllNodes()) {
      const childSize = child.measure();
      child._measuredSize = childSize;
      accumulatedW += childSize.w + padding;
      maxH = Math.max(maxH, childSize.h + padding);
    }
    return new Size(accumulatedW + padding, maxH + padding);
  }
  arrange(container, startX, startY) {
    // Go over all children to position them
    let offsetX = startX + padding;
    for (const child of this.getAllNodes()) {
      child.setPosition(new Position(offsetX, startY + padding));
      const childSize = child._measuredSize || child.measure(); // use cached measure
      // child.setSize(childSize);
      // Recurse into containers
      if (child instanceof Container) {
        child.arrange(container, offsetX + padding, startY);
      }
      offsetX += childSize.w + padding;
    }
  }
}
