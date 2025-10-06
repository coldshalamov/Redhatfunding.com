# Deployment Playbook

## Option A — Managed Cloud

### Backend
- Deploy the FastAPI service on Render, Fly.io, or Heroku.
- Configure environment variables (`DATABASE_URL`, `API_KEY`, SMTP credentials, `SLACK_WEBHOOK`).
- Use Postgres add-ons for production storage.
- Run `alembic upgrade head` on each deploy.
- Enable automatic deploys from `main` via GitHub integration.

### Frontend
- Deploy the built `/dist` directory to Netlify or Vercel.
- Set `VITE_API_BASE` to your backend URL.
- Configure redirects to serve `index.html` for SPA routes (e.g., `/apply`, `/admin`).

### Observability
- Enable HTTP logs and metrics on the chosen platform.
- Configure uptime monitoring (Pingdom, Better Uptime) against `/api/health`.

## Option B — Static embed with hosted backend

- Host the backend on a managed platform (as above).
- Export the frontend build (`npm run build`) and upload to S3 + CloudFront or Squarespace custom code injection.
- Ensure CORS includes the host domain.
- Provide the `/apply` wizard as an iframe or embedded snippet within Squarespace pages.

## Security Checklist

- Rotate the `API_KEY` routinely and store it in platform secrets.
- Restrict SMTP credentials to transactional email providers (SendGrid/Mailgun).
- Confirm TLS certificates are active for both frontend and backend domains.
- Monitor rate limit metrics for abuse detection.

## Deployment Automation

- GitHub Actions (`.github/workflows/ci.yml`) performs linting, tests, and Docker builds on every push.
- Extend the workflow with deployment steps using provider-specific actions when ready.
