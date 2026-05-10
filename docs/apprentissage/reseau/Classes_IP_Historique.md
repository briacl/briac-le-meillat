---
title: Classes IP Historiques
type: Concept
tags: [réseau, ip, historique]
---

# Classes IP Historiques

Avant la généralisation de la [[Notation_CIDR]], les adresses IPv4 étaient organisées en classes rigides selon leurs premiers bits.

### Les trois classes principales
- **Classe A** : Premier bit à `0` (réseaux 0.0.0.0 à 127.255.255.255). 
  - Masque par défaut : `/8` (`255.0.0.0`).
- **Classe B** : Premiers bits à `10` (réseaux 128.0.0.0 à 191.255.255.255). 
  - Masque par défaut : `/16` (`255.255.0.0`).
- **Classe C** : Premiers bits à `110` (réseaux 192.0.0.0 à 223.255.255.255). 
  - Masque par défaut : `/24` (`255.255.255.0`).

Cette architecture a été remplacée par le routage sans classe (CIDR) pour optimiser l'utilisation des adresses.


[[reseau]]
