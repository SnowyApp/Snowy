var d3Chart = module.exports = {};

d3Chart.create = function(element, props, state) {
    // create svg element
    var svg = d3.select(element).append("svg")
        .attr("class", "d3")
        .attr("width", props.width)
        .attr("height", props.height);

    svg.append("g")
        .attr("class", "d3-points");

    this.update(element, state);
};

d3Chart.update = function(element, state) {
    // recalculate scales
    var scales = this._scales(element, state.domain);
    this._drawPoints(element, scales, state.data);
};

d3Chart.destroy = function(element) {
    // Clean-up
};

d3Chart._scales = function(element, domain) {
    if (!domain) {
        return null;
    }

    var width = element.offsetWidth;
    var height = element.offsetHeight;

    var x = d3.scale.linear()
        .range([0, width])
        .domain(domain.x);

    var y = d3.scale.linear()
        .range([height, 0])
        .domain(domain.y);

    var z = d3.scale.linear()
        .range([5, 20])
        .domain([1, 10]);

    return {x: x, y: y, z: z};
};

d3Chart._drawPoints = function(element, scales, data) {
    var g = d3.select(element).selectAll(".d3-points");

    var point = g.selectAll(".d3-point") // d3-points?
        .data(data, function(d) { return d.id; });

    // ENTER
    point.enter().append('circle')
        .attr('class', 'd3-point');

    // ENTER & UPDATE
    point.attr('cx', function(d) { return scales.x(d.x); })
        .attr('cy', function(d) { return scales.y(d.y); })
        .attr('r', function(d) { return scales.z(d.z); });

    // EXIT
    point.exit().remove();
};
