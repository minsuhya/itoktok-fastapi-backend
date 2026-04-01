"""baseline

Revision ID: 9708b3092b00
Revises:
Create Date: 2026-03-31 23:17:02.267008

"""
from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = '9708b3092b00'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass  # baseline: DB는 이미 존재함


def downgrade() -> None:
    pass  # baseline
