var Diagram = require("./components/Diagram/index");
var Search = require("./components/Search/index");
var Navigation = require("./components/Navigation/index");

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
    render: function() {
        return (
            <div className="bar">
                <Button>Export</Button>
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
