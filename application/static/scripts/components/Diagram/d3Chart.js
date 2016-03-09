var d3Chart = module.exports = {};

var i = 0;
var tree;

d3Chart.create = function(element, props, state) {
    // create svg element
    var svg = d3.select(element).append("svg")
        .attr("class", "d3")
        .attr("width", props.width)
        .attr("height", props.height);

    svg.append("g")
        .attr("class", "nodes");

    tree = d3.layout.tree().size([state.domain.height, state.domain.width]);

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
    var g = d3.select(element).selectAll(".nodes");

    // compute tree layout
    var nodes = tree.nodes(data[0]).reverse(),
        links = tree.links(nodes);

    // normalize for fixed-depth
    nodes.forEach(function(d) { d.y = d.depth*100 });

    // declare the node
    var node = g.selectAll(".node")
        .data(nodes, function(d) { return d.id || (d.id = ++i) });

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + ", " + d.y + ")";
        });

    nodeEnter.append("rect")
        .attr("class", "node")
        .attr('width', 20)
        .attr('height', 10)
        .attr('ry', function(d) {
            return  d.expression == "attribute" ? '10px' : '0';
        })
        .attr('rx', function(d) {
            return  d.expression == "attribute" ? '1px' : '0';
        })
        .style("fill", function(d) {
            if (d.expression == "concept") {
                return "#99CCFF";
            } else if (d.expression == "defined-concept") {
                return "#CCCCFF";
            } else if (d.expression == "attribute") {
                return "#FFFFCC"
            } else {
                return "black"}
            }
        )
        .style('stroke','black')

    nodeEnter.append("text")
        .attr("y", function(d) {
            return d.children || d._children ? -18 : 18; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1);

    // Declare the links…
    var link = g.selectAll("line.link")
        .data(links, function(d) { return d.target.id; });

    // Enter the links.
    link.enter().insert("line", "g")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x + 10; })
        .attr("y1", function(d) { return d.source.y + 10; })
        .attr("x2", function(d) { return d.target.x + 10; })
        .attr("y2", function(d) { return d.target.y + 5; });

    // EXIT
    node.exit().remove();
};
