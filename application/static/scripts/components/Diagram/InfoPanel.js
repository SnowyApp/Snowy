import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
require('bootstrap');

/*
* Component to show information about selected concept
*/
var InfoPanel = React.createClass({
    propTypes: {
        hidePanel:          React.PropTypes.func,
        data:               React.PropTypes.array,
        language:           React.PropTypes.string,
        url:                React.PropTypes.string,
        update:             React.PropTypes.func,
        favoriteTerms:      React.PropTypes.array,
        removeFavoriteTerm: React.PropTypes.func,
        addFavoriteTerm:    React.PropTypes.func
    },
    //Dict with supported languages
    dict: {
        se: {
            termInfo:           "Terminformation",
            name:               "Namn",
            names:              "Namn",
            type:               "Typ",
            acceptability:      "Acceptans",
            parents:            "Föräldrar",
            generalInfo:        "Generell information",
            relations:          "Relationer",
            destination:        "Destination",
            charType:           "CharType",
            attribute:          "Attribut",
            saveFavorite:       "Spara favorit",
            saved:              "Sparad!",
            removeFavorite:     "Ta bort favorit",
            children:           "Barn",
            conceptType:        "Koncepttyp"
        },
        en: {
            termInfo:           "Term information",
            name:               "Name",
            names:              "Names",
            type:               "Type",
            acceptability:      "Acceptability",
            parents:            "Parents",
            generalInfo:        "General information",
            relations:          "Relations",
            destination:        "Destination",
            charType:           "CharType",
            attribute:          "Attribute",
            saveFavorite:       "Save favorite",
            saved:              "Saved!",
            removeFavorite:     "Remove favorite",
            children:           "Children",
            conceptType:        "Concept type"
        }
    },

    getInitialState: function(){
        return ({
            parents: [],
            names: [],
            relations: [],
            isFavorited: false
        });
    },

    componentWillReceiveProps: function(nextProps){
        this.props = nextProps;
        this.getParents(this.props.data[0].concept_id);
        this.getNames(this.props.data[0].concept_id);
        this.getRelations(this.props.data[0].concept_id);
        this.isFavorited(this.props.data[0].concept_id);
    },

   /**
    * Sets the favorited state to true of the given id is in the favorites list
    */
    isFavorited: function(id){
        //Return if favorites hasnt been initialized yet
        if(this.props.favoriteTerms == null) return;

        var favorited = false;
        for(var i = 0; i < this.props.favoriteTerms.length; i++){
            if(this.props.favoriteTerms[i].id == id) favorited = true;
        }
        this.setState({
            isFavorited: favorited
        });
    },

    /**
    * Gets all relations for a given id
    */
    getRelations: function(id){
        if (cookie.load('userId') != null) {
            $.ajax({
                method: "GET",
                url: this.props.url + "/get_relations/" + id,
                success: function (data) {
                    var relations = [];
                    var name = "";
                    for(var i = 0; i < data.length; i++){
                        name = (data[i].synonym.length > 0 ? data[i].synonym : data[i].full);
                        relations.push({
                            name: name,
                            type: data[i].type_name,
                            charType: "(Inferred)" //TODO: Fix real data
                        });
                    }
                    this.setState({
                        relations: relations
                    });
                }.bind(this),
                error: function (textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                    console.log("Failed getting names.");
                },
                contentType: "application/json",
                dataType: "json"
            });
        }
    },

   /**
    * Gets all names for a given id
    */
    getNames: function(id){
        if (cookie.load('userId') != null) {
            $.ajax({
                method: "GET",
                url: this.props.url + "/get_names/" + id,
                success: function (data) {
                    var names = [];
                    for(var i = 0; i < data.length; i++){
                        names.push({
                            name: data[i].name,
                            type: data[i].type,
                            acceptability: data[i].acceptability
                        });
                    }
                    this.setState({
                        names: names
                    });
                }.bind(this),
                error: function (textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                    console.log("Failed getting names.");
                },
                contentType: "application/json",
                dataType: "json"
            });
        }
    },

    /*
    * Function to call API to get parents of id
    */
    getParents: function(id){
        if (cookie.load('userId') != null) {
            $.ajax({
                method: "GET",
                url: this.props.url + "/get_parents/" + id,
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

   /**
    * Calls back to the top container to add favorite term
    */
    addFavorite: function(args){;
        this.props.addFavoriteTerm(args.id, args.name);
    },

    render: function(){
        //Check if data is set yet, otherwise return
        if(this.props.data.length == 0) return null;

        var saveTermButton = (this.state.isFavorited ?
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm saveTermButton"
                                    onClick={this.props.removeFavoriteTerm.bind(null, this.props.data[0].concept_id)}>
                                    {this.dict[this.props.language]["removeFavorite"]}
                                </button>
                                :
                                <button
                                    type="button"
                                    className="btn btn-success btn-sm saveTermButton"
                                    onClick={this.addFavorite.bind(null,{id: this.props.data[0].concept_id, name: this.props.data[0].name})}>
                                    {this.dict[this.props.language]["saveFavorite"]}
                                </button>)

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
        //Create table rows for all names
        var namesArray = this.state.names.map(function(name){
            return (
                    <tr key={name.name}>
                        <td>
                            {name.type}
                        </td>
                        <td>
                            {name.name}
                        </td>
                        <td>
                            {name.acceptability}
                        </td>
                    </tr>
                );
        });
        var showRelations = null;
        if(this.state.relations.length > 0){
            //Create table rows for all relations
            var relationsArray = this.state.relations.map(function(relation){
                return (
                        <tr key={relation.name}>
                            <td>
                                {relation.type}
                            </td>
                            <td>
                                {relation.name}
                            </td>
                            <td>
                                {relation.charType}
                            </td>
                        </tr>
                    );
            });
        } else {
            showRelations = {display: "none"};
        }

        return (
            <div className="panel panel-info infoPanel">
                <div className="panel-heading infoPanelHandle">
                    {this.props.data[0].name}
                    <button onClick={this.props.hidePanel} className="close closeInfoButton" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="panel-body infoPanelBody">
                    {saveTermButton}

                    {/* General info TODO: Fix real data for concept type and status*/}
                    <h3>
                        {this.dict[this.props.language]["generalInfo"]}
                    </h3>
                    <div className="well">
                        <table className="termInfo">
                            <tbody>
                                <tr className="termInfo">
                                    <td className="termInfoName">ID:</td>
                                    <td className="termInfoData">{this.props.data[0].concept_id}</td>
                                </tr>
                                <tr className="termInfo">
                                    <td className="termInfoName">{this.dict[this.props.language]["children"]}:</td>
                                    <td className="termInfoData">{this.props.data[0].children.length}</td>
                                </tr>
                                <tr className="termInfo">
                                    <td className="termInfoName">this.dict[this.props.language]["conceptType"]}:</td>
                                    <td className="termInfoData">(Fully defined)</td>
                                </tr>
                                <tr className="termInfo">
                                    <td className="termInfoName">Status:</td>
                                    <td className="termInfoData">(Active)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Names */}
                    <h3>{this.dict[this.props.language]["names"]}
                    </h3><div className="well">
                        <table className="table table-condensed">
                            <thead>
                                <tr>
                                    <th id="name_type" className="namesTable">
                                        {this.dict[this.props.language]["type"]}
                                    </th>
                                    <th id="name_name" className="namesTable">
                                        {this.dict[this.props.language]["name"]}
                                    </th>
                                    <th id="name_acceptability" className="namesTable">
                                        {this.dict[this.props.language]["acceptability"]}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {namesArray}
                            </tbody>
                        </table>
                    </div>
                    {/* Parents */}
                    <h3 style={showParents}>{this.dict[this.props.language]["parents"]}</h3>
                    <div style={showParents} className="well">
                        <table style={showParents} className="table table-condensed parentsTable">
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
                    {/* Relations */}
                    <h3 style={showRelations}>{this.dict[this.props.language]["relations"]}</h3>
                    <div style={showRelations} className="well">
                        <table className="table table-condensed">
                            <thead>
                                <tr>
                                    <th id="relation_type" className="relationsTable">
                                        {this.dict[this.props.language]["attribute"]}
                                    </th>
                                    <th id="relation_destination" className="relationsTable">
                                        {this.dict[this.props.language]["destination"]}
                                    </th>
                                    <th id="relation_chartype" className="relationsTable">
                                        {this.dict[this.props.language]["charType"]}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {relationsArray}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = InfoPanel;
