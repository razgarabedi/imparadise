# Übungsaufgaben zu IPv4 und IPv6
## Für deine Klassenarbeit am 01.12.2025

---

# TEIL 1: IPv4 AUFGABEN

## ÜBUNG 1: IPv4 Aufbau und Schreibweise

### Aufgabe 1.1 – Binärschreibweise konvertieren

Konvertiere folgende IPv4-Adressen in die vollständige Binärschreibweise (jedes Oktett 8 Bit):

a) 192.168.1.100  
b) 10.0.0.1  
c) 172.16.5.200  

---

### Aufgabe 1.2 – Binär in IPv4 zurückrechnen

Wandle folgende binären IPv4-Adressen in die dezimale Punktschreibweise um:

a) 11000000.10101000.00000001.00000001  
b) 00001010.00000000.00000000.00000001  
c) 10101100.00010000.00000101.11001000  

---

## ÜBUNG 2: Subnetzmaske und UND-Verknüpfung (Anding)

### Aufgabe 2.1 – Netzwerk-ID per Anding bestimmen

Gegeben:
- IP: 192.168.50.178
- Maske: 255.255.255.0

a) Bestimme die Netzwerk-ID.  
b) Entscheide, ob Host 192.168.50.10 im selben Netz liegt.  

---

### Aufgabe 2.2 – Subnetzmaske aus Präfixlänge bestimmen

Die Präfixlänge `/24` ist gegeben. Bestimme die Subnetzmaske in dezimaler und binärer Schreibweise.

---

### Aufgabe 2.3 – Hosts aus Präfix / Maske

Berechne die Anzahl nutzbarer Host-Adressen (usable Hosts) für:

a) /24  
b) /25  
c) 255.255.255.192  

---

## ÜBUNG 3: Standardgateway

### Aufgabe 3.1 – Szenario-Analyse

Ein PC hat:
- IP: 192.168.1.100
- Maske: 255.255.255.0
- Gateway: 192.168.1.1

Gib an, ob der PC für jede Ziel-IP das Gateway verwendet oder direkt im LAN sendet:

a) 192.168.1.5  
b) 192.168.2.5  
c) 8.8.8.8  
d) 192.168.1.254  

---

## ÜBUNG 4: Sonderadressen

### Aufgabe 4.1 – Adresstyp erkennen

Ordne jeder Adresse einen Typ zu (APIPA, private IP, localhost/Loopback, öffentliche Adresse, Multicast):

a) 10.0.0.5  
b) 172.31.10.10  
c) 192.168.1.200  
d) 127.0.0.1  
e) 169.254.10.20  
f) 8.8.8.8  
g) 224.0.0.1  

---

### Aufgabe 4.2 – Netzwerk-ID und Broadcast

Gegeben Subnetz: 192.168.100.0/26

a) Bestimme Subnetz-Maske in Dezimal.  
b) Netzwerk-ID.  
c) Broadcast-Adresse.  
d) Bereich der nutzbaren Hosts.  
e) Anzahl der nutzbaren Hosts.  

---

### Aufgabe 4.3 – Sonderfall APIPA

Ein Windows-Client versucht per DHCP eine Adresse zu bekommen, es gibt aber keinen DHCP-Server.

a) In welchem Adressbereich landet er typischerweise?  
b) Können zwei solche Clients im gleichen LAN miteinander kommunizieren? Begründe kurz.  

---

## ÜBUNG 5: Netzklassen (klassische IPv4)

### Aufgabe 5.1 – Klassische Netzklasse bestimmen

Bestimme für jede Adresse die Klasse (A/B/C/D/E) und die Standard-Subnetzmaske:

a) 12.0.0.1  
b) 150.10.20.30  
c) 200.100.50.25  
d) 230.1.1.1  

---

## ÜBUNG 6: VLSM (Variable Length Subnet Mask)

### Aufgabe 6.1 – Einfaches Subnetting

Netz: 192.168.10.0/24 soll in 4 gleich große Subnetze aufgeteilt werden.

a) Welche neue Präfixlänge / Subnetzmaske brauchst du?  
b) Liste alle 4 Subnetze mit Netzwerk-ID, Broadcast, erstem und letztem Host.

---

### Aufgabe 6.2 – VLSM-Planung

Du hast das Netz 192.168.0.0/24 und brauchst:

- Netz A: 50 Hosts  
- Netz B: 20 Hosts  
- Netz C: 10 Hosts  

Plane mit VLSM so, dass möglichst wenig Adressen verschwendet werden.
Gib für jedes Teilnetz an: Präfix, Netzwerkadresse, erste Hostadresse, letzte Hostadresse, Broadcast.

---

# TEIL 2: IPv6 AUFGABEN

## ÜBUNG 7: IPv6 Aufbau und Schreibweise

### Aufgabe 7.1 – Grundaufbau IPv6

Beantworte kurz:

a) Wie viele Bits hat eine IPv6-Adresse?  
b) In wie viele Blöcke wird sie dargestellt und wie viele Bits pro Block?  
c) Welche Zahlendarstellung wird verwendet (dezimal / hexadezimal)?  

---

### Aufgabe 7.2 – IPv6-Adresse kürzen

Kürze folgende IPv6-Adressen nach den offiziellen Regeln so weit wie möglich:

a) 2001:0db8:0000:0000:0000:0000:0000:0001  
b) fe80:0000:0000:0000:0200:00ff:fe00:0001  
c) 2001:0db8:0000:0000:0000:0000:0000:0000  

---

### Aufgabe 7.3 – Vollständige Darstellung

Schreibe folgende IPv6-Adressen **vollständig ausgeschrieben** (alle Blöcke 4-stellig, führende Nullen ergänzen):

a) 2001:db8::1  
b) fe80::1  
c) 2001:db8:1234::abcd  

---

## ÜBUNG 8: IPv6 Adresstypen

### Aufgabe 8.1 – Adresstyp erkennen

Ordne jeder Adresse ihren Typ zu (Link-Local, Global-Unicast, Multicast, sonstiger Typ):

a) fe80::1  
b) 2001:db8::1234  
c) ff02::1  
d) ff05::2  
e) ::1  
f) fd00::1  

---

### Aufgabe 8.2 – Eigenschaften erklären

Beantworte kurz:

a) Wofür werden Link-Local-Adressen verwendet und in welchem Präfixbereich liegen sie?  
b) Was zeichnet Global-Unicast-Adressen aus (Routbarkeit, Eindeutigkeit, typischer Präfixbereich)?  
c) Welchen Zweck haben Multicast-Adressen bei IPv6 und was ersetzt IPv6 im Vergleich zu IPv4?  

---

## ÜBUNG 9: Global-Routing-Prefix und 3-1-4-Struktur

### Aufgabe 9.1 – Präfix analysieren

Gegeben: Globales Präfix 2001:db8:abcd::/48

a) Welche Teile gehören zum Global-Routing-Prefix?  
b) Wie viele Bits stehen für Subnetze zur Verfügung, wenn LANs mit /64 betrieben werden?  
c) Wie viele /64-Subnetze kannst du aus diesem /48 machen?  

---

### Aufgabe 9.2 – 3-1-4-Struktur zuordnen

Ordne bei einer typischen Global-Unicast-Adresse mit /64 die Bereiche zu:

a) Welche 3 Teile bilden grob das „3-1-4"-Schema (in Blöcken gedacht)?  
b) Welcher Bereich wird üblicherweise vom ISP vergeben, welcher vom Unternehmen intern genutzt, welcher vom Endgerät?  

---

### Aufgabe 9.3 – Beispiel-Subnetze erzeugen

Aus dem Präfix 2001:db8:abcd::/48 sollen 4 /64-Subnetze für Standorte erzeugt werden (A, B, C, D).
Gib je ein mögliches /64-Präfix pro Standort an.

---

## ÜBUNG 10: Hostadressen (EUI-64)

### Aufgabe 10.1 – MAC → EUI-64

Gegeben:
- MAC-Adresse: 00:1a:2b:3c:4d:5e  
- Präfix: 2001:db8:abcd:1::/64  

Ermittle die vollständige IPv6-Adresse, wenn der Interface-Identifier per EUI-64 aus der MAC erzeugt wird.

---

### Aufgabe 10.2 – EUI-64 rückwärts (MAC rekonstruieren)

Gegeben IPv6-Adresse: fe80::021c:23ff:fe45:6789

a) Markiere den 64-Bit-Interface-Identifier.  
b) Rekonstruiere die ursprüngliche MAC-Adresse (normaler 48-Bit-Wert).  

---

## ÜBUNG 11: Stateless (SLAAC) und Stateful-Autokonfiguration

### Aufgabe 11.1 – SLAAC-Ablauf beschreiben

Ein Host hängt in einem IPv6-Netz mit einem Router, der Präfix 2001:db8:1234:1::/64 verteilt.
Beschreibe stichpunktartig den Ablauf, wie der Host **ohne DHCP-Server** zu einer Global-Unicast-Adresse kommt (SLAAC).

---

### Aufgabe 11.2 – SLAAC vs. Stateful DHCPv6

Vergleiche in einer Tabelle (Stichpunkte reichen) folgende Eigenschaften zwischen SLAAC und Stateful DHCPv6:

- Wer vergibt die Adresse?  
- Wird die Adresse zentral gespeichert/verwaltet?  
- Wie kommen DNS-Server-Adressen typischerweise zum Client?  
- Typische Einsatzszenarien.  

---

## ÜBUNG 12: IPv6-Subnetze

### Aufgabe 12.1 – Anzahl der Subnetze

Dein Provider gibt dir 2001:db8:beef::/48.

a) Wie viele /64-Subnetze sind daraus möglich?  
b) Nenne 3 Beispiel-/64-Präfixe, die du daraus für drei Abteilungen bilden könntest.  

---

### Aufgabe 12.2 – Vergleich IPv4-/24 vs. IPv6-/64

Vergleiche für folgende Fälle:
- IPv4: 192.168.1.0/24  
- IPv6: 2001:db8:1:1::/64  

a) Wie viele mögliche Hostadressen gibt es jeweils?  
b) Was fällt im Vergleich auf?  
c) Warum ist bei IPv6 trotz „Verschwendung" ein /64 pro LAN üblich?  

---

---

# LÖSUNGEN – SEPARATER BLOCK

---

## LÖSUNGEN zu Teil 1 – IPv4

### Lösung zu Aufgabe 1.1

a) 192.168.1.100  
→ 11000000.10101000.00000001.01100100

b) 10.0.0.1  
→ 00001010.00000000.00000000.00000001

c) 172.16.5.200  
→ 10101100.00010000.00000101.11001000

---

### Lösung zu Aufgabe 1.2

a) 11000000.10101000.00000001.00000001 → 192.168.1.1

b) 00001010.00000000.00000000.00000001 → 10.0.0.1

c) 10101100.00010000.00000101.11001000 → 172.16.5.200

---

### Lösung zu Aufgabe 2.1

Maske 255.255.255.0 → /24, Netzwerkanteil: erste 3 Oktette.

a) IP 192.168.50.178 → **Netzwerk-ID: 192.168.50.0**

b) Host 192.168.50.10 hat Netzwerk-ID 192.168.50.0 → **liegt im selben Netz**

---

### Lösung zu Aufgabe 2.2

**In Binär:**
```
11111111.11111111.11111111.00000000
```

**In Dezimal:** 255.255.255.0

---

### Lösung zu Aufgabe 2.3

Formel: 2^(Hostbits) − 2

a) /24 → 8 Hostbits → 2^8 − 2 = **254 Hosts**

b) /25 → 7 Hostbits → 2^7 − 2 = **126 Hosts**

c) 255.255.255.192 → /26 → 6 Hostbits → 2^6 − 2 = **62 Hosts**

---

### Lösung zu Aufgabe 3.1

Alle mit Maske /24, also 192.168.1.0 als Netz.

a) 192.168.1.5 → **direkt (ARP)**

b) 192.168.2.5 → **über Gateway**

c) 8.8.8.8 → **über Gateway**

d) 192.168.1.254 → **direkt (ARP)**

---

### Lösung zu Aufgabe 4.1

a) 10.0.0.5 → **private IP (10.0.0.0/8)**

b) 172.31.10.10 → **private IP (172.16–172.31)**

c) 192.168.1.200 → **private IP (192.168.0.0/16)**

d) 127.0.0.1 → **Loopback / localhost**

e) 169.254.10.20 → **APIPA**

f) 8.8.8.8 → **öffentliche Adresse**

g) 224.0.0.1 → **Multicast (Klasse D)**

---

### Lösung zu Aufgabe 4.2

/26 → Maske 255.255.255.192, 6 Hostbits

a) Maske: **255.255.255.192**

b) Netzwerk-ID: **192.168.100.0**

c) Broadcast: **192.168.100.63**

d) Nutzbare Hosts: **192.168.100.1 – 192.168.100.62**

e) Anzahl: **62 Hosts**

---

### Lösung zu Aufgabe 4.3

a) APIPA-Bereich: **169.254.0.0–169.254.255.255**

b) Ja, Kommunikation ist möglich, **wenn beide im gleichen Layer-2-Segment sind**

---

### Lösung zu Aufgabe 5.1

a) 12.0.0.1 → **Klasse A, Standardmaske 255.0.0.0**

b) 150.10.20.30 → **Klasse B, Standardmaske 255.255.0.0**

c) 200.100.50.25 → **Klasse C, Standardmaske 255.255.255.0**

d) 230.1.1.1 → **Klasse D (Multicast)**

---

### Lösung zu Aufgabe 6.1

4 gleich große Subnetze aus /24 → je **/26**

a) Präfixlänge: **/26**, Maske **255.255.255.192**

b) Subnetze (64er-Sprünge):

| Nr. | Netz-ID | Bereich | Broadcast |
|-----|---------|---------|-----------|
| 1 | 192.168.10.0 | 192.168.10.1–62 | 192.168.10.63 |
| 2 | 192.168.10.64 | 192.168.10.65–126 | 192.168.10.127 |
| 3 | 192.168.10.128 | 192.168.10.129–190 | 192.168.10.191 |
| 4 | 192.168.10.192 | 192.168.10.193–254 | 192.168.10.255 |

---

### Lösung zu Aufgabe 6.2 (VLSM)

Bedarf sortiert: A (50), B (20), C (10)

**Netz A (/26):**
- Netz: 192.168.0.0/26
- Hosts: 192.168.0.1–192.168.0.62
- Broadcast: 192.168.0.63

**Netz B (/27):**
- Netz: 192.168.0.64/27
- Hosts: 192.168.0.65–192.168.0.94
- Broadcast: 192.168.0.95

**Netz C (/28):**
- Netz: 192.168.0.96/28
- Hosts: 192.168.0.97–192.168.0.110
- Broadcast: 192.168.0.111

---

## LÖSUNGEN zu Teil 2 – IPv6

### Lösung zu Aufgabe 7.1

a) **128 Bit**

b) **8 Blöcke zu je 16 Bit**

c) **Hexadezimale Darstellung**

---

### Lösung zu Aufgabe 7.2

a) **2001:db8::1**

b) **fe80::200:ff:fe00:1**

c) **2001:db8::**

---

### Lösung zu Aufgabe 7.3

a) **2001:0db8:0000:0000:0000:0000:0000:0001**

b) **fe80:0000:0000:0000:0000:0000:0000:0001**

c) **2001:0db8:1234:0000:0000:0000:0000:abcd**

---

### Lösung zu Aufgabe 8.1

a) **Link-Local**

b) **Global-Unicast**

c) **Multicast (All Nodes, Link-Local)**

d) **Multicast (All Routers, Site-Local)**

e) **Loopback**

f) **Unique Local Address (ULA, privat)**

---

### Lösung zu Aufgabe 8.2

a) **Link-Local (fe80::/10):** Nur lokale Kommunikation, kein Routing, automatisch generiert

b) **Global-Unicast (2000::/3):** Weltweit eindeutig, im Internet routbar

c) **Multicast (FF00::/8):** Ersetzt IPv4-Broadcast, gezieltes Senden an Gruppen

---

### Lösung zu Aufgabe 9.1

a) **Global-Routing-Prefix: 2001:db8:abcd::** (erste 3 Blöcke)

b) **64 − 48 = 16 Bits für Subnetze**

c) **2^16 = 65.536 mögliche /64-Subnetze**

---

### Lösung zu Aufgabe 9.2

a) **3 Blöcke (48 Bit):** Site Prefix / Global-Routing-Prefix  
   **1 Block (16 Bit):** Subnetz-ID  
   **4 Blöcke (64 Bit):** Interface-Identifier

b) **ISP:** Erste 3 Blöcke | **Unternehmen:** 4. Block | **Endgerät:** Letzte 4 Blöcke

---

### Lösung zu Aufgabe 9.3

- **Standort A:** 2001:db8:abcd:0001::/64
- **Standort B:** 2001:db8:abcd:0002::/64
- **Standort C:** 2001:db8:abcd:0003::/64
- **Standort D:** 2001:db8:abcd:0004::/64

---

### Lösung zu Aufgabe 10.1

MAC: 00:1a:2b:3c:4d:5e

1. Aufteilen: 00:1a:2b | 3c:4d:5e
2. FFFE einfügen: 00:1a:2b:ff:fe:3c:4d:5e
3. U/L-Bit invertieren: 02:1a:2b:ff:fe:3c:4d:5e
4. IPv6-Format: 021a:2bff:fe3c:4d5e

**Vollständige Adresse: 2001:db8:abcd:1:021a:2bff:fe3c:4d5e**

---

### Lösung zu Aufgabe 10.2

fe80::021c:23ff:fe45:6789

a) **Interface-Identifier: 021c:23ff:fe45:6789**

b) **MAC: 00:1c:23:45:67:89**

---

### Lösung zu Aufgabe 11.1

**SLAAC-Ablauf:**

1. Host generiert Link-Local-Adresse
2. Duplicate Address Detection (DAD)
3. Router Solicitation (RS) an ff02::2
4. Router antwortet mit RA + Präfix
5. Host kombiniert Präfix + Interface-ID
6. DAD erneut
7. Adresse wird genutzt

---

### Lösung zu Aufgabe 11.2

| Aspekt | SLAAC | Stateful DHCPv6 |
|--------|-------|-----------------|
| **Adressvergabe** | Host erzeugt selbst | Server vergibt |
| **Zentral verwaltet** | Nein | Ja |
| **DNS-Server** | RDNSS / Stateless DHCP | DHCPv6 |
| **Einsatz** | Einfache Netze | Unternehmensnetze |

---

### Lösung zu Aufgabe 12.1

a) **2^16 = 65.536 /64-Subnetze**

b) - 2001:db8:beef:0001::/64
   - 2001:db8:beef:0002::/64
   - 2001:db8:beef:0003::/64

---

### Lösung zu Aufgabe 12.2

a) **IPv4 /24:** 254 Hosts  
   **IPv6 /64:** 2^64 Hosts

b) **Auffällig:** IPv6 hat astronomisch viele Adressen

c) **/64 ist Standard, weil:** SLAAC/EUI-64 davon ausgehen, Standardisierung wichtiger als Sparsamkeit

---

**Viel Erfolg bei deiner Klassenarbeit! 🚀**
