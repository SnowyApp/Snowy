from application import app, db
from application.models import User,Token
from flask import request, jsonify, abort, g
from functools import wraps
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
from sqlalchemy import and_
from datetime import datetime

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
    user_query = User.query.filter(and_(User.email == data['email'], \
            User.tokens.any(token=token)))
    return user_query.first()


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
        if not g.user:
            abort(401)

        # Update that the token has been acessed
        token = Token.query.filter_by(token=token).first()
        token.accessed = datetime.utcnow()
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
    if 'email' not in data or 'password' not in data:
        return jsonify(message="Email or password not provided"), 400

    # Check so that the user doesn't exist.
    if User.user_registered(data['email']):
        return jsonify(message="User already exists"), 400

    # Create the new user and return OK
    User.create_user(data['email'], data['password'])
    return jsonify({'message': "ok"})


@app.route('/login', methods=['POST'])
def login():
    """
    Generates a token for the user, if the provided credentials are ok.
    """
    # The provided data must contain password and email
    data = request.get_json()
    if not 'email' in data or not 'password' in data:
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
    return "ok"


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Logs the user out by destroying the token.
    """
    token = request.headers.get('Authorization', None)
    stored_token = Token.query.filter_by(token=token).first()
    db.session.delete(stored_token)
    db.session.commit()
    return jsonify(message="Logged out")


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
