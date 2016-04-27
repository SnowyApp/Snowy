var FavoriteTerms = require('./FavoriteTerms/FavoriteTerms');
var FavoriteDiagrams = require('./FavoriteDiagrams/FavoriteDiagrams');
var AccountPage = require('./AccountPage/AccountPage');
var NavBar = require('./NavBar/NavBar');


//Temporary fake user
var fakeUser = {
    id: 1337,
    firstName: "Arnold",
    surname: "Schwarzenegger",
    email: "arnold@schwarzenegger.com",
    language: "eng"
};

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

/**
 * Profile page component
 */
module.exports = React.createClass({
    propTypes: {
        openTerm:       React.PropTypes.func,
        openDiagram:    React.PropTypes.func,
        url:            React.PropTypes.string,
        language:       React.PropTypes.string
    },

    //Dictionary for supported languages. m prefix indicates that its a error/success message
    dict: {
        se: {
            language:                   "Språk",
            username:                   "Användarnamn",
            email:                      "Email",
            date:                       "Datum",
            terms:                      "Termer",
            diagrams:                   "Diagram",
            savedDiagrams:              "Sparade diagram",
            account:                    "Konto",
            name:                       "Namn",
            firstName:                  "Förnamn",
            lastName:                   "Efternamn",
            password:                   "Lösenord",
            added:                      "Tillagd",
            savedTerms:                 "Sparade termer",
            update:                     "Uppdatera",
            newPassword:                "Nytt lösenord",
            currentPassword:            "Nuvarande lösenord",
            repeat:                     "Upprepa",
            personalInfo:               "Personlig information",
            noSavedTerms:               "Du har inga sparade termer.",
            noSavedDiagrams:            "Du har inga sparade diagram.",
            m_wrongPassword:            "Felaktigt lösenord.",
            m_emailTaken:               "Den angivna email-adressen är upptagen.",
            m_updateSuccessful:         "Din information har blivit uppdaterad.",
            m_updatePasswordSuccessful: "Ditt lösenord har uppdaterats.",
            passwordStrength:           ["Väldigt svagt", "Svagt", "Medel", "Starkt", "Väldigt starkt"]
        },
        en: {
            language:                   "Language",
            username:                   "Username",
            email:                      "Email",
            date:                       "Date",
            terms:                      "Terms",
            diagrams:                   "Diagrams",
            savedDiagrams:              "Saved diagrams",
            account:                    "Account",
            name:                       "Name",
            firstName:                  "First name",
            lastName:                   "Last name",
            password:                   "Password",
            added:                      "Added",
            savedTerms:                 "Saved terms",
            update:                     "Update",
            newPassword:                "New password",
            currentPassword:            "Current password",
            repeat:                     "Repeat",
            personalInfo:               "Personal information",
            noSavedTerms:               "You don't have any saved terms.",
            noSavedDiagrams:            "You don't have any saved diagrams.",
            m_wrongPassword:            "Wrong password.",
            m_emailTaken:               "The provided email is already in use.",
            m_updateSuccessful:         "Your information has been updated.",
            m_updatePasswordSuccessful: "Your password has been updated.",
            passwordStrength:           ["Very weak", "Weak", "Decent", "Strong", "Very strong"]
        }
    },

    getInitialState: function(){
        return (
            {
                currentTab: 'terms'
            }
        );
    },

   /**
    * Sets current tab
    */
    changeTab: function(tab){    
        this.setState({
            currentTab: tab
        });
    },

   /**
    * Sorts table data by name
    */
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

   /**
    * Sorts table data by id
    */
    sortById: function(data, asc){
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

   /**
    * Sorts table data by date added
    */
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
    
   /**
    * Removes an object from array with .id == id
    */
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
                content = <FavoriteTerms
                                url={this.props.url}
                                dict={this.dict}
                                language={this.props.language}
                                openTerm={this.props.openTerm}
                                removeid={this.removeById}
                                nameSort={this.sortByName}
                                idSort={this.sortById}
                                dateSort={this.sortByDate}
                          />;
                break;
            case 'diagrams':
                content = <FavoriteDiagrams
                                url={this.props.url}
                                dict={this.dict}
                                language={this.props.language}
                                openDiagram={this.props.openDiagram}
                                removeid={this.removeById}
                                nameSort={this.sortByName}
                                dateSort={this.sortByDate}
                          />;
                break;
            case 'account':
                content = <AccountPage
                                url={this.props.url}
                                dict={this.dict}
                                language={this.props.language}
                          />;
                break;
        }
        return(
            <div>
                <NavBar
                    dict={this.dict}
                    language={this.props.language}
                    currentTab={this.state.currentTab}
                    changeActiveTab={this.changeTab}
                />
                <div className="profileContent">
                    {content}
                </div>
            </div>
        );
    }
});












