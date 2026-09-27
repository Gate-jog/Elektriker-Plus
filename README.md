# Elektriker Plus

Schulungsportal & KI-Prüfungssimulator für die Elektrotechnik — als Progressive Web App (PWA).

## Features

- **Standard Quiz** — 10 zufällige Fachfragen zu ÖVE/DIN-VDE-Standards
- **Schaltsymbole** — Übung der Schaltzeichen nach DIN EN 60617
- **Experten Modus** — KI-generierte Fragen mit Tutor-Erklärungen, anpassbar nach Themenfeld & Schwierigkeitsgrad
- **VS-Duell (Online)** — Live-Multiplayer gegen andere Elektriker (ELO-Rating-System)
- **Lernbereich** — Nachschlagewerk mit Formeln, Schaltplänen & interaktiven Profi-Rechnern
- **Freunde-System** — Freunde hinzufügen, herausfordern und vergleichen

## Lerninhalte

| Thema | Inhalt |
|---|---|
| Schaltsymbole | DIN EN 60617 Kartei mit SVG-Symbolen |
| Netzsysteme | TN-C, TN-S, TN-C-S, TT & IT — inkl. Vergleichstabelle, Farbcodierung & Auswahlsystem |
| Fehlerschutz | Netzabhängige & netzunabhängige Maßnahmen |
| Grundlagen | Ohmsches Gesetz, Leistung, Drehstrom, Formelsammlung |
| Sicherheit | 5 Sicherheitsregeln, Prüfverfahren |
| Kabel & Installation | Kabeltypen, Schutzklassen, Verlegeung |
| Photovoltaik | PV-Module, Stringverschaltung, Wechselrichter |
| E-Mobilität | AC/DC-Ladepunkte, Typ 2, CCS, VDE-Anforderungen |
| Prüfung | Messgeräte, Prüfprotokolle, Dokumentationspflichten |

## Profi-Rechner

- Ohmsches Gesetz (U, I, R)
- Drehstroem-Leistung (P = √3 × U × I × cos φ)
- Spannungsfall (ΔU) 1-phasig & 3-phasig
- Mindestquerschnitt
- Leiterbelastbarkeit (nach VDE-Tabellen)
- Motorparameter (Drehzahl, Leistung, Polpaarzahl)
- PV-Anlagen-Leistung & Jahresertrag

## Bedienung

Öffne `index.html` im Browser. Alle Daten werden lokal im Browser gespeichert (localStorage).

### PWA

Die App kann als eigenständige Anwendung auf dem Smartphone installiert werden (homescreen-icon).

## Offline

Dank Service-Worker-Unterstützung und lokaler Daten ist die App grundsätzlich offline nutzbar.
