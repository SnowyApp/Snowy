/**
 * Login form component
 */
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

   /**
    * Closes the login popup
    */
    close: function() {
        this.setState({ showModal: false });
        this.props.hideLogin();
    },

   /**
    * Opens the login popup
    */
    open: function() {
        this.setState({ showModal: true });
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({showModal: nextProps.show});
    },

   /**
    * Logs the user in, resets the form and closes the popup
    */
    onSuccess: function(e){
        this.resetForm();
        this.close();
        this.props.onLogin(e.token);
    },

   /**
    * Sets errorMessage to "Login unsuccessful" and prints the error to console
    */
    onError: function(t, e) {
        this.setState({
            errorMessage: "Login unsuccessful"
        });
        //Print error messages to console
        console.log(t);
        console.log(e);
    },

   /**
    * Resets the login form
    */
    resetForm: function(){
        this.setState({
            email: "",
            validEmail: false,
            password: "",
            errorMessage: ""
        });
    },

   /**
    * Handles submit of the form
    */
    handleSubmit: function(e){
        e.preventDefault();
        $.ajax({
            type:"POST",
            url: this.props.url + "/login",
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
    * Updates the password state to match the input field
    */
    updatePassword: function(event){
        const input = event.target.value;
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
                    <Modal.Title>
                        Logga in
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-horizontal" onSubmit={this.handleSubmit}>
                        {/* Email */}
                        <div className={emailDivState}>
                            <label htmlFor="newPassword" className="col-sm-3 control-label">
                                Email
                            </label>
                            <div className="col-sm-8">
                                <input type="text" id="email" onChange={this.validateEmail} className="form-control"/>
                                <span className={emailGlyphState}></span>
                            </div>
                        </div>
                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="newPassword" className="col-sm-3 control-label">
                                Lösenord
                            </label>
                            <div className="col-sm-8">
                                <input type="password" id="password" onChange={this.updatePassword} className="form-control"/>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-2">
                                <button type="submit" className="btn btn-success" disabled={disableSubmit}>
                                    Logga in
                                </button>
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








