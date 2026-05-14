# 📄 Compte-Rendu de TP : Passerelle Linux (IP Forwarding + NAT)

**Objectif principal :** Créer et configurer des machines virtuelles sous Linux et Windows pour simuler un réseau local passant par une passerelle Linux permettant de faire de l'IP Forwarding et du NAT pour l'accès à internet.

---

## 🛠️ Architecture

> [!NOTE]
> La Passerelle a 2 cartes réseau : enp0s3 (bridge vers IUT – DHCP, MAC réservée) et enp0s8 (réseau interne – IP fixe 192.168.0.1).

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
```bash
echo 'nameserver 172.18.26.101' > /etc/resolv.conf
echo 'nameserver 172.18.26.102' >> /etc/resolv.conf
echo 'nameserver 172.18.50.101' >> /etc/resolv.conf
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

*Test final : Naviguer vers `https://www.wikipedia.org` => Doit s'afficher.*
