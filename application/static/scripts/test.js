var Container = React.createClass({
    render: function() {
        return (
            <div className="cells">
                <TopDiv />
                <NavigationHub />
                <Diagram />
            </div>
        );
    }
});
var TopDiv = React.createClass({
    render: function() {
        return (
            <div className="top">
                <h1>Sample Cell 1</h1>
                <h2>Sample Cell 2</h2>
                <h3>Sample Cell 3</h3>
            </div>
        );
    }
});
var NavigationHub = React.createClass({
    render: function() {
        return (
            <div className="navigation">
                <h1>Sample Cell 1</h1>
                <h2>Sample Cell 2</h2>
                <h3>Sample Cell 3</h3>
            </div>
        );
    }
});

var Diagram = React.createClass({
    render: function() {
        return (
            <div className="diagram">
                <h1>Sample Cell 1</h1>
                <h2>Sample Cell 2</h2>
                <h3>Sample Cell 3</h3>
            </div>
        );
    }
});


ReactDOM.render(
    <Container />,
    document.getElementById('content')
);
