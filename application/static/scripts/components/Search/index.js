import React from 'react';
import ReactDOM from 'react-dom';
import PageClick from 'react-page-click';
import cookie from 'react-cookie';
import Button from 'react-bootstrap/lib/Button';
require('react-bootstrap-table');

/**
 * Handles user input
 */
var SearchBox = React.createClass({
    propTypes: {
        language:       React.PropTypes.string,
        query:          React.PropTypes.string,
        doSearch:       React.PropTypes.func,
        updateData:     React.PropTypes.func,
        updateQuery:    React.PropTypes.func
    },
    //Dictionary for supported languages
    dict: {
        se: {
            search:       "Sök"
        },
        en: {
            search:       "Search"
        }
    },

    getInitialState:function(){
        return{
            timeout:null
        }
    },
    /**
     * Reads the current user input and sends it back to the parent class via a callback
     */
    doSearch: function() {
        var query = ReactDOM.findDOMNode(this.refs.searchInput).value;
        if(query.length > 2){
            this.props.doSearch(query);
        }
    },
    /**
     * Automatic search if no keypress detected for 0.3s after typing
     * Instant search on enter
     * @param target Save the key the user pressed
     */
    handleKeyPress: function(target) {
        const ENTER_KEYCODE = 13;
        this.props.updateQuery(ReactDOM.findDOMNode(this.refs.searchInput).value);
        if(this.timeout){
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if (target.keyCode == ENTER_KEYCODE){
            this.doSearch();
        }
        else{
            this.timeout = setTimeout(function() {
                this.doSearch();
                this.timeout = null;
            }.bind(this), 300);
        }
    },
    /**
     * Called when the user clicks the search bar
     * Updates the result table via a callback function
     */
    onClick: function(){
        this.props.updateData();
    },
    render:function(){
        return(
            <div onClick={this.onClick}>
                <input
                    id="searchInput"
                    ref="searchInput"
                    type="text"
                    placeholder={this.dict[this.props.language]["search"]+"..."}
                    defaultValue={this.props.search}
                    onKeyUp={this.handleKeyPress}
                />
                <Button id="searchButton" onClick={this.doSearch}>{this.dict[this.props.language]["search"]}</Button>
            </div>
        )
    }
});

/**
 * Displays the results with react-bootstrap table component
 */
var TermTable = React.createClass({
    propTypes: {
        data:          React.PropTypes.array,
        update:        React.PropTypes.func,
        clearData:     React.PropTypes.func,
        addHistory:    React.PropTypes.func
    },
    /**
     * Called when the user clicks outside the table
     */
    handleBlur: function(){
        this.props.clearData();
    },
    render:function(){
        var optionsProp = {
            /**
             * Send the selected term back to the container component,
             * add the term to the search history and
             * clear the result table
             */
            onRowClick: function(row){
                this.props.update(row.id);
                this.props.addHistory(row.name,row.id);
                this.props.clearData();
            }.bind(this)
        };
        var adjustedMargin = "0";
        //Make sure the relevant elements have been rendered
        if(document.getElementById('searchInput') && document.getElementsByClassName("nav nav-pills nav-stacked")){
            //Get the pos of the search box
            var searchInputPos = document.getElementById('searchInput').getBoundingClientRect()["left"];
            //Get the width of the navigation menu
            var navPos = document.getElementsByClassName("nav nav-pills nav-stacked")[0]["clientWidth"];

            adjustedMargin = searchInputPos-navPos;
        }
        //Only display the result table if there is a result
        var style={
            display: "none",
        };
        if(this.props.data.length > 0){
            style={
                display: "inline-block",
            };
        }
        var tableData = this.props.data;
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

/**
 * The main component
 */
var Search = React.createClass({
    propTypes: {
        url:          React.PropTypes.string,
        update:       React.PropTypes.func,
        language:     React.PropTypes.string
    },
    /**
     * Set initial value of all states
     * @returns {{query: string, searchData: Array, searchHistory: (*|Array), lastData: Array, lastSearch: string}}
     */
    getInitialState:function(){
        return{
            query:'',
            searchData: [],
            searchHistory: cookie.load('searchHistory') || [],
            lastData: [],
            lastSearch: ''
        }
    },
    /**
     * Carry out an API request with the user input and save the result in the state
     * @param {string} queryText The user input
     */
    doSearch:function(queryText){
        var queryResult=[];
        var baseUrl = this.props.url;
        var url = baseUrl + "/search/" + queryText;

        //API request
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
                    searchData: queryResult,
                    lastSearch: queryText
                });
            }.bind(this)

        });
    },
    /**
     * Clears the current result list and save it for future use
     */
    clearData: function(){
        //If there is no new data, keep the previous data
        var newLastData=this.state.lastData;
        //If there is any new data, save it and throw away the previous data
        if(this.state.searchData != undefined && this.state.searchData.length > 0){
            newLastData = this.state.searchData;
        }
        this.setState({
            lastData: newLastData,
            searchData: []
        });
    },
    /**
     * Called when the user interacts with the search box
     * If the user didn't clear the search box set the search result to the last result
     * Otherwise fetch the users esarch history from a cookie
     */
    updateData: function(){
        var searchData = this.state.searchData;
        if(searchData != undefined && searchData.length == 0){
            if (this.state.query == this.state.lastSearch && this.state.query.length > 0){
                searchData = this.state.lastData;
            }
            else if(cookie.load('searchHistory') != undefined && document.activeElement.id == 'searchInput'){
                searchData = cookie.load('searchHistory')
            }
        }
        this.setState({
            searchData: searchData
        });
    },
    /**
     * Every time the users selects a term in the result table save it and
     * add it to the search history cookie
     */
    addHistory: function(name, id){
        var newHistory = this.state.searchHistory;
        newHistory.unshift({
            name: name,
            id: id
        });
        //Save the last 5 searches
        if (newHistory.length>5){
            newHistory.pop();
        }
        this.setState({
            searchHistory:newHistory
        })
        cookie.save('searchHistory', this.state.searchHistory, { path: '/' });
    },
    /**
     * Update state with the new query, used to keep track of what the user is typing
     * @param {string} query The user input
     */
    updateQuery: function(query){
        this.setState({
            query: query
        })
    },
    render:function(){
        return (
            <div className="search">
                <SearchBox language={this.props.language}
                           query={this.state.query}
                           doSearch={this.doSearch}
                           updateData={this.updateData}
                           updateQuery={this.updateQuery}/>
                <TermTable data={this.state.searchData}
                           update={this.props.update}
                           clearData={this.clearData}
                           addHistory={this.addHistory}/>
            </div>
        );
    }
});
module.exports = Search;
