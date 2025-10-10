const W = 600;
const H = 600;
const chartW = W;
const chartH = H;

class BarChart {
  constructor(data) {
    this.data = data; // [v0, v1, v2, v3, ...]
  }
  paintAt = (canvas, posX, posY) => {
    const midChartH = chartH / 2;

    canvas.clear();
    canvas.strokeRect(posX, posY, chartW, chartH);

    const qntSamples = this.data.length;
    const maxVal = Math.max(...this.data);

    this.data.forEach((value, i) => {
      const barW = chartW / qntSamples;
      const barH = -1 * (value / maxVal) * midChartH;
      // const barH = -value;
      const startX = posX + i * barW;
      const startY = posY + midChartH;
      canvas.fillRect(startX, startY, barW, barH, "#dbbf34ff");
      canvas.strokeRect(startX, startY, barW, barH, "#000");
    });
  };
}
window.onload = () => {
  const canvas = new Canvas(document.getElementById("mycanvas"), W, H);

  {
    const data = [100, 200, 150, 300, 250, 400, 200, -200, -300, -400];
    const barchart = new BarChart(data);
    barchart.paintAt(canvas, 0, 0);
  }
};
