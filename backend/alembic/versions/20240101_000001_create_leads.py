from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision = '20240101_000001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'leads',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('business_type', sa.String(length=50), nullable=False),
        sa.Column('amount_requested', sa.Integer(), nullable=False),
        sa.Column('use_of_funds', sa.String(length=50), nullable=False),
        sa.Column('start_month', sa.String(length=2), nullable=False),
        sa.Column('start_year', sa.String(length=4), nullable=False),
        sa.Column('has_business_account', sa.Boolean(), nullable=False),
        sa.Column('company_name', sa.String(length=255), nullable=False),
        sa.Column('industry', sa.String(length=255), nullable=False),
        sa.Column('monthly_revenue', sa.Integer(), nullable=False),
        sa.Column('zipcode', sa.String(length=10), nullable=False),
        sa.Column('first_name', sa.String(length=120), nullable=False),
        sa.Column('last_name', sa.String(length=120), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=False),
        sa.Column('source', sa.String(length=120), nullable=True),
        sa.Column('user_agent', sa.Text(), nullable=True),
        sa.Column('ip', sa.String(length=64), nullable=True),
        sa.Column('utm_campaign', sa.String(length=120), nullable=True),
        sa.Column('utm_source', sa.String(length=120), nullable=True),
        sa.Column('utm_medium', sa.String(length=120), nullable=True),
        sa.Column('time_in_business_months', sa.Integer(), nullable=False),
        sa.Column('review_hash', sa.String(length=64), nullable=True),
    )
    op.create_index('ix_leads_created_amount', 'leads', ['created_at', 'amount_requested'])
    op.create_index(op.f('ix_leads_email'), 'leads', ['email'])


def downgrade() -> None:
    op.drop_index(op.f('ix_leads_email'), table_name='leads')
    op.drop_index('ix_leads_created_amount', table_name='leads')
    op.drop_table('leads')
