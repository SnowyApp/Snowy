import cookie from 'react-cookie';

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
    logOut: function() {
        if (cookie.load('userId') != null) {
            $.ajax({
                type: "POST",
                url: this.props.url + "/logout",
                headers: {
                    "Authorization": cookie.load("userId")
                },
                success: function (data) {
                    this.props.onLogout();
                }.bind(this),
                error: function (textStatus, errorThrown) {
                    this.props.onLogout();
                    //console.log(textStatus, errorThrown);
                },
                contentType: "application/json",
                dataType: "json"
            });
        }else{
            this.props.onLogout();
        }
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
                    <Button onClick={this.logOut}>Yes</Button>
                    <Button bsStyle="primary" onClick={this.close}>No</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});
module.exports = LogOut;