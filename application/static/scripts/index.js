var Diagram = require("./components/Diagram/index");

var Container = React.createClass({
    render: function() {
        return (
            <div className="wrapper">
                <NavigationHub onClickButton={this.displayMessage}/>
                <SearchBar />
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

var SearchBar = React.createClass({
    render: function() {
        return (
             <div className="search-bar">
                <form>
                    <Input type="text" ref="input" />
                </form>
            </div>
        );
    }
});



ReactDOM.render(
    <Container />,
    document.getElementById('content')
);
