from datetime import datetime, timedelta, timezone

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db import Base, get_session
from app.main import app


@pytest_asyncio.fixture
async def test_session():
    engine = create_async_engine('sqlite+aiosqlite:///:memory:', future=True)
    async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async def override_get_session():
        async with async_session() as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session
    yield
    app.dependency_overrides.clear()
    await engine.dispose()


@pytest.mark.asyncio
async def test_create_and_list_lead(monkeypatch, test_session):
    async def noop(*args, **kwargs):
        return None

    monkeypatch.setattr('app.main.EmailNotifier.send_lead_notification', noop)
    monkeypatch.setattr('app.main.EmailNotifier.send_autoresponder', noop)
    monkeypatch.setattr('app.main.SlackNotifier.send', noop)

    payload = {
        'businessType': 'llc',
        'amountRequested': 15000,
        'useOfFunds': 'working_capital',
        'startMonth': '01',
        'startYear': '2020',
        'hasBusinessAccount': True,
        'companyName': 'Acme Co',
        'industry': 'Manufacturing',
        'monthlyRevenue': 50000,
        'zipcode': '12345',
        'firstName': 'Jamie',
        'lastName': 'Doe',
        'email': 'jamie@example.com',
        'phone': '3055550000',
        'submissionStartedAt': int((datetime.now(timezone.utc) - timedelta(seconds=3)).timestamp() * 1000),
    }

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as client:
        response = await client.post('/api/leads', json=payload)
        assert response.status_code == 201
        data = response.json()
        assert 'lead_id' in data

        list_response = await client.get('/api/leads', headers={'X-API-Key': 'change-me'})
        assert list_response.status_code == 200
        body = list_response.json()
        assert body['total'] >= 1
        assert any(lead['email'] == 'jamie@example.com' for lead in body['items'])
