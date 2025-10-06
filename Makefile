.PHONY: dev up down seed frontend backend

dev:
cd frontend && npm install && npm run dev

up:
docker-compose up --build

down:
docker-compose down

seed:
cd backend && python -m app.scripts.seed

frontend:
cd frontend && npm install && npm run build

backend:
cd backend && pip install -e .[dev]
