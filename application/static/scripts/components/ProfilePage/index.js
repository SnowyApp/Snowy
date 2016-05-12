var FavoriteTerms = require('./FavoriteTerms/FavoriteTerms');
var FavoriteDiagrams = require('./FavoriteDiagrams/FavoriteDiagrams');
var AccountPage = require('./AccountPage/AccountPage');
var NavBar = require('./NavBar/NavBar');
import React from 'react';
import ReactDOM from 'react-dom';


/**
 * Profile page component
 */
var ProfilePage = React.createClass({
    propTypes: {
        removeFavoriteTerm: React.PropTypes.func,
        removeid:           React.PropTypes.func,
        favoriteTerms:      React.PropTypes.array,
        openTerm:           React.PropTypes.func,
        openDiagram:        React.PropTypes.func,
        url:                React.PropTypes.string,
        language:           React.PropTypes.string,
        dbEdition:          React.PropTypes.string,
        user:               React.PropTypes.object,
        updateUser:         React.PropTypes.func
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
            m_noDescription:            "Det finns ingen beskrivning för detta diagram.",
            m_wrongPassword:            "Felaktigt lösenord.",
            m_emailTaken:               "Den angivna email-adressen är upptagen.",
            m_updateSuccessful:         "Din information har blivit uppdaterad.",
            m_updatePasswordSuccessful: "Ditt lösenord har uppdaterats.",
            m_failedToUpdate:           "Uppdateringen misslyckades.",
            passwordStrength:           ["För kort", "Svagt", "Medel", "Starkt", "Väldigt starkt"]
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
            m_noDescription:            "There is no description for this diagram.",
            m_wrongPassword:            "Wrong password.",
            m_emailTaken:               "The provided email is already in use.",
            m_updateSuccessful:         "Your information has been updated.",
            m_updatePasswordSuccessful: "Your password has been updated.",
            m_failedToUpdate:           "Failed to update.",
            passwordStrength:           ["Too short", "Weak", "Decent", "Strong", "Very strong"]
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

    render: function(){
        //Only render the current tab
        var content;
        switch(this.state.currentTab){
            case 'terms':
                content = <FavoriteTerms
                                removeFavoriteTerm={this.props.removeFavoriteTerm}
                                favoriteTerms={this.props.favoriteTerms}
                                url={this.props.url}
                                dict={this.dict}
                                language={this.props.language}
                                openTerm={this.props.openTerm}
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
                                removeid={this.props.removeid}
                                nameSort={this.sortByName}
                                dateSort={this.sortByDate}
                          />;
                break;
            case 'account':
                content = <AccountPage
                                url={this.props.url}
                                dict={this.dict}
                                language={this.props.language}
                                dbEdition={this.props.dbEdition}
                                user={this.props.user}
                                updateUser={this.props.updateUser}
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
module.exports = ProfilePage;
