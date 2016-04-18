var NavBarItem = require('./NavBarItem');

//Tab navigation for profile page
module.exports = React.createClass({
    render: function(){
        return(
            <div>
                <ul className="nav nav-tabs">
                    <NavBarItem dict={this.props.dict} name="terms" active={this.props.currentTab === 'terms'} onSelect={this.props.changeActiveTab}/>
                    <NavBarItem dict={this.props.dict} name="diagrams" active={this.props.currentTab === 'diagrams'} onSelect={this.props.changeActiveTab}/>
                    <NavBarItem dict={this.props.dict} name="account" active={this.props.currentTab === 'account'} onSelect={this.props.changeActiveTab}/>
                </ul>
            </div>
        );
    }
});
