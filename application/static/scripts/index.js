var Diagram = require("./components/Diagram/index");
var Search = require("./components/Search/index");
var Navigation = require("./components/Navigation/index");
var Chart = require('./components/Diagram/Chart');

var Container = React.createClass({
    render: function() {
        return (
            <div className="wrapper">
                <Navigation />
                <section>
                    <Bar />
                    <Diagram />
                </section>
            </div>
        );
    }
});

var Bar = React.createClass({
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

        var dataString = canvas.toDataURL();
        var link = document.createElement("a");
        link.download = "image.png";
        link.href = dataString;
        link.click();

    },
    render: function() {
        return (
            <div className="bar">
                <Button onClick={this.exportSVG}>Export as SVG</Button>
                <Button onClick={this.exportPNG}>Export as PNG</Button>
                <Search />
                <Button>Login</Button>
            </div>
        );
    }
});



ReactDOM.render(
    <Container />,
    document.getElementById('content')
);