# external imports
from bson import ObjectId
from pymongo import ReturnDocument
from flask import request, current_app, jsonify, abort
from flask_jwt_extended import get_jwt_identity, jwt_required

# internal imports
from api import mongo
from api.user import user_bp
from api.db_models.user_models import Carrier

@user_bp.route('/carriers/update', methods=['PUT'])
@jwt_required()
def update_carrier():
    """Endpoint to update carrier."""
    carriers = mongo.db.carriers

    try:
        current_user_id = get_jwt_identity()

        data = request.get_json()
        if not data:
            abort(400, 'No data to update.')

        res = carriers.find_one_and_update({ 'user_id': ObjectId(current_user_id) }, { '$set': data }, return_document=ReturnDocument.AFTER)
        if not res:
            abort(404, 'Carrier not found.')

        carrier = Carrier(**res)

        return jsonify({
            'message': 'Carrier updated successfully.',
            'data': carrier.to_json()
        }), 200

    except Exception as e:
        current_app.logger.error('Error while updating carrier: %s', e)
        raise e