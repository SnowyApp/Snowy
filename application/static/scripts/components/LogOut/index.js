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
        this.props.updateLoggedIn(false);
        this.close();
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({showModal: nextProps.show});
    },
    render: function(){
        return(
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header className="bg-primary" closeButton>
                    <Modal.Title>Vill du logga ut?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button onClick={this.logOut}> Ja</Button>
                    <Button bsStyle="primary" onClick={this.close}> Nej</Button>
                </Modal.Body>
            </Modal>
        );
    }
});
module.exports = LogOut;