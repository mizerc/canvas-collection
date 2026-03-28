import { Size } from "../utils/Size";
import { Point } from "../utils/Point";
import { Position } from "../utils/Position";
import { Rect } from "../utils/Rect";
import { Pen } from "../utils/Pen";

export class Node {
  parent: Node | null;
  visible: boolean;
  name: string;
  private position: Position;
  private size: Size;
  state: Record<string, unknown>;
  availableSize: Size | null;

  constructor(name: string, size: Size = new Size(1, 1)) {
    if (!name) {
      throw new Error("Node must have name defined!");
    }

    this.parent = null;
    this.visible = true;
    this.name = name;
    this.position = new Position(0, 0);
    this.size = size;
    this.state = {};
    this.availableSize = null;
  }

  log(text: string): void {
    console.log(`[${this.name}]: ${text}`);
  }

  setName(name: string): void {
    this.name = name;
  }

  setAvailableSize(size: Size) {
    this.availableSize = size;
  }
  getAvailableSize(): Size | null {
    return this.availableSize;
  }

  // Arrange/update final position/size (top-down).
  setPosition(position: Position): void {
    console.log(`   [N].<${this.name}> setPosition ${position.toString()}`);
    this.position = position.clone();
  }

  getPosition(): Position {
    console.log(`   [N].<${this.name}> getPosition: ${this.position.toString()}`);
    return this.position;
  }

  setSize(size: Size): void {
    console.log(`   [N].<${this.name}> setSize: ${size.toString()}`);
    this.size = size.clone();
  }

  getSize(): Size {
    console.log(`   [N].<${this.name}> getSize: ${this.size.toString()}`);
    return this.size.clone();
  }

  getRect(): Rect {
    return new Rect(this.position.x, this.position.y, this.size.w, this.size.h);
  }

  update(): void {
    throw new Error("Node.update must be overridden in subclass");
  }

  render(_pen: Pen): void {
    throw new Error("Node.render must be overridden in subclass");
  }

  /**
   * Util method used by both Container and Node.
   */
  hitTest(px: number, py: number): boolean {
    if (!this.visible) return false;
    const clickPosition = new Point(px, py);
    const rectangle = this.getRect();
    return rectangle.containsPoint(clickPosition);
  }
}
