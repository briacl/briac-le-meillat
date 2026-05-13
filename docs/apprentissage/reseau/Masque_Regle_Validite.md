---
title: Règle de Validité d'un Masque
type: Concept
tags: [réseau, ip, masque]
---

# Règle de Validité d'un Masque

Pour être valide, un masque IPv4 doit respecter une règle binaire stricte : il doit être constitué d'une **suite ininterrompue de 1** suivie d'une **suite ininterrompue de 0**.

### Exemples
- **Masque Valide** : `255.255.0.0`
  *(Binaire : 11111111.11111111.00000000.00000000)*
- **Masque Invalide** : `255.0.0.255`
  *(Binaire : 11111111.00000000.00000000.11111111)* -> Le retour à des "1" après des "0" est interdit.

### Les Nombres Magiques
En notation décimale, les valeurs valides pour un octet de masque sont limitées :
- `128` (10000000)
- `192` (11000000)
- `224` (11100000)
- `240` (11110000)
- `255` (11111111)

Cette règle est fondamentale pour le [[Masque_IP_Definition]] et la [[Notation_CIDR]].


[[reseau]]
