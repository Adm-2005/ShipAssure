from flask import Blueprint

user_bp = Blueprint('user', __name__)

from api.user import auth_routes, profile_routes, carrier_routes, shipper_routes, vehicle_routes