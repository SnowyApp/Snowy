var NavigationItem = require('./NavigationItem');

/**
 * Navigation panel component
 */
var Navigation = React.createClass({
    propTypes: {
        data:           React.PropTypes.array,
        url:            React.PropTypes.string,
        update:         React.PropTypes.func,
        upOneLevel:     React.PropTypes.func,
        resetRoot:      React.PropTypes.func,
        getHistory:     React.PropTypes.func
    },

    getInitialState: function(){
        return (
            {
                currentParent: [],
                termChildren: [],
                history: []
            }
        );
    },
    
    /**
     * Update the state from given data.
     */
    updateState: function(data) {
        // do not try to use uninitialised data
        if (data === undefined || data[0].children.length == 0)
            return;

        // update the state with the given data
        this.setState({
            currentParent: data[0].name,
            termChildren: data[0].children,
            currentID: data[0].concept_id
        });
    },
    
    componentWillReceiveProps: function(nextProps) {
        this.updateState(nextProps.data);
    },
	
   /**
    * Only update component if the data has changed.
    * Removed unused second paremeter nextState.
    */
    shouldComponentUpdate: function(nextProps) {
        return nextProps.data != this.props.data;
    },

    componentDidMount: function(){
        this.updateState(this.props.data);
    },

   /**
    * Handles clicks on the children (callback function)
    */
    handleClick: function(id){
        const saveHistory = (this.state.currentID != id);
        this.props.update(id, saveHistory); 
    },

    render: function() {
        const history = this.props.getHistory();
        var backArrow;
        var parentMarginLeft;
        //Hide back arrow if there is no history
        if(history.length == 0){
            backArrow = {display: 'none'};
            parentMarginLeft = {marginLeft: "0px"};
        }else{
            backArrow = {};
            parentMarginLeft = {};
        }
        if(this.state.termChildren != null) {
            //Create NavigationItem's for all the children of the current parent node
            var ItemArray = this.state.termChildren.map(function (child) {
                return (
                    <NavigationItem
                        key={child.id}
                        id={child.concept_id}
                        name={child.name}
                        handleClickCallback={this.handleClick}
                    />
                );
            }, this);
       }
        //Only display grandparent if there is one
        const grandparent = (history.length > 0 ? history[history.length-1].name + " >" : "");

        return (
            <nav>
                <ul className="nav nav-pills nav-stacked">
                    <li role="presentation" className="active">                    
                        <a className="navigation-header">
                            <span style={backArrow} onClick={this.props.upOneLevel} className="glyphicon glyphicon-triangle-top backArrow linkPointer" aria-hidden="true"> </span>
                            <span onClick={this.props.resetRoot} className="glyphicon glyphicon-home rootLink linkPointer" aria-hidden="true"> </span>
                            <div className="grandparentHeader linkPointer" onClick={this.props.upOneLevel}>
                                {grandparent}
                            </div>
                            <div style={parentMarginLeft} className="parentHeader linkPointer" onClick={this.handleClick.bind(null, this.state.currentID)}>
                                {this.state.currentParent}
                            </div>
                        </a>
                    </li> 
                    {ItemArray}
                </ul>
            </nav>
        );
    }
});

module.exports = Navigation;
