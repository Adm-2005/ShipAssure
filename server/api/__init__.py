# external imports
from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from logging.config import dictConfig
from flask_jwt_extended import JWTManager

# internal imports
from api.config import Config
from api.errors import register_error_handlers

mongo = PyMongo()
jwt = JWTManager()

def create_app(config_class = Config):
    '''
    Factory function to create flask app.

    Args
        config_class: Python class containing app configurations

    Returns
        app: Flask app
    '''
    dictConfig(config_class.LOGGING_CONFIG)
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(
        app, 
        origins=['http://localhost:5173'],
        allow_headers=['Authorization', 'Content-Type'],
        supports_credentials = True
    )
    
    mongo.init_app(app)
    jwt.init_app(app)

    register_error_handlers(app)

    # importing blueprints inside the factory function 
    # to avoid circular imports
    from api.user import user_bp
    from api.shipment import ship_bp
    from api.services import services_bp

    app.register_blueprint(user_bp, url_prefix = '/users')
    app.register_blueprint(ship_bp, url_prefix = '/shipments')
    app.register_blueprint(services_bp, url_prefix = '/services')

    return app