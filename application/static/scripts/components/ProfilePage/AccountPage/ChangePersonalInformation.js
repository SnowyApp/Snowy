import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';

/**
 * Form that allows the user to change username and email
 */
var ChangePersonalInformation = React.createClass({
    propTypes: {
        url:        React.PropTypes.string,
        dict:       React.PropTypes.object,
        language:   React.PropTypes.string,
        dbEdition:  React.PropTypes.string,
        user:       React.PropTypes.object,
        updateUser: React.PropTypes.func
    },

    getInitialState: function(){
        return({
            firstName: this.props.user.firstName,
            firstNameHasChanged: false,
            lastName: this.props.user.lastName,
            lastNameHasChanged: false,
            email: this.props.user.email,
            emailHasChanged: false,
            validFirstName: true,
            validLastName: true,
            validEmail: true,
            errorMessage: "",
            successMessage: ""
        });
    },

   /**
    * Handles submitting the form
    */
    handleSubmit: function(e){
        e.preventDefault();
        if (cookie.load('userId') != null) {
            $.ajax({
                method: "PUT",
                url: this.props.url + "/user_info",
                headers: {
                    "Authorization": cookie.load("userId")
                },
                data: JSON.stringify({
                    "first_name": this.state.firstName,
                    "last_name": this.state.lastName,
                    "site_lang": this.props.language,
                    "db_edition": this.props.dbEdition,
                    "email": this.state.email
                }),
                success: function () {
                    console.log("Successfully updated user info.");
                    this.setState({
                        errorMessage: "",
                        successMessage: this.props.dict[this.props.language]["m_updateSuccessful"],
                        firstNameHasChanged: false,
                        lastNameHasChanged: false,
                        emailHasChanged: false
                    });
                    this.props.updateUser();
                }.bind(this),
                error: function (textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                    console.log("Failed to update user info.");
                    this.setState({
                        errorMessage: this.props.dict[this.props.language]["m_failedToUpdate"],
                        successMessage: ""
                    });
                }.bind(this),
                contentType: "application/json",
                dataType: "json"
            });
        }
    },

   /**
    * Checks if the username is valid
    */
    validateName: function(event){
        var input = event.target.value;
        const regEx = /^[A-Za-zåäöÅÄÖ]{2,30}$/;

        //First name
        if(event.target.id == "firstName"){
            this.setState({
                firstName: input,
                validFirstName: regEx.test(input),
                firstNameHasChanged: true
            });
        }
        //Last name
        else if (event.target.id == "lastName") {
            this.setState({
                lastName: input,
                validLastName: regEx.test(input),
                lastNameHasChanged: true
            });
        }
    },

   /**
    * Checks if the email is valid
    */
    validateEmail: function(event){
        var input = event.target.value;
        var regEx = /^[A-Za-z0-9._\-åäöÅÄÖ]{1,40}\@[A-Za-z0-9.\-åäöÅÄÖ]{1,30}\.[A-Za-z\-åäöÅÄÖ]{2,25}$/;

        this.setState({
            email: input,
            validEmail: regEx.test(input),
            emailHasChanged: true
        });
    },

    /*
    * Returns the first name input component
    */
    getFirstNameInput: function () {
        //First name validation style
        var firstNameDivState = "form-group";
        var firstNameGlyphState = null;
        if(this.state.firstNameHasChanged && this.state.firstName.length > 0){
            firstNameDivState = firstNameDivState + " has-feedback " + (this.state.validFirstName ? "has-success" : "has-error");
            firstNameGlyphState = "glyphicon form-control-feedback " + (this.state.validFirstName ? "glyphicon-ok" : "glyphicon-remove");
        }

        return (
            <div className={firstNameDivState}>
                <label htmlFor="firstName" className="col-sm-3 control-label ">
                    {this.props.dict[this.props.language]["firstName"]}
                </label>
                <div className="col-sm-7">
                    <input type="text" className="form-control" id="firstName" value={this.state.firstName} onChange={this.validateName}/>
                    <span className={firstNameGlyphState}></span>
                </div>
            </div>
        );
    },

    /*
    * Returns the last name input component
    */
    getLastNameInput: function () {
        //Last name validation style
        var lastNameDivState = "form-group";
        var lastNameGlyphState = null;
        if(this.state.lastNameHasChanged && this.state.lastName.length > 0){
            lastNameDivState = lastNameDivState + " has-feedback " + (this.state.validLastName ? "has-success" : "has-error");
            lastNameGlyphState = "glyphicon form-control-feedback " + (this.state.validLastName ? "glyphicon-ok" : "glyphicon-remove");
        }

        return (
            <div className={lastNameDivState}>
                <label htmlFor="lastName" className="col-sm-3 control-label ">
                    {this.props.dict[this.props.language]["lastName"]}
                </label>
                <div className="col-sm-7">
                    <input type="text" className="form-control" id="lastName" value={this.state.lastName} onChange={this.validateName}/>
                    <span className={lastNameGlyphState}></span>
                </div>
            </div>
        );
    },

    /*
    * Returns the email input component
    */
    getEmailInput: function () {
        //Email validation style
        var emailDivState = "form-group";
        var emailGlyphState = null;
        if(this.state.emailHasChanged){
            emailDivState = emailDivState + " has-feedback " + (this.state.validEmail ? "has-success" : "has-error");
            emailGlyphState = "glyphicon form-control-feedback " + (this.state.validEmail ? "glyphicon-ok" : "glyphicon-remove");
        }

        return (
            <div className={emailDivState}>
                <label htmlFor="email" className="col-sm-3 control-label ">
                    {this.props.dict[this.props.language]["email"]}
                </label>
                <div className="col-sm-7">
                    <input type="text" className="form-control" value={this.state.email} onChange={this.validateEmail}/>
                    <span className={emailGlyphState}></span>
                </div>
            </div>
        );
    },

    /*
    * Returns the submit button and status message component
    */
    getSubmitButton: function () {
        //Disable submit button if bad information is provided
        var disableSubmit = (
                                (this.state.firstName.length == 0 || this.state.validFirstName) &&
                                (this.state.lastName.length == 0 || this.state.validLastName) &&
                                this.state.validEmail &&
                                (
                                    this.state.firstNameHasChanged ||
                                    this.state.lastNameHasChanged ||
                                    this.state.emailHasChanged
                                )
                                ? "" : "disabled");

        //Error/success message
        var message = "";
        if(this.state.successMessage.length > 0){
            message = <span className="col-sm-6 successMessage">
                        {this.state.successMessage}
                      </span>;
        } else if(this.state.errorMessage.length > 0){
            message = <span className="col-sm-6 errorMessage">
                        {this.state.errorMessage}
                      </span>;
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
                {this.getFirstNameInput()}
                {this.getLastNameInput()}
                {this.getEmailInput()}
                {this.getSubmitButton()}
            </form>
        );
    }
});
module.exports = ChangePersonalInformation;
