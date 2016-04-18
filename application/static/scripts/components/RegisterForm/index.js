var RegisterForm = React.createClass({
    propTypes:{
        hideRegistration: React.PropTypes.func,
        show: React.PropTypes.bool
    },
    getInitialState: function(){
        return({
            email: "",
            validEmail: false,
            password: "",
            repeatPassword: "",
            matchingPasswords: false,
            passwordStrength: 0,
            errorMessage: "",
            showModal: false
        });
    },
    onSuccess: function(e){
        this.resetForm();
        this.close();
    },
    onError: function(t, e){
        this.setState({
            errorMessage: "Registration unsuccessful"
        });
    },
    resetForm: function(){
        this.setState({
            email: "",
            validEmail: false,
            password: "",
            repeatPassword: "",
            matchingPasswords: false,
            passwordStrength: 0,
            errorMessage: "",
        });
    },
    //Handles submit of the form
    handleSubmit: function(e){
        e.preventDefault();
        $.ajax({
            type:"POST",
            url: "/register",
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

    //Check if a valid email has been input
    validateEmail: function(event){
        var input = event.target.value;
        var regEx = /^[A-Za-z0-9._\-åäöÅÄÖ]{1,40}\@[A-Za-z0-9.\-åäöÅÄÖ]{1,30}\.[A-Za-z\-åäöÅÄÖ]{2,25}$/;
        this.setState({
            email: input,
            validEmail: regEx.test(input)
        });
    },

    //Checks how strong the password is (lvl 0-4)
    checkPasswordStrength: function(event){
        var input = event.target.value; //Value from input field
        var passwordStrength = 0;

        //Update state and provide a callback function for when the state is updated to check if the passwords are matching
        this.setState({
            password: input
        }, this.checkMatchingPasswords);

        //Minimum length to reach each password strength level
        var STR1_MIN_LENGTH = 7;
        var STR2_MIN_LENGTH = 9;
        var STR3_MIN_LENGTH = 11;
        var STR4_MIN_LENGTH = 13;

        var pwStrengthRegex = [
            /[A-ZÅÄÖ]/,                         //Upper case letters
            /[a-zåäö]/,                         //Lower case letters
            /[0-9]+/,                           //Digits
            /[^(A-Za-z0-9ÅÄÖåäö)]+/             //Other character (not letter or digit)
        ]

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

    //Updates the repeatedPassword state to match the input field
    updateRepeatedPassword: function(event){
        var input = event.target.value;
        //Update state and provide a callback function for when the state is updated to check if the passwords are matching
        this.setState({
            repeatPassword: input
        }, this.checkMatchingPasswords);
    },

    //Check if the two password fields match
    checkMatchingPasswords: function(){
        this.setState({
            matchingPasswords: (this.state.password == this.state.repeatPassword)
        });
    },
    close() {
        this.setState({ showModal: false });
        this.props.hideRegistration()
    },

    open() {
        this.setState({ showModal: true });
    },

    componentWillReceiveProps(nextProps){
        this.setState({showModal: nextProps.show});
    },
    
    render: function(){
        var containerClass = "registerForm panel panel-primary" + (this.props.show ? "" : " hide");
        //Valid email
        var emailDivState = "form-group";
        var emailGlyphState = null;
        if(this.state.email.length > 0){
            emailDivState = emailDivState + " has-feedback " + (this.state.validEmail ? "has-success" : "has-error");
            emailGlyphState = "glyphicon form-control-feedback " + (this.state.validEmail ? "glyphicon-ok" : "glyphicon-remove");
        }        

        //Password strength
        var passwordDivState = "form-group"
        var passwordGlyphState = null;
        if(this.state.password.length > 0){
            passwordDivState = passwordDivState + " has-feedback " + (this.state.passwordStrength > 0 ? "has-success" : "has-error");
            passwordGlyphState = "glyphicon form-control-feedback " + (this.state.passwordStrength > 0 ? "glyphicon-ok" : "glyphicon-remove");
        }

        var pwStrengthBarClass = "progress-bar pwStrengthBar";
        var pwStrengthText = [
            {
                className: "pwStrengthText pwStrength0Color",
                text: "Väldigt svagt"
            },
            {
                className: "pwStrengthText pwStrength1Color",
                text: "Svagt"
            },
            {
                className: "pwStrengthText pwStrength2Color",
                text: "Medel"
            },
            {
                className: "pwStrengthText pwStrength3Color",
                text: "Starkt"
            },
            {
                className: "pwStrengthText pwStrength4Color",
                text: "Väldigt starkt"
            }
        ];
        
        var barStyle = [
            {backgroundColor: "gray"},
            {backgroundColor: "gray"},
            {backgroundColor: "gray"},
            {backgroundColor: "gray"}
        ];

        for(var i = 0; i < this.state.passwordStrength; i++){
            switch(this.state.passwordStrength){
            case 1:
                barStyle[i] = {backgroundColor: "#d9534f"};
                break;
            case 2:
                barStyle[i] = {backgroundColor: "#f0ad4e"};
                break;
            case 3:
                barStyle[i] = {backgroundColor: "#a6c060"}; 
                break;
            case 4:
                barStyle[i] = {backgroundColor: "#5cb85c"};
                break;
            }    
        }
        
        //Matching passwords
        var repeatDivState = "form-group"
        var repeatGlyphState = null;
        if(this.state.repeatPassword.length > 0){
            repeatDivState = repeatDivState + " has-feedback " + (this.state.matchingPasswords ? "has-success" : "has-error");
            repeatGlyphState = "glyphicon form-control-feedback " + (this.state.matchingPasswords ? "glyphicon-ok" : "glyphicon-remove");
        }
        //Disable submit button if insufficient information is provided
        var disableSubmit = (this.state.validEmail && this.state.password == this.state.repeatPassword && this.state.passwordStrength > 0 ? "" : "disabled");

        //Error message
        var message = null;
        if(this.state.errorMessage.length > 0){
            message = <span className="col-sm-6 errorMessage">{this.state.errorMessage}</span>;
        }

        return(
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header className="bg-primary" closeButton>
                    <Modal.Title>Registrering</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-horizontal" onSubmit={this.handleSubmit}>
                        {/* Email */}                
                        <div className={emailDivState}>
                            <label htmlFor="password" className="col-sm-3 control-label">Email</label>
                            <div className="col-sm-8">
                                <input type="text" id="email" onChange={this.validateEmail} className="form-control"/>
                                <span className={emailGlyphState}></span>
                            </div>
                        </div>
                        {/* Password */}
                        <div className={passwordDivState}>
                            <label htmlFor="password" className="col-sm-3 control-label">Lösenord</label>
                            <div className="col-sm-8">
                                <input type="password" id="password" className="form-control" onChange={this.checkPasswordStrength} />
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
                            <div className={pwStrengthText[this.state.passwordStrength].className}>{(this.state.password.length > 0 ? pwStrengthText[this.state.passwordStrength].text : "")}</div>
                        </div>
                        {/* Repeat password */}
                        <div className={repeatDivState}>
                            <label htmlFor="repeatPassword" className="col-sm-3 control-label">Upprepa</label>
                            <div className="col-sm-8">
                                <input type="password" id="repeatPassword" className="form-control" onChange={this.updateRepeatedPassword} />
                                <span className={repeatGlyphState}></span>
                            </div>
                        </div>
                    
                        {/* Submit */}
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-2">
                                <button type="submit" className="btn btn-success" disabled={disableSubmit}>Registrera</button>
                            </div>
                            {message}
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        );
    }
});

module.exports = RegisterForm;




