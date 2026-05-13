---
title: Adresse Réseau vs Adresse de Broadcast
type: Concept
tags: [réseau, ip, broadcast]
---

# Adresse Réseau vs Adresse de Broadcast

Dans chaque segment réseau IPv4, deux adresses sont réservées et ne peuvent être attribuées à un équipement. Elles marquent les limites logiques du groupe.

### L'Adresse Réseau (Network ID)
C'est "l'identifiant" ou le nom du groupe. On l'obtient en mettant tous les bits de la partie machine à **0**.
- **Usage** : Utilisée par les routeurs pour diriger les paquets vers le bon segment.
- **Exemple** : Pour `11.12.13.14/8`, l'adresse réseau est `11.0.0.0`.

### L'Adresse de Diffusion (Broadcast)
Elle permet de communiquer simultanément avec toutes les machines du segment. On l'obtient en mettant tous les bits de la partie machine à **1**.
- **Usage** : Protocoles de découverte (ARP, DHCP).
- **Exemple** : Pour `200.1.23.45/24`, l'adresse de diffusion est `200.1.23.255`.

Ces deux adresses délimitent la [[Plage_IP_Utilisables]]. Le nombre de machines entre ces bornes se calcule via la [[Calcul_Nombre_Hotes_Formule]].


[[reseau]]
