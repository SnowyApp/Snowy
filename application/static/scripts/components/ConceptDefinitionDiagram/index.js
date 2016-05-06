import React from "react";
import ReactDOM from "react-dom";

// The margin between every level of attributes and concepts
const LEVEL_MARGIN = 75;
// Height of the nodes
const NODE_HEIGHT = 50;
// Margin between attributes and concepts (length of arrows)
const NODE_MARGIN = 20;
// Margin between the text and the outline of the node
const WIDTH_MARGIN = 30;
// Margin between the text and the outline of the node
const HEIGHT_MARGIN = 5;
// Styling according to SNOMED CT diagramming guidelines
const DEFINED_CONCEPT_BORDER = 4;
// Radius of circle
const RELATION_RADIUS = 25;
// Radius of conjunction 
const CONJUNCTION_RADIUS = 10;
// Start positions of root node on the svg document
const START_X = 20;
const START_Y = 20;



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
     * Initiate markers
     * @param element
     */
    initMarkers: function(element){
        var defs = element.append('defs');
        defs.append('marker')
            .attr('id', 'BlackMarker')
            .attr('viewBox', '0 0 22 20')
            .attr('refX', 0)
            .attr('refY', 10)
            .attr('markerWidth', 15)
            .attr('markerHeight', 15)
            .attr('markerUnits', 'strokeWidth')
            .attr('orient', 'auto')
            .attr('stroke-width', '2')
            .attr('stroke', 'black')
            .attr('fill', 'black')
            .append('svg:path')
            .attr('d', 'M 0 0 L 20 10 L 0 20 z');

        defs.append('marker')
            .attr('id', 'ClearMarker')
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

        defs.append('marker')
            .attr('id', 'LineMarker')
            .attr('viewBox', '0 0 22 20')
            .attr('refX', 0)
            .attr('refY', 10)
            .attr('markerWidth', 17)
            .attr('markerHeight', 15)
            .attr('markerUnits', 'strokeWidth')
            .attr('orient', 'auto')
            .attr('stroke-width', '1')
            .attr('stroke', 'black')
            .attr('fill', 'white')
            .append('svg:path')
            .attr('d', 'M 0 10 L 20 10');
    },
    /**
     * Sorts data based on the group_id, with smallest numbers first
     * @param concepts
     * @returns {*}
     */
    sortRelations: function(data) {
        return data.sort(function(a, b) {
            return (a.group_id > b.group_id) ? 1 : ((b.group_id > a.group_id) ? -1 : 0);
        });
    },

    /**
     * Draw the diagram.
     */
    draw: function(data) {
        var x = START_X;
        var y = START_Y;
        // fetch the svg element
        var svg = d3.select(ReactDOM.findDOMNode(this));
            svg.selectAll("*").remove();
        this.initMarkers(svg);
        // sorts relations by group_id
        var sortedRelations = this.sortRelations(data.relations);
        // draw the root node
        var conc = this.drawConcept(svg, data, x, y);
        x += 150;
        y += LEVEL_MARGIN;
        // draw the relational operator
        var rel = this.drawRelationalOperator(svg, data, x, y);
        x += (NODE_MARGIN + RELATION_RADIUS * 2);
        // connect the root node and the relational operator
        this.connectElements(svg, conc, rel, "bottom-root", "left", "BlackMarker");
        // draw the conjunction
        var conj = this.drawConjunction(svg, data, x, y);
        x += (NODE_MARGIN + CONJUNCTION_RADIUS * 2);
        // connect the relational operator and the conjunction
        this.connectElements(svg, rel, conj, "right", "left", "LineMarker");
        // draw all the parents
        for (var i in sortedRelations) {
            if (sortedRelations[i].type_name == 'Is a') {
                conc = this.drawConcept(svg, sortedRelations[i], x, y);
                this.connectElements(svg, conj, conc, "bottom", "left", "ClearMarker");
                y += LEVEL_MARGIN;
            }
        }
        // draw all ungrouped attributes
        for (var i in sortedRelations) {
            if (sortedRelations[i].group_id == 0) {
                if (sortedRelations[i].type_name != 'Is a') {
                    conc = this.drawAttribute(svg, sortedRelations[i], x, y);
                    this.connectElements(svg, conj, conc, "bottom", "left", "BlackMarker");
                    y += LEVEL_MARGIN;
                }
            } else {
                break;
            }
        }
        // draw every relation and connect them to the conjunction
        if (sortedRelations[0] != null) {
            var groupId = sortedRelations[0].group_id;
            var newGroupId;
            var innerX = x;
            var innerConj;
            // go through every attribute which is not of type 'Is a' and has a group_id > 0
            for (var i in sortedRelations) {
                newGroupId = sortedRelations[i].group_id;
                if (sortedRelations[i].group_id != 0){
                    // if we are on a new group of which we have not started drawing yet
                    if (groupId != newGroupId) {
                        innerX = x;
                        groupId = newGroupId;
                        // draw the attribute group and connect it to the conjunction
                        conc = this.drawAttributeGroup(svg, sortedRelations[i], x, y);
                        this.connectElements(svg, conj, conc, "bottom", "left", "BlackMarker");
                        // create an inner conjunction marker for the attribute group
                        innerX += RELATION_RADIUS*2 + NODE_MARGIN;
                        innerConj = this.drawConjunction(svg, sortedRelations[i], innerX, y);
                        // connect the attribute group to the inner conjunction marker
                        this.connectElements(svg, conc, innerConj, "right", "left", "BlackMarker");
                        innerX += CONJUNCTION_RADIUS*2 + NODE_MARGIN;
                    }
                    // draw attributes and connect them to the inner conjunction marker
                    conc = this.drawAttribute(svg, sortedRelations[i], innerX, y);
                    this.connectElements(svg, innerConj, conc, "bottom", "left", "BlackMarker");
                    y += LEVEL_MARGIN;
                }
            }
        }
    },
    /**
     * Connect elements fig1 and fig2 from side1 to side2 och respective elements
     * @param svg
     * @param fig1
     * @param fig2
     * @param side1
     * @param side2
     * @param endMarker
     */
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
            case 'bottom-root':
                originY = fig1cy + fig1ch;
                originX = fig1cx + 50;
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
            .attr('marker-end', 'url(#' + endMarker + ')');
    },
    /**
     * Draw attribute group on element
     * @param element
     * @param concept
     * @param x
     * @param y
     * @returns {*}
     */
    drawAttributeGroup: function(element, concept, x, y){
        var g = element.append("g")
            .attr("class", "relational")
            .attr("x", x)
            .attr("y", y)
            .attr('transform', 'translate(' + x + ', ' + y + ')' );

        g.append("circle")
            .attr("r", RELATION_RADIUS)
            .attr("cx",RELATION_RADIUS)
            .attr("cy",RELATION_RADIUS)
            .attr("fill", "white")
            .attr("stroke", "black");

        return g;
    },
    /**
     * Draw conjunction marker on element
     * @param element
     * @param concept
     * @param x
     * @param y
     * @returns {*}
     */
    drawConjunction: function(element, concept, x, y){
        var centerY = y + NODE_HEIGHT/2 - CONJUNCTION_RADIUS;
        var conj = element.append("circle")
            .attr("x", x)
            .attr("y", centerY)
            .attr('transform', 'translate(' + x + ', ' + centerY + ')' )
            .attr("r", CONJUNCTION_RADIUS)
            .attr("cx", CONJUNCTION_RADIUS)
            .attr("cy", CONJUNCTION_RADIUS)
            .attr("fill", "black");
        return conj;
    },
    /**
     * Draw relational operator on element
     * @param element
     * @param concept
     * @param x
     * @param y
     * @returns {*}
     */
    drawRelationalOperator: function(element, concept, x, y){
        var g = element.append("g")
            .attr("class", "relational")
            .attr("x", x)
            .attr("y", y)
            .attr('transform', 'translate(' + x + ', ' + y + ')' );

        g.append("circle")
            .attr("r", RELATION_RADIUS)
            .attr("cx",RELATION_RADIUS)
            .attr("cy",RELATION_RADIUS)
            .attr("fill", "white")
            .attr("stroke", "black");

        g.append("text")
            // position text centered in the concept
            .attr("class", "name")
            .attr("text-anchor", "middle")
            .attr("x",RELATION_RADIUS)
            .attr("y",RELATION_RADIUS)
            .attr("dy", ".35em")
            .attr("font-size", 30)
            .attr("font-family", "Helvetica, Arial, Sans-Serif")

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
        var idWidth = g.select("text.id").node().getBBox().width;
        if(idWidth > textWidth){
            textWidth = idWidth;
        }
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
     * Draw an attribute connected to a concept on element
     * @param element
     * @param concept
     * @param x
     * @param y
     * @returns {*}
     */
    drawAttribute: function(element, concept, x, y) {
        var g = element.append("g")
            .attr("class", "attribute")
            .attr("x", x)
            .attr("y", y)
            .attr('transform', 'translate(' + x + ', ' + y + ')' );

        // draw a rectangle and text
        this.drawAttributeRectangle(g);
        this.drawAttributeId(g, concept);
        this.drawAttributeText(g, concept);
        // Change the width of the rectangle, to fit entire text + margin
        var textWidth = g.select("text.name").node().getBBox().width;
        var totalWidth = textWidth + WIDTH_MARGIN;
        g.select("rect.outer").attr("width", totalWidth);
        g.select("rect.inner").attr("width", totalWidth - DEFINED_CONCEPT_BORDER*2);
        // If the definition_status is defined, center the inner rect
        g.select("rect.inner").attr("x", DEFINED_CONCEPT_BORDER);
        g.select("rect.inner").attr("y", DEFINED_CONCEPT_BORDER);
        g.select("text.name").attr("x", totalWidth/2);
        g.select("text.id").attr("x", totalWidth/2);

        var conceptX = x + totalWidth + NODE_MARGIN;

        var conc = this.drawConcept(element, concept, conceptX, y);
        // return the grouping element
        this.connectElements(element, g, conc , "right", "left", "BlackMarker");
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
            .attr("y", NODE_HEIGHT/4 + HEIGHT_MARGIN)
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
            .attr("y", 3*NODE_HEIGHT/4 - HEIGHT_MARGIN)
            .attr("x", 50)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("font-family", "Helvetica, Arial, Sans-Serif")

            // use the full name if possible, if not available use the synonym
            // and if neither is defined use a default "NO NAME" name.
            .text(function() {
                if ((concept.full == null || concept.full == "" ) &&
                    (concept.synonym == null || concept.synonym == "")) {
                    return "NO NAME";
                }
                else if (concept.full == null || concept.full == "") {
                    return concept.synonym;
                }
                return concept.full;
            })

            .style("fill-opacity", 1);
    },

    /**
     * Draw a attribute rectangle in given grouping element.
     */
    drawAttributeRectangle: function(group) {

        group.append("rect")
            .attr("class", "outer")
            .attr("width", 50)
            .attr("height", NODE_HEIGHT)
            .attr("rx",(NODE_HEIGHT)/2)
            .attr("ry",(NODE_HEIGHT)/2)
            // apply the correct colours depending on definition status
            .style("fill", "white")
            .style('stroke', 'black');

        /** Set an inner rect which is a copy of outer if the definition_status is primitive
         *  Otherwise, it will be a blue rect inside of a white rect
         */
        group.append("rect")
            .attr("class", "inner")
            .attr("width", 50)
            .attr("height", NODE_HEIGHT - DEFINED_CONCEPT_BORDER*2)
            .attr("rx",(NODE_HEIGHT - DEFINED_CONCEPT_BORDER*2)/2)
            .attr("ry",(NODE_HEIGHT - DEFINED_CONCEPT_BORDER*2)/2)
            // apply the correct colours depending on definition status
            .style("fill", ConceptDefinitionDiagram.ATTRIBUTE_COLOR)
            .style('stroke', 'black');

    },
    /**
     * Draw id inside given grouping element.
     */
    drawAttributeId: function(group, concept) {
        group.append("text")
            // position text centered in the concept
            .attr("class", "id")
            .attr("y", NODE_HEIGHT/4 + HEIGHT_MARGIN)
            .attr("x", 50)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("font-family", "Helvetica, Arial, Sans-Serif")
            .attr("font-size", 10)

            // use the full name if possible, if not available use the synonym
            // and if neither is defined use a default "NO NAME" name.
            .text(concept.type_id)

            .style("fill-opacity", 1);
    },
    /**
     * Draw text inside given grouping element.
     */
    drawAttributeText: function(group, concept) {
        group.append("text")
            // position text centered in the concept
            .attr("class", "name")
            .attr("y", 3*NODE_HEIGHT/4 - HEIGHT_MARGIN)
            .attr("x", 50)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("font-family", "Helvetica, Arial, Sans-Serif")

            // use the full name if possible, if not available use the synonym
            // and if neither is defined use a default "NO NAME" name.
            .text(concept.type_name)

            .style("fill-opacity", 1);
    }
});

module.exports = ConceptDefinitionDiagram;
