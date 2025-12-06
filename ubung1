# Neue Übungsaufgaben zu IPv4 und IPv6

---

## Teil 1: IPv4 Neues Übungsset

### Aufgabe 1 – IPv4 Oktett-Umwandlung

Wandle die nachfolgenden IPv4-Adressen in ihre binäre Darstellung um (8 Bit pro Oktett):

- 172.20.15.4  
- 192.0.2.45  
- 10.255.255.1  

---

### Aufgabe 2 – IPv4 Netzwerkanalyse und Subnetzmaske

Gegeben ist die IP 172.20.10.50 und Subnetzmaske 255.255.0.0.

a) Welche Adresse zeigt die Netzwerk-ID an?  
b) Wie viele Hostadressen sind maximal in diesem Netz möglich?  
c) Befindet sich die Adresse 172.20.100.100 noch im selben Netzwerk?  

---

### Aufgabe 3 – IPv4 Standardgateway Verhalten

In einem lokalen Netzwerk mit der IP 192.168.20.10/24 ist das Gateway auf 192.168.20.1 eingestellt.

Für welche der folgenden Ziel-IP-Adressen wird das Paket direkt gesendet, und für welche wird das Gateway benutzt?

- 192.168.20.200  
- 192.168.21.10  
- 10.0.0.5  

---

### Aufgabe 4 – IPv4-Sonderadressen erkennen

Ordne jede der folgenden IP-Adressen einem besonderen Typ zu: private Adresse, localhost, auto-konfiguriert (APIPA), öffentliche Adresse, Multicast.

- 169.254.25.100  
- 10.10.10.10  
- 127.255.255.254  
- 198.51.100.1  
- 239.0.0.1  

---

### Aufgabe 5 – IPv4 Subnetzaufteilung

Du hast das Netz 10.0.0.0/22 und brauchst mindestens 3 Subnetze mit mindestens 300 Hosts.

a) Wie groß muss die neue Subnetzmaske mindestens sein?  
b) Gib ein Beispiel für ein Subnetz mit gültigen Hostbereichen und Broadcastadresse.  

---

## Teil 2: IPv6 Neues Übungsset

### Aufgabe 6 – IPv6 Grundlagen

Beantworte die folgenden Fragen:

a) In wie viele Hex-Blöcke wird eine IPv6-Adresse aufgeteilt?  
b) Wie viele Bit hat jeder Block?  
c) Nenne die Hex-Notation einer Adresse, die alle Nullen hat, außer der letzten Ziffer 1.  

---

### Aufgabe 7 – IPv6-Komprimierung

Komprimiere die folgenden IPv6-Adressen nach den offiziellen Kürzungsregeln:

- 2001:0db8:0000:0000:0000:1234:0000:0001  
- fe80:0000:0000:0000:0202:b3ff:fe1e:8329  
- ::1  

---

### Aufgabe 8 – IPv6 Adresstypen bestimmen

Bestimme, ob die folgende IPv6-Adresse Link-Local, Global-Unicast oder Multicast ist:

- fe80::abcd:1234:5678  
- 2001:0db8:85a3::8a2e:0370:7334  
- ff0e::1  

---

### Aufgabe 9 – IPv6 Subnetzaufteilung

Du hast das Präfix 2001:db8::/48 und teilst es in Subnetze mit /60.

a) Wie viele solche /60-Subnetze kannst du erzeugen?  
b) Gib drei beispielhafte Subnetzpräfixe an.  

---

### Aufgabe 10 – EUI-64 Adresse aus MAC generieren

Gegeben ist die MAC-Adresse 00:25:96:ff:fe:12:34:56

a) Erstelle daraus die Interface Identifier nach EUI-64.  
b) Kombiniere das Ergebnis mit dem Präfix 2001:db8:85a3::/64 und gib die vollständige IPv6-Adresse an.  

---

### Aufgabe 11 – IPv6 Autokonfiguration

Erkläre stichpunktartig den Unterschied zwischen SLAAC und Stateful DHCPv6.

---

# Lösungen

### Lösung zu Aufgabe 1

a) 172.20.15.4 → 10101100.00010100.00001111.00000100  
b) 192.0.2.45 → 11000000.00000000.00000010.00101101  
c) 10.255.255.1 → 00001010.11111111.11111111.00000001  

---

### Lösung zu Aufgabe 2

a) 172.20.0.0  
b) 2^(32−16) − 2 = 65.534 Hosts  
c) Ja, 172.20.100.100 liegt noch im Netzwerk (Netzwerk-ID ist 172.20.0.0)  

---

### Lösung zu Aufgabe 3

- 192.168.20.200 → direkt  
- 192.168.21.10 → Gateway  
- 10.0.0.5 → Gateway  

---

### Lösung zu Aufgabe 4

- 169.254.25.100 → APIPA  
- 10.10.10.10 → private IP  
- 127.255.255.254 → localhost  
- 198.51.100.1 → öffentliche Adresse (Test/Dokumentation)  
- 239.0.0.1 → Multicast  

---

### Lösung zu Aufgabe 5

a) Maske mindestens /23 (weil /23 insgesamt 512 Hosts zulässt, /22 wären 1022 Hosts)  
b) Beispiel: 10.0.0.0/23  
Netzwerk-ID: 10.0.0.0  
Hostbereich: 10.0.0.1 – 10.0.1.254  
Broadcast: 10.0.1.255  

---

### Lösung zu Aufgabe 6

a) 8 Blöcke  
b) 16 Bit  
c) ::1 (voll ausgeschrieben: 0000:0000:0000:0000:0000:0000:0000:0001)  

---

### Lösung zu Aufgabe 7

- 2001:db8::1234:0:1  
- fe80::202:b3ff:fe1e:8329  
- ::1  

---

### Lösung zu Aufgabe 8

- fe80::abcd:1234:5678 → Link-Local  
- 2001:0db8:85a3::8a2e:0370:7334 → Global-Unicast  
- ff0e::1 → Multicast  

---

### Lösung zu Aufgabe 9

a) 2^(60−48) = 2^12 = 4096 Subnetze  
b) Beispiele:  
- 2001:db8:0:0::/60  
- 2001:db8:0:1::/60  
- 2001:db8:0:2::/60  

---

### Lösung zu Aufgabe 10

a) MAC 00:25:96:ff:fe:12:34:56 → EUI-64 Interface Identifier: 0225:96ff:fe12:3456  
b) Vollständige IPv6-Adresse: 2001:db8:85a3::0225:96ff:fe12:3456  

---

### Lösung zu Aufgabe 11

- SLAAC: Adresse wird vom Host selbst erzeugt mit Prefix vom Router, kein DHCP nötig.  
- Stateful DHCPv6: DHCP-Server vergibt Adressen zentral und verwaltet sie.  

---

Du kannst diese Aufgaben verwenden, um einen alternativen Übungsansatz zu bekommen und dich weiter auf deine Klassenarbeit vorzubereiten! Bei Bedarf erstelle ich dir auch die Datei als Markdown-Datei.
