import json

from application import app, es
from application.models import User, Token, Concept
from flask import request, jsonify, abort, g
from functools import wraps
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))


def verify_auth_token(token):
    """
    Verifies that the token is valid for a user.
    """
    s = Serializer(app.config['SECRET_KEY'])
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
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization', None)
        if not token:
            abort(400)
        g.user = verify_auth_token(token)
        if not g.user:
            abort(401)

        return func(*args, **kwargs)

    return wrapper


@app.route('/register', methods=['POST'])
def create_user():
    """
    Creates a new user with the provided email and password.
    A user with the provided email cannot exist before.
    """
    # The provided data must contain password and email
    data = request.get_json()
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
        return jsonify(user.to_json()), 201


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
        if 'first_name' not in data or not isinstance(data['first_name'], str) or \
                'last_name' not in data or not isinstance(data['last_name'], str) or \
                'db_edition' not in data or not isinstance(data['db_edition'], str) or \
                'site_lang' not in data or not isinstance(data['site_lang'], str) or \
                'email' not in data or not isinstance(data['email'], str):
            return jsonify(message="Incomplete information"), 400

        res = g.user.update_info(data['first_name'], data['last_name'], data['db_edition'], data['email'],
                                 data['site_lang'])
        if res:
            token = g.user.generate_token()
            token = Token(token.decode('utf-8'), g.user.email)
            token.store_token()
            return jsonify(status="ok", token=token.token), 200
        else:
            abort(500)


@app.route('/password', methods=['PUT'])
@login_required
def update_password():
    """
    Update the users password
    """
    data = request.get_json()
    if 'new_password' not in data or not isinstance(data['new_password'], str) or \
            'curr_password' not in data or not isinstance(data['curr_password'], str) or \
            'invalidate_tokens' not in data or not isinstance(data['invalidate_tokens'], bool):
        return jsonify(message="Password or invalidate_tokens not provided"), 400

    if not g.user.check_password(data['curr_password']):
        return jsonify(message="Wrong password"), 400

    res = g.user.update_password(data['new_password'])
    if res:
        if data['invalidate_tokens']:
            g.user.invalidate_tokens(request.headers.get('Authorization', None))

        return jsonify(status="ok")
    else:
        abort(500)


@app.route('/favorite_term', methods=['POST', 'GET', 'DELETE'])
@login_required
def favorite_term():
    """
    Saves a term as the users favorite.
    """
    if request.method == "POST":
        data = request.get_json()

        # Check so that the data is valid
        if 'id' not in data or not isinstance(data['id'], int) or \
                'date_added' not in data or not isinstance(data['date_added'], str) or \
                'term' not in data or not isinstance(data['term'], str):
            return jsonify(message="The concepts data is not providid accurately"), 400

        res = g.user.add_favorite_term(data['id'], data['term'], data['date_added'])
        if res:
            return jsonify(status="ok")
        else:
            abort(500)
    elif request.method == "DELETE":
        data = request.get_json()
        if 'id' not in data or not isinstance(data['id'], int):
            return jsonify(message="'id' is missing")

        res = g.user.delete_favorite_term(data['id'])
        if res:
            return jsonify(status="ok")
        else:
            abort(500)
    else:
        res = g.user.get_favorite_terms()
        if res is not None:
            return json.dumps(res)
        else:
            abort(500)


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
    children = Concept.get_children(cid)
    if children is None:
        abort(500)

    return json.dumps([concept.to_json() for concept in children])


@app.route('/get_relations/<int:cid>', methods=['GET'])
def get_relations(cid):
    """
    Returns the relations for the given id.
    """
    relations = Concept.get_relations(cid)
    if relations is None:
        abort(500)

    return json.dumps([concept.to_json() for concept in relations])


@app.route('/get_parents/<int:cid>', methods=['GET'])
def get_parents(cid):
    """
    Returns the parents for the specified id.
    """
    parents = Concept.get_parents(cid)
    if parents is None:
        abort(500)

    return json.dumps([concept.to_json() for concept in parents])


@app.route('/get_grandparents/<int:cid>', methods=['GET'])
def get_grandparents(cid):
    """
    Returns the grandparents of the relation.
    """
    grandparents = Concept.get_grandparents(cid)
    if grandparents is None:
        abort(500)

    return json.dumps([concept.to_json() for concept in grandparents])


@app.route('/get_names/<int:concept_id>', methods=['GET'])
def get_concept_names(concept_id):
    """
    Retrieves all the names for the given concept.
    """
    res = Concept.get_concept_names(concept_id)
    if res is None:
        abort(500)

    return json.dumps(res)


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


@app.route('/diagram', methods=['POST', 'GET', 'PUT'])
@login_required
def store_diagram():
    """
    Stores a diagram for the user.
    """
    if request.method == "POST":
        data = request.get_json()
        if 'data' not in data or not isinstance(data['data'], str) or \
                'created' not in data or not isinstance(data['created'], str):
            return jsonify(message="Data or name not provided"), 400

        if 'name' not in data or not isinstance(data['name'], str) or len(data['name']) == 0:
            name = "Nameless diagram"
        else:
            name = data['name']

        if 'description' not in data or not isinstance(data['description'], str):
            description = ""
        else:
            description = data['description']

        cid = g.user.store_diagram(data['data'], name, data['created'], description)
        if not cid:
            abort(500)

        return jsonify(id=cid)
    elif request.method == "PUT":
        data = request.get_json()
        if 'data' not in data or not isinstance(data['data'], str) or \
                'name' not in data or not isinstance(data['name'], str) or \
                'modified' not in data or not isinstance(data['modified'], str) or \
                'id' not in data or not isinstance(data['id'], int) or \
                'description' not in data or not isinstance(data['description'], str):
            return jsonify(message="data, name, description or id not provided"), 400

        res = g.user.store_diagram(data['data'], data['name'], data['modified'], data['description'], data['id'])
        if res is None:
            abort(500)

        return jsonify(status="ok")
    else:
        data = g.user.get_diagrams()
        if data is None:
            abort(500)

        return json.dumps(data)


@app.route('/diagram/<int:diagram_id>', methods=["GET", "DELETE"])
@login_required
def diagram_id(diagram_id):
    """
    Pass
    """
    if request.method == "GET":
        res = g.user.get_diagram(diagram_id)
        if res is None:
            abort(500)
        return jsonify(res)
    else:
        res = g.user.delete_diagram(diagram_id)
        if not res:
            abort(500)

        return jsonify(status="ok")


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
