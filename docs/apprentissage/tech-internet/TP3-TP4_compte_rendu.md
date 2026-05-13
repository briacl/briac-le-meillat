---
title: "Routage Dynamique : RIP v2 et OSPF"
module: "R201"
competence: "Connecter"
ac_lies: ["AC12.01", "AC12.02"]
techs: ["Cisco", "RIP", "OSPF", "Routage Dynamique"]
date: "2026-03-10"
status: "Terminé"
---

# TP Protocoles de routage dynamique — RIP v2 et OSPF

**Auteurs :** Alex Jovéniaux - Briac Le Meillat - Antoine Boullier - Mathis Michalakis

**Date :** Mars 2026

**Projet :** SAE 2.01 - Protocoles de routage dynamique


---

### 1. Plan d'adressage IP

| Équipement | Interface | Adresse IP | Masque |
|---|---|---|---|
| PC1 | Fa0 | 192.168.1.10 | /24 |
| PC2 | Fa0 | 192.168.2.10 | /24 |
| R1 | GigabitEthernet0/0 | 192.168.1.1 | /24 |
| R1 | Serial0/0/x | 10.1.0.1 | /16 |
| R2 | Serial0/0/x | 10.1.0.2 | /16 |
| R2 | Serial0/0/x | 10.2.0.1 | /16 |
| R3 | Serial0/0/x | 10.2.0.2 | /16 |
| R3 | GigabitEthernet0/1 | 192.168.2.1 | /24 |

> **Note :** toujours vérifier l'interface série réellement active avec `show ip interface brief` avant de configurer. Le numéro de slot dépend de l'emplacement du module HWIC-2T dans le châssis.

---

## 2. Étapes de configuration


### 2.1 Configuration des PC

**PC1** — Desktop > IP Configuration :
```
IP         : 192.168.1.10
Masque     : 255.255.255.0
Passerelle : 192.168.1.1
```

**PC2** — Desktop > IP Configuration :
```
IP         : 192.168.2.10
Masque     : 255.255.255.0
Passerelle : 192.168.2.1
```

### 2.2 Configuration de R1

R1 porte le `clock rate` sur son interface série car l'icône d'horloge apparaît de son côté sur le schéma.
```
Router>enable
Router#configure terminal
Router(config)#hostname R1
R1(config)#interface GigabitEthernet0/0
R1(config-if)#ip address 192.168.1.1 255.255.255.0
R1(config-if)#no shutdown
R1(config-if)#exit
R1(config)#interface Serial0/0/x          ! adapter selon show ip interface brief
R1(config-if)#ip address 10.1.0.1 255.255.0.0
R1(config-if)#clock rate 128000
R1(config-if)#no shutdown
R1(config-if)#end
R1#write memory
```

### 2.3 Configuration de R2

R2 n'a pas de `clock rate` : il est en position DTE sur les deux liaisons série.
```
Router>enable
Router#configure terminal
Router(config)#hostname R2
R2(config)#interface Serial0/0/x          ! liaison vers R1
R2(config-if)#ip address 10.1.0.2 255.255.0.0
R2(config-if)#no shutdown
R2(config-if)#exit
R2(config)#interface Serial0/0/x          ! liaison vers R3
R2(config-if)#ip address 10.2.0.1 255.255.0.0
R2(config-if)#no shutdown
R2(config-if)#end
R2#write memory
```

### 2.4 Configuration de R3

R3 porte le `clock rate` sur son interface série (icône horloge de son côté sur le schéma).
```
Router>enable
Router#configure terminal
Router(config)#hostname R3
R3(config)#interface GigabitEthernet0/1
R3(config-if)#ip address 192.168.2.1 255.255.255.0
R3(config-if)#no shutdown
R3(config-if)#exit
R3(config)#interface Serial0/0/x          ! adapter selon show ip interface brief
R3(config-if)#ip address 10.2.0.2 255.255.0.0
R3(config-if)#clock rate 128000
R3(config-if)#no shutdown
R3(config-if)#end
R3#write memory
```

---

## 3. Vérification de base (avant routage dynamique)

- Depuis PC1 : `ping 192.168.1.1` → **OK** (R1 accessible sur le même réseau)
- Depuis PC1 : `ping 192.168.2.10` → **ÉCHEC attendu** (pas de route vers l'autre réseau)
- Sur R1 : `show ip route` → uniquement des routes `C` (connectées) et `L` (locales)

Le message `Destination host unreachable` provient de R1 lui-même qui ne connaît pas de route vers la destination. C'est le comportement attendu avant la mise en place du routage dynamique.

---

## 4. RIP v2

### 4.1 Configuration RIP sur les trois routeurs

**R1 :**
```
R1(config)#router rip
R1(config-router)#version 2
R1(config-router)#no auto-summary
R1(config-router)#network 192.168.1.0
R1(config-router)#network 10.1.0.0
R1(config-router)#end
```

**R2 :**
```
R2(config)#router rip
R2(config-router)#version 2
R2(config-router)#no auto-summary
R2(config-router)#network 10.1.0.0
R2(config-router)#network 10.2.0.0
R2(config-router)#end
```

**R3 :**
```
R3(config)#router rip
R3(config-router)#version 2
R3(config-router)#no auto-summary
R3(config-router)#network 192.168.2.0
R3(config-router)#network 10.2.0.0
R3(config-router)#end
```

### 4.2 Signification des commandes RIP

| Commande | Signification |
|---|---|
| `version 2` | Active RIPv2 (supporte VLSM, envoi en multicast 224.0.0.9) |
| `no auto-summary` | Désactive le regroupement de classe (nécessaire avec des masques /16 et /24 mélangés) |
| `network X.X.X.X` | Active RIP sur toutes les interfaces appartenant à ce réseau |

### 4.3 Lecture de la table de routage après RIP

`show ip route` sur R1 doit afficher :
```
R    10.2.0.0/16    [120/1] via 10.1.0.2, Serial0/0/x
R    192.168.2.0/24 [120/2] via 10.1.0.2, Serial0/0/x
```

| Coût | Destination | Signification |
|---|---|---|
| `[120/1]` | 10.2.0.0/16 | DA=120, 1 saut pour atteindre 10.2.0.0 (via R2) |
| `[120/2]` | 192.168.2.0/24 | DA=120, 2 sauts pour atteindre 192.168.2.0 (R1→R2→R3) |


### 4.4 Désactivation de RIP pour OSPF

Avant de passer à OSPF, désactiver RIP sur les trois routeurs :
```
R1(config)#no router rip
R2(config)#no router rip
R3(config)#no router rip
```

---

## 5. OSPF

### 5.1 Configuration OSPF sur les trois routeurs

Le masque utilisé dans OSPF est un **masque générique (wildcard)** = inverse du masque réseau. Un bit à 0 = partie réseau (fixe), un bit à 1 = partie hôte (variable).

**R1 :**
```
R1(config)#router ospf 1
R1(config-router)#network 192.168.1.0 0.0.0.255 area 0
R1(config-router)#network 10.1.0.0 0.0.255.255 area 0
R1(config-router)#end
```

**R2 :**
```
R2(config)#router ospf 1
R2(config-router)#network 10.1.0.0 0.0.255.255 area 0
R2(config-router)#network 10.2.0.0 0.0.255.255 area 0
R2(config-router)#end
```

**R3 :**
```
R3(config)#router ospf 1
R3(config-router)#network 192.168.2.0 0.0.0.255 area 0
R3(config-router)#network 10.2.0.0 0.0.255.255 area 0
R3(config-router)#end
```

### 5.2 Signification des commandes OSPF

| Commande | Signification |
|---|---|
| `router ospf 1` | Lance un processus OSPF avec process-id=1 (choisi par l'admin, local au routeur) |
| `network X 0.0.0.255 area 0` | Active OSPF sur les interfaces dans ce réseau, zone backbone |
| `0.0.0.255` | Wildcard /24 : les 24 premiers bits sont fixes |
| `0.0.255.255` | Wildcard /16 : les 16 premiers bits sont fixes |
| `area 0` | Zone backbone OSPF, tous les routeurs doivent être en area 0 ici |

### 5.3 Lecture de la table de routage après OSPF

`show ip route` sur R1 doit afficher :
```
O    10.2.0.0/16    [110/128] via 10.1.0.2, Serial0/0/x
O    192.168.2.0/24 [110/129] via 10.1.0.2, Serial0/0/x
```

| Coût | Destination | Calcul |
|---|---|---|
| `[110/128]` | 10.2.0.0/16 | 64 + 64 = 128 (2 liaisons série) |
| `[110/129]` | 192.168.2.0/24 | 64 + 64 + 1 = 129 (2 série + 1 FastEthernet) |

---

## 6. Comparaison RIP vs OSPF

| Critère | RIP v2 | OSPF |
|---|---|---|
| Distance administrative | 120 | 110 |
| Métrique | Nombre de sauts (max 15) | Coût = f(débit) |
| Encapsulation | UDP port 520 | IP protocole 89 |
| Lettre table de routage | `R` | `O` |
| Usage | Petits réseaux uniquement | Réseaux de taille moyenne/grande |
| Support VLSM | Oui (v2) | Oui |

Si RIP et OSPF coexistent sur un routeur pour la même destination, **OSPF est préféré** car sa distance administrative (110) est plus faible que celle de RIP (120). Plus la DA est basse, plus la route est jugée fiable.

---

## 7. Commandes utiles de vérification

| Commande | Usage |
|---|---|
| `show ip interface brief` | Vue rapide de toutes les interfaces avec statut et IP |
| `show ip route` | Table de routage complète |
| `show interfaces Serial0/0/x` | Détails d'une interface série |
| `show controllers Serial0/0/x` | Déterminer si l'interface est DCE ou DTE |
| `show ip protocols` | Protocoles de routage actifs et leurs paramètres |
| `show ip ospf neighbor` | Voisins OSPF établis |
| `ping X.X.X.X` | Tester la connectivité vers une adresse |

### Identifier l'interface DCE pour le clock rate
```
R1#show controllers Serial0/0/x
```

Si la sortie contient `DCE`, c'est sur cette interface qu'il faut configurer `clock rate 128000`. Le clock rate n'est à configurer que sur le côté DCE d'une liaison série synchrone.