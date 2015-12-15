// Original Code

// <div>
//   <svg width="500" height="100">
//     <circle id="circle1" cx="20" cy="20" r="10"
//         style="stroke: none; fill: #ff0000;"/>
//   </svg>
//   <br/>
//   <input type="button" value="ashdgfk Animation" onclick="startAnimation();">
//   <input type="button" value="Stop Animation" onclick="stopAnimation();">
// </div>



var height = 200;
var width = 1200;


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var newSvg = d3.select("#figure").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("background", "red");


var svg = d3.select(".motion")
  .append("svg")
    .attr("height", height)
    .attr("width", width)
  // .append("g")
  //   .style("fill", "red");

  var startSquare = svg
    .append("rect")
    .attr("x", 300)
    .attr("y", 100)
    .attr("height", 30)
    .attr("width", 30)
    .attr("onclick", "startAnimation()")
    .style("fill", "#ccc")

var circle = svg.append("circle")
      .attr("cy", 60)
      .attr("cx", 100)
      .attr("r", 50)
      .attr("id", "ball")
      .style("fill", "red");

// Original Code - - - - - - -

var timerFunction = null;
var i = 0;

function startAnimation() {
    if(timerFunction == null) {
        timerFunction = setInterval(animate, 20);
    }
}

function stopAnimation() {
    if(timerFunction != null){
        clearInterval(timerFunction);
        timerFunction = null;
    }
}

function animate() {
    var circle = document.getElementById("ball");
    var x = circle.getAttribute("cx");
    i+= .1;
    var newX = i + parseInt(x);
    if(newX > 500) {
        newX = 20;
    }
    circle.setAttribute("cx", newX);
}
