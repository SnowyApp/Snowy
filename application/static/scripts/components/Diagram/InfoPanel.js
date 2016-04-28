import React from 'react';
import ReactDOM from 'react-dom';
require('bootstrap');

var InfoPanel = React.createClass({
    propTypes: {
        hidePanel:      React.PropTypes.func,
        data:           React.PropTypes.array,
        language:       React.PropTypes.string
    },

    dict: {
        se: {
            termInfo:           "Terminformation"
        },
        en: {
            termInfo:           "Term information"
        }
    },

    render: function(){
        const termName = (this.props.data.length > 0 ? this.props.data[0].name : "");
        return (
            <div className="panel panel-default infoPanel">
                <div className="panel-heading infoPanelHandle">
                    {this.dict[this.props.language]["termInfo"]}
                    <button onClick={this.props.hidePanel} className="close closeInfoButton" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="panel-body">
                    Panel content
                </div>
            </div>
        );
    }
});

module.exports = InfoPanel;
