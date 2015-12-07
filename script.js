var bandMates =
[
   {  "name":"John", "songs":302 },
   {  "name":"Paul", "songs":300 },
   {  "name":"George", "songs":231},
   {  "name":"Pete", "songs":12 }
];


function draw(){
	var content = d3.select("body").selectAll("div.member")
        .data(bandMates, function(d){return d.name;});
  content.order();

  var contentEnter = content.enter()
    	.append("div")
	    .classed("member",true);

  contentEnter
      .append("div")
      .text(function(d) { return d.name; });


  contentEnter
      .append("div")
      .text(function(d) { return "wrote " + d.songs + " songs!"; });

  content.exit().remove();

}

draw();

setTimeout(function() {
    bandMates = [
       {  "name":"Paul", "songs":300 },
       {  "name":"John", "songs":302 },
       {  "name":"George", "songs":231},
       {  "name":"Ringo", "songs":131 }
    ];
    draw();
}, 2000);


// var w = 500;
// var h = 150;
//
// var dataset = [1, 2, 3, 4, 5, 6];
//
//
// var svg = d3.select("body")
//   .append("svg")
//   .attr("width", w)
//   .attr("height", h);
//
//
//
//
// function swap() {
//
//
//   var text = svg.selectAll("text")
//     .data(dataset)
//   text.enter()
//     .append("text")
//     .text(function(d) { return d; })
//     .style("font", "bold 48px monospace")
//     .attr("x", function(d, i) { return i * 36; })
//     .attr("y", 50)
//
//
//
//
//   var indices = [2, 4];
//   text.order();
//   text.exit().remove();
//   text.style("fill", function(d, i) {
//     return indices.indexOf(i) > -1 ? "red" : "#aaa";
//   });
//   text.transition()
//     .attr("y", function(d, i) { return indices.indexOf(i) > -1 ? 100 : 50; })
//     .transition()
//     .attr("x", function(d, i) {
//       if (indices.indexOf(i) > -1) {
//         return indices.indexOf(i) === 0 ? indices[1] * 36 : indices[0] * 36;
//       }
//       else return i * 36;
//     })
//     .transition()
//     .attr("y", 50)
//
//     var news = d3.selectAll('text')
//       .data(dataset)
//       .order()
//       .exit()
//       .transition()
//       .delay(2000)
//       .remove();
//
//   console.log(news);
// }
//
//
// swap();
//
// var i = 0;
//
// setInterval(function() {
//   if (i % 2 === 0) {dataset = [1, 2, 5, 4, 3, 6]; }
//   else { dataset = []; };
//   swap();
//   i++;
// }, 4000);
