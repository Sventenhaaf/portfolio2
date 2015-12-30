// Unit and system settings
var excitation  = -1;    // initial excitation       [m]
var velocity    = 0;    // initial velocity         [m/s]
var mass        = 10;   // mass             [kg]
var stiffness   = 390;   // spring stiffness [kg/s^2]
var damping     = 10;    // system damping   [kg/s]

// External force settings
var fMagnitude  = 0;   // Ext force Amplitude      [N]
var frequency   = 1.51;   // Ext force frequency      [Hz]

// Representation settings
var totalWidth  = 1300; // total width of screen
var ctrlHeight  = 50;   // total height of control panel
var mtnHeight   = 500;  // total height of motion simulation screen
var stgHeight   = 300;  // total height of settings screen
// var margin      = {top: 20, right: 20, bottom: 20, left: 20}; // setting screen
//     width       = totalWidth - margin.left - margin.right,
//     height      = mtnHeight - margin.top - margin.bottom;
var timeStep    = 20;   // time step between each calculation [ms]
var offsetX     = 50;   // distance system is from right edge
var offsetY     = 50;   // distance system is from ceiling
var ntrHeight   = 250;  // height at which spring force is 0
var t           = 0;    // initial setting of time variable t
var data        = [];   // initial setting of data array to represent line graph
var timeScale   = 300;  // scale with which time is projected to x direction

// Prep work
var scale       = ntrHeight - offsetY;
var start       = new Date().getTime();
var stopTime    = new Date().getTime();
var waited      = new Date().getTime() - stopTime;
var diff        = 0;
var stopAnim    = false;

// Initialize the figures on the screen
var svg = d3.select(".motion").append("svg")
  .attr("width", totalWidth)
  .attr("height", mtnHeight)
  .style({
    "display"         : "block",
    "margin"          : "auto",
    "align-items"     : "center",
    "justify-content" : "center",
    "border"          : "1px solid black"
  })

var controlPanel = d3.select(".controlPanel").append("svg")
  .attr("width", totalWidth)
  .attr("height", ctrlHeight)
  .style({
    "display"         : "block",
    "margin"          : "auto",
    "align-items"     : "center",
    "justify-content" : "center",
    "border"          : "1px solid black"
  })


var settings = d3.select(".settings").append("svg")
  .attr("width", totalWidth)
  .attr("height", stgHeight)
  .style({
    "display"         : "block",
    "margin"          : "auto",
    "align-items"     : "center",
    "justify-content" : "center",
    "border"          : "1px solid black"
  })

var startSquare = controlPanel
  .append("rect")
  .attr("x", 300)
  .attr("y", 10)
  .attr("height", 30)
  .attr("width", 30)
  .attr("onclick", "startAnimation()")
  .style("fill", "#ccc")

var stopSquare = controlPanel.append("rect")
  .attr("x", 400)
  .attr("y", 10)
  .attr("height", 30)
  .attr("width", 30)
  .attr("onclick", "stopAnimation()")
  .style("fill", "#666")

var spring = svg.append("line")
  .attr("x1", totalWidth - offsetX)
  .attr("y1", 0)
  .attr("x2", totalWidth - offsetX)
  .attr("y2", scale*excitation + ntrHeight)
  .attr("stroke-width", 2)
  .attr("stroke", "rgb(255, 0, 0)")
  .attr("id", "spring")

var circle = svg.append("circle")
  .attr("cy", scale*excitation + ntrHeight)
  .attr("cx", totalWidth - offsetX)
  .attr("r", 20)
  .attr("id", "ball")
  .style("fill", "cornflowerblue");

// Animation functions
function startAnimation() {
  waited += new Date().getTime() - stopTime
  stopAnim = false;
  Animation();
}

function Animation() {
  diff = Math.floor(new Date().getTime() - start - (t * 1000) - waited);
  animate();
  if (!stopAnim) { window.setTimeout(Animation, timeStep - diff); }
}

function stopAnimation() {
  stopTime = new Date().getTime();
  stopAnim = true;
}




  // Setting Scales and Axes - Now go put them to use!
  var xScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.t; })])
    .range([totalWidth - offsetX - t * timeScale, totalWidth - offsetX ]); //

  var yScale = d3.scale.linear()
    // .domain([d3.min(data, function(d) { return d.y; }), d3.max(data, function(d) { return d.y; })])
    .domain([-1, 1])
    .range([mtnHeight - offsetY, offsetY]);

  //Define X axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(15)
    .tickSize(-mtnHeight + (2 * offsetY), 0, 0)

  //Define Y axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    // .ticks(20)
    .tickSize(-totalWidth + (2 * offsetX), 0, 0)

  //Create X axis
  svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (mtnHeight - offsetY) + ")")
    .call(xAxis);

  //Create Y axis
  svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (totalWidth - offsetX) + ",0)")
    .call(yAxis);
  // draw the line
  var lineFunction = d3.svg.line()
    .x(function(d) { return xScale(d.t * 1) ; })            // xScale()
    .y(function(d) { return d.y * scale + ntrHeight; })    // yScale()
    .interpolate("linear");

  var lineGraph = svg.append("path")
  .attr("d", lineFunction(data))
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    // .style("stroke-dasharray", "5, 15")


function force() {
  return Math.sin(t*2*Math.PI*frequency)*fMagnitude;
}




// Actions
function setNewY() {
  excitation += velocity * timeStep / 1000;
  velocity -= ((
    stiffness * excitation * timeStep / (1000 * mass))
    +
    (damping * velocity * timeStep / (1000 * mass)
    +
    force()
  ));
  // velocity -= ;

  data.push({
    "y": excitation,
    "t": t
  });
  t += timeStep / 1000;
  return scale*excitation + ntrHeight;
}

function setNewColor() {
  var cy = parseFloat(document.getElementById("ball").getAttribute("cy"));
  var totalStroke = 2 * ntrHeight;
  var newColor = "rgb("
    + parseInt(255 - cy*255/totalStroke)
    + ", 0, "
    + parseInt(cy * 255 / totalStroke)
    + ")" ;
  return newColor;
}


function animate() {
  var spring = document.getElementById("spring");
  var circle = document.getElementById("ball");
  var y = setNewY(),
      newColor = setNewColor();
  spring.setAttribute("y2", y);
  spring.setAttribute("stroke", newColor);
  circle.setAttribute("cy", y);

  //Update scale domains
	xScale.domain([0, d3.max(data, function(d) { return d.t; })])
    .range(xScaleRange());

	svg.select(".xAxis")
		.call(xAxis);
  svg.select(".yAxis")
    .attr("transform", "translate(" + yScaleTransform() + ",0)")

  lineGraph
    .attr("d", lineFunction(data))
    // .attr("transform", "translate(" +  yScaleTransform() + ",0)");

}

function yScaleTransform() {
  if (totalWidth - (2 * offsetX) > t * timeScale) {
    return totalWidth - (t * timeScale) - offsetX;
  }
  else {
    return offsetX;
  }
}

function xScaleRange() {
  if (totalWidth - (2 * offsetX) > t * timeScale) {
    return [totalWidth - offsetX - t * timeScale, totalWidth - offsetX ];
  }
  else {
    return [offsetX, totalWidth - offsetX];
  }
}

// TODOS
// Control Panel below the svg Panel
//    OPTIONS:
//    - System props: Mass, spring stiffness, damping, ...
//    - Time settings: How to scale t to x, moment to stop simulation, ...
//    - graph settings: line dashes and colors, show velocity and / or acceleration
//    - plotting other stuff - eigenfrequency, bode plot, etc
//    -
// show eigenfrequency, bode plot etc at simulation
// external (resonating) force
// SI Units
// axis and scales
// pop-up saying: Looks like your system reached steady-state. Do you want to continue?
// in tijd-settings lijkt nog iets fout te zitten - gedrag wordt anders als ik 1 ms gebruik en als ik 0 ms gebruik werkt de hele app niet...

// LATER
// Ronde getallen in de array
// Keep stuff in function scope
// steady-state recognition
// transfer function composition
