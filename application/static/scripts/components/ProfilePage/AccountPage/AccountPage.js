var ChangePersonalInformation = require('./ChangePersonalInformation');
var ChangePasswordForm = require('./ChangePasswordForm');

//Temporary fake user
var fakeUser = {
    id: 1337,
    username: "Arnold",
    email: "arnold@schwarzenegger.com",
    language: "eng"
}

/**
 * A page where the user can change profile ifo
 */
module.exports = React.createClass({
    getInitialState: function(){
        return ({
            nameOpen: false,
            passwordOpen: false,
            nameEnabled: true,
            passwordEnabled: true
        });
    },

   /**
    * Toggles between +/- expand glyph
    */
    openAcc: function(acc){
        var disableTime = 400;
        //Check what field was expanded
        if(acc == "name" && this.state.nameEnabled){
            //Update states and disable this function for a short time to prevent problems from clicking too fast
            this.setState({
                nameOpen: !this.state.nameOpen,
                nameEnabled: false 
            });
            //Reenable function after disableTime ms
            setTimeout($.proxy(function(){
                this.setState({
                    nameEnabled: true
                })
            }, this), disableTime);
        }
        else if(acc == "password" && this.state.passwordEnabled){
            this.setState({
                passwordOpen: !this.state.passwordOpen,
                passwordEnabled: false
            });
            //Disable this function for a short time to prevent problems from clicking too fast
            setTimeout($.proxy(function(){
                this.setState({
                    passwordEnabled: true
                })
            }, this), disableTime);
        }
    },

    render: function(){
        // +/- expand glyphs based on state
        var expandNameClass = "glyphicon expandGlyph " + (this.state.nameOpen ? "glyphicon-minus" : "glyphicon-plus");
        var expandPasswordClass = "glyphicon expandGlyph " + (this.state.passwordOpen ? "glyphicon-minus" : "glyphicon-plus");

        return(
            <div>
                <h1>
                    <span className="glyphicon glyphicon-user accHeaderGlyph accountGlyph" aria-hidden="true"> </span> 
                    {this.props.dict[fakeUser.language]["account"]}
                </h1>
                <hr className="profileHr"/>
                <div className="accountPageWrapper">

                    {/* NAME */}
                    <div className="col-sm-12">
                        <div className="panel-group accountSettingsPanel">
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                    <h4 className="panel-title">
                                    <a onClick={this.openAcc.bind(null, "name")} data-toggle="collapse" href="#nameCollapse">
                                        {this.props.dict[fakeUser.language]["name"]}
                                        <span className={expandNameClass} aria-hidden="true"></span>
                                    </a>
                                    </h4>
                                </div>
                                <div id="nameCollapse" className="panel-collapse collapse">
                                    <div className="panel-body">
                                        <ChangeNameAndEmailForm dict={this.props.dict} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="col-sm-12">
                        <div className="panel-group accountSettingsPanel">
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                    <h4 className="panel-title">
                                    <a onClick={this.openAcc.bind(null, "password")} data-toggle="collapse" href="#passwordCollapse">
                                        {this.props.dict[fakeUser.language]["password"]}
                                        <span className={expandPasswordClass} aria-hidden="true"></span>
                                    </a>
                                    </h4>
                                </div>
                                <div id="passwordCollapse" className="panel-collapse collapse">
                                    <div className="panel-body">
                                        <ChangePasswordForm dict={this.props.dict}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


