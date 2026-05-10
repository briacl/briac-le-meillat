---
title: Configuration du NAT Masquerade
type: Procédure
tags: [linux, iptables, nat, procedure]
---

# Configuration du NAT Masquerade

La mise en place du masquage d'adresses sur une [[Passerelle_Linux]] s'effectue généralement avec `iptables`.

### Étapes :
1. **Identifier l'interface WAN :** Déterminer quelle interface est connectée au réseau extérieur (ex: `enp0s3`).
2. **Appliquer la règle de masquage :** Utiliser la table `nat` pour modifier les paquets en sortie. Voir les `[[Commandes_Iptables_NAT]]`.
3. **Vérification :** S'assurer que les clients du LAN peuvent désormais pinguer une adresse externe.

Cette procédure met en œuvre le concept de [[NAT_Masquerade]].
