# Infrastructure

- `../docker-compose.yml` — local development stack (Postgres, FastAPI, Vite).
- `../frontend/Dockerfile` — builds the React application and serves it via Nginx.
- `../backend/Dockerfile` — packages the FastAPI application with Uvicorn.
- `.github/workflows/ci.yml` — GitHub Actions workflow for linting, testing, and Docker build validation.

Environment templates live in `frontend/.env.example` and `backend/.env.example`.
