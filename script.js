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


var arr = [6, 5, 7, 4, 9, 3, 8, 1, 2];
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
        console.log("tl");
        if(typeof tl !== "undefined") console.log(tl);
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
  console.log("sorted:");
  console.log(sorted);
});




//
// console.log('temp:');
// console.log(temp);
// console.log('pivot:');
// console.log(pivot);
// console.log('temp from i to end:');
// console.log(temp.slice(i))
// console.log('stack:');
// for (var idx = 0; idx < stack.length; idx++) {
//   console.log(stack[idx]);
// }
// console.log('sorted:');
// console.log(sorted);
// console.log('left:');
// console.log(left);
// console.log('right:');
// console.log(right);
// console.log("TOTAL");
// console.log(tot);
// console.log('indices');
// console.log(indices);
// console.log('---------');



//
//
//
//
// var array = [3, 1, 4, 6, 2, 5];
//
//
//
// var sorted = [];
// var right = [];
// var a = array;
// var totalA = a;
//
// var i = 0;
// var j = 1;
//
// var indices = [0, 1];
// update(totalA, indices);
//
// var myInterval = setInterval(function() {
//
//
//
//   //original code
//     if (a[i] > a[j]) {
//       a = a.slice(0, i).concat(a.slice(j, j+1)).concat(a.slice(i, j)).concat(a.slice(j+1));
//       indices = [i, i+1];
//       i++; j++;
//     }
//     else {
//       indices = [i, j];
//       j++; }
//
//
//
//
//
//     totalA = sorted.concat(a);
//     console.log(totalA);
//     console.log(sorted);
//     console.log(a);
//     console.log('-------')
//     update(totalA, [(indices[0] + sorted.length), (indices[1] + sorted.length)]);
//
//
//
//     if (j === a.length) {
//       if (i < 2) {
//         sorted = sorted.concat(a.slice(0, i+1));
//         a = a.slice(i+1);
//         i = 0;
//         j = 1;
//       }
//       else {
//         right.push(i);
//       }
//     }
//
// }, 2750)
//
//
//
// //
// // // - - - - QUICK SORT ALGORITHM - - - -
// // var array = [3, 1, 5, 2, 6, 4];
// //
// // // 3, 1, 5, 2, 6, 4
// // // - left: [] -- the already sorted
// // // - active: [6, 5, 4, 3, 2, 1] --- a
// // // - right: [] -- still to sort
// // // rightindices = []
// //
// // // one sort loop on a
// //
// //
// //
// //
// //
// // var a = array;
// //
// // var swapped = true;
// // var i = 0; // make this one random
// // var j = 1;
// // var indices = [0, 1];
// // update(a, indices);
// //
// // var myInterval = setInterval(function() {
// //   j = i
// //
// //
// //
// //
// //
// //
// //
// //   // console.log(typeof j)
// //   if (typeof j === "undefined" || j === i) { j = i + 1; }
// //   indices = [i, j]
// //   if (a[i] > a[j]) {
// //     console.log(a.slice(0, i), a.slice(j, j+1), a.slice(i, j), a.slice(j+1))
// //     a = a.slice(0, i).concat(a.slice(j, j+1)).concat(a.slice(i, j)).concat(a.slice(j+1));
// //     i++;
// //   }
// //   else {
// //     j++
// //     console.log("j+")
// //    }
// //
// //   // if (a[i] > a[i+1]) {
// //   //   var temp = a[i]; a[i] = a[i+1]; a[i+1] = temp; swapped = true;
// //   // }
// //   // indices = [i, j];
// //   console.log(indices);
// //   update(a, indices);
// //
// //
// //
// //   // if (a.slice(0, i) <)
// //   // if (j < a.length - 1) { j++; }
// //   // else { i++ };
// //   // SLOPPY - making sure no numbers stay red
// //   // if (i > a.length - 1) {
// //   //   clearInterval(myInterval);
// //   //   update(a, [a.length + 1, a.length + 2])
// //   // }
// // }, 3750);
