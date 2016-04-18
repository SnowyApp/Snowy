module.exports = React.createClass({
    render: function(){
        return (
            <nav>
                <Navigation APIUrl='http://79.136.62.204:3000' rootNodeID='138875005'/>
            </nav>
        );
    }
});

//Navigation panel component
var Navigation = React.createClass({
    //Set current data set, get children of id
    setParent: function(id){
        var queryResult=[];
        //Get children
		$.ajax({
            type: "GET",
            "method": "GET",
            url: this.props.APIUrl + '/snomed/en-edition/v20150731/concepts/' + id + '/children?form=inferred=true',
            dataType: "json",
            error: function(){
                console.log('Failed to access API')
            },
            success: function(result){
                for (var i in result){
                    queryResult.push({
                        name: result[i].defaultTerm,
                        id: result[i].conceptId
                    })
                }
                //Ignore if no children were found
                if(queryResult.length !== 0){
                    this.setState({
                        termChildren: queryResult,
                        currentID: id
                    });
                }
            }.bind(this)
        });
        //Get parent name
        $.ajax({
            type: "GET",
            "method": "GET",
            url: this.props.APIUrl + '/snomed/en-edition/v20150731/concepts/' + id,
            dataType: "json",
            error: function(){
                console.log('Failed to access API')
            },
            success: function(result){
                console.log(result.defaultTerm);
                this.setState({
                    currentParent: result.defaultTerm
                });
            }.bind(this)
        });
    },
	
	
    componentDidMount: function(){
        this.setParent(this.props.rootNodeID);
    },

    //Handles clicks on the children (callback function)
    handleClick: function(e){
        this.state.history.push(this.state.currentID);
        console.log(this.state.history);
        this.setParent(e.id);
        
    },

    //Move up one level in the tree (from history)
    upOneLevel: function(){
        var id = this.state.history.pop();
        console.log(id);
        this.setParent(id);
    },

    //Initial state of the component
    getInitialState: function(){
        return (
            {
                currentParent: 'SNOMED CT Concept',
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
                <NavigationItem key={child.id} id={child.id} name={child.name} handleClickCallback={this.handleClick} />
            );
        }, this);
        return (
            <ul className="nav nav-pills nav-stacked">
                <li role="presentation" className="active">
                    <a className="navigation-header" onClick={this.upOneLevel} href="#">
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
