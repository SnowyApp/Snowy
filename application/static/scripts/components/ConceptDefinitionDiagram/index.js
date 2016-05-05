import React from "react";
import ReactDOM from "react-dom";

// The margin between every level of attributes and concepts
const LEVEL_MARGIN = 10;
// Height of the nodes
const NODE_HEIGHT = 50;
// Margin between attributes and concepts (length of arrows)
const NODE_MARGIN = 20;
// Margin between the text and the outline of the node
const WIDTH_MARGIN = 20;
// Styling according to SNOMED CT diagramming guidelines
const CONCEPT_COLOR = '#99CCFF';
const DEFINED_CONCEPT_COLOR = '#CCCCFF';
const DEFINED_CONCEPT_BORDER = 4;
const ATTRIBUTE_COLOR = '#FFFFCC';
// The current level we are drawing on
var level = 0;

var ConceptDefinitionDiagram = React.createClass({
    propTypes:{
        serverUrl: React.PropTypes.string,
        concept_id: React.PropTypes.number
    },
    statics: {
        PRIMITIVE_COLOR : "#99CCFF",
        DEFINED_COLOR : "#CCCCFF"
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
     * Draw the diagram.
     */
    draw: function(data) {
        console.log(data);

        // fetch the svg element
        var svg = d3.select(ReactDOM.findDOMNode(this));

        // draw the concept
        this.drawConcept(svg, data);
    },

    drawAttributeGroup: function(element, concept){

    },

    drawConjunction: function(element, concept){

    },

    drawRelationalOperator: function(element, concept){

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
    drawConcept: function(element, concept) {
        var g = element.append("g")
            .attr("class", "concept");

        // draw a rectangle and text
        this.drawConceptRectangle(g, concept);
        this.drawConceptId(g, concept);
        this.drawConceptText(g, concept);
        // Change the width of the rectangle, to fit entire text + margin
        var textWidth = g.select("text.name").node().getBBox().width;
        var totalWidth = textWidth + WIDTH_MARGIN;
        g.select("rect").attr("width", totalWidth);
        g.select("text.name").attr("x", totalWidth/2);
        g.select("text.id").attr("x", totalWidth/2);

        // return the grouping element
        return g;
    },

    /**
     * Draw a concept rectangle in given grouping element.
     */
    drawConceptRectangle: function(group, concept) {
        return group.append("rect")
            .attr("width", 50)
            .attr("height", 50)
            // apply the correct colours depending on definition status
            .style("fill", (concept.definition_status != "Primitive") ?
                ConceptDefinitionDiagram.PRIMITIVE_COLOR :
                ConceptDefinitionDiagram.DEFINED_COLOR);
    },
    /**
     * Draw id inside given grouping element.
     */
    drawConceptId: function(group, concept) {
        return group.append("text")
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
        return group.append("text")
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
