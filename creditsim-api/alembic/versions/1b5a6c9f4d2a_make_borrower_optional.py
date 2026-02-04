"""make borrower fields nullable

Revision ID: 1b5a6c9f4d2a
Revises: 8b6b2a19f2c1
Create Date: 2026-02-03 11:30:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = "1b5a6c9f4d2a"
down_revision: Union[str, Sequence[str], None] = "8b6b2a19f2c1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "simulations",
        "name",
        existing_type=sa.String(length=120),
        nullable=True,
    )
    op.alter_column(
        "simulations",
        "last_name",
        existing_type=sa.String(length=120),
        nullable=True,
    )
    op.alter_column(
        "simulations",
        "document_id",
        existing_type=sa.String(length=64),
        nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "simulations",
        "document_id",
        existing_type=sa.String(length=64),
        nullable=False,
    )
    op.alter_column(
        "simulations",
        "last_name",
        existing_type=sa.String(length=120),
        nullable=False,
    )
    op.alter_column(
        "simulations",
        "name",
        existing_type=sa.String(length=120),
        nullable=False,
    )
