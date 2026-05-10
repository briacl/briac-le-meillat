---
title: Calcul du Nombre d'Hôtes (Formule)
type: Procédure
tags: [réseau, ip, calcul]
---

# Calcul du Nombre d'Hôtes (Formule)

Pour déterminer combien de machines (hôtes) peuvent être adressées dans un réseau, on utilise une formule basée sur le nombre de bits disponibles dans la partie machine du [[Masque_IP_Definition]].

### La Formule
$$Nombre\ d'hôtes = 2^n - 2$$

Où **$n$** représente le nombre de bits à zéro dans le masque (partie HostID).

### Pourquoi "- 2" ?
On soustrait systématiquement deux adresses car elles ne sont pas attribuables à des machines :
1. L'[[Adresse_Reseau_vs_Broadcast]] (Network ID).
2. L'adresse de Diffusion (Broadcast).

### Exemple
Dans un réseau en `/24` (24 bits réseau, 8 bits machine) :
- $n = 8$
- $2^8 - 2 = 256 - 2 = 254$ adresses utilisables.

Ce calcul définit l'étendue de la [[Plage_IP_Utilisables]].


[[reseau]]
