# external imports
from bson import ObjectId
from pymongo import ReturnDocument
from typing import Tuple, Dict, Any
from flask import request, current_app, abort, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# internal imports
from api import mongo
from api.user import user_bp
from api.db_models.user_models import User
from api.utils.object_id import PydanticObjectId
from api.utils.validators import email_validator

users = mongo.db.users

@user_bp.route('/<string:id>', methods=['GET'])
def get_profile(id: str) -> Tuple[Dict[str, Any], int]:
    """
    Endpoint to get user profile.
    
    Args
        id: user id

    Returns
        [Tuple[Dict[str, Any]]]: json representation, http status code
    """
    try: 
        if not ObjectId.is_valid(id):
            abort(400, 'Invalid user id.')

        res = users.find_one({ '_id': ObjectId(id) })

        if not res:
            abort(404, 'User not found.')

        res['_id'] = PydanticObjectId(id)
        user = User(**res)

        return jsonify({ 
            'message': 'User fetched successfully.',
            'data': user.to_json()
        }), 200

    except Exception as e:
        current_app.logger.error('Error while fetching profile: %s', e)
        raise e

@user_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_user() -> Tuple[Dict[str, Any], int]:
    """Endpoint to update user."""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json() 

        if not data:
            # atleast one field must be present in data 
            # otherwise no update takes place
            # no restrictions on field 
            abort(400, 'No data to update.')

        email = data.get('email', '').strip().lower() 

        if email:
            if not email_validator(email):
                abort(400, 'Invalid email format.')

        updated_user = users.find_one_and_update(
            { '_id': ObjectId(current_user_id) },
            { '$set': data },
            return_document = ReturnDocument.AFTER
        )

        if not updated_user:
            abort(404, 'User not found.')

        updated_user['_id'] = PydanticObjectId(current_user_id)
        user = User(**updated_user)

        return jsonify({
            'message': 'User updated successfully.',
            'data': user.to_json()
        }), 200

    except Exception as e:
        current_app.logger.error('Error while updating user: %s', e)
        raise e
    
@user_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_user() -> Tuple[Dict[str, Any], int]:
    """Endpoint to delete user."""
    try:
        current_user_id = get_jwt_identity()
        deleted_user = users.find_one_and_delete({ '_id': ObjectId(current_user_id) })

        if not deleted_user:
            abort(404, 'User not found.')

        return jsonify({ 
            'message': 'User deleted successfully.', 
            'data': None
        }), 200

    except Exception as e:
        current_app.logger.error('Error while deleting user: %s', e)
        raise e
    
@user_bp.route('/wallet', methods=['POST'])
@jwt_required()
def store_wallet_address() -> Tuple[Dict[str, Any], int]:
    """Stores the address of user's wallet."""
    current_user_id = get_jwt_identity()
    user = users.find_one({ '_id': ObjectId(current_user_id) })

    if not user:
        abort(404, 'User not found.')
    
    data = request.get_json()

    if not data or not data.get('address'):
        abort(400, 'Missing required fields.')

    wallet_address = data.get('address').strip()
