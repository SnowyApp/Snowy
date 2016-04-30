import React from "react";
import ReactDOM from "react-dom";

var ConceptGraph = React.createClass({
    

    getInitialState: function() {
        console.log("GET INITIAL STATE");
        return {};
    },
    
    
    /**
     *
     */
    componentDidMount: function() {
        console.log("COMPONENT DID MOUNT");
        this.update(this.props);
    },

    /**
     * 
     */
    shouldComponentUpdate: function(props) {
        console.log("SHOULD COMPONENENT UPDEATE");
        // no point of doing anything if the same id was given
        if (props.conceptId == this.props.conceptId) return false;

        this.update(props);
        return false;
    },

    /**
     * Render the contents of the ConceptGraph
     */
    render: function() {
        console.log("RENDER");
        return <svg width="100%" height="100%"></svg>;
    },

    /**
     * Fetch data for concept-graph.
     */
    update: function(props) {
        // TODO: Calls for concept and attributes
        d3.select(ReactDOM.findDOMNode(this)).append("circle")
            .attr({
                cx: 200,
                cy: 200,
                r: 20,
                fill: "red",
                stroke: "green"
            });
    },
});

module.exports = ConceptGraph;
