from datetime import datetime
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from models import setup_db, db, Post, Comment
from auth import requires_auth, AuthError


def paginator(request, data, items_per_page):
    page = request.args.get("page", 1, type=int)
    end = page * items_per_page
    start = end - items_per_page

    if len(data) < start:
        abort(404)

    return [d.format() for d in data[start:end]]


def create_app():
    app = Flask(__name__)
    setup_db(app)
    CORS(app)

    @app.after_request
    def after_request(response):
        """ Set Access Control Headers """

        response.headers.add("Access-Control-Allow-Headers",
                             "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods",
                             "GET, POST, PATCH, OPTIONS, DELETE")

        return response

    @app.route("/")
    def index():
        """ 
            Endpoint to test that API works 
        """
        return "Welcome to Scribbles API! We're lucky to have you."

    """ 
       
        Endpoints to manage posts
        
    """

    @app.route("/posts")
    def get_posts():
        """ 
            Endpoint to get a paginated list of posts
        """
        posts = Post.query.all()
        paginated_posts = paginator(
            request=request, data=posts, items_per_page=5)

        return jsonify({
            "success": True,
            "total_posts": len(posts),
            "posts": paginated_posts
        })

    @app.route("/posts", methods=["POST"])
    @requires_auth("create:post")
    def create_post(payload):
        """ 
            Endpoint to create a new post
        """
        data = request.get_json()
        title = data.get("title", None)
        content = data.get("content", None)

        if not content or not title or len(str(title)) > 140:
            abort(400)

        try:
            post = Post(title=title, content=content)
            post.insert()
        except Exception:
            db.session.rollback()
            abort(500)

        return jsonify({
            "success": True,
            "created": post.id,
            "post": post.format()
        })

    @app.route("/posts/<int:post_id>", methods=["PATCH"])
    @requires_auth("update:post")
    def update_post(payload, post_id):
        """ 
            Endpoint to update a post
        """
        post = Post.query.get(post_id)

        if not post:
            abort(404)

        data = request.get_json()
        title = data.get("title", None)
        content = data.get("content", None)

        if not title and not content:
            abort(400)

        try:
            if bool(title):
                post.title = title
            if bool(content):
                post.content = content
            post.last_modified = datetime.utcnow()
            post.update()

        except Exception:
            db.session.rollback()
            abort(500)

        return jsonify({
            "success": True,
            "updated": post.id,
            "post": post.format()
        })

    @app.route("/posts/<int:post_id>", methods=["DELETE"])
    @requires_auth("delete:post")
    def delete_post(payload, post_id):
        """ 
            Endpoint to delete a post
        """
        post = Post.query.get(post_id)

        if not post:
            abort(404)

        try:
            post.delete()
        except:
            db.session.rollback()
            abort(500)

        return jsonify({
            "success": True,
            "deleted": post_id
        })

    """ 
       
        Endpoints to manage comments
        
    """

    @app.route("/posts/<int:post_id>/comments")
    def get_comments_for_a_post(post_id):
        """ 
            Endpoint to get the comments under a post
        """
        post = Post.query.get(post_id)
        if not post:
            abort(404)

        paginated_comments = paginator(
            request=request, data=post.comments, items_per_page=10)

        return jsonify({
            "success": True,
            "total_comments": len(post.comments),
            "comments": paginated_comments
        })

    @app.route("/posts/<int:post_id>/comments", methods=["POST"])
    @requires_auth("create:comment")
    def create_comment(payload, post_id):
        """ 
            Endpoint to create a comment under a post
        """
        post = Post.query.get(post_id)
        if not post:
            abort(404)

        data = request.get_json()
        comment_text = data.get("comment", None)
        if not comment_text:
            abort(400)

        try:
            comment = Comment(comment=comment_text, post_id=post_id)
            comment.insert()
        except:
            db.session.rollback()
            abort(500)

        return jsonify({
            "success": True,
            "created": comment.id,
            "comment": comment.format()
        })

    @app.route("/comments/<int:comment_id>", methods=["DELETE"])
    @requires_auth("delete:comment")
    def delete_comment(payload, comment_id):
        """ 
            Endpoint to delete a comment
        """
        comment = Comment.query.get(comment_id)

        if not comment:
            abort(404)

        try:
            comment.delete()
        except:
            db.session.rollback()
            abort(500)

        return jsonify({
            "success": True,
            "deleted": comment_id
        })

    """ 
            
        Handle expected errors - 400, 401, 403, 404, 405, 422, 500, Auth Error
    
    """

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
            "error": 404,
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

    @app.errorhandler(AuthError)
    def auth_error(error):
        return jsonify({
            "success": False,
            "error": error.status_code,
            "message": error.error["message"]
        }), error.status_code

    return app


app = create_app()

if __name__ == "__main__":
    app.run()
