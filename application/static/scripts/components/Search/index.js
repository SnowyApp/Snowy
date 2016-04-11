
module.exports = React.createClass({

    render: function() {
        return <Search />;
    }
});

/*
 Handles user input
 */
var SearchBox = React.createClass({
    doSearch: function() {
        var query = ReactDOM.findDOMNode(this.refs.searchInput).value;
        this.props.doSearch(query);
    },

    handleKeyPress: function(target) {
        if(target.charCode==13){
            this.doSearch();
        }
    },

    render:function(){
        return(
            <div>
                <input id="searchInput" ref="searchInput" type="text" placeholder="Search..." defaultValue={this.props.search} onKeyPress={this.handleKeyPress} />
                <Button onClick={this.doSearch} >Search</Button>
            </div>
        )
    }
});

/*
 Displays the results with react-bootstrap table component
 */
var TermTable = React.createClass({
    render:function(){
        var optionsProp = {
            onRowClick: function(row){
                //This is supposed to generate a diagram on the selected term
                alert(row.name);
            }
        };
        return(
            <div className="search-results">
                <BootstrapTable data={this.props.data} hover={true} options={optionsProp}>
                    <TableHeaderColumn dataField="id" isKey={true} width="30">ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="name" >Name</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
});

/*
 The main component
 */
var Search = React.createClass({
    doSearch:function(queryText){
        var queryResult=[];

        //Use this if you have the api locally
        var localUrl = 'http://127.0.0.1:3000/snomed/en-edition/v20150731/descriptions?query='+queryText+'&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true';

        //Use this if Carl Brage's server is up
        var brageUrl = 'http://79.136.62.204:3000/snomed/en-edition/v20150731/descriptions?query='+queryText+'&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true';

        //Use this if none of the above work, can only search on asthma
        var mockApi ='http://private-anon-8a3ca20dd-sctsnapshotrestapi.apiary-mock.com/api/snomed/en-edition/v20140731/descriptions?query=asthma&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true';


        $.ajax({
            type: "GET",
            "method": "GET",
            //Here goes the correct url
            url: brageUrl,
            dataType: "json",
            error: function(){
                console.log('Failed to access API')
            },
            success: function(result){
                console.log("api success");
                for (var i in result["matches"]){
                    queryResult.push({
                        name: result["matches"][i]["term"],
                        id: result["matches"][i]["conceptId"]
                    });
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
            <div className="search">
                <SearchBox query={this.state.query} doSearch={this.doSearch}/>
                <TermTable data={this.state.searchData}/>
            </div>
        );
    }
});
