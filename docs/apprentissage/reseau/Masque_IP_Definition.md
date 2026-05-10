---
title: Masque de Sous-Réseau (Subnet Mask)
type: Concept
tags: [réseau, ip, masque]
---

# Masque de Sous-Réseau (Subnet Mask)

Un **Masque de Sous-Réseau** est une suite de 32 bits qui accompagne systématiquement une adresse IPv4. Sa fonction principale est de diviser l'adresse IP en deux parties distinctes :

1. **La partie RÉSEAU (NetID)** : Elle identifie le groupe ou le segment réseau auquel appartient l'équipement.
2. **La partie MACHINE (HostID)** : Elle identifie l'équipement spécifique (ordinateur, serveur, imprimante) au sein de ce groupe.

### Utilité
Le masque permet aux routeurs de déterminer si une destination est locale ou distante. Cette distinction est opérée via le [[Calcul_Adresse_Reseau_AND]].

La structure binaire d'un masque doit suivre une [[Masque_Regle_Validite]] stricte et peut être représentée via la [[Notation_CIDR]].


[[reseau]]
