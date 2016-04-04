var Diagram = require("./components/Diagram/index");
var Search = require("./components/Search/index");
var Navigation = require("./components/Navigation/index");

var Container = React.createClass({
    render: function() {
        return (
            <div className="wrapper">
                <Navigation />
                <section>
                    <Search />
                    <Diagram />
                </section>
            </div>
        );
    }
});

ReactDOM.render(
    <Container />,
    document.getElementById('content')
);
