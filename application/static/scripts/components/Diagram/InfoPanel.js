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
        url:            React.PropTypes.string
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
        //this.getParents(nextProps.data[0].concept_id);
        console.log(nextProps);
    },
    /*
    * Function to call API to get parents of selected concept
    */
    getParents: function(id){
        console.log("HEJ");
        if (cookie.load('userId') != null) {
            $.ajax({
                method: "GET",
                url: this.props.url + "/get_parents/" + id,
                success: function (data) {
                    console.log(data);
                    var parents = [];
                    for(var i = 0; i < data.length; i++){
                        parents.push({
                            id: data[i].id,
                            name: data[i].term
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
        return (
            <div className="panel panel-default infoPanel">
                <div className="panel-heading infoPanelHandle">
                    {this.dict[this.props.language]["termInfo"]}
                    <button onClick={this.props.hidePanel} className="close closeInfoButton" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="panel-body">
                    <table className="table table-condensed">
                        <caption>{this.dict[this.props.language]["parents"]}</caption>
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
                            <tr><td>Environment or geographical location hej hej hej hej hej (environment / location)</td><td>900000000000441003</td></tr>
                            <tr><td>Environment or geographical location hej hej hej hej hej (environment / location)</td><td>900000000000441003</td></tr>
                            <tr><td>Environment or geographical location hej hej hej hej hej (environment / location)</td><td>900000000000441003</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = InfoPanel;
