var d3Chart = require('./d3Chart');

module.exports = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
        domain: React.PropTypes.object
    },

    getDefaultProps: function() {
        return {
            width: 300,
            height: 300
        }
    },
    componentDidMount: function() {
        var element = ReactDOM.findDOMNode(this);
        d3Chart.create(element, {
            width: this.props.width,
            height: this.props.height
        }, this.getChartState());
    },

    componentDidUpdate: function() {
        var element = ReactDOM.findDOMNode(this);
        d3Chart.update(element, this.getChartState());
    },

    getChartState: function() {
        return {
            data: this.props.data,
            domain: this.props.domain
        };
    },

    componentWillUnmount: function() {
        var element = ReactDOM.findDOMNode(this);
        d3Chart.destroy(element);
    },

    render: function() {
        return (
            <div className="chart"></div>
        );
    }
});
