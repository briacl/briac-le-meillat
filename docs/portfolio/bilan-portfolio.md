# Bilan Portfolio — Briac Le Meillat
### BUT R&T 1ère année | Soutenance 29 mai 2026

> Document de préparation orale. Pour chaque trace : ce que j'ai fait · pourquoi · comment · difficultés · ce que j'en ai appris · ce que je ferais autrement.

---

## 🛠️ COMPÉTENCE 1 — ADMINISTRER

---

### AC11.01 — Configurer les fonctions de base du réseau local

---

#### R103 — TP1 : Segmentation VLAN + Trunking 802.1Q (Cisco)

**Ce que j'ai fait** : J'ai configuré des réseaux locaux virtuels (VLANs) sur des commutateurs Cisco et mis en place des liaisons inter-switchs.

**Pourquoi** : Pour segmenter le trafic de diffusion (broadcast), isoler logiquement les différents services d'une entreprise et renforcer la sécurité au niveau 2.

**Comment** : Via l'interface CLI de Cisco IOS, j'ai créé les VLANs, assigné des ports d'accès à des sous-réseaux spécifiques et activé le protocole d'encapsulation 802.1Q sur les ports Trunk.

**Difficultés** : Assurer la correspondance parfaite des VLANs natifs aux deux extrémités du lien Trunk pour éviter les fuites de trafic.

**Ce que j'en ai appris** : Un commutateur peut héberger plusieurs réseaux logiques totalement hermétiques qui partagent une même infrastructure physique.

**Ce que je ferais autrement** : Je documenterais mon plan d'adressage et l'affectation des ports sur un schéma clair avant de débuter les configurations en ligne de commande.

---

#### R103 — TP2 : Routage Inter-VLAN (Router-on-a-Stick)

**Ce que j'ai fait** : J'ai interconnecté plusieurs VLANs isolés à l'aide d'un unique routeur physique.

**Pourquoi** : Pour permettre à des machines appartenant à des VLANs différents de communiquer de manière contrôlée à travers un équipement de niveau 3.

**Comment** : J'ai configuré un port du switch en Trunk et créé des sous-interfaces logiques sur l'interface physique du routeur, en y attribuant les adresses IP des passerelles par défaut.

**Difficultés** : Diagnostiquer l'absence de routage due à l'oubli fréquent d'activer l'interface physique parente (`no shutdown`) sur le routeur.

**Ce que j'en ai appris** : J'ai assimilé le concept de multiplexage logique : transformer un seul câble physique en plusieurs passerelles virtuelles indépendantes.

**Ce que je ferais autrement** : J'utiliserais un commutateur de niveau 3 (Layer 3 Switch) pour router directement le trafic en matériel et optimiser les performances.

---

#### R103 — TP3 : Spanning Tree Protocol (STP)

**Ce que j'ai fait** : J'ai manipulé la topologie logique d'un réseau maillé pour observer et configurer le protocole Spanning Tree.

**Pourquoi** : Pour éliminer les boucles physiques de niveau 2 qui provoquent des tempêtes de broadcast et paralysent les switchs.

**Comment** : En identifiant le Root Bridge par élection (Bridge ID le plus bas), en lisant les rôles des ports (Root, Designated, Blocked), puis en modifiant la priorité du switch cible (`spanning-tree vlan X priority 4096`) pour forcer l'élection. La priorité doit être un multiple de 4096.

**Difficultés** : Suivre visuellement l'évolution des états des ports (bloqués, désignés, racine) lors des changements de topologie, et comprendre pourquoi certains ports restaient bloqués suite à une mauvaise interprétation du coût cumulé des liens (1 Gbps = coût 4, 100 Mbps = coût 19).

**Ce que j'en ai appris** : Le réseau sait s'auto-guérir en bloquant logiquement des liens redondants et en les réactivant automatiquement en cas de coupure physique. La topologie logique est totalement indépendante du câblage.

**Ce que je ferais autrement** : Je configurerais systématiquement RSTP (Rapid STP) pour faire passer le temps de convergence de 50 secondes à moins de 2 secondes. Et j'activerais PortFast sur les ports terminaux pour éviter l'attente de 30 secondes avant attribution DHCP.

---

#### R103 — TP4 : EtherChannel / LACP

**Ce que j'ai fait** : J'ai agrégé plusieurs liaisons physiques parallèles entre deux commutateurs en un seul lien logique.

**Pourquoi** : Pour multiplier la bande passante inter-switchs et assurer une redondance matérielle sans que STP ne bloque les ports redondants.

**Comment** : J'ai configuré un groupe de canaux (`channel-group 1 mode active`) sur une plage d'interfaces en LACP, puis configuré le trunk à la fois sur les interfaces physiques ET sur le Port-Channel logique — les deux sont nécessaires pour la stabilité.

**Difficultés** : Résoudre les refus d'association causés par des configurations initiales divergentes (vitesse, duplex, mode Trunk) sur les ports du groupe. Un port en mode `passive` refuse de négocier si son voisin est aussi en `passive` ; l'un des deux doit être en `active`.

**Ce que j'en ai appris** : L'agrégation logique unifie les performances de plusieurs câbles tout en offrant une tolérance aux pannes sans aucune perte de session. EtherChannel exige une uniformité parfaite des paramètres physiques sur tous ses membres.

**Ce que je ferais autrement** : Je vérifierais la symétrie exacte de la configuration des ports sur les deux switchs avant d'activer l'EtherChannel, et j'implémenterais des alertes SNMP pour être averti dès qu'un lien membre tombe.

---

#### R103 — SAÉ 1.02 : Déploiement d'infrastructure PME complète

**Ce que j'ai fait** : J'ai conçu, configuré et déployé l'architecture réseau complète d'une petite entreprise multi-sites.

**Pourquoi** : Pour mettre en pratique l'ensemble des notions d'administration réseau acquises au cours du semestre dans un scénario professionnel réel.

**Comment** : En configurant les VLANs (Admin, Personnel, Production, Vidéo), les trunks, le routage inter-VLAN et les adresses IP statiques sur les équipements d'infrastructure.

**Difficultés** : Gérer l'accumulation de configurations complexes et identifier la source d'une panne d'interconnexion au milieu d'une dizaine d'équipements interconnectés.

**Ce que j'en ai appris** : L'importance capitale d'une rigueur absolue dans le nommage des interfaces, des VLANs et la rédaction d'un journal des modifications.

**Ce que je ferais autrement** : Je procéderais par validations unitaires progressives (branche par branche) plutôt que de configurer l'intégralité du parc avant de lancer les premiers tests.

---

### AC11.02 — Maîtriser les interconnexions

---

#### R203 — TP PXE : Boot réseau (Dnsmasq + DHCP + TFTP + NFS)

**Ce que j'ai fait** : J'ai configuré un serveur pour permettre le démarrage et l'installation automatisée d'un système d'exploitation à travers le réseau, sans support physique local.

**Pourquoi** : Pour comprendre l'automatisation du déploiement de postes de travail en masse dans les datacenters ou les parcs d'entreprise.

**Comment** : En orchestrant Dnsmasq pour distribuer les baux DHCP et les options PXE (`next-server`, `filename`), un serveur TFTP pour le chargeur d'amorçage, et un point de montage NFS pour le système de fichiers racine.

**Difficultés** : Ajuster finement les chemins de fichiers dans la configuration TFTP et résoudre les permissions de partage NFS qui bloquaient le boot des clients.

**Ce que j'en ai appris** : Un ordinateur n'a pas besoin de disque dur local pour fonctionner : sa pile réseau peut interagir avec des serveurs distants dès les premières microsecondes de son démarrage.

**Ce que je ferais autrement** : J'utiliserais un outil d'Infrastructure as Code (comme Ansible) pour déployer et mettre à jour la configuration du serveur PXE de manière reproductible.

---

#### Projet Perso — Homelab LAN (DHCP / DNS / réseau physique)

**Ce que j'ai fait** : J'ai conçu, câblé et configuré ma propre infrastructure réseau physique et virtuelle à domicile, avec serveurs DHCP et DNS dédiés.

**Pourquoi** : Pour disposer d'un environnement "bac à sable" permanent permettant d'expérimenter des architectures sans risquer de casser le réseau de l'IUT, et supprimer la gestion fastidieuse des configurations IP manuelles.

**Comment** : En virtualisant des services critiques (serveur DHCP, DNS local) sur une machine Linux dédiée et en paramétrant de vrais équipements réseau pour gérer le trafic.

**Difficultés** : Gérer les conflits d'adressage avec le serveur DHCP natif de la box internet, et s'assurer que mes expérimentations ne coupaient pas l'accès internet de tout le domicile.

**Ce que j'en ai appris** : Le DNS et le DHCP forment le socle invisible de toute expérience utilisateur en réseau. J'ai aussi intégré par la force des choses des contraintes de Green Computing pour optimiser la consommation H24 du serveur.

**Ce que je ferais autrement** : Je déploierais plus tôt une solution de monitoring (Grafana/Zabbix) et une architecture primaire/secondaire pour les serveurs critiques.

---

### AC11.03 — Identifier les dysfonctionnements du réseau local

> Les TP3 (STP) et TP4 (EtherChannel) couvrent aussi AC11.03 — voir leurs fiches ci-dessus pour les dysfonctionnements observés.

---

#### R103 — TP2 (diagnostic) : Dysfonctionnements Router-on-a-Stick

**Ce que j'ai fait** : J'ai identifié, diagnostiqué et corrigé des pannes d'interconnexion au sein d'une architecture de routage inter-VLAN.

**Pourquoi** : Pour acquérir une méthodologie de dépannage réseau structurée basée sur l'analyse logique des couches basses.

**Comment** : En analysant les tables de routage, en vérifiant l'attribution des VLANs sur le switch et en testant les passerelles via des pings successifs.

**Difficultés** : Isoler si la coupure provenait d'un mauvais tag 802.1Q sur le routeur ou d'une mauvaise configuration du port Trunk sur le switch.

**Ce que j'en ai appris** : Un problème de communication inter-VLAN provient presque toujours d'une asymétrie de configuration entre l'équipement de niveau 2 et celui de niveau 3.

**Ce que je ferais autrement** : J'utiliserais systématiquement `show interfaces trunk` pour valider immédiatement l'état du lien avant de modifier la configuration IP du routeur.

---

### AC11.05 — Déployer des postes dans un domaine

---

#### R202 — Administration Système Windows Server 2016

**Ce que j'ai fait** : J'ai déployé une infrastructure complète sous Windows Server 2016 : contrôleur de domaine Active Directory, serveur DHCP avec réservation MAC, partages réseau masqués avec droits NTFS granulaires, profils itinérants, script de connexion NETLOGON automatique, et automatisation PowerShell de la création de comptes en masse. J'ai aussi déployé Notepad++ par GPO et une imprimante réseau HP via les Services d'impression.

**Pourquoi** : Pour apprendre à centraliser la gestion des identités, des droits d'accès et des ressources matérielles dans un réseau d'établissement — et industrialiser les tâches répétitives d'administration.

**Comment** :
- Rôles installés : AD DS, DHCP Server, DNS Server, File Services, Print Services
- Groupes AD : `eleves` (étendue Globale, type Sécurité) et `Profs`, avec utilisateurs `etu01` et `prof01`
- GPO sur `Default Domain Policy` : désactivation de la complexité des mots de passe (contexte TP)
- GPO sur `Default Domain Controllers Policy` : ajout des groupes `eleves` et `Profs` dans le droit `SeInteractiveLogonRight`
- Partages masqués NTFS (`etu01$`) : contrôle total pour l'utilisateur, lecture seule pour les Profs, via `icacls`
- Profil itinérant : `\\srv-LeMeillat\Utilisateurs\etu01\profil`
- Script `common.bat` dans NETLOGON : montage automatique du lecteur `R:` avec `%USERNAME%`
- Script PowerShell `create_user.ps1` : `New-ADUser`, `Add-ADGroupMember`, `New-SmbShare`, `icacls` en une seule commande paramétrée
- Quotas disque sur le volume : 1 Go max, écriture bloquée au dépassement
- Imprimante `imprimante-salle-h111` : pilote HP Universal Printing PCL 6, déployée via GPO liée à la racine du domaine

**Difficultés** : Lors du déploiement de l'imprimante via la console d'impression, erreur `"Une référence a été renvoyée par le serveur"`. Contournement : création manuelle de la GPO dans la console GPMC, liée à la racine du domaine, associée à la ressource en mode "par ordinateur". L'autre difficulté classique : la jonction au domaine échoue si le client ne pointe pas son DNS vers l'IP du contrôleur de domaine — le AD est invisible sans le DNS local.

**Ce que j'en ai appris** : L'Active Directory repose entièrement sur le DNS local — un DNS qui flanche rend l'annuaire invisible à tout le réseau. Les droits NTFS et les droits de partage sont deux couches distinctes ; la permission effective est leur intersection. Le script PowerShell avec rollback en 3 commandes (`Remove-ADUser`, `Remove-SmbShare`, `Remove-Item`) donne une discipline industrielle à l'administration.

**Ce que je ferais autrement** : J'automatiserais l'import des utilisateurs depuis un CSV via `Import-Csv | ForEach-Object { New-ADUser … }` plutôt qu'en passant des arguments en ligne de commande. Et je mettrais en place un serveur DNS secondaire pour ne pas avoir de SPOF sur l'annuaire.

---

#### R202 — Virtualisation (Séances 4+)

**Ce que j'ai fait** : J'ai étudié, comparé et manipulé différents environnements de virtualisation logicielle et matérielle.

**Pourquoi** : Pour comprendre comment isoler des services, optimiser l'usage de la RAM et du CPU d'une machine physique et concevoir des architectures cloud flexibles.

**Comment** : En analysant les performances et le cloisonnement des hyperviseurs de Type 1 (bare-metal) et de Type 2 (hosted), et la différence architecturale avec la conteneurisation Docker.

**Difficultés** : Appréhender la notion d'overhead (perte de performance due à la couche d'abstraction logicielle) lors de l'émulation complète d'un système d'exploitation.

**Ce que j'en ai appris** : La virtualisation offre une flexibilité totale grâce aux snapshots et à l'isolation des environnements, garantissant qu'un crash sur une VM n'impacte pas l'hôte.

**Ce que je ferais autrement** : J'automatiserais la création de mes VMs avec des outils d'Infrastructure as Code (Vagrant) pour standardiser mes déploiements de test.

---

## 🌐 COMPÉTENCE 2 — CONNECTER

---

### AC12.01 — Maîtriser les technologies des réseaux locaux et étendus

---

#### R103 — TP1 : Premières commandes CLI Cisco (Switchs et Routeurs)

**Ce que j'ai fait** : J'ai pris en main l'interface en ligne de commande (CLI) de commutateurs et routeurs Cisco physiques.

**Pourquoi** : Pour apprendre à configurer les paramètres de sécurité et d'accès initiaux d'un équipement d'infrastructure réseau.

**Comment** : En naviguant entre les modes (user, privileged, global config), en configurant des mots de passe chiffrés (`enable secret`) et en désactivant la recherche DNS inutile (`no ip domain-lookup`).

**Difficultés** : Mémoriser la syntaxe exacte des commandes IOS et comprendre la différence fondamentale entre la configuration en cours en RAM (running-config) et celle sauvegardée en NVRAM (startup-config).

**Ce que j'en ai appris** : La configuration d'un réseau nécessite une rigueur d'écriture absolue et la sauvegarde systématique de ses actions sous peine de tout perdre au premier redémarrage.

**Ce que je ferais autrement** : Je configurerais des accès SSH sécurisés dès la première minute plutôt que de dépendre d'une connexion par câble console physique.

---

#### R103 — TP2 : Passerelle Linux (IP Forwarding + NAT/Masquerade)

**Ce que j'ai fait** : J'ai transformé une machine Linux dotée de deux cartes réseau en une passerelle de routage active.

**Pourquoi** : Pour interconnecter un réseau privé local (LAN) à un réseau externe (WAN/Internet) en gérant le manque d'adresses IPv4 publiques.

**Comment** : J'ai activé le transfert de paquets dans le noyau Linux (`ip_forward=1` via `sysctl`) et écrit une règle de masquage NAT (MASQUERADE) via iptables pour modifier l'IP source des paquets sortants.

**Difficultés** : Diagnostiquer pourquoi les postes clients n'accédaient pas à l'extérieur — résolu après avoir identifié l'absence de configuration du proxy de l'université ou de la passerelle par défaut côté clients.

**Ce que j'en ai appris** : Les adresses privées (RFC 1918) ne peuvent pas circuler sur Internet ; le NAT est le traducteur universel indispensable qui assure la cohabitation des deux mondes.

**Ce que je ferais autrement** : J'écrirais un script Bash automatisé pour réappliquer les règles de routage et de NAT de manière persistante à chaque démarrage du serveur.

---

#### R103 — TP4 : Routage dynamique RIPv2 et OSPF (Cisco physique)

**Ce que j'ai fait** : J'ai interconnecté plusieurs routeurs Cisco physiques à l'aide de protocoles de routage dynamique.

**Pourquoi** : Pour automatiser la découverte des réseaux distants et permettre à l'infrastructure de recalculer seule un itinéraire en cas de coupure de câble.

**Comment** : En activant RIPv2 avec l'option `no auto-summary`, puis en configurant OSPF Single-Area dans la zone Backbone (Area 0) à l'aide de masques génériques (wildcards).

**Difficultés** : Manipuler les câbles de liaison série physiques et configurer correctement la commande `clock rate` uniquement sur le routeur identifié comme côté DCE.

**Ce que j'en ai appris** : OSPF est bien plus performant que RIP car il prend sa décision en fonction de la bande passante (coût) et non du simple nombre de routeurs à traverser (sauts).

**Ce que je ferais autrement** : J'implémenterais directement des configurations multi-zones OSPF pour simuler un réseau d'opérateur à grande échelle.

---

#### R101 — TP6 : Analyse protocoles TCP & UDP (Wireshark, Nmap, Netcat)

**Ce que j'ai fait** : J'ai capturé du trafic réseau et simulé des connexions clients/serveurs à bas niveau.

**Pourquoi** : Pour observer la réalité physique des paquets de données et auditer l'état des ports ouverts sur une machine cible.

**Comment** : En utilisant Netcat pour écouter sur des ports TCP/UDP, Nmap pour scanner les ports ouverts, et Wireshark pour filtrer et disséquer les en-têtes de couches 2, 3 et 4.

**Difficultés** : Interpréter la masse d'informations capturées par Wireshark et isoler les paquets pertinents (comme un flag SYN) au milieu du bruit de fond réseau.

**Ce que j'en ai appris** : J'ai compris le mécanisme d'établissement de connexion en trois étapes (3-way handshake) de TCP et la nature volatile (envoie et oublie) d'UDP.

**Ce que je ferais autrement** : J'utiliserais des filtres d'affichage Wireshark très stricts dès le début de la capture pour ne pas saturer la mémoire de la machine.

---

#### R201 — TP7 : ACL Cisco (Listes de contrôle d'accès)

**Ce que j'ai fait** : J'ai mis en place des filtres de sécurité sur les interfaces de routeurs Cisco à l'aide d'ACL standards et étendues.

**Pourquoi** : Pour interdire ou autoriser de manière chirurgicale certains flux réseau en fonction d'adresses IP ou de protocoles applicatifs spécifiques.

**Comment** : En écrivant des règles filtrant l'IP source (ACL Standard, placée près de la destination) ou le couple IP/Port source + destination (ACL Étendue, placée près de la source), appliquées en entrée (`in`) ou sortie (`out`) d'interface.

**Difficultés** : Assimiler la règle du `deny any` implicite à la fin de chaque liste — si on oublie d'autoriser explicitement le reste du trafic (`permit any`), tout le réseau est bloqué. Autre piège : le filtrage est bidirectionnel — si on bloque un flux sortant, les paquets de réponse sont aussi bloqués en retour.

**Ce que j'en ai appris** : Les ACL étendues doivent être placées au plus près de la source pour économiser la bande passante. L'ordre des règles est absolu : la première règle qui correspond s'applique, les suivantes sont ignorées.

**Ce que je ferais autrement** : J'éviterais les ACL numérotées au profit des ACL nommées, qui permettent d'éditer ou d'insérer des lignes sans devoir réécrire toute la liste.

---

#### R201 — TP8 : NAT/PAT Cisco

**Ce que j'ai fait** : J'ai configuré la traduction d'adresses réseau sous ses différentes formes sur un routeur Cisco d'entreprise.

**Pourquoi** : Pour faire correspondre des adresses privées internes à une ou plusieurs adresses publiques routables sur l'Internet mondial.

**Comment** : En définissant des règles de NAT Statique (un serveur exposé), de NAT Dynamique (un pool d'IPs) et de PAT/NAT Overload en associant une ACL à une interface publique sortante.

**Difficultés** : Identifier correctement le rôle de chaque interface en spécifiant rigoureusement `ip nat inside` côté réseau privé et `ip nat outside` côté Internet.

**Ce que j'en ai appris** : Le PAT utilise les numéros de ports de la couche Transport pour permettre à des centaines de machines locales de partager simultanément une unique adresse IP publique.

**Ce que je ferais autrement** : Je surveillerais régulièrement la table des traductions actives (`show ip nat translations`) pour anticiper les saturations de ports lors des pics de charge.

---

#### R201 — TP9 : Filtrage Linux (iptables & nftables)

**Ce que j'ai fait** : J'ai configuré un pare-feu Linux agissant comme passerelle pour contrôler le trafic entrant, sortant et en transit (FORWARD).

**Pourquoi** : Pour sécuriser la machine et isoler les réseaux en appliquant le principe du moindre privilège : tout bloquer par défaut, puis n'ouvrir que le strict nécessaire.

**Comment** : En écrivant des règles iptables pour modifier les chaînes Netfilter (INPUT/FORWARD/OUTPUT), puis en migrant vers la syntaxe plus moderne de nftables avec des ensembles (sets) pour les blacklists dynamiques.

**Difficultés** : Différencier l'impact d'une cible DROP (qui laisse la source dans le flou) par rapport à une cible REJECT lors des phases de diagnostic. Et le risque de se bloquer son propre accès SSH en passant la politique par défaut en DROP avant d'avoir ouvert le port 22.

**Ce que j'en ai appris** : J'ai visualisé exactement comment le noyau Linux intercepte et traite chaque paquet réseau via ses différents hooks (PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING).

**Ce que je ferais autrement** : Je testerais chaque règle unitairement avant de passer ma politique par défaut en DROP, pour éviter de me couper l'accès à distance.

---

### AC12.02 — Maîtriser les fondamentaux des systèmes d'exploitation

---

#### R103 — TP2 (OS) : Configuration Passerelle Linux & Routage Noyau

**Ce que j'ai fait** : J'ai manipulé les fichiers de configuration réseau système d'une distribution Linux Debian.

**Pourquoi** : Pour comprendre comment un système d'exploitation gère ses interfaces réseau, applique ses tables de routage internes et interagit avec le noyau.

**Comment** : En utilisant les commandes de la suite iproute2 (`ip addr`, `ip route`), et en modifiant de manière persistante les paramètres du noyau via `/etc/sysctl.conf`.

**Difficultés** : Diagnostiquer la perte de configuration IP au redémarrage, causée par une mauvaise syntaxe dans les fichiers de configuration d'interfaces.

**Ce que j'en ai appris** : Le système d'exploitation Linux traite le réseau comme un ensemble de fichiers et de variables d'état modifiables directement en espace noyau.

**Ce que je ferais autrement** : J'utiliserais le gestionnaire moderne Netplan pour structurer mes configurations de manière plus lisible et standardisée.

---

#### R103 — TP4 (OS) : Analyse des tables de routage complexes (Cisco/Linux)

**Ce que j'ai fait** : J'ai analysé et comparé l'organisation des tables de routage sur des routeurs Cisco IOS et des serveurs Linux.

**Pourquoi** : Pour comprendre le mécanisme universel de décision de routage basé sur la correspondance du préfixe le plus long (Longest Prefix Match).

**Comment** : En affichant les tables via `show ip route` (Cisco) et `ip route show` (Linux) pour observer la coexistence de routes connectées, statiques et dynamiques.

**Difficultés** : Interpréter les valeurs de Distance Administrative et de Métrique pour comprendre pourquoi le système préférait une route plutôt qu'une autre.

**Ce que j'en ai appris** : Quel que soit le constructeur ou le système d'exploitation, la logique algorithmique de traitement d'un paquet IP reste strictement identique partout.

**Ce que je ferais autrement** : Je construirais un script d'analyse automatisé pour comparer les tables de routage de deux machines voisines et détecter les boucles.

---

#### R205 — Fiche de révision Télécom (Signaux et Systèmes)

**Ce que j'ai fait** : J'ai synthétisé les lois mathématiques et physiques qui régissent la transmission des signaux (Parseval, Bode).

**Pourquoi** : Pour comprendre comment les données binaires (0 et 1) sont physiquement transformées en ondes ou tensions électriques sur les câbles et la fibre optique.

**Comment** : En calculant la réponse en fréquence de filtres électroniques et en analysant la dégradation du signal à travers un support physique.

**Difficultés** : Visualiser le passage d'une représentation temporelle (le signal dans le temps) à une représentation fréquentielle (le spectre des fréquences).

**Ce que j'en ai appris** : Le réseau informatique dépend entièrement des limites physiques du support de transmission ; la bande passante logicielle est dictée par la bande passante physique du signal.

**Ce que je ferais autrement** : J'utiliserais des logiciels de simulation de circuits (LTSpice) pour tester visuellement l'impact des filtres avant d'aborder les équations.

---

### AC12.03 — Identifier les niveaux de risques liés à la sécurité

---

#### R203 — TP Serveurs Web (Apache2 & Nginx)

**Ce que j'ai fait** : J'ai installé, sécurisé et configuré des serveurs web Apache2 et Nginx sous Linux, incluant des configurations multi-sites (Virtual Hosts).

**Pourquoi** : Pour apprendre à héberger des applications web professionnelles tout en restreignant les droits d'accès et en isolant les répertoires systèmes.

**Comment** : En activant des modules d'authentification par mot de passe (`.htpasswd`), en mettant en place des limitations de bande passante (`mod_ratelimit`) et en cloisonnant les permissions via `chmod 755`.

**Difficultés** : Configurer correctement la liaison d'exécution PHP via PHP-FPM dans Nginx sans exposer de failles d'exécution de scripts malveillants.

**Ce que j'en ai appris** : La sécurité d'un serveur applicatif dépend de la granularité des permissions accordées à son utilisateur système (`www-data`) : le principe du moindre privilège s'applique aussi au niveau OS.

**Ce que je ferais autrement** : J'implémenterais systématiquement des certificats SSL/TLS gratuits via Let's Encrypt pour forcer tout le trafic web en HTTPS.

---

#### R204 — TP Asterisk (VoIP / IVR)

**Ce que j'ai fait** : J'ai déployé un serveur de téléphonie sur IP (IPBX) incluant un menu vocal interactif (IVR) et un lien inter-sites.

**Pourquoi** : Pour comprendre l'architecture matérielle et logicielle des télécoms modernes et la numérisation de la voix.

**Comment** : En configurant les comptes utilisateurs (`pjsip.conf`) et en codant la logique de routage des appels dans le Dialplan d'un serveur Linux Asterisk (`extensions.conf`).

**Difficultés** : Appréhender la syntaxe spécifique du fichier `extensions.conf` et déboguer les flux audio bloqués entre les terminaux.

**Ce que j'en ai appris** : La séparation claire entre le protocole de signalisation qui établit l'appel (SIP) et le protocole qui transporte réellement la voix (RTP).

**Ce que je ferais autrement** : J'utiliserais l'outil de capture `sngrep` dès le premier jour pour visualiser les trames SIP au lieu de chercher les erreurs à l'aveugle.

---

### AC12.04 — Communiquer, travailler en équipe

---

#### R203 — Compte-rendu collaboratif Apache2/Nginx

**Ce que j'ai fait** : J'ai rédigé en équipe une documentation technique complète résumant les architectures d'hébergement web LEMP/LAMP.

**Pourquoi** : Pour apprendre à synthétiser des connaissances d'ingénierie complexes et produire des livrables exploitables par d'autres techniciens.

**Comment** : En utilisant des outils de rédaction partagés, en répartissant la validation des configurations de Virtual Hosts et en effectuant des relectures croisées.

**Difficultés** : Harmoniser les styles d'écriture de chacun des membres du groupe pour obtenir un document unique et cohérent.

**Ce que j'en ai appris** : La communication écrite est aussi cruciale que la compétence technique : un serveur parfaitement configuré ne sert à rien s'il n'est pas documenté proprement.

**Ce que je ferais autrement** : J'adopterais une approche de documentation "as Code" en stockant les fichiers de configuration dans un dépôt Git partagé.

---

#### SAÉ 1.03 — Découverte d'un dispositif de transmission

**Ce que j'ai fait** : J'ai mené en équipe une étude approfondie des caractéristiques physiques et électriques d'un câble coaxial de transmission de données.

**Pourquoi** : Pour collaborer scientifiquement à l'analyse de la propagation des ondes et comprendre les phénomènes de réflexion du signal.

**Comment** : En simulant le comportement du câble sous LTSpice, en traitant les résultats de mesures mathématiques via MATLAB, et en répartissant les tâches d'analyse au sein du binôme.

**Difficultés** : Coordonner l'importation des données de simulation de LTSpice vers MATLAB sans perte de précision ou d'échantillonnage.

**Ce que j'en ai appris** : Le travail en équipe permet de croiser les compétences : l'un se focalise sur la rigueur de la simulation physique pendant que l'autre peaufine l'algorithme de traitement mathématique.

**Ce que je ferais autrement** : J'utiliserais des scripts de versioning (Git) pour partager nos codes MATLAB au lieu de nous échanger des fichiers par clé USB.

---

## 💻 COMPÉTENCE 3 — PROGRAMMER

---

### AC13.01 — Utiliser un système informatique et ses outils

---

#### R209 — TP2 Flask : API REST + Authentification JWT (MySQL)

**Ce que j'ai fait** : J'ai développé une API REST sécurisée en Python Flask avec authentification par token JWT et persistance MySQL.

**Pourquoi** : Pour apprendre à construire un backend qui sert de passerelle sécurisée entre des clients frontend et une base de données.

**Comment** : En créant les routes `/register`, `/login` et `/me`, en implémentant un décorateur middleware de validation JWT (Bearer token), et en ajoutant une validation regex côté serveur (1 majuscule, 1 minuscule, 1 chiffre, 6-10 caractères). Testé avec Postman.

**Difficultés** : Configurer le proxy de l'IUT (`cache-etu.univ-artois.fr:3128`) pour les installations pip, et comprendre la différence entre stocker la session en variable Python (éphémère) versus en base MySQL (persistant).

**Ce que j'en ai appris** : La validation côté client seule est insuffisante — le serveur doit systématiquement revalider. Les tokens JWT permettent une authentification stateless (sans session serveur) avec expiration automatique.

**Ce que je ferais autrement** : Je séparerais les routes en Blueprints Flask dès le début pour éviter un fichier monolithique ingérable quand le projet grandit.

---

#### R209 — TP3 Flask : Architecture MVC & Jinja2 (SQLAlchemy)

**Ce que j'ai fait** : J'ai développé une application web dynamique structurée en Python en appliquant le design pattern MVC.

**Pourquoi** : Pour apprendre à séparer proprement la logique métier (code Python), l'accès aux données (la base) et l'affichage utilisateur (le HTML).

**Comment** : En utilisant le framework Flask, en factorisant mes pages HTML à l'aide de l'héritage de templates Jinja2, et en gérant l'accès aux données via SQLAlchemy ORM.

**Difficultés** : Structurer correctement l'architecture des dossiers du projet pour éviter les importations circulaires de variables entre mes fichiers de routes Python.

**Ce que j'en ai appris** : Le pattern MVC rend le code industriel, lisible et maintenable à grande échelle, permettant de modifier l'affichage sans risquer de casser la logique de calcul.

**Ce que je ferais autrement** : J'implémenterais SQLAlchemy dès le début du projet plutôt qu'en cours de route, pour éviter de réécrire les accès base en ORM après avoir écrit du SQL brut.

---

#### R207 — CTP PostgreSQL

**Ce que j'ai fait** : J'ai installé un serveur de base de données PostgreSQL, configuré des privilèges d'accès et rédigé des requêtes relationnelles complexes.

**Pourquoi** : Pour maîtriser le stockage, la sécurisation et l'extraction de données structurées au sein d'un système d'information.

**Comment** : En créant des tables liées par des clés primaires et étrangères, en configurant des utilisateurs SQL aux droits restreints, et en écrivant des requêtes à base de jointures (JOIN), filtres (WHERE) et agrégations.

**Difficultés** : Optimiser l'ordre de mes jointures SQL sur des requêtes imbriquées pour éviter des temps de calcul trop longs sur le serveur.

**Ce que j'en ai appris** : Une base de données doit être pensée et modélisée rigoureusement en amont (contraintes d'intégrité) pour garantir qu'aucune donnée corrompue ou orpheline ne puisse y être insérée.

**Ce que je ferais autrement** : J'écrirais des index spécifiques sur les colonnes fréquemment recherchées pour accélérer l'exécution des requêtes lourdes.

---

#### SAÉ 2.3 — MiniGPT (Flask + MySQL + Docker)

**Ce que j'ai fait** : J'ai conçu de A à Z une plateforme de chat IA fonctionnelle, dotée d'une authentification sécurisée et de bases de données persistantes.

**Pourquoi** : Pour fusionner mes compétences de développeur web et d'administrateur système autour d'un produit final moderne, complexe et complet.

**Comment** : J'ai utilisé Python avec le framework Flask pour le backend, MySQL pour la donnée, TailwindCSS pour l'interface, le tout conteneurisé via Docker Compose.

**Difficultés** : Sécuriser les mots de passe (Bcrypt) et gérer le maintien de l'état des sessions entre l'interface et la base de données.

**Ce que j'en ai appris** : J'ai maîtrisé l'industrialisation d'une application via des conteneurs isolés et l'application stricte du pattern MVC (Modèle-Vue-Contrôleur).

**Ce que je ferais autrement** : J'architecturerais le backend sous forme d'API REST pure (avec FastAPI) pour découpler totalement le front du back.

---

### AC13.02 — Lire, exécuter, corriger et modifier un programme

---

#### Projet Perso — NotGoogle (navigateur + moteur de recherche bas niveau)

**Ce que j'ai fait** : J'ai recréé un navigateur web et un moteur de recherche bas niveau, gérant le chiffrement TLS et le rendu de pages en Python brut.

**Pourquoi** : Pour sortir de l'abstraction des outils modernes et comprendre intimement la mécanique des échanges HTTP, de la socket TCP jusqu'à l'écran.

**Comment** : En forgeant mes propres requêtes HTTP/1.1 à la main via des sockets TCP brutes, avec une interface Tkinter.

**Difficultés** : Contourner les pare-feux applicatifs (WAF) des serveurs modernes qui rejettent les requêtes non standards, et gérer manuellement le handshake TLS.

**Ce que j'en ai appris** : L'exigence implacable des protocoles réseaux : à ce niveau bas niveau, un seul octet mal formaté fait échouer toute la connexion.

**Ce que je ferais autrement** : J'intégrerais une gestion asynchrone des sockets pour éviter que l'interface graphique ne se fige en attendant la réponse des serveurs.

---

#### Projet Perso — Readme Generator & Own CLI Template (Python)

**Ce que j'ai fait** : J'ai développé un outil CLI en Python générant automatiquement des fichiers de documentation standardisés, et un template réutilisable pour des interfaces terminal visuelles.

**Pourquoi** : Pour automatiser les tâches répétitives et standardiser l'expérience utilisateur de mes outils en ligne de commande.

**Comment** : En exploitant les codes d'échappement ANSI pour les couleurs et la mise en page dynamique, et en écrivant des fonctions d'E/S de fichiers Markdown.

**Difficultés** : Assurer un rendu graphique identique entre différents émulateurs de terminaux (WSL, Linux natif, macOS), et gérer l'encodage des caractères Markdown.

**Ce que j'en ai appris** : Même une interface CLI mérite une réflexion UX approfondie ; la clarté visuelle évite les erreurs de manipulation. L'automatisation par de petits outils locaux fait gagner un temps précieux au quotidien.

**Ce que je ferais autrement** : Je publierais ce template sous forme de package PyPI installable via `pip` sur n'importe quelle machine.

---

#### Projet Perso — Crypto (Simulateur Enigma)

**Ce que j'ai fait** : J'ai programmé des algorithmes d'exploration cryptographique, incluant le chiffrement par décalage (César) et une simulation logicielle de la machine Enigma.

**Pourquoi** : Pour explorer l'histoire de l'informatique et comprendre les principes logiques et mathématiques profonds du chiffrement de données.

**Comment** : En transposant le fonctionnement mécanique des rotors, des réflecteurs et du tableau de connexions en structures de données logiques (listes, dictionnaires) et permutations mathématiques.

**Difficultés** : Déboguer la logique de rotation indexée des rotors, où le mouvement d'un composant déclenche mécaniquement le décalage du suivant à un instant précis.

**Ce que j'en ai appris** : La cryptographie moderne découle directement de ces mécanismes fondamentaux ; comprendre la manipulation des bits et des caractères à bas niveau est essentiel pour appréhender la sécurité.

**Ce que je ferais autrement** : J'implémenterais une interface graphique interactive affichant l'animation des rotors en temps réel pour rendre l'outil pédagogique.

---

### AC13.05 — Choisir les mécanismes de gestion de données adaptés

---

#### SAÉ 1.5 — Traitement de données (Python CSV/JSON)

**Ce que j'ai fait** : J'ai développé des scripts en Python pour extraire, nettoyer, analyser et visualiser des volumes de données brutes.

**Pourquoi** : Pour apprendre à manipuler l'information et automatiser l'extraction d'insights exploitables à partir de fichiers illisibles manuellement.

**Comment** : En utilisant des algorithmes de tri Python, en parsant des fichiers structurés (CSV/JSON) et en utilisant des bibliothèques de visualisation.

**Difficultés** : Gérer les anomalies du jeu de données source (formats de dates incohérents, champs vides) qui faisaient planter le code.

**Ce que j'en ai appris** : En data science, 80 % du travail consiste à préparer et assainir la donnée ; le code d'analyse final n'est que la pointe de l'iceberg.

**Ce que je ferais autrement** : Je mettrais en place des blocs `try/except` plus robustes dès la phase d'ingestion pour éviter l'arrêt brutal des scripts d'analyse.

---

#### Projet Perso — SAÉ 1.04 / Portfolio Web (HTML/CSS/Bootstrap)

**Ce que j'ai fait** : J'ai codé l'intégralité de mon premier site web de portfolio personnel réactif à partir d'un framework graphique.

**Pourquoi** : Pour matérialiser mon identité professionnelle naissante et apprendre à structurer du code d'interface sémantique propre.

**Comment** : En écrivant du code HTML5/CSS3 structuré, en utilisant Bootstrap pour assurer la compatibilité mobile, et en ajoutant des scripts JavaScript pour animer l'interface.

**Difficultés** : Surcharger proprement les styles CSS natifs de Bootstrap sans casser la cohérence visuelle et l'alignement des éléments de grille.

**Ce que j'en ai appris** : Le développement d'interfaces exige une double compétence : la rigueur logique du code et la sensibilité ergonomique (UI/UX) pour offrir une navigation intuitive.

**Ce que je ferais autrement** : Je migrerais ce site sous React et Tailwind CSS pour bénéficier d'une architecture par composants réutilisables — ce que j'ai d'ailleurs fait pour ce portfolio actuel.

---

## 📋 NOTES — Documents manquants ou à créer

Les éléments suivants sont documentés dans ce bilan mais **n'ont pas de fichier `.md` associé** dans `public/assets/documents/apprentissage` :

| Entrée | Module | Statut |
|---|---|---|
| SAÉ 1.03 — Câble coaxial (LTSpice / MATLAB) | R205 | Pas de doc |
| SAÉ 1.05 — Traitement de données Python | SAÉ 1.05 | Pas de doc |
| SAÉ 1.04 — Portfolio Bootstrap | SAÉ 1.04 | Pas de doc |
| SAÉ 2.3 — MiniGPT | SAÉ 2.3 | Pas de doc (image OK dans registry) |

**Documents mis en forme (session courante) :**

| Fichier | Statut |
|---|---|
| `tech-internet/tp8-NAT.md` | ✅ Formaté (frontmatter + vulgarisation + callouts) |
| `admin system windows/tp-admin-system-windows-server.md` | ✅ Formaté (frontmatter + 6 sections structurées) |
