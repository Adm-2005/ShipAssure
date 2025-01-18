from flask import Blueprint

track_bp = Blueprint('tracking', __name__)

from api.tracking import routes