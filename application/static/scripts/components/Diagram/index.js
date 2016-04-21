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

    update: function(data) {
        if (data === undefined) return;

        this.setState({
            data: data
        });

        if (this._chart !== undefined) {
            this.reset();
        }
    },

    /**
     * Set original state from props before rendering.
     */
    componentWillMount: function() {
        this.update(this.props.data);
    },

    /**
     * Update state when receiving new props
     */
    componentWillReceiveProps: function(nextProps) {
        this.resetZoom();
        this.update(nextProps.data);
    },

    /**
    * Render the diagram from the current state.
    */
    render: function() {
        return (
            <div className="diagram">
                <Button bsStyle="primary" onClick={this.reset}>Reset</Button>
                <Button bsStyle="primary" onClick={this.resetZoom}>Reset zoom</Button>
                <Chart
                    ref={ (ref) => this._chart = ref }
                    data={this.state.data}
                    domain={this.state.domain} 
                    onClick={this.onNodeClick} />
            </div>
        );
    },

    /**
     * Return an ID for d3 node
     */
    getId: function() {
        return this._chart.getId();
    },

    /**
     * Show/hide children of node on click.
     */
    onNodeClick: function(id) {
        this.props.updateConceptChildren(id); 
    },

    resetZoom: function(){
        this._chart.resetZoom();
    },

    reset: function() {
        this._chart.resetDiagram();
    }
});
