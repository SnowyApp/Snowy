/**
 * Tab in the navbar
 */
module.exports = React.createClass({
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
