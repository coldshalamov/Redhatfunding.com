from __future__ import annotations

from typing import Any

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Lead


async def create_lead(session: AsyncSession, data: dict[str, Any]) -> Lead:
    lead = Lead(**data)
    session.add(lead)
    await session.commit()
    await session.refresh(lead)
    return lead


async def list_leads(
    session: AsyncSession,
    *,
    page: int = 1,
    page_size: int = 20,
    search: str | None = None,
    amount_min: int | None = None,
    amount_max: int | None = None,
    has_account: bool | None = None,
) -> tuple[list[Lead], int]:
    query: Select[tuple[Lead]] = select(Lead)
    if search:
        like_query = f"%{search.lower()}%"
        full_name = func.concat(Lead.first_name, ' ', Lead.last_name)
        query = query.filter(
            func.lower(Lead.company_name).like(like_query)
            | func.lower(full_name).like(like_query)
            | func.lower(Lead.email).like(like_query)
        )
    if amount_min is not None:
        query = query.filter(Lead.amount_requested >= amount_min)
    if amount_max is not None:
        query = query.filter(Lead.amount_requested <= amount_max)
    if has_account is not None:
        query = query.filter(Lead.has_business_account.is_(has_account))

    total = await session.scalar(select(func.count()).select_from(query.subquery()))
    query = query.order_by(Lead.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await session.scalars(query)
    return result.all(), total or 0
