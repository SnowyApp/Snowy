import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Dropdown from 'react-bootstrap/lib/Dropdown';

// Logout component
var LogOut = require('../LogOut/index');
// RegisterForm component
var RegisterForm = require('../RegisterForm/index');
// LoginForm component
var LoginForm = require('../LoginForm/index');
// Search component
var Search = require('../Search/index');

/**
 * Contains and handles the buttons on the navigation bar
 */
var Bar = React.createClass({
    propTypes: {
        update:         React.PropTypes.func,
        isLoggedIn:     React.PropTypes.bool,
        onLogin:        React.PropTypes.func,
        onLogout:       React.PropTypes.func,
        url:            React.PropTypes.string,
        setContent:     React.PropTypes.func,
        contentName:    React.PropTypes.string,
        language:       React.PropTypes.string,
        setLanguage:    React.PropTypes.func,
        setEdition:     React.PropTypes.func,
        saveDiagram:    React.PropTypes.func,
        selectedTerm:   React.PropTypes.number,
        resetRoot:      React.PropTypes.func
    },
    //Dictionary for supported languages
    dict: {
        se: {
            search:       "Sök",
            edition:      "Utgåva",
            saveDiagram:  "Spara diagram",
            diagram:      "Diagram",
            login:        "Logga in",
            logout:       "Logga ut",
            register:     "Registrera",
            profile:      "Profilsida"
        },
        en: {
            search:       "Search",
            edition:      "Edition",
            saveDiagram:  "Save diagram",
            diagram:      "Diagram",
            login:        "Log in",
            logout:       "Log out",
            register:     "Register",
            profile:      "Profile"
        }
    },

    getInitialState: function(){
        return{
            showRegistration: false,
            showLogin: false,
            showLogout: false
        };
    },
    /**
     *  Sets value of showRegistration to e
     *  Which determines if the Registration Modal is visible
     */
    showRegistration: function(e){
        this.setState({
            showRegistration: e
        });
    },
    /**
     *  Sets value of showLogin to e
     *  Which determines if the Login Modal is visible
     */
    showLogin: function(e){
        this.setState({
            showLogin: e
        });
    },
    /**
     *  Sets value of showLogout to e
     *  Which determines if the Logout Modal is visible
     */
    showLogout: function(e){
        this.setState({
            showLogout: e
        });
    },
    render: function() {
        var switchName = '';
        switch(this.props.contentName){
            case "diagram":
                switchName = "profile";
                break;
            case "profile":
                switchName = "diagram";
                break;
            default:
                switchName = "profile";
                break;
        }
        const navButtons = this.props.isLoggedIn ? (
            <ButtonToolbar id = "loginButtons">
                <Button className="profile"
                        onClick={this.props.setContent.bind(null, switchName.toLowerCase())}
                        bsStyle = "primary" >{this.dict[this.props.language][switchName]}</Button>
                <Button className="Logout" bsStyle = "primary"
                        onClick={this.showLogout.bind(this, true)}>{this.dict[this.props.language]["logout"]}</Button>
                <LogOut
                    show={this.state.showLogout}
                    showLogout={this.showLogout}
                    onLogout={this.props.onLogout}
                    url={this.props.url}
                    language={this.props.language}
                />
            </ButtonToolbar>
        ) : (
            <ButtonToolbar id = "loginButtons">
                <Button className="Register" bsStyle = "primary"
                        onClick={this.showRegistration.bind(this, true)}>{this.dict[this.props.language]["register"]}</Button>
                <Button className="Login" bsStyle = "primary"
                        onClick={this.showLogin.bind(this, true)}>{this.dict[this.props.language]["login"]}</Button>
                {/* Registration popup */}
                <RegisterForm
                    show={this.state.showRegistration}
                    showRegistration={this.showRegistration}
                    url={this.props.url}
                    language={this.props.language}
                />

                {/* Login popup */}
                <LoginForm
                    show={this.state.showLogin}
                    showLogin={this.showLogin}
                    onLogin={this.props.onLogin}
                    url={this.props.url}
                    language={this.props.language}
                />
            </ButtonToolbar>
        );

        //Language button
        var flagSrc = null;
        switch(this.props.language){
            case "en":
                flagSrc = "static/img/flags/flag_eng.png";
                break;
            case "se":
                flagSrc = "static/img/flags/flag_swe.png";
                break;
            default:
                console.log("Language prop not valid");
                break;
        }

        return (
            <div className="bar">
                <img className="logotype" onClick={this.props.resetRoot} src="static/img/Snowy_official_logotype.png"/>
                <Search url={this.props.url} update={this.props.update} language={this.props.language}/>
                <ButtonToolbar id = "buttons">
                    {/* Database edition drop-down */}
                    <DropdownButton bsStyle="success" title={this.dict[this.props.language]["edition"]} id="Edition">
                        <MenuItem onClick={this.props.setEdition.bind(null,"int20150731")}>
                            International Edition 20150731
                        </MenuItem>
                    </DropdownButton>
                    {/* Language drop-down */}
                    <Dropdown id="language" >
                        <Dropdown.Toggle bsStyle="primary">
                            <img className="langFlagHeader" src={flagSrc}/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className ="languageFlags">
                            <MenuItem onClick={this.props.setLanguage.bind(null,"en")}>
                                <img className="langFlag" src="static/img/flags/flag_eng.png"/>
                                English
                            </MenuItem>
                            <MenuItem onClick={this.props.setLanguage.bind(null,"se")}>
                                <img className="langFlag" src="static/img/flags/flag_swe.png"/>
                                Svenska
                            </MenuItem>
                        </Dropdown.Menu>
                    </Dropdown>
                    {navButtons}
                </ButtonToolbar>
            </div>

        );
    }
});
module.exports = Bar;
