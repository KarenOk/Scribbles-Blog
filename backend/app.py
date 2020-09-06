from flask import Flask
from flask_cors import CORS
from models import setup_db


def create_app():
    app = Flask(__name__)
    setup_db(app)
    CORS(app)

    @app.route("/")
    def index():
        return "Welcome to Scribbles API! We're lucky to have you."

    return app


app = create_app()

if __name__ == "__main__":
    app.run()
