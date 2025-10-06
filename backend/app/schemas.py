from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field
from pydantic.config import ConfigDict


class LeadCreate(BaseModel):
    businessType: str = Field(..., alias='businessType')
    amountRequested: int = Field(..., ge=1000)
    useOfFunds: str = Field(..., alias='useOfFunds')
    startMonth: str = Field(..., alias='startMonth', pattern=r'^(0?[1-9]|1[0-2])$')
    startYear: str = Field(..., alias='startYear', pattern=r'^\d{4}$')
    hasBusinessAccount: bool = Field(..., alias='hasBusinessAccount')
    companyName: str = Field(..., alias='companyName', min_length=2)
    industry: str
    monthlyRevenue: int = Field(..., alias='monthlyRevenue', ge=0)
    zipcode: str = Field(..., pattern=r'^\d{5}$')
    firstName: str = Field(..., alias='firstName', min_length=1)
    lastName: str = Field(..., alias='lastName', min_length=1)
    email: EmailStr
    phone: str = Field(..., pattern=r'^\d{10}$')
    honeypot: Optional[str] = None
    submissionStartedAt: Optional[int] = Field(None, alias='submissionStartedAt')

    source: Optional[str] = None
    userAgent: Optional[str] = Field(None, alias='userAgent')
    utmCampaign: Optional[str] = Field(None, alias='utmCampaign')
    utmSource: Optional[str] = Field(None, alias='utmSource')
    utmMedium: Optional[str] = Field(None, alias='utmMedium')

    model_config = {
        'populate_by_name': True,
        'json_schema_extra': {
            'example': {
                'businessType': 'llc',
                'amountRequested': 20000,
                'useOfFunds': 'working_capital',
                'startMonth': '02',
                'startYear': '2018',
                'hasBusinessAccount': True,
                'companyName': 'RedHat Funding',
                'industry': 'Consulting',
                'monthlyRevenue': 45000,
                'zipcode': '33101',
                'firstName': 'Avery',
                'lastName': 'Taylor',
                'email': 'avery@example.com',
                'phone': '3055551234',
            }
        },
    }


class LeadResponse(BaseModel):
    id: int
    created_at: datetime
    business_type: str
    amount_requested: int
    use_of_funds: str
    company_name: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str

    model_config = ConfigDict(from_attributes=True)


class LeadListResponse(BaseModel):
    items: list[LeadResponse]
    total: int
    page: int
    page_size: int
