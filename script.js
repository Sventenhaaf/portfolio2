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

// -- start new setINterval code
var count = 0,
    time = 1000,
    intId;
function invoke(){

    intId = setInterval(function(){
        count += 1;
        console.log(count);
        if(count % 2 === 0) // now i need to change my time
        {
           time += 2000; //some new value
           intId = window.clearInterval(intId);
           invoke();
        }
    }, time);

}

invoke();




// -- Quicksort code


var arr = [0, 7, 3, 5, 9, 1, 4, 8, 2, 6];
var indicesOld = [0, 1];
var indicesNew = [0, 1];

update(arr, indicesOld);

function qsort(arr, ret)
{
    var stack = [arr];
    var sorted = [];
    var intervalId = 0;
    var i = 1;
    var busy = false;
    var temp = arr.slice();
    var left = [], right = [];
    var side;

    intervalId = setInterval(function() {
      if (stack.length || busy) {
        if(busy) { }
        else {
          temp = stack.pop(), tl = temp.length;
          busy = true;
        }
        var pivot = temp[0];

        // make the array and indices that go into the update function - - - - -
        var tot = [];
        tot = tot.concat(sorted);
        tot = tot.concat(left);
        indicesOld = indicesNew.slice();
        indicesNew[0] = tot.length;
        tot.push(pivot);
        tot = tot.concat(right);
        indicesNew[1] = tot.length;
        tot = tot.concat(temp.slice(i));
        for (var id = stack.length - 1; id >= 0; id--) {
          tot = tot.concat(stack[id]);
        }
        update(tot, indicesOld);


        if (tl == 1) {
          sorted.push(temp[0]);
          i = 1;
          busy = false;
          return;
        }



        else if (i < tl) {
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
        }
      }
      else if (sorted.length == arr.length) {
          clearInterval(intervalId);
          ret(sorted);
          // console.log(sorted);
      }
    }, 750);
}


// SORTED - LEFT - PIVOT - RIGHT - TEMP FROM I TO END - STACK BACKWARDS



qsort(arr, function(sorted) {
  console.log(sorted);
});










//---------------------------------------------------------------------------
