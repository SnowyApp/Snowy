import PageClick from 'react-page-click';
import SplitPane from 'react-split-pane';
import cookie from 'react-cookie';

var Diagram = require('./components/Diagram/index');
var Search = require('./components/Search/index');
var Navigation = require('./components/Navigation/index');
var Chart = require('./components/Diagram/Chart');
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
            history: []
        };
    },

    /**
     * Fetch information used to display diagram and navigation and update
     * state when all information is received.
     */
    getConcept: function(id) {
        $.when(
                $.ajax({
                    type: "GET",
                    method: "GET",
                    url: this.state.serverUrl + "/concept/" + id,
                    dataType: "json",
                    error: function() {
                        console.log("Could not get concept root.");
                    }.bind(this)
                }),

                $.ajax({
                    type: "GET",
                    method: "GET",
                    url: this.state.serverUrl + "/get_children/" + id,
                    dataType: "json",
                    error: function() {
                        console.log("Could not get concept children.");
                    }.bind(this)
                })

            ).then(function(res1, res2) {
console.log(res2);
                // get all information about children
                var children = [];
                for (var i in res2[0]) {
                    children.push(
                        {
                            "name": res2[0][i].term,
                            "concept_id": res2[0][i].id,
                            "parent": res1[0].id,
                            "children": []
                        }
                    );
                }
                
                // get all information about the root and add the array
                // of the children
                var root = [
                    {
                        "name": res1[0].term,
                        "concept_id": res1[0].id,
                        "parent": "null",
                        "children": children,
                        "id": 0
                    }
                ];

                // update state so that component children can update
                this.setState({
                    data: root,
                    selectedTerm: root[0].id
                });
                
            }.bind(this)
        );

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
        this.setState({
            content: content
        });
    },

    /**
     * Fetch information about given concept and update state.data with 
     * its information.
     */
    updateSelectedTerm: function(conceptId){
        //Push current parent to history
        var currHistory = this.state.history;
        var historyObject = {id: this.state.data[0].concept_id, name: this.state.data[0].name};
        //Prevent term from being added multiple times to history due to fast clicking
        if(currHistory.length == 0 || currHistory[currHistory.length-1].id != historyObject.id){
            this.state.history.push(historyObject);
        }
        this.getConcept(conceptId);
        this.setContent("diagram");
        console.log(this.state.history);
    },

   /**
    * Returns array with the navigation history
    */
    getHistory: function(){
        return this.state.history;
    },

   /**
    * Move up one level in the tree (from history)
    */
    upOneLevel: function(){
        var id = this.state.history.pop().id;

        // do not do anything if on the root node
        if (id === undefined) return;
        this.getConcept(id);
        this.setContent("diagram");
    },
    
    onLogin: function(uid){
        this.setState({
            userId: uid,
            isLoggedIn:true
        });
        cookie.save('userId', uid,{path: '/'});
    },
    onLogout: function(){
        this.setState({isLoggedIn: false});
        cookie.remove('userId', {path: '/'});
    },
    render: function() {
        var content = null;
        switch(this.state.content){
            case "diagram":
                content = <Diagram 
                            data={this.state.data}
                            url={this.state.serverUrl}
                            update={this.updateSelectedTerm}
                          />
                break;
            case "profile":
                content = <ProfilePage
                            openTerm={this.updateSelectedTerm}
                            openDiagram={function(id){console.log(id)}}
                            url={this.state.serverUrl}
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
                        />
                        {content}
                    </section>
                </SplitPane>
            </div>
        );
    }
});


var Bar = React.createClass({
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
        const navButtons = this.props.isLoggedIn ? (
            <div>
                <Button className="profile" onClick={this.props.setContent.bind(null, "profile")} bsStyle = "primary" >Profile</Button>
                <Button className="Logout" bsStyle = "primary" 
                    onClick={this.showLogout}>Logout</Button>
                <LogOut show={this.state.showLogout} hideLogout={this.hideLogout}
                        onLogout={this.props.onLogout} url={this.props.url}/>
            </div>
        ) : (
            <div>
                <Button className="Register" bsStyle = "primary" 
                    onClick={this.showRegistration}>Register</Button>
                <Button className="Login" bsStyle = "primary" 
                    onClick={this.showLogin}>Login</Button>
                {/* Registration popup */}
                <RegisterForm show={this.state.showRegistration} 
                    hideRegistration={this.hideRegistration} url={this.props.url}/>

                {/* Login popup */}
                <LoginForm show={this.state.showLogin} hideLogin={this.hideLogin}
                           onLogin={this.props.onLogin} url={this.props.url}/>
            </div>
        );

        return (
            <div className="bar">
                <Search url={this.props.serverUrl} update={this.props.update}/>
                <ButtonToolbar id = "buttons">
                    <Export />
                    {navButtons}
                </ButtonToolbar>
            </div>

        );
    }
});

var Export = React.createClass({
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
        context.fillRect(0, 0, chartArea.offsetWidth, chartArea.offsetHeight);

        // Append the image data to a link, download the image and then remove canvas
        var dataString = canvas.toDataURL();
        var link = document.createElement("a");
        link.download = "image.png";
        link.href = dataString;
        link.click();
        canvas.parentNode.removeChild(canvas);
    },
    render: function(){
        return (
        <SplitButton bsStyle="primary" title="Export" id="Export">
            <MenuItem onClick={this.exportSVG}>SVG</MenuItem>
            <MenuItem divider/>
            <MenuItem onClick={this.exportPNG}>PNG</MenuItem>
        </SplitButton>
        );
    }
});


ReactDOM.render(
    <Container concept_id="138875005" url={matteUrl} />,
    document.getElementById('content')
);
