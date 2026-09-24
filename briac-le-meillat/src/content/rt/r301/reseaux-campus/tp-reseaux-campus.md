---
title: "Réseaux de Campus"
module: "R301"
competence: ["Connecter", "Administrer"]
ac_lies: ["AC21.01"]
techs: ["Cisco", "VLAN", "HSRP", "OSPF", "NAT", "DHCP", "Relay"]
date: "2026-09-14"
status: "Terminé"
image: "/assets/projects/tp-reseaux-campus-visu.png"
schema_image: "/assets/projects/tp-reseaux-campus-schema-packettracer.png"
---
# Réseaux de Campus (CAN) et Architecture à 3 couches
> **R301 — Architecture CAN 3-Tier et Connectivité Étendue** — *Briac Le Meillat (16/09/2026)*

**Objectif :** Mettre en place une architecture de campus complète et résiliente, incluant la segmentation par VLAN, la haute disponibilité avec HSRP, le routage dynamique avec OSPF, et l'accès externe via NAT et relais DHCP.

## 💡 1. Introduction Théorique : L'Analogie du Grand Hôpital
L'architecture de campus à trois couches (Access, Distribution, Core) garantit la rapidité, la sécurité et la tolérance aux pannes du réseau :
*   **La Couche d'Accès (Les salles et les murs invisibles) :** Dans chaque salle, des commutateurs d'accès offrent les prises réseau. Ils segmentent les flux dans des VLANs, isolant par exemple les équipements médicaux du réseau public des patients.
*   **La Couche de Distribution (Le relais de survie) :** Chaque bâtiment possède ses commutateurs de niveau 3 (DSW). C'est ici qu'opère le protocole HSRP : si l'alimentation du commutateur principal lâche, le commutateur de secours prend instantanément le relais de la passerelle, et les opérations continuent sans coupure.
*   **La Couche Cœur (Le GPS OSPF en temps réel) :** Les commutateurs cœurs (CSW) forment l'autoroute centrale. Grâce au protocole de routage dynamique OSPF, si une fibre principale est sectionnée, le réseau recalcule automatiquement un itinéraire de secours vers Internet ou les serveurs.

---

## ⚙️ 2. Couche d'Accès (ASW1 à ASW4)
> [!NOTE]
> **Objectif :** Créer les réseaux virtuels (VLAN) pour isoler les domaines de diffusion et configurer les liens Trunk pour transporter ces multiples VLANs vers la couche supérieure (Distribution) avec un étiquetage 802.1Q.

### Bâtiment A (ASW1 et ASW2 - VLAN 10 et 20)
```text
! Configuration ASW1
en
conf t
vlan 10
vlan 20
exit
int Fa0/1
switchport mode access
switchport access vlan 10
int Fa0/2
switchport mode access
switchport access vlan 20
int range Fa0/3 - 4
switchport mode trunk
end

! Configuration ASW2 (Câblage inversé PC3/PC4)
en
conf t
vlan 10
vlan 20
exit
int Fa0/2
switchport mode access
switchport access vlan 10
int Fa0/1
switchport mode access
switchport access vlan 20
int range Fa0/3 - 4
switchport mode trunk
end
```

### Bâtiment B (ASW3 et ASW4 - VLAN 50 et 60)
```text
! Configuration ASW3
en
conf t
vlan 50
vlan 60
exit
int Fa0/1
switchport mode access
switchport access vlan 50
int Fa0/2
switchport mode access
switchport access vlan 60
int range Fa0/3 - 4
switchport mode trunk
end

! Configuration ASW4 (Identique à ASW3)
en
conf t
vlan 50
vlan 60
exit
int Fa0/1
switchport mode access
switchport access vlan 50
int Fa0/2
switchport mode access
switchport access vlan 60
int range Fa0/3 - 4
switchport mode trunk
end
```

---

## 🔄 3. Couche de Distribution, SVI et HSRP (DSW1 à DSW4)
> [!NOTE]
> **Objectif :** Ces équipements de niveau 3 (L3) opèrent le routage inter-VLAN grâce aux SVI (Switch Virtual Interfaces). Le protocole HSRP est configuré pour définir une passerelle virtuelle haute disponibilité.

**Explications techniques cruciales :**
- `ip routing` : Obligatoire pour qu'un commutateur L3 active ses capacités de routage.
- `encapsulation dot1q` : Sur les commutateurs multicouches Cisco, il faut forcer le standard 802.1Q avant de pouvoir passer le port en mode trunk.
- `ip helper-address` : Les requêtes DHCP étant des broadcasts (diffusion limitées au VLAN), l'agent relais les convertit en paquets unicast vers le serveur DHCP distant.

### Bâtiment A (DSW1 et DSW2)
```text
! Configuration DSW1 (Prioritaire VLAN 10, Secours VLAN 20)
en
conf t
ip routing
vlan 10
vlan 20
exit
int range Gig1/0/1 - 2
switchport trunk encapsulation dot1q
switchport mode trunk
exit
int vlan 10
ip add 10.10.0.100 255.255.0.0
ip helper-address 10.3.0.2
no shut
standby 10 ip 10.10.0.1
standby 10 priority 105
standby 10 preempt
int vlan 20
ip add 10.20.0.100 255.255.0.0
ip helper-address 10.3.0.2
no shut
standby 20 ip 10.20.0.1
standby 20 priority 95
standby 20 preempt
! Déclaration OSPF (Masque générique inversé)
router ospf 1
network 10.10.0.0 0.0.255.255 area 0
network 10.20.0.0 0.0.255.255 area 0
end

! Configuration DSW2 (Prioritaire VLAN 20, Secours VLAN 10)
en
conf t
ip routing
vlan 10
vlan 20
exit
int range Gig1/0/1 - 2
switchport trunk encapsulation dot1q
switchport mode trunk
exit
int vlan 10
ip add 10.10.0.200 255.255.0.0
ip helper-address 10.3.0.2
no shut
standby 10 ip 10.10.0.1
standby 10 priority 95
standby 10 preempt
int vlan 20
ip add 10.20.0.200 255.255.0.0
ip helper-address 10.3.0.2
no shut
standby 20 ip 10.20.0.1
standby 20 priority 105
standby 20 preempt
router ospf 1
network 10.10.0.0 0.0.255.255 area 0
network 10.20.0.0 0.0.255.255 area 0
end
```

### Bâtiment B (DSW3 et DSW4)
```text
! Configuration DSW3 (Prioritaire VLAN 50, Secours VLAN 60)
en
conf t
ip routing
vlan 50
vlan 60
exit
int range Gig1/0/1 - 2
switchport trunk encapsulation dot1q
switchport mode trunk
exit
int vlan 50
ip add 10.50.0.100 255.255.0.0
ip helper-address 10.3.0.2
no shut
standby 50 ip 10.50.0.1
standby 50 priority 105
standby 50 preempt
int vlan 60
ip add 10.60.0.100 255.255.0.0
ip helper-address 10.3.0.2
no shut
standby 60 ip 10.60.0.1
standby 60 priority 95
standby 60 preempt
router ospf 1
network 10.50.0.0 0.0.255.255 area 0
network 10.60.0.0 0.0.255.255 area 0
end

! Configuration DSW4 (Prioritaire VLAN 60, Secours VLAN 50)
en
conf t
ip routing
vlan 50
vlan 60
exit
int range Gig1/0/1 - 2
switchport trunk encapsulation dot1q
switchport mode trunk
exit
int vlan 50
ip add 10.50.0.200 255.255.0.0
ip helper-address 10.3.0.2
no shut
standby 50 ip 10.50.0.1
standby 50 priority 95
standby 50 preempt
int vlan 60
ip add 10.60.0.200 255.255.0.0
ip helper-address 10.3.0.2
no shut
standby 60 ip 10.60.0.1
standby 60 priority 105
standby 60 preempt
router ospf 1
network 10.50.0.0 0.0.255.255 area 0
network 10.60.0.0 0.0.255.255 area 0
end
```

---

## 🌐 4. Couche Cœur (CSW) et Serveur DHCP
> [!NOTE]
> **Objectif :** Connecter le réseau d'entreprise au routeur distribuant le DHCP via un lien de niveau 3, et l'annoncer dans OSPF (Area 0 obligatoire). L'IP statique de test 10.3.0.0 a été fixée avec un masque /24 précis pour garantir le voisinage OSPF (état FULL).

### Configuration du Switch Cœur (CSW1)
```text
en
conf t
ip routing
! Désactivation de la commutation L2 pour en faire un port routé
int Gig1/0/7
no switchport
ip add 10.3.0.1 255.255.255.0
no shut
exit
! Annonce stricte OSPF
router ospf 1
network 10.3.0.0 0.0.0.255 area 0
end
```

### Configuration du Routeur DHCP
```text
en
conf t
int Gig0/0
ip add 10.3.0.2 255.255.255.0
no shut
exit
router ospf 1
network 10.3.0.0 0.0.0.255 area 0
exit
! Exclure les adresses statiques des passerelles et commutateurs
ip dhcp excluded-address 10.10.0.1 10.10.0.9
ip dhcp pool VLAN10
network 10.10.0.0 255.255.0.0
default-router 10.10.0.1
end
```

> [!WARNING]
> **Correction effectuée en cours de TP :** L'annulation d'une erreur OSPF se fait via la commande `no network ...` dans le processus `router ospf 1`.

---

## 🌍 5. Accès Internet (Routeur NAT)
> [!NOTE]
> **Objectif :** Permettre aux IP privées internes non-routables (RFC 1918) d'accéder au serveur web public 8.8.8.8. Pour cela, on utilise le PAT (NAT Overload) qui masque tout le LAN derrière l'unique adresse publique de l'interface sortante Gig0/2.

### Configuration 2911 Internet Router
```text
en
conf t
! Nettoyage des conflits NAT suite à l'inversion des câbles
int Gig0/2
no ip nat inside
int Gig0/0
no ip nat outside
exit

! Configuration de l'interface WAN (Publique)
int Gig0/2
ip address 8.8.8.1 255.255.255.0
ip nat outside
no shut
exit

! Configuration de l'interface LAN (Privée)
int Gig0/0
ip address 10.0.1.2 255.255.255.0
ip nat inside
no shut
exit

! Règle NAT (Translation dynamique via ACL)
access-list 1 permit 10.0.0.0 0.255.255.255
ip nat inside source list 1 interface Gig0/2 overload

! Routage (Route par défaut vers le WAN et injection dans OSPF)
ip route 0.0.0.0 0.0.0.0 Gig0/2
router ospf 1
network 10.0.0.0 0.255.255.255 area 0
default-information originate
end
```

---

## ✅ 6. Validation de l'Infrastructure
Les tests suivants garantissent le bon fonctionnement de l'architecture complète :

*   **Voisinage OSPF :** La commande `show ip ospf neighbor` sur le routeur DHCP indique un état FULL.
*   **Routage Global :** La commande `show ip route` valide la propagation des routes `O 10.10.0.0/16` apprises par OSPF.
*   **Processus DORA :** En basculant la configuration IP de PC1 sur "DHCP", il s'est attribué avec succès l'adresse `10.10.0.10`, validant le relais `ip helper-address`.
*   **Translation NAT :** Le ping final et la navigation depuis le client DHCP (10.10.0.10) vers le serveur web externe (8.8.8.8) aboutissent à 100%, prouvant que le routeur Internet opère correctement le masquage NAT (Surcharge).