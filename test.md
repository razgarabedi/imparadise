# UML Aktivitätsdiagramm - Übungsaufgaben für das 3er-Team

**Teammitglied:** Razgar
**Aufgabe:** Zwei Übungsaufgaben mit Lösungen, Quellenangaben und weiterführende Informationen

---

## Übungsaufgabe 1: Kaffee zubereiten

### Aufgabenstellung
Erstellen Sie ein UML-Aktivitätsdiagramm für den Prozess "Kaffee mit einer Kaffeemaschine zubereiten". Berücksichtigen Sie dabei:
- Den normalen Ablauf der Kaffeezubereitung
- Eine Entscheidung, ob genug Wasser im Tank ist
- Eine Entscheidung, ob genug Kaffeebohnen vorhanden sind
- Das Ende des Prozesses mit fertigem Kaffee

**Hinweis:** Verwenden Sie die Standard-UML-Symbole (Startknoten, Endknoten, Aktivitäten, Entscheidungsknoten, etc.)

---

### Lösung Aufgabe 1

Das Aktivitätsdiagramm zeigt folgenden Ablauf:

```
● (Startknoten)
↓
[Kaffeemaschine einschalten]
↓
◊ Genug Wasser im Tank? ◊
   ↓ [ja]                    ↓ [nein]
[Wasser prüfen]          [Wasser nachfüllen]
   ↓                         ↓
   ├─────────────────────────┘
   ↓
◊ Genug Kaffeebohnen? ◊
   ↓ [ja]                    ↓ [nein]
[Bohnen prüfen]          [Bohnen nachfüllen]
   ↓                         ↓
   ├─────────────────────────┘
   ↓
[Tasse unter Auslauf stellen]
↓
[Kaffee-Taste drücken]
↓
[Warten bis Kaffee fertig]
↓
[Fertigen Kaffee entnehmen]
↓
◉ (Endknoten)
```

**Wichtige UML-Elemente:**
- **●** = Startknoten (gefüllter Kreis)
- **◉** = Endknoten (gefüllter Kreis mit Rand)
- **[ ]** = Aktivität (abgerundetes Rechteck)
- **◊** = Entscheidungsknoten (Raute)
- **[bedingung]** = Guard-Bedingung

---

## Übungsaufgabe 2: Online-Bestellung aufgeben

### Aufgabenstellung
Modellieren Sie den Prozess einer Online-Bestellung mit einem UML-Aktivitätsdiagramm. Der Prozess soll folgende Schritte umfassen:
- Artikel suchen und auswählen
- In den Warenkorb legen
- Zur Kasse gehen
- Anmeldung (falls nicht eingeloggt)
- Lieferadresse eingeben
- Zahlungsmethode wählen
- Bestellung bestätigen
- Eine Entscheidung, ob die Zahlung erfolgreich war

---

### Lösung Aufgabe 2

Das Aktivitätsdiagramm für die Online-Bestellung:

```
● (Startknoten)
↓
[Artikel suchen]
↓
[Artikel auswählen]
↓
[In Warenkorb legen]
↓
[Zur Kasse gehen]
↓
◊ Benutzer eingeloggt? ◊
   ↓ [ja]                    ↓ [nein]
[Weiter zur Lieferung]   [Anmelden/Registrieren]
   ↓                         ↓
   ├─────────────────────────┘
   ↓
[Lieferadresse eingeben]
↓
[Zahlungsmethode wählen]
↓
[Bestellübersicht prüfen]
↓
[Bestellung bestätigen]
↓
◊ Zahlung erfolgreich? ◊
   ↓ [ja]                    ↓ [nein]
[Bestätigungsmail senden] [Fehlermeldung anzeigen]
   ↓                         ↓
   ↓                    [Zurück zur Zahlung]
   ↓                         ↓
   ↓                   ┌─────┘
   ↓                   ↓
[Bestellung abgeschlossen] ← ┘
↓
◉ (Endknoten)
```

**Besonderheiten dieses Diagramms:**
- Zeigt alternative Pfade (eingeloggt/nicht eingeloggt)
- Enthält Wiederholungsschleife bei fehlgeschlagener Zahlung
- Verwendung von Guard-Bedingungen für Entscheidungen

---

## Quellenangaben

### Primäre Quellen:
1. **Object Management Group (OMG):** UML 2.5.1 Specification. 2017. Online: https://www.omg.org/spec/UML/
2. **Oestereich, Bernd:** UML 2 glasklar. 4. Auflage, Hanser Verlag, 2013
3. **Rupp, Chris et al.:** UML 2 glasklar. Praxiswissen für die UML-Modellierung. 4. Auflage, Carl Hanser Verlag, 2012

### Online-Ressourcen:
4. **OER Informatik:** "UML Aktivitätsdiagramm". Online verfügbar: https://oer-informatik.de/uml-aktivitaetsdiagramm (Zugriff: Oktober 2025)
5. **High Score:** "Das Aktivitätsdiagramm". Online: http://www.highscore.de/uml/aktivitaetsdiagramm.html
6. **Visual Paradigm:** "UML Activity Diagram Tutorial". Online: https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-activity-diagram/

### Wissenschaftliche Quellen:
7. **Paech, B.:** "On the Role of Activity Diagrams in UML". Institut für Informatik, TU München, 1998
8. **Ambler, Scott W.:** "The Elements of UML 2.0 Style". Cambridge University Press, 2005

---

## Weiterführende Informationen

### YouTube-Tutorials (Deutsch):
- **"UML-Aktivitätsdiagramm für AP1 der IT-Berufe und AP2"** von Stefan Macke  
  URL: https://www.youtube.com/watch?v=0l7eFqwGdBw  
  *Besonders relevant für Fachinformatiker-Ausbildung, 28 Min.*

- **"UML Teil 3: Das Aktivitätsdiagramm"**  
  URL: https://www.youtube.com/watch?v=IKq-wBDfU7s  
  *Grundlagen und Verhaltensdiagramme, kompakt erklärt*

- **"Aktivitätsdiagramm"** von Thomas Grosser  
  URL: https://www.youtube.com/watch?v=q3xEiJzCLsg  
  *Kurze Einführung mit praktischem Beispiel*

### Online-Kurse und Plattformen:
- **Coursera:** "Object-Oriented Design" (University of Alberta)
- **edX:** "Software Engineering: Introduction" (UBC)
- **Udemy:** "UML and Object-Oriented Design Foundations"

### Praktische Tools zum Üben:
- **draw.io/diagrams.net** - Kostenlos, browserbasiert
- **Lucidchart** - Professionelle Diagramme online
- **PlantUML** - Textbasierte UML-Generierung
- **UMLet/UMLetino** - Einfaches UML-Tool
- **Visual Paradigm Community Edition** - Kostenlose Version verfügbar

### Weiterführende Literatur:
- **Fowler, Martin:** "UML Distilled: A Brief Guide to the Standard Object Modeling Language". 3. Auflage, Addison-Wesley, 2003
- **Larman, Craig:** "Applying UML and Patterns: An Introduction to Object-Oriented Analysis and Design". 3. Auflage, Prentice Hall, 2004
- **Booch, Grady et al.:** "The Unified Modeling Language User Guide". 2. Auflage, Addison-Wesley, 2005

### Online-Übungen und Prüfungsvorbereitung:
- **IHK-Prüfungsaufgaben:** Aktivitätsdiagramme sind Standard in AP1 und AP2 für IT-Berufe
- **GitHub: UML-AD Übungen:** https://pintman.github.io/uml-ad/
- **Fachinformatiker-Prüfungsvorbereitung:** https://fachinformatikerpruefungsvorbereitung.de/

---

## Tipps für die Teamarbeit

### Für die Präsentation:
1. **Zeigen Sie beide Lösungen schrittweise** - erklären Sie jeden Schritt
2. **Erläutern Sie die verwendeten UML-Symbole** kurz
3. **Erwähnen Sie praktische Anwendungsfälle** von Aktivitätsdiagrammen
4. **Verweisen Sie auf die Quellen** bei komplexeren Konzepten

### Häufige Fehler vermeiden:
- Verwenden Sie **offene Pfeilspitzen** (nicht ausgefüllt)
- **Jeder Entscheidungsknoten** braucht mindestens 2 Ausgänge
- **Start- und Endknoten** nicht vergessen
- **Guard-Bedingungen** in eckigen Klammern notieren

**Viel Erfolg bei der Präsentation!**
