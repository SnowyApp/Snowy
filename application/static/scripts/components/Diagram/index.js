var Concept = React.createClass({
    getInitialState: function() {
      return {clicked: false};
    },
    handleClick: function(event) {
        this.setState({clicked: !this.state.clicked});
    },
    render: function() {
        return (
            <div className={"rectangle concept ".concat(this.props.css)} >
                <p>{this.props.node.name}</p>
            </div>        
        );
    }
});

var DefinedConcept = React.createClass({
    render: function() {
        return (
            <div className={"rectangle concept defined-concept ".concat(this.props.css)} >
                <p>{this.props.node.name}</p>
            </div>
        );
    }
});

var Attribute = React.createClass({
   render: function() {
        return (
            <div className={"rectangle attribute ".concat(this.props.css)} >
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

module.exports = React.createClass({
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
        <section className="diagram">
            {drawParents(node)}
            {drawNode(node, "origin")}
            {drawChildren(node)}
        </section>
    );
}

function drawNode(node, className) {
    if (node.type == "concept") {
        return (
            <Concept node={node} css={className} />
        );
    }
    else if (node.type == "defined-concept") {
        return (
            <DefinedConcept node={node} css={className} />
        );
    }
    else if (node.type == "attribute") {
        return (
            <Attribute node={node} css={className}  />
        );
    }
}

function drawChildren(node) {
    return (
        <article className="children" >
            { node.children.map(
                function(child) {
                    return drawNode(child, "child");                              
                }
            )}
        </article>
    );
}

function drawParents(node) {
    return (
        <article className="parents" >
            { node.parents.map(
                function(elder) {
                    return drawNode(elder, "parent");
                }
            )}
        </article>
    );
}
