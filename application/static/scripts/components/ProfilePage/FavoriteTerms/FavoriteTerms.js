import cookie from 'react-cookie';
import React from 'react';
import ReactDOM from 'react-dom';

var TermElement = require('./TermElement');

/**
 * Component that displays favorite terms in a table
 */
var FavoriteTerms = React.createClass({
    propTypes: {
        url:                React.PropTypes.string,
        dict:               React.PropTypes.object,
        language:           React.PropTypes.string,
        terms:              React.PropTypes.array,
        openTerm:           React.PropTypes.func,
        removeid:           React.PropTypes.func,
        nameSort:           React.PropTypes.func,
        dateSort:           React.PropTypes.func
    },

    getInitialState: function(){
        return (
            {
                terms: []
            }
        );
    },

    componentDidMount: function(){
        this.addFavoriteTerm(1136366, "Senaste");
        //this.addFavoriteTerm(345345345, "A Test term");
        this.getFavoriteTerms();
        this.setState({
            terms: this.props.dateSort(this.state.terms, true),
            sortBy: 'added',
            ascending: true
        });
    },

   /**
    * Adds a favorite term to the database
    */
    addFavoriteTerm: function(id, name){
        if (cookie.load('userId') != null) {
            $.ajax({
                method: "POST",
                url: this.props.url + "/favorite_term",
                headers: {
                    "Authorization": cookie.load("userId")
                },
                data: JSON.stringify({
                    "id": id,
                    "term": name,
                    "date_added": new Date().toString()
                }),
                success: function (data) {
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

   /**
    * Sort terms by header
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
                    terms: this.props.nameSort(this.state.terms, asc),
                    sortBy: 'name',
                    ascending: asc
                });
                break;
            case "id":
                this.setState({
                    terms: this.props.idSort(this.state.terms, asc),
                    sortBy: 'id',
                    ascending: asc
                });
                break;
            case "added":
                this.setState({
                    terms: this.props.dateSort(this.state.terms, asc),
                    sortBy: 'added',
                    ascending: asc
                });
                break;
        }
    },

   /**
    * Remove element from the term table
    */
    removeTerm: function(id){
        //Remove element locally (for responsiveness)
        this.setState({
            terms: this.props.removeid(this.state.terms, id)
        });
        //Remove from database
        if (cookie.load('userId') != null) {
            $.ajax({
                type: "POST",
                method: "DELETE",
                url: this.props.url + "/favorite_term",
                headers: {
                    "Authorization": cookie.load("userId")
                },
                data: JSON.stringify({"id": id}),
                success: function () {
                    console.log("Successfully removed term.");
                }.bind(this),
                error: function (textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                    console.log("Failed removing term.");
                },
                contentType: "application/json",
                dataType: "json"
            });
        }
    },

   /**
    * Gets the users favorite terms and saves them to the terms state
    */
    getFavoriteTerms: function(){
        if (cookie.load('userId') != null) {
            $.ajax({
                method: "GET",
                url: this.props.url + "/favorite_term",
                headers: {
                    "Authorization": cookie.load("userId")
                },
                success: function (data) {
                    console.log(data);
                    var terms = [];
                    for(var i = 0; i < data.length; i++){
                        terms.push({
                            id: data[i].id,
                            name: data[i].term,
                            dateAdded: new Date(data[i].date_added) //TODO: Create Date from returned string
                        });
                    }
                    this.setState({
                        terms: terms
                    });
                }.bind(this),
                error: function (textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                    console.log("Failed getting favorite terms.");
                },
                contentType: "application/json",
                dataType: "json"
            });
        }
    },

    render: function(){
        //Generate the table rows
        var TermArray = null;
        var hideTable = null;
        if(this.state.terms.length > 0){
            hideTable = {}; //Show table
            TermArray = this.state.terms.map(function(term){
                //Date, "0" together with slice(-2) ensures the date format xxxx-xx-xx (e.g 3 -> 03)
                var day = ("0" + term.dateAdded.getDate()).slice(-2);
                var month = ("0" + term.dateAdded.getMonth()).slice(-2);
                var year = term.dateAdded.getUTCFullYear();
                
                var dateString = year + "-" + month + "-" + day;

                return(
                    <TermElement
                        key={term.id}
                        id={term.id}
                        name={term.name}
                        openTerm={this.props.openTerm}
                        removeTerm={this.removeTerm}
                        date={dateString}
                    />
                );
            }, this);
        } else {
            hideTable = {display: "none"}; //Hide table
        }

        //Render the correct sorting arrows
        var nameSortArrow = null;
        var idSortArrow = null;
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
            case "id":
                if(this.state.ascending == true){
                    idSortArrow = <span className="glyphicon glyphicon-triangle-bottom sortArrow" aria-hidden="true"></span>;
                }
                else{
                    idSortArrow = <span className="glyphicon glyphicon-triangle-top sortArrow" aria-hidden="true"></span>;
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
                    {this.props.dict[this.props.language]["savedTerms"]}
                </h1>
                <hr className="profileHr"/>
                <div className="termPageWrapper">
                    <table className="favorites" style={hideTable}>
                        <thead>
                            <tr>
                                <th id="Term_name" className="favorites" onClick={this.sortBy.bind(this, "name")}>
                                    {this.props.dict[this.props.language]["name"]} {nameSortArrow}
                                </th>
                                <th id="Term_id" className="favorites" onClick={this.sortBy.bind(this, "id")}>
                                    ID {idSortArrow}
                                </th>
                                <th id="Term_date" className="favorites" onClick={this.sortBy.bind(this, "added")}>
                                    {this.props.dict[this.props.language]["added"]} {dateSortArrow}
                                </th>
                                <th id="Term_remove" className="favorites"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {TermArray}
                        </tbody>
                    </table>
                    {this.state.terms.length > 0 ? "" : this.props.dict[this.props.language]["noSavedTerms"]}
                </div>
            </div>
        );
    }
});
module.exports = FavoriteTerms;


