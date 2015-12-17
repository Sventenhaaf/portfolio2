// Unit settings
var excitation  = 1;    // excitation       [m]
var mass        = 10;   // mass             [kg]

// System Settings
var stiffness   = 0.0040;   // spring stiffness [kg/s^2]
var damping     = 0;    // system damping   [kg/s]

// Representation settings
var totalWidth  = 1300; // total width of screen
var ctrlHeight  = 50;   // total height of control panel
var mtnHeight   = 500;  // total height of motion simulation screen
var stgHeight   = 300;  // total height of settings screen
var margin      = {top: 20, right: 20, bottom: 20, left: 20}; // setting screen
    width       = totalWidth - margin.left - margin.right,
    height      = mtnHeight - margin.top - margin.bottom;
var timeStep    = 20;   // time step between each calculation
var offsetX     = 50;   // distance system is from right edge
var offsetY     = 0;  // distance system is from ceiling
var ntrHeight   = 150;  // height at which spring force is 0
var t           = 0;    // initial setting of time variable t
var data        = [];   // initial setting of data array to represent line graph
var timeScale   = 10;   // scale with which time is projected to x direction


// Boundary conditions
var velocity  = 0;
// var startPosition = 1;

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
  .attr("x1", width - offsetX)
  .attr("y1", 0)
  .attr("x2", width - offsetX)
  .attr("y2", offsetY)
  .attr("stroke-width", 2)
  .attr("stroke", "rgb(255, 0, 0)")
  .attr("id", "spring")

var circle = svg.append("circle")
  .attr("cy", offsetY)
  .attr("cx", width - offsetX)
  .attr("r", 20)
  .attr("id", "ball")
  .style("fill", "cornflowerblue");


// - - GRAPH - - - -
var lineFunction = d3.svg.line()
  .x(function(d) { return d.t; })
  .y(function(d) { return d.y; })
  .interpolate("linear");

var lineGraph = svg.append("path")
.attr("d", lineFunction(data))
  .attr("stroke", "blue")
  .attr("stroke-width", 2)
  .attr("fill", "none")
  // .style("stroke-dasharray", "5, 15")


// - - OTHER CODE - -

var timerFunction = null;
var i = 0;

function startAnimation() {
  if(timerFunction == null) {
    timerFunction = setInterval(animate, timeStep);
  }
}

function stopAnimation() {
  if(timerFunction != null){
    clearInterval(timerFunction);
    timerFunction = null;
  }
}

function setNewY() {
  var y = parseFloat(document.getElementById("ball").getAttribute("cy"));
  y += velocity;
  velocity -= damping * velocity;
  velocity -= stiffness * (y - ntrHeight - offsetX);
  console.log(y);
  return y;
}

function setNewColor() {
  var y = parseFloat(document.getElementById("ball").getAttribute("cy"));
  var totalStroke = 2 * ntrHeight;
  var newColor = "rgb("
    + parseInt(255 - (y-offsetX)*255/totalStroke)
    + ", 0, "
    + parseInt((y-offsetX) * 255 / totalStroke)
    + ")" ;
  return newColor;
}

function addData() {
  data.push({
    "y": parseFloat(document.getElementById("ball").getAttribute("cy")),
    "t": t / timeScale
  });
  t += timeStep;
}


function animate() {
  var spring = document.getElementById("spring");
  var circle = document.getElementById("ball");
  var y = setNewY(),
      newColor = setNewColor();
  addData();
  lineGraph
    .attr("d", lineFunction(data))
    .attr("transform",
              "translate(" +  (totalWidth - margin.left - margin.right - offsetX - (t / timeScale)) + ",0)");

  spring.setAttribute("y2", y);
  spring.setAttribute("stroke", newColor);
  circle.setAttribute("cy", y);
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
