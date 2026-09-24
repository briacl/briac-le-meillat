---
title: "Routage Inter-VLAN (Router-on-a-Stick)"
module: "R103"
competence: ["Administrer", "Connecter"]
ac_lies: ["AC11.03", "AC11.05"]
techs: ["Cisco", "Routeur", "VLAN", "Routage"]
date: "2026-04-21"
status: "Terminé"
image: ""
---
# Routage Inter-VLAN (Router-on-a-Stick)
> **R103 — Routage Inter-VLAN (Router-on-a-Stick)** — *Briac Le Meillat*

**Objectif :** Permettre la communication entre des machines situées dans des VLAN différents en utilisant un routeur unique via une seule interface physique (méthode dite "Router-on-a-Stick").

## 💡 C'est quoi un Routeur ? (routage inter-vlan)
Dans le tp sur le switch et les vlan, nous avons vu ce qu'était un switch, comment on le configurait, ce qu'on pouvait faire avec.
Mais que se passe-t-il si vous voulez envoyer un message à un ordinateur situé dans un autre bâtiment ou sur Internet (donc dans un réseau complètement différent) ? Là le switch ne peut plus vous aider (en tout cas pas un switch de couche 2, mais un switch de couche 3 oui, nous verrons ça plus tard).
C'est là que le **Routeur** intervient ! Le Routeur, c'est comme le chef de gare ou le facteur à l'accueil de votre entreprise : son rôle n'est pas de relier les ordinateurs de la même pièce, mais de relier des pièces entières (des réseaux entiers) entre elles. Il lit l'adresse de destination de votre paquet de données, choisit le meilleur chemin, et le fait passer d'un réseau à un autre. C'est exactement ce qu'on va configurer ici, en lui apprenant manuellement les routes à prendre (le routage statique) !

---

## Architecture
### Adressage et Passerelles

| Équipement | VLAN | Adresse IP | Masque | Passerelle (Gateway) |
| :--- | :--- | :--- | :--- | :--- |
| PC1 / PC3 | 10 | 192.168.10.x | 255.255.255.0 | 192.168.10.1 |
| PC2 / PC4 | 20 | 192.168.20.x | 255.255.255.0 | 192.168.20.1 |
| R1 (sub-interface .1) | 10 | 192.168.10.1 | 255.255.255.0 | — |
| R1 (sub-interface .2) | 20 | 192.168.20.1 | 255.255.255.0 | — |

### Commandes Clés

```bash
interface interface.subnum   # Crée une sous-interface logique
encapsulation dot1q VLAN_ID  # Définit le protocole 802.1Q et le VLAN associé
ip address IP MASK           # Assigne l'IP qui servira de passerelle
```

## Étapes de Réalisation

### 1. Prérequis (Configuration des Switchs)

On conserve la configuration du TP n°1 pour les accès et le trunk entre SW1 et SW2. Cependant, une modification est nécessaire on SW1 pour raccorder le routeur :

**Sur SW1 :**

```bash
SW1(config)# interface gigabitEthernet 0/2
SW1(config-if)# switchport mode trunk
SW1(config-if)# no shutdown
```

> [!NOTE]
> Le lien entre le switch et le routeur doit impérativement être en Trunk pour transporter les flux étiquetés des VLAN 10 et 20.

### 2. Configuration du Routeur (R1)

L'interface physique Gi0/0 est divisée en sous-interfaces virtuelles, chacune traitant un VLAN spécifique.

**Configuration des sous-interfaces :**

```bash
# Configuration pour le VLAN 10
R1(config)# interface gigabitEthernet 0/0.1
R1(config-subif)# encapsulation dot1q 10
R1(config-subif)# ip address 192.168.10.1 255.255.255.0

# Configuration pour le VLAN 20
R1(config)# interface gigabitEthernet 0/0.2
R1(config-subif)# encapsulation dot1q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0
```

**Activation de l'interface physique :**

```bash
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# no shutdown
```

### 3. Configuration des Hôtes

Chaque PC doit désormais pointer vers l'adresse IP de sa sous-interface correspondante sur R1 pour sortir de son propre réseau.

*   **PC1/PC3** : Gateway = 192.168.10.1
*   **PC2/PC4** : Gateway = 192.168.20.1

## Vérifications et Tests

### 1. Table de routage

```bash
R1# show ip route
```

**Résultat attendu :** Les réseaux 192.168.10.0 et 192.168.20.0 doivent apparaître comme "Directly Connected" via les sous-interfaces Gi0/0.1 et Gi0/0.2.

### 2. Test de connectivité Inter-VLAN

Depuis PC1 (VLAN 10), lancer un ping vers PC2 (VLAN 20) :

```bash
C:> ping 192.168.20.x
```

**Analyse :** Le paquet monte jusqu'à R1 via le lien Trunk, R1 consulte sa table de routage, puis renvoie le paquet vers le VLAN 20 via le même lien physique (d'où le nom "Router-on-a-Stick").

---
**Auteur :** Briac Le Meillat  
**Date :** Février 2026