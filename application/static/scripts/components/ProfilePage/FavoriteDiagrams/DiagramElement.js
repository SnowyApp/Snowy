import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Diagram element in favorite diagrams table
 */
var DiagramElement = React.createClass({
    propTypes: {
        key:                React.PropTypes.number,
        name:               React.PropTypes.string,
        dict:               React.PropTypes.object,
        language:           React.PropTypes.string,
        id:                 React.PropTypes.number,
        date:               React.PropTypes.string,
        parameters:         React.PropTypes.object,
        openDiagram:        React.PropTypes.func,
        removeDiagram:      React.PropTypes.func
    },

    getInitialState: function(){
        return ({
            isOpen: false,
            buttonEnabled: true
        });
    },

   /**
    * Toggles accordion body
    */
    openAcc: function(){
        const disableTime = 400;
        if(this.state.buttonEnabled){
            //Update states and disable this function for a short time to prevent problems from clicking too fast
            this.setState({
                isOpen: !this.state.isOpen,
                buttonEnabled: false
            })
        }
        //Reenable function after disableTime ms 
        setTimeout($.proxy(function(){
            this.setState({
                buttonEnabled: true
            })
        }, this), disableTime);
    },

    render: function(){
        //Different background colors depending on if the accordion is expanded
        const openCSS = (this.state.isOpen ? {backgroundColor: "#d9edf7"} : null);
        return(
            <tbody>
                <tr style={openCSS} className="favorites">
                    <td className="favorites">
                        <div className="panel-heading diagramAccordion" role="tab" id="headingOne">
                            <a className="favorites" href="#" onClick={this.props.openDiagram.bind(null, this.props.id)}>
                                {this.props.name}
                            </a>
                        </div>
                    </td>
                    <td id="infoGlyph" className="favorites glyph">
                        <a
                            role="button"
                            className="collapsed favorites"
                            onClick={this.openAcc}
                            data-toggle="collapse"
                            href={"#" + this.props.id}
                            aria-expanded="false"
                        >
                            <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                        </a>
                    </td>
                    <td className="favorites">
                        {this.props.date}
                    </td>
                    <td id="removeGlyph" className="favorites glyph" onClick={this.props.removeDiagram.bind(null, this.props.id)}>
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </td>
                </tr>
                <tr>
                    <td colSpan="4">
                        <div id={this.props.id} className="panel-collapse collapse" role="tabpanel">
                            <div className="diagramHidden">
                                <table className="diagramHidden">
                                    <tbody>
                                        <tr>                                    
                                            <td>id:</td>
                                            <td>{this.props.id}</td>
                                        </tr>
                                        <tr>                                    
                                            <td>{this.props.dict[this.props.language]["date"]}:</td>
                                            <td>{this.props.date}</td>
                                        </tr>
                                        <tr>                                    
                                            <td>Parameter 1:</td>
                                            <td>{this.props.parameters.p1}</td>
                                        </tr>
                                        <tr>                                    
                                            <td>Parameter 2:</td>
                                            <td>{this.props.parameters.p2}</td>
                                        </tr>      
                                        <tr>                                    
                                            <td>Parameter 3:</td>
                                            <td>{this.props.parameters.p3}</td>
                                        </tr>                                       
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        );
    }
});
module.exports = DiagramElement;
