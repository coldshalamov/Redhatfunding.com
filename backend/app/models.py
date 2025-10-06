from __future__ import annotations

from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, Integer, String, Text, Index
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class Lead(Base):
    __tablename__ = 'leads'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    business_type: Mapped[str] = mapped_column(String(50), nullable=False)
    amount_requested: Mapped[int] = mapped_column(Integer, nullable=False)
    use_of_funds: Mapped[str] = mapped_column(String(50), nullable=False)
    start_month: Mapped[str] = mapped_column(String(2), nullable=False)
    start_year: Mapped[str] = mapped_column(String(4), nullable=False)
    has_business_account: Mapped[bool] = mapped_column(Boolean, nullable=False)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    industry: Mapped[str] = mapped_column(String(255), nullable=False)
    monthly_revenue: Mapped[int] = mapped_column(Integer, nullable=False)
    zipcode: Mapped[str] = mapped_column(String(10), nullable=False)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    source: Mapped[str | None] = mapped_column(String(120))
    user_agent: Mapped[str | None] = mapped_column(Text())
    ip: Mapped[str | None] = mapped_column(String(64))
    utm_campaign: Mapped[str | None] = mapped_column(String(120))
    utm_source: Mapped[str | None] = mapped_column(String(120))
    utm_medium: Mapped[str | None] = mapped_column(String(120))
    time_in_business_months: Mapped[int] = mapped_column(Integer, nullable=False)
    review_hash: Mapped[str | None] = mapped_column(String(64))

    __table_args__ = (
        Index('ix_leads_created_amount', 'created_at', 'amount_requested'),
    )
