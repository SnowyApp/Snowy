import PageClick from 'react-page-click';
import SplitPane from 'react-split-pane';
import cookie from 'react-cookie';
import React from 'react';
import ReactDOM from 'react-dom';

var Diagram = require('./components/Diagram/index');
var Bar = require('./components/Bar/index');
var Navigation = require('./components/Navigation/index');
var ProfilePage = require('./components/ProfilePage/index');


var matteUrl = 'http://hem.ulmstedt.net:5000';
const conceptId = "138875005";

/**
*   Contains the subcomponents of the webpage
 *   It also initiates all the top-level variables passed to the children components
 */
var Container = React.createClass({
    getInitialState: function(){
        return{
            serverUrl: this.props.url,
            isLoggedIn: (cookie.load('userId') != null),
            userId: cookie.load('userId'),
            selectedTerm: this.props.concept_id,
            content: "diagram",
            data: this.props.data,
            history: [],
            language: "en",
            dbEdition: "en"
        };
    },

    /**
     * Fetch information used to display diagram and navigation and update
     * state when all information is receigitved. saveHistory determines if
     * the last node is saved to history.
     */
    getConcept: function(id, saveHistory = true) {
        $.when(this.getRoot(id), this.getChildren(id))
            .then(function(rootResult, childrenResult) {
                // get all information about children
                var children = [];

                for (var i in childrenResult[0]) {
                    const childSynonym = childrenResult[0][i].synonym;
                    const childFull = childrenResult[0][i].full;
                    children.push(
                        {
                            "name": (childSynonym != null ? childSynonym : childFull),
                            "concept_id": childrenResult[0][i].id,
                            "parent": rootResult[0].id,
                            "children": null,
                            "id": this._diagram.getId()
                        }
                    );
                }
                
                // get all information about the root and add the array
                // of the children
                const rootSynonym = rootResult[0].synonym;
                const rootFull = rootResult[0].full;
                var root = [
                    {
                        "name": (rootSynonym != null ? rootSynonym : rootFull),
                        "concept_id": rootResult[0].id,
                        "parent": "null",
                        "children": children,
                        "id": 0
                    }
                ];

                //Add to history if saveHistory == true and not root/leaf and its not already the root
                if( saveHistory && 
                    root[0].concept_id != this.props.concept_id &&
                    root[0].children.length != 0
                  ){
                    //Push current parent to history
                    var historyObject = {id: this.state.data[0].concept_id, name: this.state.data[0].name};
                    //Prevent term from being added multiple times to history due to fast clicking
                    var currHistory = this.state.history;
                    if(currHistory.length == 0 || currHistory[currHistory.length-1].id != historyObject.id){
                        this.state.history.push(historyObject);
                    }
                }

                // update state so that component children can update
                this.setState({
                    data: root,
                    selectedTerm: root[0].id
                });     
                
            }.bind(this)
        );
    },

    /**
     * Return function to fetch root from api.
     */
    getRoot: function(id) {
        return $.ajax({
            type: "GET",
            method: "GET",
            url: this.state.serverUrl + "/concept/" + id,
            dataType: "json",
            error: function() {
                console.log("Could not get concept root.");
            }.bind(this)
        });
    },

    /**
     * Return function to fetch children of id from api.
     */
    getChildren: function(id) {
        return $.ajax({
            type: "GET",
            method: "GET",
            url: this.state.serverUrl + "/get_children/" + id,
            dataType: "json",
            error: function() {
                console.log("Could not get concept children.");
            }.bind(this)
        });
    },

    /**
     * Update state on change of props.
     */
    componentWillReceiveProps: function(nextProps) {
        // set concept_id in focus if given
        if (nextProps.concept_id !== undefined) {
            this.getConcept(nextProps.concept_id);
        }

        // set given data in focus if given, overruling concept_id
        if (nextProps.data !== undefined) {
            this.setState({
                data: nextProps.data,
                selectedTerm: nextProps.data[0].id
            });
        }
    },
    componentWillMount: function() {
        this.getConcept(this.state.selectedTerm);
    },
    /**
     * Called when the url is to be assigned the value of e
     * @param e
     */
    handleUrlChange: function(e){
        this.setState({
            url: e.target.value
        });
    },

   /**
    * Set what content to display in the content area
    */
    setContent: function(content){
        if(this.state.content == content) return;
        this.setState({
            content: content
        });
    },


    /**
     * Add or remove children of concept from state.
     */
    updateConceptChildren: function(id) {

        // ignore if it is the root
        if (id == 0)
            return;

        var tree = this.state.data.slice();

        // find node in data
        var node = this.findNode(tree[0], id);

        if (node == null) {
            // something went wrong
            return;
        }

        if (node.children === undefined) {
            // add children to the node
            $.when(this.getChildren(node.concept_id)).then(
                function(res) {
                    // get all information about children
                    var children = [];
                    for (var i in res) {
                        children.push(
                            {
                                "name": res[i].synonym,
                                "concept_id": res[i].id,
                                "parent": node.concept_id,
                                "children": null,
                                "id": this._diagram.getId()
                            }
                        );
                    }
                    // update node's children
                    node.children = children;
                    this.setState({
                        data: tree
                    });
                }.bind(this)
            );
        } else {
            // remove the nodes children
            node.children = null;
            this.setState({
                data: tree
            });
        }
    },

    /**
     * Find a node with given d3 id.
     */
    findNode: function(tree, id) {
        if (tree.id == undefined) return null;
        if (tree.id == id) return tree;
        if (tree.children == undefined) return null;
         
        var result;
        for(var i in tree.children) {
            result = this.findNode(tree.children[i], id);
            if (result != null) return result;
        }
        return null;
    },

    /**
     * Fetch information about given concept and update state.data with 
     * its information.
     */
    updateSelectedTerm: function(conceptId, saveHistory = true){
        this.getConcept(conceptId, saveHistory);
        this.setContent("diagram");
    },

   /**
    * Returns array with the navigation history
    */
    getHistory: function(){
        return this.state.history;
    },

   /**
    * Clears the navigation history
    */
    clearHistory: function(){
        this.state.history.length = 0;
    },

   /**
    * Move up one level in the tree (from history)
    */
    upOneLevel: function(){
        if(this.state.history.length == 0) return;
        var id = this.state.history.pop().id;

        // do not do anything if on the root node
        if (id === undefined) return;
        this.updateSelectedTerm(id, false);
    },

   /**
    * Resets navigation to SNOMED CT root node
    */
    resetRoot: function(){
        this.updateSelectedTerm(this.props.concept_id, false);
        this.clearHistory();
    },
    /**
     * Called when a user has been logged in, uid is the token sent from the server
     * @param uid
     */
    onLogin: function(uid){
        this.setState({
            userId: uid,
            isLoggedIn:true
        });
        cookie.save('userId', uid,{path: '/'});
    },
    /**
     * Called when a user has logged out
     */
    onLogout: function(){
        this.setState({isLoggedIn: false, content: "diagram", userId: ''});
        cookie.remove('userId', {path: '/'});
    },

   /**
    * Sets the sites language to language
    */
    setLanguage: function(language){
        this.setState({
            language: language
        });
        //TODO: If user is logged in, save to database
    },

   /**
    * Sets the database edition to edition
    */
    setEdition: function(edition){
        this.setState({
            dbEdition: edition
        });
        //TODO: If user is logged in, save to database
    },

    /**
     * Create a json string of given diagram.
     **/
    stringifyDiagram: function(diagram) {
        var s = [];
        for (var node in diagram) {
            s.push(
                {
                    "concept_id": diagram[node].concept_id,
                    "id": diagram[node].id,
                    "depth": diagram[node].depth,
                    "name": diagram[node].name,
                    "x": diagram[node].x,
                    "y": diagram[node].y,
                    "parent": diagram[node].parent.concept_id,
                    "children": this.stringifyDiagram(diagram[node].children)
                }
            );
        }

        return s;
    },

    /**
     * Return a Javascript object of the diagram given in JSON.
     **/
    objectifyDiagram: function(data) {
        data = JSON.parse(data);
        data[0].children = this.parseChildren(data[0].children);
        return data;
    },

    /**
     * Parse given list of children and recursively parse its children.
     **/
    parseChildren: function(children) {
        children = JSON.parse(children);

        for (var i in children) {
            children[i].children = this.parseChildren(children[i].children);
        }
        return children;
    },


    /**
     * Send diagram to server.
     **/
    saveDiagram: function() {
        $.ajax({
            type: "POST",
            method: "POST",
            headers: {
                "Authorization" : cookie.load("userId")
            },
            url: this.state.serverUrl + "/diagram",
            contentType: "application/json",
            data: JSON.stringify(
                    { "data" : JSON.stringify(this.stringifyDiagram(this.state.data)) }),
            error: function(xhr) {
                console.log("Could not store diagram.");
            }.bind(this)
        });
    },

    /**
     * Load the diagram of given ID from the server and update state when the 
     * results are received.
     **/
    loadDiagram: function(id) {
        $.ajax({
            type: "GET",
            method: "GET",
            headers: {
                "Authorization": cookie.load("userId")
            },
            url: this.state.serverUrl + "/diagram",
            dataType: "json",
            error: function(error) {
                console.log(error);
            }.bind(this),
            success: function(result) {
                this.setState({
                    data: this.objectifyDiagram(result[id-1].data)
                });
            }.bind(this)
        });
    },

    render: function() {
        var content = null;
        switch(this.state.content){
            case "diagram":
                content = <Diagram 
                            ref={ (ref) => this._diagram = ref }
                            data={this.state.data}
                            update={this.updateSelectedTerm}
                            updateConceptChildren={this.updateConceptChildren}
                            language={this.state.language}
                          />
                break;
            case "profile":
                content = <ProfilePage
                            openTerm={this.updateSelectedTerm}
                            openDiagram={function(id){console.log(id)}}
                            url={this.state.serverUrl}
                            language={this.state.language}
                          />
                break;
            default:
                content = <Diagram
                    ref={ (ref) => this._diagram = ref }
                    data={this.state.data}
                    url={this.state.serverUrl}
                    update={this.updateSelectedTerm}
                    updateConceptChildren={this.updateConceptChildren}
                    language={this.state.language}
                />
                break;
        }
        return (
            <div className="wrapper">
                <SplitPane split="vertical" defaultSize={370} minSize={10} maxSize={700}>
                    <Navigation
                        data={this.state.data}
                        url={this.state.serverUrl}
                        update={this.updateSelectedTerm}
                        upOneLevel={this.upOneLevel}
                        resetRoot={this.resetRoot}
                        getHistory={this.getHistory}
                    />
                    <section>
                        <Bar
                            serverUrl={this.state.serverUrl} 
                            update={this.updateSelectedTerm} 
                            isLoggedIn={this.state.isLoggedIn}
                            onLogin={this.onLogin}
                            onLogout={this.onLogout}
                            url={this.state.serverUrl}
                            setContent={this.setContent}
                            contentName={this.state.content}
                            language={this.state.language}
                            setLanguage={this.setLanguage}
                            setEdition={this.setEdition}
                            saveDiagram={this.saveDiagram}
                        />
                        {content}
                    </section>
                </SplitPane>
            </div>
        );
    }
});

ReactDOM.render(
    <Container concept_id={conceptId} url={matteUrl}  />,
    document.getElementById('content')
);
