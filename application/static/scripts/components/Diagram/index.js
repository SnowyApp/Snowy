/**
 * This is the react-component for the diagram area
 * The area contains the buttons, diagram and profilepage when either view
 * is in focus.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import Draggable from 'react-draggable';

var diagram = require("./d3Diagram");
var InfoPanel = require('./InfoPanel');
var SaveDiagram = require('./SaveDiagram');
var ConceptDefinitionDiagram = require('../ConceptDefinitionDiagram/index');
var Export = require('../Export/index');


var Diagram = React.createClass({
    propTypes: {
        favoriteTerms:      React.PropTypes.array,
        removeFavoriteTerm: React.PropTypes.func,
        addFavoriteTerm:    React.PropTypes.func,
        saveDiagram:        React.PropTypes.func
    },

    //Dictionary for supported languages
    dict: {
        se: {
            'reset':            'Återställ diagram',
            'resetZoom':        'Återställ zoom',
            'VHView':           'Horisontal',
            'diagramView':      'Byt diagram vy',
            'fullscreen':       'Helskärm',
            'exitFullscreen':   'Avsluta helskärmsläge'
        },
        en: {
            'reset':            'Reset Diagram',
            'resetZoom':        'Reset Zoom',
            'VHView':           'Horizontal',
            'diagramView':      'Change diagram view',
            'fullscreen':       'Fullscreen',
            'exitFullscreen':   'Exit fullscreen'

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
            showInfoPanel: false,
            diagramView: "hierarchy",
            fullscreen: false
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
        else if (prevProps.data != this.props.data){
            diagram.update(element, this.getDiagramState());
        }
    },

    /**
     * Set original state from props before rendering.
     */
    componentWillMount: function() {
        /* Adds an eventlistener to check when fullscreen has changed */
        if (document.addEventListener)
        {
            document.addEventListener('webkitfullscreenchange', this.checkFullscreen, false);
            document.addEventListener('mozfullscreenchange', this.checkFullscreen, false);
            document.addEventListener('fullscreenchange', this.checkFullscreen, false);
            document.addEventListener('MSFullscreenChange', this.checkFullscreen, false);
        }
        this.update(this.props.data);
    },

    /**
     * Update state when receiving new props
     */
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.data != this.props.data) {
            this.update(nextProps.data);
        }
    },

    /**
     * Toggles between showing/hiding the info panel
     */
    toggleInfoPanel: function(){
        this.setState({
            showInfoPanel: !this.state.showInfoPanel
        });
    },
    /**
     * Toggles between the two diagram types
     */
    toggleDiagramView: function() {
        if (this.state.diagramView == "definition") {
            this.setState({
                diagramView: "hierarchy"
            });
        }else{
            this.setState({
                diagramView: "definition"
            });
        }

    },
    // Calls on the diagram to remove all its elements
    componentWillUnmount: function() {
        diagram.destroy();
    },

    /**
     * Render the diagram from the current state.
     */
    render: function() {
        const showInfoPanel = (this.state.showInfoPanel ? null : {display: "none"});
        const diagramId = "diagram" + (this.state.fullscreen ? "-fullscreen" : "");
        return (
            <div className="diagram" id={diagramId}> 
                <div className="btn-group">
                <Button
                    onClick={this.reset}
                    disabled = {this.state.diagramView == "definition"}>
                    {this.dict[this.props.language]["reset"]}
                </Button>
                <Button
                    onClick={this.resetZoom}
                    disabled = {this.state.diagramView == "definition"}>
                    {this.dict[this.props.language]["resetZoom"]}
                </Button>
                <Button
                    onClick={this.changeView}
                    disabled = {this.state.diagramView == "definition"}>
                    {this.dict[this.props.language]["VHView"]}
                </Button>
                <Button
                    onClick={this.toggleDiagramView}>
                    {this.dict[this.props.language]["diagramView"]}
                </Button>
                <SaveDiagram
                    language={this.props.language}
                    saveDiagram={this.props.saveDiagram}
                    diagramView={this.state.diagramView}
                />
                <Button
                    id="fullscreenButton"
                    onClick={this.toggleFullscreen}>
                    {this.state.fullscreen ? this.dict[this.props.language]["exitFullscreen"] : this.dict[this.props.language]["fullscreen"]}
                </Button>
                <Export language={this.props.language} selectedTerm={this.props.selectedTerm} diagramView={this.state.diagramView} exitFullscreen={this.exitFullscreen}/>


               </div>
                <span onClick={this.toggleInfoPanel} className="glyphicon glyphicon-info-sign infoPanelButton" aria-hidden="true"></span>
 
                <div className={this.state.diagramView == "definition" ? "hiddenDiagram" : "d3diagram"}
                     ref={ (ref) => this._d3 = ref}>
                </div>
                <div className={this.state.diagramView == "hierarchy" ? "hiddenDiagram" : "conceptDiagram"}>
                    <ConceptDefinitionDiagram
                        serverUrl={this.props.url}
                        concept_id={this.props.selectedTerm}
                    />
                </div>

                <Draggable
                    handle=".infoPanelHandle"
                    zIndex={1000}
                    bounds=".diagram">
                    <div style={showInfoPanel} className="infoPanelWrapper">
                        <InfoPanel
                            hidePanel={this.toggleInfoPanel}
                            data={this.state.data}
                            language={this.props.language}
                            url={this.props.url}
                            update={this.props.update}
                            favoriteTerms={this.props.favoriteTerms}
                            removeFavoriteTerm={this.props.removeFavoriteTerm}
                            addFavoriteTerm={this.props.addFavoriteTerm}
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
    // Calls on the diagram to reset its zoom
    resetZoom: function(){
        diagram._resetZoom(this._d3);
    },

    getDiagramState: function() {
        return {
            data: this.state.data,
            view: this.state.view,
            language: this.props.language
        };
    },
    // Calls on the diagram to reset its positions
    reset: function() {
        var element = this._d3;
        diagram.reset(element, this.getDiagramState());
    },

    // Switches the treeview between vertical and horizontal
    changeView: function(){
        // update the state and the display name of the button
        if(this.state.view == 'vertical') {
            this.dict.en.VHView = "Vertical";
            this.dict.se.VHView = "Vertikal";

            this.setState({
                view: 'horizontal'
            });
        }
        else {
            this.dict.en.VHView = "Horizontal";
            this.dict.se.VHView = "Horisontal";

            
            this.setState({
                view: 'vertical'
            });
        }
    },
    // calls the appropraite document.exitFullscren depending on browser
    exitFullscreen: function() {
        const elem = document.getElementById('diagram');
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        this.setState({
            fullscreen: false
        });
    },
    /**
     * Makes sure we have set fullscreen state to correct value on fullscreenchange
     */
    checkFullscreen : function(){
        if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement){
            if(this.state.fullscreen) {
                this.setState({
                    fullscreen: false
                });
            }
        } else {
            if(!this.state.fullscreen) {
                this.setState({
                    fullscreen: true
                });
            }
        }
    },
    /**
     * Toggle between fullscreen and normal view
     */
    toggleFullscreen: function() {
        const elem = document.getElementById('diagram');
        //If the document is not currently in fullscreen, activate fullscreen
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            //There's a different fullscreen api call for each browser
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
            this.setState({
                fullscreen: true
            });
        }
        //If fullscreen is activated, go back to normal
        else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            this.setState({
                fullscreen: false
            });
        }
    }
});

module.exports = Diagram;

