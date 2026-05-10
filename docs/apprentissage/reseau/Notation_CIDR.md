---
title: Notation CIDR (Classless Inter-Domain Routing)
type: Concept
tags: [réseau, ip, masque, cidr]
---

# Notation CIDR (Classless Inter-Domain Routing)

La **Notation CIDR** (ou notation préfixe) est une manière simplifiée d'écrire un [[Masque_IP_Definition]]. Elle s'écrit avec un slash `/` suivi du nombre de bits à "1" dans le masque.

### Correspondances Courantes
- **/8** = `255.0.0.0` (Les 8 premiers bits sont à 1)
- **/16** = `255.255.0.0` (Les 16 premiers bits sont à 1)
- **/24** = `255.255.255.0` (Les 24 premiers bits sont à 1)

Cette notation permet une plus grande flexibilité par rapport aux [[Classes_IP_Historique]] en autorisant des masques personnalisés pour optimiser le découpage des sous-réseaux.


[[reseau]]
