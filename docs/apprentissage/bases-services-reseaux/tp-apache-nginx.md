---
title: "Administration de Serveurs Web : Apache2 & Nginx"
module: "R203"
competence: "Connecter"
ac_lies: ["AC12.03", "AC12.04"]
techs: ["Apache2", "Nginx", "PHP", "MariaDB"]
date: "2026-03-15"
status: "Terminé"
---

# Administration de Serveurs Web : Apache2 & Nginx
 
 **Auteur :** Briac Le Meillat
 
 **Date :** Mars 2026
 
 **Projet :** TP R2.03 - Administration de Serveurs Web (Apache2 & Nginx)
 
 
 ---
 
 ## 1. Mise en place du serveur Web Apache2
 
 ### 1.1 & 1.2 Installation et vérification
 
 L'objectif était d'installer le paquet de base et de vérifier le fonctionnement du service sur un environnement **Ubuntu 22.04 LTS**.
 
 **Commandes exécutées :**
 ```bash
 sudo apt update
 sudo apt install apache2 -y
 sudo systemctl status apache2 # Vérification du statut 'active (running)'
 ```
 *Vérification :* Accès réussi à l'URL `http://192.31.25.12` affichant la page par défaut.
 
 ---
 
 ### 1.3 Création de pages protégées (Authentification par groupe)
 
 Restriction d'accès au dossier `/prive` pour les membres du groupe **RT1**. Activation du module `authz_groupfile`, création des utilisateurs et configuration du répertoire.
 
 **Commandes exécutées :**
 ```bash
 sudo a2enmod authz_groupfile
 sudo htpasswd -c /etc/apache2/.htpasswd user1 # Création user1
 sudo htpasswd /etc/apache2/.htpasswd user2    # Ajout user2
 sudo nano /etc/apache2/groups                 # Contenu : RT1: user1 user2
 sudo mkdir /var/www/html/prive
 sudo echo "<h1>Bienvenue dans la zone privee RT1</h1>" > /var/www/html/prive/index.html
 ```
 
 **Configuration ajoutée dans `/etc/apache2/sites-available/000-default.conf` :**
 ```apache
 <Directory "/var/www/html/prive">
     AuthType Basic
     AuthName "Acces Reserve au groupe RT1"
     AuthUserFile /etc/apache2/.htpasswd
     AuthGroupFile /etc/apache2/groups
     Require group RT1
 </Directory>
 ```
 
 ---
 
 ### 1.4 Limitation de la bande passante
 
 Limitation du débit sortant à **40 Kb/s** pour l'ensemble du site via le module `ratelimit`.
 
 **Commandes exécutées :**
 ```bash
 sudo a2enmod ratelimit
 head -c 5M /dev/urandom > /var/www/html/test_debit.bin # Création fichier test
 sudo systemctl restart apache2
 ```
 
 **Configuration ajoutée dans `/etc/apache2/sites-available/000-default.conf` :**
 ```apache
 SetOutputFilter RATE_LIMIT
 SetEnv rate-limit 40
 ```
 *Validation :* Téléchargement via Firefox stabilisé à **39.8 KB/s**.
 
 ---
 
 ### 1.5 Pages personnelles (UserDir)
 
 Permettre à l'utilisateur administrateur de publier son site via `~/public_html`.
 
 **Commandes exécutées :**
 ```bash
 sudo a2enmod userdir
 mkdir ~/public_html
 chmod 755 /home/administrateur
 chmod 755 ~/public_html
 echo "<h1>Espace personnel de administrateur</h1>" > ~/public_html/index.html
 sudo systemctl restart apache2
 ```
 *Test :* URL fonctionnelle : `http://192.31.25.12/~administrateur/`.
 
 ---
 
 ### 1.6 Serveurs virtuels (Virtual Hosts)
 
 Hébergement de deux sites distincts : `vendeur.localhost` et `client.localhost`.
 
 **Commandes exécutées :**
 ```bash
 sudo mkdir -p /var/www/vendeur /var/www/client
 sudo a2ensite vendeur.conf
 sudo a2ensite client.conf
 sudo systemctl reload apache2
 ```
 
 **Configuration `/etc/apache2/sites-available/vendeur.conf` :**
 ```apache
 <VirtualHost *:80>
     ServerName vendeur.localhost
     DocumentRoot /var/www/vendeur
 </VirtualHost>
 ```
 
 **Résolution DNS locale (Fichier `/etc/hosts` sur le client) :**
 ```text
 192.31.25.12  vendeur.localhost client.localhost
 ```
 
 ---
 
 ## 2. Machine LEMP (Nginx, MariaDB, PHP)
 
 ### 2.1 Installation et configuration PHP-FPM
 
 Installation de la pile **LEMP** et liaison de Nginx avec le moteur PHP via PHP-FPM.
 
 **Commandes exécutées :**
 ```bash
 sudo systemctl stop apache2 # Libération du port 80
 sudo apt install nginx mariadb-server php-fpm php-mysql -y
 echo "<?php phpinfo(); ?>" > /var/www/html/info.php
 ```
 
 **Modification de `/etc/nginx/sites-available/default` :**
 ```nginx
 index index.php index.html index.htm;
 
 location ~ \.php$ {
     include snippets/fastcgi-php.conf;
     fastcgi_pass unix:/run/php/php8.1-fpm.sock; # Version 8.1 vérifiée
 }
 ```
 
 ---
 
 ### 2.2 Installation de phpMyAdmin
 
 Installation sans sélectionner de serveur web prédéfini (Nginx étant absent de la liste par défaut), puis création d'un lien symbolique pour l'accès web.
 
 **Commandes exécutées :**
 ```bash
 sudo apt install phpmyadmin
 sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
 ```
 *Test :* Accès réussi à `http://192.31.25.12/phpmyadmin`.
 
 ---
 
 ### 2.3 Gestion des logs en mode DEBUG
 
 **Configuration dans `/etc/nginx/nginx.conf` :**
 ```nginx
 error_log /var/log/nginx/error.log debug;
 ```
 *Vérification :* La commande `tail -n 20 /var/log/nginx/error.log` confirme la présence des balises **[debug]**.
 
 ---
 
 ## 3. Conclusion
 
 Tous les services ont été configurés et testés avec succès. Les objectifs de mise en place d'un serveur Apache2 multi-fonctionnel et d'une pile LEMP optimisée sont atteints. La segmentation des services et la gestion fine des accès assurent une infrastructure web robuste.
 