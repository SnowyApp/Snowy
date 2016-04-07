/**
 * Okay, so these comments will work a little bit like a small tutorial for how
 * d3 works and why the code looks like it does. The way you "inject" a D3
 * diagram is basically the same for all different types and this will show
 * how to create a tree-structure.
 */

/**
 * Emil or Carl will comment here because I have no idea why this is needed.
 * @type {{}}
 */
var d3Chart = module.exports = {};

/**
 * These var:s are in order a index i that will give each node in our tree a
 * unique ID. The tree var is where we will store the info of the tree. It
 * will become kind of like an object.
 * @type {number}
 */
var i = 0;
var tree;

var NODE_WIDTH = 100;
var NODE_HEIGHT = 50;

/**
 * This will be used to "inject" an SVG-element to our webpage that you can
 * already do with
 * <svg attr1 = "..." attr2 = "..."/>
 *      .
 *      .
 *      .
 * </svg>
 *
 * Again, Carl or Emil will comment what the input is for.
 * @param element
 * @param props
 * @param state
 */
d3Chart.create = function(element, props, state) {
    /**
     * So this code right here just append an SVG element to the page that
     * looks like this
     * <svg class = d3 width = props.width height = props.height>
     *     .
     *     .
     *     .
     * </svg>
     *
     * It just is a different way of writing, it is the D3-way!
     */
    var svg = d3.select(element).append("svg")
        .attr("class", "d3")

    /**
     * To add more than one Shape or text element to the SVG-element you have
     * to put them in a g-element. We give this one the class nodes
     *
     * <svg class = d3 width = props.width height = props.height>
     *      <g class = nodes/>
     *      </g>
     * </svg>
     */
    svg.append("g")
        .attr("class", "nodes");

    /**
     * The tree variable will now grow and sprout to a real tree-object with
     * the help of d3.layout.tree() and we give it a maximum size aswell.
     * That way it will automatically space out the nodes and layers
     * depending of how many nodes and layers we have, neat.
     */
    tree = d3.layout.tree().size([props.height, props.width]);

    /**
     * I think this is necessary for the D3 to play along with REACT.
     */
    this.update(element, state);
};

/**
 * Called when we want to redraw the tree
 * @param element
 * @param state
 */
d3Chart.update = function(element, state) {
    // recalculate scales
    var scales = this._scales(element, state.domain);
    this._drawPoints(element, scales, state.data);
};

d3Chart.destroy = function(element) {
    // Clean-up
};
/**
 * This will set some scaling according to the sizes of the element
 * @param element
 * @param domain
 * @returns {*}
 * @private
 */
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
/**
 * This functions adds the nodes and the lines between the nodes and styles
 * them in the way we want.
 * @param element
 * @param scales
 * @param data
 * @private
 */
d3Chart._drawPoints = function(element, scales, data) {
    /**
     * The root will contain the first datapoint in the array data, we will
     * later tell the tree to start drawing from here
     */
    var root = data[0];
    /**
     * I don't think this g element is necessary actually but I don't want
     * to remove it now and change the some line since I am too lazy to test it.
     */
    var g = d3.select(element).selectAll(".nodes");

    /**
     * nodes and links will become arrays which contains the data for all
     * the nodes and positions for the links (lines) between them.
     * @type {*|Array.<T>}
     */
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    /**
     * This manually sets the distance between the nodes
     */
    nodes.forEach(function(d) { d.y = d.depth*100 });

    /**
     * Declares a node to the g element or var that we created. I think this
     * part can be skipped. But it also gives every node a unique id, which
     * is nice.
     */
    var node = g.selectAll(".node")
        .data(nodes, function(d) { return d.id || (d.id = ++i) });

    /**
     * "Enters" the nodes by creating a new g-element inside the bigger
     * g-element because we want a node to have a rect and text element.
     * Remember that with SVG you have to use a g-element to combine two or
     * more elements.
     *
     * This codes generates this for every node
     * <g class = node transform = translate(d.x,d.y)>
     *     rectangle and text go here...
     * </g>
     */
    var nodeEnter = node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + ", " + d.y + ")";
        });
    /**
     * Now we add a rectangle element and use conditional expressions to
     * style them. The ry and rx elements are used to give the eclipse shape
     * to an ATTRIBUTE concept and the fill color is decided on which
     * concept the node is. So this is created for an ATTRIBUTE
     *
     * < rect class = node width = 20 height = 10 ry = 10px rx = 1px
     *   style="fill:#FFFFCC;stroke:black" />
     */
    nodeEnter.append("rect")
        .attr("class", "node")
        .attr('width', NODE_WIDTH)
        .attr('height', NODE_HEIGHT)
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
        .style('stroke','black');
    /**
     * This adds a text element to the same g element as the rectangle. The
     * current position has a few magic numbers now because there isn't any
     * great way to position text automatically inside a rectangle with SVG.
     *
     * Anyway, we get this
     * < text y = -18||18 dy = .35em text-anchor = middle style=fill-opacity:1>
     *     d.text
     * </text>
     *
     */
    nodeEnter.append("text")
        .attr("y", NODE_HEIGHT/2)
        .attr("x", NODE_WIDTH/2)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1);

    /**
     * Creates link which will be an array of objects with class line.link
     * and contain all the links generated and the unique id it has been given
     */
    var link = g.selectAll("line.link")
        .data(links, function(d) { return d.target.id; });
    /**
    * "Enters" the nodes by creating a new g-element inside the bigger
    * g-element same as the nodes
    *
    * This codes generates this for every link
    * <g>
    *   <line class = link x1 = d.source.x + 10 y1 = d.source.y + 10 x2 =
    *   d.source.x + 10 y2 = d.source.y + 5>
    * </g>
    */
    link.enter().insert("line", "g")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x + NODE_WIDTH/2; })
        .attr("y1", function(d) { return d.source.y + NODE_HEIGHT; })
        .attr("x2", function(d) { return d.target.x + NODE_WIDTH/2; })
        .attr("y2", function(d) { return d.target.y + 0; });

    node.exit().remove();
};
