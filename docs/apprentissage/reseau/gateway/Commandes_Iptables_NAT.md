---
title: Commandes Iptables NAT
type: Configuration
tags: [linux, iptables, nat, config]
---

# Commandes Iptables NAT

Directive pour activer le [[NAT_Masquerade]] sur l'interface de sortie (WAN) :

Bash
```bash
sudo iptables -t nat -A POSTROUTING -o enp0s3 -j MASQUERADE
```

*Note : Remplacez `enp0s3` par le nom réel de votre interface externe connectée au réseau hôte ou Internet.*

**Lister les règles NAT actives :**

Bash
```bash
sudo iptables -t nat -L -v -n
```
