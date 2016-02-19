/*
Simple search box. Currently searches a fake database and displays the results in a list
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
	//Called each time the input in the searchbox changes
	doSearch: function() {
		var query = this.refs.searchInput.getDOMNode().value;
		this.props.doSearch(query);
	},
	render:function(){
		return <input type="text" ref="searchInput" placeholder="Search..." value={this.props.query} onChange={this.doSearch}/>
	}
});

/*
Displays the results
*/
var TermTable = React.createClass({
    render:function(){
        //one term on each row
        var rows=[];
        this.props.data.forEach(function(term) {
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
        console.log(queryText)
        //get query result
        var queryResult=[];
        this.props.data.forEach(function(term){
        	if(queryText)
        		//Check if name or id matches any term in the "database"
            	if(term.name.toLowerCase().indexOf(queryText)!=-1 || term.id.indexOf(queryText) !=-1)
            	queryResult.push(term);
        }); 
        this.setState({
            query:queryText,
            searchData: queryResult
        })
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