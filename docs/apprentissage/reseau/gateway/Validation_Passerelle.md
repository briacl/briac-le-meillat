---
title: Validation de la Passerelle
type: Procédure
tags: [réseau, test, linux, procedure]
---

# Validation de la Passerelle

Une fois la [[Passerelle_Linux]] configurée, il est impératif de valider le bon fonctionnement du routage et du NAT depuis un client du réseau local.

### Protocole de test :
1. **Test de connectivité locale :**
   Pinguer l'interface LAN de la passerelle (ex: `192.168.0.1`).
2. **Test de connectivité externe (IP) :**
   Pinguer une adresse IP publique (ex: `8.8.8.8` ou `1.1.1.1`).
3. **Analyse du saut (Traceroute) :**
   Utiliser `traceroute` pour confirmer que le premier saut passe bien par l'adresse LAN de la passerelle.

Si ces tests réussissent, cela confirme que l'[[IP_Forwarding]] et le [[NAT_Masquerade]] sont opérationnels.
