from application import app, es
from application.models import User,Token,Concept
from datetime import datetime
from flask import request, jsonify, abort, g
from functools import wraps
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

import json

app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))


def verify_auth_token(token):
    """
    Verifies that the token is valid for a user.
    """
    s= Serializer(app.config['SECRET_KEY'])
    data = None
    try:
        data = s.loads(token)
    except SignatureExpired:
        return None
    except BadSignature:
        return None
    token = Token(token, data['email'])
    if token.is_valid_token():
        return token.retrieve_user()
    else:
        return None


def login_required(func):
    """
    Decorator to use with functions that requires login.
    """
    @wraps(func)
    def wrapper(*args,**kwargs):
        token = request.headers.get('Authorization', None)
        if not token:
            abort(400)
        g.user = verify_auth_token(token)
        if not g.user:
            abort(401)

        return func(*args,**kwargs)

    return wrapper


@app.route('/register', methods=['POST'])
def create_user():
    """
    Creates a new user with the provided email and password.
    A user with the provided email cannot exist before.
    """
    # The provided data must contain password and email
    data = request.get_json()
    print(data)
    if 'email' not in data or not isinstance(data['email'], str) \
            or 'password' not in data or not isinstance(data['password'], str):
        return jsonify(message="Email or password not provided"), 400

    # Check so that the user doesn't exist.
    if User.user_registered(data['email']):
        return jsonify(message="User already exists"), 400

    # Create the new user and return OK
    user = User.create_user(data['email'], data['password'])
    if user is None:
        abort(500)
    else:
        return jsonify({'status': "ok", "data": user.to_json()}), 201


@app.route('/login', methods=['POST'])
def login():
    """
    Generates a token for the user, if the provided credentials are ok.
    """
    # The provided data must contain password and email
    data = request.get_json()
    if 'email' not in data or not isinstance(data['email'], str) \
            or 'password' not in data or not isinstance(data['password'], str):
        return jsonify(message="Email or password not provided"), 400

    user = User.get_user(data['email'])
    if not user:
        return jsonify(message="Wrong user or password"), 400

    if not user.check_password(data['password']):
        return jsonify(message="Wrong user or password"), 400

    # Generate a new token and store it in the database
    token = user.generate_token()
    token = Token(token.decode('utf-8'), user.email)
    token.store_token()
    return jsonify(token=token.token)


@app.route('/verify', methods=['GET'])
@login_required
def verify():
    """
    Verifies that a user is logged in.
    """
    return jsonify(status="ok")


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Logs the user out by destroying the token.
    """
    token = request.headers.get('Authorization', None)
    Token(token, "").delete_from_db()
    return jsonify(status="ok")


@app.route('/user_info', methods=['PUT', 'GET'])
@login_required
def user_info():
    """
    Updates information for the user.
    """
    if request.method == "GET":
        return jsonify(g.user.to_json())
    elif request.method == "PUT":
        data = request.get_json()
        if not 'first_name' in data or not isinstance(data['first_name'], str) or \
            not 'last_name' in data or not isinstance(data['last_name'], str) or \
            not 'language' in data or not isinstance(data['language'], str) or \
            not 'email' in data or not isinstance(data['email'], str):
            return jsonify(message="Incomplete information")
        
        g.user.update_info(data['first_name'], data['last_name'], data['language'], data['email'])
        return jsonify(status="ok")


@app.route('/password', methods=['PUT'])
@login_required
def update_password():
    """
    Update the users password
    """
    data = request.get_json()
    print(data)
    if not 'password' in data or not isinstance(data['password'], str) or \
        not 'invalidate_tokens' in data or not isinstance(data['invalidate_tokens'], bool):
        return jsonify(message="Password or invalidate_tokens not provided")

    g.user.update_password(data['password'])
    if data['invalidate_tokens']:
        g.user.invalidate_tokens(request.headers.get('Authorization', None))

    return jsonify(status="ok")

@app.route('/favorite_term', methods=['POST', 'GET', 'DELETE'])
@login_required
def favorite_term():
    """
    Saves a term as the users favorite.
    """
    if request.method == "POST":
        data = request.get_json()

        # Check so that the data is valid
        if not 'id' in data or not isinstance(data['id'], int) or \
                not 'term' in data or not isinstance(data['term'], str):
            return jsonify(message="The concepts data is not providid accurately"), 400
        
        g.user.add_favorite_term(data['id'], data['term'])
        return jsonify(status="ok")
    elif request.method == "DELETE":
        data = request.get_json()
        if not 'id' in data or not isinstance(data['id'], int): 
            return jsonify(message="'id' is missing")

        g.user.delete_favorite_term(data['id'])
        return jsonify(status="ok")
    else:
        return json.dumps(g.user.get_favorite_terms())


@app.route('/concept/<int:cid>', methods=['POST', 'GET'])
def get_concept(cid):
    """
    Returns the concept for the specified id
    """
    concept = Concept.get_concept(cid)
    if not concept:
        return jsonify(message="Invalid concept id"), 400

    return jsonify(concept.to_json())


@app.route('/get_children/<int:cid>', methods=['GET'])
def get_children(cid):
    """
    Returns the children for the specified id.
    """
    return json.dumps([concept.to_json() for concept in Concept.get_children(cid)])


@app.route('/get_relations/<int:cid>', methods=['GET'])
def get_relations(cid):
    """
    Returns the relations for the given id.
    """
    return json.dumps([concept.to_json() for concept in Concept.get_relations(cid)])


@app.route('/get_parents/<int:cid>', methods=['GET'])
def get_parents(cid):
    """
    Returns the parents for the specified id.
    """
    return json.dumps([concept.to_json() for concept in Concept.get_parents(cid)])



@app.route('/search/<search_term>', methods=['GET'])
def search(search_term):
    """
    Searches the database for the given term.
    """
    query = {
            "query": {
                "multi_match": {
                    "fields": ["id", "term"],
                    "query": search_term,
                    "type": "cross_fields",
                    "use_dis_max": False
                }
            },
            "size": 10
        }
    return jsonify(es.search(index="desc", body=query))


@app.route('/diagram', methods=['POST', 'GET', 'PUT', 'DELETE'])
@login_required
def store_diagram():
    """
    Stores a diagram for the user.
    """
    if request.method == "POST":
        data = request.get_json()
        if not 'data' in data or not isinstance(data['data'], str) or \
            not 'name' in data or not isinstance(data['name'], str):
            return jsonify(message="Data or name not provided"), 400

        cid = g.user.store_diagram(data['data'], data['name'])
        return jsonify(id=cid)
    elif request.method == "PUT":
        data = request.get_json()
        if not 'data' in data or not isinstance(data['data'], str) or \
            not 'name' in data or not isinstance(data['name'], str) or \
            not 'id' in data or not isinstance(data['id'], int):
            return jsonify(message="data, name or id not provided"), 400

        g.user.store_diagram(data['data'], data['name'], data['id'])
        return jsonify(status="ok")
    elif request.method == "DELETE":
        data = request.get_json()
        if not 'id' in data or not isinstance(data['id'], int):
            return jsonify(message = "'id' is not provided"), 400

        g.user.delete_diagram(data['id'])
        return jsonify(status="ok")
        
    else:
        return json.dumps(g.user.get_diagrams())


@app.errorhandler(400)
def error400(err):
    """
    Returns a JSON formated 400 error.
    """
    return jsonify(message=str(err)), 400


@app.errorhandler(401)
def error401(err):
    """
    Returns a JSON formated 401 error.
    """
    return jsonify(message=str(err)), 401


@app.errorhandler(404)
def error404(err):
    """
    Returns a JSON formated 404 error.
    """
    return jsonify(message=str(err)), 404


@app.errorhandler(500)
def error500(err):
    """
    Returns a JSON formated 500 error.
    """
    return jsonify(message=str(err)), 500
