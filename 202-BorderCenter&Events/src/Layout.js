class Layout {
  #list;
  #nodeOwner;
  constructor(nodeOwner) {
    if (!nodeOwner) {
      throw new Error("Layout must have an owner Node");
    }
    this.#nodeOwner = nodeOwner;
    this.#list = [];
  }
  getOwnerName() {
    return this.#nodeOwner;
  }
  addNode(node) {
    this.#list.push(node);
  }
  getAllNodes() {
    return this.#list;
  }
  measure() {
    throw new Error("Layout.measure must be overridden in subclass");
  }
  arrange() {
    throw new Error("Layout.arrange must be overridden in subclass");
  }
}
