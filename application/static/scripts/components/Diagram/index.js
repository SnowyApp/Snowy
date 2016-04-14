var Chart = require("./Chart");

module.exports = React.createClass({
    /**
    * Set the state of data and domain to given props or default values if not
    * given.
    */
    getInitialState: function() {
        return {
            data: this.props.data || treeData1,
            domain: this.props.data || { x: [0, 100], y: [0, 100] }
        };
    },
    /**
    * Render the diagram from the current state.
    */
    render: function() {
        return (
            <div className="diagram">
                <button>Remove Tree</button>
                <button onClick={this.data1}>Data1</button>
                <button onClick={this.data2}>Data2</button>
                <Chart
                    data={this.state.data}
                    domain={this.state.domain} />
            </div>
        );
    },

    data1: function() {
        this.setState({data: treeData1});
    },

    data2: function() {
        this.setState({data: treeData2});
    }
});

// sample, default data
// TODO: Remove as fast as correct formatted data is available.
var treeData1 = [
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

var treeData2 = [
    {
        "name": "Top Level 2",
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
