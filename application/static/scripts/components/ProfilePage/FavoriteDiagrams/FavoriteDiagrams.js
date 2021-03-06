import cookie from 'react-cookie';
import React from 'react';
import ReactDOM from 'react-dom';

var DiagramElement = require('./DiagramElement');

/**
 * Component that displays favorite diagrams in a table
 */
var FavoriteDiagrams = React.createClass({
    propTypes: {
        removeFavoriteTerm: React.PropTypes.func,
        favoriteTerms:      React.PropTypes.array,
        url:                React.PropTypes.string,
        dict:               React.PropTypes.object,
        language:           React.PropTypes.string,
        openDiagram:        React.PropTypes.func,
        removeid:           React.PropTypes.func,
        nameSort:           React.PropTypes.func,
        dateSort:           React.PropTypes.func
    },

    getInitialState: function(){
        return({
            diagrams: [],
            filteredDiagrams: []
        });
    },

    componentDidMount: function(){
        this.getFavoriteDiagrams();
    },

   /**
    * Sort diagrams by header
    */
    sortBy: function(header){
        var asc = true;
        //If already sorting by header, invert order
        if(this.state.sortBy == header){
            asc = !this.state.ascending;
        }
        switch(header){
            case "name":
                this.setState({
                    terms: this.props.nameSort(this.state.diagrams, asc),
                    sortBy: 'name',
                    ascending: asc
                });
                break;
            case "added":
                this.setState({
                    terms: this.props.dateSort(this.state.diagrams, asc),
                    sortBy: 'added',
                    ascending: asc
                });
                break;
        }
    },

   /**
    * Remove element from the diagram table
    */
    removeDiagram: function(id){
        //Remove element locally (for responsiveness)
        const tempFilteredDiagrams = this.props.removeid(this.state.filteredDiagrams, id);
        const tempDiagrams = this.props.removeid(this.state.diagrams, id);
        this.setState({
            diagrams: tempDiagrams,
            filteredDiagrams: tempFilteredDiagrams
        });
        //Remove from database
        if (cookie.load('userId') != null) {
            $.ajax({
                type: "POST",
                method: "DELETE",
                url: this.props.url + "/diagram/" + id,
                headers: {
                    "Authorization": cookie.load("userId")
                },
                success: function () {
                    console.log("Successfully removed diagram.");
                }.bind(this),
                error: function (textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                    console.log("Failed to remove diagram.");
                },
                contentType: "application/json",
                dataType: "json"
            });
        }
    },

   /**
    * Filters the favorite list by user input
    */
    filterDiagrams: function(event){
        const input = event.target.value;
        const regEx = new RegExp(input.toLowerCase());
        var filteredDiagrams = [];
        for(var i = 0; i < this.state.diagrams.length; i++){
            if(regEx.test(this.state.diagrams[i].name.toLowerCase())){
                filteredDiagrams.push(this.state.diagrams[i]);
            }
        }

        this.setState({
            filteredDiagrams: filteredDiagrams
        });
    },

    /**
    * Gets the users favorite diagrams and saves them to the terms state
    */
    getFavoriteDiagrams: function(){
        if (cookie.load('userId') != null) {
            $.ajax({
                type: "GET",
                method: "GET",
                url: this.props.url + "/diagram",
                headers: {
                    "Authorization": cookie.load("userId")
                },
                success: function (data) {
                    var diagrams = [];
                    for(var i = 0; i < data.length; i++){
                        diagrams.push({
                            id: data[i].id,
                            name: data[i].name,
                            created: new Date(data[i].created),
                            modified: new Date(data[i].modified),
                            description: data[i].description
                        });
                    }
                    this.setState({
                        diagrams: diagrams,
                        filteredDiagrams: diagrams
                    }, this.sortBy('added'));
                }.bind(this),
                error: function (textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                },
                contentType: "application/json",
                dataType: "json"
            });
        }
    },

    /*
    * Generates and returns all the diagram table elements
    */
    getDiagramElements: function () {
        //Generate the diagram elements
        var diagramArray = null;
        if(this.state.diagrams.length > 0){
            diagramArray = this.state.filteredDiagrams.map(function(diagram){
                //Date, "0" together with slice(-2) ensures the date format xxxx-xx-xx (e.g 3 -> 03)
                var day = ("0" + diagram.modified.getDate()).slice(-2);
                var month = ("0" + diagram.modified.getMonth()).slice(-2);
                var year = diagram.modified.getUTCFullYear();

                var dateString = year + "-" + month + "-" + day;

                return(
                    <DiagramElement
                        key={diagram.id}
                        name={diagram.name}
                        dict={this.props.dict}
                        language={this.props.language}
                        id={diagram.id}
                        date={dateString}
                        data={diagram.data}
                        description={diagram.description}
                        openDiagram={this.props.openDiagram}
                        removeDiagram={this.removeDiagram}
                    />
                );
            }, this);
        }

        return diagramArray;
    },

    render: function(){
        var hideTable = null;
        const diagramArray = this.getDiagramElements();
        if(diagramArray == null){
            hideTable = {display: "none"}; //Hide table
        }

        //Render the correct sorting arrows
        var nameSortArrow = null;
        var dateSortArrow = null;
        switch(this.state.sortBy){
            case "name":
                if(this.state.ascending == true){
                    nameSortArrow = <span className="glyphicon glyphicon-triangle-bottom sortArrow" aria-hidden="true"></span>;
                }
                else{
                    nameSortArrow = <span className="glyphicon glyphicon-triangle-top sortArrow" aria-hidden="true"></span>;
                }
                break;
            case "added":
                if(this.state.ascending == true){
                    dateSortArrow = <span className="glyphicon glyphicon-triangle-bottom sortArrow" aria-hidden="true"></span>;
                }
                else{
                    dateSortArrow = <span className="glyphicon glyphicon-triangle-top sortArrow" aria-hidden="true"></span>;
                }
                break;
        }
        return(
            <div>
                <h1>
                    <span className="glyphicon glyphicon-heart accHeaderGlyph favoritesGlyph" aria-hidden="true"> </span>
                    {this.props.dict[this.props.language]["savedDiagrams"]}
                </h1>
                <hr className="profileHr"/>
                <div className="diagramPageWrapper">
                    <div className="input-group" style={Object.assign({marginBottom: "8px"}, hideTable)}>
                        <span className="input-group-addon" id="basic-addon1">
                            Filter
                        </span>
                        <input type="text" className="form-control" onChange={this.filterDiagrams} placeholder={this.props.dict[this.props.language]["name"]}/>
                    </div>

                    <table className="favorites" style={hideTable}>
                        <thead>
                            <tr>
                                <th id="Diagram_name" className="favorites" onClick={this.sortBy.bind(this, "name")}>
                                    {this.props.dict[this.props.language]["name"]}
                                    {nameSortArrow}
                                </th>
                                <th id="Diagram_acc" className="favorites"></th>
                                <th id="Diagram_date" className="favorites" onClick={this.sortBy.bind(this, "added")}>
                                    {this.props.dict[this.props.language]["added"]}
                                    {dateSortArrow}
                                </th>
                                <th id="Diagram_remove" className="favorites"></th>
                            </tr>
                        </thead>
                        {diagramArray}
                    </table>
                    {this.state.diagrams.length > 0 ? "" : this.props.dict[this.props.language]["noSavedDiagrams"]}
                </div>
            </div>
        );
    }
});
module.exports = FavoriteDiagrams;
