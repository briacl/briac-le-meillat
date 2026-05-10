---
title: Adresses Privées (RFC 1918)
type: Concept
tags: [réseau, ip, rfc1918, lan]
---

# Adresses Privées (RFC 1918)

Les **adresses privées** sont des plages d'adresses IPv4 réservées pour un usage exclusif à l'intérieur des réseaux locaux (LAN). Contrairement aux adresses publiques, elles ne sont **pas routables** sur Internet.

### Plages Définies par la RFC 1918
- **Classe A** : `10.0.0.0` à `10.255.255.255`
- **Classe B** : `172.16.0.0` à `172.31.255.255`
- **Classe C** : `192.168.0.0` à `192.168.255.255`

### Communication Extérieure
Comme ces adresses sont invisibles sur le réseau mondial, une machine disposant d'une adresse privée doit obligatoirement passer par un mécanisme de [[NAT_Masquerade]] (généralement configuré sur une [[Passerelle_Linux]]) pour communiquer avec l'extérieur.

Cela permet d'économiser les adresses IPv4 publiques et de sécuriser le réseau interne.


[[reseau]]
