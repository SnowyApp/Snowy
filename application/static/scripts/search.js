/*
Simple search box. Always searches on 'Asthma' at the moment
*/

var Container = React.createClass({
    render: function() {
        return (
            <div className="contentContainer">
                <Search data = {testData} />
            </div>
        );
    }
});

/*
Handles user input
*/
var SearchBox = React.createClass({
	doSearch: function() {
		var query = this.refs.searchInput.getDOMNode().value;
		this.props.doSearch(query);
	},

	render:function(){
		return(
            <div>
                <input id="searchInput" ref="searchInput" type="text" placeholder="Search..." defaultValue={this.props.search} />
                <button onClick={this.doSearch} >Search</button>
            </div>
        )
	}
});

/*
Displays the results
something is wrong with the layout
*/
var TermTable = React.createClass({
    render:function(){
        //one term on each row
        var rows=[];
        this.props.data.forEach(function(term) {
            console.log("term: ",term)
        rows.push(<tr><td>{term.name}</td><td>{term.id}</td></tr>)
        });
        return(
             <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Id</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});

/*
The main component
*/
var Search = React.createClass({


    doSearch:function(queryText){
        var queryResult=[];

        //TODO: change url to the correct one when we know it works
        $.ajax({
            type: "GET",
            "method": "GET",
            url: 'http://private-anon-8a3ca20dd-sctsnapshotrestapi.apiary-mock.com/api/snomed/en-edition/v20140731/descriptions?query=asthma&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true',
            //url: 'http://browser.ihtsdotools.org/api/snomed/en-edition/v20140731/descriptions?query=asthma&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true',
            dataType: "json",
            error: function(){
                console.log('Failed to access API')
            },
            success: function(result){
                for (var i in result["matches"]){
                    queryResult.push({
                        name: result["matches"][i]["term"],
                        id: result["matches"][i]["conceptId"]
                    })
                }
                this.setState({
                    query: queryText,
                    searchData: queryResult
                });
            }.bind(this)

        });

    },
    getInitialState:function(){
        return{
            query:'',
            searchData: []
        }
    },
    render:function(){
        return (
            <div className="Search">
                <h3>Search Test</h3>
                <SearchBox query={this.state.query} doSearch={this.doSearch}/>
                <TermTable data={this.state.searchData}/>
            </div>
        );
    }
});

//"Database" used for testing purposes
var testData=[
{
    name:'Cancer',
    id: '1'
},
{
    name:'Lung',
    id: '2'
},
{
    name:'Aids',
    id: '3'
}];



ReactDOM.render(
    <Container />,
    document.getElementById('content')
);