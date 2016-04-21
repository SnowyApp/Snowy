var NavBarItem = require('./NavBarItem');

/**
 * Tab navigation for profile page
 */
module.exports = React.createClass({
    render: function(){
        return(
            <div>
                <ul className="nav nav-tabs">
                    <NavBarItem
                        name={this.props.dict[fakeUser.lang]["terms"]}
                        active={this.props.currentTab == 'terms'}
                        onSelect={this.props.changeActiveTab}
                    />
                    <NavBarItem
                        name={this.props.dict[fakeUser.lang]["diagrams"]}
                        active={this.props.currentTab == 'diagrams'}
                        onSelect={this.props.changeActiveTab}
                    />
                    <NavBarItem
                        name={this.props.dict[fakeUser.lang]["account"]}
                        active={this.props.currentTab == 'account'}
                        onSelect={this.props.changeActiveTab}
                    />
                </ul>
            </div>
        );
    }
});
