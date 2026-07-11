# TP : Hébergement Web local et publication via Cloudflare Tunnel (VirtualHost & cloudflared)

## 1. Structure d'Apache (Organisation des dossiers)
L'organisation dans `/etc/apache2/` fonctionne de manière modulaire :
* **`/etc/apache2/apache2.conf`** : Fichier de configuration principal. Il charge toutes les autres sous-configurations.
* **`/etc/apache2/sites-available/`** : Dossier contenant les fichiers de configuration de chaque VirtualHost (Vhost) individuel. Chaque document de configuration définit un sous-domaine ou domaine spécifique.
* **`/etc/apache2/sites-enabled/`** : Dossier contenant des liens symboliques pointant vers les fichiers de `sites-available/`. Apache lit uniquement ce dossier pour charger les sites actifs au démarrage.
* **`/var/www/`** : Racine par défaut pour le stockage des fichiers web (HTML, PHP). On y crée un sous-dossier par site web développé.

---

## 2. Liaison Apache - Cloudflare via Cloudflare Tunnel
Pour rendre le site accessible depuis n'importe où sans IP publique fixe ni ouverture de port (80/443) sur la box/routeur, on utilise un **Tunnel Cloudflare (`cloudflared`)**.

* Le programme `cloudflared` s'exécute en local sur le serveur Apache.
* Il établit une connexion sortante sécurisée vers les serveurs de bordure (Edge) Cloudflare.
* **Flux de communication :** Navigateur client → DNS Cloudflare → Infrastructure Cloudflare → Cloudflare Tunnel (connexion établie) → Apache (`localhost:80`).

---

## 3. Gestion Apache pour l'accès depuis le navigateur
Quand le trafic arrive du tunnel vers le port `80` d'Apache :
1. Apache intercepte la requête HTTP.
2. Il lit le champ `Host:` dans l'en-tête HTTP envoyé par le navigateur (ex : `app.networkbriac.pp.ua`).
3. Il parcourt les fichiers de `sites-enabled/` pour trouver le vhost ayant le `ServerName` correspondant.
4. Il pointe vers le `DocumentRoot` associé pour délivrer les fichiers au client.

---

## 4. Partie pratique
Explication pas à pas pour le sous-domaine **`app.networkbriac.pp.ua`**.

### Partie A : Préparation du dossier du site
Crée le répertoire du site web et configure les permissions appropriées pour l'utilisateur d'Apache (`www-data`) :
```bash
mkdir -p /var/www/app_site
chown -R www-data:www-data /var/www/app_site
echo "Mon site via Tunnel" > /var/www/app_site/index.html
```

---

### Partie B : Configuration du VirtualHost Apache
Création du document de configuration `/etc/apache2/sites-available/app.conf` :
```apache
<VirtualHost *:80>
    ServerName app.networkbriac.pp.ua
    DocumentRoot /var/www/app_site
</VirtualHost>
```

**Explication littérale ligne par ligne du document :**
* **Ligne 1 : `<VirtualHost *:80>`** → Ouvre la déclaration du vhost pour écouter sur toutes les interfaces réseau du serveur, sur le port HTTP standard `80`.
* **Ligne 2 : `ServerName app.networkbriac.pp.ua`** → Spécifie le nom de domaine exact que ce vhost doit intercepter.
* **Ligne 3 : `DocumentRoot /var/www/app_site`** → Définit le chemin absolu du dossier système où Apache doit lire les fichiers à envoyer au navigateur.
* **Ligne 4 : `</VirtualHost>`** → Ferme la déclaration de la configuration du vhost.

---

### Partie C : Activation du vhost Apache
Active la configuration du site et recharge le serveur web :
```bash
sudo a2ensite app.conf
sudo systemctl reload apache2
```

> [!NOTE]
> * `a2ensite app.conf` crée le lien symbolique dans `sites-enabled/`.
> * `systemctl reload apache2` recharge la configuration sans couper le serveur web.

---

### Partie D : Installation et configuration du Cloudflare Tunnel
1. **Téléchargement et authentification du client :**
   ```bash
   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared.deb
   cloudflared tunnel login
   ```

2. **Création du tunnel nommé `briac-tunnel` :**
   ```bash
   cloudflared tunnel create briac-tunnel
   ```
   *Cette commande génère un identifiant unique (UUID) et un fichier de clés `.json`.*

3. **Création du document de configuration du tunnel dans `~/.cloudflared/config.yml` :**
   ```yaml
   tunnel: 1234abcd-1234-abcd-1234-1234abcd1234
   credentials-file: /root/.cloudflared/1234abcd-1234-abcd-1234-1234abcd1234.json
   ingress:
     - hostname: app.networkbriac.pp.ua
       service: http://localhost:80
     - service: http_status:404
   ```

**Explication littérale ligne par ligne du document :**
* **Ligne 1 : `tunnel: ...`** → Indique l'UUID exact du tunnel créé précédemment.
* **Ligne 2 : `credentials-file: ...`** → Spécifie le chemin vers le fichier de clés indispensable pour s'authentifier auprès de Cloudflare.
* **Ligne 3 : `ingress:`** → Débute la liste des règles de routage du trafic entrant (Ingress Rules).
* **Ligne 4 : `- hostname: app.networkbriac.pp.ua`** → Première règle : capture le trafic destiné à ce sous-domaine spécifique.
* **Ligne 5 : `service: http://localhost:80`** → Redirige en local le trafic capturé à la ligne précédente vers le port 80 d'Apache.
* **Ligne 6 : `- service: http_status:404`** → Règle finale obligatoire (catch-all) : renvoie une erreur 404 si le trafic arrivant dans le tunnel ne correspond à aucun hostname configuré.

---

### Partie E : Routage DNS et démarrage du tunnel
1. **Création automatique du champ DNS de type "Tunnel" sur l'interface Cloudflare :**
   ```bash
   cloudflared tunnel route dns briac-tunnel app.networkbriac.pp.ua
   ```

2. **Démarrage du tunnel pour valider la liaison :**
   ```bash
   cloudflared --config ~/.cloudflared/config.yml tunnel run briac-tunnel
   ```

Le sous-domaine est donc accessible mondialement en HTTPS (le certificat SSL est géré de manière transparente par le proxy Cloudflare).

---

## 5. Flux de communication et architecture réseau

Voici le schéma de communication réseau complet pour **`app.networkbriac.pp.ua`** :

```plaintext
[ Navigateur Client ] (Internet)
       |
       | 1. Requête HTTPS (app.networkbriac.pp.ua)
       v
[ DNS Cloudflare ] (Résolution de type "Tunnel")
       |
       | 2. Routage interne (Proxy 🧡) + Gestion du certificat SSL
       v
[ Serveurs Edge Cloudflare ]
       |
       | 3. Encapsulation dans le tunnel sortant permanent
       |    (Traverse le NAT/Pare-feu, aucune IP publique fixe requise)
       v
====================== [ RÉSEAU LOCAL / Serveur "briacx" ] ======================
       |
[ cloudflared (Démon Tunnel) ]
       |
       | 4. Désencapsulation et application de la règle "Ingress"
       |    (Redirection vers http://localhost:80)
       v
[ Serveur Apache (Écoute sur :80) ]
       |
       | 5. Interception de la requête HTTP
       |    (Lecture de l'en-tête "Host: app.networkbriac.pp.ua")
       v
[ Mécanisme VirtualHost ]
       |
       | 6. Parcours de /etc/apache2/sites-enabled/
       |    (Match avec le ServerName défini dans app.conf)
       v
[ Système de Fichiers (Debian/Ubuntu) ]
       |
       | 7. Lecture du DocumentRoot (/var/www/app_site/)
       |    (Extraction de index.html ou index.php)
       v
=================================================================================
       |
       | 8. Le fichier est renvoyé au client via le même chemin inverse.
```