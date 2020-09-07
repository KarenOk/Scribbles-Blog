import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models import setup_db, Post, Comment


class ScribblesTestCase(unittest.TestCase):
    """This class represents test cases for Scribbles blog resources. """

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

    def __create_post__(self):
        """ Helper method to create a new post """
        res = self.client().post("/posts", json=self.new_post)
        data = json.loads(res.data)
        post_id = data["created"]
        return post_id

    def __create_comment__(self, post_id):
        """ Helper method to create a new comment under a post """
        res = self.client().post(
            f"/posts/{post_id}/comments", json=self.new_comment)
        data = json.loads(res.data)
        comment_id = data["created"]
        return comment_id

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
        # missing keys
        res = self.client().post("/posts", json={})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 400)
        self.assertEqual(data["error"], 400)
        self.assertFalse(data["success"])

        # title exceeds char limit
        res = self.client().post("/posts", json={
            "title": "Some extremely long title that clearly exceeds the specified char limit. Some extremely long title that clearly exceeds the specified char limit.",
            "content": "Some content"
        })
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 400)
        self.assertEqual(data["error"], 400)
        self.assertFalse(data["success"], 400)

    def test_update_post_success(self):
        post_id = self.__create_post__()

        # Update only title
        res = self.client().patch(
            f"/posts/{post_id}", json={"title": "Updated title"})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["updated"], post_id)
        self.assertTrue(data["success"])

        # Update only content
        res = self.client().patch(
            f"/posts/{post_id}", json={"content": "Updated content"})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["updated"], post_id)
        self.assertTrue(data["success"])

        # Check the db was updated accordingly
        post = Post.query.get(post_id)
        self.assertEqual(post.title, "Updated title")
        self.assertEqual(post.content, "Updated content")

    def test_update_post_bad_request(self):
        post_id = self.__create_post__()
        res = self.client().patch(f"/posts/{post_id}", json={})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 400)
        self.assertEqual(data["error"], 400)
        self.assertFalse(data["success"])

    def test_update_post_not_found(self):
        res = self.client().patch(f"/posts/1000", json=self.new_post)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data["error"], 404)
        self.assertFalse(data["success"])

    def test_delete_post_success(self):
        post_id = self.__create_post__()

        res = self.client().delete(f"/posts/{post_id}")
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["deleted"], post_id)
        self.assertTrue(data["success"])

        post = Post.query.get(post_id)
        self.assertIsNone(post)

    def test_delete_post_not_found(self):
        res = self.client().delete(f"/posts/1000", json=self.new_post)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data["error"], 404)
        self.assertFalse(data["success"])

    def test_get_paginated_comments_for_a_post(self):
        post_id = self.__create_post__()
        comment_id = self.__create_comment__(post_id=post_id)

        res = self.client().get(f"/posts/{post_id}/comments")
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(data["comments"]), 1)
        self.assertTrue(data["success"])

    def test_get_paginated_comments_for_a_post_invalid_page(self):
        res = self.client().get("/posts/1/comments?page=1000")
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 404)
        self.assertEqual(data["error"], 404)
        self.assertEqual(data["success"], False)

    def test_get_paginated_comments_for_a_post_not_found(self):
        res = self.client().get("/posts/1000/comments")
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 404)
        self.assertEqual(data["error"], 404)
        self.assertEqual(data["success"], False)

    def test_create_comment_for_a_post(self):
        post_id = self.__create_post__()

        res = self.client().post(
            f"/posts/{post_id}/comments", json=self.new_comment)
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["comment"]["post_id"], post_id)
        self.assertTrue(data["success"])

        post = Post.query.get(post_id).format()
        self.assertEqual(len(post["comments"]), 1)  # check number of comment

    def test_create_comment_for_a_post_bad_request(self):
        post_id = self.__create_post__()

        res = self.client().post(f"/posts/{post_id}/comments", json={})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 400)
        self.assertEqual(data["error"], 400)
        self.assertFalse(data["success"])


if __name__ == "__main__":
    unittest.main()
