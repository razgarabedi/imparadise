# Neue Übungsaufgaben zu IPv4 und IPv6 - Zweites Übungsset
## Für intensive Vorbereitung auf deine Klassenarbeit

---

# TEIL 1: IPv4 NEUE AUFGABEN

## ÜBUNG 1: IPv4 Dezimal und Binär Umrechnung

### Aufgabe 1.1 – Dezimal zu Binär

Konvertiere folgende IPv4-Adressen komplett in Binärform:

a) 10.50.100.200  
b) 255.128.64.32  
c) 8.8.4.4  

---

### Aufgabe 1.2 – Binär zu Dezimal

Wandle folgende binäre IPv4-Adressen in Dezimalform um:

a) 01100100.11000000.10101010.01010101  
b) 11111111.00000000.11111111.00000000  
c) 00010000.00100000.00110000.01000000  

---

## ÜBUNG 2: Subnetzberechnung und Anding-Operation

### Aufgabe 2.1 – Netzwerk-ID mittels Anding

Gegeben:
- IP-Adresse: 10.20.30.40
- Subnetzmaske: 255.255.0.0

Bestimme durch Anding-Operation:

a) Die Netzwerk-ID  
b) Ob die Adresse 10.20.200.100 im selben Netz liegt  
c) Die Broadcast-Adresse des Netzwerks  

---

### Aufgabe 2.2 – Präfixlänge in Subnetzmaske umwandeln

Wandle folgende CIDR-Notationen in Subnetzmasken um:

a) /16  
b) /22  
c) /28  

---

### Aufgabe 2.3 – Hostanzahl berechnen

Wie viele nutzbare Hosts sind in folgenden Netzen möglich?

a) 172.16.0.0/20  
b) 192.168.100.0/29  
c) 10.0.0.0/10  

---

## ÜBUNG 3: Gateway und Routing-Entscheidungen

### Aufgabe 3.1 – Routing-Entscheidungen treffen

Ein Host hat folgende Konfiguration:
- IP: 10.10.50.25
- Subnetzmaske: 255.255.255.0
- Standardgateway: 10.10.50.1

Entscheide für jede Ziel-IP, ob der Host direkt sendet oder das Gateway nutzt:

a) 10.10.50.254  
b) 10.10.51.1  
c) 8.8.8.8  
d) 10.10.50.100  
e) 172.16.0.1  

---

## ÜBUNG 4: IPv4 Sonderadressen klassifizieren

### Aufgabe 4.1 – Adresstypen identifizieren

Klassifiziere jede Adresse (private IP, APIPA, localhost, öffentlich, Multicast, Test/Doku):

a) 172.16.100.50  
b) 127.0.0.100  
c) 169.254.169.254  
d) 203.0.113.5  
e) 224.0.0.5  
f) 192.0.2.100  

---

### Aufgabe 4.2 – Subnetz-Bestandteile erkennen

Gegeben: 172.16.50.0/25

Bestimme:

a) Subnetzmaske (dezimal)  
b) Erste nutzbare Host-Adresse  
c) Letzte nutzbare Host-Adresse  
d) Broadcast-Adresse  
e) Gesamtzahl nutzbarer Hosts  

---

### Aufgabe 4.3 – RFC 1918 Bereiche

Nenne die drei privaten IPv4-Adressbereiche nach RFC 1918 mit ihren CIDR-Notationen.

---

## ÜBUNG 5: Netzklassen und klassische Subnetze

### Aufgabe 5.1 – Klassische Netzklassen bestimmen

Ordne jeder IP-Adresse die Klasse und Standardsubnetzmaske zu:

a) 30.0.0.1  
b) 130.100.50.200  
c) 195.30.50.100  
d) 224.0.0.1  
e) 250.0.0.1  

---

## ÜBUNG 6: VLSM und variable Subnetzmasken

### Aufgabe 6.1 – Netzwerk in verschiedene Größen aufteilen

Du erhältst das Netzwerk 192.168.0.0/23 und brauchst:
- Netz 1: mindestens 100 Hosts
- Netz 2: mindestens 50 Hosts
- Netz 3: mindestens 20 Hosts

Plane mit VLSM und gib für jedes Netz an:
- Präfixlänge
- Netzwerk-ID
- Broadcast-Adresse
- Hostbereich

---

### Aufgabe 6.2 – Drei Bürostandorte vernetzen

Ein Unternehmen hat das Netzwerk 10.0.0.0/20. Teile es mit VLSM für drei Standorte auf:
- Standort A: 60 Arbeitsplätze
- Standort B: 30 Arbeitsplätze
- Standort C: 15 Arbeitsplätze

---

---

# TEIL 2: IPv6 NEUE AUFGABEN

## ÜBUNG 7: IPv6 Struktur und Schreibweise

### Aufgabe 7.1 – IPv6 Grundstruktur

Beantworte folgende Fragen zur IPv6-Struktur:

a) Wie viele Bits und Bytes umfasst eine IPv6-Adresse?  
b) Wie viele hexadezimale Ziffern stehen insgesamt zur Verfügung?  
c) Welche Zahl in der Exponentialform zeigt die Adressanzahl von IPv6?  

---

### Aufgabe 7.2 – IPv6-Adressen komprimieren

Wende alle Kürzungsregeln an und komprimiere maximal:

a) 2001:0db8:0000:0042:0000:8a2e:0000:0001  
b) fe80:0000:0000:0000:0000:0000:0000:0001  
c) 2001:0db8:0000:0000:1234:0000:0000:0000  

---

### Aufgabe 7.3 – Verkürzte Adressen ausschreiben

Schreibe folgende verkürzten IPv6-Adressen vollständig aus (alle Nullen einfügen):

a) 2001:db8:1::1  
b) ::ffff:192.0.2.1  
c) fc00::1  

---

## ÜBUNG 8: IPv6 Adresstypen und ihre Funktionen

### Aufgabe 8.1 – Adresstypen bestimmen und erklären

Klassifiziere folgende IPv6-Adressen und erkläre kurz ihre Funktion:

a) fe80::1  
b) 2001:db8:abcd::1  
c) ff02::1  
d) fd00::1  
e) ::1  

---

### Aufgabe 8.2 – Link-Local vs. Global-Unicast

Erkläre die Unterschiede zwischen Link-Local und Global-Unicast Adressen:

a) Präfixbereich  
b) Routbarkeit  
c) Geltungsbereich  
d) Verwendungszweck  

---

## ÜBUNG 9: Global-Routing-Prefix und 3-1-4-Struktur

### Aufgabe 9.1 – Präfix-Analyse

Gegeben ist das ISP-Präfix: 2001:db8:cafe::/48

a) Welche 3 Blöcke gehören zum Global-Routing-Prefix?  
b) Wie viele Bits bleiben für interne Subnetze (bis zur Standard /64)?  
c) Berechne die maximale Anzahl von /64-Subnetzen  

---

### Aufgabe 9.2 – 3-1-4-Struktur zuordnen

Bei einer typischen Global-Unicast-Adresse mit /64 Präfixlänge:

a) Welche Bits (0–127) gehören zu den 3 Blöcken des Site Prefix?  
b) Welche Bits gehören zur Subnetz-ID?  
c) Welche Bits sind für den Interface-Identifier reserviert?  

---

### Aufgabe 9.3 – Subnetze aus einem ISP-Präfix erzeugen

Aus dem Präfix 2001:db8:1234::/48 erzeuge 8 verschiedene /64-Subnetze und benenne sie nach Abteilungen (IT, HR, Finance, Management, Operations, Support, Legal, Compliance).

---

## ÜBUNG 10: EUI-64 Interface-Identifier Bildung

### Aufgabe 10.1 – MAC zu EUI-64 konvertieren

Gegeben ist die MAC-Adresse: aa:bb:cc:dd:ee:ff

Schreibe Schritt für Schritt auf, wie du daraus den EUI-64-Interface-Identifier erzeugst und kombiniere das Ergebnis mit dem Präfix 2001:db8:5678::/64.

---

### Aufgabe 10.2 – Rückwärts: IPv6-Adresse zu MAC

Gegeben ist folgende IPv6-Adresse: fe80::0211:22ff:fe33:4455

a) Erkenne den EUI-64-Interface-Identifier  
b) Rekonstruiere die ursprüngliche MAC-Adresse  
c) Erkläre kurz, wie du das Bit-Invertieren rückgängig machst  

---

## ÜBUNG 11: SLAAC und DHCPv6 Autokonfiguration

### Aufgabe 11.1 – SLAAC-Prozess beschreiben

Ein IPv6-fähiger Host kommt neu ins Netzwerk. Das Netzwerk nutzt reines SLAAC ohne DHCP.

Beschreibe stichpunktartig die Schritte, wie der Host zu einer Global-Unicast-Adresse kommt:

---

### Aufgabe 11.2 – Vergleichstabelle erstellen

Erstelle eine Vergleichstabelle mit folgenden Kriterien für SLAAC, Stateless DHCP und Stateful DHCPv6:

- Adressvergabe-Quelle
- Zentrale Verwaltung (ja/nein)
- DNS-Konfiguration
- Erforderliche Server
- Best-Practice Einsatzbereich

---

## ÜBUNG 12: IPv6 Subnetting und Vergleiche

### Aufgabe 12.1 – IPv6 Subnetze dimensionieren

Dein Unternehmen erhält das Präfix 2001:db8::/32 von seinem ISP.

a) Wie viele /48-Subnetze lassen sich daraus machen?  
b) Wie viele /64-Subnetze entstehen aus einem /48?  
c) Gib 5 Beispiel-/64-Präfixe an  

---

### Aufgabe 12.2 – IPv4 vs. IPv6 Subnetting Vergleich

Vergleiche IPv4 und IPv6 für diese Szenarien:

Szenario 1: Traditionelles Büronetzwerk mit /24 (IPv4) vs. /64 (IPv6)
- a) Wie viele Hosts maximal?
- b) Wie praktikabel?

Szenario 2: Multiple Standorte vernetzen
- c) Wie teilst du 192.168.0.0/16 für 5 Standorte auf?
- d) Wie teilst du 2001:db8::/32 für 5 Standorte auf?

---

---

# LÖSUNGEN – SEPARATER BLOCK

---

## LÖSUNGEN zu TEIL 1 – IPv4

### Lösung zu Aufgabe 1.1

a) 10.50.100.200 → 00001010.00110010.01100100.11001000

b) 255.128.64.32 → 11111111.10000000.01000000.00100000

c) 8.8.4.4 → 00001000.00001000.00000100.00000100

---

### Lösung zu Aufgabe 1.2

a) 01100100.11000000.10101010.01010101 → 100.192.170.85

b) 11111111.00000000.11111111.00000000 → 255.0.255.0

c) 00010000.00100000.00110000.01000000 → 16.32.48.64

---

### Lösung zu Aufgabe 2.1

a) **Netzwerk-ID: 10.20.0.0**

b) **Ja, 10.20.200.100 liegt im selben Netz** (Netzwerk ist 10.20.0.0/16)

c) **Broadcast-Adresse: 10.20.255.255**

---

### Lösung zu Aufgabe 2.2

a) /16 → **255.255.0.0**

b) /22 → **255.255.252.0** (11111111.11111111.11111100.00000000)

c) /28 → **255.255.255.240** (11111111.11111111.11111111.11110000)

---

### Lösung zu Aufgabe 2.3

a) /20 → 32 − 20 = 12 Hostbits → 2^12 − 2 = **4.094 Hosts**

b) /29 → 32 − 29 = 3 Hostbits → 2^3 − 2 = **6 Hosts**

c) /10 → 32 − 10 = 22 Hostbits → 2^22 − 2 = **4.194.302 Hosts**

---

### Lösung zu Aufgabe 3.1

Alle Adressen mit /24 Subnetzmaske, Netzwerk: 10.10.50.0

a) 10.10.50.254 → **direkt (im selben Netz)**

b) 10.10.51.1 → **Gateway (anderes Netz)**

c) 8.8.8.8 → **Gateway (anderes Netz)**

d) 10.10.50.100 → **direkt (im selben Netz)**

e) 172.16.0.1 → **Gateway (anderes Netz)**

---

### Lösung zu Aufgabe 4.1

a) 172.16.100.50 → **private IP (172.16–172.31)**

b) 127.0.0.100 → **localhost/Loopback**

c) 169.254.169.254 → **APIPA**

d) 203.0.113.5 → **Test/Dokumentation**

e) 224.0.0.5 → **Multicast**

f) 192.0.2.100 → **Test/Dokumentation**

---

### Lösung zu Aufgabe 4.2

/25 → 7 Hostbits

a) **Subnetzmaske: 255.255.255.128**

b) **Erste Hostadresse: 172.16.50.1**

c) **Letzte Hostadresse: 172.16.50.126**

d) **Broadcast-Adresse: 172.16.50.127**

e) **Gesamtzahl: 126 nutzbare Hosts**

---

### Lösung zu Aufgabe 4.3

**RFC 1918 Private Adressbereiche:**

- **10.0.0.0/8** (10.0.0.0 – 10.255.255.255)
- **172.16.0.0/12** (172.16.0.0 – 172.31.255.255)
- **192.168.0.0/16** (192.168.0.0 – 192.168.255.255)

---

### Lösung zu Aufgabe 5.1

a) 30.0.0.1 → **Klasse A, 255.0.0.0**

b) 130.100.50.200 → **Klasse B, 255.255.0.0**

c) 195.30.50.100 → **Klasse C, 255.255.255.0**

d) 224.0.0.1 → **Klasse D (Multicast)**

e) 250.0.0.1 → **Klasse E (Reserviert)**

---

### Lösung zu Aufgabe 6.1

Ausgangsnetz 192.168.0.0/23 (512 Hosts insgesamt)

**Netz 1 (/25 für 126 Hosts):**
- Netzwerk-ID: 192.168.0.0/25
- Broadcast: 192.168.0.127
- Hostbereich: 192.168.0.1 – 192.168.0.126

**Netz 2 (/26 für 62 Hosts):**
- Netzwerk-ID: 192.168.0.128/26
- Broadcast: 192.168.0.191
- Hostbereich: 192.168.0.129 – 192.168.0.190

**Netz 3 (/27 für 30 Hosts):**
- Netzwerk-ID: 192.168.0.192/27
- Broadcast: 192.168.0.223
- Hostbereich: 192.168.0.193 – 192.168.0.222

---

### Lösung zu Aufgabe 6.2

Ausgangsnetz 10.0.0.0/20 (4096 Hosts)

**Standort A (/25):**
- 10.0.0.0/25
- Hosts: 10.0.0.1 – 10.0.0.126

**Standort B (/26):**
- 10.0.0.128/26
- Hosts: 10.0.0.129 – 10.0.0.190

**Standort C (/27):**
- 10.0.0.192/27
- Hosts: 10.0.0.193 – 10.0.0.222

---

## LÖSUNGEN zu TEIL 2 – IPv6

### Lösung zu Aufgabe 7.1

a) **128 Bits = 16 Bytes**

b) **32 hexadezimale Ziffern** (8 Blöcke × 4 Ziffern pro Block)

c) **2^128 ≈ 3,4 × 10^38 Adressen**

---

### Lösung zu Aufgabe 7.2

a) 2001:0db8:0000:0042:0000:8a2e:0000:0001 → **2001:db8:42::8a2e:0:1**

b) fe80:0000:0000:0000:0000:0000:0000:0001 → **fe80::1**

c) 2001:0db8:0000:0000:1234:0000:0000:0000 → **2001:db8::1234:0:0:0** oder **2001:db8:0:0:1234::**

---

### Lösung zu Aufgabe 7.3

a) 2001:db8:1::1 → **2001:0db8:0001:0000:0000:0000:0000:0001**

b) ::ffff:192.0.2.1 → **0000:0000:0000:0000:0000:ffff:c000:0201**

c) fc00::1 → **fc00:0000:0000:0000:0000:0000:0000:0001**

---

### Lösung zu Aufgabe 8.1

a) **fe80::1 – Link-Local:** Lokale Netzwerk-Kommunikation, automatisch generiert

b) **2001:db8:abcd::1 – Global-Unicast:** Öffentliche, weltweit routbare Adresse

c) **ff02::1 – Multicast (All Nodes):** Senden an alle Knoten im lokalen Link

d) **fd00::1 – Unique Local Address (ULA):** Private IPv6-Adresse

e) **::1 – Loopback:** Selbsttest, wie 127.0.0.1 bei IPv4

---

### Lösung zu Aufgabe 8.2

a) **Präfixbereich:** Link-Local = fe80::/10, Global-Unicast = 2000::/3

b) **Routbarkeit:** Link-Local = nicht routbar, Global-Unicast = weltweit routbar

c) **Geltungsbereich:** Link-Local = nur lokales Segment, Global-Unicast = globales Internet

d) **Verwendungszweck:** Link-Local = automatische Netzwerk-Verwaltung, Global-Unicast = normale Kommunikation

---

### Lösung zu Aufgabe 9.1

a) **Erste 3 Blöcke:** 2001:db8:cafe (48 Bits)

b) **Für /64:** 64 − 48 = **16 Bits für Subnetze**

c) **2^16 = 65.536 mögliche /64-Subnetze**

---

### Lösung zu Aufgabe 9.2

a) **Bits 0–47:** Site Prefix (3 Blöcke)

b) **Bits 48–63:** Subnetz-ID (1 Block)

c) **Bits 64–127:** Interface-Identifier (4 Blöcke)

---

### Lösung zu Aufgabe 9.3

Aus 2001:db8:1234::/48:

- **IT:** 2001:db8:1234:0001::/64
- **HR:** 2001:db8:1234:0002::/64
- **Finance:** 2001:db8:1234:0003::/64
- **Management:** 2001:db8:1234:0004::/64
- **Operations:** 2001:db8:1234:0005::/64
- **Support:** 2001:db8:1234:0006::/64
- **Legal:** 2001:db8:1234:0007::/64
- **Compliance:** 2001:db8:1234:0008::/64

---

### Lösung zu Aufgabe 10.1

MAC: aa:bb:cc:dd:ee:ff

**Schritte:**

1. Aufteilen: aa:bb:cc | dd:ee:ff
2. FFFE einfügen: aa:bb:cc:ff:fe:dd:ee:ff
3. U/L-Bit invertieren (aa = 10101010 → 10101000 = a8): a8:bb:cc:ff:fe:dd:ee:ff
4. IPv6-Format: a8bb:ccff:fedd:eeff

**Mit Präfix 2001:db8:5678::/64:**
**2001:db8:5678::a8bb:ccff:fedd:eeff**

---

### Lösung zu Aufgabe 10.2

IPv6: fe80::0211:22ff:fe33:4455

a) **Interface-Identifier: 0211:22ff:fe33:4455**

b) **Rückwärts:**
   - FFFE erkennen: 02:11:22 | 33:44:55
   - U/L-Bit zurücksetzen (02 → 00): 00:11:22:33:44:55
   
   **Ursprüngliche MAC: 00:11:22:33:44:55**

c) Das erste Byte 02 (binär: 00000010) wird zurück auf 00 gesetzt (Bit 7 = 0)

---

### Lösung zu Aufgabe 11.1

**SLAAC-Prozess:**

1. Host generiert Link-Local-Adresse (fe80::/10 + eigener EUI-64)
2. Duplicate Address Detection (DAD) durchführen
3. Router Solicitation (RS) an ff02::2 senden
4. Router antwortet mit Router Advertisement (RA) + Präfix
5. Host kombiniert RA-Präfix + eigene Interface-ID
6. Wieder DAD durchführen
7. Global-Unicast-Adresse ist einsatzbereit

---

### Lösung zu Aufgabe 11.2

| Kriterium | SLAAC | Stateless DHCP | Stateful DHCPv6 |
|-----------|-------|---|---|
| **Adressvergabe** | Host selbst | Host selbst | DHCP-Server |
| **Zentral verwaltet** | Nein | Nein | Ja |
| **DNS-Konfiguration** | RA/RDNSS | DHCP | DHCP |
| **Server nötig** | Nur Router | Router + DHCP | DHCP-Server |
| **Best Practice für** | Clients, IoT | Gemischte Netze | Unternehmensnetze |

---

### Lösung zu Aufgabe 12.1

a) /32 → /48: 48 − 32 = 16 Bits → **2^16 = 65.536 /48-Subnetze**

b) /48 → /64: 64 − 48 = 16 Bits → **2^16 = 65.536 /64-Subnetze**

c) **5 Beispiel-/64-Präfixe:**
   - 2001:db8:0:0001::/64
   - 2001:db8:0:0002::/64
   - 2001:db8:0:0003::/64
   - 2001:db8:0:0004::/64
   - 2001:db8:0:0005::/64

---

### Lösung zu Aufgabe 12.2

**Szenario 1: Büronetzwerk /24 vs. /64**

a) IPv4 /24: 254 Hosts | IPv6 /64: 2^64 Hosts

b) IPv4 praktikabel für mittlere Büros, IPv6 deutlich überdimensioniert

**Szenario 2: Multiple Standorte**

c) **IPv4 (192.168.0.0/16):** In /21 aufteilen (2^(21−16) = 32 Subnetze)
   - Standort 1: 192.168.0.0/21
   - Standort 2: 192.168.8.0/21
   - Standort 3: 192.168.16.0/21
   - Standort 4: 192.168.24.0/21
   - Standort 5: 192.168.32.0/21

d) **IPv6 (2001:db8::/32):** In /48 aufteilen (2^(48−32) = 65.536 Subnetze)
   - Standort 1: 2001:db8:0001::/48
   - Standort 2: 2001:db8:0002::/48
   - Standort 3: 2001:db8:0003::/48
   - Standort 4: 2001:db8:0004::/48
   - Standort 5: 2001:db8:0005::/48

---

## Abschlusswort

Du hast nun ein zweites komplettes Übungsset durchgearbeitet! Die Themen sind genauso strukturiert wie die Klassenarbeit:

✅ IPv4: Umrechnung, Subnetting, Sonderadressen, VLSM  
✅ IPv6: Struktur, Adresstypen, EUI-64, Autokonfiguration, Subnetting  

**Tipp:** Versuche diese Aufgaben ohne Lösungen zu lösen und nutze die Lösungen nur zur Überprüfung.

**Viel Erfolg beim Lernen und bei deiner Klassenarbeit am 01.12.2025!** 🚀
