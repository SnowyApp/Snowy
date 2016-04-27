var NavBarItem = require('./NavBarItem');
import React from 'react';
import ReactDOM from 'react-dom';

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
var NavBar = React.createClass({
    propTypes: {
        dict:               React.PropTypes.object,
        language:           React.PropTypes.string,
        currentTab:         React.PropTypes.string,
        changeActiveTab:    React.PropTypes.func
    },

    render: function(){
        return(
            <div>
                <ul className="nav nav-tabs">
                    <NavBarItem
                        id="terms"
                        name={this.props.dict[this.props.language]["terms"]}
                        active={this.props.currentTab == 'terms'}
                        onSelect={this.props.changeActiveTab}
                    />
                    <NavBarItem
                        id="diagrams"
                        name={this.props.dict[this.props.language]["diagrams"]}
                        active={this.props.currentTab == 'diagrams'}
                        onSelect={this.props.changeActiveTab}
                    />
                    <NavBarItem
                        id="account"
                        name={this.props.dict[this.props.language]["account"]}
                        active={this.props.currentTab == 'account'}
                        onSelect={this.props.changeActiveTab}
                    />
                </ul>
            </div>
        );
    }
});
module.exports = NavBar;