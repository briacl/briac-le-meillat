---
title: "Serveur de Messagerie"
module: "R303"
competence: ["Administrer", "Connecter"]
techs: ["SMTP", "IMAP", "Postfix", "Dovecot", "Linux"]
date: "2026-09-24"
status: "Terminé"
---

# Serveur de Messagerie (Mail)
> **R303 — Configuration Serveur de Messagerie** — *Briac Le Meillat*

**Objectif :** Configuration d'un serveur de messagerie complet avec Postfix (MTA) pour l'envoi, Dovecot (MDA) pour la réception, et configuration du client lourd Thunderbird.

---

## 🛠 1. Configuration DNS

> [!NOTE]
> **Pourquoi ?** Pour qu'un domaine puisse recevoir des emails, les autres serveurs doivent savoir à quelle machine s'adresser. Le champ MX (Mail eXchanger) dans la zone DNS indique que `ns-serveur.networkbriac.lan` est responsable du courrier pour le domaine.

Fichier : `/etc/bind/db.networkbriac.lan`

Ligne à ajouter dans le fichier :
```text
@ IN MX 10 ns-serveur.networkbriac.lan.
```

Application des modifications :
```bash
sudo systemctl restart bind9
```

---

## 2. Installation et configuration Postfix (MTA)

> [!NOTE]
> **Pourquoi ?** Postfix est le MTA (Mail Transfer Agent). Son rôle est d'envoyer les courriels (SMTP, port 25). Lors de l'installation, on le configure en "Site Internet" avec notre domaine pour qu'il gère les emails locaux. On crée aussi des utilisateurs système (`user1`, `user2`) car sous Linux, par défaut, chaque utilisateur local possède une boîte mail locale.

Installation du serveur SMTP :
```bash
sudo apt update
sudo apt install postfix
```

Création des comptes de messagerie (utilisateurs locaux) :
```bash
sudo adduser user1
sudo adduser user2
```

---

## 3. Test SMTP local (Telnet)

> [!NOTE]
> **Pourquoi ?** Avant de configurer des clients lourds comme Thunderbird, on teste la communication brute avec le protocole SMTP (port 25) via Telnet. Cela permet de vérifier que le MTA accepte bien les emails, de forger un mail manuellement et de s'assurer qu'il est délivré dans la file locale.

Ouverture de la session TCP sur le port SMTP local :
```bash
telnet 127.0.0.1 25
```

**Dialogue de la session SMTP :**
```text
EHLO networkbriac.lan
MAIL FROM: user1@networkbriac.lan
RCPT TO: user2@networkbriac.lan
DATA
Subject: Test
Ceci est un test
.
QUIT
```

**Explication des commandes SMTP :**
- `EHLO` : Initialise la communication.
- `MAIL FROM` : Définit l'adresse de l'expéditeur.
- `RCPT TO` : Définit l'adresse du destinataire.
- `DATA` : Indique le début des en-têtes et du corps du message.
- `.` (Point isolé) : Clôture la commande DATA et place le message dans la file d'attente (queue).
- `QUIT` : Ferme la session SMTP.

Vérification de la réception côté serveur :
```bash
cat /var/log/mail.log
> Sep 23 12:44:37 rt-mv-srv postfix/postfix-script[3856]: starting the Postfix mail system
Sep 23 12:44:37 rt-mv-srv postfix/master[3858]: daemon started -- version 3.6.4, configuration /etc/postfix
Sep 23 12:50:18 rt-mv-srv postfix/smtpd[4029]: connect from localhost[127.0.0.1]
Sep 23 12:53:45 rt-mv-srv postfix/smtpd[4029]: 83848C03F2: client=localhost[127.0.0.1]
Sep 23 12:54:18 rt-mv-srv postfix/cleanup[4034]: 83848C03F2: message-id=<20260923105345.83848C03F2@rt-mv-srv.edu.ua>
Sep 23 12:54:18 rt-mv-srv postfix/qmgr[3860]: 83848C03F2: from=<user1@networkbriac.lan>, size=391, nrcpt=1 (queue active)
Sep 23 12:54:18 rt-mv-srv postfix/local[4035]: 83848C03F2: to=<user2@networkbriac.lan>, relay=local, delay=60, delays=60/0.01/0/0, dsn=2.0.0, status=sent (delivered to mailbox)
Sep 23 12:54:18 rt-mv-srv postfix/qmgr[3860]: 83848C03F2: removed
Sep 23 12:54:23 rt-mv-srv postfix/smtpd[4029]: disconnect from localhost[127.0.0.1] ehlo=1 mail=1 rcpt=1 data=1 quit=1 commands=5
```
*(On cherche la ligne avec `status=sent` pour s'assurer de l'envoi).*

```bash
cat /var/mail/user2
> From user1@networkbriac.lan  Wed Sep 23 12:54:18 2026
Return-Path: <user1@networkbriac.lan>
X-Original-To: user2@networkbriac.lan
Delivered-To: user2@networkbriac.lan
Received: from networkbriac.lan (localhost [127.0.0.1])
	by rt-mv-srv.edu.ua (Postfix) with ESMTP id 83848C03F2
	for <user2@networkbriac.lan>; Wed, 23 Sep 2026 12:53:19 +0200 (CEST)
Subject: mon premier test SMTP
Message-Id: <20260923105345.83848C03F2@rt-mv-srv.edu.ua>
Date: Wed, 23 Sep 2026 12:53:19 +0200 (CEST)
From: user1@networkbriac.lan

ceci est un test depuis compte user1
```
*(Affiche le message brut reçu dans le fichier de distribution local de l'utilisateur).*

---

## 4. Installation Dovecot (MDA)

> [!NOTE]
> **Pourquoi ?** Postfix ne sait qu'envoyer des mails. Pour que les clients puissent les *récupérer* à distance, il nous faut un MDA (Mail Delivery Agent). Dovecot gère les protocoles IMAP (port 143, synchronisation) et POP3 (port 110, téléchargement simple).

Installation des démons IMAP et POP3 :
```bash
sudo apt install dovecot-imapd dovecot-pop3d
```

---

## 5. Test IMAP local (Telnet)

> [!NOTE]
> **Pourquoi ?** Tout comme pour le SMTP, on s'assure que le service de relève de courrier fonctionne en se connectant manuellement en IMAP (port 143) via Telnet. On s'identifie, on sélectionne la boîte et on lit le message envoyé à l'étape 3.

Ouverture de la session TCP sur le port IMAP local :
```bash
telnet 127.0.0.1 143
```

> **Dialogue de la session IMAP :**
```text
a1 LOGIN user2 pwd456
> a1 OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE SORT SORT=DISPLAY THREAD=REFERENCES THREAD=REFS THREAD=ORDEREDSUBJECT MULTIAPPEND URL-PARTIAL CATENATE UNSELECT CHILDREN NAMESPACE UIDPLUS LIST-EXTENDED I18NLEVEL=1 CONDSTORE QRESYNC ESEARCH ESORT SEARCHRES WITHIN CONTEXT=SEARCH LIST-STATUS BINARY MOVE SNIPPET=FUZZY PREVIEW=FUZZY PREVIEW STATUS=SIZE SAVEDATE LITERAL+ NOTIFY SPECIAL-USE] Logged in
a2 SELECT INBOX
> * FLAGS (\Answered \Flagged \Deleted \Seen \Draft)
* OK [PERMANENTFLAGS (\Answered \Flagged \Deleted \Seen \Draft \*)] Flags permitted.
* 1 EXISTS
* 1 RECENT
* OK [UNSEEN 1] First unseen.
* OK [UIDVALIDITY 1790162063] UIDs valid
* OK [UIDNEXT 2] Predicted next UID
a2 OK [READ-WRITE] Select completed (0.004 + 0.000 + 0.003 secs).
a3 FETCH 1 BODY[]
> * 1 FETCH (FLAGS (\Seen \Recent) BODY[] {507}
Return-Path: <user1@networkbriac.lan>
X-Original-To: user2@networkbriac.lan
Delivered-To: user2@networkbriac.lan
Received: from networkbriac.lan (localhost [127.0.0.1])
	by rt-mv-srv.edu.ua (Postfix) with ESMTP id 83848C03F2
	for <user2@networkbriac.lan>; Wed, 23 Sep 2026 12:53:19 +0200 (CEST)
Subject: mon premier test SMTP
Message-Id: <20260923105345.83848C03F2@rt-mv-srv.edu.ua>
Date: Wed, 23 Sep 2026 12:53:19 +0200 (CEST)
From: user1@networkbriac.lan

ceci est un test depuis compte user1
)
a3 OK Fetch completed (0.001 + 0.000 secs).
a4 LOGOUT
> * BYE Logging out
a4 OK Logout completed (0.001 + 0.000 secs).
Connection closed by foreign host.
```

**Explication des commandes IMAP :**
- `a1 LOGIN` : Authentification en clair de l'utilisateur.
- `a2 SELECT INBOX` : Sélection de la boîte de réception.
- `a3 FETCH 1 BODY[]` : Récupération de l'intégralité du contenu du message 1.
- `a4 LOGOUT` : Fermeture de la session IMAP.

---

## 6. Configuration des accès distants

> [!NOTE]
> **Pourquoi ?** Par défaut, pour des raisons de sécurité, Dovecot refuse les mots de passe en clair venant de l'extérieur, et Postfix refuse de relayer les mails des IP qu'il ne connaît pas. Comme on utilise des connexions non sécurisées pour le TP, on doit autoriser explicitement notre réseau local `192.31.25.0/24`.

### Autorisation d'authentification (Dovecot)
Fichier : `/etc/dovecot/conf.d/10-auth.conf`
```text
disable_plaintext_auth = no
```
*Autorise l'authentification IMAP/POP3 avec mot de passe en clair depuis une IP externe à localhost.*

```bash
sudo systemctl restart dovecot
```

### Autorisation de relais (Postfix)
Fichier : `/etc/postfix/main.cf`
```text
mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128 192.31.25.0/24
```
*Ajoute le sous-réseau `192.31.25.0/24` à la liste des hôtes de confiance. Autorise l'envoi de mails sans authentification SASL/TLS depuis les clients de ce réseau.*

```bash
sudo systemctl restart postfix
```

---

## 7. Configuration Thunderbird (MUA client)

> [!NOTE]
> **Pourquoi ?** Le client lourd (MUA - Mail User Agent) comme Thunderbird va s'occuper de gérer toutes ces commandes SMTP et IMAP pour nous via une interface graphique. On doit lui indiquer l'IP du serveur et les protocoles à utiliser.

Installation sur la machine cliente :
```bash
sudo apt install thunderbird
```

### Configuration manuelle dans l'interface
- **Identifiant** : `user1` (sans le nom de domaine)
- **Mot de passe** : Mot de passe système de `user1`
- **Serveur entrant** : `192.31.25.13` (IMAP, Port 143, Sécurité Aucune, Mot de passe normal)
- **Serveur sortant** : `192.31.25.13` (SMTP, Port 25, Sécurité Aucune, Mot de passe normal)

*(On paramètre la connexion MUA vers le MDA (entrant) et le MTA (sortant) de la machine serveur, en forçant le protocole en clair).*

### Validation finale
1. Envoi d'un mail depuis l'interface graphique de `user1` vers `user2@networkbriac.lan`.
2. Sur le serveur, on vérifie la réception :
```bash
cat /var/mail/user2
```
*(On confirme la réception du mail graphique, identifié par les en-têtes "User-Agent: Mozilla Thunderbird", dans le fichier local de l'utilisateur 2).*