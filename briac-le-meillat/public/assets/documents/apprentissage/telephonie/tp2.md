---
title: "Mise en place d'un IVR et Trunk SIP"
module: "R204"
competence: "Connecter"
ac_lies: ["AC12.03", "AC12.04"]
techs: ["Asterisk", "SIP", "IVR", "VoIP"]
date: "2026-01-20"
status: "Terminé"
---

# Mise en place d'un IVR et Interconnexion Asterisk (Trunk SIP)

**Auteur :** Briac Le Meillat

**Date :** Janvier 2026

**Projet :** TP R2.01 - Téléphonie sur IP et Services Asterisk


---

## 1. Objectifs du TP

L'objectif de ce TP était de configurer un serveur de **réponse vocale interactive (IVR)** complet avec messagerie vocale intégrée, puis de réaliser une liaison **"Trunk SIP"** entre deux serveurs Asterisk distants pour permettre des appels inter-sites.

---

## 2. Configuration de l'IVR et de la Messagerie Vocale

### 2.1 Préparation du système (Droits d'accès)
Pour permettre à Asterisk d'enregistrer et de manipuler les fichiers audio, nous avons dû accorder les droits d'écriture sur le répertoire des sons.

**Commande exécutée :**
```bash
chmod -R 777 /var/lib/asterisk/sounds/
```
*Note :* L'usage de `sudo` n'était pas requis car la session était déjà ouverte en tant qu'utilisateur **root**.

### 2.2 Création des outils d'enregistrement (`extensions.conf`)
Nous avons défini des extensions spécifiques pour enregistrer les messages vocaux personnalisés de l'accueil et du menu.

**Extensions utilisées :** `0901` (Accueil) et `0902` (Menu IVR).
**Commande interne :**
```asterisk
same => n,Record(/var/lib/asterisk/sounds/accueil.gsm)
```

### 2.3 Logique de l'IVR (Dialplan)
Le menu interactif est configuré dans le contexte `[AccueilAnnonce]`.

**Touches configurées :**
- **1 :** Appel vers Fanvil (`0106`).
- **2 :** Appel vers Cisco (`0206`).
- **3 :** Annonce de l'heure (`SayUnixTime`).

**Gestion de l'absence :** Si le poste ne répond pas après 12 secondes, l'appel bascule automatiquement vers la messagerie vocale :
```asterisk
same => n,VoiceMail(0106@default)
```

---

## 3. Interconnexion de deux serveurs (Trunk SIP)

### 3.1 Configuration du Trunk (`pjsip.conf`)
Pour relier le **Serveur A** (le nôtre) au **Serveur B** (binôme), nous avons configuré les blocs PJSIP nécessaires.

**Blocs clés ajoutés :**
- `[siptrunk-auth]` : Identifiants de connexion (`username=Trunk06`, `password=12345`).
- `[siptrunk-identify]` : Identification du serveur distant par son IP (`10.15.251.146`).
- `[siptrunk-registration]` : Enregistrement de notre serveur auprès du binôme.

### 3.2 Routage des appels sortants (`extensions.conf`)
Pour appeler le binôme (numéros commençant par `07XX`), nous avons inclus un contexte externe.

**Dialplan :**
```asterisk
exten => _07XX,1,Dial(PJSIP/${EXTEN}@siptrunk,12)
```

---

## 4. Problèmes rencontrés et Résolutions

| Problème | Cause | Résolution |
| :--- | :--- | :--- |
| **Endpoint not found** | Erreur de casse ou faute de frappe | Vérification via `pjsip show endpoints` |
| **Error 403 Forbidden** | IP non reconnue ou movais mot de passe | Correction du bloc `[identify]` chez le binôme |
| **Error 404 Not Found** | Utilisateur inconnu sur le distant | Harmonisation des sections `pjsip.conf` |
| **Invalid URI / No route** | Erreur de syntaxe dans le lien AOR | Correction de `@siptrunk` dans `extensions.conf` |

---

## 5. Tests de validation et Preuves de succès

### 5.1 Statuts des services
Le succès de l'interconnexion a été confirmé via la console Asterisk (CLI) :
- `pjsip show registrations` : Statut **Registered**.
- `pjsip show endpoints` : Endpoint **Reachable**.

### 5.2 Flux d'appel réussi
Le log de la console a confirmé le flux complet d'un appel inter-serveur :
1. **INVITE** reçu du serveur distant.
2. **Ringing** sur le poste de destination.
3. **Answer** et établissement du pont audio (**Bridge**).

---

## 6. Conclusion

L'infrastructure est désormais pleinement fonctionnelle. Les utilisateurs peuvent naviguer dans l'IVR, laisser des messages vocaux et communiquer avec le site distant via le Trunk SIP établi. La prochaine étape consistera en une analyse Wireshark pour valider la négociation des codecs audio (**ulaw**).