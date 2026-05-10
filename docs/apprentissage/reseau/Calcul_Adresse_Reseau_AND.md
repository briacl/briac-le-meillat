---
title: Calcul de l'Adresse Réseau (ET Logique)
type: Procédure
tags: [réseau, ip, binaire, calcul]
---

# Calcul de l'Adresse Réseau (ET Logique)

Pour identifier le réseau auquel appartient une machine, les équipements réseaux réalisent une opération de **ET Logique** (AND) entre l'adresse IP et le [[Masque_IP_Definition]].

### Règle du ET Logique
Cette opération s'effectue au niveau de chaque [[BIT_Def]] :
- **1 AND 1 = 1**
- **1 AND 0 = 0**
- **0 AND 0 = 0**

### Exemple Concret
Soit une machine avec l'IP `192.168.10.234` et le masque `255.255.255.0` :
- IP en binaire : `11000000.10101000.00001010.11101010`
- Masque en binaire : `11111111.11111111.11111111.00000000`
- **Résultat (Adresse Réseau)** : `192.168.10.0`

Le masque "bloque" les parties de l'IP où il y a des 1 et met à zéro le reste (la partie machine). Cette opération est plus rapide en binaire qu'en décimal pour les processeurs de routage.


[[reseau]]
