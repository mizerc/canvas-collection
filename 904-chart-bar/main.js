const W = 600;
const H = 600;
function updateChart() {
  const canvas = new Canvas(document.getElementById("mycanvas"), W, H);
  const dataInput = document.getElementById("dataInput").value;
  const data = dataInput.split(",").map((v) => parseFloat(v.trim()));
  const barchart = new BarChart();
  barchart.setData(data);
  barchart.paintAt(canvas, 0, 0);
}
window.onload = () => {
  const canvas = new Canvas(document.getElementById("mycanvas"), W, H);
  canvas.width = W;
  canvas.height = H;
  updateChart();
};
function handleOnButtonPress() {
  updateChart();
}
function handleOnKeyUp(event) {
  if (event.key === "Enter") {
    updateChart();
  }
}
