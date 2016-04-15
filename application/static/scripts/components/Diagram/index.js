var Chart = require("./Chart");

module.exports = React.createClass({
    /**
    * Set the state of data and domain to given props or default values if not
    * given.
    */
    getInitialState: function() {
        return {
            data: [],
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
                if (this.state.data.length != 0) {
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
        if (sctid != null) {
            this.getRoot(sctid);
            this.getChildren(sctid);
            if (this.refs.Chart !== undefined)
                this.reset();
        }
    },

    /**
     * Set original state from props before rendering.
     */
    componentWillMount: function() {
        this.update(this.props.sctid);
    },

    /**
     * Update state when receiving new props
     */
    componentWillReceiveProps: function(nextProps) {
        this.update(nextProps.sctid);
    },

    /**
    * Render the diagram from the current state.
    */
    render: function() {
        return (
            <div className="diagram">
                <button onClick={this.reset}>Reset</button>
                <Chart
                    ref="Chart"
                    data={this.state.data}
                    domain={this.state.domain} 
                    onClick={this.update} />
            </div>
        );
    },


    reset: function() {
        this.refs.Chart.resetDiagram();
    }
});
