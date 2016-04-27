var d3Chart = require('./d3Chart');

var Chart = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
        view: React.PropTypes.string
    },

    componentDidUpdate: function(prevProps) {
        var element = ReactDOM.findDOMNode(this);

        if (prevProps.data.length == 0){
            d3Chart.create(element, {
                onClick: this.props.onClick
            }, this.getChartState());
        } else if (prevProps.view != this.props.view) {
            d3Chart.destroy();
            d3Chart.create(element, {
                onClick: this.props.onClick
            }, this.getChartState());
        } else {
            d3Chart.update(element, this.getChartState());
        }
    },

    getChartState: function() {
        return {
            data: this.props.data,
            view: this.props.view
        };
    },
    resetZoom: function(){
      d3Chart._resetZoom();
    },

    /**
     * Return an ID for d3 chart.
     */
    getId: function() {
        return d3Chart.getId();
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
module.exports = Chart;
