var width = 960,
    height = 500;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(32," + (height / 2) + ")");

function update(data, indices) {

  var text = svg.selectAll("text")
      .data(data, function(d) { return d; });

  text.attr("class", "update")
    .style("fill", function(d, i) { return indices.indexOf(i) == -1 ? "#666" : "red" })
    .transition()
      .attr("y", function(d, i) { return indices.indexOf(i) == -1 ? 0 : 50 })
    .transition()
      .attr("x", function(d, i) { return i * 32; })
    .transition()
      .attr("y", 0);

  text.enter().append("text")
      .attr("class", "enter")
      .attr("dy", ".35em")
      .attr("x", function(d, i) { return i * 32; })
      .text(function(d) { return d; })
      .attr("y", 0)
      .style("fill-opacity", 1);
}

// - - - - BUBBLE SORT ALGORITHM - - - -
var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

for(var j, x, i = a.length; i; j = Math.floor(Math.random() * i),
  x = a[--i], a[i] = a[j], a[j] = x);


var swapped = true;
var i = 0;
var indices = [0, 1];
update(a, indices);

var myInterval = setInterval(function() {
  if (a[i] > a[i+1]) {
    var temp = a[i]; a[i] = a[i+1]; a[i+1] = temp; swapped = true;
  }
  indices = [i, i+1];
  update(a, indices);
  if (i > a.length - 3 && swapped) { i = 0; swapped = false; }
  else { i++ };
  // SLOPPY - making sure no numbers stay red
  if (i > a.length - 1) {
    clearInterval(myInterval);
    update(a, [a.length + 1, a.length + 2])
  }
}, 750);
