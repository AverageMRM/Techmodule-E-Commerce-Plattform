# Techmodule E-Commerce Plattform (Scaffold)

Status (2025-09-04 21:20):
- Implemented baseline backend endpoints: /api/health, /api/products, /api/cart, /api/checkout. ✓
- Added focused web-layer/unit tests for Health, Product, Cart, and Checkout controllers (mocked repos/services). ✓
- Docker Compose runs postgres, api, and web for local dev. ✓
- Frontend Angular routes/pages scaffolded; environment configured to call backend. ✓
- Testing status: Backend controller tests and frontend unit tests exist; basic Playwright e2e suite added; full integration tests still pending. ✓ (basics)
- Remaining: real domain entities/migrations, auth hardening, full Stripe flows, admin UI, e2e tests, CI.

This repository contains a scaffold for a production-ready E‑Commerce platform (Shopify‑like) built with:
- Frontend: Angular 20 (Standalone Components), Tailwind (planned), optional SSR
- Backend: Spring Boot 3 (Java 21)
- Database: PostgreSQL 16 with Flyway (migrations to be added)
- Docker Compose for local dev (services: postgres, api, web)

Note: This is a base setup. Domain entities, APIs, Stripe integration, admin UI, tests, and full i18n/SEO will be implemented incrementally.

## Quick Start (Docker Compose)

1. Create .env at repo root (already provided as example):

```
POSTGRES_DB=shopdb
POSTGRES_USER=shop
POSTGRES_PASSWORD=secret
JWT_SECRET=change-me-dev-secret
STRIPE_SECRET_KEY=sk_test_1234567890
STRIPE_WEBHOOK_SECRET=whsec_test_1234567890
```

2. Build and start all services:

```
docker compose up --build
```

- Web (Angular dev server): http://localhost:4200
- API (Spring Boot): http://localhost:8080
- Postgres: localhost:5432

The Angular app (dev) calls the API at http://localhost:8080/api by default (see src/environments/environment.ts). Adjust as needed.

## Schnellstart (Windows, Deutsch)

Voraussetzungen:
- Docker Desktop ist installiert und läuft
- PowerShell (Windows)

Option A – Einfach (empfohlen):
1. Im Repository-Root PowerShell oder Explorer öffnen
2. Starten:
   - Empfohlen: .\start.cmd (umgeht PowerShell ExecutionPolicy)
   - Alternativ in PowerShell: powershell -NoProfile -ExecutionPolicy Bypass -File .\start.ps1
   - Oder direkt (falls ExecutionPolicy bereits erlaubt): .\start.ps1
   - Erstellt bei Bedarf automatisch eine .env mit Standardwerten
   - Führt docker compose pull/build aus und startet alle Services
   - Wartet kurz auf die API-Gesundheit und zeigt nützliche Befehle/Links an
3. Öffne:
   - Web (Angular): http://localhost:4200
   - API (Spring Boot): http://localhost:8080
   - Datenbank (Postgres): localhost:5432

Option B – Manuell:
1. Prüfe/erstelle .env im Repo-Root (Beispielwerte siehe unten)
2. Starte alles: docker compose up --build
3. Öffne die oben genannten URLs

Stoppen/Neu starten:
- Stoppen: docker compose down
- Neu starten im Hintergrund: docker compose up -d
- Komplett neu (inkl. Volumes leeren): .\start.ps1 -Recreate

Start aus IntelliJ IDEA:
- Über die Run-Konfiguration "Start Docker (start.ps1)" oben rechts kannst du das Skript direkt starten. Diese Konfiguration verwendet PowerShell und führt .\start.ps1 im Projekt-Root aus.

Troubleshooting:
- Läuft Docker Desktop? Sind die Ports 5432/8080/4200 frei?
- Prüfe API-Health: http://localhost:8080/api/health
- Logs ansehen:
  - API: docker compose logs -f api
  - Web: docker compose logs -f web
- Verwende ausschliesslich die Compose-Datei im Repo-Root (compose.yml). Die Datei e-commerce-backend/compose.yaml ist veraltet und sollte nicht benutzt werden.
- PowerShell-Fehler beim Starten von start.ps1: "Die Datei ...start.ps1 kann nicht geladen werden, da die Ausführung von Skripts auf diesem System deaktiviert ist."
  - Lösung A (empfohlen): .\start.cmd verwenden (umgeht ExecutionPolicy)
  - Lösung B (einmalig für aktuellen Benutzer erlauben): Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  - Lösung C (nur für diesen Aufruf): powershell -NoProfile -ExecutionPolicy Bypass -File .\start.ps1
  - Falls Datei blockiert ist (Internet-Download): Unblock-File .\start.ps1

## Services (compose.yml)
- postgres: PostgreSQL 16, credentials from .env, data persisted in named volume. Healthcheck via pg_isready.
- api: Spring Boot backend (Java 21), reads DB and JWT settings from env. Waits for postgres to be healthy and exposes /api/health (used by healthcheck).
- web: Angular dev target (ng serve) for local development. Waits for api to be healthy before starting.

For production, build the Angular app and serve via Nginx (Dockerfile target `prod`). You can create a production compose override that uses the `prod` image and an optional reverse proxy for `/api` → `api:8080`.

## Backend Configuration (Spring Boot)
- application.yml reads:
  - spring.datasource.url: jdbc:postgresql://postgres:5432/${POSTGRES_DB}
  - spring.datasource.username/password from env
  - flyway enabled
  - app.security.jwtSecret from env

Add your controllers/services/repos/entities under `e-commerce-backend/src/main/java` following layered architecture.

## Frontend Configuration (Angular)
- Environment files:
  - `src/environments/environment.ts` (development): `apiBaseUrl: 'http://localhost:8080/api'`, `locale: 'de-CH'`, `currency: 'CHF'`
  - `src/environments/environment.prod.ts` (production): `apiBaseUrl: '/api'`
- Update your services to import `environment` and prefix API calls with `environment.apiBaseUrl`.

## Stripe Webhook (Dev placeholder)
- Expose a public URL (e.g., using Stripe CLI) and configure `STRIPE_WEBHOOK_SECRET`.
- Implement `/api/webhooks/stripe` in backend and add signature verification.

## Notes
- The legacy `e-commerce-backend/compose.yaml` is superseded by root `compose.yml`.
- Java 21 and Angular 20 are used. Adjust as needed.
- This scaffold does not include database migrations or entities yet. Add Flyway scripts under `e-commerce-backend/src/main/resources/db/migration` (e.g., `V1__init.sql`).

## Next Steps
- Implement domain model (Product, Variant, Cart, Order, etc.) with JPA and Flyway.
- Add JWT security (access + refresh) and CORS for Angular origin.
- Build REST endpoints and OpenAPI 3 spec.
- Integrate Stripe (Payment Intents + Webhooks).
- Admin dashboard, i18n de-CH, CHF pricing, SEO (JSON-LD, sitemap), A11y, and CI.


## New Backend Endpoints (Scaffold)

The backend now exposes minimal endpoints to verify the stack and start iterating on the domain:

- GET /api/health → Returns a simple JSON status.
- GET /api/products → Lists products (empty until you insert data).
- GET /api/products/{slug} → Returns a product by slug (404 if not found).

Security is currently permissive for scaffolding (see SecurityConfig). CORS allows Angular dev origin (http://localhost:4200). This will be hardened when auth is implemented.

### Database Migration (Flyway)
- An initial Flyway migration V1__init.sql creates a minimal product table.
- Flyway runs automatically on application startup (spring.flyway.enabled=true).

### Quick Verify
1. Start services: docker compose up --build
2. Check health:
   - curl http://localhost:8080/api/health
3. Products:
   - curl http://localhost:8080/api/products
   - curl http://localhost:8080/api/products/example-slug



## Product Listing: Filters and Pagination

The products endpoint supports filtering, sorting, and pagination.

- Endpoint: GET http://localhost:8080/api/products
- Query parameters:
  - search: text search across title and description (case-insensitive)
  - category: filter by category slug (e.g., bekleidung)
  - page: zero-based page index (default 0)
  - size: page size (default 20)
  - sort: property[,ASC|DESC] (e.g., sort=createdAt,DESC)

Examples:

```
# All active products (default page=0, size=20)
curl "http://localhost:8080/api/products"

# Full-text search
curl "http://localhost:8080/api/products?search=tshirt"

# Filter by category slug
curl "http://localhost:8080/api/products?category=bekleidung"

# Combine search + category + pagination + sort
curl "http://localhost:8080/api/products?search=leder&category=accessoires&page=0&size=10&sort=createdAt,DESC"
```

Notes:
- Only products with status ACTIVE are returned by default.
- The response is a Spring Data Page, containing content, totalElements, totalPages, size, and number.

## API Documentation (OpenAPI/Swagger)
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs


## Cart API and Checkout

### Cart Endpoints
- GET /api/cart?cartId={uuid} → Returns a cart (creates one if missing when only cartId provided or none given)
- POST /api/cart/items → Add item to cart
  - Body: { cartId?: UUID, productId: number, qty: number (>0) }
  - Returns updated CartDto
- PATCH /api/cart/items/{itemId} → Update quantity (qty<=0 removes item)
  - Body: { qty: number }
  - Returns updated CartDto
- DELETE /api/cart/items/{itemId} → Remove item

CartDto fields: id (UUID), currency (CHF), items[], totalCents, itemCount.

Notes:
- Currency consistency enforced. If the cart has items, products must match cart currency.
- Price is snapshot at add time via unitPriceCents.

### Checkout (Stripe PaymentIntent)
- POST /api/checkout/session
  - Body: { amountCents: number, currency: string = "CHF" }
  - Returns: { clientSecret: string, paymentIntentId: string }
- Frontend uses Stripe Elements (card) to confirm payment with the returned clientSecret.

Configure STRIPE_SECRET_KEY in .env for backend. Frontend uses a test publishable key from environment files.

## Frontend Pages (Angular)
- / → Modern overview (Home): lists products with CHF pricing and Add-to-Cart
- /login → Email/password placeholder + Google OAuth button
- /register → Simple registration placeholder + Google OAuth
- /cart → LocalStorage cart. Update qty/remove and proceed to Checkout
- /checkout → Stripe card form; creates PaymentIntent via backend and confirms

Environment:
- Development calls http://localhost:8080/api (environment.ts)
- Production assumes /api under same origin (environment.prod.ts)

## OAuth2 (Google)
- Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
- Login/Register pages link to: http://localhost:8080/oauth2/authorization/google
- Security config redirects back to http://localhost:4200/ after login/logout in dev.


## Testing

Backend (Spring Boot):
- Run all tests
  - Windows PowerShell:
    - cd e-commerce-backend
    - mvn -q test
- Run one test class
  - mvn -q -Dtest=org.ch.ecommerce.school.ecommercebackend.controller.HealthControllerTest test

What’s covered (unit/web layer):
- HealthController: GET /api/health → 200 with status=ok
- ProductController: GET by slug (200 and 404), list returns a Page
- CartController: validation errors (qty<=0, missing qty) and delete non-existent item (404)
- CheckoutController: success path (mocked Stripe) and request validation. Direct Stripe calls are wrapped in StripeService and mocked in tests.

Frontend (Angular + Karma/Jasmine):
- From e-commerce-frontend directory:
  - npm test

What’s covered:
- CartService: add/update/remove, totalCents, and persistence to localStorage
- HomeComponent: renders products from mocked ApiService and invokes CartService on click
- CheckoutComponent: pay button disabled when total is 0 (Stripe init is not executed in unit test)
- Login/Register: onSubmit triggers alert (placeholder behavior)

Notes:
- Tests avoid external network calls and databases. Web layer tests use @WebMvcTest and Mockito-based @TestConfiguration beans.
- Stripe is mocked in tests; no real charges are created.


## Troubleshooting: Tests not found / Maven cannot resolve artifacts

If your IDE or CLI says tests are not found or execution fails early, check the following:

- Correct invocation
  - CLI (from e-commerce-backend): mvn -q test
  - One class: mvn -q -Dtest=org.ch.ecommerce.school.ecommercebackend.controller.HealthControllerTest test
  - IDE: Run the test class or method directly (JUnit 5)
- In this JetBrains runner interface: you must specify a FQN (fully qualified name) of the test, not the module path.

- Artifact resolution (most common reason for failures):
  - Ensure you have internet access for Maven to download dependencies the first time.
  - Pre-fetch dependencies: mvn -U dependency:go-offline
  - If behind a proxy, configure ~/.m2/settings.xml with your proxy or a mirror for Maven Central.
  - After dependencies are downloaded once, you can run offline: mvn -o test

- Project POM simplified
  - The backend pom.xml was trimmed to only essential dependencies to reduce resolution footprint and speed up local setup.

If issues persist, delete your Maven cache for the project (caution):
  - Windows: del /F /Q %USERPROFILE%\.m2\repository\org\ch\ecommerce\school\e-commerce-backend (or clear selectively), then re-run mvn -U test.


## FAQ

Q: Are all tests for the whole application done?
- Short answer: No.
- Current coverage:
  - Backend (Spring Boot): Web-layer tests for 4 controllers (Health, Product, Cart, Checkout) using @WebMvcTest with mocked dependencies.
  - Frontend (Angular): Unit tests exist for App, CartService, HomeComponent, CheckoutComponent, Login, and Register.
- Missing (to be implemented): Service/repository unit tests, database-backed integration tests, end-to-end (e2e) tests across frontend+backend, and CI pipeline to run them automatically.

How to run tests locally:
- Backend (Windows PowerShell):
  - cd e-commerce-backend
  - mvn -q test
  - One class: mvn -q -Dtest=org.ch.ecommerce.school.ecommercebackend.controller.HealthControllerTest test
- Frontend:
  - cd e-commerce-frontend
  - npm test

Notes:
- In this JetBrains runner interface, prefer running backend tests by Fully Qualified Name (FQN), e.g., org.ch.ecommerce.school.ecommercebackend.product.ProductControllerTest.
- Tests avoid real network/database operations; Stripe is mocked.


## Frontend e2e (Playwright)

Playwright-based end-to-end tests verify that the Angular app boots and key routes load.

Prerequisites (first time only):
- Windows PowerShell:
  - cd e-commerce-frontend
  - npm install
  - npm run e2e:install  # installs Playwright browsers

Run e2e tests:
- npm run e2e

Run in UI mode (for debugging):
- npm run e2e:ui

Notes:
- The Playwright config starts the Angular dev server automatically (npm start) and reuses an existing server in non-CI runs.
- Tests are written to avoid backend dependencies; they assert the SPA loads and routes are reachable.
- Base URL: http://localhost:4200 (configure in e-commerce-frontend/playwright.config.ts)


## IntelliJ Run Buttons (Start/Stop Docker Stack)
If you use IntelliJ IDEA, two Run Configurations are included so you get a one-click button on the top toolbar:

- Start Docker Stack: runs the PowerShell script `start.ps1` which builds/pulls images and starts postgres, api, and web via `compose.yml`.
- Stop Docker Stack: runs `docker compose down` in the project root.

How to use:
1. Open the project in IntelliJ.
2. In the top toolbar, open the run configuration dropdown and choose "Start Docker Stack". Click the green Run ▶ button.
3. To stop everything, choose "Stop Docker Stack" and run it.

Optional: Pin to toolbar
- Click the run configuration dropdown > Edit Configurations... and ensure both are listed. You can also favorite them and enable the toolbar Main Menu > View > Appearance > Toolbar if hidden.

Notes
- The start button uses PowerShell (`powershell.exe -ExecutionPolicy Bypass -File`) to execute `start.ps1`.
- Ensure Docker Desktop is running before starting.
- These configurations are stored in `.idea/runConfigurations/` and reference Windows paths. On macOS/Linux, run from the terminal: `./start.ps1` via PowerShell Core or use `docker compose up --build` directly.
