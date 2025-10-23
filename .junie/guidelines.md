# Project Guidelines

Project overview
- This repository is a scaffold for a production‑ready E‑Commerce platform.
- Frontend: Angular 20 (standalone components). Backend: Spring Boot 3 (Java 21). DB: PostgreSQL 16. Orchestration: Docker Compose.
- Canonical local dev entry point: compose.yml in repo root. Do not use e-commerce-backend\compose.yaml (legacy).
- Typical local URLs: Web http://localhost:4200, API http://localhost:8080, Postgres localhost:5432.

Repository structure (top level)
- README.md — Detailed documentation (Quick Start, services, config).
- compose.yml — Docker Compose for local dev (postgres, api, web).
- start.ps1 — Windows helper to prepare .env and start services.
- e-commerce-backend — Spring Boot service (Java 21, Maven, Flyway planned).
- e-commerce-frontend — Angular 20 app (dev server for local; prod build via Docker/Angular build).
- docs — Additional documentation (if present).

How to run locally (Windows, recommended)
- Ensure Docker Desktop is running.
- From repo root in PowerShell: .\start.ps1
  - Creates .env with sensible defaults if missing.
  - Builds/pulls images and starts services defined in compose.yml.
- Manual alternative: docker compose up --build

Environment variables (.env at repo root)
- POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD
- JWT_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (placeholders for dev)
- Optional OAuth keys (e.g., GOOGLE_CLIENT_ID/SECRET) if used

Testing guidance for Junie
- Preferred: run only the relevant tests for changed components.
- Backend (Maven): use Surefire tests. Typical commands (PowerShell examples):
  - mvn -q -DskipITs test
  - mvn -q -Dtest=ClassNameTest test (to target one test class)
- Frontend (Angular):
  - npm ci
  - npm test (unit tests)
  - npx playwright test (if e2e present)
- When working inside the JetBrains Junie environment, prefer the provided run_test tool to execute tests where applicable.

Build guidance
- Compose builds images for api and web when using docker compose up --build.
- Backend manual build: mvn -q -DskipTests package (Java 21 required).
- Frontend manual build: npm run build (dev/prod environments configured via Angular environment files).
- Production idea: build Angular, serve via Nginx; use /api → api:8080 reverse proxy.

Coding style and conventions
- Java: Follow standard Spring Boot layering (controller → service → repository), Java 21 features allowed. Keep APIs under /api and expose /api/health.
- Angular: Follow Angular style guide; prefer standalone components; use environment.apiBaseUrl for HTTP calls.
- Lint/format: Use Prettier/ESLint defaults for TS; follow standard conventions for Java (Google style or Spring defaults).

Troubleshooting (local)
- Check Docker Desktop status and that ports 5432/8080/4200 are free.
- API health: http://localhost:8080/api/health
- Logs: docker compose logs -f api | web

Expectations for Junie
- Use Windows-style paths in documentation and PowerShell-friendly commands.
- Make minimal, focused changes per issue; update this guidelines file only when project-level behaviors change.
- If in doubt about tests or build, consult README.md which is the source of truth alongside compose.yml.
