# ⚡ Commandes de Développement

Voici les commandes essentielles pour travailler sur le projet **Briac Le Meillat** (React SPA).

> **Note importante** : Le projet se trouve dans le sous-dossier `briac-le-meillat`. Assurez-vous d'être dans le bon dossier avant de lancer les commandes !

---

## 🏁 Démarrage Rapide

### 1️⃣ Se placer dans le bon dossier
Peu importe votre OS (Windows ou Mac), la première chose à faire est d'aller dans le dossier du code source :

```bash
cd synapseo
```

*(Si vous venez de cloner le projet, vous devrez peut-être faire `cd synapseo` deux fois : une fois pour entrer dans le dossier git, une fois pour entrer dans le dossier du code React).*

### 2️⃣ Installer les dépendances (Première fois uniquement)
Si vous venez de cloner le projet ou si quelqu'un a ajouté une librairie :

```bash
npm install
```
*(Si vous avez des erreurs de permissions ou de conflits, essayez `npm install --legacy-peer-deps`)*

### 3️⃣ Lancer le serveur de développement
C'est la commande que vous utiliserez tous les jours pour coder :

```bash
npm run dev
```
Cela va lancer Vite. Cliquez sur le lien affiché dans le terminal (généralement `http://localhost:5173`) pour voir le site.

---

## 🍎 Spécifique Mac (macOS)

Si vous rencontrez des problèmes de permissions lors de l'installation :
```bash
sudo npm install
```

Pour vérifier que tout est installé :
```bash
node -v
npm -v
```

---

## 🪟 Spécifique Windows

Si `npm` n'est pas reconnu :
1. Assurez-vous d'avoir installé **Node.js** (LTS version).
2. Redémarrez votre terminal (VS Code, PowerShell, ou Git Bash).
3. Vérifiez l'installation avec :
```powershell
node --version
npm --version
```

---

## 🤝 Travailler en Équipe (Git)

Si vous voyez deux flèches sur le bouton de synchronisation VS Code (une qui monte, une qui descend), cela signifie que vous avez des modifications locales ET qu'il y a des modifications sur le serveur.

Pour synchroniser proprement sans écraser le travail des autres :

```bash
git pull origin master --rebase
```

Si tout se passe bien, vous pouvez ensuite envoyer vos modifications :
```bash
git push origin master
```

### En cas de conflit
Si Git vous dit qu'il y a des conflits (`CONFLICT`), ne paniquez pas :
1. Ouvrez les fichiers concernés dans VS Code.
2. Choisissez quelles modifications garder ("Accept Current Change" ou "Accept Incoming Change").
3. Une fois résolu, continuez le rebase :
```bash
git add .
git rebase --continue
```