# external imports
from bson import ObjectId
from datetime import datetime
from pymongo import ReturnDocument
from typing import Tuple, Dict, Any
from flask import request, current_app, jsonify, abort
from flask_jwt_extended import get_jwt_identity, jwt_required

# internal imports
from api import mongo
from api.shipment import ship_bp
from api.services import predict_top_bid
from api.db_models.user_models import Carrier
from api.utils.object_id import PydanticObjectId
from api.db_models.shipment_models import Shipment, Bid

@ship_bp.route('/<string:sh_id>/bids', methods=['POST'])
@jwt_required()
def add_bid(sh_id: str) -> Tuple[Dict[str, Any], int]:
    """
    Endpoint to add a bid to a shipment.

    Args
        sh_id: id of the shipment.

    Returns
        [Tuple[Dict[str, Any]]]: json response object, status code.
    """
    carriers = mongo.db.carriers
    shipments = mongo.db.shipments
    bids = mongo.db.bids
    try:
        if not ObjectId.is_valid(sh_id):
            abort(400, 'Invalid object id.')

        data = request.get_json()
        req_fields = ['proposed_delivery_date', 'proposed_price', 'proposed_vehicle']

        if not data or not all(field in data for field in req_fields):
            abort(400, 'Missing required fields.')

        proposed_price = int(data.get('proposed_price'))
        proposed_vehicle = data.get('proposed_vehicle')

        if not ObjectId.is_valid(proposed_vehicle):
            abort(400, 'Invalid object id.')

        if proposed_price < 1:
            abort(400, 'Price cannot be less than 1.')

        current_user_id = get_jwt_identity()

        carrier_res = carriers.find_one({ 'user_id': ObjectId(current_user_id) })
        if not carrier_res:
            abort(404, 'Carrier not found.')
        
        carrier = Carrier(**carrier_res)

        bid_data = {
            'shipment_id': ObjectId(sh_id),
            'carrier_id': ObjectId(carrier.id),
            'proposed_price': proposed_price,
            'proposed_vehicle': ObjectId(proposed_vehicle),
            'additional_notes': data.get('additional_notes').strip(),
            'accepted': False
        }

        try:
            bid_data['proposed_delivery_date'] = datetime.strptime(
                data.get('proposed_delivery_date'), "%Y-%m-%dT%H:%M:%S"
            )
        except ValueError:
            abort(400, 'Invalid proposed_delivery_date format. Use ISO 8601 (e.g., "YYYY-MM-DDTHH:MM:SS").')

        bid = Bid(**bid_data)
        bid_inserted_id = bids.insert_one(bid.to_bson()).inserted_id
        bid.id = PydanticObjectId(str(bid_inserted_id))

        shipment_res = shipments.find_one_and_update(
            {'_id': ObjectId(sh_id)},
            {'$push': {'bids': bid.id}},
            return_document=ReturnDocument.AFTER,
        )
        if not shipment_res:
            abort(404, 'Shipment not found.')

        carrier_res = carriers.find_one_and_update(
            {'_id': ObjectId(carrier.id)},
            {'$push': {'bids': bid.id}},
            return_document=ReturnDocument.AFTER,
        )

        return jsonify({
            'message': 'Bid placed successfully.',
            'data': {
                'shipment': Shipment(**shipment_res).to_json(),
                'bid': bid.to_json(),
                'carrier': Carrier(**carrier_res).to_json()
            }
        }), 200

    except Exception as e:
        current_app.logger.error('Error while adding bid to shipment %s: %s', sh_id, e)
        raise e

@ship_bp.route('/bids/<string:b_id>', methods=['DELETE'])
@jwt_required()
def delete_bid(b_id: str) -> Tuple[Dict[str, Any], int]:
    """
    Endpoint to delete bid.

    Args
        b_id: id of the bid to delete.

    Returns 
        [Tuple[Dict[str, Any], int]]: json response object, http status code.
    """
    shipments = mongo.db.shipments
    carriers = mongo.db.carriers
    bids = mongo.db.bids
    try:
        if not ObjectId.is_valid(b_id):
            abort(400, 'Invalid object id.')

        deleted_bid = bids.find_one_and_delete(
            { '_id': ObjectId(b_id) },    
        )

        if not deleted_bid:
            abort(404, 'Bid not found.')

        updated_shipment = Shipment(**shipments.find_one_and_update(
            {'_id': ObjectId(deleted_bid['shipment_id'])},
            {'$pull': {'bids': ObjectId(b_id)}}
        ))
        updated_carrier = Carrier(**carriers.find_one_and_update(
            {'_id': ObjectId(deleted_bid['carrier_id'])},
            {'$pull': {'bids': ObjectId(b_id)}}
        ))

        return jsonify({
            'message': 'Bid deleted successfully.',
            'data': {
                'shipment': updated_shipment.to_json(),
                'carrier': updated_carrier.to_json()
            }
        }), 200

    except Exception as e:
        current_app.logger.error('Error while deleting bid: %s', e)
        raise e
    
@ship_bp.route('/<string:sh_id>/top-bids', methods=['GET'])
@jwt_required()
def get_top_bid(sh_id: str):
    """Endpoint to get the top bid."""
    bids = mongo.db.bids
    try:
        if not ObjectId.is_valid(sh_id):
            abort(400, 'Invalid object id.')

        bids_list = bids.find({ 'shipment_id': ObjectId(sh_id) })
        if not bids_list:
            abort(404, 'No bids found.')

        top_bid = predict_top_bid(bids_list, current_app.config.get('MODEL_DIR'))

        print(top_bid)

        bid = Bid(**top_bid)

        return jsonify({
            'message': 'Top bid fetched successfully.',
            'data': bid.to_json()
        }), 200

    except Exception as e: 
        current_app.logger.error('Error while getting top bid: %s', e)
        raise e