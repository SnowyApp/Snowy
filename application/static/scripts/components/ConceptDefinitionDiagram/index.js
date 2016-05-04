import React from "react";
import ReactDOM from "react-dom";

var ConceptDefinitionDiagram = React.createClass({
    

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
                // draw the diagram using newly
                this.draw();
            }.bind(this));        
    },

    /**
     * Draw the diagram.
     */
    draw: function() {
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
