/**
 * Created by Bradley on 3/21/16.
 */

var clamp = function (n, min, max) {
    return Math.max(min, Math.min(max, n));
};

//Todo: move most of code out of function
//Todo: convert clock percent to radians
//Todo: drawProgress updates .endAngle to radians

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

var arc = d3.svg.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius)
    .startAngle(.65 * Math.PI)
    .endAngle(2.35 * Math.PI);

var innerArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(donutWidth)
    .startAngle(0 * Math.PI)
    .endAngle(1.5 * Math.PI);

var coloradoC = svg.append('path')
    .attr('d', arc)
    .attr('fill', 'rgb(194, 27, 43)');

/*svg.append('circle')
 .attr('cx', 0)
 .attr('cy', 0)
 .attr('r', 90)
 .attr('fill', 'rgb(255, 235, 102)');*/

var innerSun = svg.append('path')
    .attr('d', innerArc)
    .attr('fill', 'rgb(255, 217, 0');

var drawProgress = function(percent){

    if(isNaN(percent)) {
        return;
    }

    percent = clamp(parseFloat(percent), 0, 1);

    // 360 loops back to 0, so keep it within 0 to < 360
    var angle = clamp(percent * 360, 0, 359.99999);
    var radians = (angle * Math.PI / 180);

    innerArc.endAngle(radians);
    innerSun.attr('d', innerArc);
};

var max = 1;
var progress = 0.0;

drawProgress(progress);