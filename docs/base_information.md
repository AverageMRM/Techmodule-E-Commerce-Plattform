# Basis‑Informationen

Dieses Dokument sammelt allgemeine Projektinformationen und verweist auf weiterführende Seiten in docs/.

Projektziel
- Scaffold einer produktionsreifen E‑Commerce‑Plattform für Unterricht/Übungen
- Fokus: saubere Struktur, lokale Laufbarkeit, Tests, nachvollziehbare Doku

Rollen
- Entwicklerteam (Schüler/Studierende)
- Coach/Lehrperson als Reviewer

Artefakte
- Quellcode: siehe Verzeichnisstruktur im Projektroot
- Dokumentation: dieses Verzeichnis (docs/)
- Backlog/Issues: Git Issues oder Schul‑Taskboard

Auftrag 01.2 – Ziele/Anforderungen
- Minimal lauffähiger Shop‑Prototyp: Produkte anzeigen, Warenkorb, Checkout‑Stub
- Lokale Umgebung via Docker Compose startbar
- Health‑Endpoint und API‑Doku verfügbar

Auftrag 01.3 – Tools
- IDE: IntelliJ IDEA / VS Code
- Versionsverwaltung: Git (GitHub/GitLab)
- Build: Maven (Backend), npm (Frontend)
- Laufzeit: Docker Desktop + Docker Compose
- Test: JUnit 5, Jasmine/Karma, Playwright

Auftrag 01.4 – Product Backlog (Auszug/Beispiel)
- Produkte laden/anzeigen
- Warenkorb CRUD (Add/Update/Delete)
- Checkout Prozess (Stub, später Stripe)
- Authentifizierung/JWT
- Admin UI
- e2e Tests

Weiteres
- Detaillierte technische Beschreibungen: architecture.md, backend.md, frontend.md, api.md
- Prozess & Qualität: git_workflow.md, testing.md, Testkonzept.md, pipelines.md, contributing.md
