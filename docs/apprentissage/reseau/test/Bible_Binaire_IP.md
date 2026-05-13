# La Bible du Binaire, de l'Hexadécimal et de l'Adressage IP

## 1. Pourquoi le Binaire ? (L'alphabet des machines)

L'ordinateur est une machine électronique composée de milliards de transistors. Ces composants ne comprennent que deux états physiques : **le courant passe (ON / 1)** ou **le courant ne passe pas (OFF / 0)**.

- **Le Bit (Binary Digit) :** C'est l'unité élémentaire. Un bit peut valoir 0 ou 1.
    
- **Puissance de calcul :** Avec $n$ bits, on peut créer $2^n$ séquences différentes.
    
    - 1 bit = 2 possibilités (0, 1).
        
    - 8 bits (1 octet) = $2^8 = 256$ possibilités (de 0 à 255).
        

### Conversion Binaire vers Décimal

On utilise les puissances de 2 en partant de la droite ($2^0, 2^1, 2^2...$).

- **Exemple :** $1001101_2 = (1 \times 2^6) + (1 \times 2^3) + (1 \times 2^2) + (1 \times 2^0) = 64 + 8 + 4 + 1 = 77_{10}$.
    

---

## 2. L'Hexadécimal (La base 16)

Le binaire est illisible pour l'humain (ex: `1111111110101100`). On utilise l'hexadécimal pour raccourcir ces chaînes.

- **Symboles :** 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A (10), B (11), C (12), D (13), E (14), F (15).
    
- **Utilité :** Un caractère hexadécimal représente exactement **4 bits** (un nibble). Un octet (8 bits) se note donc sur seulement 2 caractères hexadécimaux (ex: `FF = 255`).
    

---

## 3. L'Adressage IPv4 : L'application du Binaire

Une adresse IPv4 est en réalité un nombre binaire de **32 bits**.

### Pourquoi le binaire pour l'IP ?

Les routeurs traitent les données à une vitesse phénoménale. Il est beaucoup plus rapide pour un processeur de comparer des suites de 0 et de 1 (via des opérations logiques comme le `ET` binaire) pour déterminer si un paquet appartient à un réseau que de manipuler des chiffres décimaux.

- **Structure :** 4 octets séparés par des points.
    
    - Décimal : `172.31.25.9`.
        
    - Binaire : `10101100.00011111.00011001.00001001`.
        
- **Limite :** $2^{32} = 4,2$ milliards d'adresses. C'est le problème de la **pénurie d'adresses IPv4**, car nous sommes plus de 8 milliards d'humains avec plusieurs objets connectés chacun.
    

---

## 4. L'IPv6 : Vers l'Infini (ou presque)

Face à la pénurie d'IPv4, l'IPv6 a été créé.

- **Format :** 128 bits (au lieu de 32).
    
- **Notation :** Hexadécimale (8 groupes de 4 caractères, ex: `2001:0db8:85a3...`).
    
- **Capacité :** $2^{128}$ adresses (environ $340$ sextillions). C'est assez pour attribuer une adresse IP à chaque grain de sable sur Terre.
    

---

## 5. Les Protocoles de la Suite TCP/IP

Le binaire n'est que le transport. Les protocoles organisent la discussion :

- **Ethernet (Couche 2) :** Utilise les adresses MAC pour le transport local.
    
- **IP (Couche 3) :** Utilise l'adressage binaire global pour le routage.
    
- **TCP/UDP (Couche 4) :** Gèrent le transport fiable (TCP) ou rapide (UDP) des données.
    
- **DNS :** L'annuaire qui traduit les noms (`iut-rt.univ-artois.fr`) en binaire compréhensible par la machine (`172.31.25.9`).
    
- **DHCP :** Le serveur qui distribue automatiquement une configuration binaire (IP, masque, passerelle) aux machines.