var LogOut = React.createClass({
    propTypes:{
        hideLogout: React.PropTypes.func,
        show: React.PropTypes.bool
    },
    getInitialState: function(){
        return({
            email: "",
            validEmail: false,
            password: "",
            errorMessage: "",
            showModal: false
        });
    },
    close: function() {
        this.setState({ showModal: false });
        this.props.hideLogout();
    },

    open: function() {
        this.setState({ showModal: true });
    },
    logOut: function(){
        this.props.onLogout();
        this.close();
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({showModal: nextProps.show});
    },
    render: function(){
        return(
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header className="bg-primary" closeButton>
                    <Modal.Title>Log out</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to log out?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.logOut}> Ja</Button>
                    <Button bsStyle="primary" onClick={this.close}> Nej</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});
module.exports = LogOut;