---
title: "Routage inter-VLAN sur équipements Cisco"
module: "R201"
competence: ["Administrer", "Connecter"]
ac_lies: ["AC11.03"]
techs: ["Cisco", "VLAN", "Routage Inter-VLAN"]
date: "2026-06-08"
status: "Terminé"
image: ""
---
# Compte-Rendu Technique : Routage Inter-VLAN (Switch L3)
> **R201 — Routage inter-VLAN sur équipements Cisco** — *Briac Le Meillat (08/06/2026)*

**Objectif :** Mise en œuvre du routage inter-VLAN sur des équipements Cisco IOS dans Packet Tracer, puis son déploiement sur une maquette réelle en laboratoire. L'objectif est de segmenter un réseau local en trois VLANs distincts et d'assurer la communication entre eux à l'aide d'un commutateur de couche 3 (Multilayer Switch) exploitant des interfaces virtuelles (SVI).

## 💡 Pourquoi le routage inter-VLAN (Switch de niveau 3) ?
Par défaut, un VLAN (Virtual LAN) forme une frontière étanche : les ordinateurs du VLAN 10 ne peuvent pas parler à ceux du VLAN 20, même s'ils sont branchés sur le même boîtier physique (souvenez-vous, on a vu au S1). C'est parfait pour la sécurité (séparer la compta des ressources humaines), mais c'est problématique si l'ordinateur de la RH a besoin d'imprimer sur l'imprimante réseau de la compta !

Pour franchir ces frontières virtuelles, il nous faut un équipement capable de faire l'aiguillage :
- **L'ancienne méthode ("Router on a Stick")** : On branche un Routeur sur le Switch avec un seul câble. Tout le trafic qui veut changer de VLAN monte par ce câble vers le routeur, fait demi-tour, et redescend. C'est comme s'il n'y avait qu'une seule route à double sens pour relier deux pays : embouteillage garanti !
- **La méthode moderne (Switch de couche 3)** : Au lieu d'acheter un routeur externe, on utilise un Switch haut de gamme dopé aux hormones, qui contient "un routeur intégré" dans son cerveau. On lui crée des routeurs virtuels internes (les SVI) qui servent de douaniers pour chaque VLAN. Les paquets changent de réseau directement à l'intérieur de la puce du Switch, à la vitesse de la lumière ! C'est ce qu'on va configurer ici.

---

## 🛠️ 1. Principes théoriques & Architecture

---

### 📊 Plan d'adressage et topologie

La maquette se compose de deux switches reliés par un lien Trunk (port `Fa0/4`) : un switch de distribution Multicouche (3560) et un switch d'accès (2960).

| Machine | VLAN | Adresse IP | Masque | Passerelle par défaut | Port Switch |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **PC1** | VLAN 10 | 192.168.10.10 | 255.255.255.0 | 192.168.10.1 | Switch L3 - Fa0/1 |
| **PC2** | VLAN 20 | 192.168.20.10 | 255.255.255.0 | 192.168.20.1 | Switch L3 - Fa0/2 |
| **PC3** | VLAN 30 | 192.168.30.10 | 255.255.255.0 | 192.168.30.1 | Switch L3 - Fa0/3 |
| **PC4** | VLAN 10 | 192.168.10.20 | 255.255.255.0 | 192.168.10.1 | Switch L2 - Fa0/1 |
| **PC5** | VLAN 20 | 192.168.20.20 | 255.255.255.0 | 192.168.20.1 | Switch L2 - Fa0/2 |
| **PC6** | VLAN 30 | 192.168.30.20 | 255.255.255.0 | 192.168.30.1 | Switch L2 - Fa0/3 |

> [!WARNING]
> **RAPPEL DES CONSIGNES :** Ne pas sauvegarder les configurations sur le matériel réel de la salle de TP (pas de `write` ni de `copy running-config startup-config`).

---

## 🖥️ 2. Configuration du Switch d'Accès (Switch L2 - 2960)

### 💡 L'explication vulgarisée

Le rôle de ce switch de niveau 2 est purement d'attribuer les bons "badges" (VLANs) aux ports où sont branchés les PC 4, 5 et 6, puis d'envoyer tout ce trafic mélangé vers le cœur de réseau via une ligne "autoroutière" appelée Trunk.

---

### 🖥️ Commandes de configuration

```cisco
Switch> enable
Switch# configure terminal
Switch(config)# hostname Switch-L2

! 1. Création des VLANs dans la base de données
Switch-L2(config)# vlan 10
Switch-L2(config-vlan)# exit
Switch-L2(config)# vlan 20
Switch-L2(config-vlan)# exit
Switch-L2(config)# vlan 30
Switch-L2(config-vlan)# exit

! 2. Affectation des ports d'accès pour les PC
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

! 3. Configuration du lien Trunk vers le Switch L3
Switch-L2(config)# interface fa0/4
Switch-L2(config-if)# switchport mode trunk
Switch-L2(config-if)# exit
```

---

## 🎛️ 3. Configuration du Switch Multicouche (Switch L3 - 3560)

### 💡 L'explication vulgarisée

Ce switch fait le double travail. Il gère ses propres PC locaux (PC1, 2, 3), mais il active surtout sa casquette de "Routeur".

- **Particularité du Trunk L3** : Contrairement aux switches classiques, un switch L3 a besoin qu'on lui précise explicitement la méthode de marquage des paquets (`dot1q`) avant de monter le Trunk.
- **`ip routing`** : C'est le bouton magique. Sans cette commande, le switch se comporte comme un vulgaire switch de niveau 2 et ignore comment faire passer un paquet d'un réseau à un autre.

---

### 🖥️ Commandes de configuration

```cisco
Switch> enable
Switch# configure terminal
Switch(config)# hostname Switch-L3

! 1. Création des mêmes VLANs
Switch-L3(config)# vlan 10
Switch-L3(config-vlan)# exit
Switch-L3(config)# vlan 20
Switch-L3(config-vlan)# exit
Switch-L3(config)# vlan 30
Switch-L3(config-vlan)# exit

! 2. Affectation des ports d'accès locaux
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

! 3. Configuration obligatoire de l'encapsulation avant le mode Trunk
Switch-L3(config)# interface fa0/4
Switch-L3(config-if)# switchport trunk encapsulation dot1q
Switch-L3(config-if)# switchport mode trunk
Switch-L3(config-if)# exit

! 4. Activation globale du routage IP
Switch-L3(config)# ip routing

! 5. Configuration des Interfaces Virtuelles (SVI) servant de passerelles
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

---

## 🔍 4. Validation & Vérification des Tables

### A. Contrôle de la table de routage

Pour s'assurer que le Switch L3 fait bien son travail d'aiguillage, on inspecte sa table de routage :

```cisco
Switch-L3# show ip route
```

**Résultat de la table obtenu :**

```plaintext
Gateway of last resort is not set

C    192.168.10.0/24 is directly connected, Vlan10
C    192.168.20.0/24 is directly connected, Vlan20
C    192.168.30.0/24 is directly connected, Vlan30
```

Le code `C` valide que les sous-réseaux IP sont correctement liés aux interfaces virtuelles correspondantes.

### B. Validation des flux par Ping croisé

Depuis l'invite de commande de PC1 (`192.168.10.10`), on effectue des pings de bout en bout pour traverser les VLANs et les switches :

```cmd
C:\> ping 192.168.20.20

Pinging 192.168.20.20 with 32 bytes of data:
Reply from 192.168.20.20: bytes=32 time<1ms TTL=127
Reply from 192.168.20.20: bytes=32 time<1ms TTL=127
Reply from 192.168.20.20: bytes=32 time<1ms TTL=127

Ping statistics for 192.168.20.20:
    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss)
```

> [!TIP]
> **Note de labo :** Le premier paquet envoyé subit régulièrement une perte (Timeout). Ce phénomène normal correspond au temps nécessaire pour que le protocole ARP découvre la correspondance de l'adresse MAC à travers la SVI.

---

## 🛠️ 5. Déploiement Opérationnel en Réel (Racks de Labo)

### 💡 L'explication vulgarisée

En situation réelle avec un groupe de 4 étudiants, l'architecture est redimensionnée sur une topologie de 4 PC et 2 VLANs. En tant qu'hôte sur la machine PC4, l'objectif n'est pas de configurer l'infrastructure switch mais d'intégrer correctement la machine au sous-réseau alloué par le groupe.

---

### 🖥️ Procédure pas à pas pour le poste PC4 (VLAN 10)

#### Étape 1 : Raccordement physique

1. Récupérer un cordon RJ45 de brassage.
2. Relier le port réseau de la station de travail PC4 au port physique dédié à l'accès du VLAN 10 sur le switch du rack (ex: `Fa0/1`).

#### Étape 2 : Configuration réseau de l'hôte

##### Option A : Configuration sous environnement Linux (CLI)

```bash
# Assignation de l'IP statique de la machine dans le VLAN 10
sudo ip addr add 192.168.10.20/24 dev enp3s0

# Activation de l'interface réseau
sudo ip link set enp3s0 up

# Déclaration de la passerelle par défaut (adresse IP de la SVI vlan 10)
sudo ip route add default via 192.168.10.1
```

##### Option B : Configuration sous environnement Windows (GUI)

1. Naviguer dans les *Connexions réseau* via le *Panneau de configuration*.
2. Ouvrir les propriétés de l'adaptateur Ethernet, puis double-cliquer sur *TCP/IPv4*.
3. Renseigner manuellement les champs suivants :
   - **Adresse IP** : `192.168.10.20`
   - **Masque de sous-réseau** : `255.255.255.0`
   - **Passerelle par défaut** : `192.168.10.1`

#### Étape 3 : Tests de recette sur la maquette réelle

Depuis le terminal du PC4, trois tests séquentiels valident l'installation :
- **Ping Loopback local** : `ping 192.168.10.20` (Valide le fonctionnement de la pile IP locale).
- **Ping de la passerelle** : `ping 192.168.10.1` (Valide l'accès au Switch de couche 3).
- **Ping Inter-VLAN** : `ping 192.168.20.20` (Valide le routage vers le PC du binôme situé dans le VLAN 20).

---

## ✅ Conclusion

Les objectifs du TP sont parfaitement validés. Nous avons configuré une infrastructure inter-VLAN performante et stable. L'utilisation d'un switch de couche 3 évite d'encombrer un routeur physique externe et fluidifie le routage interne.

> [!TIP]
> **Points clés retenus pour l'évaluation :**
> - ⚠️ **Encapsulation :** Ne jamais oublier `switchport trunk encapsulation dot1q` sur le switch L3 avant de forcer le trunk.
> - 🔀 **Aiguillage :** La commande globale `ip routing` est indispensable pour lier les tables SVI de niveau 3.
> - 📝 **Rendu :** Penser à consigner le schéma physique final sur la feuille A4 pour l'enseignant avant de quitter la salle.