from application import db
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

class User(db.Model):
    """
    A user of the browser.
    """
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)

    tokens = relationship("Token", back_populates="user")

    def __init__(self, email, password):
        self.email = email
        self.password = generate_password_hash(password)

    def check_password(self, plain_pass):
        """ Checks if the password matches the stored hash """
        return self.check_password_hash(self.password, plain_pass)

    def generate_auth_token(self,experation=1024):
        s = Serializer(app.config['SECRET_KEY'], expires_in=experation)
        return s.dumps({'email': self.email, 'hash': self.password})


class Token(db.Model):
    """
    Represents a user token.
    """
    token = db.Column(db.String, unique=True)
    user_email = db.Column(db.String, ForeignKey('user.email'))

    children = relationship("Token", back_populates="user")
