import os
from dotenv import load_dotenv

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) # server directory

load_dotenv(os.path.join(base_dir, '.env'))

class Config:
    """ Defines configurations and environment variables for flask app. """

    TESTING = os.environ.get('TESTING', 'False').lower() in ['true', 'yes']
    CLIENT_URL = os.environ.get('CLIENT_URL')
    MONGO_URI = os.environ.get('MONGO_URI')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 86400)) # 60 * 60 * 24 = 86400 i.e. 24 hours
    VEHICLE_IMG_DIR = os.path.join(base_dir, os.environ.get('VEHICLE_IMG_DIR'))
    PROFILE_IMG_DIR = os.path.join(base_dir, os.environ.get('PROFILE_IMG_DIR'))
    LOGGING_CONFIG = {
        'version': 1,
        'formatters': {'default': {
            'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
        }},
        'handlers': {'wsgi': {
            'class': 'logging.StreamHandler',
            'stream': 'ext://flask.logging.wsgi_errors_stream',
            'formatter': 'default'
        }},
        'root': {
            'level': 'INFO',
            'handlers': ['wsgi']
        }
    }