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
                <p>{this.props.node.name}</p>
            </div>
        );
    }
});

var Attribute = React.createClass({
   render: function() {
        return (
            <div className="rectangle attribute">
                <p>{this.props.node.name}</p>
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
        node.children = [ 
            {id: 2, name: "Leukemi", type: "defined-concept"},
            {id: 3, name: "Ebola", type: "concept"}
        ];
        node.parents = [ 
            {id: 4, name: "Feber", type: "concept" },
            {id: 5, name: "Karies", type: "attribute" }
        ];        
        node.type = "attribute";

        return ( drawDiagram(node) );
    }
});

function drawDiagram(node) {
    return (
        <div>
            {drawParents(node)}
            {drawNode(node)}
            {drawChildren(node)}
        </div>
    );
}

function drawNode(node) {
    if (node.type == "concept") {
        return (
            <Concept node={node} />
        );
    }
    else if (node.type == "defined-concept") {
        return (
            <DefinedConcept node={node} />
        );
    }
    else if (node.type == "attribute") {
        return (
            <Attribute node={node} />
        );
    }
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

function drawParents(node) {
    return (
        <div>
            { node.parents.map(
                function(elder) {
                    return drawNode(elder);
                }
            )}
        </div>
    );
}

ReactDOM.render(
    <Container />,
    document.getElementById('content')
);
