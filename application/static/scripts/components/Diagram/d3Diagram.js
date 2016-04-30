import React from 'react';
import ReactDOM from 'react-dom';

/**
 * This file contains functions to create a d3 tree diagram. When created a
 * svg-element and g-element is inserted to the body. The g-elements
 * transform attribute is used to zoom and move the diagram.
 */

var lang = 'en';

var d3Chart = module.exports = {};

var contextMenu = require('./d3-context-menu');

const dict = {
        se: {
            'removeNode':   'Ta bort nod',
            'hideShowChildren': 'Visa/Dölj barn',
            'hideSiblings': 'Dölj syskon',
            'showSiblings': 'Visa syskon',
            'resetNodePosition': 'Återställ nodens position'
            },
        en: {
            'removeNode':   'Remove node',
            'hideShowChildren': 'Show/Hide children',
            'hideSiblings': 'Hide siblings',
            'showSiblings': 'Show siblings',
            'resetNodePosition': 'Reset node position'
            }
};

//Called during mouseevent, updates position for selected nodes and links
function tick() {
    if(treeView == 'vertical') {
        link.attr('x1', function(d) { return d.source.x + NODE_WIDTH/2 + WIDTH_MARGIN; })
            .attr('y1', function(d) { return d.source.y + NODE_HEIGHT + d.source.lineNumber*LINE_MARGIN; })
            .attr('x2', function(d) { return d.target.x + NODE_WIDTH/2 + WIDTH_MARGIN;})
            .attr('y2', function(d) { return d.target.y; });


        node.attr('transform', function(d) { return 'translate(' + d.x + ', ' + d.y + ')'; });
    } else {
        link.attr('y1', function(d) { return d.source.x + NODE_HEIGHT/2; })
            .attr('x1', function(d) { return d.source.y + NODE_WIDTH;})
            .attr('y2', function(d) { return d.target.x + NODE_HEIGHT/2; })
            .attr('x2', function(d) { return d.target.y; });


        node.attr('transform', function(d) { return 'translate(' + d.y + ', ' + d.x + ')'; });
    }

}
/**
 * Most of the actions looks at the children of the current nodes parent
 * and moves them to another list called _children that will not be drawn
 */
d3Chart._createMenuData = function(element) {
    return  [
        {
            title: dict[lang]['removeNode'],
            action: function(elm, d) {
                if (d.parent && d.parent.children !== undefined) {

                    // find child and remove it
                    for (var i = 0; i < d.parent.children.length; i++) {
                        if (d.parent.children[i].name === d.name) {
                            d.parent.children.splice(i, 1);
                            break;
                        }
                    }
                }
                d3Chart._drawTree(element, d);
            }
        },
        {
            title: dict[lang]['hideShowChildren'],
            action: function(elm, d){
                
                //If the node have children, put them in another list
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } 
                
                //Take the children back
                else {
                    d.children = d._children;
                    d._children = null;
                }

                d3Chart._drawTree(element, d);
            }
        },
        {
            title: dict[lang]['hideSiblings'],
            action: function(elm, d){
                if(d.parent != "null") {
                    var tempChild = [];
                    tempChild.push(d);
                    d.parent._children = d.parent.children;
                    d.parent.children = tempChild;
                    d3Chart._drawTree(element, d);
                }
            }
        },
        {
            title: dict[lang]['showSiblings'],
            action: function(elm, d){
                if(d.parent != "null" && d.parent._children){
                    d.parent.children = d.parent._children;
                    d.parent._children = null;
                    d3Chart._drawTree(element, d);
                }
            }
        },
        {
            title: dict[lang]['resetNodePosition'],
            action: function(elm, d){
                if(d.moved != undefined){
                    if(d.moved) {
                        d.x = d.x0;
                        d.y = d.y0;
                        d.moved = false;
                        tick();
                    }
                }
            }
        }

        ];

};  

var i = 0;
var tree,root,treeView,svg,g,onClick,zoom, link, node;

const TEXT_MAX_WIDTH = 230;
const NODE_WIDTH = 250;
const NODE_MARGIN = 10;
const NODE_HEIGHT = 50;
const WIDTH_MARGIN = 500;
const HORIZONTAL_MARGIN = 300; //Moves the horizontal view down in the y-axis
const LINE_MARGIN = 15;

/**
 * Called on initial render and whenever view is changed. Adds an svg-
 * element to the page and a g-element where all the nodes will reside with
 * a transform attribute that depends on the view. Creates a d3 tree object
 * with size depending on view.
 * @param element contains the element that contains the chart
 * @param props contains function for onClick
 * @param state contains data,view
 */

d3Chart.create = function(element, props, state) {
    if(!state){return;}

    lang = state.language;
    root = state.data[0];
    treeView = state.view;
    onClick = props.onClick;

    zoom = d3.behavior.zoom()
        .on('zoom', zoomed);

    svg = d3.select(element).append('svg')
        .attr('class', 'd3')
        .attr({
            'xmlns': 'http://www.w3.org/2000/svg',
            'xlink': 'http://www.w3.org/1999/xlink',
            version: '1.1'
        })
        .call(zoom).on('dblclick.zoom', null)
        .on( 'mousedown', function() {
            if(!d3.event.ctrlKey) {
                d3.selectAll('g.selected').classed('selected', false)
                    .selectAll('rect.node').style('fill', 'white');
            }
        });

    if(treeView == 'vertical'){
        g = svg.append('g')
            .attr('class', 'nodes')
            .attr('transform', 'translate(' + 0 + ',' + 0 + ')scale(' + 1 + ')');
    } else {
        g = svg.append('g')
            .attr('class', 'nodes')
            .attr('transform', 'translate(' + 0 + ',' + HORIZONTAL_MARGIN + ')scale(' + 1 + ')');
    }

    function zoomed() {
        var yOffset = d3.event.translate[1] + HORIZONTAL_MARGIN;
        if(treeView == 'vertical'){
            g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
        } else {
            g.attr('transform', 'translate(' + d3.event.translate[0] + ',' + yOffset + ')scale(' + d3.event.scale + ')');
        }

    }

    tree = d3.layout.tree();
    if(treeView == 'vertical'){
        tree.nodeSize([NODE_WIDTH + NODE_MARGIN, NODE_HEIGHT]);
    } else {
        tree.nodeSize([NODE_HEIGHT, NODE_WIDTH]);
    }

    //TODO add option to sort by id
    tree.sort(function(a,b){return d3.ascending(a.name,b.name)});

    this._drawTree(element, root);
};

/**
 * Reset the chart to state.
 */
d3Chart.reset = function(element, state) {
    //tree = d3.layout.tree().nodeSize([NODE_HEIGHT*5, NODE_WIDTH*5]);
    //this.update(element, state);
};

/**
 * Called when we want to redraw the tree
 */
d3Chart.update = function(element, state) {
    if (state){
        lang = state.language;
        root = state.data[0];
        this._drawTree(element, root);
    }
};

d3Chart.destroy = function() {
    svg.remove();
};

/**
 * Return an ID for a d3 node.
 */
d3Chart.getId = function() {
    return ++i;
};

/**
 * Sets the transform attribute of the g-element
 */
d3Chart._resetZoom = function(element){
    if(treeView == 'vertical'){
        d3.select(element).selectAll('.nodes')
            .attr('transform', 'translate(' + 0 + ',' + 0 + ')scale(' + 1 + ')');
    } else {
        d3.select(element).selectAll('.nodes')
            .attr('transform', 'translate(' + 0 + ',' + HORIZONTAL_MARGIN + ')scale(' + 1 + ')');
    }
    zoom.scale(1);  //Keeps the scaling after pressing reset
    zoom.translate([0,0])
};

/**
 * This functions adds the nodes and the lines between the nodes
 */
d3Chart._drawTree = function(element, data) {
    if(!root){
        return null;
    }

    var gTree = d3.select(element).selectAll('.nodes');

    //This creates the 'is-a' arrow as a svg marker.
    gTree.append('svg:defs').selectAll('marker')
        .data(['start'])
        .enter().append('svg:marker')
        .attr('id', 'ArrowMarker')
        .attr('viewBox', '0 0 22 20')
        .attr('refX', 0)
        .attr('refY', 10)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('TmarkerUnits', 'strokeWidth')
        .attr('orient', 'auto')
        .attr('stroke-width', '2')
        .attr('stroke', 'black')
        .attr('fill', 'white')
        .append('svg:path')
        .attr('d', 'M 0 10 L 20 0 L 20 20 z');


    /**
     * nodes and links will become arrays which contains the data for all
     * the nodes and positions for the links (lines) between them.
     */
    var nodes = tree.nodes(root),
        links = tree.links(nodes);

    /**
     * This sets the distance between the node levels
     */
    if(treeView == 'vertical'){
        nodes.forEach(function(d) {
            d.y = d.depth*100; });
    } else {
        nodes.forEach(function(d) {
            d.y = d.depth*500;
        });
    }

    nodes.forEach(function (d) {
        if(d.moved == undefined || d.moved == false){
            d.moved = false;
            d.x0 = d.x;
            d.y0 = d.y;
        }
    });

    var drag = d3.behavior.drag()
        .on('dragstart', dragstarted)
        .on('drag', dragmove)
        .on('dragend', dragended);


    gTree.selectAll('g.node').remove();
    node = gTree.selectAll('g.node')
        .data(nodes, function(d) { return d.id });

    /**
     * 'Enters' the nodes by creating a new g-element inside the bigger
     * g-element because we want a node to have a rect and text element.
     * Remember that with SVG you have to use a g-element to combine two or
     * more elements.
     */
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .style('cursor','pointer');

        if(treeView == 'vertical'){
            nodeEnter.attr('transform', function(d) {
                return 'translate(' + d.x + ', ' + d.y + ')';
            });
        } else {
            nodeEnter.attr('transform', function(d) {
                return 'translate(' + d.y + ', ' + d.x + ')';
            });
        }
        //When right clicking on a node call the contextMenu function
        nodeEnter.on('contextmenu', d3.contextMenu(this._createMenuData(element)))
        .call(drag)
        .on('mouseover', function(){
            d3.select(this).selectAll('rect.node').style( 'fill', '#ebebeb');
        })
        .on('mouseout', function() {
            if(!d3.select(this).classed('selected')) {
                d3.select(this).selectAll('rect.node').style('fill', 'white');
            }
        })
        .on('click', function(d){
            // If we are dragging, don't call click
            if  (d3.event.defaultPrevented) return;

            // If we are holding down the ctrl key and clicking, invert selected
            if(d3.event.ctrlKey) {
                var selection = d3.select(this).classed('selected');
                d3.select(this).classed('selected', !selection)
                    .selectAll('rect.node').style('fill', selection ? ('white') : ('ebebeb'));
            }else{
                // If we are clicking on a node which is not selected, deselect all nodes
                if(!d3.select(this).classed('selected')){
                    d3.selectAll('.selected').classed('selected', false)
                        .selectAll('rect.node').style('fill', 'white');
                }

                // notify container of click on node
                onClick(d.id);
            }
        });
    //Enter rectangles for every node
    if(treeView == 'vertical'){
        nodeEnter.append('rect')
            .attr('class', 'node')
            .attr('x', WIDTH_MARGIN)
            .attr('width', NODE_WIDTH)
            .attr('height',NODE_HEIGHT)
            .style('fill', '#FFF')
            .style('stroke','black');
    } else {
        nodeEnter.append('rect')
            .attr('class', 'node')
            .attr('width', NODE_WIDTH)
            .attr('height',NODE_HEIGHT)
            .style('fill', '#FFF')
            .style('stroke','black');
    }
    //Add text-element for every node
    if(treeView == 'vertical'){
        nodeEnter.append('text')
            .attr('y', NODE_HEIGHT/2)
            .attr('x', NODE_WIDTH/2 + WIDTH_MARGIN)
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .attr('font-family', 'Helvetica, Arial, Sans-Serif')
            .text(function(d) { return "(" + d.concept_id + ") " + d.name; })
            .style('fill-opacity', 1)
            .call(wrap, TEXT_MAX_WIDTH);
    } else {
        nodeEnter.append('text')
            .attr('y', NODE_HEIGHT/2)
            .attr('x', NODE_WIDTH/2)
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .attr('font-family', 'Helvetica, Arial, Sans-Serif')
            .text(function(d) { return "(" + d.concept_id + ") " + d.name; })
            .style('fill-opacity', 1)
            .call(wrap, TEXT_MAX_WIDTH);
    }

    //Add links between nodes
    gTree.selectAll('line.link').remove();
    link = gTree.selectAll('line.link')
        .data(links, function(d) { return d.target.id; });

    //Set the position for the links
    if(treeView == 'vertical'){
        link.enter().insert('line', 'g')
            .attr('class', 'link')
            .attr('x1', function(d) { return d.source.x + NODE_WIDTH/2 + WIDTH_MARGIN; })
            .attr('y1', function(d) { return d.source.y + NODE_HEIGHT + d.source.lineNumber*LINE_MARGIN; })
            .attr('x2', function(d) { return d.target.x + NODE_WIDTH/2 + WIDTH_MARGIN; })
            .attr('y2', function(d) { return d.target.y + 0; })
            .attr('style', 'stroke:rgb(0,0,0);stroke-width:2')
            .attr('marker-start', 'url(#ArrowMarker)');
    } else {
        link.enter().insert('line', 'g')
            .attr('class', 'link')
            .attr('y1', function(d) { return d.source.x + NODE_HEIGHT/2; })
            .attr('x1', function(d) { return d.source.y + NODE_WIDTH;})
            .attr('y2', function(d) { return d.target.x + NODE_HEIGHT/2; })
            .attr('x2', function(d) { return d.target.y; })
            .attr('style', 'stroke:rgb(0,0,0);stroke-width:2')
            .attr('marker-start', 'url(#ArrowMarker)');
    }


    //Sets behaviour for when the the mouse starts to drag
    function dragstarted(d) {
        d.moved = true;
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed('dragging', true);
    }

    /**
     * Updates the selected node(s) position depending on where the mouse is
     * positioned
     */
    function dragmove(d) {
        var selection = d3.selectAll('.selected');
        if (!selection.empty()) {
            if(treeView == 'vertical'){
                selection.attr('transform', function (d) {
                    d.x += d3.event.dx;
                    d.y += d3.event.dy;
                    return 'translate(' + [d.x, d.y] + ')'
                });
            }
            else {
                selection.attr('transform', function (d) {
                    d.x += d3.event.dy;
                    d.y += d3.event.dx ;
                    return 'translate(' + [d.x, d.y] + ')'
                });
            }
        }
        else {
            if(treeView == 'vertical'){
                    d.x += d3.event.dx;
                    d.y += d3.event.dy;
            }
            else{
                d.x += d3.event.dy;
                d.y += d3.event.dx;
            }
        }
        tick();
    }

    function dragended() {
        d3.select(this).classed('dragging', false);
    }

    function wrap(text, width) {
        text.each(function(d) {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                x = text.attr('x'),
                y = text.attr('y'),
                dy = parseFloat(text.attr('dy')),
                tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');

            word = words.pop(); //First word is the id
            line.push(word);
            tspan.text(line.join(' '));

            word = words.pop();
            line.push(word);
            tspan.text(line.join(' '));
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
                }
            }
            // Save linenumber to move links
            d.lineNumber = lineNumber;
            // If the text is 2 rows or more, increase the width of the rect
            if(lineNumber > 0){
                d3.select(this.parentNode).select('rect.node').attr('height', NODE_HEIGHT + lineNumber*LINE_MARGIN);
            }
        });
    }
};

