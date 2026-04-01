"""rename_legacy_tables

Revision ID: ac203c16c8e8
Revises: 9708b3092b00
Create Date: 2026-04-01 10:07:35.786920

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'ac203c16c8e8'
down_revision: Union[str, Sequence[str], None] = '9708b3092b00'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.rename_table("centerdirector", "centerdirector_deprecated_20260401")
    op.rename_table("teacher", "teacher_deprecated_20260401")
    op.rename_table("customer", "customer_deprecated_20260401")


def downgrade() -> None:
    op.rename_table("centerdirector_deprecated_20260401", "centerdirector")
    op.rename_table("teacher_deprecated_20260401", "teacher")
    op.rename_table("customer_deprecated_20260401", "customer")
