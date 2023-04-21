document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('double-pendulum-container');
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const plotData = [{
            x: [0],
            y: [0],
            mode: 'markers',
            marker: {
                color: 'rgba(255, 165, 0, 0.8)',
                size: 14
            },
        },
        {
            x: [0],
            y: [0],
            mode: 'markers',
            marker: {
                color: 'rgba(128, 0, 128, 0.8)',
                size: 14
            },
        },
    ];

    const layout = {
        xaxis: {
            range: [-2, 2],
            zeroline: false,
            showgrid: false,
            showticklabels: false,
            fixedrange: true,
            linecolor: 'rgba(128, 128, 128, 0.5)',
            linewidth: 1,
        },
        yaxis: {
            range: [-2, 2],
            scaleanchor: 'x',
            zeroline: false,
            showgrid: false,
            showticklabels: false,
            fixedrange: true,
            linecolor: 'rgba(128, 128, 128, 0.5)',
            linewidth: 1,
        },
        plot_bgcolor: 'rgba(40, 40, 40, 0.5)',
        paper_bgcolor: 'rgba(40, 40, 40, 1)',
        width: width,
        height: height,
        showlegend: false,
        margin: {
            t: 0,
            r: 0,
            l: 0,
            b: 0,
        },
        font: {
            color: 'white'}
    };

    const lineTrace = {
        x: [0, 0, 0],
        y: [0, 0, 0],
        mode: 'lines',
        line: {
            color: 'white',
            width: 2
        },
    };

    const trail1 = {
        x: [],
        y: [],
        mode: 'lines',
        line: {
            color: 'rgba(255, 165, 0, 0.5)',
            width: 1
        },
    };
    const trail2 = {
        x: [],
        y: [],
        mode: 'lines',
        line: {
            color: 'rgba(128, 0, 128, 0.5)',
            width: 1
        },
    };

    plotData.push(lineTrace);

    plotData.push(trail1, trail2);

    const statePlotData = [
    { x: [], y: [], mode: 'lines', name: 'theta1', line: { color: 'rgba(255, 165, 0, 0.8)' } },
    { x: [], y: [], mode: 'lines', name: 'theta2', line: { color: 'rgba(128, 0, 128, 0.8)' } },
    ];

    const derivPlotData = [
        { x: [], y: [], mode: 'lines', name: 'dtheta1', line: { color: 'orange' } },
        { x: [], y: [], mode: 'lines', name: 'dtheta2', line: { color: 'green' } },
    ];


    const subplotLayout = {
        width: 600,
        height: 300,
        plot_bgcolor: 'rgba(40, 40, 40, 0.5)',
        paper_bgcolor: 'rgba(40, 40, 40, 1)',
        font: {
            color: 'white'}
    };

    Plotly.newPlot('double-pendulum-plot', plotData, layout, {
        staticPlot: true
    });
    Plotly.newPlot('state-plot', statePlotData, subplotLayout);
    Plotly.newPlot('deriv-plot', derivPlotData, subplotLayout);

    let time = 0;

    // Double pendulum parameters
    let m1 = 1;
    let m2 = 1;
    let l1 = 1;
    let l2 = 1;
    let g = 9.81;

    // Initial conditions
    let th1_0 = Math.PI / 2;
    let th2_0 = Math.PI;
    let dth1_0 = 0;
    let dth2_0 = 0;

    // Time step and number of steps for the simulation
    let dt = 0.01;
    let steps = 1000;

    let state = [th1_0, th2_0, dth1_0, dth2_0];
    let deriv = [0, 0, 0, 0];
    let damping = 0;

    let plotUpdateInterval = 2; // Update the plot every 100 simulation steps
    let maxDataPoints = 1000; // Maximum number of data points to store in the arrays
    let frameRate = 60; // frames per second
    let lastFrameTime = 0; // Add this variable to store the time of the last frame
    const maxStateDerivDataPoints = 1000;

    function rungeKutta4(f, state, dt) {
        const k1 = f(state);
        const k2 = f(state.map((x, i) => x + k1[i] * dt / 2));
        const k3 = f(state.map((x, i) => x + k2[i] * dt / 2));
        const k4 = f(state.map((x, i) => x + k3[i] * dt));

        return state.map((x, i) => x + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    }

    function pendulumDynamics(state) {
        const [th1, th2, dth1, dth2] = state;

        // Apply damping
        const damping1 = -damping * dth1;
        const damping2 = -damping * dth2;

        const d2th1 =
            (-g * (2 * m1 + m2) * Math.sin(th1) -
                m2 * g * Math.sin(th1 - 2 * th2) -
                2 * Math.sin(th1 - th2) * m2 * (dth2 * dth2 * l2 + dth1 * dth1 * l1 * Math.cos(th1 - th2))) /
            (l1 * (2 * m1 + m2 - m2 * Math.cos(2 * th1 - 2 * th2)));

        const d2th2 =
            (2 * Math.sin(th1 - th2) *
                (dth1 * dth1 * l1 * (m1 + m2) + g * (m1 + m2) * Math.cos(th1) + dth2 * dth2 * l2 * m2 * Math.cos(th1 - th2))) /
            (l2 * (2 * m1 + m2 - m2 * Math.cos(2 * th1 - 2 * th2)));

        return [dth1 + damping1, dth2 + damping2, d2th1, d2th2];
    }

    function updatePlotData(state) {

        const fadeDuration = parseFloat(document.getElementById('fade-duration').value); // Get fade duration from the dial
        const maxTrailLength = Math.ceil(fadeDuration / dt);

        const [th1, th2] = state;
        const x1 = l1 * Math.sin(th1);
        const y1 = -l1 * Math.cos(th1);
        const x2 = x1 + l2 * Math.sin(th2);
        const y2 = y1 - l2 * Math.cos(th2);
        plotData[0].x = [x1];
        plotData[0].y = [y1];
        plotData[1].x = [x2];
        plotData[1].y = [y2];

        // Update line trace coordinates
        lineTrace.x = [0, x1, x2];
        lineTrace.y = [0, y1, y2];

        // Append new coordinates to the trail traces
        trail1.x = [x1, ...trail1.x.slice(0, maxTrailLength - 1)];
        trail1.y = [y1, ...trail1.y.slice(0, maxTrailLength - 1)];
        trail2.x = [x2, ...trail2.x.slice(0, maxTrailLength - 1)];
        trail2.y = [y2, ...trail2.y.slice(0, maxTrailLength - 1)];
    }

    function updatePlot() {
        if (!isRunning) return;

        updatePlotData(state);
        Plotly.update('double-pendulum-plot', {
            x: plotData.map((trace) => trace.x),
            y: plotData.map((trace) => trace.y)
        });
    }

    function updateTimeSeriesPlots() {
    const currentTime = statePlotData[0].x.length * dt;
    const startTime = Math.max(0, currentTime - 2); // Start from 0 or 5 seconds ago, whichever is greater

    // Update statePlotData
    statePlotData[0].x.push(currentTime);
    statePlotData[0].y.push(state[0]);
    statePlotData[1].x.push(currentTime);
    statePlotData[1].y.push(state[1]);

    // Update derivPlotData
    derivPlotData[0].x.push(currentTime);
    derivPlotData[0].y.push(deriv[0]);
    derivPlotData[1].x.push(currentTime);
    derivPlotData[1].y.push(deriv[1]);

    // Set the layout for the state plot
    const stateLayout = {
        xaxis: {
            title: "Time (s)",
            range: [startTime, currentTime]
        },
        yaxis: {
            title: "State"
        }
    };

    // Set the layout for the derivative plot
    const derivLayout = {
        xaxis: {
            title: "Time (s)",
            range: [startTime, currentTime]
        },
        yaxis: {
            title: "Derivative"
        }
    };

    Plotly.update('state-plot', { x: statePlotData.map((trace) => trace.x), y: statePlotData.map((trace) => trace.y) }, stateLayout);
    Plotly.update('deriv-plot', { x: derivPlotData.map((trace) => trace.x), y: derivPlotData.map((trace) => trace.y) }, derivLayout);
}



    function stepSimulation() {
        state = rungeKutta4(pendulumDynamics, state, dt);
        time += dt;
    }

    let stepCounter = 0;

    function simulate(currentTime) {
        if (!isRunning) return;

        const elapsed = currentTime - lastFrameTime;

        if (elapsed > maxDataPoints / frameRate) {
            stepSimulation();
            deriv = pendulumDynamics(state);
            stepCounter++;
            updatePlot();

            if (stepCounter >= plotUpdateInterval) {
                updateTimeSeriesPlots();
                stepCounter = 0;
            }

            lastFrameTime = currentTime;
        }

        requestAnimationFrame(simulate);
    }

    // Variables to control the simulation
    let isRunning = false;

    // Start simulation
    function startSimulation() {
        if (isRunning) return;

        isRunning = true;
        requestAnimationFrame(simulate);
    }

    // Stop simulation
    function stopSimulation() {
        isRunning = false;
        clearInterval(updatePlot);
    }

    // Update parameters
    function updateParameters(event) {
        isRunning = false

        if (event.target.id === 'm1') {
            m1 = parseFloat(event.target.value);
        } else if (event.target.id === 'm2') {
            m2 = parseFloat(event.target.value);
        } else if (event.target.id === 'gravity') {
            g = parseFloat(event.target.value);
        } else if (event.target.id === 'time-step') {
            dt = parseFloat(event.target.value);
        } else if (event.target.id === 'steps') {
            steps = parseInt(event.target.value);
        } else if (event.target.id === 'damping') {
            damping = parseFloat(event.target.value);
        }

        startSimulation();
    }

    // Add event listeners for buttons
    document.getElementById('start-button').addEventListener('click', startSimulation);
    document.getElementById('stop-button').addEventListener('click', stopSimulation);
    document.getElementById('m1').addEventListener('input', updateParameters);
    document.getElementById('m2').addEventListener('input', updateParameters);
    document.getElementById('gravity').addEventListener('input', updateParameters);
    document.getElementById('steps').addEventListener('input', updateParameters);
    document.getElementById('damping').addEventListener('input', updateParameters);
    document.getElementById('time-step').addEventListener('input', updateParameters);

});