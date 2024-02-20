"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
import string
import jwt
import secrets

api = Blueprint('api', __name__)
JWT_SECRET_KEY = secrets.token_hex(32)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/token', methods =['POST'])
def create_token():
    email=request.json.get('email', None)
    access_token=create_access_token(identity=email)
    return jsonify(access_token=access_token)

@api.route('/user', methods=['GET'])
def get_all_users():
    users=User.query.all()
    all_users=list(map(lambda x: x.serialize(), users))
    return jsonify (all_users), 200

@api.route('/user/<int:id>', methods=['GET'])
def get_user(id): 
    user=User.query.get(id)
    if user is None:
        raise APIException('user not found', status_code=404)
    return jsonify(user.serialize()),200

# @api.route('/singup', methods=['POST'])
# def create_user():
#     body = request.json()
#     user=User()
#     if 'email' not in body :
#         raise APIException ('you need provide your email', status_code=400)
#     if 'password' not in body :
#         raise APIException ('you need to provide your password', status_code=400)
#     user.email=body['email']
#     user.password=body['password']
#     user.is_active=True
#     db.session.add(user)
#     db.session.commit()
#     return jsonify(user.serialize()), 200

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    email = body['email']
    password = body['password']
    if email is None: 
        return jsonify(message="No email was provided"), 400
    if password is None:
        return jsonify(message="No password was provided"), 400
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify(message="User already exists"), 409

    hashed_password = generate_password_hash(password)
    new_user = User(
        email=email,
        password=hashed_password,
        is_active=True
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(message="Successfully created user."), 200

@api.route('/login', methods=['POST'])
def login():
    try:
        body = request.get_json()
        if "email" not in body or "password" not in body:
            raise APIException("Please provide both email and password", status_code=400)

        email = body['email']
        password = body['password']
        user = User.query.filter_by(email=email).first()
        print(user)
        if user and check_password_hash(user.password, password):
            access_token = create_access_token(identity=email)
            return jsonify(access_token=access_token), 200
        else:
            return jsonify(message="Login failed. Please check your credentials."), 401

    except Exception as e:
        return jsonify(message=str(e)), 500

@api.route('/user/<int:id>', methods=['PUT'])
def update_user(id):
    body=request.get_json()
    user=User.query.get(id)
    if user is None :
        raise APIException ('user not found', status_code=404)
    if 'email' in body:
        user.email=body['email']
    if 'password' in body:
        user.email=body['password']
    if 'is_active' in body:
        user.is_active=body['is_active']

    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route('/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    user=User.query.get(id)
    if user is None:
        raise APIException ('user not found', status_code=404)
    db.session.delete(user)
    db.session.commit()
    return jsonify(user.serialize()), 200

@api.route('/private', methods=['GET'])
@jwt_required()
def get_private():
    return jsonify({'msg:': 'this is privat and point, you not need to login'}),200
