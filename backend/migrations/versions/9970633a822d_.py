"""empty message

Revision ID: 9970633a822d
Revises: dfdd4981b6cb
Create Date: 2020-09-08 00:38:28.689196

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9970633a822d'
down_revision = 'dfdd4981b6cb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('comments', sa.Column(
        'image_url', sa.String(), nullable=True))
    op.add_column('comments', sa.Column(
        'is_author', sa.Boolean(), nullable=False))
    op.add_column('posts', sa.Column(
        'author', sa.String(length=50), nullable=True))
    op.add_column('posts', sa.Column(
        'image_url', sa.String(), nullable=True))

    op.execute("UPDATE posts SET author='Anonymous' WHERE author IS NULL")
    op.alter_column("posts", "author", nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('posts', 'image_url')
    op.drop_column('posts', 'author')
    op.drop_column('comments', 'is_author')
    op.drop_column('comments', 'image_url')
    # ### end Alembic commands ###