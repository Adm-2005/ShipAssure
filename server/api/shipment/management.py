# external imports
import datetime
from bson import ObjectId
from typing import Tuple, Dict, Any
from pymongo import ReturnDocument, DESCENDING
from flask import request, current_app, abort, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# internal imports
from api import mongo 
from api.shipment import ship_bp
from api.utils.geo import calculate_distance
from api.utils.object_id import PydanticObjectId
from api.utils.pagination import pagination_links
from api.db_models.user_models import Shipper, Carrier
from api.db_models.shipment_models import Shipment, Status, Mode

@ship_bp.route('/<string:s_id>', methods=['GET'])
def get_shipment(s_id: str) -> Tuple[Dict[str, Any], int]:
    """
    Endpoint to fetch a shipment.

    Args
        s_id: id of the shipment to be fetched.

    Returns
        [Tuple[Dict[str, Any]]]: response object, http status code.
    """
    shippers = mongo.db['shippers']
    shipments = mongo.db['shipments']
    try:
        if not ObjectId.is_valid(s_id):
            abort(400, 'Invalid object id.')

        res = shipments.find_one({ '_id': ObjectId(s_id) })
        if not res:
            abort(404, 'Shipment not found.')

        shipment = Shipment(**res)

        return jsonify({
            'message': 'Shipment fetched successfully.',
            'data': shipment.to_json()
        }), 200

    except Exception as e:
        current_app.logger.error('Error while fetching shipment %s: %s', s_id, e)
        raise e
    
@ship_bp.route('/shipper/<string:sh_id>', methods=['GET'])
@jwt_required()
def get_all_shipments_of_a_shipper(sh_id: str) -> Tuple[Dict[str, Any]]:
    """
    Endpoint to fetch all the shipments associated with a shipper.

    Args
        sh_id: id of the shipper.

    Returns 
        [Tuple[Dict[str, Any], int]]: response object, http status code.
    """
    shippers = mongo.db['shippers']
    shipments = mongo.db['shipments']
    try:
        if not ObjectId.is_valid(sh_id):
            abort(400, 'Invalid object id.')

        # confirming user permission
        shipper_res = shippers.find_one({ '_id': ObjectId(sh_id) })
        if not shipper_res:
            abort(404, 'Shipper not found.')

        shipper = Shipper(**shipper_res)
        user_id = get_jwt_identity()

        if shipper.user_id != user_id:
            abort(403, 'Identity mismatch.')

        # fetching and paginating shipments
        page = max(int(request.args.get('page', 1)), 1)
        per_page = min(int(request.args.get('per_page', 10)), 100)

        if page <= 0 or per_page <= 0:
            abort(400, 'Invalid arguments.')

        cursor = shipments.find({ 'shipper_id': ObjectId(sh_id) }) \
        .sort('created_at', DESCENDING).skip(per_page * page - 1).limit(per_page)

        shipment_count = shipments.count_documents({ 'shipper_id': ObjectId(sh_id) })

        links = pagination_links('.get_all_shipments_of_a_shipper', shipment_count, page, per_page)

        return jsonify({
            'message': 'Shipments fetched successfully.',
            'data': [Shipment(**doc).to_json() for doc in cursor],
            'links': links
        }), 200

    except Exception as e:
        current_app.logger.error('Error while fetching all shipments of the shipper %s: %s', sh_id, e)
        raise e
    
@ship_bp.route('/shipper/<string:sh_id>/active', methods=['GET'])
@jwt_required()
def get_status_based_shipments_of_a_shipper(sh_id: str, status: Status) -> Tuple[Dict[str, Any]]:
    """
    Endpoint to fetch active shipments associated with a shipper.

    Args
        sh_id: id of the shipper.
        status: waiting/active/delayed/delivered.

    Returns
        [Tuple[Dict[str, Any], int]]: response object, http status code.
    """
    shippers = mongo.db['shippers']
    shipments = mongo.db['shipments']
    try:
        if not ObjectId.is_valid(sh_id):
            abort(400, 'Invalid object id.')

        # confirming user permission
        shipper_res = shippers.find_one({ '_id': ObjectId(sh_id) })
        if not shipper_res:
            abort(404, 'Shipper not found.')

        shipper = Shipper(**shipper_res)
        user_id = get_jwt_identity()

        if shipper.user_id != user_id:
            abort(403, 'Identity mismatch.')

        # fetching and paginating shipments
        page = max(int(request.args.get('page')), 1)
        per_page = min(int(request.args.get('per_page')), 100)

        if page <= 0 or per_page <= 0:
            abort(400, 'Invalid arguments.')

        query = { '$and': [{ '_id': ObjectId(sh_id) }, { 'status': status }] }

        cursor = shippers.find(query).sort('created_at', DESCENDING) \
            .skip(per_page * page - 1).limit(per_page)

        shipment_count = shippers.count_documents(query)

        links = pagination_links('.get_status_based_shipments_of_a_shipper', shipment_count, page, per_page)

        return jsonify({
            'message': f'{status} shipments fetched successfully.',
            'data': [Shipment(**doc).to_json() for doc in cursor],
            'links': links
        }), 200

    except Exception as e:
        current_app.logger.error('Error while fetching %s shipments of the shipper %s: %s', status, sh_id, e)
        raise e
    
@ship_bp.route('/', methods=['POST'])
@jwt_required()
def create_shipment() -> Tuple[Dict[str, Any], int]:
    """Endpoint to create shipments."""
    shippers = mongo.db['shippers']
    shipments = mongo.db['shipments']
    try: 
        data = request.get_json()
        req_fields = [
            'origin_code', 
            'destination_code', 
            'cargo_load'
        ]

        if not data or not all(field in data for field in req_fields):
            abort(400, 'Missing required fields.')

        # validating mode list
        mode = data.get('mode')
        if not isinstance(mode, list) or not all(isinstance(m, Mode) for m in mode):
            abort(400, 'Invalid transportation mode.')

        # creating origin and destination dictionaries
        origin = {
            'postal_code': data.get('origin_code').strip(),
            'city': data.get('origin_city').strip(),
            'country': data.get('origin_country').strip()
        }

        destination = {
            'postal_code': data.get('destination_code').strip(),
            'city': data.get('destination_city').strip(),
            'country': data.get('destination_country').strip()
        }
 
        distance = calculate_distance(
            origin['postal_code'], 
            origin['country'], 
            destination['postal_code'], 
            destination['country']
        )

        # fetching the current shipper
        user_id = get_jwt_identity()

        res = shippers.find_one({ 'user_id': ObjectId(user_id) })
        if not res:
            abort(404, 'Shipper not found.')

        shipper = Shipper(**res)

        # initializing and inserting shipment into database
        shipment_data = {
            'shipper_id': PydanticObjectId(str(shipper.id)),
            'origin': origin,
            'destination': destination,
            'distance': distance,
            'mode': mode,
            'status': 'waiting',
            'cargo_load': data.get('cargo_load').strip(),
            'cargo_type': data.get('cargo_type').strip(),
            'updated_at': datetime.datetime.now(tz = datetime.timezone.utc)
        }

        new_shipment = Shipment(**shipment_data)
        shipment_id = shipments.insert_one(new_shipment.to_bson()).inserted_id
        new_shipment.id = PydanticObjectId(str(shipment_id))

        # adding new shipment's id to sent_shipments
        shipper.sent_shipments.append(shipment_id)
        _ = shippers.find_one_and_update({ 
            '_id': ObjectId(shipper.id) }, 
            { '$set': shipper }, 
            return_document = ReturnDocument.AFTER
        )

        return jsonify({
            'message': 'Shipment created successfully.',
            'data': {
                'shipment': new_shipment.to_json(),
                'shipper': shipper.to_json()
            }
        }), 201

    except Exception as e:
        current_app.logger.error('Error while creating shipment: %s', e)
        raise e
    
@ship_bp.route('/<string:s_id>', methods=['PUT'])
@jwt_required()
def update_shipment(s_id: str) -> Tuple[Dict[str, Any], int]:
    """
    Endpoint to update shipments. Only works for 'waiting' shipments.

    Args
        s_id: id of the shipment.

    Returns
        [Tuple[Dict[str, Any], int]]: json response object, http status code.
    """
    shippers = mongo.db['shippers']
    shipments = mongo.db['shipments']
    try:
        if not ObjectId.is_valid(s_id):
            abort(400, 'Invalid object id.')

        data = request.get_json()
        if not data: 
            abort(400, 'No field to update.')

        res = shipments.find_one_and_update(
            { '_id': ObjectId(s_id) }, 
            { '$set': data }, 
            return_document = ReturnDocument.AFTER
        )

        updated_shipment = Shipment(**res)

        return jsonify({
            'message': 'Shipment updated successfully.',
            'data': updated_shipment.to_json()
        }), 200

    except Exception as e:
        current_app.logger.error('Error while updating shipment %s: %s', s_id, e)
        raise e