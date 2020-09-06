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
        "Comment",  backref="post", cascade="all, delete-orphan")

    def __init__(self, title, content, date_created=datetime.utcnow(), last_modified=datetime.utcnow()):
        self.title = title
        self.content = content
        self.date_created = date_created
        self.last_modified = last_modified

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
            "comments": self.comments
        }


class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String(140), nullable=False)
    date_created = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=True)

    def __init__(self, comment, post_id):
        self.comment = comment
        self.post_id = post_id

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
            "date_created": self.date_created.strftime("%d/%m/%Y %H:%M:%S"),
            "post_id": self.post_id,
        }
