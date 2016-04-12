var Select = require('react-select');



module.exports = React.createClass({

    render: function() {
        return <Search url = {this.props.url}/>;
    }
});

/*
 Handles user input
 */
var SearchBox = React.createClass({
    getInitialState:function(){
        return{
            timeout:null,
        }
    },
    doSearch: function() {
        var query = ReactDOM.findDOMNode(this.refs.searchInput).value;
        if(query.length > 2){
            this.props.doSearch(query);
        }
    },
    handleKeyPress: function(target) {
        if(this.timeout){
            clearTimeout(this.timeout)
            this.timeout = null
        }
        if (target.keyCode == 13){
            this.doSearch();
        }
        else{
            this.timeout = setTimeout(function() {
                this.doSearch();
                this.timeout = null;
            }.bind(this), 300);
        }
    },
    render:function(){
        return(
            <div>
                <input id="searchInput" ref="searchInput" type="text" placeholder="Search..." defaultValue={this.props.search} onKeyUp={this.handleKeyPress} />
                <Button onClick={this.doSearch} >Search</Button>
            </div>
        )
    }
});

/*
 Displays the results with react-bootstrap table component
 */
var TermTable = React.createClass({
    getInitialState:function(){
        return{
            hideTable: true,
        }
    },

    componentWillReceiveProps: function(nextProps){
        var hide = true;
        if(nextProps.data.length > 0){
            hide = false;
        }
        this.setState({
            hideTable: hide
        });
    },

    render:function(){

        var optionsProp = {
            onRowClick: function(row){
                //This is supposed to generate a diagram on the selected term
                this.setState({
                    hideTable: true
                });
            }.bind(this)
        };
        return(
            <div className="search-results">
                <BootstrapTable data={this.props.data} hover={true} options={optionsProp}>
                    <TableHeaderColumn dataField="id" isKey={true} width="100" hidden = {true}>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="name" hidden = {this.state.hideTable}>Name</TableHeaderColumn>
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
        var baseUrl = this.props.url;
        var url = baseUrl.replace("query=","query="+queryText);
        $.ajax({
            type: "GET",
            "method": "GET",
            //Here goes the correct url
            url: url,
            dataType: "json",
            error: function(){
                console.log('Failed to access API')
                console.log(this.props.url)
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
                <TermTable data={this.state.searchData} />
            </div>
        );
    }
});

