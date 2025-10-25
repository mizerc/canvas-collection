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
