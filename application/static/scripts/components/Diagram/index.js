var Chart = require("./Chart");
import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/lib/Button';

module.exports = React.createClass({
    /**
    * Set the state of data and domain to given props or default values if not
    * given.
    */
    getInitialState: function() {
        return {
            data: [],
            view:  'vertical'
        };
    },

    update: function(data) {
        if (data === undefined) return;

        this.setState({
            data: data
        });

        if (this._chart !== undefined) {
            this.reset();
        }
    },

    /**
     * Set original state from props before rendering.
     */
    componentWillMount: function() {
        this.update(this.props.data);
    },

    /**
     * Update state when receiving new props
     */
    componentWillReceiveProps: function(nextProps) {
        //this.resetZoom();
        this.update(nextProps.data);
    },

    /**
    * Render the diagram from the current state.
    */
    render: function() {
        return (
            <div className="diagram">
                <Button bsStyle="primary" onClick={this.reset}>Reset</Button>
                <Button bsStyle="primary" onClick={this.resetZoom}>Reset zoom</Button>
                <Button bsStyle="primary" onClick={this.changeView}>Vertical/Horizontal view</Button>
                <Chart
                    ref={ (ref) => this._chart = ref }
                    data={this.state.data}
                    view={this.state.view}
                    onClick={this.onNodeClick} />
            </div>
        );
    },

    /**
     * Return an ID for d3 node
     */
    getId: function() {
        return this._chart.getId();
    },

    /**
     * Show/hide children of node on click.
     */
    onNodeClick: function(id) {
        this.props.updateConceptChildren(id);
    },

    resetZoom: function(){
        this._chart.resetZoom();
    },

    reset: function() {
        this._chart.resetDiagram();
    },

    changeView: function(){
      if(this.state.view == 'vertical') {
          this.setState({
              view: 'horizontal'
          })
      }
        else {
          this.setState({
              view: 'vertical'
          })
      }
    }
});
