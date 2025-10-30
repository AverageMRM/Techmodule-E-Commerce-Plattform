# Tech‑Stack

Überblick der eingesetzten Technologien und Versionen.

- Frontend
  - Angular 20 (Standalone Components)
  - TypeScript, RxJS
  - Test: Karma/Jasmine, Playwright (e2e, geplant/grundlegend vorhanden)
- Backend
  - Java 21
  - Spring Boot 3 (Web, Validation, Security)
  - Springdoc OpenAPI für Swagger UI
  - Test: JUnit 5, Spring Test, Mockito
- Datenbank
  - PostgreSQL 16 (Docker)
  - Flyway Migrationen vorgesehen
- Orchestrierung/Bau
  - Docker Compose
  - Maven (Backend)
  - Node.js/NPM (Frontend)

Lokale URLs
- Web: http://localhost:4200
- API: http://localhost:8080
- DB: localhost:5432

Start (Windows)
- .\start.ps1 oder .\start.cmd im Repo‑Root
- Alternativ: docker compose up --build
