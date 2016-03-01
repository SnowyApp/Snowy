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

var Concept = React.createClass({
    render: function() {
        return (
            <div className="rectangle concept">
                <p>{this.props.node.name}</p>
            </div>        
        );
    }
});

var DefinedConcept = React.createClass({
    render: function() {
        return (
            <div className="rectangle concept defined-concept">
                <p>Defined Concept Text</p>
            </div>
        );
    }
});

var Attribute = React.createClass({
   render: function() {
        return (
            <div clasName="rectangle attribute">
                <p>Attribute</p>
            </div>
        );
   } 
});

var isA = React.createClass({
    render: function() {
        return (
            <div className="is-a"></div>
        );
    }
});

var Arrow = React.createClass({
    render: function() {
        return (
            <div className="arrow"></div>
        );
    }
});

var Line = React.createClass({
    render: function() {
        return (
            <div className="line"></div>
        );
    }
});

var Diagram = React.createClass({
    render: function() {    
        var node = {};
        node.name = "Astma";
        node.id = 1;
        node.children = [ {id: 2, name: "Leukemi" }, {id: 3, name: "Ebola"}];
        
        return ( drawChildren(node) );
    }
});

function drawNode(node) {
    return (
        <Concept node={node} />
    );
}

function drawChildren(node) {
    
    return (
        <div>
            { node.children.map(
                function(child) {
                    return drawNode(child);                              
                }
            )}
        </div>
    );
}



ReactDOM.render(
    <Container />,
    document.getElementById('content')
);
