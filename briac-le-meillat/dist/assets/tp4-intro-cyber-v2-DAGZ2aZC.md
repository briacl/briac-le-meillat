---
title: "Intro à la Cybersécurité Web"
module: "R209"
competence: ["Sécuriser"]
ac_lies: ["AC13.04"]
techs: ["Cybersécurité", "Web", "Vulnérabilités", "OWASP"]
date: "2026-05-27"
status: "Terminé"
image: "/assets/projects/intro-cyber-visu.png"
---
# Compte-Rendu Technique : Introduction à la Cybersécurité Web
> **R209 — Introduction à la Cybersécurité (Version Narrative)** — *Briac Le Meillat*

Ce compte-rendu détaille la mise en œuvre pratique des failles de sécurité web les plus courantes. Contrairement à un simple manuel d'instructions, nous allons voir ici *pourquoi* ces failles existent et *comment* un attaquant pense, en utilisant une approche didactique basée sur des analogies concrètes. 

L'environnement de travail est une pile LAMP sous WSL2 (Ubuntu) couplée à un serveur Flask (Python).

---

## 🛠️ Étape Préparatoire : Configuration de l'environnement (LAMP)

### 💡 L'explication vulgarisée
Pour héberger un site web dynamique en PHP et stocker ses données, nous avons transformé notre machine Linux (WSL) en un serveur local standard (pile LAMP : Linux, Apache, MySQL, PHP). C'est ce serveur qui va exécuter le code vulnérable fourni par le professeur. Imaginez que nous construisons notre propre bac à sable local, volontairement rempli de failles, pour pouvoir les exploiter sans danger.

### 🖥️ Explication Détaillée & Réalisation
L'intégralité du TP est réalisable sur une machine locale Windows grâce à WSL (Ubuntu).

**A. Installation des paquets et démarrage des services :**
```bash
sudo apt update && sudo apt install apache2 mysql-server php php-mysql -y
sudo service apache2 start
sudo service mysql start
```

> [!NOTE]
> **Particularité WSL2 :**
> Sous WSL2, MySQL tourne via `mysqld_safe`. La commande `sudo service mysql status` peut indiquer "stopped" même si le processus est actif. Pour vérifier : `pgrep -a mysqld`

**B. Déploiement via lien symbolique :**
```bash
sudo ln -s /home/briacl/Development/r209/tp4 /var/www/html/tp4
```
**C. Création de la base de données :**
```bash
mysql -u root -p -e "CREATE DATABASE r209tp4 CHARACTER SET utf8;"
mysql -u root -p r209tp4 -e "CREATE TABLE tchat (id INT AUTO_INCREMENT PRIMARY KEY, pseudo VARCHAR(50), message TEXT);"
mysql -u root -p r209tp4 -e "CREATE TABLE injection (id INT AUTO_INCREMENT PRIMARY KEY, pseudo VARCHAR(50), password VARCHAR(50));"
mysql -u root -p r209tp4 -e "INSERT INTO injection (pseudo, password) VALUES ('toto', '1234');"
```

---

## 🔴 Partie 1 — Faille XSS Pure (Stored XSS)

### 💡 L'explication vulgarisée
Imaginons que je vous invite sur le tchat de notre toute nouvelle application web. Vous me faites confiance, vous tapez un message, et il s'affiche pour tout le monde. Sauf que le développeur de ce tchat a fait une erreur très commune : **il fait une confiance aveugle à ce que les utilisateurs tapent**. 

Si je tape "Bonjour", la base de données enregistre "Bonjour", et l'affiche sur l'écran des autres.
Mais que se passe-t-il si, au lieu de taper "Bonjour", je tape un morceau de code, comme une balise JavaScript `<script>` ?
Et bien, le serveur va naïvement enregistrer ce code. Pire encore, quand vous allez vous connecter au tchat, le serveur va vous envoyer mon code. Votre navigateur, pensant que c'est le site légitime qui lui donne un ordre, va exécuter ce code à votre insu. 

C'est ça, une faille **XSS Stockée** (Cross-Site Scripting). J'ai réussi à faire exécuter mon propre code directement sur votre machine, simplement en envoyant un message dans le tchat. Avec ça, je peux afficher de fausses alertes, voler vos cookies, ou même créer un faux formulaire par-dessus le vrai site.

### 🖥️ Explication Détaillée & Réalisation

Le fichier vulnérable est un tchat (`partie1.php`). Le pseudo et le message sont insérés directement en BDD sans aucune sanitisation.

**Objectif 1 : Alerte au rafraîchissement (Popup)**
En insérant ce payload, le script s'enregistre. À chaque rechargement de page, le navigateur interprète le script et déclenche l'alerte pour n'importe quel visiteur.
```html
<script>alert('Faille XSS validée !');</script>
```

**Objectif 2 : Phishing (Faux formulaire de connexion)**
On exploite la faille pour injecter du HTML/CSS qui masque le site derrière une fausse interface de connexion.
```html
<div style="position:fixed; top:0; left:0; width:100%; height:100%; background:white; z-index:9999; padding:50px;">
    <h2>Votre session a expiré. Veuillez vous reconnecter :</h2>
    <form>
        <input type="text" placeholder="Utilisateur" name="user"><br><br>
        <input type="password" placeholder="Mot de passe" name="pass"><br><br>
        <button type="submit">Se connecter</button>
    </form>
</div>
```

---

## 🔑 Partie 2 — Vol et utilisation de Token (JWT / Flask)

### 💡 L'explication vulgarisée
Quand vous vous connectez à un site moderne, le serveur ne garde pas en mémoire qui vous êtes. À la place, il vous donne un "badge numérique" ultra-sécurisé : un Token JWT.
À chaque fois que vous cliquez sur une page privée, votre navigateur montre automatiquement ce badge au serveur pour dire : *"C'est bon, laisse-moi passer, c'est moi"*.

C'est un système très performant. Mais il a une faille conceptuelle évidente : **le serveur ne vérifie pas *qui* tient le badge, il vérifie uniquement si le badge est valide.**
Si un pirate arrive à voler ce badge (par exemple, en fouillant dans la mémoire de votre navigateur grâce à la faille XSS qu'on vient de voir), il lui suffit de l'accrocher à sa propre veste.
Pour le serveur, ce pirate, c'est vous. Le pirate peut alors usurper votre identité de manière totalement transparente, sans jamais avoir eu besoin de connaître votre mot de passe.

### 🖥️ Explication Détaillée & Réalisation

L'environnement du serveur d'authentification est lancé via Flask (Python).
```bash
flask run
```

**Étape A — Génération du badge (Route `/login`)**
On s'identifie pour récupérer notre token JWT.
```bash
curl -X GET "http://127.0.0.1:5000/login" -H "Content-Type: application/json" -d "{\"pseudo\":\"test\",\"password\":\"test\"}"
```
*Retour :* `{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}`

**Étape B — Usurpation (Route `/secure`)**
Il suffit de glisser ce token volé dans le Header HTTP nommé `token`. Le serveur valide l'identité sans poser de question.
```bash
curl -X GET "http://127.0.0.1:5000/secure" -H "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
*Retour :* `{"msg":"autorisé"}`

---

## 💉 Partie 3 — Injection SQL (SQLi)

### 💡 L'explication vulgarisée
Pour comprendre l'injection SQL, imaginons un gardien à l'entrée d'une discothèque qui lit bêtement des consignes sur un bout de papier.
La consigne du patron, c'est : *« Laisse entrer la personne si son pseudo est [PSEUDO] et que son mot de passe est [MOT_DE_PASSE]. »*

En temps normal, vous dites "Briac" et "1234", le gardien lit : *« Laisse entrer si son pseudo est Briac et mot de passe est 1234. »* Si c'est dans sa base de données, vous entrez.
Mais le gardien est un robot (la base de données SQL). Il ne comprend pas la différence entre la consigne du patron et ce que vous lui dites.

Si, au lieu de donner votre pseudo, vous lui dites : **« Briac' OU 1=1 »**
Le gardien va reconstituer sa phrase ainsi : *« Laisse entrer la personne si son pseudo est Briac OU si 1 est égal à 1. »*
Comme 1 est toujours égal à 1, la condition globale devient mathématiquement vraie ! Le gardien vous ouvre les portes en grand, sans même vérifier le mot de passe, et vous donne accès au compte. Pire encore, on peut même lui dire "Ignore le reste de la consigne" en utilisant le symbole de commentaire (`#`).

### 🖥️ Explication Détaillée & Réalisation

La requête vulnérable dans `connexion.php` concatène directement le texte tapé :
```sql
SELECT COUNT(id) FROM injection WHERE pseudo = '$pseudo' AND password = '$mdp'
```

**Objectif 1 : Se connecter au compte "toto" sans le mot de passe**
En tapant `toto' #` dans le pseudo, on génère la requête suivante :
```sql
SELECT COUNT(id) FROM injection WHERE pseudo = 'toto' # ' AND password = '1234'
```
Le symbole `#` commente la fin de la ligne. La vérification du mot de passe est totalement ignorée.

**Objectif 2 : Création d'un compte malveillant (Stacked Queries)**
On utilise le point-virgule `;` pour enchaîner une seconde requête malveillante.
Valeur saisie : `'; INSERT INTO injection (pseudo, password) VALUES ('hacker', '123'); #`
```sql
SELECT COUNT(id) FROM injection WHERE pseudo = ''; INSERT INTO injection (pseudo, password) VALUES ('hacker', '123');
```
Le SGBD exécute la première requête (qui échoue) puis crée tranquillement notre compte 'hacker'.

---

## 🛡️ Partie 4 — Sécurisation (Défense)

On a vu qu'on pouvait facilement tromper un tchat et un gardien robotique. Comment on répare ça ? La règle d'or en cybersécurité : **ne jamais faire confiance à ce que l'utilisateur tape.**

### 1. Contre les Injections SQL : Les Requêtes Préparées
Au lieu de laisser le gardien construire sa phrase en collant vos mots, on lui donne une phrase à trou scellée. Le SGBD compile d'abord l'ordre : *« Laisse entrer la personne si pseudo = X et password = Y »*.
Ensuite seulement, il remplace X et Y par ce que vous avez tapé, en les considérant *strictement* comme du texte inoffensif. Si vous tapez `OU 1=1`, la base de données cherchera quelqu'un dont le pseudo est littéralement "OU 1=1". La triche devient impossible.

**Après (sécurisé via PDO) :**
```php
$stmt = $bdd->prepare('SELECT COUNT(id) as countid FROM injection WHERE pseudo = :pseudo AND password = :password');
$stmt->execute([
    'pseudo' => $pseudo,
    'password' => $mdp
]);
```

### 2. Contre les Failles XSS : Désinfecter les entrées
Pour éviter qu'un message du tchat ne s'exécute comme du code, on utilise un filtre. En PHP, la fonction `htmlspecialchars()` agit comme une combinaison anti-radiation. Elle prend les caractères dangereux comme `<script>` et les transforme en texte inerte (`&lt;script&gt;`). Le navigateur voit simplement du texte à afficher, et non plus un ordre à exécuter.

**Après (sécurisé) :**
```php
echo htmlspecialchars($msg['message'], ENT_QUOTES, 'UTF-8');
```

> [!TIP]
> Qu'il s'agisse d'un affichage sur navigateur (XSS) ou d'une interprétation par un moteur (SQLi), la désinfection, l'échappement et le paramétrage constituent l'unique moyen de protéger vos applications.
