---
title: "Passerelle Linux : NAT & Routage"
module: "R101"
competence: "Connecter"
ac_lies: ["AC11.01", "AC11.02"]
techs: ["Linux", "Iptables", "NAT", "Routage"]
date: "2025-10-12"
status: "Terminé"
---

# Mise en place d'une Passerelle Linux (NAT & Routage)

**Auteur :** Briac Le Meillat

**Date :** Octobre 2025

**Projet :** TP R1.01 - Initiation aux Réseaux et Technologies Internet


---

## 1. Objectifs du TP

L'objectif principal est de créer un réseau local (LAN) privé et de permettre aux machines de ce réseau d'accéder au réseau de l'IUT ainsi qu'à Internet. Pour cela, une machine **Ubuntu Server** est configurée comme passerelle assurant le routage et le NAT (Network Address Translation).

---

## 2. Architecture du Réseau

La topologie repose sur une segmentation entre le réseau interne et le réseau d'infrastructure de l'IUT :

- **Réseau Interne (LAN) :** `192.168.0.0/24`
- **Passerelle (Ubuntu Server) :**
  - `enp0s3` (Bridge IUT) : IP dynamique via DHCP.
  - `enp0s8` (Interne) : `192.168.0.1` (statique).
- **Client (Ubuntu Desktop) :** IP `192.168.0.2` avec pour passerelle par défaut `192.168.0.1`.

---

## 3. Configuration de la Passerelle (Ubuntu Server)

### 3.1 Activation des interfaces et adressage
Nous avons activé l'interface interne pour permettre la communication avec le LAN.

**Commandes exécutées :**
```bash
sudo ip link set dev enp0s8 up
sudo ip a add 192.168.0.1/24 dev enp0s8
```

### 3.2 Activation du Forwarding (Routage)
Par défaut, le noyau Linux ne transmet pas les paquets entre les interfaces. Cette fonction doit être activée manuellement.

**Commande immédiate :**
```bash
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
```

**Configuration permanente (`/etc/sysctl.conf`) :**
```text
net.ipv4.ip_forward=1
```

### 3.3 Mise en place du NAT (Masquerade)
Pour que les machines du LAN soient reconnues sur le réseau extérieur, la passerelle doit masquer leurs adresses IP privées derrière sa propre IP publique.

**Commandes exécutées :**
```bash
sudo iptables -t nat -A POSTROUTING -o enp0s3 -j MASQUERADE
```
*Vérification :* La commande `sudo iptables -t nat -L -n -v` permet d'observer l'incrémentation des compteurs de paquets.

---

## 4. Configuration du Client (Ubuntu Desktop)

### 4.1 Adressage et Route par défaut
Le client doit être configuré pour envoyer ses paquets hors du réseau local vers l'adresse de la passerelle.

**Commandes exécutées :**
```bash
sudo ip a add 192.168.0.2/24 dev enp0s3
sudo ip route add default via 192.168.0.1
```

### 4.2 Résolution de noms (DNS) et Fichier Hosts
En raison de restrictions sur le firewall de l'IUT, la résolution via `8.8.8.8` a échoué. Nous avons utilisé le fichier `/etc/hosts` pour une résolution locale vers le serveur de TP.

**Édition du fichier `/etc/hosts` :**
```text
172.31.25.9    iut-rt
```
Ceci permet d'accéder à `http://iut-rt` sans interroger de serveur DNS externe.

---

## 5. Problèmes rencontrés et Résolutions

| Problème | Cause | Résolution |
| :--- | :--- | :--- |
| **Réseau inaccessible** | Pas de route par défaut sur le client | Ajout de la commande `ip route add default` |
| **Host Unreachable** | Forwarding non activé sur le serveur | `echo 1 > /proc/sys/net/ipv4/ip_forward` |
| **Ping OK, Web KO** | DNS non configuré | Utilisation du fichier `/etc/hosts` pour `iut-rt` |
| **Ping Windows KO** | Pare-feu bloquant l'ICMP | Activation du partage de fichiers ou arrêt pare-feu |

---

## 6. Accès Internet et Perspectives

L'accès aux sites extérieurs nécessite la configuration du proxy départemental dans le navigateur :
- **Hôte :** `cache-etu.univ-artois.fr`
- **Port :** `3128`

**État actuel :** Le routage IP et le NAT sont pleinement fonctionnels. Le client parvient à atteindre les ressources du réseau IUT.
**Étape suivante :** Automatisation de la configuration DNS via `nmcli` ou `resolvectl` sur la passerelle pour une injection propre dans le `resolv.conf` du client.