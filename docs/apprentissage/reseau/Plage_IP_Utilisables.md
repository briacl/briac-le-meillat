---
title: Plage d'Adresses IP Utilisables
type: Concept
tags: [réseau, ip, configuration]
---

# Plage d'Adresses IP Utilisables

La **plage d'adresses utilisables** désigne l'ensemble des adresses IP qui peuvent être réellement configurées sur des interfaces réseaux (serveurs, postes clients, routeurs) au sein d'un segment donné.

### Bornes de la plage
La plage est délimitée par les deux adresses réservées identifiées dans [[Adresse_Reseau_vs_Broadcast]] :
- **Début de plage** : Adresse Réseau + 1.
- **Fin de plage** : Adresse de Broadcast - 1.

### Illustration
Pour un réseau `192.168.1.0/24` :
- Adresse Réseau : `192.168.1.0`
- Adresse Broadcast : `192.168.1.255`
- **Plage utilisable** : `192.168.1.1` à `192.168.1.254`.

L'organisation de ces adresses au sein de la plage répond souvent à une [[Strategie_Adressage_Reseau]] précise.


[[reseau]]
