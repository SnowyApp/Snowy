
module.exports = React.createClass({
    render: function(){
        return (
            <nav>
                <Navigation 
                    APIUrl={this.props.url}
                    update={this.props.update}            
                    data={this.props.data}
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
        if (data[0] === undefined)
            return;

        // add a unique ID for all children to be used in the
        // term table
        for (var i in data[0].children) {
            data[0].children[i].id = i;;
        }

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
        this.state.history.push(this.state.currentID);
        this.props.update(e.id); 
    },

    //Move up one level in the tree (from history)
    upOneLevel: function(){
        var id = this.state.history.pop();
        this.props.update(id);
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
        var backArrow;
        //Hide back arrow if there is no history
        if(this.state.history.length === 0){
            backArrow = {display: 'none'};
        }else{
            backArrow = {};
        }
        //Create NavigationItem's for all the children of the current parent node
        var ItemArray = this.state.termChildren.map(function(child){
            return(
                <NavigationItem key={child.id} id={child.concept_id} name={child.name} handleClickCallback={this.handleClick} />
            );
        }, this);
        return (
            <ul className="nav nav-pills nav-stacked">
                    <li role="presentation" className="active"><a onClick={this.upOneLevel} href="#">
                        <span style={backArrow} className="glyphicon glyphicon-triangle-top" aria-hidden="true"> </span> 
                        {this.state.currentParent}
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
                <a className="arrowLink" href='#2'><span className="glyphicon glyphicon-arrow-right navArrow" aria-hidden="true"></span></a>
            </li>
        );
    }
});
