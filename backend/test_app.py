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

        self.new_post = {
            "title": "Post title",
            "content": "Post body",
        }

        self.new_comment = {"comment": "Nice read!"}

    def tearDown(self):
        pass

    def test_index_route(self):
        res = self.client().get("/")
        self.assertEqual(res.status_code, 200)

    def test_get_paginated_posts(self):
        res = self.client().get("/posts")
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data["success"])

    def test_get_paginated_posts_invalid_page(self):
        res = self.client().get("/posts?page=1000")
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 404)
        self.assertEqual(data["error"], 404)
        self.assertEqual(data["success"], False)

    def test_create_post_success(self):
        res = self.client().post("/posts", json=self.new_post)
        data = json.loads(res.data)
        post = Post.query.get(data["created"])

        self.assertEqual(res.status_code, 200)
        self.assertTrue(data["success"])
        self.assertIsNotNone(post)

    def test_create_post_bad_request(self):
        res = self.client().post("/posts", json={})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 400)
        self.assertEqual(data["error"], 400)


if __name__ == "__main__":
    unittest.main()
