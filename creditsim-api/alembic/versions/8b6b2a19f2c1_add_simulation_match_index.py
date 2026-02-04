"""add simulation match index

Revision ID: 8b6b2a19f2c1
Revises: 3c7b2c1b9e0a
Create Date: 2026-02-03 09:40:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "8b6b2a19f2c1"
down_revision: Union[str, Sequence[str], None] = "3c7b2c1b9e0a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE INDEX ix_simulations_match_keys_norm
        ON simulations (upper(trim(folio)), upper(trim(last_name)))
        """
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_simulations_match_keys_norm")
