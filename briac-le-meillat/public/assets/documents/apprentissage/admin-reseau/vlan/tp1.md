# Compte-Rendu de TP : Segmentation par VLAN et Trunking (Cisco)

## Objectif principal
Isoler les flux réseaux au sein d'une infrastructure commutée en créant des réseaux virtuels (VLAN) et configurer un lien d'agrégation (Trunk) pour permettre la communication inter-switchs.

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