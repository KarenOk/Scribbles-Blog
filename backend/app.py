from flask import Flask, jsonify
from flask_cors import CORS
from models import setup_db, Post, Comment


def create_app():
    app = Flask(__name__)
    setup_db(app)
    CORS(app)

    @app.route("/")
    def index():
        return "Welcome to Scribbles API! We're lucky to have you."

    return app

    # Expected errors - 400, 401, 403, 404, 405, 422, 500, Auth Error

    @app.errorhandler(400)
    def bad_request(error):
        jsonify({
            "success": False,
            "error": 400,
            "message": "Your request was not formatted properly."
        })

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": 400,
            "message": "The requested resource was not found."
        })

    @app.errorhandler(422)
    def unprocessable(error):
        return jsonify({
            "success": False,
            "error": 422,
            "message": "The server understood your request but could not process it."
        })

    @app.errorhandler(405)
    def method_not_allowed(self):
        return jsonify({
            "success": False,
            "error": 405,
            "message": "Method not allowed."
        })

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            "success": False,
            "error": 500,
            "message": "An error occurred on our end."
        })


app = create_app()

if __name__ == "__main__":
    app.run()
