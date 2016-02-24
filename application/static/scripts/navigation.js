var data1 =
{
    name: "Cancer",
    children:
    [
        {name: "Lung"},
        {name: "Breast"},
        {name: "Prostate"},
        {name: "Foot"},
        {name: "Brain"}
    ]
};

var data2 = 
{
    name: "Breast",
    children:
    [
        {name: "Nipple"},
        {name: "Soft"},
        {name: "Big"},
        {name: "Warts"},
    ]
};


var data3 = {
    name: "Lung",
    children:
    [
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"}
    ]
};

var data4 = {
    name: "Prostate",
    children:
    [
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"}
    ]
};

var data5 = {
    name: "Foot",
    children:
    [
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"}
    ]
};

var data6 = {
    name: "Brain",
    children:
    [
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"}
    ]
};

var data7 = {
    name: "Nipple",
    children:
    [
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"},
        {name: "PlaceHolder"}
    ]
};

var dataArray = [data1, data2, data3, data4, data5, data6, data7]; //Dummy data instead of API

//Navigation panel component
var Navigation = React.createClass({
    //Set current data set
    setDataSet: function(name){
        for(var i=0; i < this.props.data.length; i++){
            if(this.props.data[i].name === name){
                this.setState({dataSet: this.props.data[i]});
                break;
            }
        }
    },

    //Handles clicks on the children (callback function)
    handleClick: function(e){
        this.state.history.push(this.state.dataSet.name);
        this.setDataSet(e.name);
    },

    //Move up one level in the tree (from history)
    upOneLevel: function(){
        var name = this.state.history.pop();
        this.setDataSet(name);
    },

    //Initial state of the component
    getInitialState: function(){
        return (
            {
                dataSet: this.props.data[0],
                history: []
            }
        );
    },

    render: function() {
        var backArrow; //Hide back arrow if there is no history
        if(this.state.history.length === 0){
            backArrow = {display: 'none'};
        }else{
            backArrow = {};
        }
        //Create NavigationItem's for all the children of the current parent node
        var ItemArray = this.state.dataSet.children.map(function(child){
            return(
                <NavigationItem name={child.name} handleClickCallback={this.handleClick} />
            );
        }, this);
        return (
            <div className="list-group navigation">
                    <a className="list-group-item active" onClick={this.upOneLevel} href="#"><span style={backArrow} className="glyphicon glyphicon-triangle-top" aria-hidden="true"></span> {this.state.dataSet.name}</a>
                    {ItemArray}
            </div>
        );
    }
});

//Clickable items in the navigation bar
var NavigationItem = React.createClass({
    //Handles clicks on the items and calls back to the parent to change the current data
    handleClick: function(name){
        this.props.handleClickCallback({name: name});
    },

    render: function(){
        return(
            <div>
                <a className="list-group-item" onClick={this.handleClick.bind(this, this.props.name)} href='#'>{this.props.name}</a>
            </div>
        );
    }
});

ReactDOM.render(
    <Navigation data={dataArray} />,
    document.getElementById('navContainer')
);
