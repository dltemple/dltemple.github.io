document.addEventListener('DOMContentLoaded', function () {
  const activationFunctions = [
    { name: 'Sigmoid', equation: '1 / (1 + Math.exp(-x))', derivative: '(1 - (1 / (1 + Math.exp(-x)))) * (1 / (1 + Math.exp(-x)))', plotId: 'sigmoid-plot' },
    { name: 'ReLU', equation: 'Math.max(0, x)', derivative: 'x > 0 ? 1 : 0', plotId: 'relu-plot' },
    { name: 'Tanh', equation: 'Math.tanh(x)', derivative: '1 - Math.pow(Math.tanh(x), 2)', plotId: 'tanh-plot' },
    { name: 'Leaky ReLU', equation: 'x > 0 ? x : 0.01 * x', derivative: 'x > 0 ? 1 : 0.01', plotId: 'leaky-relu-plot' },
    { name: 'ELU', equation: 'x > 0 ? x : 0.01 * (Math.exp(x) - 1)', derivative: 'x > 0 ? 1 : 0.01 * Math.exp(x)', plotId: 'elu-plot' },
    { name: 'Swish', equation: 'x / (1 + Math.exp(-x))', derivative: '(1 / (1 + Math.exp(-x))) * (1 + x * (1 - (1 / (1 + Math.exp(-x)))))', plotId: 'swish-plot' },
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
    mode: 'lines',
    name: 'Activation',
  };

  const derivativeTrace = {
    x: xValues,
    y: yDerivativeValues,
    mode: 'lines',
    name: 'Derivative',
  };

  const layout = {
    margin: { t: 0, r: 0, l: 30, b: 30 },
    xaxis: { title: 'x' },
    yaxis: { title: 'f(x)' },
  };

  Plotly.newPlot(plotId, [activationTrace, derivativeTrace], layout);
}
