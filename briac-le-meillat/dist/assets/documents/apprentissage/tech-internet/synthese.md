# Synthèse R103 : Réseaux Locaux et Équipements Actifs

Ce document constitue une synthèse des concepts fondamentaux abordés dans le module R103, couvrant les technologies Ethernet, les réseaux virtuels (VLAN), la gestion des boucles (STP) et l'agrégation de liens (EtherChannel).

---

## 1. Ethernet (Standard IEEE 802.3)

| N° | Question | Réponse |
|:---|:---|:---|
| 1 | Utilisation principale d'Ethernet | Connecter des appareils sur un réseau local (LAN). |
| 2 | Norme de référence | IEEE 802.3. |
| 3 | Rôle de la sous-couche MAC | Contrôler l'accès au médium physique et gérer l'adressage matériel. |
| 4 | Gestion des collisions | Protocole CSMA/CD. |
| 5 | Utilité de l'adresse MAC | Identifier de manière unique un hôte sur un segment local. |
| 6 | Interface Réseau / MAC | Sous-couche LLC (Logical Link Control). |
| 7 | Type de support physique | Paire torsadée (Twisted Pair). |
| 8 | Distance maximale (cuivre) | 100 mètres. |
| 9 | Débit Catégorie 5 | Jusqu'à 100 Mbps. |
| 10 | Catégorie pour 10 Gbps | Catégorie 6a ou 7. |
| 11 | Avantage du Switch | Commutation sélective des trames basée sur la table d'adresses MAC (CAM). |
| 12 | Couches OSI concernées | Couche 1 (Physique) et Couche 2 (Liaison). |

---

## 2. VLAN (Virtual Local Area Network)

| N° | Question | Réponse |
|:---|:---|:---|
| 1 | Définition d'un VLAN | Réseau local virtuel segmentant un réseau physique en domaines de diffusion logiques. |
| 2 | Avantages | Amélioration de la sécurité, réduction du trafic de diffusion et flexibilité. |
| 3 | Équipement de configuration | Commutateur (Switch) de couche 2 ou 3. |
| 4 | Propagation des VLANs | Protocole VTP (VLAN Trunking Protocol). |
| 5 | Port Trunk | Port transportant le trafic de plusieurs VLANs simultanément. |
| 6 | Port d'Accès | Port dédié au trafic d'un seul VLAN (périphérique final). |
| 7 | Tagging VLAN | Ajout d'une étiquette (Tag) à la trame Ethernet pour l'identifier. |
| 8 | Standard de Tagging | IEEE 802.1Q (Dot1q). |
| 9 | VLAN Natif | VLAN dont les trames ne sont pas taguées sur un lien Trunk. |
| 10 | VLAN par défaut | VLAN 1 (configuré par défaut sur tous les ports Cisco). |
| 11 | Commande d'affectation | `switchport access vlan [ID]` |
| 12 | Commande de vérification | `show vlan brief` |
| 13 | Commande mode Trunk | `switchport mode trunk` |
| 14 | Commande VLAN Natif | `switchport trunk native vlan [ID]` |
| 15 | Activation d'un port | Commande `no shutdown`. |

---

## 3. STP (Spanning Tree Protocol)

| N° | Question | Réponse |
|:---|:---|:---|
| 1 | Objectif du STP | Éviter les boucles de niveau 2 tout en permettant la redondance physique. |
| 2 | Élection du Root Bridge | Basée sur le Bridge ID (BID) le plus bas. |
| 3 | Composition du BID | Priorité (2 octets) + Adresse MAC (6 octets). |
| 4 | BPDU | Bridge Protocol Data Unit (messages échangés entre commutateurs). |
| 5 | Root Port | Port offrant le chemin le plus court vers le Root Bridge. |
| 6 | Designated Port | Port responsable de la transmission sur un segment réseau donné. |
| 7 | Blocked Port | Port désactivé logiquement pour rompre une boucle potentielle. |
| 8 | Coût de lien (1 Gbps) | Valeur de 4 (selon la norme 802.1D). |
| 9 | RSTP (802.1w) | Version rapide du STP offrant une convergence quasi-instantanée. |
| 10 | Forcer le Root Bridge | Diminuer la priorité du pont (ex: 4096). |
| 11 | Standard Cisco | PVST+ (Per-VLAN Spanning Tree). |
| 12 | Commande de vérification | `show spanning-tree` |
| 13 | Commande de priorité | `spanning-tree vlan [ID] priority [value]` |

---

## 4. EtherChannel (Agrégation de liens)

| N° | Question | Réponse |
|:---|:---|:---|
| 1 | Principe d'EtherChannel | Regroupement de liens physiques en un lien logique pour augmenter le débit. |
| 2 | Configuration | Utilisation de la commande `interface range` puis `channel-group`. |
| 3 | Protocole Standard | LACP (Link Aggregation Control Protocol - IEEE 802.3ad). |
| 4 | Protocole Cisco | PAgP (Port Aggregation Protocol). |
| 5 | Nombre max de ports | Jusqu'à 8 ports regroupés dans un même canal. |
| 6 | Mode LACP "Active" | Le port initie activement la négociation. |
| 7 | Mode LACP "Passive" | Le port attend de recevoir une requête de négociation. |
| 8 | Mode "On" | Configuration manuelle forcée sans protocole de négociation. |
| 9 | Vérification | `show etherchannel summary` |

> [!IMPORTANT]
> **Récapitulatif technique**
> La maîtrise de ces quatre piliers est essentielle pour concevoir des réseaux locaux robustes, évolutifs et sécurisés. Ethernet assure la connectivité, les VLANs la segmentation, le STP la stabilité contre les boucles, et l'EtherChannel la performance des interconnexions.