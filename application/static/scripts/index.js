
var Diagram = require("./components/Diagram/index");
var Search = require("./components/Search/index");
var Navigation = require("./components/Navigation/index");

//Use this if you have the api locally
var localUrl = 'http://127.0.0.1:3000/snomed/en-edition/v20150731/descriptions?query=&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true';

//Use this if Carl Brage's server is up
var brageUrl = 'http://79.136.62.204:3000/snomed/en-edition/v20150731/descriptions?query=&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true';

//Use this if none of the above work, can only search on asthma
var mockApi ='http://private-anon-d3abcd99e-snomedctsnapshotapi.apiary-mock.com/api/snomed/en-edition/v20160131/descriptions?query=&searchMode=partialMatching&lang=english&statusFilter=english&skipTo=0&returnLimit=5&normalize=true';


var Container = React.createClass({
    getInitialState: function(){
        return{
            selectedTerm: null
        }
    },
    //Gets called when the user selects an element in the search result
    updateSelectedTerm: function(newSelectedTerm){
        this.setState({
            selectedTerm: newSelectedTerm
        });
    },
    render: function() {
        return (
            <div className="wrapper">
                <Navigation />
                <section>
                    <Bar update={this.updateSelectedTerm}/>
                    <Diagram />
                </section>
            </div>
        );
    }
});

var Bar = React.createClass({
    render: function() {
        return (
            <div className="bar">
                <Button>Export</Button>
                <Search url={mockApi} update={this.props.update}/>
                <Button>Login</Button>
            </div>
        );
    }
});

ReactDOM.render(
    <Container />,
    document.getElementById('content')
);
