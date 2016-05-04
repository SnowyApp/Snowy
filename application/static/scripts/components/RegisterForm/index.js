import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';


/**
 * Registration form component
 */
var RegisterForm = React.createClass({
    propTypes: {
        show:               React.PropTypes.bool,
        showRegistration:   React.PropTypes.func,
        url:                React.PropTypes.string,
        language:           React.PropTypes.string
    },

    //Dictionary for supported languages. m prefix indicates that its a error/success message
    dict: {
        se: {
            register:               "Registrera",
            registration:           "Registrering",
            email:                  "Email",
            password:               "Lösenord",
            repeat:                 "Upprepa",
            m_emailTaken:           "Den angivna email-adressen är upptagen.",
            m_regSuccessful:        "Registreringen lyckades.",
            m_regUnsuccessful:      "Registreringen misslyckades.",
            m_registering:          "Registreras...",
            passwordStrength:       ["Väldigt svagt", "Svagt", "Medel", "Starkt", "Väldigt starkt"]
        },
        en: {
            register:               "Register",
            registration:           "Registration",
            email:                  "Email",
            password:               "Password",
            repeat:                 "Repeat",
            m_emailTaken:           "The provided email is already in use.",
            m_regSuccessful:        "Registration successful.",
            m_regUnsuccessful:      "Registration unsuccessful.",
            m_registering:          "Registering...",
            passwordStrength:       ["Very weak", "Weak", "Decent", "Strong", "Very strong"]
        }
    },
    getInitialState: function(){
        return({
            email: "",
            validEmail: false,
            password: "",
            repeatPassword: "",
            matchingPasswords: false,
            passwordStrength: 0,
            statusMessage: {
                message: "",
                type: "none"
            },
            showModal: false
        });
    },

   /**
    * Resets the form and closes the popup
    */
    onSuccess: function(){
        this.resetForm();
        this.setState({
            statusMessage: {
                message: this.dict[this.props.language]["m_regSuccessful"],
                type: "success"
            }
        });
        document.getElementById("password").value = "";
        document.getElementById("repeatPassword").value = "";
        document.getElementById("email").value = "";
    },

   /**
    * Sets errorMessage to "Registration unsuccessful" and prints the error to console
    */
    onError: function(t, e){
        this.setState({
            statusMessage: {
                message: this.dict[this.props.language]["m_regUnsuccessful"],
                type: "error"
            }
        });
        //Print error to console
        console.log(t);
        console.log(e);
    },

   /**
    * Resets the form
    */
    resetForm: function(){
        this.setState({
            email: "",
            validEmail: false,
            password: "",
            repeatPassword: "",
            matchingPasswords: false,
            passwordStrength: 0,
            statusMessage: {
                message: "",
                type: "none"
            }
        });
    },

   /**
    * Handles submit of the form
    */
    handleSubmit: function(e){
        e.preventDefault();
        this.setState({
            statusMessage: {
                message: this.dict[this.props.language]["m_registering"],
                type: "working"
            }
        });
        $.ajax({
            type:"POST",
            url: this.props.url + "/register",
            data: JSON.stringify({"email": this.state.email, "password": this.state.password}),
            success: function (data) {
                this.onSuccess(data);
            }.bind(this),
            error: function (textStatus, errorThrown) {
                this.onError(textStatus, errorThrown);
            }.bind(this),
            contentType: "application/json",
            dataType: "json"
        });
    },

   /**
    * Checks if a valid email has been input
    */
    validateEmail: function(event){
        const input = event.target.value;
        const regEx = /^[A-Za-z0-9._\-åäöÅÄÖ]{1,40}\@[A-Za-z0-9.\-åäöÅÄÖ]{1,30}\.[A-Za-z\-åäöÅÄÖ]{2,25}$/;
        this.setState({
            email: input,
            validEmail: regEx.test(input)
        });
    },

   /**
    * Checks how strong the password is (lvl 0-4)
    */
    checkPasswordStrength: function(event){
        const input = event.target.value; //Value from input field
        var passwordStrength = 0;

        //Update state and provide a callback function for when the state is updated to check if the passwords are matching
        this.setState({
            password: input
        }, this.checkMatchingPasswords);

        //Minimum length to reach each password strength level
        const STR1_MIN_LENGTH = 7;
        const STR2_MIN_LENGTH = 9;
        const STR3_MIN_LENGTH = 11;
        const STR4_MIN_LENGTH = 13;

        const pwStrengthRegex = [
            /[A-ZÅÄÖ]/,                         //Upper case letters
            /[a-zåäö]/,                         //Lower case letters
            /[0-9]+/,                           //Digits
            /[^(A-Za-z0-9ÅÄÖåäö)]+/             //Other character (not letter or digit)
        ];

        //Check the input against all the regex and increment passwordStrength for each fulfilled condition
        for(var i = 0; i < 4; i++){
            if(pwStrengthRegex[i].test(input)){
                passwordStrength++;
            }
        }

        //Check if the password fulfills the conditions for each strength level
        if(input.length >= STR4_MIN_LENGTH && passwordStrength >= 4){
            this.setState({
                passwordStrength: 4,
                hasChanged: true
            });
        } else if(input.length >= STR3_MIN_LENGTH && passwordStrength >= 3){
            this.setState({
                passwordStrength: 3,
                hasChanged: true
            });
        } else if(input.length >= STR2_MIN_LENGTH && passwordStrength >= 2){
            this.setState({
                passwordStrength: 2,
                hasChanged: true
            });
        } else if(input.length >= STR1_MIN_LENGTH){
            this.setState({
                passwordStrength: 1,
                hasChanged: true
            });
        } else {
            this.setState({
                passwordStrength: 0,
                hasChanged: true
            });
        }
    },

   /**
    * Updates the repeatedPassword state to match the input field
    */
    updateRepeatedPassword: function(event){
        const input = event.target.value;
        //Update state and provide a callback function for when the state is updated to check if the passwords are matching
        this.setState({
            repeatPassword: input
        }, this.checkMatchingPasswords);
    },

   /**
    * Check if the two password fields match
    */
    checkMatchingPasswords: function(){
        this.setState({
            matchingPasswords: (this.state.password == this.state.repeatPassword)
        });
    },

   /**
    * Closes the login popup
    */
    close() {
        this.setState({ showModal: false });
        this.props.showRegistration(false);
        this.resetForm();
    },

   /**
    * Opens the login popup
    */
    open() {
        this.setState({ showModal: true });
    },

    componentWillReceiveProps(nextProps){
        this.setState({showModal: nextProps.show});
    },

    render: function(){
        const passwordStrength = this.state.passwordStrength;
        //Valid email
        var emailDivState = "form-group";
        var emailGlyphState = null;
        if(this.state.email.length > 0){
            emailDivState = emailDivState + " has-feedback " + (this.state.validEmail ? "has-success" : "has-error");
            emailGlyphState = "glyphicon form-control-feedback " + (this.state.validEmail ? "glyphicon-ok" : "glyphicon-remove");
        }

        //Password strength
        var passwordDivState = "form-group";
        var passwordGlyphState = null;
        if(this.state.password.length > 0){
            passwordDivState = passwordDivState + " has-feedback " + (passwordStrength > 0 ? "has-success" : "has-error");
            passwordGlyphState = "glyphicon form-control-feedback " + (passwordStrength > 0 ? "glyphicon-ok" : "glyphicon-remove");
        }

        const pwStrengthBarClass = "progress-bar pwStrengthBar";
        const pwStrengthBarColor = ["pwStrength0Color", "pwStrength1Color", "pwStrength2Color", "pwStrength3Color", "pwStrength4Color"];
        var pwStrengthBarTextClass = "pwStrengthText " + pwStrengthBarColor[passwordStrength];

        //Default bar color
        const barStyle = [
            {backgroundColor: "gray"},
            {backgroundColor: "gray"},
            {backgroundColor: "gray"},
            {backgroundColor: "gray"}
        ];

        //Password strength level colors
        const PWSTR_COLOR = ["gray", "#d9534f", "#f0ad4e", "#a6c060", "#5cb85c"];

        //Set the strength bar color according to password strength
        for(var i = 0; i < passwordStrength; i++){
            switch(passwordStrength){
            case 1:
                barStyle[i] = {backgroundColor: PWSTR_COLOR[passwordStrength]};
                break;
            case 2:
                barStyle[i] = {backgroundColor: PWSTR_COLOR[passwordStrength]};
                break;
            case 3:
                barStyle[i] = {backgroundColor: PWSTR_COLOR[passwordStrength]};
                break;
            case 4:
                barStyle[i] = {backgroundColor: PWSTR_COLOR[passwordStrength]};
                break;
            }
        }

        //Matching passwords
        var repeatDivState = "form-group";
        var repeatGlyphState = null;
        if(this.state.repeatPassword.length > 0){
            repeatDivState = repeatDivState + " has-feedback " + (this.state.matchingPasswords ? "has-success" : "has-error");
            repeatGlyphState = "glyphicon form-control-feedback " + (this.state.matchingPasswords ? "glyphicon-ok" : "glyphicon-remove");
        }
        //Disable submit button if insufficient information is provided
        var disableSubmit = (this.state.validEmail && this.state.password == this.state.repeatPassword && passwordStrength > 0 ? "" : "disabled");

        //Display a status message?
        var statusMessage = this.state.statusMessage;
        var statusMessageStyle;
        if(statusMessage.type == "success"){
            statusMessageStyle = {color: "#248d24"}
        } else if (statusMessage.type == "working") {
            statusMessageStyle = {color: "orange"}
        } else if (statusMessage.type == "error") {
            statusMessageStyle = {color: "red"}
        }

        return(
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header className="bg-primary" closeButton>
                    <Modal.Title>
                        {this.dict[this.props.language]["registration"]}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-horizontal" onSubmit={this.handleSubmit}>
                        {/* Email */}
                        <div className={emailDivState}>
                            <label htmlFor="password" className="col-sm-3 control-label">
                                {this.dict[this.props.language]["email"]}
                            </label>
                            <div className="col-sm-8">
                                <input
                                    type="text"
                                    id="email"
                                    onChange={this.validateEmail}
                                    className="form-control"
                                />
                                <span className={emailGlyphState}></span>
                            </div>
                        </div>
                        {/* Password */}
                        <div className={passwordDivState}>
                            <label htmlFor="password" className="col-sm-3 control-label">
                                {this.dict[this.props.language]["password"]}
                            </label>
                            <div className="col-sm-8">
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    onChange={this.checkPasswordStrength}
                                />
                                <span className={passwordGlyphState}></span>
                            </div>
                        </div>
                        {/* Password strength bar */}
                        <div className="col-sm-8 col-sm-offset-3" >
                            <div className="progress validationBar">
                                <div className={pwStrengthBarClass} style={barStyle[0]} role="progressbar"></div>
                                <div className="progress-bar pwStrengthSpace" role="progressbar"></div>
                                <div className={pwStrengthBarClass} style={barStyle[1]} role="progressbar"></div>
                                <div className="progress-bar pwStrengthSpace" role="progressbar"></div>
                                <div className={pwStrengthBarClass} style={barStyle[2]} role="progressbar"></div>
                                <div className="progress-bar pwStrengthSpace" role="progressbar"></div>
                                <div className={pwStrengthBarClass} style={barStyle[3]} role="progressbar"></div>
                            </div>
                            <div className={pwStrengthBarTextClass}>
                                {(this.state.password.length > 0 ? this.dict[this.props.language]["passwordStrength"][passwordStrength] : "")}
                            </div>
                        </div>
                        {/* Repeat password */}
                        <div className={repeatDivState}>
                            <label htmlFor="repeatPassword" className="col-sm-3 control-label">
                                {this.dict[this.props.language]["repeat"]}
                            </label>
                            <div className="col-sm-8">
                                <input
                                    type="password"
                                    id="repeatPassword"
                                    className="form-control"
                                    onChange={this.updateRepeatedPassword}
                                />
                                <span className={repeatGlyphState}></span>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-2">
                                <button type="submit" className="btn btn-success" disabled={disableSubmit}>
                                    {this.dict[this.props.language]["register"]}
                                </button>
                            </div>
                            <span style={statusMessageStyle} className="col-sm-7 statusMessage">{this.state.statusMessage.message}</span>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        );
    }
});

module.exports = RegisterForm;
