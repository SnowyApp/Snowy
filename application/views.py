from application import app,db
from flask import request, jsonify, abort
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
    user = User.query.filter(and_(User.email == data['email'], User.token.any(token=token)))
    return user


def login_required(func):
    """
    Decorator to use with functions that requires login.
    """
    @wraps(func)
    def wrapper(*args,**kwargs):
        token = kwargs['token']
        if token is None:
            token = request.json['token']
        g.user= verify_auth_token(token)
        return func(*args,**kwargs)

    return wrapper


@app.route('/register', methods=['POST'])
def create_user():
    # The provided data must contain password and email
    data = request.get_json()
    if not 'email' in data or not 'password' in data:
        abort(400)

    user = User(data['email'], data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': "ok"})


@app.route('/login', methods=['POST'])
def login():
    pass


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    pass
