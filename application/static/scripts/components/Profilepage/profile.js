
//Dummy data
    var dummyTerms = 
    [
        {
            ID: 308916002,
            name: "Environment",
            dateAdded: new Date("March 3, 2016 12:53:26")
        },
        {
            ID: 363787002,
            name: "Observable entity",
            dateAdded: new Date("May 4, 2015 12:33:23")
        },
        {
            ID: 362981000,
            name: "Qualifier value",
            dateAdded: new Date("March 5, 2016 11:32:10")
        },
        {
            ID: 71388002,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            ID: 71388004,
            name: "Procedure",
            dateAdded: new Date("March 7, 2016 11:32:11")
        }
    ];
    
    var dummyDiagrams = 
    [
        {
            ID: 308916002,
            name: "Environment",
            dateAdded: new Date("March 3, 2016 12:53:26"),
            parameters: {
                            p1: "stuff1",
                            p2: "stuff2",
                            p3: "stuff3"
                        }
        },
        {
            ID: 99991999,
            name: "beastmode",
            dateAdded: new Date("March 2, 2016 12:53:26"),
            parameters: {
                            p1: "stuff1",
                            p2: "stuff2",
                            p3: "stuff3"
                        }
        },
        {
            ID: 52300011,
            name: "extra$$",
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
            ID: 71388005,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            ID: 71388006,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            ID: 71388007,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            ID: 71388008,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            ID: 71388009,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            ID: 71388012,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            ID: 71388022,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        },
        {
            ID: 71388032,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        }
*/

var ProfilePage = React.createClass({
    //Initial state of the component
    getInitialState: function(){
        return (
            {
                currentTab: 'Termer'
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
                return a.name < b.name ? -1 : 1;
            }
            else{
                return a.name > b.name ? -1 : 1;
            }
        });
        return data;
    },

    //Sort table data by ID
    sortByID: function(data, asc){
        data.sort(function(a,b){
            if(asc){
                return a.ID < b.ID ? -1 : 1;
            }
            else{
                return a.ID > b.ID ? -1 : 1;
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
    
    //Remove an object from array with .ID == ID
    removeByID: function(array, ID){
        //Find the object and remove it from the array
        for(var i = 0; i < array.length; i++){              
            if(array[i].ID == ID){
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
                content = <TermPage terms={dummyTerms} openTerm={this.props.openTerm} removeID={this.removeByID} nameSort={this.sortByName} IDSort={this.sortByID} dateSort={this.sortByDate}/>;
                break;
            case 'Diagram':
                content = <DiagramPage removeID={this.removeByID}/>;
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

    //Sort terms by fav
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
            case "ID":
                this.setState({
                    terms: this.props.IDSort(this.state.terms, asc),
                    sortBy: 'ID'
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
    removeTerm: function(ID){
        //Remove element locally (for responsiveness)
        this.setState({
            terms: this.props.removeID(this.state.terms, ID)
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
                <Term key={term.ID} term={term} openTerm={this.props.openTerm} removeTerm={this.removeTerm} date={dateString} />
            );
        }, this);

        //Render the correct sorting arrows
        var nameSortArrow = null;
        var IDSortArrow = null;
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
            case "ID":
                if(this.state.ascending == true){
                    IDSortArrow = <span className="glyphicon glyphicon-triangle-bottom sortArrow" aria-hidden="true"></span>;
                }
                else{
                    IDSortArrow = <span className="glyphicon glyphicon-triangle-top sortArrow" aria-hidden="true"></span>;
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
                <h1>Favorittermer</h1>
                <hr className="favorites"></hr>
                <table className="favorites">
                    <thead>
                        <tr>
                            <th id="Namn" className="favorites" onClick={this.sortBy.bind(this, "Namn")}>Namn {nameSortArrow}</th>
                            <th id="ID" className="favorites" onClick={this.sortBy.bind(this, "ID")}>ID {IDSortArrow}</th>
                            <th id="Tillagd" className="favorites" onClick={this.sortBy.bind(this, "Tillagd")}>Tillagd {dateSortArrow}</th>
                            <th id="Tabort" className="favorites"></th>
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
                <td className="favorites"> <a className="favorites" href="#" onClick={this.props.openTerm.bind(null, this.props.term.ID)}>{this.props.term.name}</a></td>
                <td className="favorites"> <a className="favorites" href="#" onClick={this.props.openTerm.bind(null, this.props.term.ID)}>{this.props.term.ID}</a></td>
                <td className="favorites">{this.props.date}</td>
                <td id="RemoveGlyph" onClick={this.props.removeTerm.bind(null, this.props.term.ID)} className="favorites"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></td>
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
    
        //Remove element from the term table
    removeDiagram: function(ID){
        //Remove element locally (for responsiveness)
        this.setState({
            diagrams: this.props.removeID(this.state.diagrams, ID)
        });
        //TODO: Remove element from database
    },
    
    render: function(){
            //Generate the table rows
        var diagramArray = this.state.diagrams.map(function(diagram){
            //Date, "0" together with slice(-2) ensures the date format xxxx-xx-xx (e.g 3 -> 03)
            var day = ("0" + diagram.dateAdded.getDate()).slice(-2);
            var month = ("0" + diagram.dateAdded.getMonth()).slice(-2);
            var year = diagram.dateAdded.getUTCFullYear();
            
            var dateString = year + "-" + month + "-" + day;

            return(
                <DiagramElement key={diagram.ID} name={diagram.name} id={diagram.ID} date={dateString} parameters={diagram.parameters} removeID={this.removeDiagram}/>
            );
        }, this);
        return(
            <div>
                <h1>Diagram</h1>
                <hr className="favorites"></hr>
                {diagramArray}
            </div>
        );
    }
});

var DiagramElement = React.createClass({
    render: function(){
        return(
            <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                <div className="panel panel-default">
                    <div className="panel-heading accordionHeader" role="tab" id="headingOne">
                        <h4 className="panel-title">
                            <table className="favorites">
                                <tbody>
                                    <tr>                                    
                                        <td className="diagramName" >
                                            <a role="button" className="collapsed diagramName" data-toggle="collapse" href={"#" + this.props.id} aria-expanded="false" aria-controls="collapseOne">
                                                {this.props.name}
                                            </a>
                                        </td> 
                                        <td className="diagramRemove">
                                            <span className="glyphicon glyphicon-remove removeLink" aria-hidden="true" onClick={this.props.removeID.bind(null, this.props.id)}></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>


                        </h4>
                    </div>
                    <div id={this.props.id} className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                        <div className="panel-body">
                            <table className="favorites">
                                <tbody>
                                    <tr>                                    
                                        <td>ID:</td>
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
                    </div>
                </div>
            </div>
        );
    }
});

var AccountPage = React.createClass({
    render: function(){
        return(
            <h1>Konto</h1>
        );
    }
});


//Tab navigation for profile page
var NavBar = React.createClass({
    render: function(){
        return(
            <ul className="nav nav-tabs">
                <NavBarItem name="Termer" active={this.props.currentTab === 'Termer'} onSelect={this.props.changeActiveTab}/>
                <NavBarItem name="Diagram" active={this.props.currentTab === 'Diagram'} onSelect={this.props.changeActiveTab}/>
                <NavBarItem name="Konto" active={this.props.currentTab === 'Konto'} onSelect={this.props.changeActiveTab}/>
            </ul>
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

function openTerm(ID){
    console.log(ID);
}

ReactDOM.render(
    <ProfilePage openTerm={openTerm}/>, //Replace openTerm with function that opens up selected term
    document.getElementById('content')
);







