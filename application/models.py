import psycopg2

from application import app
from flask import g
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
from werkzeug.security import generate_password_hash, check_password_hash

DB_SNOMED_NAME = app.config["DB_SNOMED_NAME"]
DB_USERS_NAME = app.config["DB_USERS_NAME"]
DB_USER = app.config["DB_USER"]

# User management queries
INSERT_USER_STATEMENT = "INSERT INTO usr (email, password_hash) VALUES (%s, %s);"
SELECT_USER_QUERY = "SELECT email, password_hash, first_name, last_name, db_edition, site_lang FROM usr WHERE email=%s;"
UPDATE_USER_STATEMENT = "UPDATE usr SET first_name=%s, last_name=%s, db_edition=%s, email=%s," \
                        " site_lang=%s WHERE email=%s ;"
UPDATE_PASSWORD_STATEMENT = "UPDATE usr SET password_hash=%s WHERE email=%s"

# Token queries
INSERT_TOKEN_STATEMENT = "INSERT INTO token (token, user_email) VALUES (%s, %s);"
DELETE_TOKEN_STATEMENT = "DELETE FROM token WHERE token=%s;"
VALID_TOKEN_PROCEDURE = "is_valid_token"
INVALIDATE_TOKENS_STATEMENT = "DELETE FROM token WHERE token!=%s"

# Favorite term queries
SELECT_FAVORITE_TERM_QUERY = "SELECT * FROM favorite_term WHERE user_email=%s;"
DELETE_FAVORITE_TERM_STATEMENT = "DELETE FROM favorite_term WHERE user_email=%s and concept_id=%s"
INSERT_FAVORITE_TERM_STATEMENT = "INSERT INTO favorite_term (concept_id, user_email, term, date_added) " \
                                 "VALUES (%s, %s, %s, %s);"

# Procedure used to get the concept
SELECT_CONCEPT_QUERY = "select id, preferred_full, preferred_synonym, definition_status_id from concept where id=%s"
SELECT_CONCEPT_NAME_QUERY = "select distinct concept_id, term, acceptability_id, type_id from description where concept_id=%s"
SELECT_CONCEPT_TERM_QUERY = "SELECT preferred_full FROM concept WHERE id=%s;"

# Diagram queries
INSERT_DIAGRAM_STATEMENT = "INSERT INTO diagram (data, name, date_created, date_modified, description, user_email) " \
                           "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id"
UPDATE_DIAGRAM_STATEMENT = "UPDATE diagram SET data=%s, name=%s, date_modified=%s, description=%s WHERE user_email=%s AND id=%s"
SELECT_DIAGRAM_QUERY = "SELECT * FROM diagram WHERE user_email=%s;"
SELECT_DIAGRAM_BY_ID_QUERY = "SELECT * FROM diagram WHERE user_email=%s and id=%s;"
DELETE_DIAGRAM_STATEMENT = "DELETE FROM diagram WHERE id=%s and user_email=%s"


# Relations quries
SELECT_CHILDREN_QUERY = """select b.source_id, a.preferred_full, a.preferred_synonym, b.type_id, a.definition_status_id from concept a join relationship b on a.id=b.source_id where destination_id=%s and b.type_id=116680003"""
SELECT_PARENTS_QUERY = """select b.source_id, a.preferred_full, a.preferred_synonym, b.type_id, a.definition_status_id from concept a join relationship b on a.id=b.destination_id where source_id=%s and b.type_id=116680003"""
SELECT_RELATIONS_QUERY = """select b.source_id, a.preferred_full, a.preferred_synonym, b.type_id, a.definition_status_id, b.group_id from concept a join relationship b on a.id=b.destination_id where source_id=%s"""

def connect_db(db_name):
    """
    Connects to the database.
    """
    return psycopg2.connect("dbname=" + db_name + " user=" + DB_USER)


def get_snomed_db():
    """
    Returns the database connection to the selected snomed ct database. If no database connection 
    exists, a new one is created.
    """
    if not hasattr(g, 'snomed_db'):
        g.snomed_db = connect_db(DB_SNOMED_NAME)
    return g.snomed_db


def get_users_db():
    """
    Returns the database connection to the users database. If no database connection 
    exists, a new one is created.
    """
    if not hasattr(g, 'users_db'):
        g.users_db = connect_db(DB_USERS_NAME)
    return g.users_db

@app.teardown_appcontext
def close_db(error):
    """
    Closes the database again at the end of the request.
    """
    if hasattr(g, 'snomed_db'):
        g.snomed_db.close()
    if hasattr(g, 'users_db'):
        g.users_db.close()


class User:
    """
    A user of the browser.
    """

    def __init__(self, email, password_hash, first_name="", last_name="", db_edition="en", site_lang="en"):
        self.email = email
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name
        self.db_edition = db_edition
        self.site_lang = site_lang

    def check_password(self, plain_pass):
        """ Checks if the password matches the stored hash """
        return check_password_hash(self.password_hash, plain_pass)

    def generate_token(self, expiration=5184000):
        """
        Generates a token for the user.
        """
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'email': self.email, 'hash': self.password_hash})

    def add_favorite_term(self, cid, term, date_added):
        """
        Adds a favorite term for the user in the database.
        """
        cur = get_users_db().cursor()
        try:
            cur.execute(INSERT_FAVORITE_TERM_STATEMENT, (cid, self.email, term, date_added))
            get_users_db().commit()
            cur.close()
            return True
        except Exception as e:
            print(e)
            return False

    def delete_favorite_term(self, cid):
        """
        Deletes a favorite term from the database.
        """
        cur = get_users_db().cursor()
        try:
            cur.execute(DELETE_FAVORITE_TERM_STATEMENT, (self.email, cid))
            get_users_db().commit()
            cur.close()
            return True
        except Exception as e:
            print(e)
            return False

    def get_favorite_terms(self):
        """
        Retrievs all the favorite terms for the user in the database.
        """
        cur = get_users_db().cursor()
        try:
            cur.execute(SELECT_FAVORITE_TERM_QUERY, (self.email,))
            result = []
            for data in cur.fetchall():
                result += [{"id": data[0], "date_added": data[2], "term": data[3]}]
            return result
        except Exception as e:
            print(e)
            return None

    def update_info(self, first_name, last_name, db_edition, email, site_lang):
        """
        Update the first name, last name and language setting for the user.
        Returns True if the operation succeeded, False otherwise.
        """
        cur = get_users_db().cursor()
        try:
            cur.execute(UPDATE_USER_STATEMENT, (first_name, last_name, db_edition, email, site_lang,self.email))
            get_users_db().commit()
            self.email = email
            self.first_name = first_name
            self.last_name = last_name
            self.db_edition = db_edition
            self.site_lang = db_edition
            cur.close()
            return True
        except Exception as e:
            print(str(e))
            return False

    def update_password(self, new_password):
        """
        Updates the users password.
        """
        cur = get_users_db().cursor()
        p_hash = generate_password_hash(new_password, salt_length=12)
        try:
            cur.execute(UPDATE_PASSWORD_STATEMENT, (p_hash,self.email))
            get_users_db().commit()
            cur.close()
            return True
        except Exception as e:
            print(e)
            return False

    def invalidate_tokens(self, token):
        """
        Invalidate all tokens but token.
        """
        cur = get_users_db().cursor()
        try:
            cur.execute(INVALIDATE_TOKENS_STATEMENT, (token, ))
            get_users_db().commit()
            cur.close()
        except Exception as e:
            print(e)

    def store_diagram(self, data, name, date, description, did=None):
        """
        Stores a diagram for the user.
        """
        cur = get_users_db().cursor()
        try:
            new_id = 0
            if did:
                cur.execute(UPDATE_DIAGRAM_STATEMENT, (data, name, date, description, self.email, did))
            else:
                cur.execute(INSERT_DIAGRAM_STATEMENT, (data, name, date, date, description, self.email))
                new_id = cur.fetchone()[0]
            get_users_db().commit()
            cur.close()
            return new_id
        except Exception as e:
            print(e)
            return None

    def get_diagrams(self):
        """
        Retrieve diagrams for the user.
        """
        cur = get_users_db().cursor()
        try:
            result = []
            cur.execute(SELECT_DIAGRAM_QUERY, (self.email,))
            for data in cur:
                result += [{"id": data[0], 'name': data[2], 'description': data[3], 'created': data[4],
                            'modified': data[5]}]
            cur.close()
            return result
        except Exception as e:
            print(e)
            return None

    def get_diagram(self, diagram_id):
        """
        Returns a diagram given the diagram id.
        """
        cur = get_users_db().cursor()
        try:
            result = None
            cur.execute(SELECT_DIAGRAM_BY_ID_QUERY, (self.email, diagram_id))
            data = cur.fetchone()
            result = {"id": data[0], "data": data[1], "name": data[2], "created": data[3], "modified": data[4]}
            cur.close()
            return result
        except Exception as e:
            print(e)
            return None

    def delete_diagram(self, cid):
        """
        Delete a diagram for the user.
        """
        cur = get_users_db().cursor()
        try:
            cur.execute(DELETE_DIAGRAM_STATEMENT, (cid, self.email))
            get_users_db().commit()
            cur.close()
            return True
        except Exception as e:
            print(e)
            return False

    @staticmethod
    def create_user(email, password):
        """
        Creates a user in the database with an email and password.
        """
        cur = get_users_db().cursor()
        p_hash = generate_password_hash(password, salt_length=12)
        try:
            cur.execute(INSERT_USER_STATEMENT, (email, p_hash))
            get_users_db().commit()
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
        cur = get_users_db().cursor()
        cur.execute(SELECT_USER_QUERY, (email,))
        user_data = cur.fetchone()
        cur.close()
        return user_data is not None

    @staticmethod
    def get_user(email):
        """
        Retrieves the user with the provided email.
        """
        cur = get_users_db().cursor()
        cur.execute(SELECT_USER_QUERY, (email,))
        user_data = cur.fetchone()
        cur.close()
        return User(user_data[0], user_data[1], user_data[2], user_data[3], user_data[4], user_data[5])

    def to_json(self):
        """
        Returns a JSON representation of the user.
        """
        return {"email": self.email,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "db_edition": self.db_edition,
                "site_lang": self.site_lang}


class Token:
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
        cur = get_users_db().cursor()
        try:
            cur.execute(INSERT_TOKEN_STATEMENT, (self.token, self.user_email))
            get_users_db().commit()
            cur.close()
        except Exception as e:
            pass

    def is_valid_token(self):
        """
        Checks if the token is valid.
        """
        cur = get_users_db().cursor()
        try:
            cur.callproc(VALID_TOKEN_PROCEDURE, (self.token, self.user_email))
            token_data = cur.fetchone()
            cur.close()
            return token_data[0]
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
        cur = get_users_db().cursor()
        try:
            cur.execute(DELETE_TOKEN_STATEMENT, (self.token,))
            get_users_db().commit()
            cur.close()
        except Exception as e:
            print(str(e))


class Concept:
    """
    Represents a concept in the Snomed CT database
    """

    def __init__(self, cid, syn_term="", full_term="", type_id=0):
        self.id = cid
        self.syn_term = syn_term
        self.full_term = full_term
        self.type_id = type_id
        self.definition_status_id = 0
        self.active = 1
        self.parents = None
        self.group_id = None
        if type_id:
            self.type_name = Concept.get_attribute(self.type_id)
        else:
            self.type_name = ""

    def set_type_id(self, type_id):
        """
        Set the ID of the concept.
        """
        self.type_id = type_id
        self.type_name = Concept.get_attribute(self.type_id)

    @staticmethod
    def concepts_from_cursor(cur, group=False):
        """
        Returns the different concepts that the cursor points to
        """
        result = []
        concept = None
        for data in cur:
            concept = Concept(data[0])
            concept.set_type_id(data[3])
            concept.definition_status_id = data[4]
            concept.full_term = data[1]
            concept.syn_term = data[2]

            result += [concept]
            if group:
                concept.group_id = data[5]

        return result

    @staticmethod
    def get_grandparents(cid):
        """
        Retrieves the grandparents for the provided context.
        """
        cur = get_snomed_db().cursor()
        try:
            cur.execute(SELECT_PARENTS_QUERY, (cid,))
            result = Concept.concepts_from_cursor(cur)
            for concept in result:
                concept.parents = Concept.get_grandparents(concept.id)
            return result
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def fetch_relations(cid, query, group=False):
        """
        Fetch data on relations. 
        """
        cur = get_snomed_db().cursor()
        try:
            cur.execute(query, (cid,))
            result = Concept.concepts_from_cursor(cur, group)
            cur.close()
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
        return Concept.fetch_relations(cid, SELECT_RELATIONS_QUERY, True)

    @staticmethod
    def get_concept(cid):
        """
        Returns the concept with the given concept id.
        """
        cur = get_snomed_db().cursor()
        try:
            cur.execute(SELECT_CONCEPT_QUERY, (cid,))
            data = cur.fetchone()
            if not data:
                return None
            else:
                concept = Concept(data[0], data[2], data[1])
                concept.definition_status_id = data[3]
                concept.active = 1
                return concept

        except Exception as e:
            print(e)
            return None

    @staticmethod
    def get_concept_names(concept_id):
        """
        Returns all the names for the provided term.
        """
        cur = get_snomed_db().cursor()
        try:
            cur.execute(SELECT_CONCEPT_NAME_QUERY, (concept_id,))
            result = []
            for desc in cur:
                result += [{
                    "name": desc[1],
                    "type": "Synonym" if desc[3] == 900000000000013009 else "Full",
                    "acceptability": "Preferred" if desc[2] == 900000000000548007 else "Acceptable"
                }]
            return result
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def get_attribute(type_id):
        cur = get_snomed_db().cursor()
        try:
            cur.execute(SELECT_CONCEPT_TERM_QUERY, (type_id,))
            name = cur.fetchone()[0]
            cur.close()
            return name
        except Exception as e:
            print(e)
            return "UNDEFINED (PROBABLE ERROR SERVER SIDE)"

    def get_definition_status(self):
        """
        Returns the definition status of the concept.
        """
        return "Primitive" if self.definition_status_id == 900000000000074008 else "Fully-defined"

    def to_json(self):
        """
        Returns a JSON representation of the concept.
        """
        res = {"id": self.id,
               "synonym": self.syn_term,
               "full": self.full_term,
               "definition_status": self.get_definition_status(),
               "active": self.active}
        if self.type_name:
            res["type_id"] = self.type_id
            res["type_name"] = self.type_name
            res["char_type"] = "inferred"
        if self.parents:
            res["parents"] = [parent.to_json() for parent in self.parents]
        if self.group_id is not None:
            res["group_id"] = self.group_id

        return res

    def __str__(self):
        """
        Returns a string representation of the concept 
        """
        return "<Concept " + str(self.id) + ": " + self.term + ">"
