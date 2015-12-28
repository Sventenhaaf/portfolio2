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

  var svg = d3.select(".quicksort").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .style("font", "bold " + 1.5*charSize + "px monospace")
      .attr("transform", "translate(32," + (height / 2) + ")");

var counterzz = 0;
  function update(data, indices) {
    console.log("quicksort: " + ++counterzz);
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

  // -- Quicksort code


  var indicesOld = [0, 1];
  var indicesNew = [0, 1];

  var stack = [arr];
  var sorted = [];
  var intervalId = 0;
  var i = 1;
  var busy = false;
  var temp = arr.slice();
  var left = [], right = [];
  var side;
  var time = 0;

  function qsort(arr, ret) {

      intervalId = setInterval(function() {
        if (stack.length || busy) {
          if(!busy) {
            temp = stack.pop(), tl = temp.length;
            busy = true; }
          var pivot = temp[0];

          // make the array and indices that go into the update function - - - - -
          var tot = [];
          tot = tot.concat(sorted);
          tot = tot.concat(left);
          if (tl != 1 && i < tl) {
            indicesOld = indicesNew.slice();
            indicesNew[0] = tot.length;
          }
          tot.push(pivot);
          tot = tot.concat(right);
          if (tl != 1 && i < tl) { indicesNew[1] = tot.length; }
          tot = tot.concat(temp.slice(i));
          for (var id = stack.length - 1; id >= 0; id--) {
            tot = tot.concat(stack[id]);
          }
          if (tl != 1 && i < tl) { update(tot, indicesOld); }

          if (tl == 1) {
            sorted.push(temp[0]);
            i = 1;
            busy = false;
            time = 0;
            intervalId = window.clearInterval(intervalId);
            qsort(tot, function(sorted) {
              update(sorted, [sorted.length+1, sorted.length+2]);
            });
            return;
          }

          else if (i < tl) {
            if (time === 0) {
              time = 3 * stepDuration;
              intervalId = window.clearInterval(intervalId);
              qsort(tot, function(sorted) {
                update(sorted, [sorted.length+1, sorted.length+2]);
              });
            }
            if (temp[i] < pivot) {
              left.push(temp[i]);
              indicesNew[0] += 1;
              indicesNew[1] = indicesNew[0] - 1;
            } else {
              right.push(temp[i]);
              indicesNew[1] = indicesNew[0] + right.length;
            }
            i++;
          }
          else {
            left.push(pivot);
            if (right.length)
                stack.push(right);
            if (left.length)
                stack.push(left);
            i = 1;
            left = []; right = [];
            busy = false;
            if (time !== 0) {
              time = 0;
              intervalId = window.clearInterval(intervalId);
              qsort(tot, function(sorted) {
                update(sorted, [sorted.length+1, sorted.length+2]);
              });
            }
          }
        }
        else if (sorted.length == arr.length) {
            clearInterval(intervalId);
            ret(sorted);
        }
      }, time);
  }


  qsort(arr, function(sorted) {
    update(sorted, [sorted.length+1, sorted.length+2]);
  });

})();
