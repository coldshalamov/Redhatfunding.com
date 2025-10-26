# Copilot Instructions for RedHat Funding Monorepo

## Overview
This monorepo implements a full-stack funding application with a React/Vite frontend and a FastAPI backend. It includes developer docs, infrastructure, and automation for local and CI workflows.

## Architecture
- **frontend/**: React (TypeScript) + Vite + TailwindCSS. Contains all UI, routes, and components. Uses API proxy to backend.
- **backend/**: FastAPI + SQLAlchemy + Alembic. Handles API, DB, notifications (email/Slack), and admin logic.
- **infra/**: Infrastructure references, Docker, and CI/CD config.
- **docs/**: Developer documentation (setup, API, brand, deployment).

## Key Workflows
- **Local dev**: Run `uvicorn app.main:app --reload` in `backend/` and `npm run dev` in `frontend/`. Frontend proxies API to backend.
- **Env setup**: Copy `.env.example` to `.env` in both `frontend/` and `backend/`.
- **Install**: `npm install` (frontend), `pip install -e .[dev]` (backend).
- **Migrations**: `alembic upgrade head` in `backend/`.
- **Testing**: `npm run test` (frontend), pytest (backend).
- **Linting**: `npm run lint` (frontend), `ruff`/`black` (backend).
- **Docker**: Use `docker-compose.yml` for local stack (Postgres, FastAPI, Vite).

## Patterns & Conventions
- **Backend**: All API logic in `app/`. Models in `models.py`, CRUD in `crud.py`, schemas in `schemas.py`. Notifications in `notifications/`.
- **Frontend**: Components in `src/components/`, routes in `src/routes/`, shared logic in `src/lib/`.
- **Testing**: Frontend tests in `src/components/__tests__/` and `src/lib/__tests__/`. Backend tests in `tests/`.
- **Env**: Secrets and config in `.env` files (never commit real secrets).
- **CI**: `.github/workflows/ci.yml` runs lint, test, and Docker build.

## Integration Points
- **API**: Frontend talks to backend via REST endpoints (see `backend/app/main.py`).
- **DB**: SQLAlchemy models, Alembic migrations.
- **Notifications**: Email/Slack via `backend/app/notifications/`.
- **Docker**: Compose file for full stack, individual Dockerfiles for frontend/backend.

## References
- See `docs/README.md` for setup, quickstart, and troubleshooting.
- See `backend/README.md` and `frontend/` for service-specific details.
- See `infra/README.md` for infrastructure and CI/CD notes.

---

**Example: Adding a new API route**
1. Define schema in `backend/app/schemas.py`.
2. Add DB logic in `backend/app/crud.py`.
3. Add route in `backend/app/main.py`.
4. Update frontend API calls in `src/lib/api.ts`.
5. Add/adjust tests in both frontend and backend test folders.

---

For more, see the `docs/` directory and comments in key files.