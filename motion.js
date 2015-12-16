// System Settings
var stiffness = 0.02;
// var damping = 4;
// var mass = 10;

// Representation settings
var totalWidth = 1300;
var totalHeight = 500;
var timeStep  = 20;
var offsetX   = 60;
var offsetY   = 150;
var ntrHeight = 250;
var t         = 0;
var data      = [];

// Boundary conditions
var velocity  = 0;
// var startPosition = 1;


var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = totalWidth - margin.left - margin.right,
    height = totalHeight - margin.top - margin.bottom;

var svg = d3.select(".motion").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  // .append("g")
  // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .style("display", "flex")
  .style("align-items", "center")
  .style("justify-content", "center")

var startSquare = svg
  .append("rect")
  .attr("x", 300)
  .attr("y", 100)
  .attr("height", 30)
  .attr("width", 30)
  .attr("onclick", "startAnimation()")
  .style("fill", "#ccc")

var stopSquare = svg.append("rect")
  .attr("x", 400)
  .attr("y", 100)
  .attr("height", 30)
  .attr("width", 30)
  .attr("onclick", "stopAnimation()")
  .style("fill", "#666")


var spring = svg.append("line")
  .attr("x1", width - offsetX)
  .attr("y1", 0)
  .attr("x2", width - offsetX)
  .attr("y2", offsetY)
  .attr("stroke-width", 5)
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
  velocity -= stiffness * (y - ntrHeight - offsetX);
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
    "t": t
  });
  t += timeStep;
}


function animate() {
  var spring = document.getElementById("spring");
  var circle = document.getElementById("ball");
  var y = setNewY(),
      newColor = setNewColor();
  addData();
  lineGraph.attr("d", lineFunction(data))

  spring.setAttribute("y2", y);
  spring.setAttribute("stroke", newColor);
  circle.setAttribute("cy", y);
}
