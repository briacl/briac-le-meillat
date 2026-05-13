# Compte-Rendu : TP R2.03 - Administration de Serveurs Web (Apache2 & Nginx)

**Étudiant :** [Ton Nom]

**Environnement :** Ubuntu 22.04 LTS derrière une RT-Box (Gateway : 192.31.25.1)

**IP Serveur :** 192.31.25.12

---

## 1. Mise en place du serveur Web Apache2

### 1.1 & 1.2 Installation et vérification

L'objectif était d'installer le paquet de base et de vérifier le fonctionnement du service.

- **Commandes exécutées :**
    
    Bash
    
    ```
    sudo apt update
    sudo apt install apache2 -y
    sudo systemctl status apache2 # Vérification du statut 'active (running)'
    ```
    
- **Vérification :** Accès réussi à l'URL `http://192.31.25.12` affichant la page par défaut.
    

### 1.3 Création de pages protégées (Authentification par groupe)

Restriction d'accès au dossier `/prive` pour les membres du groupe **RT1**.

- **Méthode :** Activation du module `authz_groupfile`, création des utilisateurs et configuration du répertoire.
    
- **Commandes exécutées :**
    
    Bash
    
    ```
    sudo a2enmod authz_groupfile
    sudo htpasswd -c /etc/apache2/.htpasswd user1 # Création user1
    sudo htpasswd /etc/apache2/.htpasswd user2    # Ajout user2
    sudo nano /etc/apache2/groups                 # Contenu : RT1: user1 user2
    sudo mkdir /var/www/html/prive
    sudo echo "<h1>Bienvenue dans la zone privee RT1</h1>" > /var/www/html/prive/index.html
    ```
    
- **Configuration ajoutée dans `/etc/apache2/sites-available/000-default.conf` :**
    
    Apache
    
    ```
    <Directory "/var/www/html/prive">
        AuthType Basic
        AuthName "Acces Reserve au groupe RT1"
        AuthUserFile /etc/apache2/.htpasswd
        AuthGroupFile /etc/apache2/groups
        Require group RT1
    </Directory>
    ```
    

### 1.4 Limitation de la bande passante

Limitation du débit sortant à **40 Kb/s** pour l'ensemble du site.

- **Commandes exécutées :**
    
    Bash
    
    ```
    sudo a2enmod ratelimit
    head -c 5M /dev/urandom > /var/www/html/test_debit.bin # Création fichier test
    sudo systemctl restart apache2
    ```
    
- **Configuration ajoutée dans `/etc/apache2/sites-available/000-default.conf` :**
    
    Apache
    
    ```
    SetOutputFilter RATE_LIMIT
    SetEnv rate-limit 40
    ```
    
- **Validation :** Téléchargement via Firefox stabilisé à **39.8 KB/s**.
    

### 1.5 Pages personnelles (UserDir)

Permettre à l'utilisateur `administrateur` de publier son site via `~/public_html`.

- **Commandes exécutées :**
    
    Bash
    
    ```
    sudo a2enmod userdir
    mkdir ~/public_html
    chmod 755 /home/administrateur
    chmod 755 ~/public_html
    echo "<h1>Espace personnel de administrateur</h1>" > ~/public_html/index.html
    sudo systemctl restart apache2
    ```
    
- **Test :** URL fonctionnelle : `http://192.31.25.12/~administrateur/`.
    

### 1.6 Serveurs virtuels (Virtual Hosts)

Hébergement de deux sites distincts : `vendeur.localhost` et `client.localhost`.

- **Commandes exécutées :**
    
    Bash
    
    ```
    sudo mkdir -p /var/www/vendeur /var/www/client
    sudo a2ensite vendeur.conf
    sudo a2ensite client.conf
    sudo systemctl reload apache2
    ```
    
- **Configuration `/etc/apache2/sites-available/vendeur.conf` :**
    
    Apache
    
    ```
    <VirtualHost *:80>
        ServerName vendeur.localhost
        DocumentRoot /var/www/vendeur
    </VirtualHost>
    ```
    
- **Résolution DNS locale (Fichier `/etc/hosts` sur le client) :**
    
    Plaintext
    
    ```
    192.31.25.12  vendeur.localhost client.localhost
    ```
    

---

## 2. Machine LEMP (Nginx, MariaDB, PHP)

### 2.1 Installation et configuration PHP-FPM

Installation de la pile LEMP et liaison de Nginx avec le moteur PHP.

- **Commandes exécutées :**
    
    Bash
    
    ```
    sudo systemctl stop apache2 # Libération du port 80
    sudo apt install nginx mariadb-server php-fpm php-mysql -y
    echo "<?php phpinfo(); ?>" > /var/www/html/info.php
    ```
    
- **Modification de `/etc/nginx/sites-available/default` :**
    
    Nginx
    
    ```
    index index.php index.html index.htm;
    
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock; # Version 8.1 vérifiée
    }
    ```
    

### 2.2 Installation de phpMyAdmin

- **Méthode :** Installation sans sélectionner de serveur web (Nginx absent de la liste), puis création d'un lien symbolique.
    
- **Commandes exécutées :**
    
    Bash
    
    ```
    sudo apt install phpmyadmin
    sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
    ```
    
- **Test :** Accès réussi à `http://192.31.25.12/phpmyadmin`.
    

### 2.3 Gestion des logs en mode DEBUG

- **Configuration dans `/etc/nginx/nginx.conf` :**
    
    Nginx
    
    ```
    error_log /var/log/nginx/error.log debug;
    ```
    
- **Vérification :** La commande `tail -n 20 /var/log/nginx/error.log` confirme la présence des balises `[debug]`.
    

---

**Conclusion :** Tous les services ont été configurés et testés avec succès. Les objectifs de mise en place d'un serveur Apache2 multi-fonctionnel et d'une pile LEMP optimisée sont atteints.



ok, je suis tout à fait d'accord avec ta recommandation d'utiliser la structure atomique couplée à un journal, au moins de cette manière je balance tout dans le journal sans me poser la question de l'organisation de mes idées, et l'ia se charge ensuite de tout bien extraire/transormer en notes atomiques bien rangées et liées entre elles ce que je peux apprendre dans la journée