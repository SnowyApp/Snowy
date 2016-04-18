//Temporary fake user
var fakeUser = {
    id: 1337,
    username: "Arnold",
    email: "arnold@schwarzenegger.com",
    lang: "eng"
}

//Form that allows the user to change username and email
module.exports = React.createClass({
    getInitialState: function(){
        return({
            username: "",
            usernameHasChanged: false,
            email: "",
            emailHasChanged: false,
            validUsername: true,
            validEmail: true,
            errorMessage: "",
            successMessage: ""
        });
    },

    //Handles submitting the form
    handleSubmit: function(e){
        e.preventDefault();

        //test error
        if(this.state.username == "Greger"){
            this.setState({
                errorMessage: "Greger är ett fult namn.",
                successMessage: ""
            });
        }
        //Success
        else {
            this.setState({
                errorMessage: "",
                successMessage: this.props.dict[fakeUser.lang]["m_updateSuccessful"],
                usernameHasChanged: false,
                emailHasChanged: false
            });
        }
    },

    //Checks if the username is valid
    validateUsername: function(event){
        var input = event.target.value;
        var regEx = /^[A-Za-z0-9._\-åäöÅÄÖ]{3,15}$/;

        this.setState({
            username: input,
            validUsername: regEx.test(input),
            usernameHasChanged: true
        });
    },

    //Checks if the email is valid
    validateEmail: function(event){
        var input = event.target.value;
        var regEx = /^[A-Za-z0-9._\-åäöÅÄÖ]{1,40}\@[A-Za-z0-9.\-åäöÅÄÖ]{1,30}\.[A-Za-z\-åäöÅÄÖ]{2,25}$/;

        this.setState({
            email: input,
            validEmail: regEx.test(input),
            emailHasChanged: true
        });
    },

    render: function(){
        //Username validation style
        var usernameDivState = "form-group";
        var usernameGlyphState = null;        
        if(this.state.usernameHasChanged){
            usernameDivState = usernameDivState + " has-feedback " + (this.state.validUsername ? "has-success" : "has-error");
            usernameGlyphState = "glyphicon form-control-feedback " + (this.state.validUsername ? "glyphicon-ok" : "glyphicon-remove");
        }

        //Email validation style
        var emailDivState = "form-group";
        var emailGlyphState = null;        
        if(this.state.emailHasChanged){
            emailDivState = emailDivState + " has-feedback " + (this.state.validEmail ? "has-success" : "has-error");
            emailGlyphState = "glyphicon form-control-feedback " + (this.state.validEmail ? "glyphicon-ok" : "glyphicon-remove");
        }

        //Disable submit button if bad information is provided
        var disableSubmit = (this.state.validUsername && this.state.validEmail && (this.state.usernameHasChanged || this.state.emailHasChanged) ? "" : "disabled");

        //Error/success message
        var message = "";
        if(this.state.successMessage.length > 0){
            message = <span className="col-sm-6 successMessage">{this.state.successMessage}</span>;
        } else if(this.state.errorMessage.length > 0){
            message = <span className="col-sm-6 errorMessage">{this.state.errorMessage}</span>;
        }

        return(
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
                { /* Username */ }
                <div className={usernameDivState}>
                    <label htmlFor="username" className="col-sm-3 control-label ">{this.props.dict[fakeUser.lang]["username"]}</label>
                    <div className="col-sm-7">
                        <input type="text" className="form-control" defaultValue={fakeUser.username} onChange={this.validateUsername}/>
                        <span className={usernameGlyphState}></span>
                    </div>
                </div>                
                { /* Email */ }
                <div className={emailDivState}>
                    <label htmlFor="email" className="col-sm-3 control-label ">{this.props.dict[fakeUser.lang]["email"]}</label>
                    <div className="col-sm-7">
                        <input type="text" className="form-control" defaultValue={fakeUser.email} onChange={this.validateEmail}/>
                        <span className={emailGlyphState}></span>
                    </div>
                </div>  

                <div className="form-group">
                    <div className="col-sm-offset-3 col-sm-2">
                        <button type="submit" className="btn btn-success" disabled={disableSubmit}>{this.props.dict[fakeUser.lang]["update"]}</button>
                    </div>
                    {message}
                </div>
            </form>
        );
    }
});
