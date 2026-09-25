---
title: "Segmentation par VLAN et Trunking (Cisco)"
module: "R103"
competence: ["Administrer", "Connecter"]
ac_lies: ["AC11.03", "AC11.05"]
techs: ["Cisco", "Switch", "VLAN", "CLI"]
date: "2025-09-21"
status: "Terminé"
image: ""
---
# Segmentation par VLAN et Trunking (Cisco)
> **R103 — Segmentation par VLAN et Trunking (Cisco)** — *Briac Le Meillat*

**Objectif :** Isoler les flux réseaux au sein d'une infrastructure commutée en créant des réseaux virtuels (VLAN) et configurer un lien d'agrégation (Trunk) pour permettre la communication inter-switchs.

## 💡 Pourquoi les VLAN et le Trunking ?
Imaginez que votre switch est un immense open space. Par défaut, tout le monde est dans la même pièce et peut s'entendre parler (un seul grand domaine de diffusion). Le **VLAN** (Virtual LAN), c'est comme monter des murs insonorisés virtuels pour séparer les services : la Compta (VLAN 10) ne peut plus entendre ni parler aux RH (VLAN 20), même s'ils sont branchés sur le même boîtier ! C'est génial pour la sécurité et pour réduire le bruit (le trafic) sur le réseau.

Mais que se passe-t-il quand l'entreprise s'agrandit et achète le bâtiment d'à côté (un deuxième Switch) ? Si on veut que la Compta du bâtiment A parle à la Compta du bâtiment B, on ne va pas tirer un câble de 50 mètres pour chaque service, ça serait un enfer de câblage ! C'est là qu'intervient le **Trunk**. 

Le Trunk, c'est comme une grosse autoroute (un seul câble physique) qui relie les deux bâtiments et qui laisse passer tous les services. Mais pour ne pas mélanger les employés sur la route, le premier switch colle une étiquette de couleur (le "Tag 802.1Q") sur chaque paquet de données avant le départ. À l'arrivée, le deuxième switch lit l'étiquette, l'arrache, et redirige le paquet dans le bon bureau !

---

## Architecture
### Adressage et Plan de VLAN

| Équipement | Interface | VLAN | IP (Suggérée) |
| :--- | :--- | :--- | :--- |
| PC1 | SW1 - Fa0/1 | 10 (VLAN 10) | 192.168.10.1 / 24 |
| PC2 | SW1 - Fa0/2 | 20 (VLAN 20) | 192.168.20.1 / 24 |
| PC3 | SW2 - Fa0/1 | 10 (VLAN 10) | 192.168.10.2 / 24 |
| PC4 | SW2 - Fa0/2 | 20 (VLAN 20) | 192.168.20.2 / 24 |
| Lien SW1-SW2 | Gi0/1 | Trunk (Tous) | — |

### Commandes Cisco IOS (référence rapide)

```bash
show vlan brief           # Vérifier la base de données des VLANs
show interfaces trunk     # Vérifier l'état des liens trunk (natif, autorisés)
switchport mode access    # Définit un port pour un utilisateur final
switchport access vlan X  # Assigne le port au VLAN X
switchport mode trunk     # Active l'agrégation de VLANs (802.1Q)
```

## Étapes de Réalisation

### 1. Configuration Initiale et Nommage

> [!NOTE]
> Le nommage est crucial en administration réseau pour identifier rapidement sur quel équipement les modifications sont effectuées.

**Sur le Switch 1 :**

```bash
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW1
```

**Sur le Switch 2 :**

```bash
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW2
```

### 2. Création des VLANs

Les VLANs doivent être déclarés sur chaque switch de l'infrastructure pour être reconnus.

**Sur SW1 et SW2 :**

```bash
SW1(config)# vlan 10
SW1(config-vlan)# name Direction
SW1(config-vlan)# exit

SW1(config)# vlan 20
SW1(config-vlan)# name RH
SW1(config-vlan)# exit
```

### 3. Affectation des Ports (Mode Access)

On définit ici à quel réseau virtuel appartient chaque machine physique.

**Sur SW1 (et similairement sur SW2 pour PC3/PC4) :**

```bash
# Configuration du port pour PC1 (VLAN 10)
SW1(config)# interface fastEthernet 0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# no shutdown

# Configuration du port pour PC2 (VLAN 20)
SW1(config)# interface fastEthernet 0/2
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 20
SW1(config-if)# no shutdown
```

### 4. Configuration du lien Trunk

> [!IMPORTANT]
> Le lien Trunk permet de transporter les trames de plusieurs VLANs sur un seul câble physique entre les deux switchs en utilisant le protocole d'étiquetage 802.1Q.

**Sur SW1 et SW2 :**

```bash
SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# switchport mode trunk
SW1(config-if)# no shutdown
```

## Vérifications et Tests

### 1. État des VLANs

Pour vérifier que les ports sont correctement assignés, on utilise la commande `show vlan brief`.

**Résultat attendu :** Fa0/1 doit apparaître en face du VLAN 10 et Fa0/2 en face du VLAN 20.

### 2. État du Trunk

```bash
SW1# show interfaces trunk
```

**Résultat attendu :** L'interface Gi0/1 doit être en mode "on", statut "trunking", avec le VLAN natif 1.

### 3. Tests de Connectivité (Ping)

*   **PC1 vers PC3 (VLAN 10)** : Doit répondre (même réseau logique).
*   **PC1 vers PC2 (Inter-VLAN)** : Doit échouer (l'isolation est effective, un routeur serait nécessaire pour faire communiquer les deux VLANs).

---
**Auteur :** Briac Le Meillat  
**Date :** Février 2026