import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

var LogOut = require('../LogOut/index');
var RegisterForm = require('../RegisterForm/index');
var LoginForm = require('../LoginForm/index');
var Search = require('../Search/index');
var Export = require('../Export/index');

var Bar = React.createClass({
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
            <div>
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
            </div>
        ) : (
            <div>
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
            </div>
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
                <Search url={this.props.serverUrl} update={this.props.update} language={this.props.language}/>

                <ButtonToolbar id = "buttons">
                    {/* Database edition drop-down */}
                    <div className="btn-group">
                        <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown">
                            {this.dict[this.props.language]["version"]} <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a onClick={this.props.setEdition.bind(null,"en")} href="#">
                                    English Edition 2015-11-30
                                </a>
                            </li>
                            <li>
                                <a onClick={this.props.setEdition.bind(null,"se")} href="#">
                                    Swedish Edition 2015-11-30
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* Language drop-down */}
                    <div className="btn-group">
                        <button type="button" className="btn btn-primary dropdown-toggle flagButton" data-toggle="dropdown">
                            <img className="langFlagHeader" src={flagSrc}/> <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a onClick={this.props.setLanguage.bind(null,"en")} href="#">
                                    <img className="langFlag" src="static/img/flags/flag_eng.png"/> English
                                </a>
                            </li>
                            <li>
                                <a onClick={this.props.setLanguage.bind(null,"se")} href="#">
                                    <img className="langFlag" src="static/img/flags/flag_swe.png"/> Svenska
                                </a>
                            </li>
                        </ul>
                    </div>
                    <Export language={this.props.language} />
                    <Button
                        className="save-diagram"
                        bsStyle="primary"
                        onClick={this.props.saveDiagram}
                    >
                        {this.dict[this.props.language]["saveDiagram"]}
                    </Button>
                    {navButtons}
                </ButtonToolbar>
            </div>

        );
    }
});
module.exports = Bar;
