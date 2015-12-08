var array = [1, 2, 3, 4, 5];

var width = 960,
    height = 500;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(32," + (height / 2) + ")");

function update(data, indices) {

  // DATA JOIN
  // Join new data with old elements, if any.
  var text = svg.selectAll("text")
      .data(data, function(d) { return d; });

  // UPDATE
  // Update old elements as needed.
  text.attr("class", "update")
    .style("fill", function(d, i) { return indices.indexOf(i) == -1 ? "#666" : "red" })
    .transition()
      .attr("y", function(d, i) { return indices.indexOf(i) == -1 ? 0 : 50 })
    .transition()
      .attr("x", function(d, i) { return i * 32; })
    .transition()
      .attr("y", 0);

  // ENTER
  // Create new elements as needed.
  text.enter().append("text")
      .attr("class", "enter")
      .attr("dy", ".35em")
      .attr("x", function(d, i) { return i * 32; })
      .text(function(d) { return d; })
      .attr("y", 0)
      .style("fill-opacity", 1);

  // EXIT
  // Remove old elements as needed.
  text.exit()
      .attr("class", "exit")
    .transition()
      .attr("y", 60)
      .style("fill-opacity", 1e-6)
      .remove();
}

var indices = [1, 3];
// The initial display.
update(array, indices);

// Grab a random sample of letters from the array, in arrayical order.
setInterval(function() {
  if (array[3] == 4) { array = [1, 4, 3, 2, 5]; indices = [1, 3]; }
  else if (array[3] == 2) { array = [2, 4, 3, 1, 5]; indices = [0, 3]; }
  else if (indices[0] == 0) { array = [2, 4, 3, 1, 5]; indices = [1, 2]; }
  else { array = [1, 2, 3, 4, 5]; indices = [1, 3]}
  update(array, indices);
}, 1500);
