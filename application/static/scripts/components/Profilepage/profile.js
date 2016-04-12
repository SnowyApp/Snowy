
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
                currentTab: 'Konto'
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
            case 'Termer':
                content = <TermPage terms={dummyTerms} openTerm={this.props.openTerm} removeid={this.removeById} nameSort={this.sortByName} idSort={this.sortByid} dateSort={this.sortByDate}/>;
                break;
            case 'Diagram':
                content = <DiagramPage openDiagram={this.props.openDiagram} removeid={this.removeById} nameSort={this.sortByName} dateSort={this.sortByDate}/>;
                break;
            case 'Konto':
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
            sortBy: 'Tillagd',
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
            case "Namn":
                this.setState({
                    terms: this.props.nameSort(this.state.terms, asc),
                    sortBy: 'Namn'
                });
                break;
            case "id":
                this.setState({
                    terms: this.props.idSort(this.state.terms, asc),
                    sortBy: 'id'
                });
                break;
            case "Tillagd":
                this.setState({
                    terms: this.props.dateSort(this.state.terms, asc),
                    sortBy: 'Tillagd'
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
            case "Namn":
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
            case "Tillagd":
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
                <h1><span className="glyphicon glyphicon-heart accHeaderGlyph favoritesGlyph" aria-hidden="true"> </span> Favorittermer</h1>
                <hr className="profileHr"/>
                <table className="favorites">
                    <thead>
                        <tr>
                            <th id="Term_name" className="favorites" onClick={this.sortBy.bind(this, "Namn")}>Namn {nameSortArrow}</th>
                            <th id="Term_id" className="favorites" onClick={this.sortBy.bind(this, "id")}>ID {idSortArrow}</th>
                            <th id="Term_date" className="favorites" onClick={this.sortBy.bind(this, "Tillagd")}>Tillagd {dateSortArrow}</th>
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
            diagrams: dummyDiagrams
        });
    },

    componentDidMount: function(){
        this.setState({
            diagrams: this.props.dateSort(this.state.diagrams, false),
            sortBy: 'Tillagd',
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
            case "Namn":
                this.setState({
                    terms: this.props.nameSort(this.state.diagrams, asc),
                    sortBy: 'Namn'
                });
                break;
            case "Tillagd":
                this.setState({
                    terms: this.props.dateSort(this.state.diagrams, asc),
                    sortBy: 'Tillagd'
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
    
    render: function(){
        //Generate the diagram elements
        var diagramArray = this.state.diagrams.map(function(diagram){
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
            case "Namn":
                if(this.state.ascending == true){
                    nameSortArrow = <span className="glyphicon glyphicon-triangle-bottom sortArrow" aria-hidden="true"></span>;
                }
                else{
                    nameSortArrow = <span className="glyphicon glyphicon-triangle-top sortArrow" aria-hidden="true"></span>;
                }
                break;
            case "Tillagd":
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
                <h1><span className="glyphicon glyphicon-heart accHeaderGlyph favoritesGlyph" aria-hidden="true"> </span> Diagram</h1>
                <hr className="profileHr"/>
                <table className="favorites">
                    <thead>
                        <tr>
                            <th id="Diagram_name" className="favorites" onClick={this.sortBy.bind(this, "Namn")}>Namn {nameSortArrow}</th>
                            <th id="Diagram_acc" className="favorites"></th>
                            <th id="Diagram_date" className="favorites" onClick={this.sortBy.bind(this, "Tillagd")}>Tillagd {dateSortArrow}</th>
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
                        <div id={this.props.id} className="panel-collapse collapse diagramHidden" role="tabpanel">
                            <table className="diagramHidden">
                                <tbody>
                                    <tr>                                    
                                        <td>id:</td>
                                        <td>{this.props.id}</td>
                                    </tr>
                                    <tr>                                    
                                        <td>Datum:</td>
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
        var expandName = (this.state.nameOpen ? <span className="glyphicon glyphicon-minus expandGlyph" aria-hidden="true"></span> : <span className="glyphicon glyphicon-plus expandGlyph" aria-hidden="true"></span>);
        var expandPassword = (this.state.passwordOpen ? <span className="glyphicon glyphicon-minus expandGlyph" aria-hidden="true"></span> : <span className="glyphicon glyphicon-plus expandGlyph" aria-hidden="true"></span>);

        return(
            <div>
                <h1><span className="glyphicon glyphicon-user accHeaderGlyph accountGlyph" aria-hidden="true"> </span> Konto</h1>
                <hr className="profileHr"/>

                <form className="form-horizontal">

                    <div className="accSettingsRow col-sm-12">
                        <div className="col-sm-11">
                            <a className="settingCollapseHeader" onClick={this.openAcc.bind(null, "name")} data-toggle="collapse" href="#nameCollapse" aria-expanded="false">
                                Namn
                            </a>
                        </div>
                        <div className="col-sm-1">
                            <a data-toggle="collapse" onClick={this.openAcc.bind(null, "name")} href="#nameCollapse" aria-expanded="false">
                                {expandName}
                            </a>
                        </div>

                        <div className="collapse col-sm-12 hiddenSettings" id="nameCollapse">
                            <div className="customWell">
                                <div className="form-group">
                                    <label htmlFor="inputEmail3" className="col-sm-3 control-label ">Användarnamn</label>
                                    <div className="col-sm-7">
                                        <input type="email" className="form-control" id="inputEmail3" placeholder="Email" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputEmail3" className="col-sm-3 control-label ">Email</label>
                                    <div className="col-sm-7">
                                        <input type="email" className="form-control" id="inputEmail3" placeholder="Email" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accSettingsRow col-sm-12">
                        <div className="col-sm-11">
                            <a className="settingCollapseHeader" onClick={this.openAcc.bind(null, "password")} data-toggle="collapse" href="#nameCollapse" aria-expanded="false">
                                Lösenord
                            </a>
                        </div>
                        <div className="col-sm-1">
                            <a data-toggle="collapse" onClick={this.openAcc.bind(null, "password")} href="#passwordCollapse" aria-expanded="false">
                                {expandPassword}
                            </a>
                        </div>
                    
                        <div className="collapse col-sm-12 hiddenSettings" id="passwordCollapse">
                            <div className="customWell">
                                <div className="form-group">
                                    <label htmlFor="inputPassword3" className="col-sm-3 control-label ">Nytt lösenord</label>
                                    <div className="col-sm-7">
                                        <input type="password" className="form-control" id="inputPassword3" placeholder="Password" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputPassword3" className="col-sm-3 control-label ">Upprepa</label>
                                    <div className="col-sm-7">
                                        <input type="password" className="form-control" id="inputPassword3" placeholder="Password" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputPassword3" className="col-sm-3 control-label ">Nuvarande lösenord</label>
                                    <div className="col-sm-7">
                                        <input type="password" className="form-control" id="inputPassword3" placeholder="Password" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="col-sm-offset-9 col-sm-2">
                                        <button type="submit" className="btn btn-default">Sign in</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        );
    }
});

//Tab navigation for profile page
var NavBar = React.createClass({
    render: function(){
        return(
            <div>
                <ul className="nav nav-tabs">
                    <NavBarItem name="Termer" active={this.props.currentTab === 'Termer'} onSelect={this.props.changeActiveTab}/>
                    <NavBarItem name="Diagram" active={this.props.currentTab === 'Diagram'} onSelect={this.props.changeActiveTab}/>
                    <NavBarItem name="Konto" active={this.props.currentTab === 'Konto'} onSelect={this.props.changeActiveTab}/>
                </ul>
                <div className="btn-group langDropdown">
                    <button type="button" className="btn btn-default">Språk</button>
                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="caret"></span>
                    <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <ul className="dropdown-menu">
                        <li><a href="#"><img className="langFlag" src="flags/flag_eng.png"/> English</a></li>
                        <li><a href="#"><img className="langFlag" src="flags/flag_swe.png"/> Svenska</a></li>
                    </ul>
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
                <a href="#" onClick={this.props.onSelect.bind(null, this.props.name)}>{this.props.name}</a>
            </li>
        );
    }
});

function openTerm(id){
    console.log(id);
}

function openDiagram(id){
    console.log(id);
}

ReactDOM.render(
    <ProfilePage openTerm={openTerm} openDiagram={openDiagram}/>, //Replace openTerm with function that opens up selected term
    document.getElementById('content')
);







