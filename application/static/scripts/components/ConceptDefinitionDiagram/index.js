import React from "react";
import ReactDOM from "react-dom";

var ConceptDefinitionDiagram = React.createClass({
    
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
        $.when(this.getConcept(props.id), this.getRelations(props.id))
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
                console.log("Could not get releations for Concept Definitiion" + 
                        " Diagram.");
            }.bind(this)
        });
    },

    /**
     * Draw the diagram.
     */
    draw: function(data) {
        d3.select(ReactDOM.findDOMNode(this)).append("circle")
            .attr({
                cx: 200,
                cy: 200,
                r: 20,
                fill: "red",
                stroke: "green"
            });
    }
});

module.exports = ConceptDefinitionDiagram;
