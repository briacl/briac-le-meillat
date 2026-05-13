# La Bible des Masques IPv4 : Le Guide du Découpage Réseau

## 1. Qu'est-ce qu'un Masque de Sous-Réseau ?

Le masque est une suite de **32 bits** qui accompagne toujours une adresse IPv4. Son rôle est de séparer l'adresse IP en deux parties distinctes :

1. **La partie RÉSEAU (NetID) :** Identifie le groupe auquel appartient la machine.
    
2. **La partie MACHINE (HostID) :** Identifie la machine spécifique dans ce groupe.
    

## 2. Validité d'un Masque : La Règle d'Or

Un masque IPv4 valide est **obligatoirement** constitué d'une suite ininterrompue de **1** suivis d'une suite ininterrompue de **0**.

- **Masque Valide :** `255.255.0.0` (En binaire : 16 "un" suivis de 16 "zero").
    
- **Masque Invalide :** `255.0.0.255`. Pourquoi ? Parce qu'en binaire, on aurait des 1, puis des 0, puis encore des 1. C'est illégal.
    

### Les "Nombres Magiques" du Masque

Certaines valeurs décimales reviennent systématiquement car elles correspondent à des suites de "1" en binaire:

- `128` (1000 0000)
    
- `192` (1100 0000)
    
- `224` (1110 0000)
    
- `240` (1111 0000)
    
- `255` (1111 1111)
    

## 3. Les deux types de notation

Il existe deux manières d'écrire la même chose :

- **Décimale pointée :** `255.255.255.0`.
    
- **Notation CIDR (ou préfixe) :** `/24`. Le chiffre après le slash indique le nombre de "1" dans le masque.
    
    - `/8` = `255.0.0.0`
        
    - `/16` = `255.255.0.0`
        
    - `/24` = `255.255.255.0`
        

## 4. Le calcul de l'Adresse Réseau (Le ET Logique)

Pour trouver l'adresse du réseau, le routeur réalise une opération mathématique binaire appelée **ET Logique** (AND) entre l'IP et le Masque.

**Règle du ET Logique :**

- 1 ET 1 = **1**
    
- 1 ET 0 = **0**
    
- 0 ET 0 = **0**
    

**Exemple concret :**

- IP : `192.168.10.234`
    
- Masque : `255.255.255.0`
    
- **Résultat (Adresse Réseau) :** `192.168.10.0`.
    
- _Conclusion :_ Le masque "bloque" les parties de l'IP où il y a des 255 et met à zéro le reste.
    

## 5. L'Architecture Historique (Les Classes)

Avant l'invention du CIDR (les masques personnalisés), les adresses étaient figées par classes:

- **Classe A :** Commence par `0` en binaire (0 à 127). Masque par défaut `/8`.
    
- **Classe B :** Commence par `10` en binaire (128 à 191). Masque par défaut `/16`.
    
- **Classe C :** Commence par `110` en binaire (192 à 223). Masque par défaut `/24`.