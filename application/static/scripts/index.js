var Container = React.createClass({
    render: function() {
        return (
            <div className="contentContainer">
                <TopDiv />
                <NavigationHub onClickButton={this.displayMessage}/>
                <Diagram />
            </div>
        );
    }
});
var TopDiv = React.createClass({
    render: function() {
        return (
            <div className="top">
                <h1> SNOMED CT BROWSER </h1>
            </div>
        );
    }
});
var NavigationHub = React.createClass({
    render: function() {
        return (
            <div className="navigationContainer">
                <div className="searchBar">
                    <form>
                        <Input type="text" ref="input" />
                    </form>

                </div>
                <div className="navigation">
                    <p> Placeholder for navigation structure </p>
                </div>
            </div>
        );
    }
});

var Diagram = React.createClass({
    render: function() {
        return (
            <div className="diagram">
                <img className="image" src={'static/img/Snomed_visuals.png'}/>
                <p> Test text</p>
            </div>
        );
    }
});


ReactDOM.render(
    <Container />,
    document.getElementById('content')
);
