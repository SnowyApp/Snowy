var diagram = require("./d3Diagram");

module.exports = React.createClass({
    //Dictionary for supported languages
    dict: {
        se: {
            "reset":        "Reset",
            "resetZoom":    "Reset zoom",
            "VHView":       "Vertikal/Horisontell vy"
        },
        en: {
            "reset":        "Reset",
            "resetZoom":    "Reset zoom",
            "VHView":       "Vertical/Horizontal view"
        }
    },

    /**
    * Set the state of data and domain to given props or default values if not
    * given.
    */
    getInitialState: function() {
        return {
            data: [],
            view:  'vertical'
        };
    },

    update: function(data) {
        if (data === undefined) return;

        this.setState({
            data: data
        });

        if (this.diagram !== undefined) {
            this.reset();
        }
    },

    componentDidMount: function() {
        diagram.create(ReactDOM.findDOMNode(this), { onClick: this.onNodeClick },
                this.getDiagramState());
    },

    componentDidUpdate: function(prevProps) {
        var element = ReactDOM.findDOMNode(this);

        // if the diagram data has been initialised and contains data
        // then update the diagrams state.
        // otherwise create a diagram
        if (prevProps.data === undefined || prevProps.data.length != 0) {
            diagram.update(element, this.getDiagramState());
        } else {
            diagram.create(element, { onClick: this.onNodeClick }, 
                this.getDiagramState());
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
        //this.resetZoom();
        this.update(nextProps.data);
    },

    componentWillUnmount: function() {
        diagram.destroy();
    },

    /**
    * Render the diagram from the current state.
    */
    render: function() {
        return (
            <div className="diagram">
                <Button 
                    bsStyle="primary" 
                    onClick={this.reset}>
                    {this.dict[this.props.language]["reset"]}
                </Button>
                <Button 
                    bsStyle="primary" 
                    onClick={this.resetZoom}>
                    {this.dict[this.props.language]["resetZoom"]}
                </Button>
                <Button 
                    bsStyle="primary" 
                    onClick={this.changeView}>
                    {this.dict[this.props.language]["VHView"]}
                </Button>
            </div>
        );
    },

    /**
     * Return an ID for d3 node
     */
    getId: function() {
        return diagram.getId();
    },

    /**
     * Show/hide children of node on click.
     */
    onNodeClick: function(id) {
        this.props.updateConceptChildren(id);
    },

    resetZoom: function(){
        diagram.resetZoom(ReactDOM.findDOMNode(this));
    },

    getDiagramState: function() {
        return {
            data: this.state.data,
            view: this.state.view
        };
    },

    reset: function() {
        diagram.reset(ReactDOM.findDOMNode(this), this.getDiagramState());
    },

    changeView: function(){
      if(this.state.view == 'vertical') {
          this.setState({
              view: 'horizontal'
          })
      }
        else {
          this.setState({
              view: 'vertical'
          })
      }
    }
});
