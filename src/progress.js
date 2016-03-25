/**
 * Created by Bradley on 3/21/16.
 */

var clamp = function (n, min, max) {
    return Math.max(min, Math.min(max, n));
};


var width = 360;
var height = 360;
var radius = Math.min(width, height) / 2;
var donutWidth = 90;

var color = d3.scale.category20b();

var svg = d3.select('#colorado-flag')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

var coloradoArc = d3.svg.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius)
    .startAngle(.65 * Math.PI)
    .endAngle(2.35 * Math.PI);

//Create scale for coloradoArc
var coloradoArcScale = d3.scale.linear()
    .domain([0, 1])
    .range([.65 * Math.PI, 2.35 * Math.PI]);

var innerSunArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(donutWidth)
    .startAngle(0)
    .endAngle(2 * Math.PI);

//Create coloradoArc shaddow
svg.append('path')
    .attr('d', coloradoArc)
    .attr('fill', 'rgb(192, 57, 43)');

//Create innerSun shadow
svg.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 90)
    .attr('fill', 'rgb(243, 156, 18)');

var coloradoC = svg.append('path')
    .attr('d', coloradoArc)
    .attr('fill', 'rgb(231, 76, 60)');  //originally used 'rgb(194, 27, 43)'

var innerSun = svg.append('path')
    .attr('d', innerSunArc)
    .attr('fill', 'rgb(241, 196, 15)');   //originally used 'rgb(255, 217, 0)'



var drawProgress = function(percentTotal, percentSeconds){

    if(isNaN(percentTotal)) {
        return;
    }

    if(isNaN(percentSeconds)) {
        return;
    }

    percentTotal = clamp(parseFloat(percentTotal), 0, 1);
    percentSeconds = clamp(parseFloat(percentSeconds), 0, 1);

    // 360 loops back to 0, so keep it within 0 to < 360
    var angle = clamp(percentSeconds * 360, 0, 359.99999);
    var radians = (angle * Math.PI / 180);

    innerSunArc.endAngle(radians);
    innerSun
        .attr('d', innerSunArc);
    coloradoArc.endAngle(coloradoArcScale(percentTotal));
    coloradoC
        .attr('d', coloradoArc);
};

var max = 1;
var progress = 0.0;

drawProgress(progress);