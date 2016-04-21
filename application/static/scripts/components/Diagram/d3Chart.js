/**
 * These comments will work a little bit like a small tutorial for how
 * d3 works and why the code looks like it does. The way you "inject" a D3
 * diagram is basically the same for all different types and this will show
 * how to create a tree-structure.
 */

var d3Chart = module.exports = {};

var contextMenu = require('./d3-context-menu');

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

// context menu

var menuData = [
    {
        title: 'Remove Node',
        action: function(elm, d, i) {
            if (d.parent && d.parent.children !== undefined) {

                // find child and remove it
                for (var ii = 0; ii < d.parent.children.length; ii++) {
                    if (d.parent.children[ii].name === d.name) {
                        d.parent.children.splice(ii, 1);
                        break;
                    }
                }
            }
            d3Chart._drawTree(d);
        }
    },
    {
        title: 'Hide/show children',
        action: function(elm, d){
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            d3Chart._drawTree(d);
        }
    },
    {
        title: 'Hide Siblings',
        action: function(elm, d){
            if(d.parent != "null") {
                var tempChild = [];
                tempChild.push(d);
                d.parent._children = d.parent.children;
                d.parent.children = tempChild;
                d3Chart._drawTree(d);
            }
        }
    },
    {
        title: 'Show siblings',
        action: function(elm, d){
            if(d.parent != "null" && d.parent._children){
                d.parent.children = d.parent._children;
                d.parent._children = null;
                d3Chart._drawTree(d);
            }
        }
    }
];

/**
 * These var:s are in order a index i that will give each node in our tree a
 * unique ID. The tree var is where we will store the info of the tree. It
 * will become kind of like an object.
 */
var i = 0;
var tree,root,treeState, svg,g,onClick;

const NODE_WIDTH = 100;
const NODE_HEIGHT = 50;
const WIDTH_MARGIN = 500;

const DURATION = 750;

/**
 * This will be used to "inject" an SVG-element to our webpage that you can
 * already do with
 * <svg attr1 = "..." attr2 = "..."/>
 *      .
 *      .
 *      .
 * </svg>
 */

d3Chart.create = function(element, props, state) {
    root = state.data[0];
    treeState = state.view;
    onClick = props.onClick;

    /**
     * Sets the variable zoom to the function zoomed. scaleExtent sets
     * minimum and maximum values for zooming.
     */
    var zoom = d3.behavior.zoom()
        .on("zoom", zoomed);


    /**
     * We append an SVG element to the page and set it's class to d3.
     * Width and height must be 100% so that it resizes with the browser.
     * <svg class = d3 width = 100% height = 1005>
     *     .
     *     .
     *     .
     * </svg>
     */
    svg = d3.select(element).append("svg")
        .attr("class", "d3")
        .attr({
            'xmlns': 'http://www.w3.org/2000/svg',
            'xlink': 'http://www.w3.org/1999/xlink',
            version: '1.1'
        })
        .call(zoom).on("dblclick.zoom", null);

    /**
     * To add more than one Shape or text element to the SVG-element you have
     * to put them in a g-element. We give this one the class diagram
     *
     * <svg class = d3 width = props.width height = props.height>
     *      <g class = diagram/>
     *      </g>
     * </svg>
     */
    g = svg.append("g")
        .attr("class", "nodes");

    function zoomed() {
        g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    /**
     * The tree variable will now grow and sprout to a real tree-object with
     * the help of d3.layout.tree() and we give it a maximum size aswell.
     * That way it will automatically space out the nodes and layers
     * depending of how many nodes and layers we have, neat.
     */

    tree = d3.layout.tree()
        .sort(function(a,b){return d3.ascending(a.name,b.name)});

    if(state.view == 'vertical'){
        tree.nodeSize([NODE_HEIGHT/2, NODE_WIDTH/2])
    } else {
        tree.size([500, 960])
    }

    this._drawTree(root);
};

d3Chart.createHorizontal = function(element, props, state){
    root = state.data[0];
    onClick = props.onClick;

    /**
     * Sets the variable zoom to the function zoomed. scaleExtent sets
     * minimum and maximum values for zooming.
     */
    var zoom = d3.behavior.zoom()
        .on("zoom", zoomed);


    /**
     * We append an SVG element to the page and set it's class to d3.
     * Width and height must be 100% so that it resizes with the browser.
     * <svg class = d3 width = 100% height = 1005>
     *     .
     *     .
     *     .
     * </svg>
     */
    svg = d3.select(element).append("svg")
        .attr("class", "d3")
        .attr({
            'xmlns': 'http://www.w3.org/2000/svg',
            'xlink': 'http://www.w3.org/1999/xlink',
            version: '1.1'
        })
        .call(zoom).on("dblclick.zoom", null);

    /**
     * To add more than one Shape or text element to the SVG-element you have
     * to put them in a g-element. We give this one the class diagram
     *
     * <svg class = d3 width = props.width height = props.height>
     *      <g class = diagram/>
     *      </g>
     * </svg>
     */
    g = svg.append("g")
        .attr("class", "nodes");

    function zoomed() {
        g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    /**
     * The tree variable will now grow and sprout to a real tree-object with
     * the help of d3.layout.tree() and we give it a maximum size aswell.
     * That way it will automatically space out the nodes and layers
     * depending of how many nodes and layers we have, neat.
     */
    tree = d3.layout.tree()
        .sort(function(a,b){return d3.ascending(a.name,b.name)});
    this._drawHorizontal(root);
};

/**
 * Reset the chart to state.
 */
d3Chart.reset = function(element, state) {
    tree = d3.layout.tree().nodeSize([NODE_HEIGHT*5, NODE_WIDTH*5]);
    this.update(element, state);
};

/**
 * Called when we want to redraw the tree
 */
d3Chart.update = function(element, state) {
    root = state.data[0];
    treeState = state.view;
    this._drawTree(root);
};

d3Chart.destroy = function() {
    svg.remove();
};
/**
 * This will set some scaling according to the sizes of the element
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
 */

d3Chart._drawTree = function(data) {
    if(!root){
        return null;
    }

    var gTree = d3.select('body').selectAll(".nodes");
    
    // build the arrow.
    var arrow = gTree.append("svg:defs").selectAll("marker")
            .data(["start"])
        .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", "ArrowMarker")
            .attr("viewBox", "0 0 22 20")
            .attr("refX", 0)
            .attr("refY", 10)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("markerUnits", "strokeWidth")
            .attr("orient", "auto")
            .attr("stroke-width", "2")
            .attr('stroke', 'black')
            .attr('fill', 'white')
        .append("svg:path")
            .attr("d", "M 0 10 L 20 0 L 20 20 z");


    /**
     * nodes and links will become arrays which contains the data for all
     * the nodes and positions for the links (lines) between them.
     */

    var nodes = tree.nodes(root),
        links = tree.links(nodes);
    /**
     * Defines behavior for dragging elements.
     */
    var drag = d3.behavior.drag()
        .on("dragstart", dragstarted)
        .on("drag", dragmove)
        .on("dragend", dragended);

    /**
     * This manually sets the distance between the nodes
     */


    if(treeState == 'vertical'){
        nodes.forEach(function(d) {
            d.y = d.depth*100; });
    } else {
        nodes.forEach(function(d) {
            d.y = d.depth*500; //Increases distance between children and parents
            d.x /= 3.5; //Reduces vertical distance between nodes
        });
    }

    /**
     * Declares a node to the g element or var that we created. I think this
     * part can be skipped. But it also gives every node a unique id, which
     * is nice.
     */
    var node = gTree.selectAll("g.node").remove();
    node = gTree.selectAll("g.node")
        .data(nodes, function(d) { return d.id });

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
    var nodeEnter = node.enter().append("g")
        .attr("class", "node");

    if(treeState == 'vertical'){
        treeState.attr("transform", function(d) {
        return "translate(" + d.x + ", " + d.y + ")";}
        )} else {
        treeState.attr("transform", function(d) {
            return "translate(" + d.y + ", " + d.x + ")";
        })
    }

    nodeEnter.on('contextmenu', d3.contextMenu(menuData))
        .call(drag)
        .on("click", function(d){
            // suppress click if already used
            if  (d3.event.defaultPrevented) return;

            // no point of searching for root again
            if (d.id != root.id)
                onClick(d.concept_id);
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
    nodeEnter.append('rect')
        .attr('class', 'node')
        .attr('x', function (d) {return WIDTH_MARGIN - d.name.length*1.5 })
        .attr('width', function(d){return NODE_WIDTH + d.name.length*3})
        .attr('height', NODE_HEIGHT)
        .style('fill', '#FFF')
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
        .attr("x", NODE_WIDTH/2 + WIDTH_MARGIN)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1);

    /**
     * Creates link which will be an array of objects with class line.link
     * and contain all the links generated and the unique id it has been given
     */
    var link = gTree.selectAll("line.link").remove();
    link = gTree.selectAll("line.link")
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

    if(treeState == 'vertical') {
        link.enter().insert('line', 'g')
            .attr("class", "link")
            .attr("x1", function (d) {return d.source.x + NODE_WIDTH / 2 + WIDTH_MARGIN;})
            .attr("y1", function (d) {return d.source.y + NODE_HEIGHT;})
            .attr("x2", function (d) {return d.target.x + NODE_WIDTH / 2 + WIDTH_MARGIN;})
            .attr("y2", function (d) {return d.target.y + 0;
            })
            .attr("style", "stroke:rgb(0,0,0);stroke-width:2")
            .attr("marker-start", "url(#ArrowMarker)");
    } else {
        link.enter().insert('line', 'g')
            .attr("class", "link")
            .attr("y1", function(d) { return d.source.x + 20; })
            .attr("x1", function(d) { return d.source.y + 100;})
            .attr("y2", function(d) { return d.target.x + 20; })
            .attr("x2", function(d) { return d.target.y; })
            .attr("style", "stroke:rgb(0,0,0);stroke-width:2")
            .attr("marker-start", "url(#ArrowMarker)");
    }

    var nodeExit = node.exit().transition()
        .duration(DURATION)
        .attr("transform", function(d) {
            return "translate(" + d.parent.x + "," + d.parent.y + ")"; })
        .style('fill-opacity', 1e-6)
        .remove();

    nodeExit.select('rect')
        .attr('width', NODE_WIDTH)
        .attr('height', NODE_HEIGHT);

    nodeExit.select('text')
        .style("fill-opacity", 1e-6);

    link.exit().transition()
        .duration(DURATION)
        .attr("x1", function(d) { return data.parent.x + NODE_WIDTH/2+WIDTH_MARGIN; })
        .attr("y1", function(d) { return data.parent.y + NODE_HEIGHT; })
        .attr("x2", function(d) { return data.parent.x + NODE_WIDTH/2+WIDTH_MARGIN; })
        .attr("y2", function(d) { return data.parent.y + 0; })
        .remove();

    /**
     * Function for recalculating values of links and nodes
     */
    function tick() {
        if(treeState == 'vertical') {
            link.attr("x1", function (d) {return d.source.x + NODE_WIDTH / 2 + WIDTH_MARGIN;})
                .attr("y1", function (d) {return d.source.y + NODE_HEIGHT;})
                .attr("x2", function (d) {return d.target.x + NODE_WIDTH / 2 + WIDTH_MARGIN;})
                .attr("y2", function (d) {return d.target.y;});

            node.attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")";});
        } else {
            link.attr("y1", function(d) { return d.source.x + 20; })
                .attr("x1", function(d) { return d.source.y + 100;})
                .attr("y2", function(d) { return d.target.x + 20; })
                .attr("x2", function(d) { return d.target.y; });

            node.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });}
    }


    /**
     * Function for the event dragstarted
     * @param d
     */
    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
    }

    /**
     * Function for dragging an element.
     */
    function dragmove(d, i) {
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        tick();
    }

    /**
     * Function for the event dragended
     */
    function dragended(d) {
        d3.select(this).classed("dragging", false);
    }
};

/**
 * This functions adds the nodes and the lines between the nodes and styles
 * them in the way we want.
 */

d3Chart._drawHorizontal = function(data) {
    if(!root){
        return null;
    }

    var gTree = d3.select('body').selectAll(".nodes");

    // build the arrow.
    var arrow = gTree.append("svg:defs").selectAll("marker")
        .data(["start"])
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", "ArrowMarker")
        .attr("viewBox", "0 0 22 20")
        .attr("refX", 0)
        .attr("refY", 10)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("markerUnits", "strokeWidth")
        .attr("orient", "auto")
        .attr("stroke-width", "2")
        .attr('stroke', 'black')
        .attr('fill', 'white')
        .append("svg:path")
        .attr("d", "M 0 10 L 20 0 L 20 20 z");


    /**
     * nodes and links will become arrays which contains the data for all
     * the nodes and positions for the links (lines) between them.
     */

    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);
    /**
     * Defines behavior for dragging elements.
     */
    var drag = d3.behavior.drag()
        .on("dragstart", dragstarted)
        .on("drag", dragmove)
        .on("dragend", dragended);

    /**
     * This manually sets the distance between the nodes
     */

    nodes.forEach(function(d) {
        d.y = d.depth*500; //Increases distance between children and parents
        d.x /= 3.5; //Reduces vertical distance between nodes
    });

    /**
     * Declares a node to the g element or var that we created. I think this
     * part can be skipped. But it also gives every node a unique id, which
     * is nice.
     */
    var node = gTree.selectAll("g.node").remove();
    node = gTree.selectAll("g.node")
        .data(nodes, function(d) { return d.id });

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
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.y + ", " + d.x + ")";
        })
        .on('contextmenu', d3.contextMenu(menuData))
        .call(drag)
        .on("click", function(d){
            // suppress click if already used
            if  (d3.event.defaultPrevented) return;

            // no point of searching for root again
            if (d.id != root.id)
                onClick(d.concept_id);
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
    nodeEnter.append('rect')
        .attr('class', 'node')
        .attr('width',NODE_WIDTH)
        .attr('height', NODE_HEIGHT)
        .style('fill', '#FFF')
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
        .attr("x", 50)
        .attr("y", 25)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1);


    /**
     * Creates link which will be an array of objects with class line.link
     * and contain all the links generated and the unique id it has been given
     */
    var link = gTree.selectAll("line.link").remove();
    link = gTree.selectAll("line.link")
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
    link.enter().insert('line', 'g')
        .attr("class", "link")
        .attr("y1", function(d) { return d.source.x + 20; })
        .attr("x1", function(d) { return d.source.y + 100;})
        .attr("y2", function(d) { return d.target.x + 20; })
        .attr("x2", function(d) { return d.target.y; })
        .attr("style", "stroke:rgb(0,0,0);stroke-width:2")
        .attr("marker-start", "url(#ArrowMarker)");
    /**
     * Function for recalculating values of links and nodes
     */
    function tick() {
        link.attr("y1", function(d) { return d.source.x + 20; })
            .attr("x1", function(d) { return d.source.y + 100;})
            .attr("y2", function(d) { return d.target.x + 20; })
            .attr("x2", function(d) { return d.target.y; });


        node.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
    }



    /**
     * Function for the event dragstarted
     * @param d
     */
    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
    }

    /**
     * Function for dragging an element.
     */
    function dragmove(d, i) {
        d.x += d3.event.dy;
        d.y += d3.event.dx;
        tick();
    }

    /**
     * Function for the event dragended
     */
    function dragended(d) {
        d3.select(this).classed("dragging", false);
    }
};

