"""add avatar and portfolio fields

Revision ID: 0001_add_avatar_portfolio
Revises:
Create Date: 2026-02-07
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001_add_avatar_portfolio"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("avatar_url", sa.String(), nullable=True))
    op.add_column("users", sa.Column("portfolio_urls", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"))


def downgrade():
    op.drop_column("users", "portfolio_urls")
    op.drop_column("users", "avatar_url")
