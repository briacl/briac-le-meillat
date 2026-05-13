---
title: Configuration des Interfaces Gateway
type: Configuration
tags: [linux, réseau, config]
---

# Configuration des Interfaces Gateway

Paramétrage des adresses IP statiques sur la machine [[Passerelle_Linux]] (Exemple Ubuntu/Debian) :

**Interface WAN (Externe) :**
- interface : `enp0s3`
- Mode : DHCP ou IP Fixe (selon réseau hôte)

**Interface LAN (Interne) :**
- interface : `enp0s8`
- Adresse IP : `192.168.0.1`
- Masque : `255.255.255.0`
