from datetime import datetime
from application import app, db
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
from werkzeug.security import generate_password_hash, check_password_hash

import psycopg2

DB_NAME = "snomedct"
DB_USER = "simon"


def connect_db():
    """
    Connects to the database.
    """
    return psycopg2.connect("dbname=" + DB_NAME + " user=" + DB_USER)


def get_db():
    """
    Returns the database connection. If no database connection 
    exists, a new one is created.
    """
    if not hasattr(g, 'postgres_db'):
        g.postgres_db = connect_db()
    return g.postgres_db


@app.teardown_appcontext
def close_db(error):
    """
    Closes the database again at the end of the request.
    """
    if hasattr(g, 'postgres_db'):
        g.postgres_db.close()


class User():
    """
    A user of the browser.
    """
    def __init__(self, email, password):
        self.email = email
        self.password = generate_password_hash(password, salt_length=12)

    def check_password(self, plain_pass):
        """ Checks if the password matches the stored hash """
        return check_password_hash(self.password, plain_pass)

    def generate_token(self,expiration=1024):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'email': self.email, 'hash': self.password})

    @staticmethod
    def create_user(email):
        cur = get_db().cursor()


class Token(db.Model):
    """
    Represents a user token.
    """

    def __init__(self, token, user_email):
        self.token = token
        self.user_email = user_email

