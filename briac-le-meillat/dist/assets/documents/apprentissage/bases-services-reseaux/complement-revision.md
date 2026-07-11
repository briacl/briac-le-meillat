# Complément de Révision - R203 (Bases des services réseaux)
**Document à coupler avec les CR de TP et les Fiches Mémos.**

---

## 1. Protocole FTP (File Transfer Protocol)
[cite_start]Le protocole FTP utilise deux canaux distincts : un pour les commandes (Port 21) et un pour les données[cite: 10]. 

### Modes de Connexion
* [cite_start]**Mode Actif :** Le serveur initie la connexion de données vers le client sur le port 20 (peut poser des problèmes avec les pare-feux)[cite: 12].
* [cite_start]**Mode Passif (PASV) :** Le client initie la connexion de données sur un port dynamique supérieur à 1024 (mode recommandé)[cite: 13].
* [cite_start]**FXP :** Permet un transfert direct entre deux serveurs FTP sans que les données ne transitent par le client[cite: 14].

### Commandes Principales
* [cite_start]**Contrôle :** `USER` / `PASS` (Authentification), `PORT` (Mode actif), `PASV` (Mode passif), `QUIT` (Fermeture)[cite: 19].
* [cite_start]**Transfert :** `RETR` (Télécharger), `STOR` (Envoyer/Remplacer), `APPE` (Envoyer/Concaténer), `REST` (Reprendre un transfert interrompu)[cite: 20].
* [cite_start]**Système de fichiers :** `PWD` (Dossier courant), `CWD` (Changer de dossier), `LIST` (Lister), `MKD` (Créer dossier), `DELE` (Supprimer fichier)[cite: 21].

### Codes de Retour FTP et HTTP
La logique des codes de statut est similaire entre FTP et HTTP.

| Plage | Signification HTTP | Signification FTP |
| :--- | :--- | :--- |
| **1xx** | [cite_start]Informationnel (ex: 100 Continue) [cite: 172] | [cite_start]Réponse positive préliminaire [cite: 23] |
| **2xx** | [cite_start]Succès (ex: 200 OK, 201 Created) [cite: 173] | [cite_start]Succès (ex: 200 OK, 226 Transfer complete) [cite: 23] |
| **3xx** | [cite_start]Redirection (ex: 301 Moved) [cite: 174] | [cite_start]Action intermédiaire (ex: 331 Mot de passe requis) [cite: 23] |
| **4xx** | [cite_start]Erreurs client (ex: 404 Not Found) [cite: 175] | [cite_start]Erreur temporaire [cite: 23] |
| **5xx** | [cite_start]Erreurs serveur (ex: 500 Internal Error) [cite: 176] | [cite_start]Erreur définitive (ex: 501 Syntaxe) [cite: 23] |

---

## 2. Services Web (HTTP & Sécurité)

### Méthodes HTTP
* [cite_start]`GET` : Obtenir des informations (ex: contenu d'une page)[cite: 167].
* [cite_start]`POST` : Envoi de données (ex: soumission de formulaires)[cite: 167].
* [cite_start]`HEAD` : Obtenir uniquement les en-têtes de la ressource[cite: 167].
* [cite_start]`PUT` : Remplacer ou ajouter une ressource sur le serveur[cite: 167].
* [cite_start]`DELETE` : Supprimer une ressource du serveur[cite: 167].

### Sécurisation SSL/TLS (HTTPS)
[cite_start]Le protocole HTTPS s'appuie sur SSL/TLS pour offrir trois niveaux de protection : le chiffrement, l'intégrité des données, et l'authentification[cite: 206, 207, 208, 209].
* [cite_start]**Créer une clé privée (RSA/DES3) :** `openssl genrsa -des3 -out server.key 1024`[cite: 1469].
* [cite_start]**Créer une requête de certificat (CSR) :** `openssl req -new -key server.key -out server.csr`[cite: 1473].

---

## 3. Protocoles de Boot (DHCP & TFTP)

### La Séquence DHCP (D.O.R.A)
1.  [cite_start]**DHCPDISCOVER :** Le client recherche un serveur en broadcast[cite: 121].
2.  [cite_start]**DHCPOFFER :** Le serveur propose un bail (IP + MAC)[cite: 121].
3.  [cite_start]**DHCPREQUEST :** Le client accepte le bail proposé[cite: 122].
4.  [cite_start]**DHCPACK :** Le serveur confirme l'attribution du bail[cite: 123].
[cite_start]*Note : Le client demande le renouvellement de son bail (via DHCPREQUEST) à la moitié de la durée de celui-ci[cite: 954].*

### [cite_start]Mécanique du TFTP (Port UDP 69) [cite: 95]
[cite_start]TFTP ne gère pas d'authentification[cite: 96]. [cite_start]Il possède 5 types de messages : `01` (Read), `02` (Write), `03` (Data), `04` (ACK), `05` (Error)[cite: 99, 100, 101, 102, 103].
* [cite_start]**Syndrome de l'apprenti sorcier :** C'est un problème de conception réseau où un expéditeur ne doit jamais renvoyer un paquet de données en réponse à un accusé de réception (ACK) dupliqué[cite: 104, 106].

---

## 4. Partage Réseau (NFS & Samba)

### Gestion des droits NFS (Squashing)
[cite_start]Ces paramètres se configurent dans le fichier `/etc/exports` du serveur NFS[cite: 28].
* `no_all_squash` : Option par défaut. [cite_start]Les utilisateurs gardent leur UID/GID respectifs[cite: 35].
* `all_squash` : Toutes les connexions sont transformées en utilisateur `nobody`. [cite_start]Indispensable pour un serveur public[cite: 35].
* `root_squash` : Option par défaut pour la sécurité. Le root distant est transformé en `nobody`[cite: 36].
* [cite_start]`no_root_squash` : Le root distant conserve ses droits (utilisé pour les stations diskless)[cite: 36].

### Évolution NFS
* [cite_start]**NFS v2/v3 :** Utilise plusieurs ports via `rpcbind` (Port 111) pour gérer `nfsd` (2049), `mountd`, `statd`, et `lockd` (ports aléatoires)[cite: 412, 417, 418, 420, 424].
* **NFS v4 :** Simplifié, seul le port 2049 (TCP) est utilisé. [cite_start]Le montage, le verrouillage et les statuts sont intégrés au démon `nfsd`[cite: 436, 437, 438, 440, 442].

### Samba 4 et Active Directory
[cite_start]Samba 4 n'est pas qu'un simple serveur de fichiers, il peut agir comme un **Contrôleur de Domaine Active Directory (AD)** complet[cite: 57]. Pour cela, il intègre obligatoirement :
* [cite_start]**DNS :** Nécessaire au fonctionnement de l'arborescence[cite: 67].
* [cite_start]**Kerberos :** Pour l'authentification centralisée (SSO)[cite: 68].
* [cite_start]**LDAP (v3) :** Pour stocker l'arborescence AD[cite: 69].
* [cite_start]**NTP :** Pour synchroniser les horloges (réponses signées obligatoires)[cite: 70].