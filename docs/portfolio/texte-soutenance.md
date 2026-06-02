Bonjour à toutes et à tous.

Il y a un an, j'étais un développeur web junior passionné. J'apprenais à coder des sites, à concevoir des interfaces. Mais je me posais toujours la même question : « Ok, je code des sites web, mais concrètement, comment ça se fait que si je cherche une adresse, j'arrive à y accéder ? C'est quoi la magie derrière ? »

Il y a un an, je ne savais pas ce qu'était un switch. Aujourd'hui, j'en configure un.

Je suis venu en BUT R&T pour ouvrir cette boîte noire. Et j'ai vite compris qu'il n'y avait pas de magie. Il y avait des câbles, des protocoles, et de l'architecture.

Mon apprentissage a commencé par la base de la compétence Administrer. Au début, on m'a montré que deux ordinateurs pouvaient communiquer via un simple câble Ethernet. Puis on a ajouté un Switch. Très vite, en R103, j'ai appris à configurer ce switch pour diviser un réseau physique en plusieurs réseaux virtuels isolés : les VLANs. J'ai compris comment éviter que le réseau s'effondre sur lui-même grâce au protocole Spanning Tree, et comment agréger des liens matériels avec l'EtherChannel.
Tout cela, je l'ai mis en pratique lors de la SAÉ 1.02, où avec mes collègues, nous avons déployé l'infrastructure complète d'une PME. J'ai même prolongé cet apprentissage chez moi, en créant mon propre Homelab physique.

Mais un réseau local, c'est comme une ville fermée. Pour répondre à ma question du début, il fallait sortir sur Internet. C'est la compétence Connecter.

J'ai appris qu'il fallait ajouter un routeur. Et surtout, j'ai appris à en créer un de toutes pièces. Lors des TPs R103 et R201, j'ai transformé une simple machine Linux en une véritable passerelle. J'y ai configuré mon propre pare-feu strict avec iptables et nftables, et j'ai géré la traduction d'adresses avec le NAT/PAT. Que ce soit sur Linux ou sur du matériel Cisco avec le routage dynamique OSPF et les ACLs, j'ai appris à maîtriser les aiguillages de l'Internet. Avec des outils comme Wireshark en R101, j'ai littéralement vu les paquets de données transiter. En SAÉ 103 et en R205, j'ai même étudié le signal électrique de ces données sur des câbles coaxiaux.

En R204, j'ai poussé la logique encore plus loin : et si on faisait passer la voix humaine sur ce réseau qu'on venait de construire ? C'est la téléphonie sur IP. J'ai configuré un serveur Asterisk — le standard téléphonique open-source — en y branchant des postes SIP, en créant un IVR (ce menu vocal qui dit "tapez 1 pour..."), et en reliant deux sites distants via un Trunk SIP. Une voix qui traverse des paquets IP, comme n'importe quelle autre donnée. Bon je ne vais pas vous mentir, on a pu avoir des modules aux tp qui n'ont pas été simples, c'est un euphémisme, celui-ci fut l'un des plus durs, je ne citerais pas de nom, mais certain à l'heure actuelle n'ont toujours pas réussi à faire fonctionner ce *** de téléphone cisco et on ne peut pas leur ne vouloir, rare sont les élus acceptés par ce ** de téléphone cisco. Enfin bref, ne remuons pas les traumatismes.

Mais maîtriser un protocole ne suffit pas si on ne peut pas l'expliquer. J'ai donc produit deux Bibles Réseaux : des documents de synthèse technique, l'un que j'ai écrit en pensant à M.Merchez (de la méthode) et l'autre que j'ai volontairement écrits avec des analogies — le DHCP comme "un réceptionniste d'hôtel", le NAT comme "une boîte postale partagée". Les écrire m'a forcé à comprendre vraiment ce que je faisais, pas seulement à le reproduire.

Une fois les routes sécurisées, il faut gérer les habitants de notre réseau. Et là, nous entrons dans l'administration système. En R202, j'ai mis en place un serveur Windows avec un domaine Active Directory. J'y ai intégré un serveur DHCP — pour que chaque machine reçoive automatiquement une identité sur le réseau — et un serveur DNS. J'ai même exploré le déploiement de machines à distance avec le boot PXE en R203.

(Tu fais une pause. Tu prends les deux feuilles dans tes mains).

Toute cette architecture tentaculaire, toute cette complexité sous le capot, elle m'a mené à un moment précis. Imprimer une feuille de papier.

(Tu montres les feuilles au jury).

Ça n'a l'air de rien. Mais voici deux feuilles. Elles ont été imprimées sur le réseau de l'IUT que nous avons architecturé. L'une a été imprimée en tant qu'administrateur, l'autre en tant qu'utilisateur normal. Je vous assure que les difficultés techniques pour gérer ces droits, intégrer les machines au domaine, et faire traverser l'information jusqu'à l'imprimante ont été immenses. Cette simple impression, c'était ma victoire sur la machine. C'était la preuve que je maîtrisais mon système.

(Tu poses les feuilles).

Les fondations étaient là. Il était temps de reprendre ma casquette de développeur, mais cette fois avec la compétence Programmer d'un vrai néticien.

Grâce à mes acquis en bases de données PostgreSQL (R207) et en serveurs web Apache/Nginx (R203), j'ai commencé à bâtir des services complexes. J'ai manipulé et nettoyé des jeux de données massifs en Python pour la SAÉ 15.

Et rien de tout ça ne tient sans une discipline de travail. J'ai appris Git : le système de contrôle de version qui permet de tracer chaque modification du code, de revenir en arrière, et de travailler à plusieurs sans se marcher dessus. Ce portfolio, mes projets personnels — tout est versionné sur GitHub. Ce n'est pas un détail technique, c'est la condition sine qua non du développement professionnel.

Surtout, j'ai recodé les protocoles à la main. J'ai créé une petite interface de révision des trames réseau, et notgoogle, un moteur de recherche forgé de zéro sur des sockets TCP bruts. Et hier nous avons présenté notre SAÉ 2.3, qui était pour ma part MiniGPT, une interface de chat administrable démontrant la maîtrise d'une stack web moderne, orchestrée avec Docker, un backend Flask vu en R209, et MySQL.

(Tu ralentis le rythme, ton plus posé et confiant).

L'ensemble de ces Apprentissages Critiques valide mon passage en deuxième année. Mais surtout, tout cela m'a permis de commencer à répondre, de manière extrêmement détaillée, à ma question du tout début.

La magie derrière l'affichage d'une page web ? Il n'y en a aucune. C'est la somme d'un câblage physique précis, d'un routage de paquets implacable, de résolutions DNS, de pare-feux, et de requêtes HTTP traitées par des serveurs. Ce n'est pas de la magie, c'est de l'ingénierie. Et j'apprends à la maîtriser.

(Silence de 2 ou 3 secondes. L'écran derrière toi est toujours noir).

Hmm, oh... et à propos... une dernière chose.

Cette page sur laquelle je m'appuie aujourd'hui pour ma soutenance... ce n'est pas une banale page web.

(Tu déclenches l'animation de ta page, l'URL de ton site s'affiche).

C'est une page de mon portfolio, une interface que j'ai développée de A à Z. Elle héberge l'intégralité de mon travail et de mes réflexions.

Je vous remercie de m'avoir écouté.