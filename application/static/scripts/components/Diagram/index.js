var Chart = require("./Chart");

module.exports = React.createClass({
    /**
    * Set the state of data and domain to given props or default values if not
    * given.
    */
    getInitialState: function() {
        return {
            data: this.update(this.props.sctid),
            domain: this.props.domain || { x: [0, 100], y: [0, 100] }
        };
    },

    getRoot: function(sctid) {
        $.ajax({
            type: "GET",
            "method": "GET",
            url: this.props.url + "/concept/" + sctid,
            dataType: "json",
            error: function() {
                console.log("Failed to retrieve Diagram root.");
            },
            success: function(result) {
                var children = [];
                if (this.state.data !== undefined) {
                    children = this.state.data.slice()[0].children;
                }

                this.setState({
                    data: [
                        {
                            "name": result.term,
                            "concept_id": result.id,
                            "parent": "null",
                            "children": children
                        }
                    ]
                });
            }.bind(this)
        });
    },

    getChildren: function(sctid) {
        $.ajax({
            type: "GET",
            "method": "GET",
            url: this.props.url + "/get_children/" + sctid,
            dataType: "json",
            error: function() {
                console.log("Failed to retrieve Diagram children.");
            },
            success: function(result) {
                var children = [];
                for (var i in result) {
                    children.push({
                        name: result[i].term,
                        concept_id: result[i].id,
                        parent: sctid
                    });
                }
                
                var dataCopy = this.state.data.slice();
                dataCopy[0].children = children;
                this.setState({
                    data: dataCopy
                });

            }.bind(this)
        });
    },

    update: function(sctid) {
        console.log("UPDATE:" + sctid);
        if (sctid != null) {
            this.getRoot(sctid);
            this.getChildren(sctid);
        }
    },

    componentWillReceiveProps: function(nextProps) {
        console.log("PROPS UPDATED");
        this.update(nextProps.sctid);
        console.log("PROPS DONE UPDATING");
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
        "name": "Rot",
        "parent": "null",
        "expression": "concept",
        "children": [
            {
                "name": "Sjukdom",
                "parent": "Rot",
                "expression": "defined-concept",
                "children": [
                    {
                        "name": "Inflammationssjukdom",
                        "parent": "Sjukdom",
                        "expression": "attribute",
                        "children": [
                            {
                                "name": "Lunginflammation",
                                "parent": "Inflammantionssjukdom",
                                "expression": "attribute"
                            },
                            {
                                "name": "Inflammation i knäled",
                                "parent": "Inflammantionssjukdom",
                                "expression": "attribute"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Kroppsstruktur",
                "parent": "Rot",
                "expression": "defined-concept",
                "children": [
                    {
                        "name": "Andningssystemet",
                        "parent": "Kroppstruktur",
                        "expression": "attribute",
                        "children": [
                            {
                                "name": "Lunga",
                                "parent": "Andningssystemet",
                                "expression": "attribute"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Led",
                "parent": "Kroppsstruktur",
                "expression": "defined-concept",
                "children": [
                    {
                        "name": "Knäled",
                        "parent": "Led",
                        "expression": "attribute"
                    }
                ]
            }
        ]
    }
];

var treeData2 = [
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
