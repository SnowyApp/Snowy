import React from 'react';
import ReactDOM from 'react-dom';
import PageClick from 'react-page-click';
import cookie from 'react-cookie';
import Button from 'react-bootstrap/lib/Button';

/**
 * This component handles the saving of a favorite diagram.
 */
var SaveDiagram = React.createClass({
    propTypes: {
        language:       React.PropTypes.string,
        saveDiagram:    React.PropTypes.func
    },

    //Dict for supported languages
    dict: {
        se: {
            saveDiagram:        "Spara diagram",
            name:               "Namn",
            optionalName:       "Frivilligt namn",
            desc:               "Beskrivning",
            optionalDesc:       "Frivillig Beskrivning",
            save:               "Spara",
            successMessage:     "Diagrammet har sparats",
            errorMessage:       "Diagrammet kunde inte sparas",
            savingMessage:      "Sparar diagrammet..."
        },
        en: {
            saveDiagram:        "Save diagram",
            name:               "Name",
            optionalName:       "Optional name",
            desc:               "Description",
            optionalDesc:       "Optional description",
            save:               "Save",
            successMessage:     "Diagram has been saved",
            errorMessage:       "Diagram could not be saved",
            savingMessage:      "Saving diagram..."
        }
    },

    getInitialState() {
        return {
            showSavePanel: false,
            diagramName: "",
            diagramDesc: "",
            statusMessage: {
                message: "",
                type: "none"
            }
        };
    },

    /**
    * Updates the name state to match input
    */
    updateName: function (e) {
        this.setState({
            diagramName: e.target.value
        });
    },

    /**
    * Updates the description state to match input
    */
    updateDesc: function (e) {
        this.setState({
            diagramDesc: e.target.value
        });
    },

    /**
    * Toggles showing/hiding the save panel
    */
    toggleSavePanel: function () {
        this.setState({
            showSavePanel: !this.state.showSavePanel
        });
    },

    /**
    * Hides the save panel
    */
    hideSavePanel: function () {
            this.setState({
                showSavePanel: false
            })
    },

    /**
    * Handles submitting of saving a diagram
    */
    handleSubmit: function (e) {
        e.preventDefault();
        const diagramName = this.state.diagramName;
        const diagramDesc = this.state.diagramDesc;
        this.props.saveDiagram(diagramName, diagramDesc, this.diagramSaved);
        this.setState({
            statusMessage: {
                message: this.dict[this.props.language]["savingMessage"],
                type: "working"
            }
        });
    },

    /**
    * This function is sent to saveDiagram so that saveDiagram has a way to let
    * this component know if it failed or succeeded.
    * This is necessary to be able to update the status message accordingly.
    */
    diagramSaved: function(status){
        if(status){
            this.setState({
                diagramName: "",
                diagramDesc: "",
                statusMessage: {
                    message: this.dict[this.props.language]["successMessage"],
                    type: "success"
                }
            });
        } else {
            this.setState({
                statusMessage: {
                    message: this.dict[this.props.language]["errorMessage"],
                    type: "error"
                }
            });
        }
    },

    render: function () {
        //Show save panel if showSavePanel state is true
        const showSavePanel = (this.state.showSavePanel ? null : {display: "none"});

        //Display a status message if statusMessage state is set
        var statusMessage = this.state.statusMessage;
        var statusMessageStyle;
        if(statusMessage.type == "success"){
            statusMessageStyle = {color: "#248d24"}
        } else if (statusMessage.type == "working") {
            statusMessageStyle = {color: "orange"}
        } else if (statusMessage.type == "error") {
            statusMessageStyle = {color: "red"}
        }

        return (
            <PageClick onClick={this.hideSavePanel}>
                <div className="saveDiagramWrapper">
                    <Button
                        className="save-diagram"
                        bsStyle="primary"
                        onClick={this.toggleSavePanel}
                        disabled = {this.props.diagramView == "definition"}
                    >
                        {this.dict[this.props.language]["saveDiagram"]}
                    </Button>
                    {/* Save panel */}
                    <div style={showSavePanel} className="panel panel-primary saveDiagramPanel">
                        <div className="panel-body">
                            {/* Save form */}
                            <div className="form-group">
                                <label htmlFor="diagramName">
                                    {this.dict[this.props.language]["name"]}
                                </label>
                                <input
                                    onChange={this.updateName}
                                    type="text"
                                    className="form-control"
                                    placeholder={this.dict[this.props.language]["optionalName"]}
                                    value={this.state.diagramName}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="diagramName">
                                    {this.dict[this.props.language]["desc"]}
                                </label>
                                <textarea
                                    onChange={this.updateDesc}
                                    className="form-control diagramDesc"
                                    rows="3"
                                    placeholder={this.dict[this.props.language]["optionalDesc"]}
                                    value={this.state.diagramDesc}
                                >
                                </textarea>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-2 saveDiagramSubmitWrapper">
                                    <button type="submit" onClick={this.handleSubmit} className="btn btn-success">
                                        {this.dict[this.props.language]["save"]}
                                    </button>
                                </div>
                                <span style={statusMessageStyle} className="col-sm-10 statusMessage">{this.state.statusMessage.message}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </PageClick>
        );
    }
});

module.exports = SaveDiagram;
