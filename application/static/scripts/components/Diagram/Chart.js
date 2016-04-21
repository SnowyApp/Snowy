var d3Chart = require('./d3Chart');

module.exports = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
        view: React.PropTypes.string,
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
            height: this.props.height,
            onClick: this.props.onClick
        }, this.getChartState());
    },
    componentDidUpdate: function() {
        var element = ReactDOM.findDOMNode(this);
        d3Chart.update(element, this.getChartState());
    },

    getChartState: function() {

        return {
            data: this.props.data,
            view: this.props.view,
            domain: this.props.domain
        };
    },

    resetDiagram: function() {
        var element = ReactDOM.findDOMNode(this);
        d3Chart.reset(element, this.getChartState());
    },

    componentWillUnmount: function() {
        d3Chart.destroy();
    },

    render: function() {
        return (
            <div className="chart"></div>
        );
    }
});
