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
        this.update(nextProps.data);
    },

    /**
    * Render the diagram from the current state.
    */
    render: function() {
        return (
            <div className="diagram">
                <button onClick={this.reset}>Reset</button>
                <Chart
                    ref={ (ref) => this._chart = ref }
                    data={this.state.data}
                    domain={this.state.domain} 
                    onClick={this.onClick} />
            </div>
        );
    },

    onClick: function(sctid) {
        if (sctid != this.state.data[0].id) {
            this.props.update(sctid);
        }
    },

    reset: function() {
        this._chart.resetDiagram();
    }
});
