# La Bible des Adresses Réseau, Broadcast et Plages IP

## 1. L'Identité d'un Réseau : Adresse Réseau vs Adresse de Diffusion

Dans chaque réseau (ou sous-réseau), deux adresses sont **réservées** et ne peuvent jamais être attribuées à une machine (ordinateur, serveur, imprimante).

- **L'Adresse Réseau (Network ID) :** C'est le nom du groupe. Elle est obtenue en mettant tous les bits de la partie "Machine" à **0**.
    
    - _Exemple :_ Pour `11.12.13.14/8`, l'adresse réseau est `11.0.0.0`.
        
- **L'Adresse de Diffusion (Broadcast) :** Elle permet d'envoyer un message à **toutes** les machines du réseau en même temps. Elle est obtenue en mettant tous les bits de la partie "Machine" à **1**.
    
    - _Exemple :_ Pour `200.1.23.45/24`, l'adresse de diffusion est `200.1.23.255`.
        

## 2. La Plage d'Adresses Utilisables

La "plage" représente toutes les adresses IP que l'on peut réellement configurer sur des équipements.

- **Calcul de la plage :** Elle commence à `Adresse Réseau + 1` et finit à `Adresse Broadcast - 1`.
    
- **Nombre de machines possibles :** On utilise la formule $2^{n} - 2$, où $n$ est le nombre de bits de la partie machine. On retire **2** pour exclure l'adresse réseau et l'adresse de broadcast.
    
    - _Cas particulier :_ Dans un réseau `/10`, on a 22 bits pour les machines, soit $2^{22} - 2 = 4\,194\,302$ adresses utilisables.
        

## 3. Adresses Publiques vs Adresses Privées

Toutes les adresses IP ne se valent pas sur Internet.

### Les Adresses Privées (RFC 1918)

Elles sont utilisées à l'intérieur d'un LAN (maison, entreprise, IUT). Elles ne sont **pas routables** sur Internet.

- **Classe A :** `10.0.0.0` à `10.255.255.255`
    
- **Classe B :** `172.16.0.0` à `172.31.255.255`
    
- **Classe C :** `192.168.0.0` à `192.168.255.255`
    

### Les Adresses Publiques

Ce sont les adresses uniques au monde qui permettent de naviguer sur Internet. Elles sont attribuées par des organismes (comme l'IANA).

## 4. Organisation Intelligente : La règle des extrémités

Lors de l'administration d'un réseau :

- **Les premières adresses** de la plage sont souvent réservées aux machines fixes (Desktop, Serveurs, Imprimantes).
    
- **Les dernières adresses** de la plage sont généralement réservées aux interfaces des **routeurs** (Passerelles).
    
    - _Exemple :_ Dans un réseau `192.168.1.0/24`, on donnera souvent `192.168.1.1` ou `192.168.1.254` au routeur.