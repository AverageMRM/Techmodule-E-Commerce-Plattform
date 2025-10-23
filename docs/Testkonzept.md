# Testing Guide

This document describes how we test the Techmodule E‑Commerce Plattform scaffold across backend and frontend. It focuses on local developer workflow on Windows and aligns with our repository conventions.

- Backend: Spring Boot 3 (Java 21), JUnit 5, Spring Test, Mockito
- Frontend: Angular 20, Karma/Jasmine unit tests; basic Playwright e2e planned
- Orchestration: Docker Compose for local dev (not required for unit tests)

## Test Strategy

We aim for a pragmatic testing pyramid:
- Unit/Web-layer tests first: fast, isolated, deterministic
- Service/Repository tests second: targeted persistence tests with H2 or Testcontainers (planned)
- End-to-End (e2e) UI tests: a small, valuable path coverage using Playwright (basic suite scaffolded)

Current coverage (baseline):
- Backend web-layer tests for Health, Product, Cart, and Checkout controllers using @WebMvcTest and mocked dependencies.
- Frontend unit tests for CartService, HomeComponent, CheckoutComponent, Login, Register.
- Basic Playwright e2e scaffold present; full end-to-end coverage is planned.

Stripe and any external integrations are mocked in tests.

## How to run tests (Windows)

Backend (Maven):
- From repository root or module directory:
  - cd e-commerce-backend
  - mvn -q test
- Run a specific test class (example):
  - mvn -q -Dtest=org.ch.ecommerce.school.ecommercebackend.controller.HealthControllerTest test
- Tips:
  - First run may download dependencies. To prefetch: mvn -U dependency:go-offline
  - If behind a proxy, configure %USERPROFILE%\.m2\settings.xml

Frontend (Angular):
- From repository root or module directory:
  - cd e-commerce-frontend
  - npm ci
  - npm test

Frontend e2e (Playwright):
- Prerequisites: Node.js installed; browsers installed for Playwright (npx playwright install)
- Run:
  - cd e-commerce-frontend
  - npx playwright test

Note: For unit tests, Docker services are not required. e2e may require the dev servers running via docker compose up --build or ng serve + backend.

## Scope and conventions

Backend:
- Use @WebMvcTest for controller tests; mock collaborating services/repositories.
- Prefer descriptive test names. Given/When/Then structure in code or comments.
- Validate both happy paths and error paths (validation errors, 404, etc.).
- Avoid real network/DB calls in unit/web-layer tests.
- For persistence tests (planned): prefer Testcontainers PostgreSQL or H2 with Flyway, and clear migrations per test suite.

Frontend:
- Unit test components and services with Jasmine/Karma.
- Mock HttpClient with HttpTestingController or mock ApiService.
- Avoid actual Stripe initialization in unit tests; assert UI state instead.
- Keep tests deterministic; avoid relying on timers or external state.

Test data and fixtures:
- Use builders/factories for DTOs/entities to keep tests readable.
- Prefer inline test data for small cases; use helper functions for repeated structures.

## CI considerations (planned)

- Pipeline runs Maven tests for backend and npm test for frontend on every PR.
- Optional e2e job via Playwright on demand or nightly.
- Cache Maven and npm dependencies to speed up builds.

## Troubleshooting

Backend Maven issues:
- Tests not found: ensure JUnit 5 is used and correct FQN specified with -Dtest.
- Dependency resolution failures: ensure internet access or run mvn -U dependency:go-offline. If needed, clear cache for the module in %USERPROFILE%\.m2\repository.

Frontend issues:
- Karma cannot start Chrome: install Chrome or use Chromium via Playwright; ensure npx playwright install ran if your config depends on it.
- TypeScript path or module errors: run npm ci to get exact lockfile deps.

General:
- Ports in use when running e2e: ensure 4200/8080/5432 are free or stop other services. Use docker compose down to free ports.

## References

- API health: http://localhost:8080/api/health
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- Angular dev server: http://localhost:4200
- Compose entry point: compose.yml at repo root