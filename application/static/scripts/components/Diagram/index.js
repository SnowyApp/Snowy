var Chart = require("./Chart");

module.exports = React.createClass({
    /**
    * Set the state of data and domain to given props or default values if not
    * given.
    */
    getInitialState: function() {
        return {
            data: this.props.data || treeData,
            domain: this.props.data || { x: [0, 30], y: [0, 100] }
        };
    },

    /**
    * Render the diagram from the current state.
    */
    render: function() {
        return (
            <div className="diagram">
                <Chart
                    data={this.state.data}
                    domain={this.state.domain} />
            </div>
        );
    }
});

// sample, default data
// TODO: Remove as fast as correct formatted data is available.
var treeData = [
    {
        "name": "Top Level",
        "parent": "null",
        "expression": "concept",
        "children": [
            {
                "name": "Level 2: A",
                "parent": "Top Level",
                "expression": "defined-concept",
                "children": [
                    {
                        "name": "Son of A",
                        "parent": "Level 2: A",
                        "expression": "attribute"
                    },
                    {
                        "name": "Daughter of A",
                        "parent": "Level 2: A",
                        "expression": "concept"
                    }
                ]
            },
            {
                "name": "Level 2: B",
                "parent": "Top Level",
                "expression": "attribute"
            }
        ]
    }
];
