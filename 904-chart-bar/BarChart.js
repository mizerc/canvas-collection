class BarChart {
  constructor() {
    this.data = [];
  }
  setData = (data) => {
    this.data = data.filter(
      (v) =>
        typeof v === "number" &&
        !isNaN(v) &&
        Number.isFinite(v) &&
        Number.isSafeInteger(v)
    );
  };
  paintAt = (canvas, posX, posY) => {
    const { w, h } = canvas.getSize();
    const chartW = w;
    const chartH = h;
    const midChartH = chartH / 2;
    canvas.clear();
    canvas.strokeRect(posX, posY, chartW, chartH);
    const qntSamples = this.data.length;
    const maxVal = Math.max(...this.data);
    this.data.forEach((value, i) => {
      const barW = chartW / qntSamples;
      const barH = -1 * (value / maxVal) * midChartH;
      const startX = posX + i * barW;
      const startY = posY + midChartH;
      canvas.fillRect(startX, startY, barW, barH, "#f2854bff");
      canvas.strokeRect(startX, startY, barW, barH, "#980e0eff", 2);
    });
  };
}
