# external imports
import datetime
from bson import ObjectId
from typing import Tuple, Dict, Any
from pymongo import DESCENDING, ReturnDocument
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, current_app, abort, jsonify, url_for

# internal imports
from api import mongo
from api.user import user_bp
from api.db_models.user_models import Carrier
from api.utils.object_id import PydanticObjectId
from api.utils.pagination import pagination_links
from api.db_models.vehicle_models import Vehicle

carriers = mongo.db['carriers']
vehicles = mongo.db['vehicles']
rent_information = mongo.db['rent_information']

@user_bp.route('/vehicles/<string:v_id>', methods=['GET'])
def get_vehicle(v_id: str) -> Tuple[Dict[str, Any], int]:
    """
    Endpoint to fetch the details of a vehicle.

    Args
        v_id: id of the vehicle to be fetched.

    Returns
        [Tuple[Dict[str, Any], int]]: response object, http status code.
    """
    try:
        if not ObjectId.is_valid(v_id):
            abort(400, 'Invalid object id.')

        res = vehicles.find_one({ '_id': ObjectId(v_id) })
        if not res:
            abort(404, 'Vehicle not found.')

        vehicle = Vehicle(**res)

        return jsonify({
            'message': 'Vehicle fetched successfully.',
            'data': vehicle.to_json()
        }), 200

    except Exception as e:
        current_app.logger.error('Error while fetching a vehicle: %s', e)
        raise e

@user_bp.route('/carriers/<string:c_id>/vehicles', methods=['GET'])
@jwt_required()
def get_vehicles(c_id: str) -> Tuple[Dict[str, Any], int]:
    """
    Endpoint to fetch all vehicles registered by a carrier.
    
    Args
        c_id: primary id of the carrier whose vehicles need to be fetched.

    Returns
        [Tuple[Dict[str, Any], int]]: paginated response, http status code.
    """
    try:
        if not ObjectId.is_valid(c_id):
            abort(400, 'Invalid carrier id.')

        # fetching carrier data from database
        res = carriers.find_one({ '_id': ObjectId(c_id) })
        if not res:
            abort(404, 'Carrier not found.')

        carrier = Carrier(**res)

        # confirming if current user has the necessary permission
        user_id = get_jwt_identity()        
        if carrier.user_id != user_id:
            abort(403, 'Identity mismatch.')

        # paginating response
        page = max(int(request.args.get('page', 1)), 1)
        per_page = min(int(request.args.get('per_page', 10)), 100)

        if page <= 0 or per_page <= 0:
            abort(400, 'Invalid arguments.')

        cursor = vehicles.find({ 'carrier_id': ObjectId(c_id) }) \
        .sort('updated_at', DESCENDING).skip(per_page * (page - 1)).limit(per_page)

        vehicle_count = vehicles.count_documents({ 'carrier_id': ObjectId(c_id) })

        links = pagination_links('.get_vehicles', vehicle_count, page, per_page)

        return jsonify({
            'message': 'Vehicles fetched successfully.',
            'data': {
                'vehicles': [Vehicle(**doc).to_json() for doc in cursor],
                'links': links
            }
        }), 200

    except Exception as e:
        current_app.logger.error('Error while fetching vehicles: %s', e)
        raise e

@user_bp.route('/carriers/<string:c_id>/vehicles', methods=['POST'])
@jwt_required()
def add_vehicle(c_id: str) -> Tuple[Dict[str, Any], int]:
    """
    Endpoint to add a vehicle for a carrier.
    
    Args
        c_id: id of the carrier associated with the new vehicle.

    Returns 
        [Tuple[Dict[str, Any], int]]: response object, http status code.
    """
    try:
        if not ObjectId.is_valid(c_id):
            abort(400, 'Invalid carrier id.')

        # validating data
        data = request.get_json() 
        required_fields = ['registration_number', 'is_rented', 'owner_name']

        if not data or not all(field in data for field in required_fields):
            abort(400, 'Missing required fields.')

        is_rented = data.get('is_rented', False)

        if is_rented and not data.get('rent_duration'):
            abort(400, 'Rent duration is mandatory for rented vehicles.')
        
        # fetching carrier information and initializing carrier object
        res = carriers.find_one({ '_id': ObjectId(c_id) })
        if not res:
            abort(404, 'Carrier not found.')
        carrier = Carrier(**res)

        # confirming if the given user has the permission to add vehicle
        user_id = get_jwt_identity()
        if carrier.user_id != user_id:
            abort(403, 'Identity mismatch.')

        # initializing Vehicle object and inserting it into database
        vehicle_data = {
            'c_id': PydanticObjectId(c_id),
            'age': int(data.get('age')),
            'is_rented': is_rented,
            'owner_name': data.get('owner_name').strip(),
            'rent_duration': int(data.get('rent_duration', 0)),
            'registration_number': data.get('registration_number', '').strip(),
            'additional_info': data.get('additional_info', '').strip(),
            'updated_at': datetime.datetime.now(tz = datetime.timezone.utc)
        }
        vehicle = Vehicle(**vehicle_data)
        vehicle_id = vehicles.insert_one(vehicle.to_bson()).inserted_id
        vehicle.id = PydanticObjectId(str(vehicle_id))

        return jsonify({
            'message': 'Vehicle added successfully.',
            'data': vehicle.to_json()
        }), 201

    except Exception as e:
        current_app.logger.error('Error while adding vehicle: %s', e)
        raise e
    
@user_bp.route('/carriers/<string:c_id>/vehicles/<string:v_id>', methods=['PUT'])
@jwt_required()
def update_vehicle(c_id: str, v_id: str) -> Tuple[Dict[str, Any], int]:
    """
    Endpoint to update a vehicle's information.

    Args
        c_id: carrier id whose vehicle needs to be updated.
        v_id: vehicle id that needs to be updated.

    Returns
        [Tuple[Dict[str, Any], int]]: response object, http status code.
    """
    try:
        if not ObjectId.is_valid(c_id) or not ObjectId.is_valid(v_id):
            abort(400, 'Invalid object id.')

        data = request.get_json()

        if not data:
            abort(400, 'No data to update.')

        res = vehicles.find_one_and_update(
            { '_id': ObjectId(v_id) }, 
            { '$set': data }, 
            return_document = ReturnDocument.AFTER
        )
        vehicle = Vehicle(**res)

        return jsonify({
            'message': 'Vehicle updated successfully.',
            'data': vehicle.to_json()
        }), 200

    except Exception as e:
        current_app.logger.error('Error while updating vehicle %s: %s', v_id, e)
        raise e
    
@user_bp.route('/carriers/<string:c_id>/vehicles/<string:v_id>', methods=['DELETE'])
@jwt_required()
def delete_vehicle(c_id: str, v_id: str) -> Tuple[Dict[str, Any], int]: 
    """
    Endpoint to delete vehicle.

    Args
        c_id: id of the associated carrier.
        v_id: id of the vehicle to be deleted.

    Returns
        [Tuple[Dict[str, Any], int]]: response object, http status code.
    """
    try:
        if not ObjectId.is_valid(c_id) or not ObjectId.is_valid(v_id):
            abort(400, 'Invalid object id.')

        # confirming if the current user has the permission to delete vehicle
        res = carriers.find_one({ '_id': ObjectId(c_id) })
        if not res:
            abort(404, 'Associated carrier not found.')

        user_id = get_jwt_identity()
        carrier = Carrier(**res)
        
        if carrier.user_id != user_id:
            abort(403, 'Identity mismatch.')

        # deleting the vehicle
        deleted_vehicle = vehicles.find_one_and_delete({ '_id': ObjectId(v_id) })
        if not deleted_vehicle:
            abort(404, 'Vehicle not found.')

        return jsonify({
            'message': 'Vehicle record deleted successfully.',
            'data': None
        }), 200

    except Exception as e:
        current_app.logger.error('Error while deleting vehicle %s: %s', v_id, e)
        raise e