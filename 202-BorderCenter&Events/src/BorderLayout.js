// Region based layouts
class BorderLayout extends Layout {
  constructor(owner) {
    super(owner);
    // Hold the node of each region
    this.regions = {
      TOP: null,
      BOTTOM: null,
      LEFT: null,
      RIGHT: null,
      CENTER: null,
    };
  }
  addNode(node, location = "CENTER") {
    if (!["TOP", "BOTTOM", "LEFT", "RIGHT", "CENTER"].includes(location)) {
      throw new Error(`BorderLayout.add: invalid location ${location}`);
    }
    this.regions[location] = node;
    super.addNode(node);
  }
  getNodeFromRegion(region) {
    if (!["TOP", "BOTTOM", "LEFT", "RIGHT", "CENTER"].includes(region)) {
      throw new Error(
        `BorderLayout.getNodeFromRegion: invalid region ${region}`
      );
    }
    return this.regions[region];
  }
  measure() {
    const topSize = this.getNodeFromRegion("TOP")
      ? this.getNodeFromRegion("TOP").measure()
      : new Size(0, 0);

    const bottomSize = this.getNodeFromRegion("BOTTOM")
      ? this.getNodeFromRegion("BOTTOM").measure()
      : new Size(0, 0);

    const leftSize = this.getNodeFromRegion("LEFT")
      ? this.getNodeFromRegion("LEFT").measure()
      : new Size(0, 0);

    const rightSize = this.getNodeFromRegion("RIGHT")
      ? this.getNodeFromRegion("RIGHT").measure()
      : new Size(0, 0);

    const centerSize = this.getNodeFromRegion("CENTER")
      ? this.getNodeFromRegion("CENTER").measure()
      : new Size(0, 0);

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
    const { w, h } = container.measure();

    let topH = 0,
      bottomH = 0,
      leftW = 0,
      rightW = 0;

    const topNode = this.getNodeFromRegion("TOP");
    if (topNode) {
      const s = topNode._measuredSize || topNode.measure();
      topNode.setPosition(new Position(x, y));
      topNode.setSize(new Size(w, s.h));
      topNode.arrange?.(topNode, x, y);
      topH = s.h;
    }

    const bottomNode = this.getNodeFromRegion("BOTTOM");
    if (bottomNode) {
      const s = bottomNode._measuredSize || bottomNode.measure();
      bottomNode.setPosition(new Position(x, y + h - s.h));
      bottomNode.setSize(new Size(w, s.h));
      bottomNode.arrange?.(bottomNode, x, y + h - s.h);
      bottomH = s.h;
    }

    const centerY = y + topH;
    const availableH = h - topH - bottomH;
    const leftNode = this.getNodeFromRegion("LEFT");
    if (leftNode) {
      const s = leftNode._measuredSize || leftNode.measure();
      leftNode.setPosition(new Position(x, centerY));
      leftNode.setSize(new Size(s.w, availableH));
      leftNode.arrange?.(leftNode, x, centerY);
      leftW = s.w;
    }
    const rightNode = this.getNodeFromRegion("RIGHT");
    if (rightNode) {
      const s = rightNode._measuredSize || rightNode.measure();
      rightNode.setPosition(new Position(x + w - s.w, centerY));
      rightNode.setSize(new Size(s.w, availableH));
      rightNode.arrange?.(rightNode, x + w - s.w, centerY);
      rightW = s.w;
    }

    // if (this.CENTER) {
    //   const centerX = x + leftW;
    //   const centerW = w - leftW - rightW;
    //   this.CENTER.setPosition(new Position(centerX, centerY));
    //   this.CENTER.setSize(new Size(centerW, availableH));
    //   this.CENTER.arrange?.(this.CENTER, centerX, centerY);
    // }
    const centerNode = this.getNodeFromRegion("CENTER");
    if (centerNode) {
      const s = centerNode._measuredSize || centerNode.measure();

      // Space left in the middle region
      const centerX = x + leftW;
      const centerY = y + topH;
      const availableW = w - leftW - rightW;
      const availableH = h - topH - bottomH;

      // If the child is smaller than available, center it
      const offsetX = centerX + (availableW - s.w) / 2;
      const offsetY = centerY + (availableH - s.h) / 2;

      // Don't stretch the CENTER; just place it centered
      centerNode.setPosition(new Position(offsetX, offsetY));
      centerNode.setSize(new Size(s.w, s.h));
      centerNode.arrange?.(centerNode, offsetX, offsetY);
    }
  }
}
BorderLayout.CENTER = "CENTER";
BorderLayout.TOP = "TOP";
BorderLayout.BOTTOM = "BOTTOM";
BorderLayout.LEFT = "LEFT";
BorderLayout.RIGHT = "RIGHT";
