(function() {
  var svg = d3.select(".buildings").append("svg")
    .attr("width", 100)
    .attr("height", 100)

  var dataset = [];
  var xScale, yScale;



  d3.tsv("buildings.tsv", function(error, data) {
    data.forEach(function(d) {
      dataset.push(d);
    })
    xScale = d3.scale.linear()
      .domain([0, d3.max(dataset, function(d) { return d.Number; })])
      .range([5, 95]);

    yScale = d3.scale.linear()
      .domain([0, d3.max(dataset, function(d) { return d.HeightMT; })])
      .range([95, 5]);

    plotCircles(dataset);
  })

  // console.log(dataset);

  function plotCircles(data) {
    svg.selectAll("circle")
    			   .data(data)
    			   .enter()
    			   .append("circle")
    			   .attr("cx", function(d) {
    			   		return xScale(d.Number);
    			   })
    			   .attr("cy", function(d) {
    			   		return yScale(d.HeightMT);
    			   })
    			   .attr("r", function(d) {
    			   		return 1;
    			   })
             .attr("fill", "steelblue")
            //  .attr();
  }
})();

(function() {
  var svg = d3.select(".richest").append("svg")
    .attr("width", 100)
    .attr("height", 100)

  var dataset = [];
  var xScale, yScale;



  d3.tsv("richest.tsv", function(error, data) {
    data.forEach(function(d) {
      dataset.push(d);
    })
    xScale = d3.scale.linear()
      .domain([0, d3.max(dataset, function(d) {
        return parseInt(d.Rank.split("").slice(1).join(""));
       })])
      .range([5, 95]);

    yScale = d3.scale.linear()
      .domain([0, d3.max(dataset, function(d) {
        return parseFloat(d.NetWorth.split("").slice(1).join(""));
      })])
      .range([95, 5]);

    plotCircles(dataset);
  })

  // console.log(dataset);

  function plotCircles(data) {
    svg.selectAll("circle")
    			   .data(data)
    			   .enter()
    			   .append("circle")
    			   .attr("cx", function(d) {
              //  console.log((parseInt(d.Rank.split("").slice(1).join(""))))

    			   		return xScale(parseInt(d.Rank.split("").slice(1).join("")));
    			   })
    			   .attr("cy", function(d) {
                // console.log(parseFloat(d.NetWorth.split("").slice(1).join("")))
                // console.lo
    			   		return yScale(parseFloat(d.NetWorth.split("").slice(1).join("")));
    			   })
    			   .attr("r", function(d) {
    			   		return 1;
    			   })
             .attr("fill", "orange")
            //  .attr();
  }
})();



(function() {
  var svg = d3.select(".words").append("svg")
    .attr("width", 100)
    .attr("height", 100)

  var dataset = [];
  var xScale, yScale;



  d3.tsv("words.tsv", function(error, data) {
    data.forEach(function(d) {
      dataset.push(d);
    })
    xScale = d3.scale.linear()
      .domain([
        d3.min(dataset, function(d) { return d.Rank; }),
        d3.max(dataset, function(d) { return d.Rank; })])
      .range([5, 95]);

    yScale = d3.scale.linear()
      .domain([
        d3.max(dataset, function(d) { return d.CountPerBillion; }),
        d3.min(dataset, function(d) { return d.CountPerBillion; })])
      .range([95, 5]);

    plotCircles(dataset);
  })

  // console.log(dataset);

  function plotCircles(data) {
    svg.selectAll("circle")
    			   .data(data)
    			   .enter()
    			   .append("circle")
    			   .attr("cx", function(d) {
              //  console.log((parseInt(d.Rank.split("").slice(1).join(""))))

    			   		return xScale(d.Rank);
    			   })
    			   .attr("cy", function(d) {
    			   		return yScale(d.CountPerBillion);
    			   })
    			   .attr("r", function(d) {
    			   		return 1;
    			   })
             .attr("fill", "red")
            //  .attr();
  }
})();




(function() {
  var svg = d3.select(".kanji").append("svg")
    .attr("width", 100)
    .attr("height", 100)

  var dataset = [];
  var xScale, yScale;


  d3.tsv("kanji.tsv", function(error, data) {
    data.forEach(function(d) {
      dataset.push(d);
    })
    xScale = d3.scale.linear()
      .domain([
        d3.min(dataset, function(d) { return d.Rank; }),
        d3.max(dataset, function(d) { return d.Rank; })])
      .range([5, 95]);
    yScale = d3.scale.linear()
      .domain([dataset[dataset.length-1].Frequency, dataset[0].Frequency])
      .range([95, 5]);
    plotCircles(dataset);
  })

  // console.log(dataset);

  function plotCircles(data) {
    svg.selectAll("circle")
    			   .data(data)
    			   .enter()
    			   .append("circle")
    			   .attr("cx", function(d) {
    			   		return xScale(d.Rank);
    			   })
    			   .attr("cy", function(d) {
    			   		return yScale(d.Frequency);
    			   })
    			   .attr("r", function(d) {
    			   		return 1;
    			   })
             .attr("fill", "grey")
            //  .attr();
  }
})();
