var currentArtist;





// force layout code

// setup
var width = 640,
    height = 480;
var nodes = [   { num: 1 },
                { num: 2 },
                { num: 3 },
                { num: 4 },
                { num: 5 },
                { num: 6 },
                { num: 7 },
                { num: 8 },
                { num: 9 },
                { num: 10 },
                { num: 11 },
                { num: 12 },
                { num: 13 },
                { num: 14 },
                { num: 15 },
                { num: 16 },
                { num: 17 }
            ];
var links = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 0, target: 3 },
    { source: 0, target: 4 },
    { source: 0, target: 5 },
    { source: 0, target: 6 },
    { source: 0, target: 7 },
    { source: 0, target: 8 },
    { source: 0, target: 9 },
    { source: 1, target: 8},
    { source: 1, target: 9},
    { source: 1, target: 10},
    { source: 1, target: 11},
    { source: 1, target: 12},
    { source: 1, target: 13},
    { source: 1, target: 14},
    { source: 1, target: 15},
    { source: 1, target: 16},
];
// code
var svg = d3.select('#testartist').append('svg')
    .attr('width', width)
    .attr('height', height);
var force = d3.layout.force()
    .size([width, height])
    .nodes(nodes)
    .links(links);
force.linkDistance(20);

force.charge(-3000);

// draw links
var link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'link');

// draw nodes
var node = svg.selectAll('.node')
    .data(nodes)
    .enter().append('circle')
    .attr('class', 'node');


function updateNodes() {

  // update
  node.attr('r', width/50)
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; })
      .style("fill", function(d) { if (d.num === 1) return "steelblue"; })
  link.attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });
}

force.on('tick', function() {
    updateNodes();
});

force.start();






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
    data.similarartists.artist.forEach(function(artist) {
      nodes.push(artist);
    })
  })
  console.log('red square pushed');
  console.log(nodes);
  force.on('tick', function() {
      updateNodes();
  });
  force.start();
}


// replace the beatles with clicked artist
