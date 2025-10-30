# CI/CD‑Pipelines

Stand
- Eine vollständige CI/CD ist geplant. Diese Seite beschreibt das Zielbild und lokale Alternativen.

Zielbild (GitHub Actions oder GitLab CI)
- Jobs
  - backend-test: Maven Tests ausführen (cache für ~/.m2)
  - frontend-test: npm ci && npm test (cache für node_modules/lockfile)
  - e2e-optional: Playwright Test (manuell triggerbar oder nightly)
  - build-api: mvn -q -DskipTests package → Docker Image bauen und taggen
  - build-web: npm run build → Docker Image für Nginx/SPA
  - compose-smoke: docker compose up -d und Healthcheck /api/health prüfen
- Artefakte
  - OpenAPI Spezifikation als Download
  - Testreports/JUnit

Lokaler Ersatz
- Verwende .\start.ps1 oder docker compose up --build für ein End‑zu‑End Setup lokal
- Tests lokal laufen lassen (siehe testing.md)

Secrets
- In CI niemals echte Secrets im Klartext speichern
- Für Dev/PRs Dummy‑Secrets verwenden; Produktion via Secret‑Store
