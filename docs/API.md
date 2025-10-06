# API Reference

## Authentication

Admin endpoints require the `X-API-Key` header. The key value is configured via the `API_KEY` environment variable on the backend.

## Endpoints

### `GET /api/health`

Returns the service status.

```
200 OK
{
  "status": "ok"
}
```

### `POST /api/leads`

Creates a new funding lead.

- Rate limited to 30 requests per 5 minutes per IP.
- Validates a honeypot field (`honeypot`) and submission timing (`submissionStartedAt`).

**Request body**

```
{
  "businessType": "llc",
  "amountRequested": 20000,
  "useOfFunds": "working_capital",
  "startMonth": "02",
  "startYear": "2018",
  "hasBusinessAccount": true,
  "companyName": "RedHat Funding",
  "industry": "Consulting",
  "monthlyRevenue": 45000,
  "zipcode": "33101",
  "firstName": "Avery",
  "lastName": "Taylor",
  "email": "avery@example.com",
  "phone": "3055551234",
  "submissionStartedAt": 1704096755000,
  "honeypot": ""
}
```

**Response**

```
201 Created
{
  "lead_id": 123
}
```

### `GET /api/leads`

Returns a paginated list of leads. Requires `X-API-Key`.

**Query parameters**

- `page` (default `1`)
- `page_size` (default `20`)
- `search` — matches company, email, or contact name
- `amount_min`
- `amount_max`
- `has_account` — filter by business checking account (true/false)

**Response**

```
200 OK
{
  "items": [
    {
      "id": 123,
      "created_at": "2024-01-01T12:00:00",
      "business_type": "llc",
      "amount_requested": 20000,
      "use_of_funds": "working_capital",
      "company_name": "RedHat Funding",
      "first_name": "Avery",
      "last_name": "Taylor",
      "email": "avery@example.com",
      "phone": "3055551234"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}
```

### Error format

Errors follow a structured response:

```
{
  "code": "bad_request",
  "message": "Submission too fast",
  "fieldErrors": {
    "email": "Invalid email"
  }
}
```

## Notifications

- Sales inbox receives a summary email for each lead.
- Applicants receive an autoresponder email.
- A Slack webhook (if configured) receives a notification.
