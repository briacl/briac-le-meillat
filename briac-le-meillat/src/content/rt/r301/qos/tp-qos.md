---
title: "Introduction à QoS"
module: "Réseaux"
competence: ["Administrer", "Connecter"]
ac_lies: ["AC21.01"]
techs: ["Cisco", "QoS", "OSPF", "NAT", "DSCP", "IPP", "Wi-Fi"]
date: "2026-09-15"
status: "Terminé"
image: "/assets/projects/tp-qos-visu.jpg"
schema_image: "/assets/projects/tp-qos-schemas-packttracer.png"
---
# Introduction à la qualité de service (QoS)
> **Réseaux — Infrastructure avec Routage et QoS** — *Briac Le Meillat (17/09/2026)*

**Objectif :** Déployer de A à Z une infrastructure réseau inter-bâtiments incluant le routage OSPF, un routeur Wi-Fi avec NAT, et surtout l'application de règles de Qualité de Service (QoS) pour garantir la bande passante de flux prioritaires.

## 💡 1. Introduction Théorique : L'Analogie de l'Autoroute
La Qualité de Service (QoS) permet de gérer la congestion d'un réseau. Si notre routeur est une barrière de péage d'autoroute :
*   **Le Marquage (R2) :** C'est donner un gyrophare ou un badge "VIP" (l'étiquette IPP ou DSCP) à certains véhicules (les paquets) dès qu'ils entrent sur le réseau.
*   **La Priorisation (R5) :** C'est créer une voie réservée au péage de sortie. Le routeur lit l'étiquette et s'assure que ces véhicules VIP auront toujours au moins 20% de la voie qui leur est garantie, même en cas d'embouteillage.

---

## 🖥️ 2. Configuration des Terminaux (Bâtiment A, C et Serveur Distant)
> [!NOTE]
> **Objectif :** Attribuer les adresses IP statiques pour que les terminaux puissent communiquer avec leur passerelle (routeur) respective. *Action réalisée via l'onglet `Desktop > IP Configuration` de chaque machine.*

*   **PC1 (Bâtiment A) :** IP `10.1.0.101` | Masque `255.255.0.0` | Passerelle `10.1.0.1`
*   **Serveur Interne (Bâtiment C) :** IP `10.25.0.100` | Masque `255.255.0.0` | Passerelle `10.25.0.5`
*   **Serveur Web Distant :** IP `174.34.80.100` | Masque `255.255.255.0` | Passerelle `174.34.80.5`

---

## 🛜 3. Configuration du Routeur Wi-Fi WRT300N (R4 - Bâtiment B)
> [!NOTE]
> **Objectif :** Créer le réseau sans-fil sécurisé du Bâtiment B, distribuer des adresses IP automatiquement (DHCP), et masquer ce réseau derrière une traduction d'adresses (NAT). *Action réalisée via l'interface graphique (GUI) du routeur R4.*

1.  **Internet Setup (Interface WAN) :** Configuration de l'IP statique d'interconnexion.
    *   IP : `10.34.0.4` | Masque : `255.255.0.0` | Passerelle : `10.34.0.3` (vers R3)
2.  **Network Setup (Interface LAN & DHCP) :** 
    *   IP : `10.4.0.1` | Masque : `255.255.255.0` (Limitation empêchant le /16)
    *   Serveur DHCP : Activé (*Enabled*)
3.  **Wireless Settings & Security :**
    *   SSID : `R4`
    *   Sécurité : `WPA2-PSK` avec chiffrement `AES` et mot de passe `azerty1234`.
4.  **Côté Terminaux (Laptop0 et Smartphone0) :** Connexion au SSID `R4` avec la clé WPA2 et bascule en adressage IP `DHCP` pour récupérer automatiquement une adresse `10.4.0.x`.

---

## ⚙️ 4. Routage de base OSPF (R1 et R3)
> [!NOTE]
> **Objectif :** Allumer les interfaces physiques et activer le routage dynamique OSPF pour que les routeurs apprennent automatiquement les chemins vers tous les sous-réseaux `10.x.x.x`.

### Sur R1 (Bâtiment A)
```text
en
conf t
hostname R1
! Allumage et adressage de l'interface vers les PC (Bâtiment A)
int Gig0/1
 ip address 10.1.0.1 255.255.0.0
 no shut
 exit
! Allumage et adressage de l'interconnexion vers R2
int Gig0/0
 ip address 10.12.0.1 255.255.0.0
 no shut
 exit
! OSPF : On annonce globalement le réseau 10.x.x.x dans la zone 0
router ospf 1
 network 10.0.0.0 0.255.255.255 area 0
end
```

### Sur R3 (Bâtiment B)
```text
en
conf t
hostname R3
int Gig0/0
 ip address 10.34.0.3 255.255.0.0
 no shut
 exit
int Gig0/1
 ip address 10.23.0.3 255.255.0.0
 no shut
 exit
router ospf 1
 network 10.0.0.0 0.255.255.255 area 0
end
```

---

## 🚦 5. QoS Étape 1 : Interception et Marquage (Routeur R2)
> [!NOTE]
> **Objectif :** R2 est le carrefour du réseau. Il doit identifier les paquets du Bâtiment A et le trafic HTTP pour leur coller une étiquette de priorité (Marquage) dans l'en-tête IP avant de les transmettre.

### Sur R2
```text
en
conf t
hostname R2
! 1. Adressage et OSPF
int Gig0/1
 ip address 10.12.0.2 255.255.0.0
 no shut
 exit
int Gig0/0
 ip address 10.23.0.2 255.255.0.0
 no shut
 exit
int Gig0/2
 ip address 10.25.0.2 255.255.0.0
 no shut
 exit
router ospf 1
 network 10.0.0.0 0.255.255.255 area 0
 exit

! 2. Identification des flux via les ACL (Access Control Lists)
! L'ACL 1 cible les paquets du Bâtiment A ET l'IP d'interconnexion de R1
access-list 1 permit 10.1.0.0 0.0.255.255
access-list 1 permit 10.12.0.0 0.0.255.255
! L'ACL 100 cible uniquement le trafic Web (TCP port 80)
access-list 100 permit tcp any any eq 80

! 3. Création des classes (Class-map) pour regrouper le trafic identifié
class-map match-all MATCHA
 match access-group 1
 exit
class-map match-all MATCH_HTTP
 match access-group 100
 exit

! 4. Création de la politique (Policy-map) pour appliquer le marquage
policy-map SETA
 class MATCHA
  ! On marque le trafic du Bâtiment A avec une Precedence de 5
  set precedence 5
  exit
 class MATCH_HTTP
  ! On marque le trafic Web avec le code DSCP EF (Expedited Forwarding)
  set ip dscp ef
  exit
 exit

! 5. Application de la politique à l'entrée de l'interface venant de R1
int Gig0/1
 service-policy input SETA
end
```

---

## 🚀 6. QoS Étape 2 : Priorisation et Sortie Internet (Routeur R5)
> [!NOTE]
> **Objectif :** R5 est la porte de sortie vers Internet. Il doit lire les étiquettes posées par R2, garantir une part de sa bande passante à ces paquets prioritaires, et fournir une route par défaut vers l'extérieur.

### Sur R5
```text
en
conf t
hostname R5
! 1. Adressage
int Gig0/0
 ip address 10.25.0.5 255.255.0.0
 no shut
 exit
int Gig0/1
 ip address 174.34.80.5 255.255.255.0
 no shut
 exit

! 2. Route par défaut vers Internet et propagation dans OSPF
ip route 0.0.0.0 0.0.0.0 Gig0/1
router ospf 1
 network 10.0.0.0 0.255.255.255 area 0
 ! Indique aux autres routeurs (R1, R2, R3) que R5 est la sortie vers Internet
 default-information originate
 exit

! 3. Identification des paquets marqués par R2
class-map match-all MATCH5
 match precedence 5
 exit
class-map match-all MATCH_DSCP_EF
 match ip dscp ef
 exit

! 4. Garantie de bande passante (Policy-map)
policy-map SETAPRIORITY20
 class MATCH5
  ! On garantit 20% de la bande passante aux paquets Precedence 5
  priority percent 20
  exit
 class MATCH_DSCP_EF
  ! On garantit 15% de la bande passante au trafic Web (DSCP ef)
  priority percent 15
  exit
 exit

! 5. Application de la politique à la sortie vers Internet (Gig0/1)
int Gig0/1
 service-policy output SETAPRIORITY20
end
```

---

## 🌐 7. Réponse à la Question de Cours (NAT)

> [!WARNING]
> **Question : Pourquoi le laptop0 peut pinguer le serveur Web distant alors que le serveur Web distant ne peut pas le pinguer ?**

**Réponse :** Ce comportement est dû à la Traduction d'Adresses Réseau (NAT) effectuée par défaut par le routeur Wi-Fi WRT300N (R4). Le routeur masque toutes les adresses privées de son réseau Wi-Fi local (`10.4.x.x`) derrière sa seule adresse publique/externe (`10.34.0.4`). Les adresses privées n'étant pas routables depuis l'extérieur, le serveur Web distant ignore l'existence du réseau 10.4.0.0/16. R4 bloque logiquement tout trafic entrant qui n'a pas été préalablement initié par un équipement interne.

---

## 🧪 8. Phase de Validation
Les tests suivants ont été réalisés et documentés via captures d'écran :

*   **Génération de Trafic :** Réussite du ping `174.34.80.100` depuis PC1 et affichage de la page HTTP du serveur distant dans le navigateur Web de PC1.
*   **Vérification de la QoS :** La commande `show policy-map interface gig 0/1` sur R2 et R5 affiche une incrémentation des compteurs `packets` sous les classes `MATCHA` et `MATCH_HTTP`, prouvant que le trafic est bien intercepté et priorisé.
*   **Vérification de l'En-tête IP :** En Mode Simulation, l'analyse d'un paquet sortant de R2 montre le champ `DSCP: 0x28` dans la couche 3 (IPv4 Header). La valeur hexadécimale `0x28` (40 en décimal, soit `101000` en binaire) confirme l'injection des 3 bits de poids fort définissant la Precedence 5.