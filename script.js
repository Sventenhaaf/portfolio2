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

var a = [3, 1, 6, 2, 0, 9, 8, 5, 4, 7];

var swapped = true;
var i = 0;
var indices = [0, 1];
update(a, indices);

setInterval(function() {
  if (a[i] > a[i+1]) {
    var temp = a[i];
    a[i] = a[i+1];
    a[i+1] = temp;
    swapped = true;
  }
  indices = [i, i+1];
  update(a, indices);
  if (i > a.length - 3 && swapped) {
    i = 0;
    swapped = false;
   }
  else { i++ };
}, 750);





//
// function bubbleSort(a)
// {
//     var swapped;
//     do {
//         swapped = false;
//         for (var i=0; i < a.length-1; i++) {
//             if (a[i] > a[i+1]) {
//                 var temp = a[i];
//                 a[i] = a[i+1];
//                 a[i+1] = temp;
//                 swapped = true;
//             }
//         }
//     } while (swapped);
// }
//
// bubbleSort(a);
// console.log(a);
