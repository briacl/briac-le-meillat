# Bilan de TP : Infrastructure SSL locale et Autorité de Certification (CA) Maison

## Contexte
L'objectif est de déployer un chiffrement SSL/TLS gratuit et valide sur un réseau local (LAN) afin de supprimer les alertes de sécurité des navigateurs (ex: `ERR_CERT_AUTHORITY_INVALID`). Cette démarche vise à comprendre le fonctionnement des Autorités de Certification (CA), de la cryptographie asymétrique et de la chaîne de confiance, plutôt que de déléguer la gestion à un tiers comme Cloudflare.

---

## Les Concepts Théoriques

### 1. Le piège des domaines privés (`.local`, `.lan`)
Les Autorités de Certification publiques (comme Let's Encrypt) refusent de délivrer des certificats pour des extensions de noms de domaine privées. N'importe qui pouvant posséder un réseau en `.local`, il est impossible d'en prouver la propriété de manière universelle.
* **Solution publique :** Utiliser un vrai nom de domaine public (ex: `domaine.fr`) pointant vers des adresses IP privées.
* **Solution privée :** Devenir sa propre autorité de certification.

### 2. Le Challenge DNS-01 (Alternative publique Let's Encrypt)
Pour obtenir un certificat public valide sans ouvrir le réseau local à Internet (contrairement au challenge HTTP-01 sur le port 80), le protocole ACME utilise le challenge DNS-01.
* Le client ACME local interroge l'API du registrar DNS (OVH, Gandi, etc.) pour ajouter un enregistrement `TXT` temporaire (`_acme-challenge.domaine.fr`).
* Let's Encrypt vérifie cet enregistrement publiquement. Si le jeton correspond, le certificat est délivré.

### 3. Structure de l'architecture cible
Pour une intégration transparente, trois composants sont nécessaires :
* **DNS Split-Horizon (DNS menteur) :** Un serveur DNS local (Pi-hole, Bind9) qui résout le domaine public (ex: `app.domaine.fr`) directement vers l'IP privée du proxy local.
* **Reverse Proxy Centralisé :** Un point d'entrée unique (Nginx, Traefik) qui porte le certificat SSL et redistribue les flux.
* **Client ACME :** Un script (Certbot, acme.sh) automatisant le renouvellement via l'API DNS.

### 4. L'alternative locale : La CA Racine "Maison"
Consiste à créer une Autorité de Certification interne. En générant une clé racine et en forçant les systèmes d'exploitation/navigateurs du parc à lui faire confiance, il devient possible de signer des certificats pour n'importe quel domaine local (ex: `mon-app.local`) sans dépendre d'Internet.

---

## Guide Pratique : Création d'une CA Maison et Signature de Certificat

### Étape 1 : Création de l'Autorité de Certification (CA)

1. Générer la clé privée de la CA (chiffrée en AES-256) :
```bash
openssl genrsa -aes256 -out NetworkBriac_CA.key 4096
```

2. Générer le certificat racine public (valable 10 ans) :
```bash
openssl req -x509 -new -nodes -key NetworkBriac_CA.key -sha256 -days 3650 -out NetworkBriac_CA.pem
```

> [!NOTE]
> Renseigner les champs requis. Pour le Common Name (CN), utiliser un nom explicite (ex: `NetworkBriac_CA`).

---

### Étape 2 : Création du certificat pour le service local (`mon-app.local`)

1. Générer la clé privée du site web (non chiffrée pour permettre les redémarrages automatiques) :
```bash
openssl genrsa -out mon-app.key 2048
```

2. Créer le fichier de configuration des extensions nécessaires aux navigateurs modernes (`mon-app.ext`) :
```ini
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = mon-app.local
DNS.2 = *.mon-app.local
IP.1 = 192.168.1.50
```

3. Créer la demande de signature de certificat (CSR) :
```bash
openssl req -new -key mon-app.key -out mon-app.csr -subj "/CN=mon-app.local"
```

4. Signer le certificat avec la CA Maison (limité à 825 jours pour la conformité des navigateurs) :
```bash
openssl x509 -req -in mon-app.csr \
  -CA NetworkBriac_CA.pem -CAkey NetworkBriac_CA.key -CAcreateserial \
  -out mon-app.crt -days 825 -sha256 -extfile mon-app.ext
```

Les fichiers `mon-app.crt` (certificat) et `mon-app.key` (clé privée) sont prêts à être intégrés dans la configuration du serveur web/reverse proxy.

---

### Étape 3 : Déploiement de la confiance sur les machines clientes

Pour valider la chaîne de confiance, le fichier `NetworkBriac_CA.pem` (et uniquement lui) doit être importé sur les postes clients.

* **Linux (Debian/Ubuntu) :**
  ```bash
  sudo cp NetworkBriac_CA.pem /usr/local/share/ca-certificates/NetworkBriac_CA.crt
  sudo update-ca-certificates
  ```
* **Windows :** Installer le certificat dans le magasin local : *Autorités de certification racines de confiance*.
* **macOS :** Ajouter le certificat dans le *Trousseau d'accès Système*, puis double-cliquer dessus pour passer l'option à **Toujours faire confiance**.
* **Navigateurs (Firefox) :** Importer le fichier `.pem` directement dans les préférences du navigateur : *Paramètres -> Vie privée et sécurité -> Certificats -> Afficher les certificats -> Importer*.