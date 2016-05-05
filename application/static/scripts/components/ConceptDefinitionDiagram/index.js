import React from "react";
import ReactDOM from "react-dom";

// The margin between every level of attributes and concepts
const LEVEL_MARGIN = 100;
// Height of the nodes
const NODE_HEIGHT = 50;
// Margin between attributes and concepts (length of arrows)
const NODE_MARGIN = 20;
// Margin between the text and the outline of the node
const WIDTH_MARGIN = 20;
// Styling according to SNOMED CT diagramming guidelines
const DEFINED_CONCEPT_BORDER = 4;
// Radius of circle
const CIRCLE_RADIUS = 20;



// The current level we are drawing on
var level = 0;

var ConceptDefinitionDiagram = React.createClass({
    propTypes:{
        serverUrl: React.PropTypes.string,
        concept_id: React.PropTypes.number
    },
    statics: {
        PRIMITIVE_COLOR : "#99CCFF",
        DEFINED_COLOR : "#CCCCFF",
        ATTRIBUTE_COLOR: '#FFFFCC'
    },

    getInitialState: function() {
        return {};
    },


    /**
     *
     */
    componentDidMount: function() {
        this.update(this.props);
    },

    /**
     *
     */
    shouldComponentUpdate: function(props) {
        // no point of doing anything if the same id was given
        if (props.concept_id == this.props.concept_id) return false;

        this.update(props);
        return false;
    },

    /**
     * Render the contents of the ConceptGraph
     */
    render: function() {
        return <svg width="100%" height="100%"></svg>;
    },

    /**
     * Fetch new data and draw diagram..
     */
    update: function(props) {
        $.when(this.getConcept(props.concept_id), this.getRelations(props.concept_id))
            .then(function(concept, relations) {
                // structure the data as a concept with a list of relations 
                var data = concept[0];
                data.relations = relations[0];

                // draw the diagram with new data
                this.draw(data);
            }.bind(this));
    },

    /**
     * Retrieve the concept with given id.
     */
    getConcept: function(conceptId) {
        return $.ajax({
            type: "GET",
            method: "GET",
            url: this.props.serverUrl + "/concept/" + conceptId,
            dataType: "json",
            error: function() {
                console.log("Could not get concept for Concept Definition" +
                    " Diagram.");
            }.bind(this)
        });
    },

    /**
     * Retrieve relations to concept with given id.
     */
    getRelations: function(conceptId) {
        return $.ajax({
            type: "GET",
            method: "GET",
            url: this.props.serverUrl + "/get_relations/" + conceptId,
            dataType: "json",
            error: function() {
                console.log("Could not get relations for Concept Definition" +
                    " Diagram.");
            }.bind(this)
        });
    },
    /**
     * Retrieve relations to concept with given id.
     */
    getRelations: function(conceptId) {
        return $.ajax({
            type: "GET",
            method: "GET",
            url: this.props.serverUrl + "/get_relations/" + conceptId,
            dataType: "json",
            error: function() {
                console.log("Could not get relations for Concept Definition" +
                    " Diagram.");
            }.bind(this)
        });
    },

    /**
     * Draw the diagram.
     */
    draw: function(data) {
        console.log(data);
        var x = 0;
        var y = 0;
        // fetch the svg element
        var svg = d3.select(ReactDOM.findDOMNode(this));
            svg.append('svg:defs').selectAll('marker')
            .data(['start'])
            .enter().append('svg:marker')
            .attr('id', 'ArrowMarker')
            .attr('viewBox', '0 0 22 20')
            .attr('refX', 0)
            .attr('refY', 10)
            .attr('markerWidth', 15)
            .attr('markerHeight', 15)
            .attr('markerUnits', 'strokeWidth')
            .attr('orient', 'auto')
            .attr('stroke-width', '2')
            .attr('stroke', 'black')
            .attr('fill', 'white')
            .append('svg:path')
            .attr('d', 'M 0 0 L 20 10 L 0 20 z');

        // draw the concept
        var con = this.drawConcept(svg, data, x, y);
        x += 200;
        y += LEVEL_MARGIN;
        var rel = this.drawRelationalOperator(svg, data, x, y);
        this.connectElements(svg, con, rel, "bottom", "left", "");
        x += 200;
        for(var i in data.relations) {
            this.drawConcept(svg, data.relations[i], x, y);
            x += 200;
        }
    },
    connectElements: function(svg, fig1, fig2, side1, side2, endMarker){
        var fig1cx = parseFloat(fig1.attr("x"));
        var fig1cy = parseFloat(fig1.attr("y"));
        var fig1cw = fig1.node().getBBox().width;
        var fig1ch = fig1.node().getBBox().height;

        var fig2cx = parseFloat(fig2.attr("x"));
        var fig2cy = parseFloat(fig2.attr("y"));
        var fig2cw = fig2.node().getBBox().width;
        var fig2ch = fig2.node().getBBox().height;

        var markerCompensation1 = 15;
        var markerCompensation2 = 15;

        var originY;
        var originX;
        var destinationY;
        var destinationX;

        switch(side1) {
            case 'top':
                originY = fig1cy;
                originX = fig1cx + (fig1cw/2);
                break;
            case 'bottom':
                originY = fig1cy + fig1ch;
                originX = fig1cx + (fig1cw/2);
                break;
            case 'left':
                originX = fig1cx - markerCompensation1;
                originY = fig1cy + (fig1ch/2);
                break;
            case 'right':
                originX = fig1cx + fig1cw;
                originY = fig1cy + (fig1ch/2);
                break;
            default:
                originX = fig1cx + (fig1cw/2);
                originY = fig1cy + (fig1ch/2);
                break;
        }

        switch(side2) {
            case 'top':
                destinationY = fig2cy;
                destinationX = fig2cx + (fig2cw/2);
                break;
            case 'bottom':
                destinationY = fig2cy + fig2ch;
                destinationX = fig2cx + (fig2cw/2);
                break;
            case 'left':
                destinationX = fig2cx - markerCompensation2;
                destinationY = fig2cy + (fig2ch/2);
                break;
            case 'right':
                destinationX = fig2cx + fig2cw;
                destinationY = fig2cy + (fig2ch/2);
            default:
                destinationX = fig2cx + (fig2cw/2);
                destinationY = fig2cy + (fig2ch/2);
                break;
        }
        svg.append("polyline")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("points", [[originX, originY],
                [originX, destinationY], [destinationX, destinationY]])
            .attr('marker-end', 'url(#ArrowMarker)');;
    },

    drawAttributeGroup: function(element, concept, x, y){

    },

    drawConjunction: function(element, concept, x, y){

    },

    drawRelationalOperator: function(element, concept, x, y){
        var g = element.append("g")
            .attr("class", "relational")
            .attr("x", x)
            .attr("y", y)
            .attr('transform', 'translate(' + x + ', ' + y + ')' );

        g.append("circle")
            .attr("r", CIRCLE_RADIUS)
            .attr("cx",CIRCLE_RADIUS)
            .attr("cy",CIRCLE_RADIUS)
            .attr("fill", "white")
            .attr("stroke", "black");

        g.append("text")
            // position text centered in the concept
            .attr("class", "name")
            .attr("text-anchor", "middle")
            .attr("x",CIRCLE_RADIUS)
            .attr("y",CIRCLE_RADIUS)
            .attr("dy", ".35em")
            .attr("font-size", 30)
            .attr("font-family", "Helvetica, Arial, Sans-Serif")

            // use the full name if possible, if not available use the synonym
            // and if neither is defined use a default "NO NAME" name.
            .text( (concept.definition_status == "Primitive") ? "⊑" : "≡")
            .style("fill-opacity", 1);

        return g;
    },


    /**
     * Draw the given concept.
     *
     * Concept must be on the form:
     * {
     *      definition_status: "fully_defined"|"primitive"
     *      full: <full name>
     *      synonym: <synonym>
     *      id: <concept id>
     * }
     */
    drawConcept: function(element, concept, x, y) {
        var g = element.append("g")
            .attr("class", "concept")
            .attr("x", x)
            .attr("y", y)
            .attr('transform', 'translate(' + x + ', ' + y + ')' );

        // draw a rectangle and text
        this.drawConceptRectangle(g, concept);
        this.drawConceptId(g, concept);
        this.drawConceptText(g, concept);
        // Change the width of the rectangle, to fit entire text + margin
        var textWidth = g.select("text.name").node().getBBox().width;
        var totalWidth = textWidth + WIDTH_MARGIN;
        g.select("rect.outer").attr("width", totalWidth);
        g.select("rect.inner").attr("width", (concept.definition_status == "Primitive") ?
                    totalWidth:
                    totalWidth - DEFINED_CONCEPT_BORDER*2);
        // If the definition_status is defined, center the inner rect
        g.select("rect.inner").attr("x", (concept.definition_status == "Primitive") ?
                    0 :
                    DEFINED_CONCEPT_BORDER);
        g.select("rect.inner").attr("y", (concept.definition_status == "Primitive") ?
                    0 :
                    DEFINED_CONCEPT_BORDER);
        g.select("text.name").attr("x", totalWidth/2);
        g.select("text.id").attr("x", totalWidth/2);
        // return the grouping element
        return g;
    },

    /**
     * Draw a concept rectangle in given grouping element.
     */
    drawConceptRectangle: function(group, concept) {

        group.append("rect")
            .attr("class", "outer")
            .attr("width", 50)
            .attr("height", NODE_HEIGHT)
            // apply the correct colours depending on definition status
            .style("fill", (concept.definition_status == "Primitive") ?
                ConceptDefinitionDiagram.PRIMITIVE_COLOR :
                "white")
            .style('stroke', 'black');

        /** Set an inner rect which is a copy of outer if the definition_status is primitive
         *  Otherwise, it will be a blue rect inside of a white rect
         */
        group.append("rect")
            .attr("class", "inner")
            .attr("width", 50)
            .attr("height", (concept.definition_status == "Primitive") ?
                NODE_HEIGHT:
            NODE_HEIGHT - DEFINED_CONCEPT_BORDER*2)
            // apply the correct colours depending on definition status
            .style("fill", (concept.definition_status == "Primitive") ?
                ConceptDefinitionDiagram.PRIMITIVE_COLOR :
                ConceptDefinitionDiagram.DEFINED_COLOR)
            .style('stroke', 'black');

    },
    /**
     * Draw id inside given grouping element.
     */
    drawConceptId: function(group, concept) {
        group.append("text")
            // position text centered in the concept
            .attr("class", "id")
            .attr("y", NODE_HEIGHT/4)
            .attr("x", 50)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("font-family", "Helvetica, Arial, Sans-Serif")
            .attr("font-size", 10)

            // use the full name if possible, if not available use the synonym
            // and if neither is defined use a default "NO NAME" name.
            .text(function() {
                return concept.id;
            })

            .style("fill-opacity", 1);
    },
    /**
     * Draw text inside given grouping element.
     */
    drawConceptText: function(group, concept) {
        group.append("text")
            // position text centered in the concept
            .attr("class", "name")
            .attr("y", 3*NODE_HEIGHT/4)
            .attr("x", 50)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("font-family", "Helvetica, Arial, Sans-Serif")

            // use the full name if possible, if not available use the synonym
            // and if neither is defined use a default "NO NAME" name.
            .text(function() {
                if (concept.full == null &&
                    concept.synonym == null) {
                    return "NO NAME";
                }
                else if (concept.full == null) {
                    return concept.synonym;
                }
                return concept.full;
            })

            .style("fill-opacity", 1);
    }
});

module.exports = ConceptDefinitionDiagram;
