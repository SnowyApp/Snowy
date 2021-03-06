import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';

/**
 * Form that allows the user to change password
 */
var ChangePasswordForm = React.createClass({
    propTypes: {
        url:        React.PropTypes.string,
        dict:       React.PropTypes.object,
        language:   React.PropTypes.string
    },

    getInitialState: function(){
        return({
            newPassword: "",
            repeatPassword: "",
            currPassword: "",
            matchingPasswords: false,
            hasChanged: false,
            passwordStrength: 0,
            errorMessage: "",
            successMessage: ""
        });
    },

   /**
    * Handles the submit of the form
    */
    handleSubmit: function(e){
        e.preventDefault();
        if (cookie.load('userId') != null) {
            $.ajax({
                method: "PUT",
                url: this.props.url + "/password",
                headers: {
                    "Authorization": cookie.load("userId")
                },
                data: JSON.stringify({
                    "new_password": this.state.newPassword,
                    "curr_password": this.state.currPassword,
                    "invalidate_tokens": false
                }),
                success: function () {
                    console.log("Successfully updated password.");
                    this.setState({
                        errorMessage: "",
                        successMessage: this.props.dict[this.props.language]["m_updatePasswordSuccessful"],
                        hasChanged: false,
                        newPassword: "",
                        repeatPassword: "",
                        currPassword: "",
                        passwordStrength: 0
                    });
                    document.getElementById("newPassword").value = "";
                    document.getElementById("repeatPassword").value = "";
                    document.getElementById("currPassword").value = "";
                }.bind(this),
                error: function (textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                    console.log("Failed to update password.");
                    this.setState({
                        errorMessage: this.props.dict[this.props.language]["m_failedToUpdate"],
                        successMessage: ""
                    });
                },
                contentType: "application/json",
                dataType: "json"
            });
        }
    },

   /**
    * Checks the strength of the password (0-4)
    */
    checkPasswordStrength: function(event){
        const input = event.target.value; //Value from input field
        var passwordStrength = 0;

        //Update state and provide a callback function for when the state is updated to check if the passwords are matching
        this.setState({
            newPassword: input
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
            matchingPasswords: (this.state.newPassword == this.state.repeatPassword)
        });
    },

   /**
    * Updates the currPassword state to match input
    */
    updateCurrPasswordState: function(event){
        const input = event.target.value;
        this.setState({
            currPassword: input
        });
    },

    /*
    * Gets the CSS for the password strength bars depending on password strength
    * @passwordStrength Strength of the password (0-4)
    */
    getPasswordStrengthCSS: function (passwordStrength) {
        //Default bar color
        var barStyle = [
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

        return barStyle;
    },

    /*
    * Returns the password input component
    */
    getPasswordInput: function () {
        const passwordStrength = this.state.passwordStrength;

        //Password strength
        var passwordDivState = "form-group";
        var passwordGlyphState = null;
        if(this.state.newPassword.length > 0){
            passwordDivState = passwordDivState + " has-feedback " + (passwordStrength > 0 ? "has-success" : "has-error");
            passwordGlyphState = "glyphicon form-control-feedback " + (passwordStrength > 0 ? "glyphicon-ok" : "glyphicon-remove");
        }

        return (
            <div className={passwordDivState}>
                <label htmlFor="newPassword" className="col-sm-3 control-label">
                    {this.props.dict[this.props.language]["newPassword"]}
                </label>
                <div className="col-sm-7">
                    <input type="password" id="newPassword" className="form-control" onChange={this.checkPasswordStrength} />
                    <span className={passwordGlyphState}></span>
                </div>
            </div>
        );
    },

    /*
    * Returns the password strength bar
    */
    getPasswordStrengthBar: function () {
        const passwordStrength = this.state.passwordStrength;

        const pwStrengthBarClass = "progress-bar pwStrengthBar";
        const pwStrengthBarColor = ["pwStrength0Color", "pwStrength1Color", "pwStrength2Color", "pwStrength3Color", "pwStrength4Color"];
        var pwStrengthBarTextClass = "pwStrengthText " + pwStrengthBarColor[passwordStrength];

        //Get password strength bar CSS
        const barStyle = this.getPasswordStrengthCSS(passwordStrength);

        return (
            <div className="col-sm-7 col-sm-offset-3" >
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
                    {(this.state.newPassword.length > 0 ? this.props.dict[this.props.language]["passwordStrength"][passwordStrength] : "")}
                </div>
            </div>
        );
    },

    /*
    * Returns the repeat password input component
    */
    getRepeatPasswordInput: function () {
        //Matching passwords
        var repeatDivState = "form-group";
        var repeatGlyphState = null;
        if(this.state.repeatPassword.length > 0){
            repeatDivState = repeatDivState + " has-feedback " + (this.state.matchingPasswords ? "has-success" : "has-error");
            repeatGlyphState = "glyphicon form-control-feedback " + (this.state.matchingPasswords ? "glyphicon-ok" : "glyphicon-remove");
        }

        return (
            <div className={repeatDivState}>
                <label htmlFor="repeatPassword" className="col-sm-3 control-label">
                    {this.props.dict[this.props.language]["repeat"]}
                </label>
                <div className="col-sm-7">
                    <input type="password" id="repeatPassword" className="form-control" onChange={this.updateRepeatedPassword} />
                    <span className={repeatGlyphState}></span>
                </div>
            </div>
        );
    },

    /*
    * Returns the current password input component
    */
    getCurrentPasswordInput: function () {
        return (
            <div className="form-group">
                <label htmlFor="inputPassword3" className="col-sm-3 control-label ">
                    {this.props.dict[this.props.language]["currentPassword"]}
                </label>
                <div className="col-sm-7">
                    <input type="password" id="currPassword" className="form-control" onChange={this.updateCurrPasswordState}/>
                </div>
            </div>
        );
    },

    /*
    * Returns the submit button and status message
    */
    getSubmitButton: function () {
        //Disable submit button if insufficient information is provided
        var disableSubmit = (this.state.newPassword == this.state.repeatPassword && this.state.passwordStrength > 0 && this.state.currPassword.length > 0 ? "" : "disabled");

        var message = "";
        if(this.state.successMessage.length > 0){
            message = <span className="col-sm-6 successMessage">{this.state.successMessage}</span>;
        } else if(this.state.errorMessage.length > 0){
            message = <span className="col-sm-6 errorMessage">{this.state.errorMessage}</span>;
        }

        return (
            <div className="form-group">
                <div className="col-sm-offset-3 col-sm-2">
                    <button type="submit" className="btn btn-success" disabled={disableSubmit}>
                        {this.props.dict[this.props.language]["update"]}
                    </button>
                </div>
                {message}
            </div>
        );
    },

    render: function(){
        return(
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
                {this.getPasswordInput()}
                {this.getPasswordStrengthBar()}
                {this.getRepeatPasswordInput()}
                {this.getCurrentPasswordInput()}
                {this.getSubmitButton()}
            </form>
        );
    }
});
module.exports = ChangePasswordForm;
