---
title: "Fiche de Révision : Signaux et Systèmes (R205)"
module: "R205"
competence: "Connecter"
ac_lies: ["AC12.01", "AC12.02"]
techs: ["Maths", "Signal", "Parseval", "Bode"]
date: "2026-04-01"
status: "Terminé"
---

# Fiche de Révision : Signaux et Systèmes (R205)

**Auteur :** Briac Le Meillat

**Date :** Avril 2026

**Projet :** Révisions R205 - Signaux et Systèmes pour les Transmissions


---

## 1. Généralités sur les Signaux et Puissance

Le traitement du signal permet d'extraire l'information d'un signal perturbé par du bruit.

### 1.1 Valeurs caractéristiques
- **Valeur moyenne** ($\langle s(t) \rangle$ ou $a_0$) : Représente la composante continue du signal.
- **Valeur efficace** ($S_{eff}$ ou $S_{RMS}$) :
  - Pour une sinusoïde d'amplitude $A$ : $S_{eff} = \frac{A}{\sqrt{2}}$.
  - Pour un signal constant de valeur $E$ : $S_{eff} = E$.
- **Puissance moyenne** ($P$) : $P = \langle s(t)^2 \rangle$.
  - Pour une sinusoïde : $P = \frac{A^2}{2}$.

### 1.2 Décibels et dBm
Le décibel est une unité logarithmique utilisée pour exprimer un rapport de puissance ou de tension.

- **Puissance en dBm** : $P_{dBm} = 10 \log\left(\frac{P_{W}}{10^{-3}}\right)$.
- **Conversion inverse** : $P_{mW} = 10^{\frac{P_{dBm}}{10}}$.
- **Gain en puissance** : $G_{dB} = 10 \log\left(\frac{P_s}{P_e}\right)$.
- **Gain en tension** : $G_{dB} = 20 \log\left(\frac{U_s}{U_e}\right)$.
- **Rapport Signal sur Bruit (RSB ou SNR)** : $RSB_{dB} = P_{signal, dBm} - P_{bruit, dBm}$.

---

## 2. Décomposition en Série de Fourier

Tout signal périodique de fréquence $f_0$ peut être décomposé en une somme de sinus et cosinus.

### 2.1 Formule Générale
$$s(t) = a_0 + \sum_{n=1}^{+\infty} (a_n \cos(n \omega_0 t) + b_n \sin(n \omega_0 t))$$

- $\omega_0 = 2\pi f_0$ est la pulsation fondamentale.
- $a_0$ : Composante continue.
- $n=1$ : Fondamental.
- $n > 1$ : Harmoniques de rang $n$.

### 2.2 Propriétés de Symétrie
- **Signal Pair** : $s(t) = s(-t) \implies b_n = 0$.
- **Signal Impair** : $s(t) = -s(-t) \implies a_0 = 0$ et $a_n = 0$.

### 2.3 Théorème de Parseval
La puissance totale est la somme des puissances de chaque composante spectrale :
$$P_{totale} = a_0^2 + \sum_{n=1}^{+\infty} \frac{a_n^2 + b_n^2}{2} = a_0^2 + \sum_{n=1}^{+\infty} S_{n,eff}^2$$

---

## 3. Fonctions de Transfert et Diagrammes de Bode

Un système est caractérisé par sa fonction de transfert $\underline{H}(j\omega) = \frac{\underline{S}}{\underline{E}}$.

### 3.1 Définitions
- **Gain en dB** : $G_{dB}(\omega) = 20 \log |\underline{H}(j\omega)|$.
- **Phase** : $\varphi(\omega) = \text{Arg}(\underline{H}(j\omega))$.
- **Fréquence de coupure** ($f_c$) : Fréquence où le gain chute de $3\text{ dB}$ ($G_{max} - 3\text{ dB}$), ce qui correspond à une puissance divisée par 2.

### 3.2 Tracés Asymptotiques types
- **Gain pur** $K$ ($T(\omega) = 4$) : Droite horizontale à $20 \log(4) \approx 12\text{ dB}$.
- **Intégrateur** ($T(\omega) = \frac{1}{j\tau\omega}$) : Pente de $-20\text{ dB/décade}$ passant par $0\text{ dB}$ à $\omega = 1/\tau$.
- **Passe-bas du 1er ordre** ($T(\omega) = \frac{K}{1 + j\tau\omega}$) :
  - $\omega \ll 1/\tau$ : Gain horizontal à $20 \log(K)$.
  - $\omega \gg 1/\tau$ : Pente de $-20\text{ dB/décade}$.
  - **Phase** : Passe de $0^\circ$ à $-90^\circ$ (vaut $-45^\circ$ à $\omega = 1/\tau$).

---

## 4. Explications des Exercices Types

### 4.1 Le Signal Carré
- **Cas 1 : Carré entre $-E$ et $+E$ (Impair)**
  - $a_0 = 0$ (pas de moyenne).
  - Seuls les harmoniques impairs existent ($n = 1, 3, 5 \dots$).
  - Amplitude de l'harmonique $n$ : $A_n = \frac{4E}{n\pi}$.
- **Cas 2 : Carré entre $0$ et $V_{max}$**
  - $a_0 = \frac{V_{max}}{2}$ (moyenne non nulle).

### 4.2 Composition de filtres
**Formule :** $T_7(\omega) = \frac{1}{(1+0,001j\omega)(1+0,01j\omega)}$

**Analyse :**
- Deux pulsations de cassure : $\omega_1 = 1/0,01 = 100\text{ rad/s}$ et $\omega_2 = 1/0,001 = 1000\text{ rad/s}$.
- De $0$ à $\omega_1$ : Gain $= 0\text{ dB}$.
- De $\omega_1$ à $\omega_2$ : La première parenthèse "casse", pente de $-20\text{ dB/décade}$.
- Après $\omega_2$ : La deuxième parenthèse casse aussi, les pentes s'ajoutent : $-20 - 20 = \mathbf{-40\text{ dB/décade}}$.

---

## 5. Conseils pour le CTP

- **Bande passante** : Elle est définie par l'intervalle $[f_L ; f_H]$ où le gain est supérieur au gain max $-3\text{ dB}$.
- **ADSL** : Le filtre sépare la voix (basse fréquence) des données (haute fréquence).
- **Lecture Oscilloscope** : La valeur efficace affichée par l'appareil ($V_{RMS}$) doit correspondre à la hauteur de tes raies dans le spectre (sauf pour la raie à $0\text{ Hz}$ qui est la valeur moyenne $DC$).