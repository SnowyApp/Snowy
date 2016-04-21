import cookie from 'react-cookie';
var TermElement = require('./TermElement');

//Temporary fake user
var fakeUser = {
    id: 1337,
    username: "Arnold",
    email: "arnold@schwarzenegger.com",
    lang: "eng"
}

/**
 * Component that displays favorite terms in a table
 */
module.exports = React.createClass({
    getInitialState: function(){
        return (
            {
                terms: []
            }
        );
    },

    componentDidMount: function(){
        //this.addFavoriteTerm(1337, "test test test");
        this.getFavoriteTerms();
        this.setState({
            terms: this.props.dateSort(this.state.terms, false),
            sortBy: 'added',
            ascending: false
        });
    },

   /**
    * Adds a favorite term to the database
    */
    addFavoriteTerm: function(id, name){
        if (cookie.load('userId') != null) {
            $.ajax({
                type: "POST",
                url: this.props.url + "/favorite_term",
                headers: {
                    "Authorization": cookie.load("userId")
                },
                data: JSON.stringify({"id": id, "term": name}),
                success: function (data) {
                    console.log(data);
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
            var asc = !this.state.ascending;
        }
        switch(header){
            case "name":
                this.setState({
                    terms: this.props.nameSort(this.state.terms, asc),
                    sortBy: 'name'
                });
                break;
            case "id":
                this.setState({
                    terms: this.props.idSort(this.state.terms, asc),
                    sortBy: 'id'
                });
                break;
            case "added":
                this.setState({
                    terms: this.props.dateSort(this.state.terms, asc),
                    sortBy: 'added'
                });
                break;
        }

        this.setState({
            ascending: asc
        });

    },

   /**
    * Remove element from the term table
    */
    removeTerm: function(id){
        //Remove element locally (for responsiveness)
        this.setState({
            terms: this.props.removeid(this.state.terms, id)
        });
        //TODO: Remove element from database
    },

   /**
    * Gets the users favorite terms and saves them to the terms state
    */
    getFavoriteTerms: function(){
        if (cookie.load('userId') != null) {
            $.ajax({
                type: "GET",
                method: "GET",
                url: this.props.url + "/favorite_term",
                headers: {
                    "Authorization": cookie.load("userId")
                },
                success: function (data) {
                    console.log(data);
                    this.setState({
                        terms: data[0]
                    });
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

    render: function(){
        //Generate the table rows
        var TermArray = null;
        if(this.state.terms.length > 0){
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
                <h1><span className="glyphicon glyphicon-heart accHeaderGlyph favoritesGlyph" aria-hidden="true"> </span> {this.props.dict[fakeUser.lang]["favterms"]}</h1>
                <hr className="profileHr"/>
                <div className="termPageWrapper">
                    <table className="favorites">
                        <thead>
                            <tr>
                                <th id="Term_name" className="favorites" onClick={this.sortBy.bind(this, "name")}>
                                    {this.props.dict[fakeUser.lang]["name"]} {nameSortArrow}
                                </th>
                                <th id="Term_id" className="favorites" onClick={this.sortBy.bind(this, "id")}>
                                    ID {idSortArrow}
                                </th>
                                <th id="Term_date" className="favorites" onClick={this.sortBy.bind(this, "added")}>
                                    {this.props.dict[fakeUser.lang]["added"]} {dateSortArrow}
                                </th>
                                <th id="Term_remove" className="favorites"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {TermArray}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});



