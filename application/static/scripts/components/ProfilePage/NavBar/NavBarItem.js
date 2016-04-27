/**
 * Tab in the navbar
 */
var NavBarItem = React.createClass({
    propTypes: {
        id:             React.PropTypes.string,
        name:           React.PropTypes.string,
        active:         React.PropTypes.bool,
        onSelect:       React.PropTypes.func
    },

    render: function(){
        const navBarItemClass = (this.props.active ? 'active' : null) + " tabItem"; //Highlight active tab
        return(
            <li role="presentation" className={navBarItemClass}>
                <a href="#" onClick={this.props.onSelect.bind(null, this.props.id)}>
                    {this.props.name}
                </a>
            </li>
        );
    }
});
module.exports = NavBarItem;