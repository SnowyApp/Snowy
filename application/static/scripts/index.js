var Diagram = require("./components/Diagram/index");
var Search = require("./components/Search/index");

var Container = React.createClass({
    render: function() {
        return (
            <div className="wrapper">
                <NavigationHub onClickButton={this.displayMessage}/>
                <Search />
                <Diagram />
            </div>
        );
    }
});

var NavigationHub = React.createClass({
    render: function() {
        return (
            <nav>
                <p> Placeholder for navigation structure </p>
            </nav>
        );
    }
});



ReactDOM.render(
    <Container />,
    document.getElementById('content')
);
