function myGraph() {

    // Add and remove elements on the graph object
    this.addNode = function (id, name) {
      if (isNew(id, name)) {
        nodes.push({"id": id, "name": name});
        update();
      }
    };

    this.addClicked = function(id) {
      findNode(id).clicked = true;
    }

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

    this.removeAllLinks = function () {
        links.splice(0, links.length);
        update();
    };

    this.removeAllButMainLinks = function () {
        // links.splice(0, links.length);
        // update();
    };

    this.removeAllNodes = function () {
      nodes.splice(0, links.length);
        update();
    };

    this.removeAllButClicked = function () {
      var i = nodes.length - 1;
      var id, j;
      while (i >= 0) {
        id = nodes[i].id;
        if (!nodes[i].clicked) {
          j = 0;
          while (j < links.length) {
            console.log(id, links[j])
            if (links[j]['source'].id == id || links[j]['target'].id == id) {
              console.log('links removed')
              links.splice(j, 1)
            }
            j++;
          }
          nodes.splice(i, 1)
        }
        i--
      }
      update();
    };

    this.addLink = function (source, target, value) {
        links.push({"source": findNode(source), "target": findNode(target), "value": value});
        update();
    };

    this.nodes = function() { return nodes; }
    this.links = function() { return links; }

    var findNode = function (id) {
        for (var i in nodes) {
            if (nodes[i]["id"] === id) return nodes[i];
        }
        ;
    };

    var isNew = function (id, name) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id == id && nodes[i].name == name) {
          return false;
        }
      }
      return true;
    }

    var findNodeIndex = function (id) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id == id) { return i; }
        }
        ;
    };

    // set up the D3 visualisation in the specified element
    var w = 960,
            h = 650;

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
                .on("click", function(d) { plot(d) });
                //
                // .call(force.drag);

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
                    return d.name;
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
                .gravity(1.6)
                .charge(-1300)
                // .friction(.1)
                .linkDistance( function(d) { return d.value * 10 } )
                .size([w, h])
                .start();
    };

    // Make it all go
    update();
}

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
var graph = new myGraph("#svgdiv");
var currentArtist;

function getInfo(artistId, callback) {
  $.ajax({
          type : 'POST',
          url : 'https://ws.audioscrobbler.com/2.0/',
          data : 'method=artist.getInfo&' +
                 'mbid=' + artistId + '&' +
                 'api_key=ee45ef94fff5729caec4b77319d3b316&' +
                 'format=json',
          dataType : 'jsonp',
          success : function(data) { callback(data); },
          error : function(code, message){
              $('#error').html('Error Code: ' + code + ', Error Message: ' + message);
          }
      });
}

function getSimilar(artistId, callback) {
  $.ajax({
          type : 'POST',
          url : 'https://ws.audioscrobbler.com/2.0/',
          data : 'method=artist.getSimilar&' +
                 'mbid=' + artistId + '&' +
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
      getSimilar(element.id, function(data) {
        d3.select("#cloud").html("");
        data.similarartists.artist.forEach(plotArtist)
      })
  })
}

getInfo("b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d", function(data) {
  currentArtist = data.artist;
  graph.addNode(currentArtist.mbid, currentArtist.name);
  $('#artistInfo').html(
    data.artist.name +
    " | " +
    data.artist.bio.summary.split("").splice(0, 40).join("") +
    " ..."
  );
});

getSimilar("b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d", function(data) {
  d3.select("#cloud").html("");
  data.similarartists.artist.forEach(plotArtist)
});


function plot(d) {
  getInfo(d.id, function(data){
    currentArtist = data.artist;
    $('#artistInfo').html(
      data.artist.name +
      " | " +
      data.artist.bio.summary.split("").splice(0, 40).join("") +
      " ..."
    );
  })

  graph.addClicked(d.id);
  graph.removeAllButClicked();

  getSimilar(d.id, function(data) {
    data.similarartists.artist.forEach(function(artist) {
      graph.addNode(artist.mbid, artist.name);
      graph.addLink(d.id, artist.mbid, 10)
      keepNodesOnTop();
    })
  })
}
