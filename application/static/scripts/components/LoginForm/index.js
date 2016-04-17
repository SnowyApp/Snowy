var LoginForm = React.createClass({
    propTypes:{
        hideLogin: React.PropTypes.func,
        show: React.PropTypes.bool
    },
    getInitialState: function(){
        return({
            email: "",
            validEmail: false,
            password: "",
            errorMessage: "",
            showModal: false
        });
    },
    close() {
        this.setState({ showModal: false });
        this.props.hideLogin()
    },

    open() {
        this.setState({ showModal: true });
    },

    componentWillReceiveProps(nextProps){
        this.setState({showModal: nextProps.show});
    },
    //Handles submit of the form
    handleSubmit: function(e){
        e.preventDefault();
        //TODO: Calls to database goes here
        //Email and password can be found in the states

        //Test example
        if(this.state.password != "123"){
            this.setState({
                errorMessage: "Emailadressen och lösenordet matchar inte."
            });
        }
        //Success
        else {
            this.setState({
                errorMessage: "",
                password: ""
            });
        }
    },

    //Check if a valid email has been input
    validateEmail: function(event){
        var input = event.target.value;
        var regEx = /^[A-Za-z0-9._\-åäöÅÄÖ]{1,40}\@[A-Za-z0-9.\-åäöÅÄÖ]{1,30}\.[A-Za-z\-åäöÅÄÖ]{2,25}$/;
        this.setState({
            email: input,
            validEmail: regEx.test(input)
        });
    },

    //Updates the password state to match the input field
    updatePassword: function(event){
        var input = event.target.value;
        this.setState({
            password: input
        });
    },

    
    render: function(){
        //Valid email
        var emailDivState = "form-group";
        var emailGlyphState = null;
        if(this.state.email.length > 0){
            emailDivState = emailDivState + " has-feedback " + (this.state.validEmail ? "has-success" : "has-error");
            emailGlyphState = "glyphicon form-control-feedback " + (this.state.validEmail ? "glyphicon-ok" : "glyphicon-remove");
        }        

        
        //Disable submit button if insufficient information is provided
        var disableSubmit = (this.state.validEmail ? "" : "disabled");

        //Error message
        var message = null;
        if(this.state.errorMessage.length > 0){
            message = <span className="col-sm-6 errorMessage">{this.state.errorMessage}</span>;
        }

        return(
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header className="bg-primary" closeButton>
                    <Modal.Title>Logga in</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-horizontal" onSubmit={this.handleSubmit}>
                        {/* Email */}
                        <div className={emailDivState}>
                            <label htmlFor="newPassword" className="col-sm-3 control-label">Email</label>
                            <div className="col-sm-8">
                                <input type="text" id="email" onChange={this.validateEmail} className="form-control"/>
                                <span className={emailGlyphState}></span>
                            </div>
                        </div>
                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="newPassword" className="col-sm-3 control-label">Lösenord</label>
                            <div className="col-sm-8">
                                <input type="password" id="password" onChange={this.updatePassword} className="form-control"/>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-2">
                                <button type="submit" className="btn btn-success" disabled={disableSubmit}>Logga in</button>
                            </div>
                            {message}
                        </div>

                    </form>

                </Modal.Body>
            </Modal>
        );
    }
});
module.exports = LoginForm;








