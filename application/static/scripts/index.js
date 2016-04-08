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
            .attr("title", "test2")
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML;

        var blob = new Blob([html], {type: "image/svg+xml"}),
            url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.download = "test.svg";
        a.href = url;
        a.click();
    },

    render: function() {
        return (
            <div className="bar">
                <Button onClick={this.exportSVG}>Export as SVG</Button>
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