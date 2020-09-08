import os
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

database_path = os.environ["DATABASE_URL"]
db = SQLAlchemy()


def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app=app)


def db_drop_and_create_all():
    '''
        Drops the database tables and starts afresh/
        Can be used to initialize a clean database
    '''
    db.drop_all()
    db.create_all()


class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.String, nullable=False)
    date_created = db.Column(
        db.DateTime, default=datetime.utcnow,  nullable=False)
    last_modified = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)
    comments = db.relationship(
        "Comment",  backref="post", lazy=False, cascade="all, delete-orphan")

    def __init__(self, title, content):
        self.title = title
        self.content = content

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "date_created": self.date_created.strftime("%d/%m/%Y %H:%M:%S"),
            "last_modified": self.last_modified.strftime("%d/%m/%Y %H:%M:%S"),
            "comments": [comment.format() for comment in self.comments]
        }


class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String(140), nullable=False)
    full_name = db.Column(db.String(50), default="Anonymous", nullable=False)
    date_created = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=True)

    def __init__(self, comment, full_name, post_id):
        self.comment = comment
        self.post_id = post_id
        self.full_name = full_name

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            "id": self.id,
            "comment": self.comment,
            "full_name": self.full_name,
            "date_created": self.date_created.strftime("%d/%m/%Y %H:%M:%S"),
            "post_id": self.post_id,
        }
