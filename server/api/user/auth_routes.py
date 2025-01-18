# external imports
from bson import ObjectId
from datetime import timedelta
from typing import Dict, Tuple, Any
from pydantic import ValidationError
from flask_jwt_extended import create_access_token
from flask import request, current_app, jsonify, abort, make_response

# internal imports
from api import mongo
from api.user import user_bp
from api.utils.object_id import PydanticObjectId
from api.db_models.user_models import User, Shipper, Carrier
from api.utils.validators import password_validator, email_validator, username_validator

@user_bp.route('/auth/register', methods = ['POST'])
def register() -> Tuple[Dict[str, Any], int]:
    """Endpoint to register users."""
    JWT_ACCESS_TOKEN_EXPIRES = current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES')
    users = mongo.db.users
    shippers = mongo.db.shippers
    carriers = mongo.db.carriers

    try:
        data = request.get_json()
        required_fields = [
            'first_name',
            'last_name',
            'email',
            'role',
            'password',
            'country'
        ]

        if not data or not all(field in data for field in required_fields):
            abort(400, 'Missing required fields.')

        email = data.get('email', '').strip().lower()
        role = data.get('role', '').strip().lower()
        password = data.pop('password', None)

        if not email_validator(email):
            abort(400, 'Invalid email format.')

        if not password_validator(password):
            abort(400, 'Your password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number.')

        if role not in ['shipper', 'carrier']:
            abort(400, 'Invalid user role.')

        if users.find_one({ 'email': email }):
            abort(400, 'Email already exists.')

        user = User(**data)
        user.set_password(password)
        user_id = PydanticObjectId(str(users.insert_one(user.to_bson()).inserted_id))

        user.set_id(user_id)
        print(user) # user id is not converted into PydanticObjectId but stays ObjectId

        if role == 'shipper':
            shipper = Shipper(user_id = PydanticObjectId(str(user_id)))
            shipper_id = shippers.insert_one(shipper.to_bson()).inserted_id
            users.update_one({ '_id': user_id }, { '$set': { 'shipper_id': shipper_id } })
        else:
            carrier = Carrier(user_id = PydanticObjectId(str(user_id)))
            carrier_id = carriers.insert_one(carrier.to_bson()).inserted_id
            users.update_one({ '_id': user_id }, { '$set': { 'carrier_id': carrier_id } })

        response = make_response({ 
            'message': 'Registration successful.', 
            'data': user.to_json()   
        })
        response.set_cookie(
            key = '$fo_auth_token',
            value = create_access_token(identity = str(user_id), expires_delta = timedelta(hours = JWT_ACCESS_TOKEN_EXPIRES)),
            httponly = request.is_secure,
            secure = request.is_secure,
            samesite = None
        )

        return response, 201

    except ValidationError as ve:
        current_app.logger.error('Error while validating in register route: %s', ve)
        raise ve

    except Exception as e:
        current_app.logger.error('Error while registering user: %s', e)
        raise e

@user_bp.route('/auth/login', methods = ['POST'])
def login() -> Tuple[Dict[str, Any], int]:
    """Endpoint to login users."""
    JWT_ACCESS_TOKEN_EXPIRES = current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES')
    users = mongo.db.users
    shippers = mongo.db.shippers
    carriers = mongo.db.carriers

    try: 
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password')

        # user can log in using either email or username
        if not data or not email or not password:
            abort(400, 'Missing required fields.')

        res = users.find_one({ 'email': email })

        if not res:
            abort(404, 'User not found.')

        print(res)
        res['_id'] = PydanticObjectId(str(res['_id']))
        print(res)
        user = User(**res)

        if not user or not user.check_password(password):
            abort(400, 'Invalid email or password.')

        response = make_response({ 
            'message': 'Login successful.',
            'data': user.to_json()
        })
        response.set_cookie(
            key = '$fo_auth_token',
            value = create_access_token(identity = str(user.id), expires_delta = timedelta(hours = JWT_ACCESS_TOKEN_EXPIRES)),
            httponly = request.is_secure,
            secure = request.is_secure,
            samesite = None
        )

        return response, 200
    
    except ValidationError as ve:
        current_app.logger.error('Error while validating in login route: %s', ve)
        raise ve

    except Exception as e:
        current_app.logger.error('Error while logging in user: %s', e)
        raise e

@user_bp.route('/auth/logout', methods = ['POST'])
def logout() -> Tuple[Dict[str, Any], int]:
    """Endpoint to logout users."""
    users = mongo.db.users
    shippers = mongo.db.shippers
    carriers = mongo.db.carriers
    try:
        response = make_response(jsonify({ 
            'message': 'Logout successful.',
            'data': None    
        }))
        response.delete_cookie(
            key = '$fo_auth_token',
            httponly = request.is_secure,
            secure = request.is_secure,
            samesite = None
        )

        return response, 200

    except Exception as e:
        current_app.logger.error('Error while logging out user: %s', e)
        raise e