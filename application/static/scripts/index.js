import PageClick from 'react-page-click';
import SplitPane from 'react-split-pane';
import cookie from 'react-cookie';

var Diagram = require('./components/Diagram/index');
var Search = require('./components/Search/index');
var Navigation = require('./components/Navigation/index');
var RegisterForm = require('./components/RegisterForm/index');
var LoginForm = require('./components/LoginForm/index');
var ProfilePage = require('./components/ProfilePage/index');
var LogOut = require('./components/LogOut/');


var matteUrl = 'http://hem.ulmstedt.net:5000';

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
     * state when all information is received. saveHistory determines if
     * the last node is saved to history.
     */
    getConcept: function(id, saveHistory = true) {
        $.when(this.getRoot(id), this.getChildren(id))
            .then(function(rootResult, childrenResult) {
                // get all information about children
                var children = [];

                for (var i in childrenResult[0]) {
                    children.push(
                        {
                            "name": childrenResult[0][i].synonym,
                            "concept_id": childrenResult[0][i].id,
                            "parent": rootResult[0].id,
                            "children": null,
                            "id": this._diagram.getId()
                        }
                    );
                }
                
                // get all information about the root and add the array
                // of the children
                var root = [
                    {
                        "name": rootResult[0].synonym,
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
            getConcept(nextProps.concept_id);
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

        var tree = this.state.data.slice();;

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
         
        var result = null;
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
    
    onLogin: function(uid){
        this.setState({
            userId: uid,
            isLoggedIn:true
        });
        cookie.save('userId', uid,{path: '/'});
    },
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
    * Sets the sites language to language
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
                            url={this.state.serverUrl}
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


var Bar = React.createClass({
    //Dictionary for supported languages
    dict: {
        se: {
            "search":       "Sök",
            "version":      "Version",
            "saveDiagram":  "Spara diagram",
            "diagram":      "Diagram",
            "login":        "Logga in",
            "logout":       "Logga ut",
            "register":     "Registrera",
            "profile":      "Profilsida"
        },
        en: {
            "search":       "Search",
            "version":      "Version",
            "saveDiagram":  "Save diagram",
            "diagram":      "Diagram",
            "login":        "Log in",
            "logout":       "Log out",
            "register":     "Register",
            "profile":      "Profile"
        }
    },

    getInitialState: function(){
        return{
            showRegistration: false,
            showLogin: false,
            showLogout: false
        };
    },

    showRegistration: function(){
        this.setState({
            showRegistration: true
        });
    },

    showLogin: function(){
        this.setState({
            showLogin: true
        });
    },
    hideRegistration: function(){
        this.setState({
            showRegistration: false
        });
    },

    hideLogin: function(){
        this.setState({
            showLogin: false
        });

    },
    showLogout: function(){
        this.setState({
            showLogout: true
        });
    },
    hideLogout: function(){
        this.setState({
            showLogout: false
        });
    },
    render: function() {
        var switchName = '';
        switch(this.props.contentName){
            case "diagram":
                switchName = "profile";
                break;
            case "profile":
                switchName = "diagram";
                break;
        }
        const navButtons = this.props.isLoggedIn ? (
            <div>
                <Button className="profile"
                        onClick={this.props.setContent.bind(null, switchName.toLowerCase())}
                        bsStyle = "primary" >{this.dict[this.props.language][switchName]}</Button>
                <Button className="Logout" bsStyle = "primary" 
                    onClick={this.showLogout}>{this.dict[this.props.language]["logout"]}</Button>
                <LogOut show={this.state.showLogout} hideLogout={this.hideLogout}
                        onLogout={this.props.onLogout} url={this.props.url}/>
            </div>
        ) : (
            <div>
                <Button className="Register" bsStyle = "primary" 
                    onClick={this.showRegistration}>{this.dict[this.props.language]["register"]}</Button>
                <Button className="Login" bsStyle = "primary" 
                    onClick={this.showLogin}>{this.dict[this.props.language]["login"]}</Button>
                {/* Registration popup */}
                <RegisterForm show={this.state.showRegistration} 
                    hideRegistration={this.hideRegistration} url={this.props.url}/>

                {/* Login popup */}
                <LoginForm show={this.state.showLogin} hideLogin={this.hideLogin}
                           onLogin={this.props.onLogin} url={this.props.url}/>
            </div>
        );
    
        //Language button
        var flagSrc = null;
        switch(this.props.language){
            case "en":
                flagSrc = "static/img/flags/flag_eng.png";
                break;
            case "se":
                flagSrc = "static/img/flags/flag_swe.png";
                break;
            default:
                console.log("Language prop not valid");
                break;
        }

        return (
            <div className="bar">
                <Search url={this.props.serverUrl} update={this.props.update} language={this.props.language}/>
                
                <ButtonToolbar id = "buttons">
                    {/* Database edition drop-down */}
                    <div className="btn-group">
                        <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown">
                            {this.dict[this.props.language]["version"]} <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a onClick={this.props.setEdition.bind(null,"en")} href="#">
                                    English Edition 2015-11-30
                                </a>
                            </li>
                            <li>
                                <a onClick={this.props.setEdition.bind(null,"se")} href="#">
                                    Swedish Edition 2015-11-30
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* Language drop-down */}
                    <div className="btn-group">
                        <button type="button" className="btn btn-primary dropdown-toggle flagButton" data-toggle="dropdown">
                            <img className="langFlagHeader" src={flagSrc}/> <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a onClick={this.props.setLanguage.bind(null,"en")} href="#">
                                    <img className="langFlag" src="static/img/flags/flag_eng.png"/> English
                                </a>
                            </li>
                            <li>
                                <a onClick={this.props.setLanguage.bind(null,"se")} href="#">
                                    <img className="langFlag" src="static/img/flags/flag_swe.png"/> Svenska
                                </a>
                            </li>
                        </ul>
                    </div>
                    <Export language={this.props.language} />
                    <Button 
                        className="save-diagram" 
                        bsStyle="primary"
                        onClick={this.props.saveDiagram}
                    >
                        {this.dict[this.props.language]["saveDiagram"]}
                    </Button>
                    {navButtons}
                </ButtonToolbar>
            </div>

        );
    }
});

/*
<div className="btn-group">
                        <button type="button" className="btn btn-primary flagButton" data-toggle="dropdown">
                            <img className="langFlagHeader" src={flagSrc}/>
                        </button>
                        <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="caret"></span>
                        <span className="sr-only">Toggle Dropdown</span>
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a onClick={this.props.setLanguage.bind(null,"en")} href="#">
                                    <img className="langFlag" src="static/img/flags/flag_eng.png"/> English
                                </a>
                            </li>
                            <li>
                                <a onClick={this.props.setLanguage.bind(null,"se")} href="#">
                                    <img className="langFlag" src="static/img/flags/flag_swe.png"/> Svenska
                                </a>
                            </li>
                        </ul>
                    </div>
*/

var Export = React.createClass({
    dict: {
        se: {
            "export":       "Exportera"
        },
        en: {
            "export":       "Export"
        }
    },

    exportSVG: function(){
        var html = d3.select("svg")
            .attr({
                'xmlns': 'http://www.w3.org/2000/svg',
                'xlink': 'http://www.w3.org/1999/xlink',
                version: '1.1'
            })
            .node().parentNode.innerHTML;

        var blob = new Blob([html], {type: "image/svg+xml"});
        saveAs(blob, new Date().toJSON().slice(0,10) + ".svg");

    },
    exportPNG: function(){
        // Create a canvas with the height and width of the parent of the svg document
        var chartArea = document.getElementsByTagName('svg')[0].parentNode;
        var svg = chartArea.innerHTML;
        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', chartArea.offsetWidth);
        canvas.setAttribute('height', chartArea.offsetHeight);
        canvas.setAttribute('display', 'none');

        // Add the canvas to the body of the document and add the svg document to the canvas
        document.body.appendChild(canvas);
        canvg(canvas, svg);

        // Draw a white background behind the content
        var context = canvas.getContext("2d");
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Append the image data to a link, download the image and then remove canvas
        var dataString = canvas.toDataURL();
        var link = document.createElement("a");
        link.download = new Date().toJSON().slice(0,10) + ".png";
        link.href = dataString;
        link.click();
        canvas.parentNode.removeChild(canvas);
    },
    render: function(){
        return (
        <DropdownButton bsStyle="primary" title={this.dict[this.props.language]["export"]} id="Export">
            <MenuItem onClick={this.exportSVG}>SVG</MenuItem>
            <MenuItem divider/>
            <MenuItem onClick={this.exportPNG}>PNG</MenuItem>
        </DropdownButton>
        );
    }
});


ReactDOM.render(
    <Container concept_id="138875005" url={matteUrl}  />,
    document.getElementById('content')
);
