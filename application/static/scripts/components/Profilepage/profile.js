
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
            dateAdded: new Date("March 6, 2016 11:32:10")
        },
        {
            ID: 71388002,
            name: "Procedure",
            dateAdded: new Date("March 6, 2016 11:32:11")
        }
    ];

var ProfilePage = React.createClass({
    //Initial state of the component
    getInitialState: function(){
        return (
            {
                currentTab: 'Termer'
            }
        );
    },

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

    render: function(){
        var content;
        switch(this.state.currentTab){
            case 'Termer':
                content = <TermPage terms={dummyTerms} nameSort={this.sortByName} IDSort={this.sortByID} dateSort={this.sortByDate}/>;
                break;
            case 'Diagram':
                content = <DiagramPage />;
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
                sortBy: 'Namn',
                ascending: true,
                terms: this.props.terms
            }
        );
    },

    //Sort terms by fav
    sortBy: function(header){
        var asc = true;
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

    render: function(){
        var TermArray = this.props.terms.map(function(term){
            //Date
            var day = ("0" + term.dateAdded.getDate()).slice(-2);
            var month = ("0" + term.dateAdded.getMonth()).slice(-2);
            var year = term.dateAdded.getUTCFullYear();
            //Time
            var hours = ("0" + term.dateAdded.getHours()).slice(-2);
            var minutes = ("0" + term.dateAdded.getMinutes()).slice(-2);
            var seconds = ("0" + term.dateAdded.getSeconds()).slice(-2);
            var time = hours + ":" + minutes + ":" + seconds;
            
            var dateString = year + "-" + month + "-" + day;
            return(
                <tr className="favorites">
                    <td className="favorites"> <a className="favorites" href="#">{term.name}</a></td>
                    <td className="favorites"> <a className="favorites" href="#">{term.ID}</a></td>
                    <td className="favorites">{dateString}</td>
                    <td id="RemoveGlyph" className="favorites"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></td>
                </tr>
            );
        }, this);

        return(
            <div>
                <h1>Favorittermer</h1>
                <hr className="favorites"></hr>
                <table className="favorites">
                    <tbody>
                        <th id="Namn" className="favorites" onClick={this.sortBy.bind(this, "Namn")}>Namn</th>
                        <th id="ID" className="favorites" onClick={this.sortBy.bind(this, "ID")}>ID</th>
                        <th id="Tillagd" className="favorites" onClick={this.sortBy.bind(this, "Tillagd")}>Tillagd</th>
                        <th id="Tabort" className="favorites"></th>
                        {TermArray}
                    </tbody>
                </table>
            </div>
        );
    }
});

var DiagramPage = React.createClass({
    render: function(){
        return(
            <h1>Diagram</h1>
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
        var navBarItemClass = (this.props.active ? 'active' : null);
        return(
            <li role="presentation" className={navBarItemClass}>
                <a href="#" onClick={this.props.onSelect.bind(this, this.props.name)} >{this.props.name}</a>
            </li>
        );
    }
});


// onClick={this.changeTab.bind(this, 'Termer')}

ReactDOM.render(
    <ProfilePage />,
    document.getElementById('content')
);







