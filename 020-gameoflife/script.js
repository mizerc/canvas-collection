const UPDATE_INTERVAL_MS = 300;
const CANVAS_SIZE = 600;
const CELL_SIZE_PX = 10;
const COL_COUNT = Math.floor(CANVAS_SIZE / CELL_SIZE_PX);
const ROW_COUNT = Math.floor(CANVAS_SIZE / CELL_SIZE_PX);
const ALIVE = 1;
const DEAD = 0;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class App {
  constructor() {
    this.lastUpdateTime = 0;
    // Get canvas from DOM
    const canvas = document.getElementById("mycanvas");
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    this.canvas = canvas;

    // Grid
    this.generationCount = 0;
    this.currentCells = [];
    this.nextCells = [];
    // Set each column in current cells to an empty array
    for (let i = 0; i < COL_COUNT; i++) {
      this.currentCells[i] = [];
    }
    // Repeat the same process for the next cells
    for (let i = 0; i < COL_COUNT; i++) {
      this.nextCells[i] = [];
    }
    // Fill board randomly
    for (let column = 0; column < COL_COUNT; column++) {
      for (let row = 0; row < ROW_COUNT; row++) {
        this.currentCells[column][row] = randomInt(DEAD, ALIVE);
      }
    }

    // Get context 2d
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Error getting context2d");
    }
    this.ctx = ctx;
  }

  init() {
    window.requestAnimationFrame(this.loop);
  }

  loop = (timeMs) => {
    // Handle first run
    if (!this.lastUpdateTime) {
      this.lastUpdateTime = timeMs;
    }
    // Throttle update rate
    const elapsed = timeMs - this.lastUpdateTime;
    if (elapsed >= UPDATE_INTERVAL_MS) {
      this.lastUpdateTime = timeMs;
      this.tick(timeMs);
    }
    window.requestAnimationFrame(this.loop);
  };

  tick = (timeMs = 0) => {
    let timeStr = "";
    if (timeMs) {
      timeStr = (timeMs / 1000).toFixed(0);
    }

    const canvas = this.canvas;
    const ctx = this.ctx;
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Compute next generation
    for (let column = 0; column < COL_COUNT; column++) {
      for (let row = 0; row < ROW_COUNT; row++) {
        //  Get n thru toroidal wrapping
        // +COL_COUNT and +ROW_COUNT avoids negative values before modulo
        const left = (column - 1 + COL_COUNT) % COL_COUNT;
        const right = (column + 1) % COL_COUNT;
        const top = (row - 1 + ROW_COUNT) % ROW_COUNT;
        const bottom = (row + 1) % ROW_COUNT;

        // Count living neighbors surrounding current cell
        const aliveNeighbours =
          this.currentCells[column][top] +
          this.currentCells[column][bottom] +
          this.currentCells[left][row] +
          this.currentCells[right][row] +
          this.currentCells[left][top] +
          this.currentCells[right][top] +
          this.currentCells[left][bottom] +
          this.currentCells[right][bottom];

        // Rules of Life
        // 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        // 2. Any live cell with more than three live neighbours dies, as if by overpopulation.
        // 3. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        // 4. Any live cell with two or three live neighbours lives on to the next generation.

        if (this.currentCells[column][row] === ALIVE) {
          if (aliveNeighbours < 2 || aliveNeighbours > 3) {
            // Dies from underpopulation or overpopulation
            this.nextCells[column][row] = 0;
          } else {
            // Lives on to the next generation
            this.nextCells[column][row] = 1;
          }
        } else if (this.currentCells[column][row] === DEAD) {
          if (aliveNeighbours === 3) {
            // Becomes a live cell by reproduction
            this.nextCells[column][row] = 1;
          } else {
            // Stays dead to the next generation
            this.nextCells[column][row] = 0;
          }
        }
      }
    }

    // Draw
    for (let column = 0; column < COL_COUNT; column++) {
      for (let row = 0; row < ROW_COUNT; row++) {
        // Get cell value (0 or 1)
        const cell_value = this.currentCells[column][row];
        if (cell_value === ALIVE) {
          ctx.fillStyle = "black";
        } else {
          ctx.fillStyle = "white";
        }
        const cell_x = column * CELL_SIZE_PX;
        const cell_y = row * CELL_SIZE_PX;
        ctx.fillRect(cell_x, cell_y, canvas.width, canvas.height);
      }
    }

    // Stroke canvas border
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const aliveCount = this.currentCells.reduce((acc, row) => {
      return acc + row.filter((cell) => cell === 1).length;
    }, 0);

    // Swap the current and next arrays for next generation
    const temp = this.currentCells;
    this.currentCells = this.nextCells;
    this.nextCells = temp;

    // Increment generation count
    this.generationCount++;

    // Debug
    [
      `CURRENT TIME: ${timeStr}s`,
      `GENERATION: ${this.generationCount}`,
      `ALIVE: ${aliveCount}`,
    ].forEach((text, index) => {
      const padding = 4;
      const textX = 20;
      const textH = 20;
      const textY = 20 + index * (textH + padding);
      const textW = 250;
      ctx.font = "16px Arial";
      ctx.fillStyle = "red";
      ctx.fillRect(textX - 6, textY - textH + padding, textW, textH); // align background behind text
      ctx.fillStyle = "white";
      ctx.fillText(text, textX, textY);
    });
  };
}

window.onload = () => {
  const app = new App();
  app.init();
};
