var Diagram = require("./components/Diagram/index");
var Search = require("./components/Search/index");
var Navigation = require("./components/navigation/index");

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
                <div className="navContainer">
                    <Navigation />
                </div>
            </nav>
        );
    }
});



ReactDOM.render(
    <Container />,
    document.getElementById('content')
);
