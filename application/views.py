from application import app, db
from flask import request, jsonify, abort, g
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature,     SignatureExpired)    
from sqlalchemy import and_
from functools import wraps
from application.models import User,Token

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
    user = User.query.filter(and_(User.email == data['email'], User.tokens.any(token=token)))
    return user


def login_required(func):
    """
    Decorator to use with functions that requires login.
    """
    @wraps(func)
    def wrapper(*args,**kwargs):
        token = request.headers.get('Authorization', None)
        if not token:
            abort(400)
        g.user= verify_auth_token(token)
        return func(*args,**kwargs)

    return wrapper


@app.route('/register', methods=['POST'])
def create_user():
    # The provided data must contain password and email
    data = request.get_json()
    if not 'email' in data or not 'password' in data:
        return jsonify(message="Email or password not provided"), 400

    # Check so that the user doesn't exist.
    user = User.query.get(data['email'])
    if user:
        return jsonify(message="User already exists"), 400

    # Create the new user and return OK
    user = User(data['email'], data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': "ok"})


@app.route('/login', methods=['POST'])
def login():
    # The provided data must contain password and email
    data = request.get_json()
    if not 'email' in data or not 'password' in data:
        return jsonify(message="Email or password not provided"), 400

    user = User.query.get(data['email'])
    if not user:
        return jsonify(message="Wrong user or password"), 400

    if not user.check_password(data['password']):
        return jsonify(message="Wrong user or password"), 400

    # Generate a new token and store it in the database
    token = token=user.generate_token()
    stored_token = Token(token=token.decode('utf-8'))
    db.session.add(stored_token)
    user.tokens.append(stored_token)
    db.session.commit()

    return jsonify(token=stored_token.token)


@app.route('/verify', methods=['GET'])
@login_required
def verify():
    return "ok"


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    pass


@app.errorhandler(400)
def error400(err):
    """
    Returns a JSON formated 400 error.
    """
    return jsonify(message=str(err)), 400


@app.errorhandler(404)
def error400(err):
    """
    Returns a JSON formated 404 error.
    """
    return jsonify(message=str(err)), 404


@app.errorhandler(500)
def error400(err):
    """
    Returns a JSON formated 500 error.
    """
    return jsonify(message=str(err)), 500
