var us = d3.json('https://unpkg.com/us-atlas@1/us/10m.json');
var covid = d3.csv('../data/time_series_covid19_confirmed_US.csv');

var width = 1080;
var height = 900;

var svg = d3.select("svg")
              .attr("width", width)
              .attr("height", height);

var projection = d3.geoAlbersUsa().translate([width/2, height/2]).scale(1280);
var path = d3.geoPath();

Promise.all([us, covid])
  .then(function (values) {
    console.log(values);
    var map = values[0];

    var covidData = values[1];
    console.log("covidData", covidData);
    var stateFeatures = topojson.feature(map, map.objects.states).features;
    console.log(stateFeatures);
    var neighbors = topojson.neighbors(map.objects.states.geometries);
    // console.log(neighbors);

    // [[long, lat]]
    var coordinates = covidData.map(entry => [entry.Long_, entry.Lat]);

    svg.selectAll("states")
        .data(stateFeatures)
        .enter()
        .insert("path", ".graticule")
          .attr("class", "states")
          .attr("d", path)
            .attr("transform", `translate(${0},${0})`)
        .on('mouseover', function(d, i) {
          var currentState = this;
          d3.select(this)
              .style('fill-opacity', 1);
        })
        .on('mouseout', function(d, i) {
            var currentState = this;
            d3.select(this)
                .style('fill-opacity', .7);
        });

    svg.selectAll("circle")
        .data(coordinates.filter(coordinate => projection(coordinate) !== null))
        .enter()
        .append("circle")
        // .attr("class", "circles")
          .attr("r", 2)
          .attr("cx", function(d) { return projection(d)[0]; })
          .attr("cy", function(d) { return projection(d)[1]; });

  });
