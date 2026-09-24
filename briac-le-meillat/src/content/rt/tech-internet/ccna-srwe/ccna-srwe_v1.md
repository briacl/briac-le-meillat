---
title: ""
module: ""
competence: ""
ac_lies: []
techs: []
date: "2026-06-14"
status: "Terminé"
image: ""
---
# 🌐 Projet NetworkBriac — Dossier d'Architecture & Sécurité

## 1. Contexte & Volonté du Projet
L'objectif du projet **NetworkBriac** est de concevoir et simuler une infrastructure réseau d'entreprise miniature, directement inspirée par les architectures "Homelab" avancées. 

Il ne s'agit pas d'un simple exercice de connectivité, mais de la mise en place d'une véritable **DMZ (Zone Démilitarisée) logique**. L'infrastructure permet d'exposer des services de manière sécurisée vers l'extérieur (serveur Web), tout en appliquant une ségrégation stricte des flux internes pour protéger la zone d'administration.

Ce laboratoire valide les concepts de commutation de niveau 2 (VLANs, Trunks), de routage inter-VLAN (Router-on-a-Stick), de translation d'adresses (NAT/PAT) et de contrôle d'accès (ACL).

---

## 2. Philosophie du Plan d'Adressage IP

Le choix des adresses IP respecte les standards de l'IETF pour concilier la réalité d'un réseau local domestique avancé et un déploiement en production.

### Réseaux Internes (LAN) : Norme RFC 1918
* **Choix :** Utilisation du bloc `192.168.0.0/16` réparti en sous-réseaux `/24`.
* **Justification :** Ce choix est directement fidèle à la réalité de la configuration d'un Homelab physique intégré derrière une passerelle résidentielle ou un routeur dédié. L'attribution de blocs distincts (`192.168.10.0` et `192.168.99.0`) permet de structurer de manière étanche les différentes fonctions du réseau local sans complexifier l'analyse des masques.

### Réseau Externe (Simulation Internet / WAN) : Norme RFC 5737
* **Choix :** Utilisation du bloc `203.0.113.0/24` (TEST-NET-3).
* **Justification :** Lors de la simulation d'une patte publique (WAN), il est techniquement incorrect d'utiliser des adresses IP privées ou des adresses publiques arbitraires (au risque de créer des conflits de routage). Ce bloc est officiellement réservé par l'IANA pour les architectures de test et la documentation, démontrant une rigueur dans le respect des standards internet.

---

## 3. Topologie & Segmentation Logique

Le réseau est divisé en deux zones de confiance isolées par des VLANs, dont les flux sont filtrés par le routeur de bordure (`R-Border`).

| VLAN | Nom de la Zone | Sous-réseau | Rôle et Niveau de Confiance |
| :--- | :--- | :--- | :--- |
| **10** | `SERVERS` | `192.168.10.0/24` | **Zone d'Hébergement (DMZ) :** Contient le serveur Web et le serveur DNS. C'est une zone à risque modéré car elle est partiellement exposée à Internet via NAT. |
| **99** | `ADMIN-ZONE` | `192.168.99.0/24` | **Zone de Management (LAN) :** Réseau de haute confiance. C'est d'ici que l'administrateur gère l'infrastructure. Totalement invisible depuis l'extérieur. |
| **-** | `WAN-INTERNET` | `203.0.113.0/24` | **Zone Externe (Untrusted) :** Simule Internet. Aucune confiance. |

---

## 4. Stratégie de Sécurité et Contrôle des Flux

Le routeur `R-Border` agit comme un pare-feu *stateless* grâce aux Listes de Contrôle d'Accès (ACL). La politique appliquée est celle du **moindre privilège** (*Deny by default*).

### 4.1. Translation d'Adresses (NAT/PAT)
Pour rendre le serveur Web accessible depuis l'extérieur sans exposer son IP privée, une règle de NAT statique (Port Forwarding) est mise en place. 
* Seul le trafic entrant sur le port HTTP (80) de l'interface publique (`203.0.113.1`) est redirigé vers le serveur Web interne (`192.168.10.10`).

### 4.2. Matrice des Flux (ACL Étendue)

La Liste de Contrôle d'Accès (`FIREFALL-ACL`) dicte le comportement de l'infrastructure :

1. **Accès Web Public (HTTP) :** `PERMIT`
   * N'importe quel utilisateur sur Internet peut accéder au Serveur Web (VLAN 10) sur le port 80.
2. **Administration Interne (SSH) :** `PERMIT`
   * Seuls les postes du VLAN 99 (`ADMIN-ZONE`) sont autorisés à ouvrir des sessions SSH vers les serveurs (VLAN 10) ou les équipements réseaux.
3. **Administration Externe Sécurisée (SSH) :** `PERMIT`
   * Par exception, un utilisateur nomade spécifique (Laptop Externe à l'IP `203.0.113.50`) a le droit de joindre les équipements en SSH pour de la maintenance à distance.
4. **Résolution de Noms (DNS) :** `PERMIT`
   * Les équipements du réseau ont l'autorisation d'interroger le serveur DNS interne (Port UDP 53).
5. **Isolation Latérale :** `DENY`
   * Tout le reste du trafic est implicitement bloqué. Il est notamment impossible pour le Serveur Web (s'il venait à être compromis) d'initier une connexion vers la zone `ADMIN-ZONE`.

---

## 5. Extrait des Configurations Majeures (Routeur R-Border)

*Configuration des sous-interfaces pour le routage Inter-VLAN :*
```cisco
interface GigabitEthernet0/0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.254 255.255.255.0
 ip nat inside

interface GigabitEthernet0/0/0.99
 encapsulation dot1Q 99
 ip address 192.168.99.254 255.255.255.0
 ip nat inside

Configuration du NAT statique pour exposer le serveur Web :

Cisco CLI
ip nat inside source static tcp 192.168.10.10 80 203.0.113.1 80
Configuration de l'ACL pour matérialiser la politique de sécurité :

Cisco CLI
ip access-list extended FIREFALL-ACL
 ! Autorisation de l'administration depuis le LAN (VLAN 99)
 permit tcp 192.168.99.0 0.0.0.255 any eq 22
 ! Autorisation de l'administration depuis l'extérieur (IP Spécifique)
 permit tcp host 203.0.113.50 any eq 22
 ! Autorisation d'accès au site Web pour tout le monde
 permit tcp any host 192.168.10.10 eq 80
 ! Autorisation du DNS en interne
 permit udp 192.168.10.0 0.0.0.255 host 192.168.10.20 eq 53
 ! Verrouillage du reste des communications
 deny ip any any

***
```

### Prochaine étape pour votre maquette :
Pour rendre l'expérience utilisateur complète sur votre projet, voulez-vous qu'on configure les services applicatifs dans Cisco Packet Tracer ? Par exemple :
1. Configurer le **serveur DNS** (`192.168.10.20`) pour lier le nom de domaine de votre choix (ex: `homelab.local` ou `www.networkbriac.com`) à votre site.
2. Personnaliser le code **HTML** du serveur web pour afficher une fausse page d'accueil d'interface de gestion de votre cru.