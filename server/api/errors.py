from flask import Flask
from flask import jsonify

def register_error_handlers(app: Flask):
    """
    Registers all error handlers to the flask app.

    Args
        app: flask app instance
    """

    # Errors raised using abort(status_code, description)
    @app.errorhandler(400)
    def bad_request(error):
        response = {
            'status': 400,
            'message': 'Bad Request',
            'error': str(error)
        }
        return jsonify(response), 400
    
    @app.errorhandler(403)
    def forbidden(error):
        response = {
            'status': 403,
            'message': 'Forbidden Request',
            'error': str(error)
        }

    @app.errorhandler(404)
    def not_found(error):
        response = {
            'status': 404,
            'message': 'Not Found',
            'error': str(error)
        }
        return jsonify(response), 404
    
    # Errors raised using raise Exception
    @app.errorhandler(500)
    def exception(error):
        response = {
            'status': 500,
            'message': 'Internal Server Error',
            'error': str(error)
        }
        return jsonify(response), 500