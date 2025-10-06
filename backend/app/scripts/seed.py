from __future__ import annotations

import asyncio

from app.db import AsyncSessionLocal


async def seed() -> None:
    async with AsyncSessionLocal() as session:
        # Add seed data here if required.
        await session.commit()


if __name__ == '__main__':
    asyncio.run(seed())
