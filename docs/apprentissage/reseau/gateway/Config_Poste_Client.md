---
title: Configuration Poste Client
type: Configuration
tags: [réseau, client, config]
---

# Configuration Poste Client

Pour qu'une machine du LAN bénéficie de l'accès à travers la [[Passerelle_Linux]], sa configuration réseau doit correspondre au segment de l'interface LAN de la passerelle.

Exemple de configuration statique (Poste H1) :

- **Adresse IP :** `192.168.0.2`
- **Masque :** `255.255.255.0`
- **Passerelle par défaut :** `192.168.0.1`

*La passerelle par défaut doit impérativement être l'adresse IP de l'interface `enp0s8` de la passerelle.*
