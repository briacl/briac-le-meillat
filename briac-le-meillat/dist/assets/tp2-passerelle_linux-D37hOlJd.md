---
title: "Passerelle Linux"
module: "R201"
competence: ["Administrer", "Connecter"]
ac_lies: ["AC11.04", "AC11.03"]
techs: ["Linux", "Passerelle", "Routage", "NAT"]
date: "2026-06-08"
status: "Terminé"
image: "/assets/projects/tp2-passerelle-linux-visu.png"
---
# Passerelle Linux
> **R201 — Mise en place d'une passerelle Linux** — *Briac Le Meillat (08/06/2026)*

**Objectif :** Créer et configurer des machines virtuelles sous Linux et Windows pour simuler un réseau local passant par une passerelle Linux permettant de faire de l'IP Forwarding et du NAT pour l'accès à internet.

## 💡 Comment ça on peut transformer une ubuntu simple en passerelle ?
Parmis les choses qui personnellement m'ont fait le plus kiffer durant ma 1ère année, ça a été quand j'ai découvert qu'on pouvait, à partir d'une simple machine ubuntu (desktop ou serve, qu'importe) la "transformer"/faire passer en une véritable passerelle.
J'ai trouvé ça assez dingue, et j'ai tellement kiffé, que je l'ai refait 5 fois depuis.
Mais quel est l'intérêt ?
Et bien quand vous êtes dans une situation où vous n'avez pas de router à disposition mais qu'il faut que vous mettiez en place une passerelle pour faire la "jonction"/transition entre 2 réseaux différents, ce genre de manipulation peut être très utile.
Grâce à de l'IP Forwarding et du NAT, on va pouvoir faire en sorte que notre machine ubuntu agisse comme un routeur, c'est à dire que lorsqu'une machine de notre réseau aura besoin d'aller à l'extérieur de notre réseau privé (par ex dans le cas d'une simple recherche internet), elle va envoyer sa requête à notre passerelle linux, qui va alors se charger de lui "prêter son ip" en masquant en réalité l'ip de la machine qui lui envoie la requête par mettre la sienne et envoyer la requête vers l'extérieur.
C'est pourquoi, pour que ce système fonctionne, il va impérativement falloir que notre passerelle linux aie 2 cartes réseaux, l'une vers notre réseau privé, l'autre vers l'extérieur (par ex dans le cas de l'iut vers le réseau 172.31.x.x, d'où l'importance du mode bridge sur le réseau de l'iut que nous verrons dans quelques instants).
Grâce à ça, on va pouvoir mettre en place un réseau privé, et faire en sorte que toutes les machines de ce réseau privé puissent accéder à internet en passant par notre passerelle linux.
Bien pratique ;)

---

## 🛠️ Architecture

> [!NOTE]
> La Passerelle a 2 cartes réseau :
- enp0s3 : bridge vers IUT - DHCP, MAC réservée
- enp0s8 : réseau interne - IP fixe 192.168.0.1

### Adressage IP
| Machine | Interface | IP / Masque | Passerelle par défaut |
| :--- | :--- | :--- | :--- |
| Passerelle Linux | enp0s3 (côté IUT – DHCP) | 172.31.x.x / 20 | 172.31.16.1 |
| Passerelle Linux | enp0s8 (côté LAN interne) | 192.168.0.1 / 24 | — |
| H1 – Ubuntu | enp0s3 | 192.168.0.2 / 24 | 192.168.0.1 |
| H2 – Ubuntu | enp0s3 | 192.168.0.3 / 24 | 192.168.0.1 |
| H3 – Windows | carte réseau | 192.168.0.4 / 24 | 192.168.0.1 |

### Commandes Linux (référence rapide)
```bash
ip a add <IP>/<masque> dev <iface>    # ajouter une IP sur une interface
ip a del <IP>/<masque> dev <iface>    # supprimer une IP
ip link set dev <iface> up            # activer une interface
ip link set dev <iface> down          # désactiver une interface
ip route add default via <passerelle> # route par défaut (passerelle)
ip a                                  # afficher toutes les IPs
ip -4 -br a                           # affichage IPv4 compact
ip r                                  # afficher la table de routage
ip n                                  # afficher le cache ARP (voisins)
dhclient enp0s3                       # demander une IP DHCP sur enp0s3
nslookup iut-rt                       # tester la résolution DNS
```

---

## 🖥️ Partie 1 : Étapes de Création

### 1. Créer les VMs dans le terminal
> [!NOTE]
> Dans le terminal de la machine physique, taper la commande `machine virtuelle`. Un script interactif se lance. Répondre dans l'ordre.

*   **Passerelle (Ubuntu Server)** : 2 cartes. Carte 1: bridge (réseau IUT, MAC réservée). Carte 2: interne (MAC aléatoire).
*   **H1 (Ubuntu Desktop)** : 1 carte, réseau interne, MAC aléatoire.
*   **H2 (Ubuntu Desktop)** : 1 carte, réseau interne, MAC aléatoire.
*   **H3 (Windows)** : 1 carte, réseau interne, MAC aléatoire.

> [!WARNING]
> Toutes les cartes en mode 'interne' de H1, H2, H3 et de la Passerelle (carte 2) doivent être sur le même réseau interne pour se voir.

### ⚙️ 2. Configurer l'interface interne de la Passerelle (enp0s8)
**Sur la Passerelle (Ubuntu Server) :**
```bash
sudo ip a add 192.168.0.1/24 dev enp0s8
sudo ip link set dev enp0s8 up

# Si enp0s3 n'a pas d'IP IUT, forcer le DHCP :
sudo dhclient enp0s3

# Vérification :
ip -4 -br a   # enp0s3 = 172.31.x.x  |  enp0s8 = 192.168.0.1
```

### ⚙️ 3. Configurer les machines internes H1, H2, H3
**Sur H1 (Ubuntu) :**
```bash
sudo ip a add 192.168.0.2/24 dev enp0s3
sudo ip link set dev enp0s3 up
sudo ip route add default via 192.168.0.1
```

**Sur H2 (Ubuntu) :**
```bash
sudo ip a add 192.168.0.3/24 dev enp0s3
sudo ip link set dev enp0s3 up
sudo ip route add default via 192.168.0.1
```

**Sur H3 (Windows) :**
IP : `192.168.0.4` | Masque : `255.255.255.0` | Passerelle : `192.168.0.1`

> [!WARNING]
> Windows bloque les pings par défaut. Aller dans : Pare-feu Windows > Autoriser une application > cocher 'Partage de fichiers et d'imprimantes' (domaine).

### ✅ 4. Vérifier la connectivité locale
**Depuis H1 :**
```bash
ping 192.168.0.1   # passerelle : doit répondre
ping 192.168.0.3   # H2 : doit répondre
ping 192.168.0.4   # H3 : doit répondre
```
*(ping 172.31.25.9 échoue car le NAT n'est pas encore actif)*

---

## 🌐 Partie 2 : IP Forwarding et NAT

### 5. Activer l'IP FORWARDING sur la Passerelle
> [!NOTE]
> Par défaut, Linux jette les paquets non destinés à lui. L'IP Forwarding lui dit de les retransmettre.

**Sur la Passerelle :**
```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
# Vérification :
cat /proc/sys/net/ipv4/ip_forward
```
si jamais même avec sudo ça ne fonctionne pas, alors faire via cette commande :
```bash
sudo bash -c 'echo 1 > /proc/sys/net/ipv4/ip_forward'
```

### 🔁 6. Configurer le NAT (MASQUERADE) sur la Passerelle
**Pourquoi le NAT est nécessaire ?**
Sans NAT, H1 envoie un paquet vers le réseau externe (IUT) avec l'IP source `192.168.0.2` (privée). Le routeur externe ne sait pas où répondre et le paquet est perdu.
Avec NAT (MASQUERADE), la Passerelle remplace l'IP source `192.168.0.2` par sa propre IP (ex: `172.31.x.x`). Le routeur externe peut alors répondre, et la Passerelle retransmet à H1.

**Commande sur la Passerelle :**
```bash
sudo iptables -t nat -A POSTROUTING -o enp0s3 -j MASQUERADE
```
*Explication : On masque (-j MASQUERADE) l'adresse IP des paquets sortant (-o) par l'interface IUT (enp0s3) après la décision de routage (-A POSTROUTING) dans la table NAT (-t nat).*

### ✅ 7. Tester la connectivité vers le réseau IUT
**Depuis H1 (192.168.0.2) :**
```bash
ping 172.31.16.1   # passerelle IUT : doit répondre
ping 172.31.25.9   # iut-rt : doit répondre
```

---

## 🌍 Partie 3 : DNS et Proxy

### 🔤 8. Configurer le DNS sur H1 et H2
**Sur H1 et H2 (Ubuntu) :**  
Dans /etc:resolv.conf mettre :
```bash
search univ-artois.fr
nameserver 172.18.26.101
nameserver 172.18.26.102
```
*Tests :*
```bash
nslookup iut-rt                     # doit résoudre l'IP de iut-rt
ping iut-rt                         # doit répondre
```

### 🌍 9. Configurer le proxy pour accéder à Internet
> [!WARNING]
> Sans proxy, impossible d'aller sur Internet. L'université impose un proxy pour toutes les connexions sortantes.

**Dans Firefox (H1 ou H2) :**
Préférences > Réseau > Configuration manuelle du proxy :
*   **Proxy HTTP :** `cache-etu.univ-artois.fr`
*   **Port :** `3128`
*   **also use this proxy for https :** cochée
*   **No proxy for :** `iut-rt, 172.31.25.9` c'est important. Pourquoi ?, car je vous ferais remaruer que quand vous êtes sur un poste de l'iut, vous êtes donc sur le réseau de l'iut (département rt), donc vous pouvez accédez sans problème à `172.31.25.9`, et le server dns des rt vous permet de taper plutôt `iut-rt` que l'ip du server, car vous êtes dans le réseau de l'iut, mais faites le test depuis chez vous, vous remarquerez que vous ne pouvez pas y accéder. C'est normal, vous n'êtes pas sur le même réseau. Il vous faudrait un VPN pour ça. Tant que vous êtes sur le réseau de l'iut, et c'est le cas via les postes de l'iut, mettez bien qu'il n'y a pas besoin de proxy pour `iut-rt` et l'ip du server

*Test final : Naviguer vers `https://www.wikipedia.org` => Doit s'afficher.*

---

## 🛡️ Partie 4 : Sécurisation de la Passerelle avec nftables

> [!NOTE]
> Votre passerelle route les paquets, mais elle est ouverte à tous les vents. Pour un hacker c'est le pays des merveilles, l'idéal. L'objectif est donc d'appliquer un pare-feu strict par défaut afin de ruiner au max le paradis du hacker, de maintenir votre NAT (Masquerade), et de n'autoriser l'administration SSH que depuis l'IP de votre poste.

### ⚙️ 10. Créer le script de pare-feu
Créer ou modifier le fichier de configuration de `nftables` :
```bash
sudo nano /etc/nftables.conf
```
*(Ou créer un fichier `parefeu.sh`)*

### ⚙️ 11. Injecter la configuration
Injecter la configuration exacte ci-dessous en remplaçant `192.168.0.X` par l'IP de votre client (Ubuntu ou Windows) pour le test SSH :

```nft
#!/sbin/nft -f

flush ruleset

table inet ma_securite {
    chain input {
        type filter hook input priority 0; policy drop;
        
        # Loopback autorisé
        iifname "lo" accept
        
        # Suivi d'état (laisser revenir les réponses)
        ct state established,related accept
        
        # Autoriser le ping depuis le réseau interne (enp0s8)
        iifname "enp0s8" ip protocol icmp accept
        
        # Sécurité SSH : Autoriser uniquement votre PC Client
        ip saddr 192.168.0.X tcp dport 22 accept
        
        # Log et Drop des autres tentatives SSH
        tcp dport 22 log prefix "ALERTE_SSH: " drop
    }

    chain forward {
        type filter hook forward priority 0; policy drop;
        
        # Autoriser la sortie (LAN -> WAN)
        iifname "enp0s8" oifname "enp0s3" accept
        
        # Autoriser le retour (WAN -> LAN)
        iifname "enp0s3" oifname "enp0s8" ct state established,related accept
    }

    chain srcnat {
        type nat hook postrouting priority 100;
        
        # NAT Masquerade pour la sortie Internet
        oifname "enp0s3" masquerade
    }
}
```

### ✅ 12. Appliquer et vérifier les règles
Appliquer la configuration et lister les règles actives :
```bash
sudo nft -f /etc/nftables.conf
sudo nft list ruleset
```

> [!TIP]
> **Tests de validation :**
> - Essayez de pinguer la passerelle depuis le client (doit marcher).
> - Essayez de naviguer sur le web depuis le client (doit marcher).
> - Essayez de vous connecter à la passerelle en ssh depuis votre machine d'hacker ayant l'ip 192.168.100.2/24, vous devez vous prendre un vent magistral (il ne répondra tout simplement pas, le paquet sera détruit silencieusement), ce sera alors gagné