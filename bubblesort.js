(function() {

  var arr = [];
  for (var idxx = 0; idxx < 10; idxx++) { arr.push(idxx); }

  for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i),
    x = arr[--i], arr[i] = arr[j], arr[j] = x);
  // Using D3 making an update function for a step in sorting algorithm
  var width = 700,
      height = 250,
      stepDuration = 250;
  if (Math.max.apply(null, arr) < 10) {
    var charSize = Math.min(width / (1.5 * arr.length), 48);
    var dx = charSize;
  }
  else {
    var charSize = width / (3 * arr.length);
    var dx = 2.5 * charSize;
  }

  var svg = d3.select(".bubblesort").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .style("font", "bold " + 1.5*charSize + "px monospace")
      .attr("transform", "translate(32," + (height / 2) + ")");

var counterzz = 0;
  function update(data, indices) {
    console.log("bubbles: " + ++counterzz);
    var text = svg.selectAll("text")
        .data(data, function(d) { return d; });

    text.attr("class", "update")
      .style("fill", function(d, i) { return indices.indexOf(i) == -1 ? "#666" : "red" })
      .transition()
      .duration(stepDuration)
        .attr("y", function(d, i) { return indices.indexOf(i) == -1 ? 0 : charSize * 1.2 })
      .transition()
        .duration(stepDuration)
        .attr("x", function(d, i) { return i * dx; })
      .transition()
        .duration(stepDuration)
        .attr("y", 0);

    text.enter().append("text")
        .attr("class", "enter")
        .attr("dy", ".35em")
        .attr("x", function(d, i) { return i * dx; })
        .text(function(d) { return d; })
        .attr("y", 0)
        .style("fill-opacity", 1);
  }
  // - - - - BUBBLE SORT ALGORITHM - - - -



  var swapped = true;
  var i = 0;
  var indices = [0, 1];
  update(arr, indices);

  var myInterval = setInterval(function() {
    if (arr[i] > arr[i+1]) {
      var temp = arr[i]; arr[i] = arr[i+1]; arr[i+1] = temp; swapped = true;
    }
    indices = [i, i+1];
    update(arr, indices);
    if (i > arr.length - 3 && swapped) { i = 0; swapped = false; }
    else { i++ };
    // SLOPPY - making sure no numbers stay red
    if (i > arr.length - 1) {
      clearInterval(myInterval);
      update(arr, [arr.length + 1, arr.length + 2])
    }
  }, 3 * stepDuration + 2.5);


})();
