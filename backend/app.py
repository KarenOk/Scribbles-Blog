from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from models import setup_db, db, Post, Comment


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

    @app.route("/")
    def index():

        post = Post(title="The 5 Step Rule to financial freedom", content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet. Elementum eu facilisis sed odio morbi quis commodo odio aenean. Sed viverra ipsum nunc aliquet. Vulputate mi sit amet mauris commodo quis imperdiet massa. Sit amet mauris commodo quis imperdiet massa tincidunt nunc. Quis viverra nibh cras pulvinar mattis nunc sed. Suspendisse interdum consectetur libero id faucibus nisl. Metus vulputate eu scelerisque felis imperdiet. In cursus turpis massa tincidunt dui ut ornare lectus.")
        post.insert()

        return jsonify(post.format())
        # return "Welcome to Scribbles API! We're lucky to have you."

    """ 
       
        Endpoints to manage posts
        
    """

    @app.route("/posts")
    def get_posts():
        posts = Post.query.all()
        paginated_posts = paginator(
            request=request, data=posts, items_per_page=5)

        return jsonify({
            "success": True,
            "total_posts": len(posts),
            "posts": paginated_posts
        })

    @app.route("/posts", methods=["POST"])
    def create_post():
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
    def update_post(post_id):
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
    def delete_post(post_id):
        post = Post.query.get(post_id)

        if not post:
            abort(404)

        try:
            post_id = post.id
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
    def create_comment(post_id):
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

    return app


app = create_app()

if __name__ == "__main__":
    app.run()
