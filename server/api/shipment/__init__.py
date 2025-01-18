from flask import Blueprint

ship_bp = Blueprint('shipment', __name__)

from api.shipment import management, bidding