# TP : Coder un Mini-Navigateur Web en Python

## Introduction

Dans ce TP, tu vas construire un mini-navigateur qui tourne dans le terminal.
Il sera capable de se connecter à un site web directement ou de lancer une recherche sur un moteur.
Ce faisant, tu comprendras concrètement comment fonctionne une connexion réseau TCP, comment est formulée une requête HTTP, et comment un navigateur interprète du HTML.

---

## Prérequis

- Python 3.x installé (vérifie avec `python3 --version`)
- Aucune bibliothèque externe — tout ce dont on a besoin (`socket`, `urllib.parse`) est inclus dans Python
- Notions de base : fonctions, chaînes de caractères, boucles

---

## Étape 0 : Les imports

Avant d'écrire quoi que ce soit, on regroupe tous les imports en haut du fichier. C'est une bonne pratique : ça permet de voir d'un coup d'oeil de quoi dépend le programme.

Crée un fichier `mini_navigateur.py` et commence par ces deux lignes :

```python
import socket        # Accès aux sockets réseau de bas niveau (TCP/IP)
import urllib.parse  # Encodage des caractères spéciaux dans les URLs (%20, +, etc.)
```

**Pourquoi `socket` ?**
La bibliothèque `socket` te donne un accès direct au réseau, sans passer par une surcouche comme `requests`. Tu vas "construire" toi-même la connexion TCP et la requête HTTP — c'est exactement ce que fait un vrai navigateur sous le capot.

**Pourquoi `urllib.parse` ?**
Quand l'utilisateur tape "réseau et télécom", les espaces et accents ne peuvent pas être envoyés tels quels dans une URL. `urllib.parse.quote_plus` les convertit au format standard (`r%C3%A9seau+et+t%C3%A9l%C3%A9com`).

---

## Étape 1 : Analyser la saisie de l'utilisateur

Un navigateur doit "deviner" l'intention de l'utilisateur. Si tu tapes `wikipedia.org`, c'est une adresse directe. Si tu tapes `définition réseau`, c'est une recherche.

On va créer une fonction qui détecte automatiquement l'un ou l'autre.

```python
def analyser_saisie(saisie):
    """
    Détermine si l'utilisateur veut aller sur un site directement
    ou lancer une recherche par mots-clés.
    Renvoie un tuple : (type_action, hote, port, chemin)
    """
    saisie = saisie.strip()

    # Extensions courantes pour reconnaître une adresse web directe
    extensions = [".com", ".fr", ".net", ".org", ".edu", ".gov"]

    # Une saisie est considérée comme une adresse si elle contient une extension
    # ET n'a pas d'espaces (ex: "ma recherche .com" n'est pas une adresse)
    est_adresse_directe = any(ext in saisie.lower() for ext in extensions) and " " not in saisie

    if est_adresse_directe:
        print(f"[#] Adresse directe detectee : {saisie}")
        # Séparer le nom d'hôte du chemin s'il y a un '/'
        if "/" in saisie:
            hote, chemin = saisie.split("/", 1)
            chemin = "/" + chemin
        else:
            hote = saisie
            chemin = "/"
        return "DIRECT", hote, 80, chemin
    else:
        print(f"[#] Mots-cles detectes. Recherche pour : '{saisie}'")
        # Encodage de la saisie pour l'insérer dans l'URL de DuckDuckGo
        requete_encodee = urllib.parse.quote_plus(saisie)
        hote = "html.duckduckgo.com"
        chemin = f"/html/?q={requete_encodee}"
        return "RECHERCHE", hote, 80, chemin
```

**Note pédagogique :** On utilise la version `html.duckduckgo.com` (et non `duckduckgo.com`) car elle renvoie une page HTML simple, sans JavaScript. C'est beaucoup plus facile à parser dans notre étape 3.

---

## Étape 2 : La couche réseau (socket TCP + requête HTTP)

C'est le coeur du navigateur. On ouvre une connexion TCP vers le serveur, on lui envoie une requête HTTP que l'on a rédigée à la main, et on récupère sa réponse.

```python
def recuperer_page(hote, port, chemin):
    try:
        # 1. Création d'un socket TCP (AF_INET = IPv4, SOCK_STREAM = TCP)
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(5.0)  # Si le serveur ne répond pas en 5s, on abandonne

        # 2. Connexion au serveur sur le port 80 (HTTP standard)
        s.connect((hote, port))

        # 3. Construction et envoi de la requête HTTP à la main
        requete = (
            f"GET {chemin} HTTP/1.1\r\n"
            f"Host: {hote}\r\n"
            f"User-Agent: MiniNavigateurRT/1.0\r\n"
            f"Connection: close\r\n\r\n"
        )
        s.send(requete.encode('utf-8'))

        # 4. Réception de la réponse par morceaux de 4096 octets
        reponse = b""
        while True:
            morceau = s.recv(4096)
            if not morceau:
                break
            reponse += morceau

        s.close()
        return reponse.decode('utf-8', errors='ignore')
    except Exception as e:
        return f"Erreur de connexion : {e}"


def separer_http(reponse_complete):
    """Sépare les en-têtes HTTP du corps HTML de la réponse."""
    if "\r\n\r\n" in reponse_complete:
        entetes, corps_html = reponse_complete.split("\r\n\r\n", 1)
        return entetes, corps_html
    return "Pas d'en-tetes valides", reponse_complete
```

**Note pédagogique :** On construit la requête HTTP entièrement à la main. Un vrai navigateur fait exactement la même chose, mais de façon automatique. La ligne `GET /chemin HTTP/1.1` est la première ligne obligatoire. Le champ `Host` identifie le site cible (un même serveur peut héberger plusieurs sites). Le `\r\n\r\n` final signale la fin des en-têtes — sans lui, le serveur attend indéfiniment la suite de la requête.

---

## Étape 3 : Le moteur de rendu (parser HTML basique)

La page HTML brute est illisible à l'écran. Cette fonction parcourt le texte caractère par caractère, reconnaît les balises, et les remplace par un affichage textuel plus lisible (titres en rouge, liens en bleu).

```python
def moteur_de_rendu(html, type_action):
    rendu = ""
    dans_balise = False
    balise_courante = ""

    i = 0
    while i < len(html):
        char = html[i]

        if char == "<":
            # On entre dans une balise HTML
            dans_balise = True
            balise_courante = ""
        elif char == ">":
            # On sort de la balise : on l'interprète
            dans_balise = False

            # Balises de paragraphe et de ligne de tableau : saut de ligne
            if balise_courante.startswith("p") or balise_courante == "/p":
                rendu += "\n"
            elif balise_courante.startswith("tr") or balise_courante == "/tr":
                rendu += "\n"

            # Balises d'ouverture de titre (h1, h2, h3) : couleur rouge + gras
            elif (balise_courante.startswith("h1")
                  or balise_courante.startswith("h2")
                  or balise_courante.startswith("h3")):
                rendu += "\n\033[1;31m[TITRE] "  # Rouge + Gras

            # Balises de fermeture de titre : réinitialisation de la couleur
            elif balise_courante in ["/h1", "/h2", "/h3"]:
                rendu += "\033[0m\n"  # Reset couleur + saut de ligne

            # Liens de résultats DuckDuckGo (classe CSS 'result__url')
            if 'class="result__url"' in balise_courante:
                rendu += "\n\033[1;34m[LIEN TROUVE] \033[0m"  # Bleu + reset

        elif dans_balise:
            # On accumule les caractères à l'intérieur de la balise
            balise_courante += char
        else:
            # On est dans du texte normal : on filtre les caractères de mise en forme inutiles
            if char not in ['\t', '\r']:
                rendu += char

        i += 1

    # Nettoyage final : supprimer les lignes entièrement vides
    lignes = [ligne.strip() for ligne in rendu.split("\n") if ligne.strip()]
    return "\n".join(lignes)
```

**Note pédagogique :** Ce parser est volontairement simplifié. Il ne gère pas les attributs de balise, les entités HTML (`&amp;`, `&nbsp;`…), ni les balises imbriquées complexes. Pour un vrai navigateur, le parsing HTML est l'une des parties les plus complexes (le standard HTML5 fait des centaines de pages). Ici, on s'intéresse au principe, pas à l'exhaustivité.

---

## Étape 4 : La boucle principale

C'est le point d'entrée du programme. Il affiche un prompt, lit la saisie, appelle les fonctions dans l'ordre, et affiche le résultat.

```python
def executer_navigateur():
    print("==================================================")
    print("  MINI-NAVIGATEUR R&T - TP Python                ")
    print("==================================================")
    print("Astuce : tape 'wikipedia.org' (direct) ou 'protocole TCP' (recherche)")
    print("Tape 'quitter' pour fermer le programme.\n")

    while True:
        saisie = input("\n> Adresse ou mots-cles : ")

        if saisie.lower() == "quitter":
            print("Fermeture du navigateur. A bientot !")
            break

        if not saisie:
            continue

        # 1. Analyse de l'intention de l'utilisateur
        action, hote, port, chemin = analyser_saisie(saisie)

        # 2. Connexion réseau et envoi de la requête HTTP
        print(f"[*] Requete HTTP en cours vers {hote}{chemin}...")
        reponse_brute = recuperer_page(hote, port, chemin)

        # 3. Séparation des en-têtes HTTP et du HTML
        entetes, html_pur = separer_http(reponse_brute)

        # 4. Rendu et affichage
        print("\n" + "=" * 20 + " RENDU PAGE " + "=" * 20)
        page_a_l_ecran = moteur_de_rendu(html_pur, action)
        print(page_a_l_ecran)
        print("=" * 52 + "\n")


if __name__ == "__main__":
    executer_navigateur()
```

---

## Étape 5 : Script complet (copier-coller)

Voici l'intégralité du programme en un seul bloc, prêt à être copié dans un fichier `mini_navigateur.py` et exécuté avec `python3 mini_navigateur.py`.

```python
import socket        # Accès aux sockets réseau de bas niveau (TCP/IP)
import urllib.parse  # Encodage des caractères spéciaux dans les URLs


def analyser_saisie(saisie):
    """
    Détermine si l'utilisateur veut aller sur un site directement
    ou lancer une recherche par mots-clés.
    Renvoie un tuple : (type_action, hote, port, chemin)
    """
    saisie = saisie.strip()

    extensions = [".com", ".fr", ".net", ".org", ".edu", ".gov"]
    est_adresse_directe = any(ext in saisie.lower() for ext in extensions) and " " not in saisie

    if est_adresse_directe:
        print(f"[#] Adresse directe detectee : {saisie}")
        if "/" in saisie:
            hote, chemin = saisie.split("/", 1)
            chemin = "/" + chemin
        else:
            hote = saisie
            chemin = "/"
        return "DIRECT", hote, 80, chemin
    else:
        print(f"[#] Mots-cles detectes. Recherche pour : '{saisie}'")
        requete_encodee = urllib.parse.quote_plus(saisie)
        hote = "html.duckduckgo.com"
        chemin = f"/html/?q={requete_encodee}"
        return "RECHERCHE", hote, 80, chemin


def recuperer_page(hote, port, chemin):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(5.0)
        s.connect((hote, port))

        requete = (
            f"GET {chemin} HTTP/1.1\r\n"
            f"Host: {hote}\r\n"
            f"User-Agent: MiniNavigateurRT/1.0\r\n"
            f"Connection: close\r\n\r\n"
        )
        s.send(requete.encode('utf-8'))

        reponse = b""
        while True:
            morceau = s.recv(4096)
            if not morceau:
                break
            reponse += morceau

        s.close()
        return reponse.decode('utf-8', errors='ignore')
    except Exception as e:
        return f"Erreur de connexion : {e}"


def separer_http(reponse_complete):
    """Sépare les en-têtes HTTP du corps HTML de la réponse."""
    if "\r\n\r\n" in reponse_complete:
        entetes, corps_html = reponse_complete.split("\r\n\r\n", 1)
        return entetes, corps_html
    return "Pas d'en-tetes valides", reponse_complete


def moteur_de_rendu(html, type_action):
    rendu = ""
    dans_balise = False
    balise_courante = ""

    i = 0
    while i < len(html):
        char = html[i]

        if char == "<":
            dans_balise = True
            balise_courante = ""
        elif char == ">":
            dans_balise = False

            if balise_courante.startswith("p") or balise_courante == "/p":
                rendu += "\n"
            elif balise_courante.startswith("tr") or balise_courante == "/tr":
                rendu += "\n"
            elif (balise_courante.startswith("h1")
                  or balise_courante.startswith("h2")
                  or balise_courante.startswith("h3")):
                rendu += "\n\033[1;31m[TITRE] "
            elif balise_courante in ["/h1", "/h2", "/h3"]:
                rendu += "\033[0m\n"

            if 'class="result__url"' in balise_courante:
                rendu += "\n\033[1;34m[LIEN TROUVE] \033[0m"

        elif dans_balise:
            balise_courante += char
        else:
            if char not in ['\t', '\r']:
                rendu += char

        i += 1

    lignes = [ligne.strip() for ligne in rendu.split("\n") if ligne.strip()]
    return "\n".join(lignes)


def executer_navigateur():
    print("==================================================")
    print("  MINI-NAVIGATEUR R&T - TP Python                ")
    print("==================================================")
    print("Astuce : tape 'wikipedia.org' (direct) ou 'protocole TCP' (recherche)")
    print("Tape 'quitter' pour fermer le programme.\n")

    while True:
        saisie = input("\n> Adresse ou mots-cles : ")

        if saisie.lower() == "quitter":
            print("Fermeture du navigateur. A bientot !")
            break

        if not saisie:
            continue

        action, hote, port, chemin = analyser_saisie(saisie)

        print(f"[*] Requete HTTP en cours vers {hote}{chemin}...")
        reponse_brute = recuperer_page(hote, port, chemin)

        entetes, html_pur = separer_http(reponse_brute)

        print("\n" + "=" * 20 + " RENDU PAGE " + "=" * 20)
        page_a_l_ecran = moteur_de_rendu(html_pur, action)
        print(page_a_l_ecran)
        print("=" * 52 + "\n")


if __name__ == "__main__":
    executer_navigateur()
```

---

## Limitations connues

Ce mini-navigateur est volontairement simplifié. Voici ce qu'il ne gère pas (et pourquoi) :

- **HTTPS uniquement sur le port 443** : notre socket se connecte en clair sur le port 80. La plupart des sites modernes redirigent vers HTTPS et refuseront ou renverront une réponse vide.
- **Redirections HTTP** : si le serveur répond avec un code `301` ou `302`, notre programme n'en tient pas compte et affiche la réponse brute.
- **CSS et JavaScript** : le rendu ignore tout le CSS. Les pages modernes dépendent de JavaScript pour afficher leur contenu — un parser HTML seul ne suffit plus.
- **Entités HTML** : les séquences comme `&amp;`, `&nbsp;`, `&#39;` ne sont pas décodées et apparaissent telles quelles.
- **Certains serveurs refusent les connexions directes** : des sites comme Google ou Facebook n'acceptent que HTTPS et renverront une erreur.

Ces limitations ne sont pas des bugs — elles reflètent exactement pourquoi les navigateurs modernes sont des logiciels complexes. Ici, l'objectif est de comprendre les mécanismes de base.
