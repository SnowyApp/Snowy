module.exports = React.createClass({
    render: function(){
        return (
            <ProfilePage openTerm={openTerm} openDiagram={openDiagram}/> //Replace openTerm with function that opens up selected term
        );
    }
});

function openTerm(id){
    console.log(id);
}

function openDiagram(id){
    console.log(id);
}


//Dictionary for supported languages. m prefix indicates that its a error/success message
var dict = {
    swe: {
        language: "Språk",
        username: "Användarnamn",
        email: "Email",
        date: "Datum",
        terms: "Termer",
        diagrams: "Diagram",
        account: "Konto",
        name: "Namn",
        password: "Lösenord",
        added: "Tillagd",
        favterms: "Favorittermer",
        update: "Uppdatera",
        newPassword: "Nytt lösenord",
        currentPassword: "Nuvarande lösenord",
        repeat: "Upprepa",
        m_wrongPassword:"Felaktigt lösenord.",
        m_emailTaken: "Den angivna email-adressen är upptagen.",
        m_updateSuccessful: "Din information har blivit uppdaterad.",
        m_updatePasswordSuccessful: "Ditt lösenord har uppdaterats.",
        passwordStrength: ["Väldigt svagt", "Svagt", "Medel", "Starkt", "Väldigt starkt"]
    },
    eng: {
        language: "Language",
        username: "Username",
        email: "Email",
        date: "Date",
        terms: "Terms",
        diagrams: "Diagrams",
        account: "Account",
        name: "Name",
        password: "Password",
        added: "Added",
        favterms: "Favourite terms",
        update: "Update",
        newPassword: "New password",
        currentPassword: "Current password",
        repeat: "Repeat",
        m_wrongPassword:"Wrong password.",
        m_emailTaken: "The provided email is already in use.",
        m_updateSuccessful: "Your information has been updated.",
        m_updatePasswordSuccessful: "Your password has been updated.",
        passwordStrength: ["Very weak", "Weak", "Decent", "Strong", "Very strong"]
    }
}


var fakeUser = {
    id: 1337,
    username: "Arnold",
    email: "arnold@schwarzenegger.com",
    lang: "eng"
}

//Dummy data
var dummyTerms = 
[
    {
        id: 308916002,
        name: "Environment",
        dateAdded: new Date("March 3, 2016 12:53:26")
    },
    {
        id: 363787002,
        name: "Observable entity",
        dateAdded: new Date("May 4, 2015 12:33:23")
    },
    {
        id: 362981000,
        name: "Qualifier value",
        dateAdded: new Date("March 5, 2016 11:32:10")
    },
    {
        id: 71388002,
        name: "Procedure",
        dateAdded: new Date("March 6, 2016 11:32:11")
    },
    {
        id: 71388004,
        name: "Procedure",
        dateAdded: new Date("March 7, 2016 11:32:11")
    }
];

var dummyDiagrams = 
[
    {
        id: 308916002,
        name: "Environment",
        dateAdded: new Date("March 3, 2016 12:53:26"),
        parameters: {
                        p1: "stuff1",
                        p2: "stuff2",
                        p3: "stuff3"
                    }
    },
    {
        id: 999919999,
        name: "beastmode",
        dateAdded: new Date("March 2, 2016 12:53:26"),
        parameters: {
                        p1: "stuff1",
                        p2: "stuff2",
                        p3: "stuff3"
                    }
    },
    {
        id: 523000113,
        name: "Axtra",
        dateAdded: new Date("March 1, 2016 12:53:26"),
        parameters: {
                        p1: "stuff1",
                        p2: "stuff2",
                        p3: "stuff3"
                    }
    },
    {
        id: 523000114,
        name: "Axtra",
        dateAdded: new Date("March 1, 2016 12:53:26"),
        parameters: {
                        p1: "stuff1",
                        p2: "stuff2",
                        p3: "stuff3"
                    }
    },
    {
        id: 523000115,
        name: "Axtra",
        dateAdded: new Date("March 1, 2016 12:53:26"),
        parameters: {
                        p1: "stuff1",
                        p2: "stuff2",
                        p3: "stuff3"
                    }
    },
    {
        id: 523000116,
        name: "Axtra",
        dateAdded: new Date("March 1, 2016 12:53:26"),
        parameters: {
                        p1: "stuff1",
                        p2: "stuff2",
                        p3: "stuff3"
                    }
    }
];


/*
,
        {
            id: 71388005,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            id: 71388006,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            id: 71388007,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            id: 71388008,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            id: 71388009,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            id: 71388012,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            id: 71388022,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            id: 71388032,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        }
*/

var ProfilePage = React.createClass({
    //Initial state of the component
    getInitialState: function(){
        return (
            {
                currentTab: 'diagrams'
            }
        );
    },

    //Set current tab
    changeTab: function(tab){    
        this.setState({
            currentTab: tab
        });
    },

    //Sort table data by name
    sortByName: function(data, asc){
        data.sort(function(a,b){
            if(asc){
                return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
            }
            else{
                return a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1;
            }
        });
        return data;
    },

    //Sort table data by id
    sortByid: function(data, asc){
        data.sort(function(a,b){
            if(asc){
                return a.id < b.id ? -1 : 1;
            }
            else{
                return a.id > b.id ? -1 : 1;
            }
        });
        return data;
    },

    //Sort table data by date added
    sortByDate: function(data, asc){
        data.sort(function(a,b){
            if(asc){
                return a.dateAdded < b.dateAdded ? -1 : 1;
            }
            else{
                return a.dateAdded > b.dateAdded ? -1 : 1;
            }
        });
        return data;
    },
    
    //Remove an object from array with .id == id
    removeById: function(array, id){
        //Find the object and remove it from the array
        for(var i = 0; i < array.length; i++){              
            if(array[i].id == id){
                array.splice(i, 1);
                break;
            }
        }
        return array;
    },

    render: function(){
        //Only render the current tab
        var content;
        switch(this.state.currentTab){
            case 'terms':
                content = <TermPage terms={dummyTerms} openTerm={this.props.openTerm} removeid={this.removeById} nameSort={this.sortByName} idSort={this.sortByid} dateSort={this.sortByDate}/>;
                break;
            case 'diagrams':
                content = <DiagramPage openDiagram={this.props.openDiagram} removeid={this.removeById} nameSort={this.sortByName} dateSort={this.sortByDate}/>;
                break;
            case 'account':
                content = <AccountPage />;
                break;
        }
        return(
            <div>
                <NavBar currentTab={this.state.currentTab} changeActiveTab={this.changeTab}/>
                <div className="profileContent">
                    {content}
                </div>
            </div>
        );
    }
});


var TermPage = React.createClass({

    getInitialState: function(){
        return (
            {
                terms: this.props.terms
            }
        );
    },

    componentDidMount: function(){
        this.setState({
            terms: this.props.dateSort(this.state.terms, false),
            sortBy: 'added',
            ascending: false
        });
    },

    //Sort terms by header
    sortBy: function(header){
        var asc = true;
        //If already sorting by header, invert order
        if(this.state.sortBy == header){
            var asc = !this.state.ascending;
        }
        switch(header){
            case "name":
                this.setState({
                    terms: this.props.nameSort(this.state.terms, asc),
                    sortBy: 'name'
                });
                break;
            case "id":
                this.setState({
                    terms: this.props.idSort(this.state.terms, asc),
                    sortBy: 'id'
                });
                break;
            case "added":
                this.setState({
                    terms: this.props.dateSort(this.state.terms, asc),
                    sortBy: 'added'
                });
                break;
        }

        this.setState({
            ascending: asc
        });

    },

    //Remove element from the term table
    removeTerm: function(id){
        //Remove element locally (for responsiveness)
        this.setState({
            terms: this.props.removeid(this.state.terms, id)
        });
        //TODO: Remove element from database
    },

    render: function(){
        //Generate the table rows
        var TermArray = this.state.terms.map(function(term){
            //Date, "0" together with slice(-2) ensures the date format xxxx-xx-xx (e.g 3 -> 03)
            var day = ("0" + term.dateAdded.getDate()).slice(-2);
            var month = ("0" + term.dateAdded.getMonth()).slice(-2);
            var year = term.dateAdded.getUTCFullYear();
            
            var dateString = year + "-" + month + "-" + day;

            return(
                <Term key={term.id} id={term.id} name={term.name} openTerm={this.props.openTerm} removeTerm={this.removeTerm} date={dateString} />
            );
        }, this);

        //Render the correct sorting arrows
        var nameSortArrow = null;
        var idSortArrow = null;
        var dateSortArrow = null;
        switch(this.state.sortBy){
            case "name":
                if(this.state.ascending == true){
                    nameSortArrow = <span className="glyphicon glyphicon-triangle-bottom sortArrow" aria-hidden="true"></span>;
                }
                else{
                    nameSortArrow = <span className="glyphicon glyphicon-triangle-top sortArrow" aria-hidden="true"></span>;
                }
                break;
            case "id":
                if(this.state.ascending == true){
                    idSortArrow = <span className="glyphicon glyphicon-triangle-bottom sortArrow" aria-hidden="true"></span>;
                }
                else{
                    idSortArrow = <span className="glyphicon glyphicon-triangle-top sortArrow" aria-hidden="true"></span>;
                }
                break;
            case "added":
                if(this.state.ascending == true){
                    dateSortArrow = <span className="glyphicon glyphicon-triangle-bottom sortArrow" aria-hidden="true"></span>;
                }
                else{
                    dateSortArrow = <span className="glyphicon glyphicon-triangle-top sortArrow" aria-hidden="true"></span>;
                }
                break;
        }

        return(
            <div>
                <h1><span className="glyphicon glyphicon-heart accHeaderGlyph favoritesGlyph" aria-hidden="true"> </span> {dict[fakeUser.lang]["favterms"]}</h1>
                <hr className="profileHr"/>
                <table className="favorites">
                    <thead>
                        <tr>
                            <th id="Term_name" className="favorites" onClick={this.sortBy.bind(this, "name")}>{dict[fakeUser.lang]["name"]} {nameSortArrow}</th>
                            <th id="Term_id" className="favorites" onClick={this.sortBy.bind(this, "id")}>ID {idSortArrow}</th>
                            <th id="Term_date" className="favorites" onClick={this.sortBy.bind(this, "added")}>{dict[fakeUser.lang]["added"]} {dateSortArrow}</th>
                            <th id="Term_remove" className="favorites"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {TermArray}
                    </tbody>
                </table>
            </div>
        );
    }
});

var Term = React.createClass({
    render: function(){
        return(
            <tr className="favorites">
                <td className="favorites"> <a className="favorites" href="#" onClick={this.props.openTerm.bind(null, this.props.id)}>{this.props.name}</a></td>
                <td className="favorites"> <a className="favorites" href="#" onClick={this.props.openTerm.bind(null, this.props.id)}>{this.props.id}</a></td>
                <td className="favorites">{this.props.date}</td>
                <td id="removeGlyph" className="favorites glyph" onClick={this.props.removeTerm.bind(null, this.props.id)}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></td>
            </tr>
        );
    }
});



var DiagramPage = React.createClass({

    getInitialState: function(){
        return({
            diagrams: dummyDiagrams,
            filteredDiagrams: dummyDiagrams
        });
    },

    componentDidMount: function(){
        this.setState({
            diagrams: this.props.dateSort(this.state.diagrams, false),
            sortBy: 'added',
            ascending: false
        });
    },

    //Sort diagrams by header
    sortBy: function(header){
        var asc = true;
        //If already sorting by header, invert order
        if(this.state.sortBy == header){
            var asc = !this.state.ascending;
        }
        switch(header){
            case "name":
                this.setState({
                    terms: this.props.nameSort(this.state.diagrams, asc),
                    sortBy: 'name'
                });
                break;
            case "added":
                this.setState({
                    terms: this.props.dateSort(this.state.diagrams, asc),
                    sortBy: 'added'
                });
                break;
        }

        this.setState({
            ascending: asc
        });

    },
    
    //Remove element from the diagram table
    removeDiagram: function(id){
        //Remove element locally (for responsiveness)
        var tempDiagrams = this.props.removeid(this.state.diagrams, id);
        this.setState({
            diagrams: tempDiagrams
        });
        //TODO: Remove element from database
    },

    filterDiagrams: function(event){
        var input = event.target.value;
        var regEx = new RegExp(input.toLowerCase());
        var filteredDiagrams = [];
        for(var i = 0; i < this.state.diagrams.length; i++){
            if(regEx.test(this.state.diagrams[i].name.toLowerCase())){
                filteredDiagrams.push(this.state.diagrams[i]);
            }
        }

        this.setState({
            filteredDiagrams: filteredDiagrams
        });
        
    },
    
    render: function(){
        //Generate the diagram elements
        var diagramArray = this.state.filteredDiagrams.map(function(diagram){
            //Date, "0" together with slice(-2) ensures the date format xxxx-xx-xx (e.g 3 -> 03)
            var day = ("0" + diagram.dateAdded.getDate()).slice(-2);
            var month = ("0" + diagram.dateAdded.getMonth()).slice(-2);
            var year = diagram.dateAdded.getUTCFullYear();
            
            var dateString = year + "-" + month + "-" + day;

            return(
                <DiagramElement key={diagram.id} name={diagram.name} id={diagram.id} date={dateString} parameters={diagram.parameters} openDiagram={this.props.openDiagram} removeDiagram={this.removeDiagram}/>
            );
        }, this);

        //Render the correct sorting arrows
        var nameSortArrow = null;
        var dateSortArrow = null;
        switch(this.state.sortBy){
            case "name":
                if(this.state.ascending == true){
                    nameSortArrow = <span className="glyphicon glyphicon-triangle-bottom sortArrow" aria-hidden="true"></span>;
                }
                else{
                    nameSortArrow = <span className="glyphicon glyphicon-triangle-top sortArrow" aria-hidden="true"></span>;
                }
                break;
            case "added":
                if(this.state.ascending == true){
                    dateSortArrow = <span className="glyphicon glyphicon-triangle-bottom sortArrow" aria-hidden="true"></span>;
                }
                else{
                    dateSortArrow = <span className="glyphicon glyphicon-triangle-top sortArrow" aria-hidden="true"></span>;
                }
                break;
        }

        return(
            <div>
                <h1><span className="glyphicon glyphicon-heart accHeaderGlyph favoritesGlyph" aria-hidden="true"> </span> {dict[fakeUser.lang]["diagrams"]}</h1>
                <hr className="profileHr"/>

                <div className="input-group" style={{marginBottom: "8px"}}>
                    <span className="input-group-addon" id="basic-addon1">Filter</span>
                    <input type="text" className="form-control" onChange={this.filterDiagrams} placeholder={dict[fakeUser.lang]["name"]}/>
                </div>

                <table className="favorites">
                    <thead>
                        <tr>
                            <th id="Diagram_name" className="favorites" onClick={this.sortBy.bind(this, "name")}>{dict[fakeUser.lang]["name"]} {nameSortArrow}</th>
                            <th id="Diagram_acc" className="favorites"></th>
                            <th id="Diagram_date" className="favorites" onClick={this.sortBy.bind(this, "added")}>{dict[fakeUser.lang]["added"]} {dateSortArrow}</th>
                            <th id="Diagram_remove" className="favorites"></th>
                        </tr>
                    </thead>
                    {diagramArray}
                </table>
            </div>
        );
    }
});


var DiagramElement = React.createClass({
    getInitialState: function(){
        return ({
            isOpen: false,
            buttonEnabled: true
        });
    },

    //Toggles accordion body
    openAcc: function(){
        var disableTime = 400;
        if(this.state.buttonEnabled){
            //Update states and disable this function for a short time to prevent problems from clicking too fast
            this.setState({
                isOpen: !this.state.isOpen,
                buttonEnabled: false
            })
        }
        //Reenable function after disableTime ms 
        setTimeout($.proxy(function(){
            this.setState({
                buttonEnabled: true
            })
        }, this), disableTime);
    },

    render: function(){
        //Different background colors depending on if the accordion is expanded
        var openCSS = (this.state.isOpen ? {backgroundColor: "#d9edf7"} : null);
        return(
            <tbody>
                <tr style={openCSS} className="favorites">
                    <td className="favorites">
                        <div className="panel-heading diagramAccordion" role="tab" id="headingOne">
                            <a className="favorites" href="#" onClick={this.props.openDiagram.bind(null, this.props.id)}>
                                {this.props.name}
                            </a>
                        </div>
                    </td>
                    <td id="infoGlyph" className="favorites glyph">
                        <a role="button" className="collapsed favorites" onClick={this.openAcc} data-toggle="collapse" href={"#" + this.props.id} aria-expanded="false">
                            <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                        </a>
                    </td>
                    <td className="favorites">{this.props.date}</td>
                    <td id="removeGlyph" className="favorites glyph" onClick={this.props.removeDiagram.bind(null, this.props.id)}><span className="glyphicon glyphicon-remove" aria-hidden="true"> </span></td>
                </tr>
                <tr>
                    <td colSpan="4">
                        <div id={this.props.id} className="panel-collapse collapse" role="tabpanel">
                            <div className="diagramHidden">
                                <table className="diagramHidden">
                                    <tbody>
                                        <tr>                                    
                                            <td>id:</td>
                                            <td>{this.props.id}</td>
                                        </tr>
                                        <tr>                                    
                                            <td>{dict[fakeUser.lang]["date"]}:</td>
                                            <td>{this.props.date}</td>
                                        </tr>
                                        <tr>                                    
                                            <td>Parameter 1:</td>
                                            <td>{this.props.parameters.p1}</td>
                                        </tr>
                                        <tr>                                    
                                            <td>Parameter 2:</td>
                                            <td>{this.props.parameters.p2}</td>
                                        </tr>      
                                        <tr>                                    
                                            <td>Parameter 3:</td>
                                            <td>{this.props.parameters.p3}</td>
                                        </tr>                                       
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        );
    }
});


var AccountPage = React.createClass({
    getInitialState: function(){
        return ({
            nameOpen: false,
            passwordOpen: false,
            nameEnabled: true,
            passwordEnabled: true
        });
    },

    //Toggles between +/- expand glyph
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
                <h1><span className="glyphicon glyphicon-user accHeaderGlyph accountGlyph" aria-hidden="true"> </span> {dict[fakeUser.lang]["account"]}</h1>
                <hr className="profileHr"/>

                {/* NAME ROW */}
                <div className="accSettingsRow col-sm-12">
                    <div className="col-sm-11">
                        <a className="settingCollapseHeader" onClick={this.openAcc.bind(null, "name")} data-toggle="collapse" href="#nameCollapse" aria-expanded="false">
                            {dict[fakeUser.lang]["name"]}
                        </a>
                    </div>
                    <div className="col-sm-1">
                        <a data-toggle="collapse" onClick={this.openAcc.bind(null, "name")} href="#nameCollapse" aria-expanded="false">
                            <span className={expandNameClass} aria-hidden="true"></span>
                        </a>
                    </div>

                    {/* HIDDEN NAME DIV */}
                    <div className="collapse col-sm-12 hiddenSettings" id="nameCollapse">
                        <div className="customWell">
                            <ChangeNameAndEmailForm />
                        </div>
                    </div>
                </div>

                {/* PASSWORD ROW */}
                <div className="accSettingsRow col-sm-12">
                    <div className="col-sm-11">
                        <a className="settingCollapseHeader" onClick={this.openAcc.bind(null, "password")} data-toggle="collapse" href="#passwordCollapse" aria-expanded="false">
                            {dict[fakeUser.lang]["password"]}
                        </a>
                    </div>
                    <div className="col-sm-1">
                        <a data-toggle="collapse" onClick={this.openAcc.bind(null, "password")} href="#passwordCollapse" aria-expanded="false">
                            <span className={expandPasswordClass} aria-hidden="true"></span>
                        </a>
                    </div>

                    {/* HIDDEN PASSWORD DIV */}
                    <div className="collapse col-sm-12 hiddenSettings" id="passwordCollapse">
                        <div className="customWell">
                            <ChangePasswordForm />
                        </div>
                    </div>

                </div>
            </div>
        );
    }
});

/*
<InputField fieldName="username" fieldDescription="Användarnamn" defaultValue={fakeUser.username} regEx="^[A-Za-z0-9._\-åäöÅÄÖ]{3,15}$" />
<InputField fieldName="email" fieldDescription="Email" defaultValue={fakeUser.email} regEx="^[A-Za-z0-9._\-åäöÅÄÖ]{1,40}\@[A-Za-z0-9.\-åäöÅÄÖ]{1,30}\.[A-Za-z\-åäöÅÄÖ]{2,25}$" />
*/


//Form for changing username and email
var ChangeNameAndEmailForm = React.createClass({
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
                successMessage: dict[fakeUser.lang]["m_updateSuccessful"],
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
                    <label htmlFor="username" className="col-sm-3 control-label ">{dict[fakeUser.lang]["username"]}</label>
                    <div className="col-sm-7">
                        <input type="text" className="form-control" defaultValue={fakeUser.username} onChange={this.validateUsername}/>
                        <span className={usernameGlyphState}></span>
                    </div>
                </div>                
                { /* Email */ }
                <div className={emailDivState}>
                    <label htmlFor="email" className="col-sm-3 control-label ">{dict[fakeUser.lang]["email"]}</label>
                    <div className="col-sm-7">
                        <input type="text" className="form-control" defaultValue={fakeUser.email} onChange={this.validateEmail}/>
                        <span className={emailGlyphState}></span>
                    </div>
                </div>  

                <div className="form-group">
                    <div className="col-sm-offset-3 col-sm-2">
                        <button type="submit" className="btn btn-success" disabled={disableSubmit}>{dict[fakeUser.lang]["update"]}</button>
                    </div>
                    {message}
                </div>
            </form>
        );
    }
});


var ChangePasswordForm = React.createClass({
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

    //Handles the submit of the form
    handleSubmit: function(e){
        e.preventDefault();
        //TODO: Calls to database goes here
        //inputs can be found in the states (newPassword, currPassword)        

        if(this.state.currPassword != "12345"){
            this.setState({
                errorMessage: dict[fakeUser.lang]["m_wrongPassword"],
                successMessage: ""
            });
        }
        //Success    
        else {
            this.setState({
                errorMessage: "",
                successMessage: dict[fakeUser.lang]["m_updatePasswordSuccessful"],
                hasChanged: false,
                newPassword: "",
                repeatPassword: "",
                currPassword: "",
                passwordStrength: 0
            });
            document.getElementById("newPassword").value = "";
            document.getElementById("repeatPassword").value = "";
            document.getElementById("currPassword").value = "";
        }
    },

    //Checks the strength of the password (0-4)
    checkPasswordStrength: function(event){
        var input = event.target.value; //Value from input field
        var passwordStrength = 0;

        //Update state and provide a callback function for when the state is updated to check if the passwords are matching
        this.setState({
            newPassword: input
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
            matchingPasswords: (this.state.newPassword == this.state.repeatPassword)
        });
    },

    //Updates the currPassword state to match input
    updateCurrPasswordState: function(event){
        var input = event.target.value;
        this.setState({
            currPassword: input
        });
    },
    
    render: function(){
        //Password strength
        var passwordDivState = "form-group"
        var passwordGlyphState = null;
        if(this.state.newPassword.length > 0){
            passwordDivState = passwordDivState + " has-feedback " + (this.state.passwordStrength > 0 ? "has-success" : "has-error");
            passwordGlyphState = "glyphicon form-control-feedback " + (this.state.passwordStrength > 0 ? "glyphicon-ok" : "glyphicon-remove");
        }

        var pwStrengthBarClass = "progress-bar pwStrengthBar";
        var pwStrengthBarColor = ["pwStrength0Color", "pwStrength1Color", "pwStrength2Color", "pwStrength3Color", "pwStrength4Color"]
        var pwStrengthBarTextClass = "pwStrengthText " + pwStrengthBarColor[this.state.passwordStrength];
        
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
        var disableSubmit = (this.state.newPassword == this.state.repeatPassword && this.state.passwordStrength > 0 && this.state.currPassword.length > 0 ? "" : "disabled");

        var message = "";
        if(this.state.successMessage.length > 0){
            message = <span className="col-sm-6 successMessage">{this.state.successMessage}</span>;
        } else if(this.state.errorMessage.length > 0){
            message = <span className="col-sm-6 errorMessage">{this.state.errorMessage}</span>;
        }

        return(
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
                <div className={passwordDivState}>
                    <label htmlFor="newPassword" className="col-sm-3 control-label">{dict[fakeUser.lang]["newPassword"]}</label>
                    <div className="col-sm-7">
                        <input type="password" id="newPassword" className="form-control" onChange={this.checkPasswordStrength} />
                        <span className={passwordGlyphState}></span>
                    </div>
                </div>

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
                    <div className={pwStrengthBarTextClass}>{(this.state.newPassword.length > 0 ? dict[fakeUser.lang]["passwordStrength"][this.state.passwordStrength] : "")}</div>
                </div>

                <div className={repeatDivState}>
                    <label htmlFor="repeatPassword" className="col-sm-3 control-label">{dict[fakeUser.lang]["repeat"]}</label>
                    <div className="col-sm-7">
                        <input type="password" id="repeatPassword" className="form-control" onChange={this.updateRepeatedPassword} />
                        <span className={repeatGlyphState}></span>
                    </div>
                </div>
            
                <div className="form-group">
                    <label htmlFor="inputPassword3" className="col-sm-3 control-label ">{dict[fakeUser.lang]["currentPassword"]}</label>
                    <div className="col-sm-7">
                        <input type="password" id="currPassword" className="form-control" onChange={this.updateCurrPasswordState}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-3 col-sm-2">
                        <button type="submit" className="btn btn-success" disabled={disableSubmit}>{dict[fakeUser.lang]["update"]}</button>
                    </div>
                    {message}
                </div>
                
            </form>
        );
    }
});


/*<ul className="dropdown-menu">
    <li><a href="#"><img className="langFlag" src="flags/flag_eng.png"/> English</a></li>
    <li><a href="#"><img className="langFlag" src="flags/flag_swe.png"/> Svenska</a></li>
</ul>*/


//Tab navigation for profile page
var NavBar = React.createClass({
    render: function(){
        return(
            <div>
                <ul className="nav nav-tabs">
                    <NavBarItem name="terms" active={this.props.currentTab === 'terms'} onSelect={this.props.changeActiveTab}/>
                    <NavBarItem name="diagrams" active={this.props.currentTab === 'diagrams'} onSelect={this.props.changeActiveTab}/>
                    <NavBarItem name="account" active={this.props.currentTab === 'account'} onSelect={this.props.changeActiveTab}/>
                </ul>
                <div className="btn-group langDropdown">
                    <button type="button" className="btn btn-default">{dict[fakeUser.lang]["language"]}</button>
                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="caret"></span>
                    <span className="sr-only">Toggle Dropdown</span>
                    </button>
                </div>
            </div>
        );
    }
});

//Tab in the navbar
var NavBarItem = React.createClass({
    render: function(){
        var navBarItemClass = (this.props.active ? 'active' : null) + " tabItem"; //Highlight active tab
        return(
            <li role="presentation" className={navBarItemClass}>
                <a href="#" onClick={this.props.onSelect.bind(null, this.props.name)}>{dict[fakeUser.lang][this.props.name]}</a>
            </li>
        );
    }
});



/*ReactDOM.render(
    <ProfilePage openTerm={openTerm} openDiagram={openDiagram}/>, //Replace openTerm with function that opens up selected term
    document.getElementById('content')
);*/







