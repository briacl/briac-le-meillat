---
title: Stratégie d'Adressage Réseau
type: Procédure
tags: [réseau, ip, administration, best-practices]
---

# Stratégie d'Adressage Réseau

Pour faciliter l'administration et le dépannage d'un parc informatique, il est recommandé d'adopter une stratégie de réservation des adresses au sein de la [[Plage_IP_Utilisables]].

### La Règle des Extrémités
Une pratique courante consiste à réserver les adresses aux deux bouts de la plage pour les équipements fixes et les infrastructures :

1. **Premières adresses (Début de plage)** : Réservées aux équipements fixes et serveurs.
   - *Exemple :* `.1` à `.20` pour les serveurs locaux, imprimantes réseau et postes administratifs fixes.
2. **Dernières adresses (Fin de plage)** : Traditionnellement réservées aux interfaces des routeurs et [[Passerelle_Linux]].
   - *Exemple :* `.254` est souvent choisi comme adresse de passerelle par défaut dans un réseau `/24`.

### Dynamic Host Configuration Protocol (DHCP)
Le milieu de la plage est généralement laissé libre pour le serveur DHCP, qui distribue automatiquement les adresses aux postes clients mobiles.

Cette organisation permet d'identifier rapidement le type d'équipement simplement par son adresse IP.


[[reseau]]
