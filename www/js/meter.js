var opts = {
    angle: 0, // The span of the gauge arc
    lineWidth: 0.5, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
    length: 0.6, // // Relative to gauge radius
    strokeWidth: 0.05, // The thickness
    color: '#000000' // Fill color
},

    staticZones: [
        {strokeStyle: "#A0C42E", min: 0, max: 33}, // Green
        {strokeStyle: "#FCD13E", min: 33, max: 66}, // Yellow
        {strokeStyle: "#EC2127", min: 66, max: 100}, // Red
        ],

    staticLabels: {
        font: "10px sans-serif",  // Specifies font
        labels: [0, 25, 50, 75, 100],  // Print labels at these values
        color: "#000000",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },

    renderTicks: {
        divisions: 4,
        divWidth: 1,
        divLength: 0.75,
        divColor: '#000000',
        subDivisions: 2,
        subLength: 0.375,
        subWidth: 1,
        subColor: '#333333'
    },
};

var target = document.getElementById('meter'); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 100; // set max gauge value
gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 25; // set animation speed)
gauge.set(50); // set actual value