export class Size {
  w: number;
  h: number;
  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
  }
  clone(): Size {
    return new Size(this.w, this.h);
  }
  toString(): string {
    return `<${this.w.toFixed(0)},${this.h.toFixed(0)}>`;
  }
}
