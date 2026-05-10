---
title: Commandes IP Forwarding
type: Configuration
tags: [linux, shell, config]
---

# Commandes IP Forwarding

Commandes pour gérer l'[[IP_Forwarding]] sur Linux :

**Vérification de l'état :**

Bash
```bash
cat /proc/sys/net/ipv4/ip_forward
# 0 = Désactivé, 1 = Activé
```

**Activation immédiate (non persistante) :**

Bash
```bash
sudo echo 1 > /proc/sys/net/ipv4/ip_forward
```

**Activation via sysctl :**

Bash
```bash
sudo sysctl -w net.ipv4.ip_forward=1
```
