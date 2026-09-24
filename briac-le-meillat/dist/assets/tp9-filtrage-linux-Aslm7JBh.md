---
title: "Filtrage et Pare-feu sous Linux"
module: "R201"
competence: ["Administrer", "Sécuriser"]
ac_lies: ["AC11.04"]
techs: ["Linux", "iptables", "Filtrage", "Pare-feu"]
date: "2026-05-19"
status: "Terminé"
image: "/assets/projects/tp-filtrage-linux-visu.png"
---
![Visualisation](/assets/projects/image-illustration-ltspice.png)

# Filtrage Réseau sous Linux (iptables & nftables)
> **R201 — Filtrage et Pare-feu sous Linux** — *Briac Le Meillat (19/05/2026)*

**Objectif :** Mise en œuvre du filtrage de paquets sous Linux à l'aide de l'architecture Netfilter. Présentation les configurations historiques sous `iptables` (gestion des chaînes, blocages DROP vs REJECT, chaînes personnalisées, logs noyau) ainsi que la transition moderne vers le système `nftables` par le biais de scripts de filtrage structurés.

---

## 💡 1. Introduction à Netfilter et Architecture (iptables)

## 💡 Pourquoi un pare-feu Linux (Netfilter) ?
Pour bien comprendre la gestion des flux réseaux sous Linux, prenons une analogie concrète :

Imaginez le réseau de votre machine Linux comme un **grand aéroport international** :
*   **Netfilter** : C'est le service de sécurité global de l'aéroport. Il surveille tout ce qui se passe.
*   **Les Chaînes** (`INPUT`, `OUTPUT`, `FORWARD`) : Ce sont les différents **points de contrôle physiques** (la douane à l'arrivée pour `INPUT`, la porte d'embarquement pour `OUTPUT`, et le couloir de transit pour `FORWARD`).
*   **Les Tables** (`filter`, `nat`, `mangle`) : Ce sont les **brigades spécialisées** (la brigade des passeports/visas pour la table `filter`, la brigade des taxes de marchandises pour la table `nat`).
*   **Les Cibles** (`ACCEPT`, `DROP`, `REJECT`) : Ce sont les **décisions finales du douanier** :
    *   `ACCEPT` : Vous laisser passer librement.
    *   `DROP` : Vous jeter discrètement à la poubelle, sans donner de nouvelles (l'expéditeur attend sans savoir pourquoi).
    *   `REJECT` : Vous fermer la porte au nez et vous renvoyer instantanément chez vous avec un avis de refus.

---

### 🖥️ Découverte technique de l'architecture
Pour analyser la configuration par défaut de Netfilter en tant que super-utilisateur (`root`), nous utilisons l'utilitaire historique `iptables` :

#### A. Consultation de la table de filtrage principale
```bash
sudo iptables -L
```

> [!NOTE]
> **Description de la table par défaut (`filter`) :**
> Sans option spécifique, la commande liste la table `filter`. Elle présente trois chaînes natives :
> - **INPUT** : Filtre les paquets réseau destinés à la machine locale.
> - **OUTPUT** : Filtre les paquets générés par la machine locale et sortant vers le réseau.
> - **FORWARD** : Filtre les paquets qui traversent simplement la machine (rôle de routeur) sans lui être destinés.

#### B. Consultation de la table de translation d'adresses (NAT)
```bash
sudo iptables -t nat -L
```

> [!NOTE]
> **Description de la table `nat` :**
> L'option `-t nat` cible la table dédiée au NAT. On y trouve notamment :
> - **PREROUTING** : Pour modifier les paquets entrants avant toute décision de routage (ex: DNAT/Redirection de port).
> - **POSTROUTING** : Pour modifier les paquets juste avant qu'ils ne quittent physiquement la machine (ex: SNAT/Masquerade).

---

## 🔒 2. Création d'une règle SSH et confrontation DROP vs REJECT

### 💡 L'explication vulgarisée
Nous souhaitons bloquer l'accès au service **SSH (port 22)**.
*   Si nous choisissons la cible **`DROP`** : le douanier Netfilter jette le paquet de connexion à la corbeille sans avertir l'expéditeur. Le client reste bloqué à attendre une réponse qui ne viendra jamais.
*   Si nous choisissons la cible **`REJECT`** : le douanier bloque l'accès mais renvoie un paquet de notification ("Connection Refused"). Le client sait immédiatement que l'accès lui est refusé.

---

### 🖥️ Manipulation et tests en laboratoire

> [!TIP]
> **Note de TP — Simulation d'un port d'écoute :**
> Si aucun serveur SSH n'est installé sur votre machine, ouvrez un terminal secondaire et simulez un service ouvert sur le port 22 grâce à **Netcat** :
> ```bash
> nc -l -p 22
> ```
> Pour tester la connexion de manière instantanée et propre, utilisez ensuite la commande suivante dans votre terminal principal :
> ```bash
> nc -zv 127.0.0.1 22
> ```
> *(Vous pouvez forcer l'arrêt d'un test ou d'un écouteur Netcat à tout moment via le raccourci `Ctrl + C`).*

#### Étape 1 : Application de la règle de rejet silencieux (`DROP`)
Nous ajoutons une règle à la chaîne `INPUT` visant le protocole TCP sur la destination du port 22 :

```bash
sudo iptables -A INPUT -p tcp --dport 22 -j DROP
```

*   **Vérification** : Visualisez l'ajout de la règle avec la commande `sudo iptables -L`.
*   **Test de connexion** : Lancez un test de connexion via `nc -zv 127.0.0.1 22` ou `ssh administrateur@localhost`.
*   **Comportement observé** : La console reste figée (*freeze*). Aucun retour n'est affiché pendant de longues secondes avant qu'une erreur de *Timeout* n'apparaisse. Le paquet ayant été supprimé en silence, le protocole TCP tente d'émettre à nouveau en boucle.

#### Étape 2 : Application du rejet explicite (`REJECT`)
Nous vidons la table de ses règles actuelles (`-F` pour *Flush*) puis appliquons une cible `REJECT` :

```bash
# Nettoyage de la table filter
sudo iptables -F

# Application de la règle REJECT
sudo iptables -A INPUT -p tcp --dport 22 -j REJECT
```

*   **Test de connexion** : Relancez le test Netcat ou SSH.
*   **Comportement observé** : Le rejet est **instantané**. Le terminal renvoie immédiatement le message :
    `ssh: connect to host localhost port 22: Connection refused`
    *(ou `nc: connect to 127.0.0.1 port 22 (tcp) failed: Connection refused`)*. Netfilter a renvoyé un paquet ICMP de rejet au client.

#### Étape 3 : Nettoyage pour l'étape suivante
```bash
sudo iptables -F
```

---

## 🛡️ 3. Réglage de la politique par défaut ("Policy")

### 💡 L'explication vulgarisée
Par défaut, la politique du pare-feu Linux est permissive : *"Tout est autorisé, sauf ce qui est explicitement interdit"*.

Si l'on modifie la politique par défaut (ou *Policy*) pour la passer à `DROP`, on change radicalement de philosophie pour adopter un modèle de **sécurité maximale** : *"Tout est interdit, sauf ce qui est explicitement autorisé"*. C'est le principe du **moindre privilège**.

---

### 🖥️ Manipulation technique

#### Étape 1 : Verrouillage complet du pare-feu
Nous passons les politiques par défaut de toutes les chaînes natives à `DROP` :

```bash
sudo iptables -P INPUT DROP
sudo iptables -P OUTPUT DROP
sudo iptables -P FORWARD DROP
```

> [!WARNING]
> **Attention lors d'une connexion distante !**
> Si vous exécutez ces commandes à travers une session SSH distante (sans avoir préalablement autorisé votre adresse IP), votre connexion sera instantanément coupée et vous perdrez définitivement la main sur le serveur.

#### Étape 2 : Conséquence sur le trafic Web
*   **Test** : Ouvrez un navigateur ou lancez un `curl https://1.1.1.1`.
*   **Analyse de l'échec** : La requête web échoue immédiatement.
*   **Explication technique** : En configurant `OUTPUT` à `DROP`, la machine locale est incapable de faire sortir la moindre requête (dont le protocole DNS sur le port 53 ou le trafic Web HTTP/S sur les ports 80/443). De plus, avec `INPUT` à `DROP`, toute réponse du réseau qui parviendrait aux interfaces serait détruite à l'entrée. Le réseau est complètement hermétique.

#### Étape 3 : Restauration des politiques d'accès pour la suite du TP
```bash
sudo iptables -P INPUT ACCEPT
sudo iptables -P OUTPUT ACCEPT
sudo iptables -P FORWARD ACCEPT
```

---

## 👥 4. Autoriser uniquement une machine cible (Machine M)

### 💡 L'explication vulgarisée
Dans un pare-feu Netfilter, les règles d'une chaîne sont lues de **haut en bas**. Dès qu'un paquet réseau correspond aux critères d'une règle (protocole, ports, adresses), le douanier applique immédiatement la cible associée (`ACCEPT`, `DROP`) et **interrompt la lecture** de la chaîne.

Il faut donc placer la règle d'autorisation sélective (l'invitation "VIP" pour notre machine autorisée M) **au-dessus** de la règle d'interdiction globale. Si on mettait l'interdiction générale en premier, tout le monde serait rejeté avant même que la règle VIP ne soit examinée.

---

### 🖥️ Implémentation technique

> [!NOTE]
> Dans les commandes ci-dessous, veillez à remplacer `adresse_ip_machine_M` par l'IP réelle de la machine à autoriser (par exemple `127.0.0.1` pour effectuer des tests locaux, ou l'IP de votre machine hôte physique).

```bash
# 1. Ajout de la règle d'autorisation pour l'IP privilégiée M
sudo iptables -A INPUT -p tcp --dport 22 -s adresse_ip_machine_M -j ACCEPT

# 2. Ajout de la règle de blocage universelle pour le port 22
sudo iptables -A INPUT -p tcp --dport 22 -j DROP
```

#### A. Vérification de l'ordre de priorité
Pour valider le bon ordonnancement des règles, exécutez la commande suivante :
```bash
sudo iptables -L --line-numbers
```

Vous devriez obtenir un résultat structuré comme suit :
```text
Chain INPUT (policy ACCEPT)
num  target     prot opt source               destination
1    ACCEPT     tcp  --  127.0.0.1            anywhere             tcp dpt:ssh
2    DROP       tcp  --  anywhere             anywhere             tcp dpt:ssh
```

#### B. Validation des accès
*   **Test depuis la machine M** : La connexion vers le port 22 réussit parfaitement (`succeeded!`).
*   **Test depuis une autre adresse IP** : Le flux est intercepté par la règle numéro 2 (`DROP`) et la tentative se solde par un échec silencieux.

---

## 🛠️ 5. Utilisation d'une chaîne personnalisée

### 💡 L'explication vulgarisée
Au fur et à mesure qu'un pare-feu grandit, la chaîne principale `INPUT` devient un immense hall d'entrée désordonné.

Pour maintenir la configuration propre, on crée des **chaînes personnalisées** (des pièces dédiées). Par exemple, on crée une pièce appelée `ma_chaine_ssh`. Dès qu'un paquet se présente pour une connexion SSH dans le hall d'entrée (`INPUT`), on l'oriente vers la pièce `ma_chaine_ssh` où il subira un contrôle approfondi basé sur ses propres règles spécifiques.

---

### 🖥️ Implémentation technique

#### Étape 1 : Remise à zéro de la configuration
```bash
sudo iptables -F
```

#### Étape 2 : Création et alimentation de la chaîne personnalisée
```bash
# 1. Création de la nouvelle chaîne personnalisée
sudo iptables -N ma_chaine_ssh

# 2. Redirection de tout le flux TCP port 22 entrant vers notre chaîne
sudo iptables -A INPUT -p tcp --dport 22 -j ma_chaine_ssh

# 3. Ajout des règles spécifiques à l'intérieur de notre chaîne personnalisée
sudo iptables -A ma_chaine_ssh -s adresse_ip_machine_M -j ACCEPT
sudo iptables -A ma_chaine_ssh -j DROP
```

> [!IMPORTANT]
> **Spécificité des chaînes personnalisées (Policy) :**
> Il est techniquement impossible de définir une politique par défaut globale (ex: `iptables -P ma_chaine_ssh DROP`) sur une chaîne utilisateur. Ces politiques sont réservées aux chaînes natives du noyau.
> Pour assurer la sécurité, nous insérons donc manuellement une règle de fermeture universelle (`-j DROP`) à la toute fin de notre chaîne personnalisée.

---

## 📷 6. Journalisation et Traçabilité (Logs)

### 💡 L'explication vulgarisée
Pour sécuriser notre serveur, nous voulons mettre en place une **caméra de surveillance** juste devant la porte de rejet. L'objectif est de photographier et d'inscrire dans un registre d'accès (les logs système) l'identité complète de chaque visiteur non autorisé qui tente d'entrer en SSH, avant de lui interdire l'accès.

---

### 🖥️ Implémentation technique

La règle de journalisation (`LOG`) doit obligatoirement être placée **avant** la règle finale de rejet (`DROP`). Nous allons l'insérer à la position numéro 2 de notre chaîne personnalisée (décalant ainsi la règle de blocage à la position 3) :

```bash
sudo iptables -I ma_chaine_ssh 2 -j LOG --log-prefix "Connexion SSH REFUSEE: "
```

---

### 🛠️ Étape indispensable de dépannage des Logs (Troubleshooting)

> [!WARNING]
> **Problème fréquent sous VM Linux moderne :**
> Si aucun log ne remonte dans vos terminaux ou fichiers système lors de vos tests, c'est que le noyau Linux n'a chargé aucun module de journalisation actif pour la pile IPv4 (renvoyant `net.netfilter.nf_log.2 = NONE`).
> Pour corriger ce problème, exécutez impérativement ces trois commandes de dépannage en tant que `root` :

```bash
# 1. Charger en mémoire le module noyau nf_log_ipv4
sudo modprobe nf_log_ipv4

# 2. Associer Netfilter au backend nf_log_ipv4 de la pile réseau
sudo sysctl -w net.netfilter.nf_log.2=nf_log_ipv4

# 3. Permettre la remontée des logs à travers les namespaces réseau
sudo sysctl -w net.netfilter.nf_log_all_netns=1
```

---

### 🔍 Test et Analyse de la trace réseau
1.  Simulez ou relancez le port d'écoute : `nc -l -p 22`.
2.  Dans votre terminal principal, effectuez une requête interdite en ciblant l'IP locale ou l'IP de votre carte réseau (ex: `nc -zv 192.31.25.12 22`).
3.  Pour extraire la trace générée par le pare-feu, lancez la commande d'inspection :

```bash
sudo dmesg | grep "SSH REFUSEE"
```
*(Alternative : `sudo tail -n 50 /var/log/syslog | grep "SSH REFUSEE"` ou `sudo journalctl -xe | grep "SSH REFUSEE"`).*

**Exemple de log obtenu :**
```text
Connexion SSH REFUSEE: IN=enp0s3 OUT= MAC=08:00:27:fc:1b:22 SRC=192.31.25.12 DST=192.31.25.10 PROTO=TCP SPT=49210 DPT=22 SYN
```

**Analyse des informations collectées pour le compte-rendu :**
*   **`IN=`** : Interface d'entrée réseau empruntée (ex: `enp0s3` ou `lo` si testé localement).
*   **`SRC=`** : Adresse IP source de l'émetteur suspect.
*   **`DST=`** : Adresse IP de destination (notre machine cible).
*   **`SPT=`** : Port source éphémère et dynamique généré par le client (ex: `49210`).
*   **`DPT=`** : Port de destination visé (ici `22` pour le protocole SSH).
*   **`PROTO=`** : Protocole de transport utilisé (ici `TCP`).
*   **`SYN`** : Drapeau TCP indiquant une tentative d'ouverture d'une nouvelle connexion.

---

### 🧹 Nettoyage complet avant transition
Pour éviter tout conflit avec le nouveau moteur de filtrage (`nftables`), nous vidons et supprimons toutes nos règles et chaînes iptables :
```bash
sudo iptables -F
sudo iptables -X ma_chaine_ssh
```

---

## 🎛️ 7. Migration vers le nouveau système nftables

### 💡 L'explication vulgarisée
**nftables** est le successeur moderne et officiel d'iptables dans l'écosystème Linux. 

Plutôt que d'écrire et de lancer de nombreuses lignes de commandes de manière séquentielle, nftables permet de déclarer l'ensemble de son pare-feu au sein d'un **script structuré** (très proche d'un fichier de configuration classique). Il est plus performant, évite la redondance et sait gérer nativement des listes d'adresses ou de variables dynamiques (les **sets**).

---

### 🖥️ Implémentation technique du script de filtrage
Créez un fichier script nommé `monparefeu.sh` dans votre éditeur favori (ex: `nano monparefeu.sh`) et alimentez-le avec la structure suivante :

```nftables title="monparefeu.sh"
#!/usr/sbin/nft -f

# Nettoyer toutes les règles nftables précédentes
flush ruleset

table ip mon_filtre_reseau {
    # Déclaration du set de la Blacklist (adresses IP bannies)
    set blacklist {
        type ipv4_addr
        elements = { 192.168.0.99, 192.168.0.66 }
    }

    # Chaîne de contrôle INPUT
    chain input {
        type filter hook input priority 0;
        policy drop;

        # Autoriser le trafic local (Loopback)
        iifname "lo" accept

        # Suivi de connexion (Autoriser le trafic déjà établi et relié)
        ct state established,related accept

        # Bloquer instantanément les adresses IP blacklistées
        ip saddr @blacklist drop

        # Autoriser l'accès SSH UNIQUEMENT pour la machine M
        ip saddr adresse_ip_machine_M tcp dport 22 accept

        # Autoriser le trafic Web (HTTP & HTTPS) universellement
        tcp dport { 80, 443 } accept
    }

    # Chaîne de contrôle OUTPUT
    chain output {
        type filter hook output priority 0;
        policy accept;
    }
}
```

---

### 🛠️ Résolution des problèmes et déploiement du script

> [!WARNING]
> **Alerte — Fin de ligne Windows (`\r`) :**
> Si vous avez créé ou édité ce fichier depuis un environnement Windows, des caractères invisibles de fin de ligne `CRLF` (`\r`) vont provoquer des erreurs de syntaxe cryptiques lors de l'exécution du script (ex: `command not found` ou erreur près d'une accolade `}`).
> Pour nettoyer et convertir proprement le script au format UNIX, lancez impérativement :
> ```bash
> sed -i 's/\r$//' monparefeu.sh
> ```

#### A. Rendre le script exécutable
```bash
chmod +x monparefeu.sh
```

#### B. Lancement du pare-feu avec nftables
Pour exécuter le script directement avec l'interpréteur de nftables (méthode la plus sûre pour éviter les conflits d'interprétation d'accolades avec le shell Bash) :
```bash
sudo nft -f monparefeu.sh
```

#### C. Vérification des règles en cours d'exécution
Pour afficher les règles actuellement actives et compilées dans nftables :
```bash
sudo nft list ruleset
```

---

### 🔍 Validation finale du Pare-feu
*   **Test SSH depuis la machine autorisée M** $\rightarrow$ **Autorisé** (`ACCEPT`).
*   **Test SSH depuis une machine tiers ou blacklistée** $\rightarrow$ **Rejeté** silencieusement (`DROP`).


---

### 🧪 Procédure opérationnelle de test de validation

Voici la marche à suivre pas-à-pas pour valider vos deux tests de filtrage :

#### Test 1 : La connexion autorisée (Succeeded)
1.  **Démarrage de l'écouteur** : Dans un terminal secondaire, relancez l'écouteur Netcat et laissez-le tourner en arrière-plan (sans l'interrompre avec `Ctrl + C`) :
    ```bash
    nc -l -p 22
    ```
2.  **Lancement du test** : Dans votre terminal principal, exécutez le test de connexion sur l'interface locale (loopback) :
    ```bash
    nc -zv 127.0.0.1 22
    ```
*   **Résultat attendu** : Vous devez obtenir le statut `succeeded!`. La règle `iifname "lo" accept` de votre ruleset `nftables` laisse passer le paquet sur l'interface locale, et l'écouteur intercepte correctement la demande.

#### Test 2 : La connexion bloquée (Freeze / Drop silencieux)
1.  **Réactivation de l'écouteur** : Si l'écouteur Netcat s'est arrêté après le premier test, relancez-le :
    ```bash
    nc -l -p 22
    ```
2.  **Lancement du test** : Dans votre terminal principal, lancez le test en ciblant explicitement l'IP externe de votre carte réseau (ou une IP externe arbitraire non autorisée dans le script) :
    ```bash
    nc -zv 192.31.25.12 22
    ```
*   **Résultat attendu** : Le terminal principal reste figé (*freeze*), en attente d'une réponse dans le vide. Comme cette requête ne provient pas de `lo` (interface locale) et que l'IP externe de test n'est pas autorisée sur le port 22 dans le script, le paquet se heurte à la politique globale restrictive `policy drop` et se fait détruire silencieusement. Vous pouvez couper l'attente après quelques secondes avec un `Ctrl + C`.


---

## ✅ Conclusion
L'ensemble des objectifs de filtrage système est atteint. Nous avons validé la supériorité de `REJECT` pour le débogage actif face à la discrétion de `DROP`, et mis en évidence les mécanismes fins de Netfilter (gestion des chaînes, priorité de lecture des règles, logs noyau). La migration finale vers le système moderne `nftables` via un script structuré assure une protection robuste et performante, prête pour la production.

> [!TIP]
> **Résumé des mécanismes pare-feu étudiés :**
> - 🛡️ **Politiques par défaut** : Passage temporaire en `DROP` pour sécuriser le système global.
> - 👥 **Filtre ciblé (VIP)** : Priorisation de l'autorisation de la machine M avant le blocage universel.
> - 🛠️ **Chaînes personnalisées** : Centralisation du trafic SSH dans `ma_chaine_ssh` pour plus de clarté.
> - 📷 **Journalisation** : Débogage des logs noyau pour l'audit de sécurité (`dmesg`).
> - 🎛️ **Transition nftables** : Automatisation par script avec listes d'IP dynamiques (`sets`).