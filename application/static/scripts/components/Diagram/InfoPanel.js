import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';
require('bootstrap');

/*
* Component to show information about selected concept
*/
var InfoPanel = React.createClass({
    propTypes: {
        hidePanel:      React.PropTypes.func,
        data:           React.PropTypes.array,
        language:       React.PropTypes.string,
        url:            React.PropTypes.string,
        update:         React.PropTypes.func
    },
    //Dict with supported languages
    dict: {
        se: {
            termInfo:           "Terminformation",
            name:               "Namn",
            parents:            "Föräldrar"
        },
        en: {
            termInfo:           "Term information",
            name:               "Name",
            parents:            "Parents"
        }
    },

    getInitialState: function(){
        return ({
            parents: []
        });
    },

    componentWillReceiveProps: function(nextProps){
        this.props = nextProps;
        this.getParents();
    },

    /*
    * Function to call API to get parents of selected concept
    */
    getParents: function(){
        if (cookie.load('userId') != null) {
            $.ajax({
                method: "GET",
                url: this.props.url + "/get_parents/" + this.props.data[0].concept_id,
                success: function (data) {
                    var parents = [];
                    for(var i = 0; i < data.length; i++){
                        //Get synonym if exists, otherwise full name
                        var name = (data[i].synonym.length > 0 ? data[i].synonym : data[i].full);
                        parents.push({
                            id: data[i].id,
                            name: name
                        });
                    }
                    this.setState({
                        parents: parents
                    });
                }.bind(this),
                error: function (textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                    console.log("Failed getting parents.");
                },
                contentType: "application/json",
                dataType: "json"
            });
        }
    },

    render: function(){
        var showParents = null;
        if(this.state.parents.length > 0){
            //Create table rows for all parents
            var parentArray = this.state.parents.map(function(parent){
                return (
                    <tr className="parentsTable" key={parent.id} onClick={this.props.update.bind(null,parent.id)}>
                        <td>
                            {parent.name}
                        </td>
                        <td>
                            {parent.id}
                        </td>
                    </tr>
                );
            }, this);
        } else {
            showParents = {display: "none"};
        }
        //Get name only if defined
        const termName = (this.props.data.length > 0 ? this.props.data[0].name : "");
        return (
            <div className="panel panel-info infoPanel">
                <div className="panel-heading infoPanelHandle">
                    {termName}
                    <button onClick={this.props.hidePanel} className="close closeInfoButton" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="panel-body">
                    <table style={showParents} className="table table-condensed table-hover parentsTable">
                        <caption className="parentsTable">{this.dict[this.props.language]["parents"]}</caption>
                        <thead>
                            <tr>
                                <th id="parent_name" className="parentsTable">
                                    {this.dict[this.props.language]["name"]} 
                                </th>
                                <th id="parent_id" className="parentsTable">
                                    ID 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {parentArray}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = InfoPanel;
