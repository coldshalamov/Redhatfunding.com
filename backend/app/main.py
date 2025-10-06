from __future__ import annotations

import asyncio
import hashlib
import uuid
import logging
from datetime import datetime, timezone

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from .config import get_settings
from .crud import create_lead, list_leads
from .db import get_session
from .models import Lead
from .notifications import EmailNotifier, SlackNotifier
from .rate_limit import limiter
from .schemas import LeadCreate, LeadListResponse
from .security import get_api_key

logger = logging.getLogger('redhat_funding')
logging.basicConfig(level=logging.INFO)

settings = get_settings()

app = FastAPI(title='RedHat Funding API', version='0.1.0')
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

if settings.allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.allowed_origins],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )


@app.middleware('http')
async def log_requests(request: Request, call_next):
    logger.info('%s %s', request.method, request.url.path)
    response = await call_next(request)
    response.headers['X-Request-Id'] = uuid.uuid4().hex
    return response


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    detail = exc.detail or {}
    if isinstance(detail, dict):
        payload = detail
    else:
        payload = {'code': 'error', 'message': str(detail)}
    if 'code' not in payload:
        payload['code'] = 'error'
    if 'message' not in payload:
        payload['message'] = 'An error occurred'
    return JSONResponse(status_code=exc.status_code, content=payload)


@app.get('/api/health')
async def health() -> dict[str, str]:
    return {'status': 'ok'}


@app.post('/api/leads', status_code=status.HTTP_201_CREATED)
async def create_lead_endpoint(
    payload: LeadCreate,
    request: Request,
    session=Depends(get_session),
):
    if payload.honeypot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={'code': 'bad_request', 'message': 'Invalid submission'},
        )

    if payload.submissionStartedAt:
        elapsed = int(datetime.now(timezone.utc).timestamp() * 1000) - payload.submissionStartedAt
        if elapsed < 2500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={'code': 'bad_request', 'message': 'Submission too fast'},
            )

    start_year = int(payload.startYear)
    start_month = int(payload.startMonth)
    today = datetime.now(timezone.utc)
    time_in_business_months = max((today.year - start_year) * 12 + (today.month - start_month), 0)

    review_source = f"{payload.email.lower()}-{payload.amountRequested}-{payload.startYear}{payload.startMonth}"
    review_hash = hashlib.sha256(review_source.encode()).hexdigest()

    lead_data = {
        'business_type': payload.businessType,
        'amount_requested': payload.amountRequested,
        'use_of_funds': payload.useOfFunds,
        'start_month': payload.startMonth.zfill(2),
        'start_year': payload.startYear,
        'has_business_account': payload.hasBusinessAccount,
        'company_name': payload.companyName,
        'industry': payload.industry,
        'monthly_revenue': payload.monthlyRevenue,
        'zipcode': payload.zipcode,
        'first_name': payload.firstName,
        'last_name': payload.lastName,
        'email': payload.email.lower(),
        'phone': payload.phone,
        'source': payload.source or 'apply_form',
        'user_agent': payload.userAgent or request.headers.get('user-agent'),
        'ip': request.client.host if request.client else None,
        'utm_campaign': payload.utmCampaign,
        'utm_source': payload.utmSource,
        'utm_medium': payload.utmMedium,
        'time_in_business_months': time_in_business_months,
        'review_hash': review_hash,
    }

    lead: Lead = await create_lead(session, lead_data)

    summary = (
        f"New lead #{lead.id}\n"
        f"Company: {lead.company_name}\n"
        f"Contact: {lead.first_name} {lead.last_name} — {lead.email}\n"
        f"Amount requested: ${lead.amount_requested:,}\n"
        f"Use: {lead.use_of_funds}\n"
    )

    async def dispatch_notifications() -> None:
        emailer = EmailNotifier()
        slack = SlackNotifier()
        await asyncio.gather(
            emailer.send_lead_notification(summary),
            emailer.send_autoresponder(
                lead.email,
                'Thanks for applying to RedHat Funding! A funding specialist will contact you shortly.',
            ),
            slack.send(f":rotating_light: New lead #{lead.id} — {lead.company_name} requesting ${lead.amount_requested:,}"),
        )

    asyncio.create_task(dispatch_notifications())

    return {'lead_id': lead.id}


@app.get('/api/leads', response_model=LeadListResponse)
async def list_leads_endpoint(
    page: int = 1,
    page_size: int = 20,
    search: str | None = None,
    amount_min: int | None = None,
    amount_max: int | None = None,
    has_account: bool | None = None,
    session=Depends(get_session),
    _: str = Depends(get_api_key),
):
    leads, total = await list_leads(
        session,
        page=page,
        page_size=page_size,
        search=search,
        amount_min=amount_min,
        amount_max=amount_max,
        has_account=has_account,
    )
    return LeadListResponse(
        items=leads,
        total=total,
        page=page,
        page_size=page_size,
    )
