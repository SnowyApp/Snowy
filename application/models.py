from datetime import datetime
from application import app
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
from werkzeug.security import generate_password_hash, check_password_hash
from flask import g

import psycopg2

DB_NAME = "snomedct"
DB_USER = "simon"

INSERT_USER_STATEMENT = "INSERT INTO usr (email, password_hash) VALUES (%s, %s);"
SELECT_USER_QUERY = "SELECT email, password_hash, first_name, last_name, language FROM usr WHERE email=%s;"
UPDATE_USER_STATEMENT = "UPDATE usr SET first_name=%s, last_name=%s, language=%s WHERE email=%s ;"


INSERT_TOKEN_STATEMENT = "INSERT INTO token (token, user_email) VALUES (%s, %s);"
DELETE_TOKEN_STATEMENT = "DELETE FROM token WHERE token=%s;"
VALID_TOKEN_PROCEDURE = "is_valid_token"

SELECT_FAVORITE_TERM_QUERY = "SELECT * FROM favorite_term WHERE user_email=%s;"
DELETE_FAVORITE_TERM_STATEMENT = "DELETE FROM favorite_term WHERE user_email=%s and concept_id=%s"
INSERT_FAVORITE_TERM_STATEMENT = "INSERT INTO favorite_term (concept_id, user_email, term) VALUES (%s, %s, %s);"

SELECT_LATEST_ACTIVE_TERM_QUERY = "SELECT * FROM concept WHERE active=1 AND id=%s ORDER BY effective_time DESC LIMIT 1;"
SELECT_CHILDREN_QUERY = """SELECT B.source_id, A.term, B.type_id 
                                FROM relationship B JOIN description A 
                                ON B.source_id=a.concept_id 
                                WHERE B.destination_id=%s and b.active=1 and b.type_id=116680003;"""
SELECT_PARENTS_QUERY = """SELECT B.source_id, A.term, B.type_id
                                FROM relationship B JOIN description A 
                                ON B.destination_id=a.concept_id 
                                WHERE B.source_id=%s and b.active=1 and b.type_id=116680003;"""
SELECT_RELATIONS_QUERY = """SELECT B.destination_id, MIN(A.term), MIN(B.type_id) 
                                FROM relationship B JOIN description A 
                                ON B.destination_id=a.concept_id 
                                WHERE B.source_id=%s and b.active=1 
                                GROUP BY B.destination_id 
                                HAVING COUNT(B.type_id) > 0;"""
SELECT_RELATIONS_QUERY = """SELECT DISTINCT A.destination_id, B.term 
                                FROM relationship A JOIN description B ON A.destination_id=B.concept_id 
                                JOIN language_refset C ON B.id=C.referenced_component_id 
                                WHERE A.source_id=%s AND A.active=1 AND B.type_id=900000000000003001;"""

GET_CONCEPT_PROCEDURE = "get_concept"

INSERT_DIAGRAM_STATEMENT = "INSERT INTO diagram (data, name, user_email) VALUES (%s, %s, %s) RETURNING id"
UPDATE_DIAGRAM_STATEMENT = "UPDATE diagram SET data=%s, name=%s, date_modified=NOW() WHERE user_email=%s AND id=%s"
SELECT_DIAGRAM_QUERY = "SELECT * FROM diagram WHERE user_email=%s;"
DELETE_DIAGRAM_STATEMENT = "DELETE FROM diagram WHERE id=%s and user_email=%s"

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
    def __init__(self, email, password_hash, first_name = "", last_name = "", language = "en"):
        self.email = email
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name
        self.language = language

    def check_password(self, plain_pass):
        """ Checks if the password matches the stored hash """
        return check_password_hash(self.password_hash, plain_pass)

    def generate_token(self,expiration=1024):
        """
        Generates a token for the user.
        """
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'email': self.email, 'hash': self.password_hash})

    def add_favorite_term(self, cid, term):
        """
        Adds a favorite term for the user in the database.
        """
        cur = get_db().cursor()
        try:
            cur.execute(INSERT_FAVORITE_TERM_STATEMENT, (cid, self.email, term))
            get_db().commit()
            cur.close()
        except Exception as e:
            print(e)

    def delete_favorite_term(self, cid):
        """
        Deletes a favorite term from the database.
        """
        cur = get_db().cursor()
        try:
            cur.execute(DELETE_FAVORITE_TERM_STATEMENT, (self.email, cid))
            get_db().commit()
            cur.close()
        except Exception as e:
            print(e)

    def get_favorite_terms(self):
        """
        Retrievs all the favorite terms for the user in the database.
        """
        cur = get_db().cursor()
        try:
            cur.execute(SELECT_FAVORITE_TERM_QUERY, (self.email,))
            result = []
            for data in cur.fetchall():
                result += [{"id": data[0], "favorite_date": str(data[2]), "term": data[1]}]
            return result
        except Exception as e:
            print(e)
            return None

    def update_info(self, first_name, last_name, language):
        """
        Update the first name, last name and language setting for the user.
        Returns True if the operation succeeded, False otherwise.
        """
        cur = get_db().cursor()
        try:
            cur.execute(UPDATE_USER_STATEMENT, (first_name, last_name, language, self.email))
            get_db().commit()
            cur.close()
            return True
        except Exception as e:
            print(str(e))
            return False

    def store_diagram(self, data, name, did = None):
        """
        Stores a diagram for the user.
        """
        cur = get_db().cursor()
        try:
            new_id = None
            if did:
                cur.execute(UPDATE_DIAGRAM_STATEMENT, (data, name, self.email, did))
            else:
                cur.execute(INSERT_DIAGRAM_STATEMENT, (data, name, self.email))
                new_id = cur.fetchone()[0]
            get_db().commit()
            cur.close()
            return new_id
        except Exception as e:
            print(e)
            return None

    def get_diagrams(self):
        """
        Retrieve diagrams for the user.
        """
        cur = get_db().cursor()
        try:
            result = []
            cur.execute(SELECT_DIAGRAM_QUERY, (self.email,))
            for data in cur:
                result += [{"id": data[0], "data": data[1], 'created': str(data[2]), 'modified': str(data[3])}]
            cur.close()
            print(result)
            return result
        except Exception as e:
            print(e)
            return None

    def delete_diagram(self, cid):
        """
        Delete a diagram for the user.
        """
        cur = get_db().cursor()
        try:
            cur.execute(DELETE_DIAGRAM_STATEMENT, (cid, self.email))
            get_db().commit()
            cur.close()
        except Exception as e:
            print(e)

 
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
        return User(user_data[0], user_data[1], user_data[2], user_data[3], user_data[4])

    def to_json(self):
        """
        Returns a JSON representation of the user.
        """
        return {"email": self.email,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "language": self.language}


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
            cur.callproc(VALID_TOKEN_PROCEDURE, (self.token, self.user_email))
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


class Concept():
    """
    Represents a concept in the Snomed CT database
    """
    
    def __init__(self, cid, term, type_id = None):
        self.id = cid
        self.term = term
        self.type_id = type_id
        if type_id is not None:
            self.type_name = Concept.get_attribute(self.type_id)
        else:
            self.type_name = ""

    @staticmethod
    def fetch_relations(cid, query):
        """
        Fetch data on relations. 
        """
        cur = get_db().cursor()
        try:
            cur.execute(query, (cid,))
            result = []
            for data in cur.fetchall():
                result += [Concept(data[0], data[1], data[2])]
            return result
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def get_children(cid):
        """
        Returns the children of the concept. 
        """
        return Concept.fetch_relations(cid, SELECT_CHILDREN_QUERY)

    @staticmethod
    def get_parents(cid):
        """
        Returns the parents of the concept.
        """
        return Concept.fetch_relations(cid, SELECT_PARENTS_QUERY)

    @staticmethod
    def get_relations(cid):
        """
        Returns the relations for the given concept.
        """
        return Concept.fetch_relations(cid, SELECT_RELATIONS_QUERY)

    @staticmethod
    def get_concept(cid):
        """
        Returns the concept with the given concept id.
        """
        cur = get_db().cursor()
        try:
            cur.callproc(GET_CONCEPT_PROCEDURE, (cid,))
            data = cur.fetchone()
            
            # The user didn't send a valid concept id
            if data is None:
                return None

            return Concept(data[0], data[1])
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def get_attribute(type_id):
        if type_id == 363698007:
            return "FINDING SITE"
        elif type_id == 116676008:
            return "ASSOCIATED MORPHOLOGY"
        elif type_id == 116680003:
            return "IS A"
        else:
            return "UNDEFINED (PROBABLE ERROR SERVER SIDE)"


    def to_json(self):
        """
        Returns a JSON representation of the concept.
        """
        if self.type_id is None:
            return {"id": self.id,
                    "term": self.term}
        else:
            return {"id": self.id,
                    "term": self.term,
                    "type_id": self.type_id,
                    "type_name": self.type_name}

    def __str__(self):
        """
        Returns a string representation of the concept 
        """
        return "<Concept " + str(self.id) + ": " + self.term + ">"
