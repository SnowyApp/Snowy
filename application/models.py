from application import app, db
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    """
    A user of the browser.
    """
    __tablename__ = "user"
    email = db.Column(db.String, primary_key=True)
    password = db.Column(db.String)

    tokens = db.relationship("Token", back_populates="user")

    def __init__(self, email, password):
        self.email = email
        # TODO: Update to use Flask-Scrypt hash + salt
        self.password = generate_password_hash(password)

    def check_password(self, plain_pass):
        """ Checks if the password matches the stored hash """
        return check_password_hash(self.password, plain_pass)

    def generate_token(self,expiration=1024):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'email': self.email, 'hash': self.password})


class Token(db.Model):
    """
    Represents a user token.
    """
    __tablename__ = "token"
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String)
    user_email = db.Column(db.String, db.ForeignKey('user.email'))

    user = db.relationship("User", back_populates="tokens")

    def __init__(self, token):
        self.token = token
