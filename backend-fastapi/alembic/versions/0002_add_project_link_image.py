"""add link and image_url to projects

Revision ID: 0002_add_project_link_image
Revises: 0001_add_avatar_portfolio
Create Date: 2026-02-15
"""
from alembic import op
import sqlalchemy as sa

revision = "0002_add_project_link_image"
down_revision = "0001_add_avatar_portfolio"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("projects", sa.Column("link", sa.String(), nullable=True))
    op.add_column("projects", sa.Column("image_url", sa.String(), nullable=True))


def downgrade():
    op.drop_column("projects", "image_url")
    op.drop_column("projects", "link")
