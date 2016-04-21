/**
 * Clickable items in the navigation bar
 */
var NavigationItem = React.createClass({
    //Handles clicks on the items and calls back to the parent to change the current data
    handleClick: function(e){
        this.props.handleClickCallback(e);
    },

    render: function(){
        return(
            <li role="presentation">
                <a className="navLink" onClick={this.handleClick.bind(this, {name:this.props.name, id:this.props.id})} href='#'>
                    {this.props.name}
                </a>
            </li>
        );
    }
});

module.exports = NavigationItem;
