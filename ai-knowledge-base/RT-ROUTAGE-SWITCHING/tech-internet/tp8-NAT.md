---
title: "NAT/PAT sur routeur Cisco"
module: "R201"
competence: "Connecter"
ac_lies: ["AC11.03"]
techs: ["Cisco", "NAT", "PAT", "Routage", "Packet Tracer"]
date: "2026-05-19"
status: "Terminé"
image: "/assets/projects/tp-natpat-visu.png"
---
![Visualisation](/assets/projects/tp-natpat-visu.png)

# Compte-Rendu Technique : NAT et PAT sur Routeur Cisco
> **R201 — Configuration du NAT et PAT sur routeur Cisco** — *Briac Le Meillat (19/05/2026)*

**Objectif :** Mise en œuvre de la traduction d'adresses réseau (NAT) sur des routeurs Cisco IOS dans Packet Tracer. Le scénario met en jeu deux routeurs (Espagne et Portugal) reliés par un lien série, avec un LAN privé côté Espagne et un serveur web côté Portugal.

## 💡 C'est quoi le NAT et le PAT ?
Imaginez Internet comme un immense réseau postal mondial. Pour envoyer et recevoir du courrier, il faut une adresse unique reconnue par tout le monde (votre adresse IP publique). Le problème ? Il n'y a pas assez d'adresses pour tous les ordinateurs et smartphones de la planète !

C'est là qu'intervient le **NAT** (Network Address Translation). C'est comme le service courrier d'une grande entreprise : à l'intérieur du bâtiment, vous utilisez de simples numéros de bureau (les IP privées, invisibles sur Internet). Mais quand vous envoyez une lettre à l'extérieur, le service courrier remplace votre numéro de bureau par l'adresse officielle de l'entreprise. 

Le **PAT** (Port Address Translation ou NAT Overload), c'est l'astuce ultime : puisqu'il y a 200 employés mais une seule adresse postale pour l'entreprise, le service courrier ajoute un petit numéro de dossier (le "port") sur chaque lettre sortante. Quand la réponse revient, il regarde ce numéro pour savoir exactement à quel employé redistribuer le courrier ! C'est exactement ce qui permet à tous vos appareils à la maison de surfer sur Internet avec la seule IP de votre box internet.

---

## 💡 1. Initialisation & Routage de base

### 💡 L'explication vulgarisée

Avant de parler de NAT, il faut que les machines puissent communiquer localement et que les routeurs sachent où envoyer les paquets vers l'inconnu.

- Les interfaces doivent avoir leurs IPs (les barrières d'octroi).
- Une **route par défaut** indique à chaque routeur : "Tout ce que vous ne connaissez pas, envoyez-le par votre interface série vers le voisin".

---

### 🖥️ Configuration des routeurs

#### Routeur Espagne

```cisco
Router> enable
Router# configure terminal
Router(config)# hostname Espagne

! Interface LAN (vers le switch de Madrid)
Espagne(config)# interface fastEthernet 0/0
Espagne(config-if)# ip address 192.168.0.1 255.255.255.0
Espagne(config-if)# no shutdown
Espagne(config-if)# exit

! Interface WAN (lien série vers Portugal — côté DCE)
Espagne(config)# interface serial 0/1/0
Espagne(config-if)# ip address 200.200.200.1 255.255.255.0
Espagne(config-if)# clock rate 128000
Espagne(config-if)# no shutdown
Espagne(config-if)# exit

! Route par défaut vers Portugal
Espagne(config)# ip route 0.0.0.0 0.0.0.0 serial 0/1/0
```

#### Routeur Portugal

```cisco
Router> enable
Router# configure terminal
Router(config)# hostname Portugal

! Interface WAN (lien série vers Espagne)
Portugal(config)# interface serial 0/1/0
Portugal(config-if)# ip address 200.200.200.2 255.255.255.0
Portugal(config-if)# no shutdown
Portugal(config-if)# exit

! Interface LAN (vers le serveur web)
Portugal(config)# interface fastEthernet 0/0
Portugal(config-if)# ip address 10.0.0.1 255.255.255.0
Portugal(config-if)# no shutdown
Portugal(config-if)# exit

! Route par défaut vers Espagne
Portugal(config)# ip route 0.0.0.0 0.0.0.0 serial 0/1/0
```

#### Configuration des hôtes terminaux

| Machine | IP | Masque | Passerelle |
|---|---|---|---|
| PC1 | 192.168.0.100 | 255.255.255.0 | 192.168.0.1 |
| PC2 | 192.168.0.200 | 255.255.255.0 | 192.168.0.1 |
| Serveur Web | 10.0.0.254 | 255.255.255.0 | 10.0.0.1 |

> [!TIP]
> **Validation à cette étape :** depuis Espagne, `ping 200.200.200.2` ; depuis Portugal, `ping 10.0.0.254`. Les deux doivent répondre avant de continuer.

---

## 🔁 2. NAT Statique — Exposer le serveur web

### 💡 L'explication vulgarisée

Les adresses en `10.0.0.0/24` sont **privées** : elles sont interdites sur Internet. Si PC1 essaie de joindre directement `10.0.0.254`, les routeurs publics jetteront le paquet.

Le **NAT Statique**, c'est une association stricte **1 pour 1** : "Dès que quelqu'un de l'extérieur demande l'adresse publique `200.200.200.2`, renvoie-le vers le serveur privé `10.0.0.254`". Comme un numéro direct vers un bureau précis dans une grande entreprise.

---

### 🖥️ Configuration (sur Portugal)

```cisco
! Règle de traduction statique : IP privée ↔ IP publique
Portugal(config)# ip nat inside source static 10.0.0.254 200.200.200.2

! Déclaration des zones NAT
Portugal(config)# interface serial 0/1/0
Portugal(config-if)# ip nat outside
Portugal(config-if)# exit

Portugal(config)# interface fastEthernet 0/0
Portugal(config-if)# ip nat inside
Portugal(config-if)# exit
```

> [!WARNING]
> Oublier de déclarer `ip nat inside` et `ip nat outside` sur les bonnes interfaces est l'erreur la plus fréquente : sans cela, aucune traduction ne s'effectue, même si la règle est correcte.

### 🔍 Vérification

Depuis PC1, ouvrir le navigateur et taper `http://200.200.200.2`. La page du serveur s'affiche.

```cisco
Portugal# show ip nat translations
```

La table affiche l'association :
- **Inside local** `10.0.0.254:80` → adresse réelle et privée du serveur
- **Inside global** `200.200.200.2:80` → adresse publique vue de l'extérieur
- **Outside** `192.168.0.100` → adresse du client PC1

---

## ⚡ 3. NAT Overload / PAT — Partager une IP publique

### 💡 L'explication vulgarisée

PC1 et PC2 ont des adresses privées non routables. Si leurs paquets sortent avec leur vraie IP (`192.168.0.x`), le serveur ne pourra pas leur répondre — ces adresses n'existent pas sur Internet.

Le **NAT Overload** (PAT) résout ça élégamment : le routeur Espagne **prête son unique IP publique** (`200.200.200.1`) à toutes les machines du LAN. Pour ne pas mélanger les réponses, il utilise des **numéros de ports distincts** :

- PC1 navigue → devient `200.200.200.1:**1025**`
- PC2 navigue → devient `200.200.200.1:**1029**`

Le routeur mémorise le mapping et retourne la bonne réponse à la bonne machine.

---

### 🖥️ Configuration (sur Espagne)

```cisco
! 1. ACL identifiant le trafic à translater (wildcard mask = inverse du masque)
Espagne(config)# access-list 1 permit 192.168.0.0 0.0.0.255

! 2. NAT Overload sur l'interface WAN
Espagne(config)# ip nat inside source list 1 interface serial 0/1/0 overload

! 3. Déclaration des zones NAT
Espagne(config)# interface fastEthernet 0/0
Espagne(config-if)# ip nat inside
Espagne(config-if)# exit

Espagne(config)# interface serial 0/1/0
Espagne(config-if)# ip nat outside
Espagne(config-if)# exit
```

> [!NOTE]
> Le mot-clé `overload` active le PAT. Sans lui, on tombe en NAT dynamique limité par un pool d'IPs.

> [!NOTE]
> Le **masque générique (wildcard)** est l'inverse du masque de sous-réseau : `255.255.255.0` → `0.0.0.255`. Cisco l'utilise dans les ACL pour cibler une plage d'adresses.

### 🔍 Vérification des flux croisés

Ouvrir simultanément le navigateur sur PC1 et PC2, puis :

```cisco
Espagne# show ip nat translations
```

La colonne **Inside global** ne contient que `200.200.200.1`, mais avec des **ports TCP distincts** (ex: `:1025` et `:1029`). Le multiplexage de port assure l'étanchéité des sessions.

---

## 🎛️ 4. Mode Simulation Packet Tracer

Basculer en mode **Simulation** (bouton en bas à droite).

1. Utiliser l'outil "Enveloppe" (Simple PDU) pour lancer un ping de PC1 vers `200.200.200.2`.
2. Cliquer sur **Capture / Forward** étape par étape.
3. Cliquer sur l'enveloppe sur le lien série entre Espagne et Portugal.
4. Observer l'onglet **In Layers / Out Layers** :
   - **In** : IP source = `192.168.0.100` (adresse privée réelle)
   - **Out** : IP source = `200.200.200.1` (adresse publique après PAT)

C'est la preuve visuelle que la traduction d'adresses fonctionne.

---

## 📊 5. Récapitulatif des trois variantes NAT

| Variante | Ratio | Usage | Commande clé |
|---|:-:|---|---|
| **NAT Statique** | 1 privée ↔ 1 publique | Exposer un serveur | `ip nat inside source static` |
| **NAT Dynamique** | N privées ↔ pool | Pool d'IPs dispo | `… pool … overload` |
| **PAT / Overload** | N privées ↔ 1 publique | Box, entreprise | `… interface … overload` |

---

## ⚠️ Points de vigilance

- **`inside` / `outside` obligatoires** sur les interfaces — sans ça, zéro traduction.
- **Le `deny any` implicite de l'ACL** — si l'ACL ne couvre pas tous les hôtes à translater, leurs paquets partent non-traduits.
- **`clock rate` côté DCE uniquement** — sur le lien série, seul le côté DCE doit configurer l'horloge.
- **Persistance** — sauvegarder après configuration : `copy running-config startup-config`.
