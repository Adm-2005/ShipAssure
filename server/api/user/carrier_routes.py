# external imports
from flask import request, current_app, abort, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# internal imports
from api.db_models.user_models import Carrier
from api.utils.object_id import PydanticObjectId

