module.exports = React.createClass({
    render: function(){
        return (
            <nav>
                <Navigation 
                    APIUrl={this.props.url}
                    update={this.props.update}            
                    data={this.props.data}
                    upOneLevel={this.props.upOneLevel}
                    getHistory={this.props.getHistory}
                />
            </nav>
        );
    }
});

//Navigation panel component
var Navigation = React.createClass({
    
    /**
     * Update the state from given data.
     **/
    updateState: function(data) {

        // do not try to use uninitialised data
        if (data === undefined)
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
	
    componentDidMount: function(){
        this.updateState(this.props.data);
    },

    //Handles clicks on the children (callback function)
    handleClick: function(e){
        this.props.update(e.id); 
    },

    //Initial state of the component
    getInitialState: function(){
        return (
            {
                currentParent: [],
                termChildren: [],
                history: []
            }
        );
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
        if(this.state.termChildren != null) {
            //Create NavigationItem's for all the children of the current parent node
            var ItemArray = this.state.termChildren.map(function (child) {
                return (
                    <NavigationItem key={child.id} id={child.concept_id} name={child.name}
                                    handleClickCallback={this.handleClick}/>
                );
            }, this);
       }
        //Only display grandparent if there is one
        
        var grandparent = (history.length > 0 ? history[history.length-1].name + " >" : "");

        return (
            <ul className="nav nav-pills nav-stacked">
                <li role="presentation" className="active">                    
                    <a className="navigation-header" onClick={this.props.upOneLevel} href="#">
                        <span style={backArrow} className="glyphicon glyphicon-triangle-top backArrow" aria-hidden="true"> </span>
                        <div className="grandparentHeader">{grandparent}</div>                         
                        <div style={parentMarginLeft} className="parentHeader">{this.state.currentParent}</div>
                    </a>
                </li> 
                {ItemArray}
            </ul>
        );
    }
});

//Clickable items in the navigation bar
var NavigationItem = React.createClass({
    //Handles clicks on the items and calls back to the parent to change the current data
    handleClick: function(e){
        this.props.handleClickCallback(e);
    },

    render: function(){
        return(
            <li role="presentation">
                <a className="navLink" onClick={this.handleClick.bind(this, {name:this.props.name, id:this.props.id})} href='#'>{this.props.name}</a>
            </li>
        );
    }
});
