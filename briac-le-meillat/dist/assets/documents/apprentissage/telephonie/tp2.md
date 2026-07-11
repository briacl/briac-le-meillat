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
> **R204 — Mise en place d'un IVR et Trunk SIP** — *Briac Le Meillat (20/01/2026)*

**Objectif :** Configurer un serveur de **réponse vocale interactive (IVR)** complet avec messagerie vocale intégrée, puis de réaliser une liaison **"Trunk SIP"** entre deux serveurs Asterisk distants pour permettre des appels inter-sites.

## 💡 C'est quoi un IVR et un Trunk SIP ?
Vous avez déjà appelé le service client de votre opérateur ou de votre banque et entendu : "pour le service commercial tapez 1, pour l'assistance technique tapez 2..." ? Et bien, ça, c'est exactement ce qu'on appelle un **IVR** (Interactive Voice Response). 
C'est un serveur vocal interactif qui va accueillir l'appelant avec un message pré-enregistré et le guider vers le bon service en fonction des touches qu'il presse. 
Alors je vous préviens, nous quand nous l'avons fait, on a eu 3 tp de 3h (oui ça fait mal, si c'est toujours le cas pour vous, accrochez-vous), et que comme vous allez probablement le voir (probablement car je n'ai honnêtement pas eu connaissance dans ma promo de quiconque qui n'aie pas eu le moindre pb avec ces tp), tout va se dérouler comme prévu, sans problème, comme sur des roulettes, sans le moindre accroc (sarcasme, vous allez en chier).
Ce tp de 9h a, pour ma part, sans aucun doute, été si ce n'est le plus dur de l'année, l'un des plus durs, il aura poussé le bouchon vraiment...(au moment de la pépinière certains n'avaient toujours pas réussi à aller au bout...rares sont les élus du cisco...le cisco, c'est le diable à l'état pur, il vous regarde fixement quand vous êtes en souffrance et vous murmure "tu en chies ? je m'en tape.")
Voilà, après vous avoir bien motivé je vais vous rassurer en vous disant ceci : quand les 2 téléphones marchent (sous-entendu qu'ils communiquent, qu'ils peuvent s'appeler entre eux) alors là c'est...
Enfin bref, la 1ère partie est relativement simple (surotut par rapport à la 2ème donc...) 
On va configurer Asterisk pour qu'il décroche, joue un fichier son qu'on a enregistré nous-même, attende qu'on tape sur une touche du clavier téléphonique, et redirige l'appel.

Ensuite, la deuxième partie, c'est le **Trunk SIP**. Imaginez que votre entreprise a deux bâtiments : un à Paris et un à Lille. Chaque bâtiment a son propre serveur téléphonique (Asterisk) pour gérer les appels internes. Mais comment on fait pour que Jean de Paris puisse appeler Marie de Lille de manière totalement transparente, en passant par le réseau informatique, plutôt que de payer une communication à un opérateur téléphonique classique ? 
Et bien on crée un "Trunk SIP". C'est ni plus ni moins qu'un gros câble virtuel (un lien direct) entre les deux serveurs. Grâce à ça, les deux serveurs Asterisk vont pouvoir s'interconnecter. Dès qu'un poste tapera un numéro spécifique (par exemple qui commence par 07), notre serveur va comprendre qu'il faut envoyer l'appel dans le Trunk SIP vers le serveur de notre binôme en face. Vraiment ultra pratique pour interconnecter des sites distants ;)

---

## 📞 Partie 1 : Configuration de l'IVR et de la Messagerie Vocale

### ⚙️ 1. Préparation du système (Droits d'accès)
Pour permettre à Asterisk d'enregistrer et de manipuler les fichiers audio, nous avons dû accorder les droits d'écriture sur le répertoire des sons.

**Commande exécutée :**
```bash
chmod -R 777 /var/lib/asterisk/sounds/
```

> [!NOTE]
> L'usage de `sudo` n'était pas requis car la session était déjà ouverte en tant qu'utilisateur **root**.

### 🎙️ 2. Création des outils d'enregistrement (`extensions.conf`)
Nous avons défini des extensions spécifiques pour enregistrer les messages vocaux personnalisés de l'accueil et du menu.

**Extensions utilisées :** `0901` (Accueil) et `0902` (Menu IVR).

**Commande interne :**
```asterisk
same => n,Record(/var/lib/asterisk/sounds/accueil.gsm)
```

### ⚙️ 3. Logique de l'IVR (Dialplan)
Le menu interactif est configuré dans le contexte `[AccueilAnnonce]`.

**Touches configurées :**
- **1 :** Appel vers Fanvil (`0106`).
- **2 :** Appel vers Cisco (`0206`).
- **3 :** Annonce de l'heure (`SayUnixTime`).

> [!TIP]
> **Gestion de l'absence :** Si le poste ne répond pas après 12 secondes, l'appel bascule automatiquement vers la messagerie vocale :
> ```asterisk
> same => n,VoiceMail(0106@default)
> ```

---

## 🌐 Partie 2 : Interconnexion de deux serveurs (Trunk SIP)

### ⚙️ 4. Configuration du Trunk (`pjsip.conf`)
Pour relier le **Serveur A** (le nôtre) au **Serveur B** (binôme), nous avons configuré les blocs PJSIP nécessaires.

**Blocs clés ajoutés :**
- `[siptrunk-auth]` : Identifiants de connexion (`username=Trunk06`, `password=12345`).
- `[siptrunk-identify]` : Identification du serveur distant par son IP (`10.15.251.146`).
- `[siptrunk-registration]` : Enregistrement de notre serveur auprès du binôme.

### 🛣️ 5. Routage des appels sortants (`extensions.conf`)
Pour appeler le binôme (numéros commençant par `07XX`), nous avons inclus un contexte externe.

**Dialplan :**
```asterisk
exten => _07XX,1,Dial(PJSIP/${EXTEN}@siptrunk,12)
```

---

## 🛡️ Partie 3 : Problèmes rencontrés et Résolutions

> [!WARNING]
> Voici les problèmes rencontrés lors de l'interconnexion SIP et leurs résolutions.

| Problème | Cause | Résolution |
| :--- | :--- | :--- |
| **Endpoint not found** | Erreur de casse ou faute de frappe | Vérification via `pjsip show endpoints` |
| **Error 403 Forbidden** | IP non reconnue ou mauvais mot de passe | Correction du bloc `[identify]` chez le binôme |
| **Error 404 Not Found** | Utilisateur inconnu sur le distant | Harmonisation des sections `pjsip.conf` |
| **Invalid URI / No route** | Erreur de syntaxe dans le lien AOR | Correction de `@siptrunk` dans `extensions.conf` |

---

## ✅ Partie 4 : Tests de validation et Preuves de succès

### 🔍 6. Statuts des services
Le succès de l'interconnexion a été confirmé via la console Asterisk (CLI) :
- `pjsip show registrations` : Statut **Registered**.
- `pjsip show endpoints` : Endpoint **Reachable**.

### 📞 7. Flux d'appel réussi
Le log de la console a confirmé le flux complet d'un appel inter-serveur :
1. **INVITE** reçu du serveur distant.
2. **Ringing** sur le poste de destination.
3. **Answer** et établissement du pont audio (**Bridge**).

---

## 🏁 Conclusion

L'infrastructure est désormais pleinement fonctionnelle. Les utilisateurs peuvent naviguer dans l'IVR, laisser des messages vocaux et communiquer avec le site distant via le Trunk SIP établi. La prochaine étape consistera en une analyse Wireshark pour valider la négociation des codecs audio (**ulaw**).