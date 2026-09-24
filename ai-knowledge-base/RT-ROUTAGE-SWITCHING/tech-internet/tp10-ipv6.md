---
title: "Mise en place d'un réseau IPv6 : SLAAC et DHCPv6 Stateless"
module: "R201"
competence: ["Administrer", "Connecter"]
ac_lies: ["AC11.03", "AC11.02"]
techs: ["IPv6", "Cisco", "Adressage"]
date: "2026-06-08"
status: "Terminé"
image: ""
---
# Compte-Rendu Technique : Réseau IPv6 physique avec SLAAC et DHCPv6 Stateless
> **R201 — Mise en place d'un réseau IPv6 : SLAAC et DHCPv6 Stateless** — *Briac Le Meillat (08/06/2026)*

**Objectif :** Transition d'une topologie IPv6 sous Cisco Packet Tracer vers une infrastructure physique réelle. L'objectif est de configurer le routage IPv6 sur un équipement Cisco central ("France"), puis de permettre à des machines virtuelles Ubuntu (PC1 côté "Paris", PC2/PC3 côté "Bruxelles") de s'autoconfigurer dynamiquement via SLAAC tout en récupérant un serveur DNS via DHCPv6 Stateless.

## 💡 C'est quoi IPv6, SLAAC et DHCPv6 ?
Vous saviez qu'on avait épuisé la quasi-totalité des adresses IPv4 sur Internet ? Pour éviter que le monde ne s'arrête de tourner, on a inventé **IPv6**. C'est le même principe, mais avec tellement d'adresses disponibles qu'on pourrait en donner une à chaque grain de sable sur Terre !

Mais configurer des IP à rallonge composées de lettres et de chiffres, c'est pénible.
Heureusement, IPv6 est super intelligent : il permet aux ordinateurs de se débrouiller tout seuls grâce à **SLAAC** (Stateless Address Autoconfiguration). Le routeur crie simplement sur le réseau : *"Hé tout le monde, on est dans la rue 2001:DB8:ACAD:A, complétez vous-mêmes la fin de votre adresse avec votre adresse matérielle (MAC) !"* Et hop, le PC fabrique son adresse IPv6 officielle tout seul, sans qu'un administrateur n'ait rien à faire !

Le seul problème de SLAAC, c'est que le routeur ne donne pas l'adresse du serveur DNS (l'annuaire indispensable pour naviguer sur le web). On va donc rajouter un serveur **DHCPv6 Stateless** : il ne distribuera pas d'adresses IP (le PC l'a déjà fait tout seul), mais il donnera juste cette petite option DNS manquante. Un vrai travail d'équipe !

---

## 💡 1. Configuration du Routeur (Passerelle IPv6)

### 💡 L'explication vulgarisée

Contrairement à IPv4, l'IPv6 repose sur deux types d'adresses fondamentales pour chaque interface :

- **LLA (Link-Local Address - `FE80::/10`)** : C'est une adresse non routable, cantonnée à son propre segment (son "lien"). Elle sert aux équipements locaux pour discuter entre eux et trouver la passerelle. Il est tout à fait légitime d'avoir la même LLA (`FE80::1`) sur plusieurs interfaces du routeur puisqu'elles ne se croiseront jamais.
- **GUA (Global Unicast Address - `2001::/3`)** : C'est l'adresse publique et routable sur Internet. Le routeur va s'en servir pour acheminer les paquets d'un réseau à l'autre (de Bruxelles vers Paris).

---

### 🖥️ Implémentation sur le routeur Cisco (France)

L'étape cruciale consiste à allumer le moteur de routage IPv6, sans quoi le routeur se comporte comme un simple hôte muet.

```cisco
Router> enable
Router# configure terminal
Router(config)# hostname France

! Activer le routage IPv6 (Étape critique)
France(config)# ipv6 unicast-routing

! Création du pool DHCPv6 Stateless (Ne distribue que le DNS)
France(config)# ipv6 dhcp pool R201POOL
France(config-dhcpv6)# dns-server 2001:4860:4860::8888
France(config-dhcpv6)# exit

! Configuration de l'interface g0/0 (Réseau A - Côté Paris)
France(config)# interface GigabitEthernet0/0
France(config-if)# ipv6 address FE80::1 link-local
France(config-if)# ipv6 address 2001:DB8:ACAD:A::1/64
France(config-if)# ipv6 nd other-config-flag
France(config-if)# ipv6 dhcp server R201POOL
France(config-if)# no shutdown
France(config-if)# exit

! Configuration de l'interface g0/1 (Réseau B - Côté Bruxelles)
France(config)# interface GigabitEthernet0/1
France(config-if)# ipv6 address FE80::1 link-local
France(config-if)# ipv6 address 2001:DB8:ACAD:B::1/64
France(config-if)# ipv6 nd other-config-flag
France(config-if)# ipv6 dhcp server R201POOL
France(config-if)# no shutdown
```

> [!NOTE]
> Le paramètre `ipv6 nd other-config-flag` modifie les annonces routeurs (Router Advertisements). Il lève le drapeau "O" (Other) pour indiquer aux PC : "Vous avez généré votre IP via SLAAC, mais allez interroger le serveur DHCPv6 pour récupérer les autres options, comme le DNS".

---

## 🐧 2. Configuration côté Client (Machine Ubuntu)

### 💡 L'explication vulgarisée

Sur notre machine Linux (PC3), le client DHCPv6 n'est pas toujours activé par défaut pour écouter les annonces du routeur. Il a fallu modifier le fichier de configuration réseau Netplan pour forcer l'interface à accepter les "Router Advertisements" (SLAAC) et à déclencher une requête DHCPv6.

---

### 🖥️ Modification de Netplan

Nous avons édité le fichier YAML pour indiquer le comportement attendu sur notre interface physique `enp0s3`.

```bash
sudo nano /etc/netplan/01-network-manager-all.yaml
```

Contenu appliqué :

```yaml
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enp0s3:
      dhcp4: false
      dhcp6: true
      accept-ra: true
```

---

### 🛠️ Dépannage et application de la configuration

> [!WARNING]
> Malgré la commande standard `sudo netplan apply`, la VM ne récupérait ni la GUA ni le DNS. Le responsable était le gestionnaire NetworkManager qui restait "sourd" aux modifications de l'interface en tâche de fond.

Pour débloquer la pile réseau IPv6 et forcer la réapplication instantanée sur l'interface, les commandes suivantes ont été nécessaires et salvatrices :

```bash
# Relancer le service global
sudo systemctl restart NetworkManager

# Forcer la réapplication de la configuration sur l'interface spécifique
sudo nmcli device reapply enp0s3
```

Suite à ces commandes, le lien réseau s'est réactivé et le routeur a pu transmettre son annonce de préfixe (`2001:DB8:ACAD:B::/64`).

---

## 🔍 3. Vérifications des adresses et du DNS (SLAAC fonctionnel)

Une fois la configuration appliquée, nous avons validé que la machine avait bien composé sa propre adresse et récupéré les bonnes informations.

### A. Vérification des adresses IP

```bash
ip -6 addr show
```

**Résultat observé :**
La machine a bien généré son adresse GUA (`2001:db8:acad:b:a00:27ff:fe00:418/64`) basée sur le préfixe réseau envoyé par le routeur et son identifiant EUI-64 (dérivé de l'adresse MAC, reconnaissable par l'insertion de `ff:fe`). Une adresse LLA (`fe80::...`) a également été auto-configurée.

### B. Vérification du serveur DNS (DHCPv6 Stateless)

```bash
resolvectl status
```

**Résultat observé :**
Sous la section `Link 2 (enp0s3)`, la ligne `DNS Servers: 2001:4860:4860::8888` est bien présente. Le flag "O" configuré sur le routeur a parfaitement fonctionné.

---

## ✅ 4. Validation du Routage (Tests de connectivité)

L'ultime étape du TP consiste à valider le routage inter-réseaux (de bout en bout). Depuis notre machine (PC3, réseau B), nous avons lancé une série de requêtes ICMPv6 :

```bash
# 1. Ping vers la passerelle locale (Interface g0/1 du routeur - Réseau B)
ping -6 2001:db8:acad:b::1
# -> Réussite à 100% (TTL=64, communication sur le même segment L2).

# 2. Ping vers l'interface distante du routeur (Interface g0/0 - Réseau A)
ping -6 2001:db8:acad:a::1
# -> Réussite à 100% (Le routeur sait router vers ses propres réseaux connectés).

# 3. Ping vers PC1 (Hôte situé à l'autre bout du réseau, côté Paris)
ping6 2001:db8:acad:a:526f:8f4f:de09:8a00
# -> Réussite à 100% (TTL=63).
```

> [!TIP]
> **Observation sur le TTL :** Lors du ping vers PC1, le TTL mesuré était de 63 (contre 64 localement). C'est la preuve absolue que notre paquet ICMPv6 a bien traversé un équipement de couche 3 (le routeur France), qui a décrémenté le Hop Limit (équivalent du TTL en IPv6) avant de délivrer le paquet au réseau A. L'infrastructure est 100% opérationnelle.