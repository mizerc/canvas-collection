class BorderCenter extends Layout {
  constructor(owner) {
    super(owner);
    this.node = null;
  }
  addNode(node) {
    if (this.node) {
      throw new Error(`BorderCenter can only hold one node`);
    }
    this.node = node;
    super.addNode(node);
  }
  measure() {
    const contentSize = this.node.measure();
    // Cache layout size necessary to hold children
    this._measuredSize = new Size(contentSize.w, contentSize.h);
    return new Size(this._measuredSize.w, this._measuredSize.h);
  }
  arrange(nodeCaller, myStartX, myStartY) {
    // Compute start position of child to be centered
    const availableSize = nodeCaller.getSize();
    const contentSize = this._measuredSize || this.measure();
    const startX = myStartX + (availableSize.w - contentSize.w) / 2;
    const startY = myStartY + (availableSize.h - contentSize.h) / 2;

    // Set child position and size
    this.node.setPosition(new Position(startX, startY));
    this.node.setSize(new Size(contentSize.w, contentSize.h));

    // Recurse into child if child is a container
    this.node.arrange(this.node, startX, startY);
  }
}
