import React from 'react';
import ReactDOM from 'react-dom';
require('bootstrap');

var InfoPanel = React.createClass({
    propTypes: {
        hidePanel:      React.PropTypes.func,
        data:           React.PropTypes.array
    },

    render: function(){
        const termName = (this.props.data.length > 0 ? this.props.data[0].name : "");
        return (
            <div className="panel panel-default infoPanel">
                <div className="panel-heading infoPanelHandle">{termName}</div>
                <div className="panel-body">
                    Panel content
                </div>
            </div>
        );
    }
});

module.exports = InfoPanel;
