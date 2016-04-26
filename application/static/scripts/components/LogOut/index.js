import cookie from 'react-cookie';

var LogOut = React.createClass({
    dict: {
        se: {
            logout:                 "Logga ut",
            logoutConfirmation:     "Är du säker på att du vill logga ut?",
            yes:                    "Ja",
            no:                     "Nej"
        },
        en: {
            logout:                 "Log out",
            logoutConfirmation:     "Are you sure you want to log out?",
            yes:                    "Yes",
            no:                     "No"
        }
    },

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
                }.bind(this),
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
                    <Modal.Title>{this.dict[this.props.language]["logout"]}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.dict[this.props.language]["logoutConfirmation"]}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.logOut}>{this.dict[this.props.language]["yes"]}</Button>
                    <Button bsStyle="primary" onClick={this.close}>{this.dict[this.props.language]["no"]}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});
module.exports = LogOut;
