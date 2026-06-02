export interface AcEntry {
    id: string;
    label: string;
    ce_que_jai_fait: string;
    pourquoi: string;
    comment: string;
    difficultes: string;
    appris: string;
    autrement: string;
}

export interface Station {
    id: string;
    step: string;
    titre: string;
    tagline: string;
    accroche: string;
    narrative: string[];
    color: string;
    colorRgb: string;
    position: 'left' | 'right';
    filterAcs: string[];
    acs: AcEntry[];
}

export const STATIONS: Station[] = [
    {
        id: 'etincelle',
        step: '01',
        titre: "L'Étincelle",
        tagline: "La Source et la Programmation",
        accroche: "Le voyage ne commence pas dans un câble.\nIl commence par une intention.",
        narrative: [
            "L'utilisateur ouvre sa session et tape une recherche. À cet instant, des lignes de code forgent un véhicule sur-mesure — le paquet réseau.",
            "Pour comprendre cette origine, j'ai recodé le point de départ en construisant des sockets TCP bruts à la main.",
        ],
        color: '#3B82F6',
        colorRgb: '59, 130, 246',
        position: 'left',
        filterAcs: ['AC11.05', 'AC13.01', 'AC13.02'],
        acs: [
            {
                id: 'AC11.05',
                label: 'Déployer des postes clients dans un domaine',
                ce_que_jai_fait:
                    "Installé et configuré un contrôleur de domaine Active Directory sous Windows Server 2016. Intégré des postes clients Windows dans le domaine R202.",
                pourquoi:
                    "Pour centraliser l'authentification des utilisateurs d'une organisation et comprendre comment une session démarre vraiment.",
                comment:
                    "Installation du rôle AD DS, promotion en contrôleur de domaine, création d'unités d'organisation et de GPO basiques.",
                difficultes:
                    "Un poste ne rejoignait pas le domaine à cause d'une résolution DNS incorrecte — le serveur AD n'était pas enregistré comme DNS primaire.",
                appris:
                    "Active Directory repose entièrement sur DNS. Sans DNS fonctionnel, le domaine ne fonctionne pas. Ce n'est pas optionnel.",
                autrement:
                    "Vérifier la configuration DNS du poste client en premier, avant toute tentative de jonction.",
            },
            {
                id: 'AC13.01',
                label: "Utiliser un système et ses outils",
                ce_que_jai_fait:
                    "Développé des applications web avec Flask (Python), Jinja2 pour le templating, Docker pour la conteneurisation, Tailwind CSS pour l'interface. SAÉ 1.5 + projet MiniGPT.",
                pourquoi:
                    "Maîtriser l'écosystème complet d'un framework — pas juste le code, mais les outils de déploiement, de test et d'empaquetage autour.",
                comment:
                    "Dockerfile, docker-compose, configuration Nginx en reverse-proxy devant Flask. Routes HTTP, contexte Jinja2.",
                difficultes:
                    "Comprendre le cycle de vie d'une requête dans Flask — de l'entrée jusqu'à la réponse générée par Jinja2, en passant par le contexte applicatif.",
                appris:
                    "Flask est micro mais extensible. Sa simplicité force à comprendre ce qui se passe sous le capot plutôt que de masquer la complexité.",
                autrement:
                    "Écrire des tests de routes dès le début pour valider le comportement avant de construire l'interface.",
            },
            {
                id: 'AC13.02',
                label: "Lire, corriger et modifier un programme",
                ce_que_jai_fait:
                    "Débogué et amélioré notgoogle — un navigateur web construit sur des sockets TCP bruts en Python. Tracé les échanges HTTP octet par octet, corrigé le parsing des headers.",
                pourquoi:
                    "Comprendre un protocole réseau en le codant soi-même est incomparablement plus efficace qu'en lisant une RFC de 80 pages.",
                comment:
                    "Lecture du code Python existant, ajout de logs structurés, correction de la gestion des codes de redirection HTTP (301/302), vérification avec Wireshark.",
                difficultes:
                    "Les serveurs web renvoient des réponses HTTP variables — certains compriment avec gzip, d'autres redirigent. Chaque cas devait être géré explicitement.",
                appris:
                    "HTTP est du texte pur sur TCP. Une fois qu'on l'a vu octet par octet dans Wireshark, on ne l'oublie plus. Le protocole devient concret.",
                autrement:
                    "Écrire des tests de régression après chaque correction pour ne pas réintroduire un bug déjà fixé.",
            },
        ],
    },
    {
        id: 'labyrinthe',
        step: '02',
        titre: "Le Labyrinthe Organisé",
        tagline: "Le Switch et le LAN",
        accroche: "Pour guider le chaos,\nil faut construire des murs invisibles.",
        narrative: [
            "Le paquet entre dans le réseau de l'entreprise. Sans règles, c'est le chaos. On lui assigne un couloir insonorisé — le VLAN.",
            "Et si un carambolage menace ? Le Spanning Tree bloque les routes redondantes pour éviter qu'il ne tourne en boucle à l'infini.",
        ],
        color: '#10B981',
        colorRgb: '16, 185, 129',
        position: 'right',
        filterAcs: ['AC11.01', 'AC11.03'],
        acs: [
            {
                id: 'AC11.01',
                label: "Configurer les fonctions de base du réseau local",
                ce_que_jai_fait:
                    "Configuré des VLANs et trunks 802.1Q sur switches Cisco (Cisco IOS) dans la SAÉ 1.02 — architecture PME multi-VLANs. Mis en place le protocole Spanning Tree pour éliminer les boucles.",
                pourquoi:
                    "Pour segmenter un réseau d'entreprise et isoler le trafic entre départements, comme en production réelle.",
                comment:
                    "CLI Cisco IOS sur Packet Tracer, puis sur matériel physique. Commandes vlan, switchport mode trunk, spanning-tree.",
                difficultes:
                    "Les VLANs ne communiquaient pas entre switches sans configurer les trunks — diagnostic Router-on-a-Stick pour identifier la cause.",
                appris:
                    "Le trunk 802.1Q permet à plusieurs VLANs de transiter sur un seul lien physique. Le STP bloque les ports redondants pour éviter les tempêtes de broadcast.",
                autrement:
                    "Documenter le plan d'adressage et la topologie physique avant toute configuration, pas après.",
            },
            {
                id: 'AC11.03',
                label: "Identifier les dysfonctionnements réseau",
                ce_que_jai_fait:
                    "Diagnostiqué des pannes réseau : boucles STP non résolues, mauvaises configurations de trunks, pannes EtherChannel dans les TPs R103.",
                pourquoi:
                    "Un administrateur réseau passe autant de temps à réparer qu'à construire. Diagnostiquer méthodiquement est une compétence centrale.",
                comment:
                    "Commandes show Cisco IOS : show spanning-tree, show interfaces trunk, show etherchannel summary. Vérification couche par couche.",
                difficultes:
                    "Les pannes réseau sont souvent multi-causes et s'accumulent. Isoler chaque variable prend plus de temps que la correction elle-même.",
                appris:
                    "Toujours vérifier la couche physique (câble, port) avant la couche logique (VLAN, protocole). Le modèle OSI est un guide de débogage, pas juste une liste à mémoriser.",
                autrement:
                    "Tenir un journal des symptômes et des hypothèses avant de toucher la configuration.",
            },
        ],
    },
    {
        id: 'frontiere',
        step: '03',
        titre: "Le Poste Frontière",
        tagline: "Le Routeur et la Sécurité",
        accroche: "Séparer l'interne de l'externe :\nle domaine des aiguilleurs.",
        narrative: [
            "Le paquet veut rejoindre l'autoroute mondiale. Il passe au poste frontière. Le videur (iptables) vérifie son identité.",
            "S'il est autorisé, le réceptionniste (NAT) efface son adresse privée et lui colle l'adresse officielle pour qu'il voyage anonymement.",
        ],
        color: '#8B5CF6',
        colorRgb: '139, 92, 246',
        position: 'left',
        filterAcs: ['AC11.02', 'AC12.01', 'AC12.02'],
        acs: [
            {
                id: 'AC11.02',
                label: "Maîtriser les interconnexions entre réseaux",
                ce_que_jai_fait:
                    "Configuré le routage dynamique OSPF sur des routeurs Cisco. Mis en place le routage inter-VLAN (Router-on-a-Stick) pour faire communiquer des VLANs distincts.",
                pourquoi:
                    "Pour que des réseaux distincts puissent se parler automatiquement, sans routes statiques à maintenir à la main.",
                comment:
                    "TPs R201 — configuration OSPF (area 0) et RIP sur Packet Tracer et routeurs physiques.",
                difficultes:
                    "OSPF requiert que les interfaces soient dans la même zone. Un numéro d'area incorrect bloquait silencieusement la convergence.",
                appris:
                    "OSPF converge plus vite que RIP et ne limite pas les sauts. La métrique OSPF est le coût (inversement proportionnel à la bande passante).",
                autrement:
                    "Tracer le schéma des zones OSPF et vérifier la cohérence des areas avant toute configuration.",
            },
            {
                id: 'AC12.01',
                label: "Maîtriser les technologies LAN/WAN",
                ce_que_jai_fait:
                    "Configuré des règles iptables/nftables sur une passerelle Linux pour filtrer le trafic. Mis en place NAT/PAT sur routeur Cisco (ip nat inside/outside).",
                pourquoi:
                    "Pour protéger un réseau local des connexions non autorisées et permettre aux machines privées d'accéder à Internet avec une seule IP publique.",
                comment:
                    "TPs R201 — règles iptables en chaînes INPUT/OUTPUT/FORWARD, NAT Cisco overload. Vérification avec iptables -L -n -v.",
                difficultes:
                    "L'ordre des règles iptables est critique — une règle ACCEPT placée avant un DROP annule silencieusement le filtrage.",
                appris:
                    "iptables évalue les règles dans l'ordre, s'arrête à la première correspondance. Commencer par DROP ALL par défaut est la bonne pratique.",
                autrement:
                    "Partir d'une politique DROP par défaut et ajouter uniquement ce qui est explicitement autorisé.",
            },
            {
                id: 'AC12.02',
                label: "Fondamentaux des systèmes d'exploitation réseau",
                ce_que_jai_fait:
                    "Activé le forwarding IP dans le noyau Linux (sysctl net.ipv4.ip_forward=1) pour transformer une machine en routeur/passerelle.",
                pourquoi:
                    "Par défaut Linux ne transfère pas les paquets entre interfaces. Il faut l'activer explicitement pour jouer le rôle de passerelle réseau.",
                comment:
                    "Modification de /etc/sysctl.conf, persistance au reboot, vérification avec ip route et traceroute depuis les machines derrière la passerelle.",
                difficultes:
                    "Comprendre que le forwarding IP et le NAT sont deux mécanismes distincts — les deux doivent être actifs simultanément pour qu'une passerelle NAT fonctionne.",
                appris:
                    "Le noyau Linux implémente nativement les fonctions réseau (routage, filtrage, NAT) via Netfilter. C'est la même technologie que les routeurs dédiés, mais transparente.",
                autrement:
                    "Désactiver le pare-feu temporairement pour tester le forwarding seul et isoler les problèmes.",
            },
        ],
    },
    {
        id: 'arrivee',
        step: '04',
        titre: "L'Arrivée",
        tagline: "Le Serveur et la Gestion de Données",
        accroche: "Où l'information prend\ntout son sens.",
        narrative: [
            "Le paquet atteint sa destination. Le bibliothécaire (Apache/Nginx) l'accueille. À l'intérieur, les données brutes sont triées dans des archives relationnelles.",
            "Ou passées à travers un réseau neuronal pour y trouver du sens — comme dans MiniGPT.",
        ],
        color: '#06B6D4',
        colorRgb: '6, 182, 212',
        position: 'right',
        filterAcs: ['AC12.03', 'AC13.05'],
        acs: [
            {
                id: 'AC12.03',
                label: "Identifier les risques de sécurité applicatifs",
                ce_que_jai_fait:
                    "Sécurisé le backend de MiniGPT : VirtualHost Apache cloisonné, mots de passe hashés en bcrypt, sessions Flask sécurisées, requêtes SQL paramétrées.",
                pourquoi:
                    "Une application web exposée sans protection est une cible directe — injection SQL, vol de session, exposition de données sensibles.",
                comment:
                    "TPs R203 + projet MiniGPT — configuration Apache, Flask-Login, SQLAlchemy avec paramètres bindés contre les injections.",
                difficultes:
                    "Comprendre la distinction entre authentification (qui es-tu ?) et autorisation (que peux-tu faire ?) — les deux mécanismes doivent être indépendants.",
                appris:
                    "La sécurité par défaut n'existe pas. Chaque couche (réseau, OS, application) doit être durcie séparément. Une seule couche sécurisée ne protège pas les autres.",
                autrement:
                    "Intégrer la sécurité dès la conception du schéma de données, pas en post-déploiement.",
            },
            {
                id: 'AC13.05',
                label: "Choisir les mécanismes de gestion de données adaptés",
                ce_que_jai_fait:
                    "Conçu le schéma relationnel MySQL de MiniGPT (tables users, conversations, messages avec clés étrangères). Écrit des scripts de traitement de données pour la SAÉ 1.5.",
                pourquoi:
                    "La structure des données détermine les performances et la maintenabilité de toute application. Un mauvais modèle initial est coûteux à corriger.",
                comment:
                    "Modélisation UML, MySQL Workbench, requêtes SQL avec jointures et index. Python pour les scripts de traitement en batch.",
                difficultes:
                    "Normaliser les tables pour éviter la redondance sans rendre les requêtes JOIN trop complexes à maintenir.",
                appris:
                    "Une clé étrangère sans index sur la colonne référencée ruine les performances. Les index sont aussi importants que la structure de la table.",
                autrement:
                    "Partir du modèle de données avant d'écrire la moindre ligne d'application. Les migrations coûtent cher.",
            },
        ],
    },
    {
        id: 'envers',
        step: '05',
        titre: "L'Envers du Décor",
        tagline: "La Collaboration",
        accroche: "Construire l'invisible\nne se fait jamais seul.",
        narrative: [
            "Une telle infrastructure ne fonctionne pas sans plans précis, sans voix qui se coordonnent — la téléphonie VoIP entre sites distants.",
            "Et sans un savoir partagé. La Bible Réseaux n'est pas un document. C'est une mémoire collective.",
        ],
        color: '#F59E0B',
        colorRgb: '245, 158, 11',
        position: 'left',
        filterAcs: ['AC12.04'],
        acs: [
            {
                id: 'AC12.04',
                label: "Communiquer et travailler en équipe",
                ce_que_jai_fait:
                    "Rédigé la Bible Réseaux vulgarisée (documentation collaborative). Contribué aux comptes-rendus de SAÉs. Configuré un serveur Asterisk pour la téléphonie VoIP inter-sites (SIP/IAX).",
                pourquoi:
                    "La documentation et la communication sont aussi critiques que la technique. Une infrastructure non documentée est une infrastructure incontrôlable.",
                comment:
                    "Rédaction Markdown, conventions de nommage partagées, schémas réseau annotés. Asterisk : configuration de dialplan, extensions SIP, IVR vocal.",
                difficultes:
                    "Écrire pour un lecteur non-technique sans perdre la précision technique — trouver le bon niveau d'abstraction est plus difficile que le contenu lui-même.",
                appris:
                    "Un schéma réseau annoté vaut 10 pages de texte. La documentation doit être tenue à jour au fil du projet, pas rédigée à la fin quand les détails sont oubliés.",
                autrement:
                    "Documenter au fur et à mesure, avec un template structuré commun à toute l'équipe dès le départ.",
            },
        ],
    },
];
