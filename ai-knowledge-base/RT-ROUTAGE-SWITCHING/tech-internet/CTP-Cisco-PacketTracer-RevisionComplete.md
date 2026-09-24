---
title: "Cisco Packet Tracer Revision Complete"
module: "R201"
competence: "Connecter"
ac_lies: ["AC11.03"]
techs: ["Spanning Tree", "Bash", "Ubuntu", "OSPF", "Linux"]
date: "2026-06-11"
status: "Terminé"
image: ""
---
# 🎯 GUIDE CTP — Cisco Packet Tracer
> Révision complète pour le CTP · Toutes les commandes, tout le câblage, tous les pièges.
> Sujets évalués : Routage (RIP/OSPF), ACL, IPv6 + DHCPv6, Routage inter-VLAN (Router-on-a-Stick & Switch L3)

---

## SOMMAIRE RAPIDE

0. [Rappels navigation CLI Cisco + types de câbles](#0-rappels-navigation-cli-cisco--types-de-câbles)
1. [Routage statique — Maquette complète](#1-routage-statique)
2. [Routage dynamique — RIP v2 — Maquette complète](#2-routage-dynamique--rip-v2)
3. [Routage dynamique — OSPF — Maquette complète](#3-routage-dynamique--ospf)
4. [ACL Standard — Maquette complète](#4-acl-standard)
5. [ACL Étendue — Maquette complète](#5-acl-étendue)
6. [IPv6 — LLA, GUA, SLAAC, DHCPv6 Stateless — Maquette complète](#6-ipv6--lla-gua-slaac-dhcpv6-stateless)
7. [Routage inter-VLAN — Router-on-a-Stick — Maquette complète](#7-routage-inter-vlan--router-on-a-stick)
8. [Routage inter-VLAN — Switch de couche 3 SVI — Maquette complète](#8-routage-inter-vlan--switch-de-couche-3-svi)
9. [Commandes de vérification (show)](#9-commandes-de-vérification-show)
10. [Pièges classiques](#10-pièges-classiques)
11. [BONUS — TCP/UDP Wireshark Linux (TP6)](#11-bonus--tcpudp-wireshark-linux-tp6)
12. [BONUS — Filtrage Linux iptables/nftables (TP9)](#12-bonus--filtrage-linux-iptablesnftables-tp9)

---

## 0. Rappels navigation CLI Cisco + types de câbles

### Modes CLI

```
Router>                       → mode utilisateur (lecture seule)
Router> enable                → passe en mode privilégié
Router#                       → mode privilégié (show, ping, debug, copy)
Router# configure terminal    → passe en config globale
Router(config)#               → config globale (hostname, routes, ACL, OSPF...)
Router(config)# interface g0/0  → entre dans l'interface
Router(config-if)#            → config d'interface
Router(config-if)# exit       → remonte d'un niveau
Router(config-if)# end        → retour direct au mode privilégié (#)
Router# write memory          → sauvegarde (= copy running-config startup-config)
```

Raccourcis :
- `Tab` : auto-complétion de commande
- `?` : aide contextuelle (`show ip ?`, `interface ?`)
- `do show ...` : lancer un show depuis n'importe quel mode config
- `no <commande>` : annule/supprime une commande

---

### Types de câbles dans Cisco Packet Tracer

> Dans Packet Tracer, les câbles se sélectionnent dans la barre du bas (icône d'éclair).
> En cas de doute, utiliser **Automatically Choose Connection Type** (éclair orange/jaune) — PT choisit tout seul le bon câble.

| Câble (PT) | Apparence | Quand l'utiliser |
|---|---|---|
| **Copper Straight-Through** (câble droit) | Ligne pleine noire/grise | PC → Switch · Switch → Routeur (interfaces différentes : un côté MDI, l'autre MDI-X) |
| **Copper Cross-Over** (câble croisé) | Ligne pointillée noire | Switch → Switch · Routeur → Routeur (même type d'équipement directement reliés) |
| **Serial DCE / DTE** (câble série, rouge) | Ligne rouge | Routeur → Routeur via interface Serial (WAN simulé). Le côté DCE = celui qui configure `clock rate` |
| **Fiber** | Ligne orange | Rarement utilisé en TP R201 |
| **Auto** (éclair orange) | — | Laisse PT choisir — toujours correct en cas de doute |

> ⚠️ Dans les nouvelles versions de Packet Tracer et sur beaucoup de modèles de routeurs/switches, **le câble droit fonctionne partout** (auto MDI-X). Utilisez **Auto** si vous n'êtes pas sûr.

---

### Voyants d'état des ports (Packet Tracer et réel)

| Couleur | Signification |
|---|---|
| 🟠 Orange | Initialisation (STP, démarrage) — attendre |
| 🟢 Vert | Lien actif, port UP |
| ⚫ Éteint | Pas de câble ou port `shutdown` |

---

## 1. Routage statique

### Maquette 1 — 1 routeur, 2 réseaux

```
PC1 ──── Switch1 ──── Routeur ──── Switch2 ──── PC2
       192.168.1.0/24           192.168.2.0/24
```

#### Équipements à poser dans PT
- 1× Router (modèle 1941 ou 2911)
- 2× Switch (modèle 2960)
- 2× PC (End Devices)

#### Câblage
| De | Port | Vers | Port | Câble |
|---|---|---|---|---|
| PC1 | FastEthernet0 | Switch1 | Fa0/1 | Copper Straight-Through (droit) |
| Switch1 | Fa0/2 (ou Gi0/1) | Routeur | GigabitEthernet0/0 | Copper Straight-Through (droit) |
| Switch2 | Fa0/2 (ou Gi0/1) | Routeur | GigabitEthernet0/1 | Copper Straight-Through (droit) |
| PC2 | FastEthernet0 | Switch2 | Fa0/1 | Copper Straight-Through (droit) |

> Les switches n'ont pas besoin de configuration ici — ils font juste le relai L2.

#### Adressage IP

| Équipement | Interface | IP | Masque | Passerelle |
|---|---|---|---|---|
| PC1 | Fa0 | 192.168.1.10 | 255.255.255.0 | 192.168.1.1 |
| Routeur | G0/0 (→ SW1) | 192.168.1.1 | 255.255.255.0 | — |
| Routeur | G0/1 (→ SW2) | 192.168.2.1 | 255.255.255.0 | — |
| PC2 | Fa0 | 192.168.2.10 | 255.255.255.0 | 192.168.2.1 |

#### Configuration PC (Desktop > IP Configuration)
```
PC1 : IP 192.168.1.10 / Masque 255.255.255.0 / Gateway 192.168.1.1
PC2 : IP 192.168.2.10 / Masque 255.255.255.0 / Gateway 192.168.2.1
```

#### Configuration du routeur
```cisco
Router> enable
Router# configure terminal
Router(config)# hostname R1

R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit

R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip address 192.168.2.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# end
```

#### Vérifications
```cisco
R1# show ip interface brief     ! G0/0 et G0/1 doivent être UP/UP
R1# show ip route               ! 2 routes "C" (connected) visibles
! Ping depuis PC1 vers PC2 : doit répondre (pas de route statique nécessaire ici)
```

---

### Maquette 2 — 2 routeurs, 3 réseaux (routes statiques obligatoires)

```
PC1 ── SW1 ── R1 ──────────── R2 ── SW2 ── PC2
    192.168.1.0   192.168.3.0    192.168.2.0
```

#### Équipements à poser dans PT
- 2× Router (1941 ou 2911)
- 2× Switch (2960)
- 2× PC

#### Câblage
| De | Port | Vers | Port | Câble |
|---|---|---|---|---|
| PC1 | Fa0 | Switch1 | Fa0/1 | Droit |
| Switch1 | Fa0/2 | R1 | GigabitEthernet0/0 | Droit |
| R1 | GigabitEthernet0/1 | R2 | GigabitEthernet0/0 | **Croisé** (ou Auto) |
| R2 | GigabitEthernet0/1 | Switch2 | Fa0/2 | Droit |
| PC2 | Fa0 | Switch2 | Fa0/1 | Droit |

#### Adressage IP

| Équipement | Interface | IP | Masque | Passerelle |
|---|---|---|---|---|
| PC1 | Fa0 | 192.168.1.10 | 255.255.255.0 | 192.168.1.1 |
| R1 | G0/0 (→ SW1) | 192.168.1.1 | 255.255.255.0 | — |
| R1 | G0/1 (→ R2) | 192.168.3.1 | 255.255.255.0 | — |
| R2 | G0/0 (→ R1) | 192.168.3.2 | 255.255.255.0 | — |
| R2 | G0/1 (→ SW2) | 192.168.2.1 | 255.255.255.0 | — |
| PC2 | Fa0 | 192.168.2.10 | 255.255.255.0 | 192.168.2.1 |

#### Configuration R1
```cisco
Router> enable
Router# configure terminal
Router(config)# hostname R1

R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit

R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip address 192.168.3.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# end
```

#### Configuration R2
```cisco
Router> enable
Router# configure terminal
Router(config)# hostname R2

R2(config)# interface GigabitEthernet0/0
R2(config-if)# ip address 192.168.3.2 255.255.255.0
R2(config-if)# no shutdown
R2(config-if)# exit

R2(config)# interface GigabitEthernet0/1
R2(config-if)# ip address 192.168.2.1 255.255.255.0
R2(config-if)# no shutdown
R2(config-if)# end
```

#### Routes statiques (OBLIGATOIRES — sans ça PC1 et PC2 ne se pinguent pas)
```cisco
! Sur R1 : pour joindre 192.168.2.0, passer par R2 (192.168.3.2)
R1(config)# ip route 192.168.2.0 255.255.255.0 192.168.3.2

! Sur R2 : pour joindre 192.168.1.0, passer par R1 (192.168.3.1)
R2(config)# ip route 192.168.1.0 255.255.255.0 192.168.3.1
```

> Syntaxe : `ip route <réseau_destination> <masque> <next-hop>`
> Le next-hop = l'IP de l'interface du routeur voisin sur le lien commun.

#### Route par défaut (alternative au statique explicite)
```cisco
! Envoyer tout ce qui est inconnu vers le voisin
R1(config)# ip route 0.0.0.0 0.0.0.0 192.168.3.2
! ou via interface :
R1(config)# ip route 0.0.0.0 0.0.0.0 GigabitEthernet0/1
```

#### Vérifications
```cisco
R1# show ip interface brief      ! G0/0 et G0/1 UP/UP
R1# show ip route                ! routes "C" (connected) + "S" (static) visibles
R2# show ip route
! Depuis PC1 : ping 192.168.2.10 → doit répondre
Switch1# show mac address-table  ! table CAM
```

---

## 2. Routage dynamique — RIP v2

### Topologie (3 routeurs, 2 liens série)

```
PC1 ── SW1 ── R1 ──[Serial]── R2 ──[Serial]── R3 ── SW2 ── PC2
   192.168.1.0   10.1.0.0/16      10.2.0.0/16    192.168.2.0
```

#### Équipements à poser dans PT
- 3× Router **1941** (important : ce modèle accepte le module série HWIC-2T)
- 2× Switch 2960
- 2× PC

#### Ajout du module série sur chaque routeur dans PT
1. Clic sur le routeur → onglet **Physical**
2. Éteindre le routeur (bouton ON/OFF)
3. Glisser le module **HWIC-2T** depuis la liste des modules vers un slot libre
4. Rallumer le routeur
5. Répéter pour chaque routeur

#### Câblage
| De | Port | Vers | Port | Câble |
|---|---|---|---|---|
| PC1 | Fa0 | Switch1 | Fa0/1 | Droit |
| Switch1 | Fa0/2 | R1 | GigabitEthernet0/0 | Droit |
| R1 | **Serial0/1/0** | R2 | **Serial0/1/0** | **Serial DCE/DTE (rouge)** |
| R2 | **Serial0/1/1** | R3 | **Serial0/1/0** | **Serial DCE/DTE (rouge)** |
| R3 | GigabitEthernet0/0 | Switch2 | Fa0/2 | Droit |
| PC2 | Fa0 | Switch2 | Fa0/1 | Droit |

> ⚠️ Pour les câbles série : PT affiche une petite **horloge** du côté DCE.
> Le côté DCE = celui qui doit configurer `clock rate 128000`.
> Dans le TP de référence : R1 est DCE sur le lien R1↔R2, R2 est DCE sur le lien R2↔R3.

#### Adressage IP

| Équipement | Interface | IP | Masque | Passerelle |
|---|---|---|---|---|
| PC1 | Fa0 | 192.168.1.10 | 255.255.255.0 | 192.168.1.1 |
| R1 | G0/0 (→ SW1) | 192.168.1.1 | 255.255.255.0 | — |
| R1 | Se0/1/0 (→ R2) | 10.1.0.1 | 255.255.0.0 | — |
| R2 | Se0/1/0 (→ R1) | 10.1.0.2 | 255.255.0.0 | — |
| R2 | Se0/1/1 (→ R3) | 10.2.0.2 | 255.255.0.0 | — |
| R3 | Se0/1/0 (→ R2) | 10.2.0.1 | 255.255.0.0 | — |
| R3 | G0/0 (→ SW2) | 192.168.2.1 | 255.255.255.0 | — |
| PC2 | Fa0 | 192.168.2.20 | 255.255.255.0 | 192.168.2.1 |

#### Configuration R1
```cisco
Router> enable
Router# configure terminal
Router(config)# hostname R1

R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit

R1(config)# interface Serial0/1/0
R1(config-if)# ip address 10.1.0.1 255.255.0.0
R1(config-if)# clock rate 128000          ! R1 est côté DCE sur ce lien
R1(config-if)# no shutdown
R1(config-if)# end
```

#### Configuration R2
```cisco
Router> enable
Router# configure terminal
Router(config)# hostname R2

R2(config)# interface Serial0/1/0         ! vers R1 (côté DTE — pas de clock rate)
R2(config-if)# ip address 10.1.0.2 255.255.0.0
R2(config-if)# no shutdown
R2(config-if)# exit

R2(config)# interface Serial0/1/1         ! vers R3 (côté DCE)
R2(config-if)# ip address 10.2.0.2 255.255.0.0
R2(config-if)# clock rate 128000          ! R2 est côté DCE sur ce lien
R2(config-if)# no shutdown
R2(config-if)# end
```

#### Configuration R3
```cisco
Router> enable
Router# configure terminal
Router(config)# hostname R3

R3(config)# interface GigabitEthernet0/0
R3(config-if)# ip address 192.168.2.1 255.255.255.0
R3(config-if)# no shutdown
R3(config-if)# exit

R3(config)# interface Serial0/1/0         ! vers R2 (côté DTE — pas de clock rate)
R3(config-if)# ip address 10.2.0.1 255.255.0.0
R3(config-if)# no shutdown
R3(config-if)# end
```

#### Vérification AVANT de configurer RIP/OSPF
```cisco
R1# show ip interface brief     ! toutes les interfaces UP/UP
R2# show ip interface brief
R3# show ip interface brief
! Vérifier que chaque routeur pinge son voisin direct :
R1# ping 10.1.0.2               ! R1 → R2
R2# ping 10.2.0.1               ! R2 → R3
```

---

### Configuration RIP v2

**Sur R1 :**
```cisco
R1(config)# router rip
R1(config-router)# version 2
R1(config-router)# no auto-summary
R1(config-router)# network 192.168.1.0      ! annonce le réseau LAN de PC1
R1(config-router)# network 10.1.0.0         ! annonce le réseau série R1-R2
R1(config-router)# end
```

**Sur R2 :**
```cisco
R2(config)# router rip
R2(config-router)# version 2
R2(config-router)# no auto-summary
R2(config-router)# network 10.1.0.0         ! annonce réseau série R1-R2
R2(config-router)# network 10.2.0.0         ! annonce réseau série R2-R3
R2(config-router)# end
```

**Sur R3 :**
```cisco
R3(config)# router rip
R3(config-router)# version 2
R3(config-router)# no auto-summary
R3(config-router)# network 192.168.2.0      ! annonce le réseau LAN de PC2
R3(config-router)# network 10.2.0.0         ! annonce le réseau série R2-R3
R3(config-router)# end
```

> ⚠️ `network` en RIP prend l'adresse **classful** (réseau majeur), **sans masque**.
> ⚠️ `no auto-summary` est **obligatoire** pour éviter le regroupement de classes (VLSM).
> ⚠️ `version 2` est **obligatoire** (RIPv1 ne transporte pas les masques de sous-réseau).

#### Désactiver RIP (avant de passer à OSPF)
```cisco
R1(config)# no router rip
R2(config)# no router rip
R3(config)# no router rip
```

#### Vérifications RIP
```cisco
R1# show ip route
! Routes RIP marquées "R" :
! R    192.168.2.0/24 [120/2] via 10.1.0.2, 00:00:xx, Serial0/1/0
!                     ^^^  ^^
!                      |    └─ métrique (nombre de sauts)
!                      └─ distance administrative RIP

R1# show ip protocols   ! confirme RIP v2 actif + réseaux annoncés
! Depuis PC1 : ping 192.168.2.20 → doit répondre
```

---

## 3. Routage dynamique — OSPF

> Même topologie et même câblage que RIP — juste remplacer la config protocole.

#### Configuration OSPF

**Sur R1 :**
```cisco
R1(config)# router ospf 1
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# network 10.1.0.0 0.0.255.255 area 0
R1(config-router)# end
```

**Sur R2 :**
```cisco
R2(config)# router ospf 1
R2(config-router)# network 10.1.0.0 0.0.255.255 area 0
R2(config-router)# network 10.2.0.0 0.0.255.255 area 0
R2(config-router)# end
```

**Sur R3 :**
```cisco
R3(config)# router ospf 1
R3(config-router)# network 192.168.2.0 0.0.0.255 area 0
R3(config-router)# network 10.2.0.0 0.0.255.255 area 0
R3(config-router)# end
```

> ⚠️ Le masque OSPF est un **wildcard** = inverse du masque de sous-réseau :
>
> | Masque réseau | Wildcard OSPF |
> |---|---|
> | 255.255.255.0 | 0.0.0.255 |
> | 255.255.0.0 | 0.0.255.255 |
> | 255.255.255.252 | 0.0.0.3 |
>
> ⚠️ `area 0` = zone backbone, obligatoire dans une topologie simple à zone unique.
> ⚠️ Le `1` de `router ospf 1` = process-id local (n'a pas besoin d'être identique sur tous les routeurs).

#### Vérifications OSPF
```cisco
R1# show ip route
! Routes OSPF marquées "O" :
! O    192.168.2.0/24 [110/129] via 10.1.0.2, Serial0/1/0
!                      ^^^  ^^^
!                       |    └─ coût OSPF (somme des coûts des interfaces traversées)
!                       └─ distance administrative OSPF

R1# show ip protocols           ! confirme OSPF actif, process-id, réseaux annoncés
R1# show ip ospf neighbor       ! liste des voisins OSPF détectés (état FULL = OK)
R1# show ip ospf interface brief
! Depuis PC1 : ping 192.168.2.20 → doit répondre
```

#### Distances administratives (mémo)

| Protocole | DA | Lettre dans `show ip route` |
|---|---|---|
| Connectée (C) | 0 | C |
| Statique (S) | 1 | S |
| OSPF | 110 | O |
| RIP | 120 | R |

> Si RIP et OSPF annoncent la même route → routeur préfère OSPF (110 < 120).

---

## 4. ACL Standard

### Topologie de référence (TP7)

```
PC1(192.168.1.10) ── [France fa0/0]──[France fa0/1]──[Belgique fa0/0]──[Belgique fa0/1] ── PC2(192.168.3.10)
   192.168.1.0/24          192.168.2.0/24               192.168.3.0/24                       PC3(192.168.3.20)
Serveur Web : 192.168.1.254
```

#### Équipements à poser dans PT
- 2× Router (1841 ou 2911)
- 3× PC (PC1, PC2, PC3)
- 1× Server (pour la partie ACL étendue)
- Switches optionnels (un par réseau LAN)

#### Câblage
| De | Port | Vers | Port | Câble |
|---|---|---|---|---|
| PC1 | Fa0 | (Switch ou direct) | — | Droit |
| Switch/PC1 | — | Routeur France | Fa0/0 | Droit |
| Routeur France | Fa0/1 | Routeur Belgique | Fa0/0 | **Croisé** (ou Auto) |
| Routeur Belgique | Fa0/1 | Switch côté PC2/PC3 | Fa0/x | Droit |
| PC2, PC3 | Fa0 | Switch | Fa0/x | Droit |

#### Adressage IP

| Équipement | Interface | IP | Masque | Passerelle |
|---|---|---|---|---|
| PC1 | Fa0 | 192.168.1.10 | 255.255.255.0 | 192.168.1.1 |
| Routeur France | Fa0/0 (→ PC1) | 192.168.1.1 | 255.255.255.0 | — |
| Routeur France | Fa0/1 (→ Belgique) | 192.168.2.1 | 255.255.255.0 | — |
| Routeur Belgique | Fa0/0 (→ France) | 192.168.2.2 | 255.255.255.0 | — |
| Routeur Belgique | Fa0/1 (→ PC2/PC3) | 192.168.3.1 | 255.255.255.0 | — |
| PC2 | Fa0 | 192.168.3.10 | 255.255.255.0 | 192.168.3.1 |
| PC3 | Fa0 | 192.168.3.20 | 255.255.255.0 | 192.168.3.1 |

#### Configuration des routeurs + routage statique
```cisco
! ----- Routeur France -----
Router> enable
Router# configure terminal
Router(config)# hostname France

France(config)# interface fa0/0
France(config-if)# ip address 192.168.1.1 255.255.255.0
France(config-if)# no shutdown
France(config-if)# exit

France(config)# interface fa0/1
France(config-if)# ip address 192.168.2.1 255.255.255.0
France(config-if)# no shutdown
France(config-if)# exit

! Route statique vers le réseau Belgique
France(config)# ip route 192.168.3.0 255.255.255.0 192.168.2.2
France(config)# end

! ----- Routeur Belgique -----
Router> enable
Router# configure terminal
Router(config)# hostname Belgique

Belgique(config)# interface fa0/0
Belgique(config-if)# ip address 192.168.2.2 255.255.255.0
Belgique(config-if)# no shutdown
Belgique(config-if)# exit

Belgique(config)# interface fa0/1
Belgique(config-if)# ip address 192.168.3.1 255.255.255.0
Belgique(config-if)# no shutdown
Belgique(config-if)# exit

! Route statique vers le réseau France
Belgique(config)# ip route 192.168.1.0 255.255.255.0 192.168.2.1
Belgique(config)# end
```

#### Principe ACL Standard
- Numéros **1 à 99**
- Filtre **uniquement sur l'IP source**
- Se place **au plus près de la DESTINATION** (sinon elle bloquerait trop large)
- Règle implicite finale **`deny any`** → toujours finir par `permit any`

#### Étape 1 — Créer l'ACL (sur France, proche de la destination PC1)
```cisco
! Bloquer uniquement PC3 (192.168.3.20) vers PC1
France(config)# access-list 1 deny host 192.168.3.20
France(config)# access-list 1 permit any           ! OBLIGATOIRE sinon tout est bloqué
```

#### Étape 2 — Appliquer sur l'interface (en sortie vers PC1)
```cisco
France(config)# interface fa0/0
France(config-if)# ip access-group 1 out           ! "out" = sort par fa0/0 vers PC1
```

#### Modifier une règle ACL existante
```cisco
France# show access-lists
! Standard IP access list 1
!     10 deny host 192.168.3.20
!     20 permit any

France(config)# ip access-list standard 1
France(config-std-nacl)# no 10                     ! supprime la règle numéro 10
France(config-std-nacl)# 10 deny 192.168.3.0 0.0.0.255   ! bloque tout le réseau
```

#### Supprimer une ACL proprement
```cisco
! ÉTAPE 1 — Retirer l'application sur l'interface EN PREMIER
France(config)# interface fa0/0
France(config-if)# no ip access-group 1 out

! ÉTAPE 2 — Supprimer l'ACL
France(config)# no access-list 1
```

> ⚠️ **PIÈGE** : Supprimer l'ACL SANS retirer son application → interface garde une ACL vide
> → règle `deny any` implicite → **tout le trafic est coupé sur cette interface**.

#### Vérifications ACL
```cisco
France# show access-lists               ! affiche toutes les ACL avec compteurs de hits
France# show ip interface fa0/0         ! montre quelle ACL est appliquée (inbound/outbound)
```

---

## 5. ACL Étendue

#### Principe
- Numéros **100 à 199**
- Filtre sur **IP source + IP destination + protocole + port**
- Se place **au plus près de la SOURCE** (détruit le trafic indésirable dès son origine)
- Règle implicite finale **`deny any`**

#### Syntaxe générale
```cisco
access-list <100-199> {permit|deny} <protocole> <source> <wildcard_src> <destination> <wildcard_dst> [eq <port>]
```

#### Exemple complet — autoriser HTTP + ping vers serveur uniquement
Objectif : depuis `192.168.3.0`, autoriser uniquement :
- Trafic Web TCP port 80 vers serveur `192.168.1.254`
- Ping ICMP vers `192.168.1.254`
- Tout le reste bloqué (deny any implicite)

```cisco
! Sur Belgique (proche de la source 192.168.3.0)

! Règle 1 : HTTP (TCP port 80) de tout le réseau Belgique vers le serveur
Belgique(config)# access-list 100 permit tcp 192.168.3.0 0.0.0.255 host 192.168.1.254 eq 80

! Règle 2 : ICMP echo (ping) de tout le réseau Belgique vers le serveur
Belgique(config)# access-list 100 permit icmp 192.168.3.0 0.0.0.255 host 192.168.1.254 echo

! Appliquer sur fa0/1 (LAN Belgique) en IN (dès que le trafic entre sur l'interface)
Belgique(config)# interface fa0/1
Belgique(config-if)# ip access-group 100 in
```

#### Mots-clés utiles

| Mot-clé | Signification |
|---|---|
| `host 192.168.1.1` | exactement cette IP (= `192.168.1.1 0.0.0.0`) |
| `any` | n'importe quelle IP |
| `eq 80` | port HTTP |
| `eq 443` | port HTTPS |
| `eq 22` | port SSH |
| `eq 23` | port Telnet |
| `eq 53` | port DNS |
| `eq 21` | port FTP |
| `echo` | ping ICMP (echo request) |
| `tcp` | protocole TCP |
| `udp` | protocole UDP |
| `icmp` | protocole ICMP |
| `ip` | tous les protocoles IP |

#### Supprimer une ACL étendue proprement
```cisco
Belgique(config)# interface fa0/1
Belgique(config-if)# no ip access-group 100 in    ! TOUJOURS EN PREMIER
Belgique(config)# no access-list 100
```

---

## 6. IPv6 — LLA, GUA, SLAAC, DHCPv6 Stateless

### Topologie de référence (TP10)

```
PC1 ── [SW Paris] ── [Routeur France G0/0 | G0/1] ── [SW Bruxelles] ── PC2, PC3
              Réseau A : 2001:DB8:ACAD:A::/64                  Réseau B : 2001:DB8:ACAD:B::/64
```

#### Équipements à poser dans PT
- 1× Router (1941 ou 2911)
- 2× Switch 2960
- 3× PC (PC1 côté Paris, PC2 + PC3 côté Bruxelles)

#### Câblage
| De | Port | Vers | Port | Câble |
|---|---|---|---|---|
| PC1 | Fa0 | Switch Paris | Fa0/1 | Droit |
| Switch Paris | Gi0/1 (ou Fa0/x) | Routeur France | GigabitEthernet0/0 | Droit |
| Routeur France | GigabitEthernet0/1 | Switch Bruxelles | Gi0/1 (ou Fa0/x) | Droit |
| PC2 | Fa0 | Switch Bruxelles | Fa0/1 | Droit |
| PC3 | Fa0 | Switch Bruxelles | Fa0/2 | Droit |

#### Étape 1 — Activer le routage IPv6 (OBLIGATOIRE, à faire en premier)
```cisco
Router> enable
Router# configure terminal
Router(config)# hostname France

France(config)# ipv6 unicast-routing            ! sans ça = aucun routage IPv6
```

#### Étape 2 — Configurer les interfaces (LLA + GUA)
```cisco
! Interface G0/0 — Réseau A (Paris)
France(config)# interface GigabitEthernet0/0
France(config-if)# ipv6 address FE80::1 link-local        ! LLA (non routable, locale)
France(config-if)# ipv6 address 2001:DB8:ACAD:A::1/64    ! GUA (routable)
France(config-if)# no shutdown
France(config-if)# exit

! Interface G0/1 — Réseau B (Bruxelles)
France(config)# interface GigabitEthernet0/1
France(config-if)# ipv6 address FE80::1 link-local        ! même LLA OK sur 2 interfaces
France(config-if)# ipv6 address 2001:DB8:ACAD:B::1/64
France(config-if)# no shutdown
France(config-if)# exit
```

> LLA `FE80::/10` = adresse locale au lien, non routable, sert de passerelle locale et pour NDP.
> GUA `2001::/3` = adresse publique routable, unique mondialement.
> Il est **normal** d'avoir la même LLA (`FE80::1`) sur deux interfaces différentes.

#### Étape 3 — Configurer les PC en automatique (SLAAC)

Dans Packet Tracer, sur **chaque PC** :
→ **Clic sur le PC > Desktop > IP Configuration**
→ Sélectionner **IPv6 : Automatic** (bouton radio)

Le PC va automatiquement :
1. Générer sa LLA via **EUI-64** (basé sur son adresse MAC)
2. Recevoir le préfixe réseau depuis les **Router Advertisements (RA)** du routeur
3. Construire sa GUA : préfixe routeur + identifiant EUI-64
4. Recevoir la LLA du routeur (`FE80::1`) comme **passerelle par défaut**

> **EUI-64 en résumé :**
> MAC 48 bits (ex: `00:07:EC:03:60:92`)
> → Insérer `FF:FE` au milieu → `00:07:EC:FF:FE:03:60:92` (64 bits)
> → Inverser le 7e bit (bit U/L) → `02:07:EC:FF:FE:03:60:92`
> → LLA résultante : `FE80::207:ECFF:FE03:6092`

#### Étape 4 — DHCPv6 Stateless (distribuer uniquement le DNS)
```cisco
! Créer le pool DHCPv6 (ne donne que le DNS, pas d'adresses IP)
France(config)# ipv6 dhcp pool R201POOL
France(config-dhcpv6)# dns-server 2001:4860:4860::8888    ! DNS Google IPv6
France(config-dhcpv6)# exit

! Activer sur G0/0 (réseau A — Paris)
France(config)# interface GigabitEthernet0/0
France(config-if)# ipv6 dhcp server R201POOL
France(config-if)# ipv6 nd other-config-flag    ! lève le flag "O" dans les RA
France(config-if)# exit                         ! dit aux PC : "va chercher le DNS en DHCPv6"

! Activer sur G0/1 (réseau B — Bruxelles)  ← NE PAS OUBLIER
France(config)# interface GigabitEthernet0/1
France(config-if)# ipv6 dhcp server R201POOL
France(config-if)# ipv6 nd other-config-flag
France(config-if)# exit
```

> `ipv6 nd other-config-flag` modifie les Router Advertisements :
> il lève le bit "O" (Other) pour dire aux PC : "vous avez votre IP via SLAAC,"
> mais allez chercher les autres infos (DNS) via DHCPv6."

#### Vérifications IPv6
```cisco
France# show ipv6 interface brief
! GigabitEthernet0/0  [up/up]
!     FE80::1
!     2001:DB8:ACAD:A::1

France# show ipv6 interface GigabitEthernet0/0   ! détail complet (multicast groups, etc.)
France# show ipv6 route                           ! table de routage IPv6

! Ping IPv6 (depuis routeur)
France# ping ipv6 2001:DB8:ACAD:A::1
France# ping ipv6 FE80::207:ECFF:FE03:6092       ! ping LLA — PT demande l'interface de sortie
```

#### Adresses multicast IPv6 importantes

| Adresse | Rôle |
|---|---|
| `FF02::1` | Tous les nœuds du lien local |
| `FF02::2` | Tous les routeurs du lien local |
| `FF02::1:FFxx:xxxx` | Solicited-Node Multicast (remplace ARP — protocole NDP) |

#### Tests de connectivité IPv6 entre PC
```
ping fe80::1                        → passerelle LLA (même lien)
ping 2001:db8:acad:a::1             → interface distante du routeur
ping 2001:db8:acad:b:xxxx:xxxx:xxxx:xxxx → PC dans l'autre réseau
```

> Si le TTL/Hop Limit du ping = **63** au lieu de 64 → preuve que le paquet a traversé le routeur.

---

## 7. Routage inter-VLAN — Router-on-a-Stick

### Topologie

```
PC1 (VLAN10) ─ fa0/1 ─┐
PC2 (VLAN20) ─ fa0/2 ─┤─ Switch 2960 ─ fa0/5 [TRUNK] ─ g0/0 Routeur
PC3 (VLAN30) ─ fa0/3 ─┘
```

#### Équipements à poser dans PT
- 1× Router (1941 ou 2911)
- 1× Switch **2960**
- 3× PC minimum (un par VLAN)

#### Câblage
| De | Port | Vers | Port | Câble |
|---|---|---|---|---|
| PC1 | Fa0 | Switch | Fa0/1 | Droit |
| PC2 | Fa0 | Switch | Fa0/2 | Droit |
| PC3 | Fa0 | Switch | Fa0/3 | Droit |
| Switch | **Fa0/5** (port trunk) | Routeur | **GigabitEthernet0/0** | **Droit** |

> ⚠️ Le câble entre le switch et le routeur est **droit** (pas croisé) — ce sont des équipements différents.
> ⚠️ Le port du switch côté routeur (ici fa0/5) **DOIT être configuré en trunk**.

#### Adressage IP

| PC | VLAN | IP | Masque | Passerelle |
|---|---|---|---|---|
| PC1 | 10 | 192.168.10.10 | 255.255.255.0 | 192.168.10.1 |
| PC2 | 20 | 192.168.20.10 | 255.255.255.0 | 192.168.20.1 |
| PC3 | 30 | 192.168.30.10 | 255.255.255.0 | 192.168.30.1 |

#### Étape 1 — Configuration du Switch (VLANs + trunk)
```cisco
Switch> enable
Switch# configure terminal

! Créer les VLANs
Switch(config)# vlan 10
Switch(config-vlan)# exit
Switch(config)# vlan 20
Switch(config-vlan)# exit
Switch(config)# vlan 30
Switch(config-vlan)# exit

! Ports d'accès vers les PC
Switch(config)# interface fa0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# exit

Switch(config)# interface fa0/2
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 20
Switch(config-if)# exit

Switch(config)# interface fa0/3
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 30
Switch(config-if)# exit

! Trunk vers le routeur (le "bâton" du router-on-a-stick)
Switch(config)# interface fa0/5
Switch(config-if)# switchport mode trunk
Switch(config-if)# exit
```

#### Étape 2 — Configuration du Routeur (sous-interfaces)
```cisco
Router> enable
Router# configure terminal

! Sous-interface VLAN 10
Router(config)# interface GigabitEthernet0/0.1
Router(config-subif)# encapsulation dot1Q 10              ! OBLIGATOIRE AVANT ip address
Router(config-subif)# ip address 192.168.10.1 255.255.255.0
Router(config-subif)# exit

! Sous-interface VLAN 20
Router(config)# interface GigabitEthernet0/0.2
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0
Router(config-subif)# exit

! Sous-interface VLAN 30
Router(config)# interface GigabitEthernet0/0.3
Router(config-subif)# encapsulation dot1Q 30
Router(config-subif)# ip address 192.168.30.1 255.255.255.0
Router(config-subif)# exit

! Activer l'INTERFACE PHYSIQUE (pas les sous-interfaces !)
Router(config)# interface GigabitEthernet0/0
Router(config-if)# no shutdown
Router(config-if)# end
```

> ⚠️ `encapsulation dot1Q <vlan>` doit être tapé **AVANT** `ip address`.
> ⚠️ C'est `no shutdown` sur **`GigabitEthernet0/0`** (l'interface physique), pas sur les `.1` `.2` `.3`.
> ⚠️ Le port du switch connecté au routeur doit être en **trunk** (sinon les tags VLAN sont perdus).

#### Vérifications Router-on-a-Stick
```cisco
Router# show ip route
! C 192.168.10.0/24 is directly connected, GigabitEthernet0/0.1
! C 192.168.20.0/24 is directly connected, GigabitEthernet0/0.2
! C 192.168.30.0/24 is directly connected, GigabitEthernet0/0.3

Router# show ip interface brief     ! g0/0.1, g0/0.2, g0/0.3 et g0/0 UP/UP
Switch# show interfaces trunk        ! fa0/5 en trunk, VLANs 10,20,30 autorisés
Switch# show vlan brief              ! VLANs et ports associés
! Ping PC1 → PC2 (inter-VLAN) : doit répondre
```

---

## 8. Routage inter-VLAN — Switch de couche 3 (SVI)

### Topologie

```
PC1 (VLAN10) ─ fa0/1 ─┐                              ┌─ fa0/1 ─ PC4 (VLAN10)
PC2 (VLAN20) ─ fa0/2 ─┤─ Switch L3 (3560) ─ fa0/4 ──┤─ fa0/2 ─ PC5 (VLAN20)
PC3 (VLAN30) ─ fa0/3 ─┘      [TRUNK]                 └─ fa0/3 ─ PC6 (VLAN30)
                                                Switch L2 (2960)
```

#### Équipements à poser dans PT
- 1× Switch **3560** (Multilayer Switch — Layer 3) → c'est lui qui route
- 1× Switch **2960** (Layer 2 classique)
- 6× PC (2 par VLAN)

> Dans PT : le 3560 se trouve dans **Switches > 3560-24PS**.

#### Câblage
| De | Port | Vers | Port | Câble |
|---|---|---|---|---|
| PC1 | Fa0 | Switch L3 | Fa0/1 | Droit |
| PC2 | Fa0 | Switch L3 | Fa0/2 | Droit |
| PC3 | Fa0 | Switch L3 | Fa0/3 | Droit |
| **Switch L3** | **Fa0/4** | **Switch L2** | **Fa0/4** | **Droit** (ou Auto) |
| PC4 | Fa0 | Switch L2 | Fa0/1 | Droit |
| PC5 | Fa0 | Switch L2 | Fa0/2 | Droit |
| PC6 | Fa0 | Switch L2 | Fa0/3 | Droit |

#### Adressage IP

| PC | VLAN | IP | Masque | Passerelle |
|---|---|---|---|---|
| PC1, PC4 | 10 | 192.168.10.10 / .20 | 255.255.255.0 | **192.168.10.1** |
| PC2, PC5 | 20 | 192.168.20.10 / .20 | 255.255.255.0 | **192.168.20.1** |
| PC3, PC6 | 30 | 192.168.30.10 / .20 | 255.255.255.0 | **192.168.30.1** |

> La passerelle de chaque PC = l'adresse IP de la SVI correspondante sur le Switch L3.

#### Étape 1 — Configuration du Switch L2 (2960)
```cisco
Switch> enable
Switch# configure terminal
Switch(config)# hostname Switch-L2

! Créer les VLANs
Switch-L2(config)# vlan 10
Switch-L2(config-vlan)# exit
Switch-L2(config)# vlan 20
Switch-L2(config-vlan)# exit
Switch-L2(config)# vlan 30
Switch-L2(config-vlan)# exit

! Ports d'accès vers PC4, PC5, PC6
Switch-L2(config)# interface fa0/1
Switch-L2(config-if)# switchport mode access
Switch-L2(config-if)# switchport access vlan 10
Switch-L2(config-if)# exit

Switch-L2(config)# interface fa0/2
Switch-L2(config-if)# switchport mode access
Switch-L2(config-if)# switchport access vlan 20
Switch-L2(config-if)# exit

Switch-L2(config)# interface fa0/3
Switch-L2(config-if)# switchport mode access
Switch-L2(config-if)# switchport access vlan 30
Switch-L2(config-if)# exit

! Trunk vers le Switch L3
Switch-L2(config)# interface fa0/4
Switch-L2(config-if)# switchport mode trunk
Switch-L2(config-if)# exit
```

#### Étape 2 — Configuration du Switch L3 (3560)
```cisco
Switch> enable
Switch# configure terminal
Switch(config)# hostname Switch-L3

! Créer les VLANs (même liste que le L2)
Switch-L3(config)# vlan 10
Switch-L3(config-vlan)# exit
Switch-L3(config)# vlan 20
Switch-L3(config-vlan)# exit
Switch-L3(config)# vlan 30
Switch-L3(config-vlan)# exit

! Ports d'accès locaux (PC1, PC2, PC3)
Switch-L3(config)# interface fa0/1
Switch-L3(config-if)# switchport mode access
Switch-L3(config-if)# switchport access vlan 10
Switch-L3(config-if)# exit

Switch-L3(config)# interface fa0/2
Switch-L3(config-if)# switchport mode access
Switch-L3(config-if)# switchport access vlan 20
Switch-L3(config-if)# exit

Switch-L3(config)# interface fa0/3
Switch-L3(config-if)# switchport mode access
Switch-L3(config-if)# switchport access vlan 30
Switch-L3(config-if)# exit

! Trunk vers le Switch L2 — ATTENTION ordre obligatoire sur L3
Switch-L3(config)# interface fa0/4
Switch-L3(config-if)# switchport trunk encapsulation dot1q   ! OBLIGATOIRE AVANT trunk sur 3560
Switch-L3(config-if)# switchport mode trunk
Switch-L3(config-if)# exit

! Activer le routage IP — LE BOUTON MAGIQUE
Switch-L3(config)# ip routing

! Créer les SVI (interfaces virtuelles = passerelles pour chaque VLAN)
Switch-L3(config)# interface vlan 10
Switch-L3(config-if)# ip address 192.168.10.1 255.255.255.0
Switch-L3(config-if)# no shutdown
Switch-L3(config-if)# exit

Switch-L3(config)# interface vlan 20
Switch-L3(config-if)# ip address 192.168.20.1 255.255.255.0
Switch-L3(config-if)# no shutdown
Switch-L3(config-if)# exit

Switch-L3(config)# interface vlan 30
Switch-L3(config-if)# ip address 192.168.30.1 255.255.255.0
Switch-L3(config-if)# no shutdown
Switch-L3(config-if)# exit
```

> ⚠️ **PIÈGE 1** : Sur 3560, `switchport trunk encapsulation dot1q` **AVANT** `switchport mode trunk`.
> Sur 2960, ce n'est pas nécessaire (il ne supporte que dot1q, pas ISL).
>
> ⚠️ **PIÈGE 2** : Sans `ip routing`, le Switch L3 ne route rien. Il agit comme un L2 classique.
>
> ⚠️ **PIÈGE 3** : Les SVI (`interface vlan X`) n'existent que si le VLAN a été **créé au préalable** avec `vlan X`.

#### Vérifications Switch L3
```cisco
Switch-L3# show ip route
! Attendu :
! C    192.168.10.0/24 is directly connected, Vlan10
! C    192.168.20.0/24 is directly connected, Vlan20
! C    192.168.30.0/24 is directly connected, Vlan30

Switch-L3# show vlan brief             ! VLANs créés, ports affectés
Switch-L3# show interfaces trunk       ! fa0/4 en trunk, VLANs 10,20,30 autorisés
Switch-L3# show ip interface brief     ! Vlan10, Vlan20, Vlan30 UP/UP

! Ping inter-VLAN :
! PC1 (192.168.10.10) → ping 192.168.20.20 → doit répondre
! PC1 (192.168.10.10) → ping 192.168.30.20 → doit répondre
```

---

## 9. Commandes de vérification (show)

> Utilisables en mode `#` ou depuis n'importe quel mode config avec `do show ...`

| Besoin | Commande |
|---|---|
| Résumé interfaces + état + IP | `show ip interface brief` |
| Table de routage IPv4 | `show ip route` |
| Table de routage IPv6 | `show ipv6 route` |
| Détail d'une interface IPv4 | `show interfaces g0/0` |
| Interfaces IPv6 (résumé) | `show ipv6 interface brief` |
| Interfaces IPv6 (détail) | `show ipv6 interface g0/0` |
| VLANs et leurs ports | `show vlan brief` |
| Trunks actifs | `show interfaces trunk` |
| Table MAC (CAM) du switch | `show mac address-table` |
| Toutes les ACL définies | `show access-lists` |
| ACL appliquée sur interface | `show ip interface g0/0` |
| Protocoles de routage actifs | `show ip protocols` |
| Voisins OSPF | `show ip ospf neighbor` |
| Détail OSPF par interface | `show ip ospf interface brief` |
| Config en cours (RAM) | `show running-config` |
| Config sauvegardée (NVRAM) | `show startup-config` |
| Voisins directs (CDP) | `show cdp neighbors detail` |

---

## 10. Pièges classiques

### Pièges généraux

| Situation | Piège | Solution |
|---|---|---|
| Toujours | Interface routeur DOWN | Taper `no shutdown` sur chaque interface |
| IPv6 | Oublier `ipv6 unicast-routing` | C'est la 1ère commande à taper sur le routeur |
| OSPF | Wildcard = masque | `255.255.255.0` → wildcard = `0.0.0.255` (inversé !) |
| RIP | Oublier `version 2` | RIPv1 ne transporte pas les masques → routes incorrectes |
| RIP | Oublier `no auto-summary` | Regroupement classful → routes agrégées incorrectes |
| Liens série | `clock rate` des deux côtés | Uniquement sur le **côté DCE** (côté avec l'horloge dans PT) |
| Packet Tracer | Voyant orange sur port | Attendre l'initialisation STP (~30 sec) ou activer PortFast |

### Pièges ACL

| Situation | Piège | Solution |
|---|---|---|
| Toute ACL | Oublier `permit any` à la fin | `deny any` implicite → tout est bloqué |
| Suppression | Supprimer ACL sans retirer l'application | Interface garde ACL vide → `deny any` → tout coupé |
| Standard | Mal positionner | ACL Standard → **près de la DESTINATION** |
| Étendue | Mal positionner | ACL Étendue → **près de la SOURCE** |
| Application | `in` vs `out` inversés | `in` = trafic entrant dans l'interface ; `out` = trafic sortant |

### Pièges VLAN / Trunk / Router-on-a-Stick

| Situation | Piège | Solution |
|---|---|---|
| Router-on-a-stick | Port switch vers routeur en mode access | Ce port **doit être en trunk** |
| Router-on-a-stick | `encapsulation dot1Q` après `ip address` | `encapsulation dot1Q` **AVANT** `ip address` |
| Router-on-a-stick | `no shutdown` sur les sous-interfaces | `no shutdown` sur l'interface **physique g0/0** uniquement |
| Switch L3 (3560) | Oublier `switchport trunk encapsulation dot1q` | Obligatoire **AVANT** `switchport mode trunk` sur 3560 |
| Switch L3 | Oublier `ip routing` | Sans ça, le 3560 est un switch L2 qui ne route rien |
| Switch L3 | SVI non montante (down) | Vérifier que le VLAN a bien été créé avec `vlan X` |

### Pièges IPv6

| Situation | Piège | Solution |
|---|---|---|
| Routeur | Oublier `ipv6 unicast-routing` | 1ère commande systématique |
| PC | PC en mode statique au lieu d'automatique | Desktop > IP Configuration > **Automatic** |
| DHCPv6 | Oublier `ipv6 nd other-config-flag` | Sans ça, les PC n'interrogent pas DHCPv6 pour le DNS |
| DHCPv6 | Activer DHCPv6 sur g0/0 seulement | Ne pas oublier **g0/1** aussi → réseau B sans DNS |
| LLA | Vouloir router avec les LLA | Les LLA ne sont **pas routables**, utiliser les GUA |

---

## 11. BONUS — TCP/UDP Wireshark Linux (TP6)

> Ce TP se passe entièrement sur une VM Ubuntu Linux. Pas de Packet Tracer.

### Installation et lancement

```bash
sudo apt install wireshark
sudo wireshark &         # & pour libérer le terminal
```

Sélectionner l'interface **`lo`** (loopback) dans Wireshark, puis appliquer le filtre `tcp`.

### Créer un échange TCP avec netcat

```bash
# Terminal 1 — Serveur (écoute sur port 8000)
nc -l 8000

# Terminal 2 — Client (connexion au serveur local)
nc localhost 8000

# Vérifier le port ouvert
ss -n | grep 8000
```

> `ss` (paquet **IPROUTE2**) remplace `netstat` (paquet NET-TOOLS, obsolète).
> De même : `ip` remplace `ifconfig`, `ip route` remplace `route`, etc.

### Observer dans Wireshark
- **3-way handshake** : `SYN` → `SYN/ACK` → `ACK`
- **Échange de données** : `PSH/ACK` + règle `Seq + Len = Ack suivant`
- **Fermeture** : `FIN/ACK` → `ACK` → `FIN/ACK` → `ACK` (4 étapes)
- Clic droit sur une trame → **Follow > TCP Stream** pour voir la conversation
- Menu **Statistics > Flow Graph** (type: TCP flows) pour le diagramme d'échanges

### Créer un échange UDP avec netcat

```bash
# Terminal 1 — Serveur UDP
nc -u -l 9000

# Terminal 2 — Client UDP
nc -u localhost 9000
```

> Pas de handshake, pas d'accusé de réception, pas de fermeture propre.

### Comparaison TCP vs UDP

| Caractéristique | TCP | UDP |
|---|---|---|
| Connexion | 3-way handshake | Aucun |
| Fiabilité | ACK, réémmission | Aucune |
| Contrôle de flux | Oui (window size) | Non |
| Vitesse | Plus lent | Très rapide |
| Usage | HTTP, SSH, FTP | DNS, VoIP, streaming, jeux |

### Scans de ports Nmap (pour aller plus loin)

```bash
sudo nmap -sS localhost     # SYN scan (stealth) — envoie SYN, répond RST si ouvert
sudo nmap -sX localhost     # Xmas scan — flags FIN+PSH+URG simultanément
sudo nmap -sN localhost     # Null scan — aucun flag
```

> ⚠️ Scanner une machine tierce sans autorisation est **illégal**.

---

## 12. BONUS — Filtrage Linux iptables/nftables (TP9)

> Ce TP se passe sur une VM Ubuntu Linux. Pas de Packet Tracer.

### Architecture Netfilter (chaînes)

```
PREROUTING → [décision de routage] → FORWARD → POSTROUTING
                                   ↘ INPUT → processus locaux → OUTPUT → POSTROUTING
```

- **INPUT** : paquets destinés à cette machine
- **OUTPUT** : paquets émis par cette machine
- **FORWARD** : paquets traversant la machine (routeur/passerelle)
- **PREROUTING** : avant la décision de routage (table nat)
- **POSTROUTING** : après la décision de routage (table nat)

### iptables — commandes essentielles

```bash
# Afficher les règles (table filter)
iptables -L
iptables -L -v --line-numbers     # avec compteurs et numéros

# Afficher la table nat
iptables -t nat -L

# Bloquer SSH entrant
iptables -A INPUT -p tcp --dport 22 -j DROP      # -A = append (ajouter à la fin)

# Insérer en première position
iptables -I INPUT 1 -p tcp --dport 22 -s 192.168.1.10 -j ACCEPT

# Autoriser une IP spécifique + bloquer le reste (dans cet ordre !)
iptables -A INPUT -p tcp --dport 22 -s 192.168.1.10 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j DROP

# DROP vs REJECT
iptables -A INPUT -p tcp --dport 22 -j DROP      # silencieux → timeout côté client
iptables -A INPUT -p tcp --dport 22 -j REJECT    # réponse immédiate → connexion refusée

# Supprimer une règle précise
iptables -D INPUT -p tcp --dport 22 -j DROP

# Vider toutes les règles d'une table
iptables -F                   # vide toutes les chaînes (table filter)
iptables -F INPUT             # vide seulement INPUT

# Politique par défaut
iptables -P INPUT DROP        # tout refuser par défaut
iptables -P INPUT ACCEPT      # tout autoriser par défaut (remettre à la normale)

# NAT Masquerade (passerelle Linux — partager une connexion)
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
# (eth0 = interface vers l'extérieur/IUT)

# Activer le forwarding (pour que la machine route les paquets)
echo 1 > /proc/sys/net/ipv4/ip_forward
# Permanent (dans /etc/sysctl.conf) :
# net/sys/net/ipv4/ip_forward=1

# Journalisation
iptables -A ma_chaine -j LOG --log-prefix "SSH REFUSE: "
cat /var/log/syslog | grep "SSH REFUSE"

# Créer une chaîne personnelle
iptables -N ma_chaine_ssh
iptables -A INPUT -p tcp --dport 22 -j ma_chaine_ssh
iptables -A ma_chaine_ssh -s 192.168.1.10 -j ACCEPT
iptables -A ma_chaine_ssh -j DROP
```

### Options iptables

| Option | Signification |
|---|---|
| `-A CHAIN` | Ajouter à la fin de la chaîne (append) |
| `-I CHAIN n` | Insérer à la position n |
| `-D CHAIN règle` | Supprimer une règle |
| `-F [CHAIN]` | Vider les règles (flush) |
| `-N CHAIN` | Créer une nouvelle chaîne |
| `-P CHAIN TARGET` | Définir la politique par défaut |
| `-p tcp/udp/icmp` | Protocole |
| `--dport 22` | Port destination |
| `--sport 22` | Port source |
| `-s 192.168.1.1` | IP source |
| `-d 192.168.1.1` | IP destination |
| `-i eth0` | Interface d'entrée |
| `-o eth0` | Interface de sortie |
| `-j ACCEPT/DROP/REJECT/LOG` | Action (cible) |
| `-j RETURN` | Sortir de la chaîne, revenir à la chaîne appelante |

### DROP vs REJECT

| Action | Comportement | Côté client |
|---|---|---|
| `DROP` | Paquet supprimé silencieusement | Timeout (attend longuement) |
| `REJECT` | Refus + message d'erreur envoyé | Réponse instantanée "connexion refusée" |

### nftables — équivalences clés

```bash
# Bloquer SSH
nft add rule inet filter input tcp dport 22 drop

# Bloquer une IP source
nft add rule inet filter input ip saddr 192.168.1.10 drop

# Autoriser plusieurs ports
nft add rule inet filter input tcp dport {22,80,443} accept

# Autoriser connexions établies/reliées
nft add rule inet filter input ct state established,related accept

# NAT Masquerade
nft add rule ip nat postrouting oifname "eth0" masquerade

# Redirection de port (80 → 8080)
nft add rule ip nat prerouting tcp dport 80 redirect to 8080

# Lister toutes les règles
nft list ruleset
```

### Script nftables complet (modèle)

```bash
#!/usr/sbin/nft -f

flush ruleset

table inet filter {

    set blacklist {
        type ipv4_addr
        elements = { 10.0.0.5, 10.0.0.6 }    # IPs à bloquer
    }

    set allowed_ports {
        type inet_service
        elements = { 22, 80, 443 }             # ports à autoriser
    }

    chain input {
        type filter hook input priority 0;
        policy drop;                            # tout bloquer par défaut

        iifname "lo" accept                    # autoriser loopback
        ct state established,related accept    # autoriser connexions établies
        ip saddr @blacklist drop               # bloquer la blacklist
        tcp dport @allowed_ports accept        # autoriser les ports listés
    }

    chain forward {
        type filter hook forward priority 0;
        policy drop;
    }

    chain output {
        type filter hook output priority 0;
        policy accept;
    }
}
```

---

*Document généré à partir des énoncés officiels des TP et des comptes-rendus — R201 / CCNA*
*Couvre : TP1 (routage statique), TP4 (RIP/OSPF), TP7 (ACL), TP8 (NAT), TP10 (IPv6), TP11 (inter-VLAN) + TP6 et TP9 en bonus*
