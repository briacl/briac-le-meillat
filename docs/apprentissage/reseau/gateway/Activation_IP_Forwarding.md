---
title: Activation de l'IP Forwarding
type: Procédure
tags: [linux, réseau, procedure]
---

# Activation de l'IP Forwarding

Pour activer le transfert de paquets sur une machine Linux servant de [[Passerelle_Linux]], suivez ces étapes :

1. **Vérifier l'état actuel :**
   Consultez la valeur du paramètre noyau via [[Commandes_IP_Forwarding]].
2. **Activation immédiate :**
   Écrivez la valeur `1` dans le fichier de configuration du système de fichiers `/proc`.
3. **Persistance (Optionnel) :**
   Pour une activation permanente au démarrage, modifiez le fichier `/etc/sysctl.conf`.

Cette procédure s'appuie sur le concept théorique de l'[[IP_Forwarding]].
