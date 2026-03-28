type PenProps = {
  strokeColor?: string;
  strokeDash?: number[];
  strokeWidth?: number;
  fillColor?: string;
  font?: string;
};

type RectLike = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export class Pen {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  // Pixel methods
  imageData: ImageData;
  pixelData: Uint8ClampedArray;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("PEN ERROR: 2D context is not supported");
    }
    this.ctx = ctx;

    this.imageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height,
    );
    this.pixelData = this.imageData.data;
  }

  applyProps(props?: PenProps): void {
    const safeProps: PenProps = props ?? {};

    if (typeof safeProps !== "object" || Array.isArray(safeProps)) {
      throw new Error("PEN ERROR: props must be a object");
    }

    const strokeColor = safeProps.strokeColor ?? "red";
    const strokeDash = safeProps.strokeDash ?? [];
    const strokeWidth = safeProps.strokeWidth ?? 2;
    const fillColor = safeProps.fillColor ?? "black";
    const font = safeProps.font ?? "16px Arial";

    this.ctx.setLineDash(strokeDash);
    this.ctx.lineWidth = strokeWidth;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.fillStyle = fillColor;
    this.ctx.font = font;
  }

  setSize(w: number, h: number): void {
    this.canvas.width = w;
    this.canvas.height = h;

    // Recreate pixel buffer because canvas resize resets the backing store
    this.imageData = this.ctx.createImageData(w, h);
    this.pixelData = this.imageData.data;
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // =-= PIXEL METHODS
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  putPixel(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    a = 255,
  ): void {
    const data = this.pixelData;

    if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) {
      return;
    }

    const index = (y * this.canvas.width + x) * 4;
    data[index + 0] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = a;
  }

  putImageData(): void {
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // =-= IMAGE METHODS
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  /**
   * Draw src (canvas image) on current canvas
   */
  image(
    src: CanvasImageSource,
    sx?: number,
    sy?: number,
    sw?: number,
    sh?: number,
    dx?: number,
    dy?: number,
    dw?: number,
    dh?: number,
  ): void {
    const ctx = this.ctx;

    // Supports:
    // drawImage(src, dx, dy)
    // drawImage(src, dx, dy, dw, dh)
    // drawImage(src, sx, sy, sw, sh, dx, dy, dw, dh)

    if (
      sx !== undefined &&
      sy !== undefined &&
      sw !== undefined &&
      sh !== undefined &&
      dx !== undefined &&
      dy !== undefined &&
      dw !== undefined &&
      dh !== undefined
    ) {
      ctx.drawImage(src, sx, sy, sw, sh, dx, dy, dw, dh);
      return;
    }

    if (
      dx !== undefined &&
      dy !== undefined &&
      dw !== undefined &&
      dh !== undefined
    ) {
      ctx.drawImage(src, dx, dy, dw, dh);
      return;
    }

    if (dx !== undefined && dy !== undefined) {
      ctx.drawImage(src, dx, dy);
      return;
    }

    throw new Error("PEN ERROR: invalid image arguments");
  }

  /**
   * Return the canvas image of this canvas
   */
  getImage(): HTMLCanvasElement {
    return this.ctx.canvas;
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // =-= CORE METHODS
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  clear(color = "black"): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  strokeRect(
    x: number,
    y: number,
    w: number,
    h: number,
    props?: PenProps,
  ): void {
    this.ctx.save();
    this.applyProps(props);
    this.ctx.strokeRect(x, y, w, h);
    this.ctx.restore();
  }

  fillRect(x: number, y: number, w: number, h: number, props?: PenProps): void {
    this.ctx.save();
    this.applyProps(props);
    this.ctx.fillRect(x, y, w, h);
    this.ctx.restore();
  }

  circle(x: number, y: number, r: number, props?: PenProps): void {
    this.ctx.save();
    this.applyProps(props);
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  text(text: string, x: number, y: number, props?: PenProps): void {
    this.ctx.save();
    this.applyProps(props);
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // =-= DERIVATED METHODS
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  strokeRectObj(rect: RectLike | null | undefined, props?: PenProps): void {
    if (!rect) return;
    this.strokeRect(rect.x, rect.y, rect.w, rect.h, props);
  }

  fillRectObj(rect: RectLike | null | undefined, props?: PenProps): void {
    if (!rect) return;
    this.fillRect(rect.x, rect.y, rect.w, rect.h, props);
  }
}
