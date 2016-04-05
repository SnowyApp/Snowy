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

    render: function(){
        var content;
        switch(this.state.currentTab){
            case 'Termer':
                content = <TermPage />;
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
                {content}
            </div>
        );
    }
});

var TermPage = React.createClass({
    render: function(){
        return(
            <h1>Termer</h1>
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







