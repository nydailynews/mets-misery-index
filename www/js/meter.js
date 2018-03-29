var opts = {
    angle: 0, // The span of the gauge arc
    lineWidth: 0.5, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
    length: 0.7, // // Relative to gauge radius
    strokeWidth: 0.05, // The thickness
    color: '#000000' // Fill color
},

    staticZones: [
        {strokeStyle: "#B2C0D4", min: 0, max: 3}, // Light blue
        {strokeStyle: "#6681AA", min: 3, max: 7}, // Mid blue
        {strokeStyle: "#002D72", min: 7, max: 10}, // Dark blue
        ],

    staticLabels: {
        font: "11px sans-serif",  // Specifies font
        labels: [0, 1, 3, 5, 7, 9, 10],  // Print labels at these values
        color: "#FFFFFF",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },

    renderTicks: {
        divisions: 10,
        divWidth: 1,
        divLength: 0.375,
        divColor: '#FFFFFF',
    },
};

var target = document.getElementById('ometer'); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 10; // set max gauge value
gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 25; // set animation speed)
gauge.set(0); // set actual value
