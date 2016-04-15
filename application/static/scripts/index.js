
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
            serverUrl: 'http://79.136.62.204:3000/',
            APIedition: '',
            APIrelease: '',
            selectedTerm: null
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
                <Navigation/>
                <section>
                    <Bar update={this.updateSelectedTerm}/>
                    <Diagram />
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

        var blob = new Blob([html], {type: "image/svg+xml"});
        saveAs(blob, new Date().toJSON().slice(0,10) + ".svg");

    },
    exportPNG: function(){
        // Create a canvas with the height and width of the parent of the svg document
        var svg = d3.select("svg").node().parentNode.innerHTML;
        var canvas = document.createElement('canvas');
        var filename = 'bilden';
        canvas.width = chartArea.offsetWidth;
        canvas.height = chartArea.offsetHeight;

        // Add the canvas to the body of the document and add the svg document to the canvas
        //document.body.appendChild(canvas);

        //canvg(canvas, svg);

        var img = new Image;
        img.onload = function(){
            canvas.getContext('2d').drawImage(this, 0, 0, canvas.width, canvas.height);
            var data = canvas.toDataURL("image/png");
            download(data, filename + '.png');
        }

        image.src = 'data:image/svg+xml;base64,' + window.btoa(svg);
    },
    download: function(data, filename){
        var a = document.createElement('a');
        a.download = filename;
        a.href = data
        document.body.appendChild(a);
        a.click();
        a.remove();
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