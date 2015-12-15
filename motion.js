var velocity = 0;
var stiffness = 0.02;
var damping = 4;
var mass = 10;

var timeStep = 20;
var offset = 60;
var neutralHeight = 100;

var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
  .attr("x1", width - offset)
  .attr("y1", 0)
  .attr("x2", width - offset)
  .attr("y2", offset)
  .attr("stroke-width", 5)
  .attr("stroke", "rgb(255, 0, 0)")
  .attr("id", "spring")

var circle = svg.append("circle")
  .attr("cy", offset)
  .attr("cx", width - offset)
  .attr("r", 20)
  .attr("id", "ball")
  .style("fill", "cornflowerblue");


// Original Code - - - - - - -

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
  console.log("before:")
  console.log(y);
  console.log(velocity);
  y += velocity;
  velocity -= stiffness * (y - 160);
  console.log("after:")
  console.log(y);
  console.log(velocity);
  return y;
}

function animate() {
  var spring = document.getElementById("spring");
  var circle = document.getElementById("ball");
  // var y = circle.getAttribute("cy");
  // i+= .1;
  var y = setNewY();
  var newY = i + parseFloat(y);
  if(newY > 500) newY = 20;
  var newColor = "rgb("
    + parseInt(255 - (y-60)*255/200)
    + ", 0, "
    + parseInt((y-60) * 255 / 200)
    + ")" ;
  spring.setAttribute("y2", newY);
  spring.setAttribute("stroke", newColor);
  circle.setAttribute("cy", newY);
}
