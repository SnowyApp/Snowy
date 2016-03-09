var Chart = require("./Chart")

var sampleData = [
    {id: '5fbmzmtc', x: 7, y: 41, z: 6},
    {id: 's4f8phwm', x: 11, y: 45, z: 9}
];

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

module.exports = React.createClass({
    getInitialState: function() {
        return {
            data: treeData,
            domain: { x: [0, 30], y: [0, 100] }
        };
    },

    render: function() {
        return (
            <div className="Diagram">
                <Chart
                    data={this.state.data}
                    domain={this.state.domain} />
            </div>
        );
    }
});
