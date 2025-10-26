# RedHat Funding Monorepo

This repository contains the full-stack implementation of the RedHat Funding experience, including a responsive React frontend, FastAPI backend, infrastructure assets, and supporting documentation.

## Requirements

- Node.js 18+
- npm 9+
- Python 3.11+
- Docker (optional, for containerized workflow)

## Quickstart

### 1. Environment setup

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Update the copied files with any secrets (API keys, SMTP credentials, Slack webhooks). The default backend `.env` uses SQLite for local development.

### 2. Install dependencies

```bash
cd frontend && npm install
cd ../backend && pip install -e .[dev]
```

### 3. Run the stack locally

In two terminals:

```bash
# Terminal 1
cd backend
uvicorn app.main:app --reload

# Terminal 2
cd frontend
npm run dev
```

The application will be available at http://localhost:5173 and will proxy API requests to http://localhost:8000.

### 4. Database migrations

```bash
cd backend
alembic upgrade head
```

### 5. Tests & linting

```bash
cd frontend
npm run lint
npm run test

cd ../backend
ruff check app
pytest
```

### 6. Docker Compose workflow

```bash
make up
```

Docker Compose launches Postgres, the FastAPI backend, and the Vite dev server. Use `make down` to stop services.

## Project structure

```
redhat-funding/
├── frontend/        # React + Vite app
├── backend/         # FastAPI service
├── infra/           # Deployment and automation assets
├── docs/            # Documentation suite
└── docker-compose.yml
```

Refer to the remaining documents in this folder for API details, branding guidance, and deployment recommendations.

## SEO structured data

- The frontend FAQ component injects an [FAQPage](https://schema.org/FAQPage) JSON-LD script via `react-helmet-async` during
  client rendering to improve search engine visibility and avoid duplicate script insertion on the server.
