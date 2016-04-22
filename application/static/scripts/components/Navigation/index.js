var NavigationItem = require('./NavigationItem');

/**
 * Navigation panel component
 */
var Navigation = React.createClass({
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
	
    shouldComponentUpdate: function(nextProps, nextState) {
        return nextProps.data != this.props.data;
    },

    componentDidMount: function(){
        this.updateState(this.props.data);
    },

   /**
    * Handles clicks on the children (callback function)
    */
    handleClick: function(e){
        this.props.update(e.id); 
    },

    render: function() {
        var history = this.props.getHistory();
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
        //Create NavigationItem's for all the children of the current parent node
        var ItemArray = this.state.termChildren.map(function(child){
            return(
                <NavigationItem key={child.id} id={child.concept_id} name={child.name} handleClickCallback={this.handleClick} />
            );
        }, this);

        //Only display grandparent if there is one
        var grandparent = (history.length > 0 ? history[history.length-1].name + " >" : "");

        return (
            <nav>
                <ul className="nav nav-pills nav-stacked">
                    <li role="presentation" className="active">                    
                        <a className="navigation-header" onClick={this.props.upOneLevel} href="#">
                            <span style={backArrow} className="glyphicon glyphicon-triangle-top backArrow" aria-hidden="true"> </span>
                            <div className="grandparentHeader">
                                {grandparent}
                            </div>
                            <div style={parentMarginLeft} className="parentHeader">
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
