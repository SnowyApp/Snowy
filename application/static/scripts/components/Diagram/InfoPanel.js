import React from 'react';
import ReactDOM from 'react-dom';
require('bootstrap');

var InfoPanel = React.createClass({
    render: function(){
        return (
            <div className="panel panel-default infoPanel">
                <div className="panel-heading infoPanelHandle">Panel heading without title</div>
                <div className="panel-body">
                    Panel content
                </div>
            </div>
        );
    }
});

module.exports = InfoPanel;
