from flask import Flask, jsonify
from flask_cors import CORS
from models import setup_db, Post, Comment


def create_app():
    app = Flask(__name__)
    setup_db(app)
    CORS(app)

    @app.route("/")
    def index():

        post = Post(title="The 5 Step Rule to financial freedom", content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet. Elementum eu facilisis sed odio morbi quis commodo odio aenean. Sed viverra ipsum nunc aliquet. Vulputate mi sit amet mauris commodo quis imperdiet massa. Sit amet mauris commodo quis imperdiet massa tincidunt nunc. Quis viverra nibh cras pulvinar mattis nunc sed. Suspendisse interdum consectetur libero id faucibus nisl. Metus vulputate eu scelerisque felis imperdiet. In cursus turpis massa tincidunt dui ut ornare lectus.")
        post.insert()

        return jsonify(post.format())
        # return "Welcome to Scribbles API! We're lucky to have you."

    # Expected errors - 400, 401, 403, 404, 405, 422, 500, Auth Error

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": 400,
            "message": "Your request was not formatted properly."
        }), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": 400,
            "message": "The requested resource was not found."
        }), 404

    @app.errorhandler(422)
    def unprocessable(error):
        return jsonify({
            "success": False,
            "error": 422,
            "message": "The server understood your request but could not process it."
        }), 422

    @app.errorhandler(405)
    def method_not_allowed(self):
        return jsonify({
            "success": False,
            "error": 405,
            "message": "Method not allowed."
        }), 405

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            "success": False,
            "error": 500,
            "message": "An error occurred on our end."
        }), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run()
