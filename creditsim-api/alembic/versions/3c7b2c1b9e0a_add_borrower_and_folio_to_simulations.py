"""add borrower and folio to simulations

Revision ID: 3c7b2c1b9e0a
Revises: ff0224340046
Create Date: 2026-02-03 09:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3c7b2c1b9e0a"
down_revision: Union[str, Sequence[str], None] = "ff0224340046"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("simulations", sa.Column("folio", sa.String(length=12), nullable=False))
    op.add_column("simulations", sa.Column("name", sa.String(length=120), nullable=False))
    op.add_column("simulations", sa.Column("last_name", sa.String(length=120), nullable=False))
    op.add_column("simulations", sa.Column("document_id", sa.String(length=64), nullable=False))
    op.create_unique_constraint("uq_simulations_folio", "simulations", ["folio"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("uq_simulations_folio", "simulations", type_="unique")
    op.drop_column("simulations", "document_id")
    op.drop_column("simulations", "last_name")
    op.drop_column("simulations", "name")
    op.drop_column("simulations", "folio")
