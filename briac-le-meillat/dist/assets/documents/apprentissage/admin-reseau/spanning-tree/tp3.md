# Compte-Rendu de TP : Étude du protocole Spanning Tree (STP)

## Objectif principal
Comprendre comment le protocole STP évite les boucles de niveau 2 dans un réseau redondant et analyser le processus d'élection des rôles (Root Bridge, Root Ports, Designated Ports).

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