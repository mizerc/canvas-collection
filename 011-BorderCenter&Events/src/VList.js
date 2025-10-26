// Stack layout
class VList extends Layout {
  measure() {
    // Go over all children to accumulate their sizes
    let accumulatedH = 0;
    let maxW = 0;
    for (const child of this.getAllNodes()) {
      const childSize = child.measure();
      child._measuredSize = childSize;
      accumulatedH += childSize.h + padding;
      maxW = Math.max(maxW, childSize.w + padding);
    }
    this._measuredSize = new Size(maxW + padding, accumulatedH + padding);
    return this._measuredSize;
  }
  arrange(container, startX, startY) {
    // Go over all children to position them
    let offsetY = startY + padding;
    for (const child of this.getAllNodes()) {
      child.setPosition(new Position(startX + padding, offsetY));
      const childSize = child._measuredSize || child.measure(); // use cached measure
      // child.setSize(childSize);
      // Recurse into containers
      if (child instanceof Container) {
        child.arrange(container, startX, offsetY + padding);
      }
      offsetY += childSize.h + padding;
    }
  }
}
