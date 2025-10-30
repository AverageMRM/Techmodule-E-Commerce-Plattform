# Git‑Workflow

Branching
- main: stabiler Hauptzweig
- feature/<kurzbeschreibung>: für neue Features/Tasks
- fix/<kurzbeschreibung>: für Fehlerbehebungen

Vorgehen
1. Issue/Ticket anlegen oder bestehendes referenzieren
2. Branch vom aktuellen main erstellen
3. Implementieren, Tests ausführen
4. Commiten in kleinen Schritten mit klaren Messages
5. Pushen und Pull Request eröffnen
6. Review abwarten, Feedback einarbeiten
7. Merge via Squash‑Merge oder Merge‑Commit (Projektentscheid)

Konventionen
- Commit‑Nachrichten im Imperativ
- PR‑Beschreibung: Was, Warum, Wie getestet, Screenshots falls UI
- Verweise: "Closes #<IssueNr>" oder "Refs #<IssueNr>"

Rebase vs. Merge
- Für saubere Historie: vor PR ggf. rebase auf main

Versionierung/Tags
- Release‑Tags nach Bedarf: v0.1.0 etc.
