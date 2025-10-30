# Einführung

## Systemziele nach S.M.A.R.T.
### 🧩 Funktional

- **Benutzerregistrierung & Login:**
    Bis Ende Q2 2026 soll das System es neuen Nutzern ermöglichen, sich in unter 2 Minuten sicher zu registrieren und einzuloggen.
    Erfolgsquote bei der Anmeldung: ≥ 95 % ohne Fehlermeldung.

- **Produktdurchsuchung & Filterung:**
  Bis Q3 2026 sollen Nutzer in der Lage sein, mindestens 100 Produkte nach Kategorien, Preis oder Namen zu durchsuchen und Filter in unter 2 Sekunden anzuwenden.

- **Warenkorbverwaltung:**
  Nutzer sollen bis Ende Q2 2026 Produkte in Echtzeit (ohne Seitenneuladen) in den Warenkorb hinzufügen, ändern und löschen können.
  Änderungen sollen in unter 1 Sekunde sichtbar sein.

- **Checkout & Bestellprozess:**
  Bis Q3 2026 soll der gesamte Checkout in maximal 3 Schritten abgeschlossen werden können.
  Erfolgreiche Bestellquote: ≥ 95 % aller gestarteten Prozesse.

- **Modernes & responsives Design:**
  Das System soll bis Q2 2026 ein modernes, ansprechendes Layout bieten, das auf Desktop, Tablet und Smartphone korrekt angezeigt wird.
  In Usability-Tests sollen mindestens 80 % der Nutzer das Design als „modern“ und „übersichtlich“ bewerten.

### ⚙️ Nicht-funktional

- **Performance:**
    Seiten sollen in unter 2 Sekunden laden, auch bei einer Produktliste von 100 Einträgen.
    Messbar durch Ladezeit-Tests unter realen Bedingungen bis Q3 2026.

- **Usability:**
    In einem Test mit mindestens 20 Testnutzern sollen 80 % das System als „einfach zu bedienen“ bewerten.
    Evaluation bis Ende Q3 2026.

- **Security:**
    Alle Passwörter und Nutzerdaten müssen bis spätestens Q2 2026 verschlüsselt (AES-256 / Hash + Salt) gespeichert werden.
    Erfolgsnachweis durch Penetration-Test mit 0 kritischen Sicherheitslücken.

- **Availability:**
    Das System soll eine Verfügbarkeit von ≥ 99 % im Monatsdurchschnitt erreichen.
    Überwachung durch Monitoring-System bis Ende Q3 2026.

- **Compatibility:**
    Das Frontend muss bis Q2 2026 vollständig kompatibel mit den aktuellen Versionen von Chrome, Firefox, Safari und Edge sein.
    Verifiziert durch Cross-Browser-Tests.

- **Maintainability:**
    Der Code soll modular und dokumentiert sein, sodass Fehlerbehebungen oder Updates innerhalb von 1 Arbeitstag erfolgen können.
    Überprüfung durch internen Code-Review bis Ende Q3 2026.

## Verwaltung des Projekts & Rollenverteilung

Wir werden sämtliche Ziele, Anforderungen und User Stories in GitHub verwalten.
Das Projekt kann hier gefunden werden: https://github.com/users/AverageMRM/projects/3/views/1.
Natürlich werden andere essenzielle Informationen ebenfalls hier auf diesem Repository dokumentiert.
<br>
Die Rollen im Projekt wurden wie folgt verteilt:

| Name           | Rolle                   |
|----------------|-------------------------|
| Luka Nikolic   | Developer               |
| Lennox Kofmehl | Developer, PO           |
| Manuel Möri    | Developer, Scrum Master |

## Tools des Projektes
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

## Auftrag 01.4 Product Backlog