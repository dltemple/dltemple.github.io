document.addEventListener("DOMContentLoaded", function () {
  const activationFunctions = [
    {
      name: "Sigmoid",
      equation: "1 / (1 + Math.exp(-x))",
      derivative: "(1 - (1 / (1 + Math.exp(-x)))) * (1 / (1 + Math.exp(-x)))",
      plotId: "sigmoid-plot",
    },
    { name: "ReLU", equation: "Math.max(0, x)", derivative: "x > 0 ? 1 : 0", plotId: "relu-plot" },
    { name: "Tanh", equation: "Math.tanh(x)", derivative: "1 - Math.pow(Math.tanh(x), 2)", plotId: "tanh-plot" },
    { name: "Leaky ReLU", equation: "x > 0 ? x : 0.01 * x", derivative: "x > 0 ? 1 : 0.01", plotId: "leaky-relu-plot" },
    { name: "ELU", equation: "x > 0 ? x : 0.01 * (Math.exp(x) - 1)", derivative: "x > 0 ? 1 : 0.01 * Math.exp(x)", plotId: "elu-plot" },
    {
      name: "Swish",
      equation: "x / (1 + Math.exp(-x))",
      derivative: "(1 / (1 + Math.exp(-x))) * (1 + x * (1 - (1 / (1 + Math.exp(-x)))))",
      plotId: "swish-plot",
    },
  ];

  activationFunctions.forEach(function (activationFunction) {
    createInteractivePlot(activationFunction.plotId, activationFunction.equation, activationFunction.derivative);
  });
});

function createInteractivePlot(plotId, equation, derivative) {
  const xValues = Array.from({ length: 201 }, (_, i) => -1 + i * 0.01);
  const yValues = xValues.map(function (x) {
    return eval(equation);
  });
  const yDerivativeValues = xValues.map(function (x) {
    return eval(derivative);
  });

  const activationTrace = {
    x: xValues,
    y: yValues,
    mode: "lines",
    name: "Activation",
    line: { color: "#007AFF", width: 2 },
  };

  const derivativeTrace = {
    x: xValues,
    y: yDerivativeValues,
    mode: "lines",
    name: "Derivative",
    line: { color: "#FF3B30", width: 2 },
  };

  const layout = {
    margin: { t: 0, r: 0, l: 0, b: 30 },
    xaxis: {
      title: "x",
      range: [-1, 1],
      titlefont: { color: "#ffffff" },
      tickfont: { color: "#ffffff" },
      linecolor: "#ffffff",
      gridcolor: "rgba(34, 34, 34, 0.2)",
    },
    yaxis: {
      title: "f(x)",
      range: [-1.5, 1.5],
      fixedrange: true,
      titlefont: { color: "#ffffff" },
      tickfont: { color: "#ffffff" },
      linecolor: "#ffffff",
      gridcolor: "rgba(34, 34, 34, 0.2)",
    },
    legend: { x: 0.5, y: 1.1, orientation: "h", font: { color: "#ffffff" } },
    plot_bgcolor: "#222222" /* This sets the background color of the chart area */,
    paper_bgcolor: "#222222" /* This sets the background color of the entire plot */,
  };

  Plotly.newPlot(plotId, [activationTrace, derivativeTrace], layout);
}
