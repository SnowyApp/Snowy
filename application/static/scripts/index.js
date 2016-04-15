
var Diagram = require("./components/Diagram/index");
var Search = require("./components/Search/index");
var Navigation = require("./components/Navigation/index");
var Chart = require('./components/Diagram/Chart');

//Use this if you have the api locally
var localUrl = 'http://127.0.0.1:3000/snomed/en-edition/v20150731/descriptions?query=&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true';

//Use this if Carl Brage's server is up
var brageUrl = 'http://155.4.145.248:3000/snomed/en-edition/v20150731/descriptions?query=&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true';

//Use this if none of the above work, can only search on asthma
var mockApi ='http://private-anon-d3abcd99e-snomedctsnapshotapi.apiary-mock.com/api/snomed/en-edition/v20160131/descriptions?query=&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true';


var Container = React.createClass({
    getInitialState: function(){
        return{
            serverUrl: 'http://localhost:5000',
            APIedition: '',
            APIrelease: '',
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
    render: function() {
        return (
            <div className="wrapper">
                <Navigation
                    sctid={this.state.selectedTerm}
                    url={this.state.serverUrl}
                />
                <section>
                    <Bar update={this.updateSelectedTerm}/>
                    <Diagram 
                        sctid={this.state.selectedTerm}
                        url={this.state.serverUrl}
                    />
                </section>
            </div>
        );
    }
});

var Bar = React.createClass({
    getInitialState: function(){
      return{

      };
    },
    render: function() {
        return (
            <div className="bar">
                <Search url ={mockApi} update={this.props.update}/>
                <ButtonToolbar id = "buttons">
                    <Export />
                    <Button bsStyle = "primary" onClick={this.registerUser}>Register</Button>
                    <Button bsStyle = "primary" onClick={this.loginUser}>Login</Button>
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

        var blob = new Blob([html], {type: "image/svg+xml"}),
            url = window.URL.createObjectURL(blob);
        // Append the image data to a link
        var link = document.createElement("a");
        link.download = "test.svg";
        link.href = url;
        link.click();
    },
    exportPNG: function(){
        //var canvasId = "canvas";
        var canvas = document.createElement("canvas");
        //Load the canvas element with our svg
        canvg(canvas, document.getElementsByClassName("chart")[0].innerHTML.trim());
        //Convert the svg to png
        Canvas2Image.convertToPNG(canvas);
        // Append the image data to a link
        var dataString = canvas.toDataURL();
        var link = document.createElement("a");
        link.download = "image.png";
        link.href = dataString;
        link.click();

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
