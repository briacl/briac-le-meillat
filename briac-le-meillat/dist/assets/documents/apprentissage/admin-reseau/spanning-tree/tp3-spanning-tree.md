---
title: "SÉtude du protocole Spanning Tree (STP)"
module: "R103"
competence: "Connecter"
ac_lies: ["AC12.01", "AC12.02"]
techs: ["IPv4", "Cisco IOS", "Switch", "Spanning-tree"]
date: ""
status: "Terminé"
image: ""
---

# Étude du protocole Spanning Tree (STP)
> **R103 — Étude du protocole Spanning Tree (STP)** — *Briac Le Meillat*

**Objectif :** Comprendre comment le protocole STP évite les boucles de niveau 2 dans un réseau redondant et analyser le processus d'élection des rôles (Root Bridge, Root Ports, Designated Ports).

## 💡 Pourquoi le Spanning Tree (STP) ?
Avez-vous déjà mis un micro trop près d'un haut-parleur ? Le son tourne en boucle, s'amplifie et crée un sifflement insupportable (l'effet Larsen). Dans un réseau informatique, il se passe exactement la même chose !

Pour qu'une entreprise ne tombe pas en panne si un câble est sectionné, les administrateurs branchent toujours plusieurs câbles entre les switchs pour avoir des liaisons de secours (la redondance). Le problème, c'est que si une machine envoie un message général (un *broadcast*), le Switch 1 va l'envoyer au Switch 2, qui va le renvoyer au Switch 1, et ainsi de suite à la vitesse de la lumière jusqu'à faire exploser le réseau. C'est ce qu'on appelle une **tempête de diffusion** (Broadcast Storm) causée par une boucle de niveau 2.

C'est là qu'intervient le sauveur : **le Spanning Tree (STP)**. C'est un algorithme mathématique inventé par Radia Perlman qui va détecter ces boucles. Les switchs vont voter pour élire un "Roi" (le *Root Bridge*) au centre du réseau. Ensuite, le STP va "éteindre" virtuellement (bloquer) certains ports pour couper la boucle. Le trafic passe de nouveau sans faire de court-circuit !
Et la magie dans tout ça ? Si le câble principal est arraché, le STP s'en rend compte et va automatiquement "rallumer" le port de secours pour que le réseau continue de fonctionner !

## Concepts Théoriques
Le protocole STP (IEEE 802.1D) permet de maintenir une topologie sans boucle en bloquant logiquement certains ports. Sur les équipements Cisco, le mode par défaut est le PVST+ (Per VLAN Spanning Tree), qui fait tourner une instance STP par VLAN.

### Les 4 étapes de convergence STP

1.  **Élection du Switch Racine (Root Bridge)** : Le switch avec le Bridge ID (BID) le plus bas est élu. Le BID se compose de la priorité (32768 par défaut + ID du VLAN) et de l'adresse MAC.
2.  **Élection des Ports Racines (Root Ports - RP)** : Sur chaque switch non-racine, le port ayant le coût le plus faible vers le Root Bridge est choisi.
3.  **Élection des Ports Désignés (Designated Ports - DP)** : Un seul port par segment réseau (liaison) est autorisé à transmettre. Il est choisi selon le coût le plus bas vers la racine.
4.  **Élection des Ports Alternatifs (Blocked Ports - BP)** : Tous les autres ports sont placés en état de blocage pour casser la boucle.

## Manipulation et Analyse

### 1. Analyse de la topologie initiale

L'infrastructure se compose de 4 switchs interconnectés avec des liens redondants.

**Commande de vérification globale :**

```bash
SW1# show spanning-tree summary
# Résultat : "Switch is in pvst mode"
```

### 2. Identification du Root Bridge

Pour identifier la racine du réseau, on compare les BID. Par défaut, toutes les priorités sont à 32769 (32768 + VLAN 1). C'est donc l'adresse MAC la plus basse qui départage les switchs.

**Exemple d'élection (basé sur les mesures) :**

*   **BID SW1** : 32769.0001.9757.E87E (Élu Root Bridge car MAC la plus basse).
*   **BID SW2** : 32769.0060.7060.C7E1
*   **BID SW3** : 32769.0001.C98E.A170
*   **BID SW4** : 32769.00D0.FF2C.8439

### 3. Observation des rôles et coûts des ports

Le coût dépend de la bande passante du lien : 1 Gbps = 4, 100 Mbps = 19.

**Sur SW4 (Exemple de port bloqué) :**

```bash
SW4# show spanning-tree
Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
Fa0/1            Root FWD 19        128.1    P2p (Port vers la racine)
Fa0/2            Altn BLK 19        128.2    P2p (Port bloqué pour éviter la boucle)
```

## Modification de la Topologie

### 4. Forcer l'élection d'un nouveau Root Bridge

Il est préférable de choisir manuellement le switch racine (souvent le switch de distribution ou de cœur de réseau) pour optimiser le chemin des données.

**Commande pour définir SW2 comme racine :**

```bash
SW2(config)# spanning-tree vlan 1 priority 4096
```

> [!IMPORTANT]
> La priorité doit être un multiple de 4096. En passant la priorité de 32768 à 4096, SW2 aura forcément le BID le plus bas et deviendra le nouveau Root Bridge.

## Synthèse des Commandes Utiles

| Commande | Usage |
| :--- | :--- |
| `show spanning-tree` | Affiche l'état complet (Root ID, Bridge ID, rôles des ports) |
| `show spanning-tree summary` | Résumé global du mode et des ports |
| `show spanning-tree vlan X` | Diagnostic spécifique pour le VLAN X |
| `show spanning-tree interface X detail` | Détails sur les BPDU et transitions d'état |

---
**Auteur :** Briac Le Meillat  
**Date :** Février 2026