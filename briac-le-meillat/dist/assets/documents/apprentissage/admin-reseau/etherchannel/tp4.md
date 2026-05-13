# Compte-Rendu de TP : Agrégation de liens (EtherChannel - LACP)

## Objectif principal
Augmenter la bande passante et assurer la redondance entre deux switchs en regroupant plusieurs interfaces physiques en un seul lien logique (EtherChannel) via le protocole LACP.

## Architecture et Concept
### Adressage et Plan de VLAN

| Équipement | Interface Physique | Interface Logique | VLAN |
| :--- | :--- | :--- | :--- |
| SW1 | Gi0/1 - Gi0/2 | Port-Channel 1 | Trunk |
| SW2 | Gi0/1 - Gi0/2 | Port-Channel 1 | Trunk |
| PC1 / PC3 | Fa0/1 | — | 10 |
| PC2 / PC4 | Fa0/2 | — | 20 |

> [!NOTE]
> **Pourquoi EtherChannel ?** Sans agrégation, le protocole STP bloque l'un des deux liens redondants (voyant orange) pour éviter les boucles. L'EtherChannel permet d'utiliser les deux liens simultanément en les faisant passer pour une seule interface logique aux yeux de STP.

## Étapes de Réalisation

### 1. Configuration des interfaces physiques

Pour que l'EtherChannel se forme, les paramètres des interfaces physiques (vitesse, duplex, mode trunk) doivent être identiques des deux côtés.

**Sur SW1 (Mode Actif) :**

```bash
SW1(config)# interface range gigabitEthernet 0/1 - 2
SW1(config-if-range)# switchport mode trunk
SW1(config-if-range)# channel-group 1 mode active
SW1(config-if-range)# no shutdown
```
*Le mode `active` indique que SW1 initie activement la négociation LACP.*

**Sur SW2 (Mode Passif) :**

```bash
SW2(config)# interface range gigabitEthernet 0/1 - 2
SW2(config-if-range)# switchport mode trunk
SW2(config-if-range)# channel-group 1 mode passive
SW2(config-if-range)# no shutdown
```
*Le mode `passive` attend que le voisin initie la négociation avant de former le canal.*

### 2. Configuration de l'interface logique (Port-Channel)

Une fois le groupe créé, on configure l'interface virtuelle Port-channel 1.

```bash
SW1(config)# interface port-channel 1
SW1(config-if)# switchport mode trunk
SW1(config-if)# no shutdown
```

> [!IMPORTANT]
> Il est impératif de configurer le mode trunk à la fois sur les interfaces physiques et sur l'interface Port-Channel pour garantir la stabilité du lien.

### 3. Configuration des VLANs et Accès

On affecte enfin les ports des PCs aux VLANs respectifs comme dans les TPs précédents.

**Sur les deux switchs :**

```bash
SW1(config)# vlan 10
SW1(config-vlan)# exit
SW1(config)# vlan 20
SW1(config-vlan)# exit

SW1(config)# interface fastEthernet 0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10

SW1(config)# interface fastEthernet 0/2
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 20
```

## Vérifications et Tests

### 1. État de l'EtherChannel

La commande `show etherchannel summary` est l'outil de diagnostic principal.

**Résultat attendu :** Le groupe doit afficher le code **(SU)**.
*   **S** = Layer 2 (Commutation).
*   **U** = In Use (En service).

Les ports physiques (Gi0/1, Gi0/2) doivent afficher le code **(P)**, indiquant qu'ils sont intégrés au Port-channel.

### 2. État du Trunk

```bash
SW1# show interfaces trunk
```
**Résultat attendu :** Le port **Po1** (Port-channel 1) doit apparaître avec le statut trunking et l'encapsulation 802.1q.

### 3. Connectivité

*   **PC1 ping PC3 (VLAN 10)** : Succès (Même VLAN).
*   **PC1 ping PC2 (VLAN 20)** : Échec (VLANs différents, isolation confirmée).

**Observation visuelle :** Toutes les interfaces entre les switchs sont désormais au vert, STP ne bloque plus de port car il ne voit qu'un seul lien logique.

---
**Auteur :** Briac Le Meillat  
**Date :** Février 2026