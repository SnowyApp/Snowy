var NavBarItem = require('./NavBarItem');

//Temporary fake user
var fakeUser = {
    id: 1337,
    username: "Arnold",
    email: "arnold@schwarzenegger.com",
    language: "eng"
}

/**
 * Tab navigation for profile page
 */
module.exports = React.createClass({
    render: function(){
        return(
            <div>
                <ul className="nav nav-tabs">
                    <NavBarItem
                        name={this.props.dict[fakeUser.language]["terms"]}
                        active={this.props.currentTab == 'terms'}
                        onSelect={this.props.changeActiveTab}
                    />
                    <NavBarItem
                        name={this.props.dict[fakeUser.language]["diagrams"]}
                        active={this.props.currentTab == 'diagrams'}
                        onSelect={this.props.changeActiveTab}
                    />
                    <NavBarItem
                        name={this.props.dict[fakeUser.language]["account"]}
                        active={this.props.currentTab == 'account'}
                        onSelect={this.props.changeActiveTab}
                    />
                </ul>
            </div>
        );
    }
});
