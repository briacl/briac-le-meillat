---
title: Conversion Binaire vers Décimal
type: Procédure
tags: [mathématiques, binaire, conversion]
---

# Conversion Binaire vers Décimal

Pour convertir un nombre binaire (base 2) en nombre décimal (base 10), on utilise les puissances de 2 en partant de la droite vers la gauche ($2^0, 2^1, 2^2...$).

### Méthode
Chaque position de [[BIT_Def]] est multipliée par la puissance de 2 correspondante, puis les résultats sont additionnés.

### Exemple
**Conversion de $1001101_2$ :**
- $(1 \times 2^6) = 64$
- $(0 \times 2^5) = 0$
- $(0 \times 2^4) = 0$
- $(1 \times 2^3) = 8$
- $(1 \times 2^2) = 4$
- $(0 \times 2^1) = 0$
- $(1 \times 2^0) = 1$

**Total** : $64 + 8 + 4 + 1 = 77_{10}$

Cette conversion est à la base de la compréhension de l'adressage dans les [[IPv4_vs_IPv6]].


[[reseau]]
