---
title: "Étude de Cas : Un Développeur Peut-il Vider Votre Carte Bancaire ?"
module: "Cybersécurité & E-Commerce"
competence: ["Comprendre", "Sécuriser"]
techs: ["Paiement en ligne", "3D Secure", "Tokenisation", "Stripe Radar"]
date: "2026-09-16"
status: "Expérience"
---
# Un Développeur Peut-il Vider Votre Carte Bancaire ?
> **Expérience et Réflexion sur la Sécurité des Paiements en Ligne** — *Briac Le Meillat*

Imaginons que je récupère votre carte bancaire. Parce que vous me faites particulièrement confiance et que je vous précise que c'est pour une expérience à laquelle vous allez assister en temps réel, je n'ai donc *que* votre carte. Rien d'autre. Ni votre téléphone, ni vos mots de passe.

Je n'ai que le numéro, la date d'expiration et le cryptogramme de sécurité. Tout ce qu'il faut en théorie pour payer sur Internet, et ce qu'on imagine qu'un développeur voit passer quand vous payez sur son site.

L'un des domaines que j'aime particulièrement toucher, c'est le développement web. Et comme je me suis déjà amusé (pour le fun) à coder ce genre de page de paiement, j'ai fini par me poser cette question cruciale : **est-ce qu'un développeur qui a codé la page et vu votre carte peut arriver à vous la vider ?**

Pour le savoir, imaginons que je prenne votre carte (avec votre consentement bien sûr) et que j'ouvre le site d'Apple par exemple. Je choisis un modèle d'iPhone, je configure ses paramètres, et j'arrive sur la page de paiement. 
Si ça marche, vous perdez 900€. Et si ça ne marche pas, je veux savoir *exactement* ce qui m'aura arrêté.

Soyons clairs : ces trois informations (numéro, date, CVV) sont exactement ce qui transite sur tous les sites du monde entier quand vous payez en ligne. Donc, si mon paiement passe, ça ne veut pas juste dire que *vous* avez un problème, mais bien que n'importe qui dans le monde entier en a un.

Allez, on tape le code, et on clique sur « Payer ». Le site se met à charger.

---

## 🧱 Le Premier Mur : La Tokenisation

Pendant ce temps de chargement, je m'attends à ce que quelque chose se déclenche. Je viens quand même d'utiliser une carte qui n'est pas la mienne, ça va forcément se voir quelque part. Entre moi et cet iPhone, il y a plusieurs murs plus ou moins franchissables. 

Nous voici devant le premier. Pendant que ça charge, voici ce qu'il se passe derrière l'écran.

> [!NOTE]
> **Idée reçue à démonter :** 
> Le champ où vous tapez les numéros de votre carte bancaire n'appartient pas au site web, mais au prestataire de paiement (comme Stripe, PayPal ou la banque).

Ça veut dire quoi ? Que le développeur, lui, ne reçoit pas vos données. Il ne reçoit qu'un **jeton** (un token), une suite de caractères qui ne sert à rien sans le prestataire. C'est le principe de la tokenisation. C'est comme appeler quelqu'un en numéro masqué : la personne ne pourra jamais vous rappeler car elle n'a jamais eu votre vrai numéro. Ici, c'est pareil.

Honnêtement, si vous êtes un développeur bien intentionné (inquiet de la façon dont sont traitées les données), ça arrange énormément. La dernière chose que je veux savoir au monde, ce sont vos codes ou vos mots de passe. Je suis ravi de déléguer cette énorme responsabilité à une société spécialisée.

En théorie, le développeur de la page de paiement ne voit donc jamais votre numéro de carte. Mais malheureusement, ce n'est qu'en théorie. 
En 2018, des pirates ont réussi à contourner exactement cette protection chez *British Airways*. Ils ont injecté un script malveillant directement dans la page de paiement, qui copiait les vrais chiffres en temps réel, *avant* même qu'ils ne soient tokenisés. Plus de 380 000 paiements ont été compromis de cette façon. En conséquence, depuis mars 2025, les règles du secteur ont été durcies et imposent aux sites de surveiller rigoureusement les scripts qui tournent sur les pages de paiement pour repérer ce genre d'attaque.

Revenons à mon paiement : ce premier mur, je viens de le traverser sans même le voir. C'est normal, il n'a jamais été construit contre *moi*. Il empêche un développeur de *voir* votre numéro de carte de l'intérieur. Les pirates de British Airways ont dû écrire un script pour voler ces chiffres ; moi, on me les a simplement donnés dans la vraie vie.

Donc, non, un développeur normal et bien intentionné ne peut pas vous voler. Mais un développeur malhonnête, un pirate ou un pote un peu trop curieux qui a déjà les chiffres de votre carte entre les mains, ce mur-là ne les arrête pas. 

---

## 🕵️‍♂️ Le Deuxième Mur : Le Videur Invisible

Quand quelqu'un a déjà vos chiffres, est-ce que ça suffit pour payer ?

L'écran tourne toujours. On imagine souvent que ces deux secondes de chargement, c'est juste le temps que la demande parte vers la banque. Sauf que pendant ces deux secondes, quelqu'un est en train de me juger. Et il est payé pour attraper les gens comme moi.

Ce quelqu'un, c'est le système anti-fraude du prestataire de paiement (comme *Stripe Radar*). Avant de transmettre quoi que ce soit à la banque, il attribue un **score de confiance** à l'achat :
- D'où vient la connexion ?
- Quel est l'appareil utilisé ?
- Est-ce que cette carte a déjà payé ici ?

C'est comme un videur invisible qui décide qui entre, avant même que la banque n'ouvre sa porte.

Et là, je repense à un détail : **l'adresse de livraison**.
J'avais deux options : 
1. Livrer chez mon pote (mais là, du coup, je ne volais rien).
2. Livrer chez moi.

J'ai donc tapé mon adresse. Et ça, ça va poser un problème. Une carte qui appartient à quelqu'un, pour un colis qui part ailleurs, c'est le signal de fraude le plus connu du commerce en ligne. On ajoute à ça une carte bancaire qui n'a jamais été utilisée depuis cet ordinateur... Deux signaux d'alerte majeurs qui s'empilent sur un achat à 900€ : c'est flagrant.

Le chargement continue... ça semble un peu plus long que d'habitude... et bah **ça passe**.

Je pensais que le videur allait chercher à savoir si la carte était à moi. Mais quand on y réfléchit, il n'a aucun moyen de le savoir. Il répond à une autre question : *est-ce que cet achat ressemble à une fraude systémique ?* Un colis envoyé à une autre adresse, ça arrive des milliers de fois par jour (pour un cadeau par exemple). Ce n'est donc pas suffisant pour m'arrêter.

> [!TIP]
> Ce videur, vous l'avez déjà croisé sans le savoir. C'est lui qui est responsable d'un paiement refusé alors que vous êtes dans un pays étranger en vacances ou derrière un VPN, même si l'argent était disponible sur votre compte.

Ce videur ne travaille pas gratuitement. À ses yeux, je me suis comporté comme le vrai propriétaire de la carte. Il n'a aucune raison de douter, et toutes les raisons de facturer la transaction. 

Le deuxième mur est franchi.

---

## 🏦 Le Troisième Mur : Le 3D Secure

Passé le videur, ce n'est pas encore gagné. Il reste une dernière personne à convaincre : la banque. Et il va falloir lui prouver quelque chose que ni les chiffres ni un bon score de confiance ne peuvent lui fournir.

Le paiement continue son chemin vers la banque de mon pote, en passant par Visa ou Mastercard (qui ne sont que des messagers). La décision finale revient à la banque. 
Depuis 2019, en Europe, une directive (la DSP2) impose une règle stricte : pour valider un paiement en ligne, il faut **2 preuves sur 3** parmi ces catégories :

1. **Quelque chose que vous possédez** (votre téléphone).
2. **Quelque chose que vous savez** (un code secret, un mot de passe).
3. **Quelque chose que vous êtes** (votre visage ou votre empreinte biométrique).

Pour les cartes bancaires, l'outil qui applique cette règle s'appelle le **3D Secure**.

Je fais le compte : 
- J'ai sa carte (donc le numéro).
- Son téléphone ? Je ne l'ai pas.
- Son visage ou son empreinte ? Non plus.

Il ne reste plus qu'à savoir si la banque va exiger ces preuves. 

Parce que la banque ne le demande pas *toujours*. Elle reçoit du "videur" un dossier complet sur l'appareil, l'adresse et l'historique de l'acheteur, et elle choisit de valider la transaction en silence, ou d'exiger une preuve. C'est ce qui explique qu'un achat à 200€ peut passer tout seul, tandis qu'un achat à 15€ sur un site inconnu peut vous demander de sortir l'artillerie lourde pour prouver votre identité.

> [!NOTE]
> C'est d'ailleurs l'immense force d'Apple Pay : la donnée biométrique (ce que vous êtes) est déjà validée lors du clic, de manière parfaitement fluide et cryptée.

Alors, à quoi ressemble mon dossier ?
- Une carte qui paie depuis un appareil inconnu.
- Une livraison à une nouvelle adresse.
- Un montant élevé de 900€.

Le videur ne m'a pas bloqué, mais il n'a rien caché non plus. Il a tout transmis à la banque. 
Du coup, inévitablement, **le challenge 3D Secure se déclenche**. 

J'ai le numéro, la date d'expiration et le cryptogramme, mais ça ne suffit plus. Il me faut une preuve que *seul vous* (puisque c'est votre carte) pouvez me donner, très probablement depuis votre propre téléphone.

C'est le mur que je redoutais. Les numéros d'une carte, ça se copie, ça se vole, ça se revend sur le dark web. Voler un doigt, un visage ou un téléphone déverrouillé, c'est quand même beaucoup plus délicat. 

Alors, à moins de vous demander de me prêter votre pouce ou votre sourire... c'est terminé. **Paiement refusé.** Vous gardez vos 900€.

---

## ✅ Conclusion : Un développeur peut-il vider votre carte ?

**Non.** 
D'abord parce que, dans la grande majorité des cas, grâce à la tokenisation, le développeur ne voit même pas vos numéros. 
Et même s'il les voyait (ou qu'il s'agissait d'un pirate ayant subtilisé votre portefeuille physique), il tomberait sur le même mur que moi : la nécessité de fournir une preuve d'authentification forte (le 3D Secure imposé par la banque) qu'il ne possède pas.

*(Source d'inspiration : ParfaitementWeb - "Pourquoi voler une carte bancaire ne sert à rien")*