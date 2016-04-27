var InfoPanel = require('./InfoPanel');

import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import Draggable from 'react-draggable';

var diagram = require("./d3Diagram");

var Diagram = React.createClass({
    //Dictionary for supported languages
    dict: {
        se: {
            'reset':        'Reset',
            'resetZoom':    'Återställ zoom',
            'VHView':       'Vertikal/Horisontell vy'
        },
        en: {
            'reset':        'Reset',
            'resetZoom':    'Reset zoom',
            'VHView':       'Vertical/Horizontal view'
        }
    },

    /**
    * Set the state of data and domain to given props or default values if not
    * given.
    */
    getInitialState: function() {
        return {
            data: [],
            view:  'vertical',
            showInfoPanel: false
        };
    },

    update: function(data) {
        if (data === undefined) return;

        this.setState({
            data: data
        });

        if (this.diagram !== undefined) {
            this.reset();
        }
    },

    componentDidMount: function() {
        diagram.create(this._d3, { onClick: this.onNodeClick },
                this.getDiagramState());
    },

    componentDidUpdate: function(prevProps, prevState) {
        var element = this._d3;

        // if the diagram data has been initialised and contains data
        // then update the diagrams state.
        // otherwise create a diagram
        if (prevProps.data !== undefined && prevProps.data.length == 0) {
            diagram.create(element, { onClick: this.onNodeClick }, 
                this.getDiagramState());
        } else if (prevState.view !== undefined &&
                prevState.view != this.state.view) {
            diagram.destroy();
            diagram.create(element, { onClick: this.onNodeClick },
                    this.getDiagramState());
        }
        else {
            diagram.update(element, this.getDiagramState());
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
    * Toggles between showing/hiding the info panel
    */
    toggleInfoPanel: function(){
        this.setState({
            showInfoPanel: !this.state.showInfoPanel
        });
    },

    componentWillUnmount: function() {
        diagram.destroy();
    },

    /**
    * Render the diagram from the current state.
    */
    render: function() {
        const showInfoPanel = (this.state.showInfoPanel ? null : {display: "none"});
        return (
            <div className="diagram">
                <Button 
                    bsStyle="primary" 
                    onClick={this.reset}>
                    {this.dict[this.props.language]["reset"]}
                </Button>
                <Button 
                    bsStyle="primary" 
                    onClick={this.resetZoom}>
                    {this.dict[this.props.language]["resetZoom"]}
                </Button>
                <Button 
                    bsStyle="primary" 
                    onClick={this.changeView}>
                    {this.dict[this.props.language]["VHView"]}
                </Button>
                <div className="d3diagram"
                    ref={ (ref) => this._d3 = ref}>
                </div>

                //Button to open info panel
                <span onClick={this.toggleInfoPanel} className="glyphicon glyphicon-info-sign infoPanelButton" aria-hidden="true"></span> 

                //Term info panel
                <Draggable
                    handle=".infoPanelHandle"
                    zIndex={1000}
                    bounds=".diagram">
                    <div style={showInfoPanel} className="infoPanelWrapper">
                        <InfoPanel
                            hidePanel={this.toggleInfoPanel}
                            data={this.state.data}
                        />
                    </div>
                </Draggable>
            </div>
        );
    },

    /**
     * Return an ID for d3 node
     */
    getId: function() {
        return diagram.getId();
    },

    /**
     * Show/hide children of node on click.
     */
    onNodeClick: function(id) {
        this.props.updateConceptChildren(id);
    },

    resetZoom: function(){
        diagram._resetZoom(this._d3);
    },

    getDiagramState: function() {
        return {
            data: this.state.data,
            view: this.state.view
        };
    },

    reset: function() {
        var element = this._d3;
        diagram.reset(element, this.getDiagramState());
    },

    changeView: function(){
        if(this.state.view == 'vertical') {
            this.setState({
                view: 'horizontal'
            });
        }
        else {
            this.setState({
                view: 'vertical'
            });
      }
    }
});
module.exports = Diagram;
