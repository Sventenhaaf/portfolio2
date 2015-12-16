(function () {

  var
    ID_TRIG = '#trig',
    X1      = 'x1',
    X2      = 'x2',
    Y1      = 'y1',
    Y2      = 'y2';

  var
    data    = [],
    width   = 760,
    height  = 260,
    xmin    = -1.2,
    xmax    = 5,
    ymin    = -height * (xmax - xmin) / width / 2,
    ymax    = -ymin,
    xScale  = d3.scale.linear(),
    yScale  = d3.scale.linear(),
    vis     = d3.select(ID_TRIG).append('svg:svg'),
    graph   = vis.append('svg:g'),
    path    = graph.append('svg:path'),
    sine    = d3.svg.line(),
    time    = 0,
    i;

  for (i = 0; i < 84; i++) {
    data.push(i * 10 / 84);
  }
  xScale
    .domain([xmin, xmax])
    .range([0, width]);

  yScale
    .domain([ymin, ymax])
    .range([0, height]);

  vis
    .attr('class', 'trig')
    .attr('width', width)
    .attr('height', height);

  sine
    .x(function (d, i) { return xScale(d); })
    .y(function (d, i) { return yScale(Math.sin(d - time)); });

  function draw() {
    path
      .attr('d', sine(data));
      console.log(sine(data));
    time += .015;
    // console.log(data[data.length - 1]);

    setTimeout(draw, 35);
  }
  draw();

})();


// - - - - - - - - -

var time = 0;



//The data for our line
 var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
                  { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
                  { "x": 80,  "y": 5},  { "x": 100, "y": 60}];

 //This is the accessor function we talked about above
 var lineFunction = d3.svg.line()
                          .x(function(d) { return d.x * time; })
                          .y(function(d) { return d.y * time; })
                         .interpolate("linear");

//The SVG Container
var svgContainer = d3.select("body").append("svg")
                                    .attr("width", 200)
                                    .attr("height", 200);

//The line SVG Path we draw
var lineGraph = svgContainer.append("path");

lineGraph
                            .attr("d", lineFunction(lineData))
                            .attr("stroke", "blue")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");

                            function ddd() {
                              lineGraph
                                .attr('d', lineFunction(lineData));
                              time += .015;

                              setTimeout(ddd, 35);
                            }
                            ddd();
