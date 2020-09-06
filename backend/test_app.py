import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models import setup_db, Post, Comment


class ScribblesTestCase(unittest.TestCase):
    """This class represents test case for Scribbles. """

    def setUp(self):
        """Initialize app and test variables."""

        self.app = create_app()
        self.client = self.app.test_client
        self.database_path = os.environ["DATABASE_URL"]
        setup_db(app=self.app, database_path=self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            self.db.create_all()  # create all tables

    def tearDown(self):
        pass

    def test_index_route(self):
        res = self.client().get("/")
        self.assertEqual(res.status_code, 200)


if __name__ == "__main__":
    unittest.main()
