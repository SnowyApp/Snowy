from datetime import datetime
from application import app, db
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
from werkzeug.security import generate_password_hash, check_password_hash
from flask import g

import psycopg2

DB_NAME = "snomedct"
DB_USER = "simon"

INSERT_USER_STATEMENT = "INSERT INTO usr (email, password_hash) VALUES (%s, %s);"
SELECT_USER_QUERY = "SELECT email, password_hash FROM usr WHERE email=%s;"

INSERT_TOKEN_STATEMENT = "INSERT INTO token (token, user_email) VALUES (%s, %s);"
SELECT_TOKEN_QUERY = "SELECT * FROM token WHERE token=%s AND user_email=%s;"
DELETE_TOKEN_STATEMENT = "DELETE FROM token WHERE token=%s;"

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
    def __init__(self, email, password_hash):
        self.email = email
        self.password_hash = password_hash

    def check_password(self, plain_pass):
        """ Checks if the password matches the stored hash """
        return check_password_hash(self.password_hash, plain_pass)

    def generate_token(self,expiration=1024):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'email': self.email, 'hash': self.password_hash})

    @staticmethod
    def create_user(email, password):
        """
        Creates a user in the database with an email and password.
        """
        cur = get_db().cursor()
        p_hash = generate_password_hash(password, salt_length=12)
        try:
            cur.execute(INSERT_USER_STATEMENT, (email, p_hash))
            get_db().commit()
            cur.close()
            return User(email, p_hash)
        except Exception as e:
            return None

    @staticmethod
    def user_registered(email):
        """
        Returns True if a user with the provided email is
        registered. False otherwise.
        """
        cur = get_db().cursor()
        cur.execute(SELECT_USER_QUERY, (email,))
        user_data = cur.fetchone()
        cur.close()
        return user_data is not None

    @staticmethod
    def get_user(email):
        """
        Retrieves the user with the provided email.
        """
        cur = get_db().cursor()
        cur.execute(SELECT_USER_QUERY, (email,))
        user_data = cur.fetchone()
        cur.close()
        return User(user_data[0], user_data[1])


class Token():
    """
    Represents a user token.
    """

    def __init__(self, token, user_email):
        self.token = token
        self.user_email = user_email

    def store_token(self):
        """
        Inserts the token into the database.
        """
        cur = get_db().cursor()
        try:
            cur.execute(INSERT_TOKEN_STATEMENT, (self.token, self.user_email))
            get_db().commit()
            cur.close()
        except Exception as e:
            pass

    def is_valid_token(self):
        """
        Checks if the token is valid.
        """
        cur = get_db().cursor()
        try:
            cur.execute(SELECT_TOKEN_QUERY, (self.token, self.user_email))
            token_data = cur.fetchone()
            cur.close()
            return token_data is not None
        except Exception as e:
            print(str(e))
            return None

    def retrieve_user(self):
        """
        Retrieves the user for the given token.
        """
        return User.get_user(self.user_email)

    def delete_from_db(self):
        """
        Deletes the token from the database.
        """
        cur = get_db().cursor()
        try:
            cur.execute(DELETE_TOKEN_STATEMENT, (self.token,))
            get_db().commit()
            cur.close()
        except Exception as e:
            print(str(e))
