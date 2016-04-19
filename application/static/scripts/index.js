import PageClick from 'react-page-click';
import ResizableBox from 'react-resizable-component';
import SplitPane from 'react-split-pane';

var Diagram = require("./components/Diagram/index");
var Search = require("./components/Search/index");
var Navigation = require("./components/Navigation/index");
var Chart = require('./components/Diagram/Chart');
var RegisterForm = require('./components/RegisterForm/index');
var LoginForm = require('./components/LoginForm/index');
var ProfilePage = require("./components/ProfilePage/index");


//Use this if you have the api locally
var localUrl = 'http://127.0.0.1:3000/snomed/en-edition/v20150731/descriptions?query=&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true';

//Use this if Carl Brage's server is up
var brageUrl = 'http://155.4.145.248:3000/snomed/en-edition/v20150731/descriptions?query=&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true';

//Use this if none of the above work, can only search on asthma
var mockApi ='http://private-anon-d3abcd99e-snomedctsnapshotapi.apiary-mock.com/api/snomed/en-edition/v20160131/descriptions?query=&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true';


var Container = React.createClass({
    getInitialState: function(){
        return{
            serverUrl: '//hem.ulmstedt.net:5000',
            APIedition: '',
            APIrelease: '',
            isLoggedIn: false,
            selectedTerm: "138875005"
        };
    },

    handleUrlChange: function(e){
        this.setState({
            url: e.target.value
        });
    },
    //Gets called when the user selects an element in the search result
    updateSelectedTerm: function(newSelectedTerm){
        this.setState({
            selectedTerm: newSelectedTerm
        });
    },
    hasLoggedIn: function(){
        this.setState({
            isLoggedIn:true
        });
    },
    updateLoggedIn: function(e){
      this.setState({
          isLoggedIn: e
      });
    },
    render: function() {
        return (
            <div className="wrapper">
                    <SplitPane split="vertical" defaultSize={360} minSize={10} maxSize={700}>
                        <Navigation
                            sctid={this.state.selectedTerm}
                            url={this.state.serverUrl}
                            update={this.updateSelectedTerm}
                        />
                        <section>
                            <Bar update={this.updateSelectedTerm}/>
                            <ProfilePage openTerm={function(id){console.log(id)}} openDiagram={function(id){console.log(id)}}/>
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
                <Button className="profile" bsStyle = "primary" >Profile</Button>
                <Button className="Logout" bsStyle = "primary" onClick={this.showLogout}>Logout</Button>
                <LogOut show={this.state.showLogout} hideLogout={this.hideLogout} updateLoggedIn={this.props.updateLoggedIn}/>
            </div>
        ) : (
            <div>
                <Button className="Register" bsStyle = "primary" onClick={this.showRegistration}>Register</Button>
                <Button className="Login" bsStyle = "primary" onClick={this.showLogin}>Login</Button>
                {/* Registration popup */}
                <RegisterForm show={this.state.showRegistration} hideRegistration = {this.hideRegistration}/>

                {/* Login popup */}
                <LoginForm show={this.state.showLogin} hideLogin = {this.hideLogin} updateLoggedIn={this.props.updateLoggedIn}/>
            </div>
        );

        return (
            <div className="bar">
                <Search url ={mockApi} update={this.props.update}/>
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
    <Container />,
    document.getElementById('content')
);
