---
title: NAT Masquerade
type: Concept
tags: [réseau, linux, nat]
---

# NAT Masquerade

Le **NAT Masquerade** (Source NAT dynamique) est un mécanisme permettant à plusieurs machines d'un réseau local privé de partager une seule adresse IP publique pour accéder à un réseau extérieur.

Le routeur (ou la [[Passerelle_Linux]]) remplace l'adresse IP source des paquets sortants par sa propre adresse IP WAN. Au retour, il effectue l'opération inverse pour rediriger le paquet vers la machine locale concernée. Ce mécanisme est essentiel pour connecter des réseaux utilisant des adresses privées (ex: 192.168.0.x) à Internet.
