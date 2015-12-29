var graph;
    function myGraph() {

        // Add and remove elements on the graph object
        this.addNode = function (id) {
            nodes.push({"id": id});
            update();
        };

        this.removeNode = function (id) {
            var i = 0;
            var n = findNode(id);
            while (i < links.length) {
                if ((links[i]['source'] == n) || (links[i]['target'] == n)) {
                    links.splice(i, 1);
                }
                else i++;
            }
            nodes.splice(findNodeIndex(id), 1);
            update();
        };

        this.removeLink = function (source, target) {
            for (var i = 0; i < links.length; i++) {
                if (links[i].source.id == source && links[i].target.id == target) {
                    links.splice(i, 1);
                    break;
                }
            }
            update();
        };

        this.removeallLinks = function () {
            links.splice(0, links.length);
            update();
        };

        this.removeAllNodes = function () {
            nodes.splice(0, links.length);
            update();
        };

        this.addLink = function (source, target, value) {
            links.push({"source": findNode(source), "target": findNode(target), "value": value});
            update();
        };

        var findNode = function (id) {
            for (var i in nodes) {
                if (nodes[i]["id"] === id) return nodes[i];
            }
            ;
        };

        var findNodeIndex = function (id) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id == id) {
                    return i;
                }
            }
            ;
        };

        // set up the D3 visualisation in the specified element
        var w = 960,
                h = 450;

        var color = d3.scale.category10();

        var vis = d3.select("#testartist")
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                .attr("id", "svg")
                .attr("pointer-events", "all")
                .attr("viewBox", "0 0 " + w + " " + h)
                .attr("perserveAspectRatio", "xMinYMid")
                .append('svg:g');

        var force = d3.layout.force();

        var nodes = force.nodes(),
                links = force.links();

        var update = function () {
            var link = vis.selectAll("line")
                    .data(links, function (d) {
                        return d.source.id + "-" + d.target.id;
                    });

            link.enter().append("line")
                    .attr("id", function (d) {
                        return d.source.id + "-" + d.target.id;
                    })
                    .attr("stroke-width", function (d) {
                        return d.value / 10;
                    })
                    .attr("class", "link");
            link.append("title")
                    .text(function (d) {
                        return d.value;
                    });
            link.exit().remove();

            var node = vis.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id;
                    });

            var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .call(force.drag);

            nodeEnter.append("svg:circle")
                    .attr("r", 12)
                    .attr("id", function (d) {
                        return "Node;" + d.id;
                    })
                    .attr("class", "nodeStrokeClass")
                    .attr("fill", function(d) { return color(d.id); });

            nodeEnter.append("svg:text")
                    .attr("class", "textClass")
                    .attr("x", 14)
                    .attr("y", ".31em")
                    .style("stroke", "black")
                    .style("stroke-width", ".5")
                    .text(function (d) {
                        return d.id;
                    });

            node.exit().remove();

            force.on("tick", function () {

                node.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

                link.attr("x1", function (d) {
                    return d.source.x;
                })
                        .attr("y1", function (d) {
                            return d.source.y;
                        })
                        .attr("x2", function (d) {
                            return d.target.x;
                        })
                        .attr("y2", function (d) {
                            return d.target.y;
                        });
            });

            // Restart the force layout.
            force
                    .gravity(.01)
                    .charge(-80000)
                    .friction(0)
                    .linkDistance( function(d) { return d.value * 10 } )
                    .size([w, h])
                    .start();
        };

        // Make it all go
        update();
    }

    function drawGraph() {

        graph = new myGraph("#svgdiv");


        graph.addNode('Sophia');
        graph.addNode('Daniel');
        graph.addNode('Ryan');
        graph.addLink('Sophia', 'Ryan', '20');
        graph.addLink('Daniel', 'Ryan', '20');
        keepNodesOnTop();
    }

    drawGraph();

    // because of the way the network is created, nodes are created first, and links second,
    // so the lines were on top of the nodes, this just reorders the DOM to put the svg:g on top
    function keepNodesOnTop() {
        $(".nodeStrokeClass").each(function( index ) {
            var gnode = this.parentNode;
            gnode.parentNode.appendChild(gnode);
        });
    }
    function addNodes() {
        d3.select("svg")
                .remove();
         drawGraph();
    }








// API code
function getInfo(artist, callback) {
  $.ajax({
          type : 'POST',
          url : 'https://ws.audioscrobbler.com/2.0/',
          data : 'method=artist.getInfo&' +
                 'artist=' + artist + '&' +
                 'api_key=ee45ef94fff5729caec4b77319d3b316&' +
                 'format=json',
          dataType : 'jsonp',
          success : function(data) { callback(data); },
          error : function(code, message){
              $('#error').html('Error Code: ' + code + ', Error Message: ' + message);
          }
      });
}

function getSimilar(artist, callback) {
  $.ajax({
          type : 'POST',
          url : 'https://ws.audioscrobbler.com/2.0/',
          data : 'method=artist.getSimilar&' +
                 'artist=' + artist + '&' +
                 'limit=20&' +
                 'api_key=ee45ef94fff5729caec4b77319d3b316&' +
                 'format=json',
          dataType : 'jsonp',
          success : function(data) { callback(data); },
          error : function(code, message){
              $('#error').html('Error Code: ' + code + ', Error Message: ' + message);
          }
      });
}

function plotArtist(element, index) {
  d3.select("#cloud")
    .append("p")
    .html(element.name)
    .on("click", function() {
      getSimilar(element.name, function(data) {
        d3.select("#cloud").html("");

        data.similarartists.artist.forEach(plotArtist)
      })
      console.log(element.name); })
}

getInfo("The+Beatles", function(data) {
  $('#artistInfo').html(
    data.artist.name +
    " | " +
    data.artist.bio.summary.split("").splice(0, 40).join("") +
    " ..."
  );
});

getSimilar("The+Beatles", function(data) {
  d3.select("#cloud").html("");
  data.similarartists.artist.forEach(plotArtist)
});


function plot() {
  getSimilar("The+Beatles", function(data) {
    console.log(data);
  })
}


// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---
// ==========
// ---















// OLD CODE

//
// var currentArtist;
//
// // setup
// var width = 960,
//     height = 500;
// var nodes = [];
// var links = [];
//
// var force = d3.layout.force()
//   .nodes(nodes)
//   .links(links)
//   .charge(-400)
//   .linkDistance(120)
//   .size([width, height])
//   .on("tick", tick);
//
// var svg = d3.select("#testartist").append("svg")
//   .attr("width", width)
//   .attr("height", height);
//
// var node = svg.selectAll(".node"),
//     link = svg.selectAll(".link");
//
// function addNode(id) {
//   nodes.push({ "id": id });
//   update();
// }
//
// addNodesLinks();
//
// function start() {
//   link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
//   link.enter().insert("line", ".node").attr("class", "link");
//   link.exit().remove();
//
//   node = node.data(force.nodes(), function(d) { return d.id;});
//   node.enter().append("circle").attr("class", function(d) { return "node " + d.id; }).attr("r", 8);
//   node.exit().remove();
//
//   force.start();
// }
//
// function tick() {
//   node.attr("cx", function(d) { return d.x; })
//       .attr("cy", function(d) { return d.y; })
//
//   link.attr("x1", function(d) { return d.source.x; })
//       .attr("y1", function(d) { return d.source.y; })
//       .attr("x2", function(d) { return d.target.x; })
//       .attr("y2", function(d) { return d.target.y; });
// }



//===
//====
//===
//====
//===
//====
//===
//====
//===
//====
//===
//====
//===
//====
//===
//====
//===
//====
//===
//====
//===
//====
//===
//====
//===
//====

// OLDER CODE

//
//
// // code
// var svg = d3.select('#testartist').append('svg')
//     .attr('width', width)
//     .attr('height', height);
// var force = d3.layout.force()
//     .size([width, height])
//     .nodes(nodes)
//     .links(links);
// force.linkDistance(20);
//
// force.charge(-3000);
//
// // draw links
// var link = svg.selectAll('.link')
//     .data(links)
//     .enter().append('line')
//     .attr('class', 'link');
//
// // draw nodes
// var node = svg.selectAll('.node')
//     .data(nodes)
//     .enter().append('circle')
//     .attr('class', 'node');
//
//
// function updateNodes() {
//
//   // update
//   node.attr('r', width/50)
//       .attr('cx', function(d) { return d.x; })
//       .attr('cy', function(d) { return d.y; })
//       .style("fill", function(d) { if (d.num === 1) return "steelblue"; })
//   link.attr('x1', function(d) { return d.source.x; })
//       .attr('y1', function(d) { return d.source.y; })
//       .attr('x2', function(d) { return d.target.x; })
//       .attr('y2', function(d) { return d.target.y; });
// }
//
// force.on('tick', function() {
//     updateNodes();
// });
//
// force.start();
//
//
//
//
//
