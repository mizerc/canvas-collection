class Frame {
  constructor(canvas, layout = new VList("FRAME")) {
    if (!canvas) {
      throw new Error("Window must define canvas");
    }
    if (!layout) {
      throw new Error("Window must define layout");
    }
    this.canvas = canvas;
    this.pen = new Pen(canvas);
    this.rootNode = new Container("root", layout);
  }
  handleClick(x, y) {
    this.rootNode.handleClick(x, y);
  }
  handleMove(x, y) {
    this.rootNode.handleMove(x, y);
  }
  addNode(node, location) {
    this.rootNode.addNode(node, location);
  }
  update() {
    // Root node takes full canvas size
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.rootNode.setPosition(new Position(0, 0));
    this.rootNode.setSize(new Size(W, H));
    // Layout process
    this.rootNode.measure();
    this.rootNode.arrange(this, 0, 0);
  }
  render() {
    this.rootNode.render(this.pen);
  }
}
