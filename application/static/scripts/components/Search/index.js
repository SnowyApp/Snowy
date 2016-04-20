import PageClick from 'react-page-click';
import cookie from 'react-cookie';

module.exports = React.createClass({

    render: function() {
        return <Search url = {this.props.url} update = {this.props.update}/>;
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
    //Automatic search if no keypress detected for 0.3s after typing. Instant search on enter.
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
    onClick: function(){
        this.props.updateData();
    },
    render:function(){
        return(
            <div onClick={this.onClick}>
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
    //Called when the user clicks outside the table
    handleBlur: function(){
        this.props.clearData();
    },
    render:function(){
        var optionsProp = {
            onRowClick: function(row){
                //Sends back the selected term to the container class
                this.props.update(row.id);
                this.props.addHistory(row.name,row.id);
                this.props.clearData();
            }.bind(this)
        };
        //Only display the result table if there is a result
        var style={
            display: "none"
        };
        if(this.props.data.length > 0){
            style={
              display: "block"
            };
        }
        var tableData = this.props.data;
        //tableData.reverse();
        return(
            <PageClick onClick={this.handleBlur}>
                <div className="search-results" style={style}>
                    <BootstrapTable data={tableData} hover={true} options={optionsProp}>
                        <TableHeaderColumn dataField="id"  width="100" hidden = {true}>ID</TableHeaderColumn>
                        <TableHeaderColumn dataField="name" isKey={true} hidden = {false}>Name</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </PageClick>
        );
    }
});

/*
 The main component
 */
var Search = React.createClass({
    getInitialState:function(){
        return{
            query:'',
            searchData: [],
            searchHistory: cookie.load('searchHistory') ? cookie.load('searchHistory') : []
        }
    },
    doSearch:function(queryText){
        var queryResult=[];
        var baseUrl = this.props.url;
        var url = baseUrl + "/search/" + queryText;

        $.ajax({
            type: "GET",
            "method": "GET",
            url: url,
            dataType: "json",
            error: function(){
                console.log('Failed to access API')
            },
            success: function(result){
                for (var i in result.hits.hits){
                    queryResult.push({
                        name: result.hits.hits[i]._source.term,
                        id: result.hits.hits[i]._source.concept_id
                    });
                }
                this.setState({
                    query: queryText,
                    searchData: queryResult
                });
            }.bind(this)

        });
    },
    clearData: function(){
        this.setState({
            query: this.state.query,
            searchData: []
        });
    },
    updateData: function(){
        var searchData = this.state.searchData;
        if(searchData != undefined && searchData.length == 0 && cookie.load('searchHistory') != undefined
        && document.activeElement.id == 'searchInput'){
            searchData = cookie.load('searchHistory');
        }
        this.setState({
            searchData: searchData
        });
    },
    addHistory: function(name, id){
        var newHistory = this.state.searchHistory;
        newHistory.unshift({
            name: name,
            id: id
        });
        if (newHistory.length>5){
            newHistory.pop();
        }
        this.setState({
            searchHistory:newHistory
        })
        cookie.save('searchHistory', this.state.searchHistory, { path: '/' });
    },
    render:function(){

        return (
            <div className="search">
                <SearchBox query={this.state.query}
                           doSearch={this.doSearch}
                           updateData={this.updateData}/>
                <TermTable data={this.state.searchData}
                           update={this.props.update}
                           clearData={this.clearData}
                           addHistory={this.addHistory} />
            </div>
        );
    }
});

