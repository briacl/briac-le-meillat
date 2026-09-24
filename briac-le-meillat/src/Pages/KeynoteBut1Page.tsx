import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen, CheckCircle2, Database, Eye, ExternalLink, FileText, GitBranch, Globe, Home, Key, LayoutGrid, Monitor, Network, Package, Phone, Router, Search, Server, Shield, ShieldCheck, Terminal, Users, X, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExPage from '@/Pages/ExPage';
import { Proof } from '@/utils/tpsProvider';

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];
const TOTAL = 24;
const SLIDE_DARKS = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true];

const BASE = (() => {
    const b = import.meta.env.BASE_URL;
    return b.endsWith('/') ? b : `${b}/`;
})();

// ─── CSS keyframes ────────────────────────────────────────────────────────────

const SHIMMER_CSS = `
::-webkit-scrollbar { display: none; }
@keyframes v2ShimmerBlue   { 0% { transform: translate(-50%,-50%) rotate(0deg); } 100% { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes v2ShimmerViolet { 0% { transform: translate(-50%,-50%) rotate(0deg); } 100% { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes v2ShimmerCyan   { 0% { transform: translate(-50%,-50%) rotate(0deg); } 100% { transform: translate(-50%,-50%) rotate(360deg); } }
.v2-shimmer-blue   { animation: v2ShimmerBlue   7s linear infinite; }
.v2-shimmer-violet { animation: v2ShimmerViolet 7s linear infinite; }
.v2-shimmer-cyan   { animation: v2ShimmerCyan   7s linear infinite; }
@keyframes v2Blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
.v2-cursor { animation: v2Blink 1s step-start infinite; }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface PersonalCard {
    title: string;
    subtitle: string;
    link?: string;
    image?: string;
}

interface CompetenceDef {
    label: string;
    acte: string;
    title: string;
    tagline: string;
    referentiel: string;
    icon: React.ReactNode;
    accentColor: string;
    accentColorRgb: string;
    auraColor: string;
    shimmerClass: string;
    shimmerGradient: string;
    personalCard?: PersonalCard;
}

interface CarouselImage {
    src: string;
    caption: string;
    title?: string;
    icon?: React.ReactNode;
    vulgaTagline?: string;
    specs?: string[];
    docPath?: string;
}

interface ACEntry {
    code: string;
    title: string;
    ressources: string[];
}

interface CreditsEntry {
    ref: string;
    title: string;
}

// ─── Data Compétences ─────────────────────────────────────────────────────────

const COMPETENCES: CompetenceDef[] = [
    {
        label: 'Administrer',
        acte: 'Acte I',
        title: 'Administrer\nl\'Architecture',
        tagline: 'Configurer. Segmenter. Déployer.',
        referentiel: 'R103, R105 & R202',
        icon: <Server size={52} strokeWidth={0.7} />,
        accentColor: '#3B82F6',
        accentColorRgb: '59, 130, 246',
        auraColor: 'rgba(59,130,246,0.35)',
        shimmerClass: 'v2-shimmer-blue',
        shimmerGradient: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.8) 18deg, #3B82F6 48deg, transparent 75deg)',
        personalCard: { title: 'HomeLab LAN', subtitle: 'Un réseau physique dans ma chambre', image: `${BASE}assets/projects/lan-visu.webp` },
    },
    {
        label: 'Connecter',
        acte: 'Acte II',
        title: 'Connecter\nles Mondes',
        tagline: 'Router. Filtrer. Analyser.',
        referentiel: 'R101, R201, R204 & R205',
        icon: <Network size={52} strokeWidth={0.7} />,
        accentColor: '#8B5CF6',
        accentColorRgb: '139, 92, 246',
        auraColor: 'rgba(139,92,246,0.35)',
        shimmerClass: 'v2-shimmer-violet',
        shimmerGradient: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.8) 18deg, #8B5CF6 48deg, transparent 75deg)',
    },
    {
        label: 'Programmer',
        acte: 'Acte III',
        title: 'Programmer\nl\'Usage',
        tagline: 'Coder. Orchestrer. Innover.',
        referentiel: 'R207, R209 & SAÉ 104',
        icon: <Terminal size={52} strokeWidth={0.7} />,
        accentColor: '#06B6D4',
        accentColorRgb: '6, 182, 212',
        auraColor: 'rgba(6,182,212,0.35)',
        shimmerClass: 'v2-shimmer-cyan',
        shimmerGradient: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.8) 18deg, #06B6D4 48deg, transparent 75deg)',
        personalCard: {
            title: 'notgoogle',
            subtitle: 'NotGoogle : mon mini moteur de recherche',
            link: 'https://github.com/briacl/notgoogle',
            image: `${BASE}assets/projects/notgoogle-visu.png`,
        },
    },
];

// ─── Data AC Lists ────────────────────────────────────────────────────────────

const ACS_ADMINISTRER: ACEntry[] = [
    { code: 'AC11.01', title: 'Maîtriser les lois fondamentales de l\'électricité en régime variable',     ressources: ['R105', 'SAÉ 103'] },
    { code: 'AC11.02', title: 'Comprendre l\'architecture et les fondements des systèmes numériques',       ressources: ['R101', 'R102'] },
    { code: 'AC11.03', title: 'Configurer les fonctions de base du réseau local',                          ressources: ['R103', 'SAÉ 1.02'] },
    { code: 'AC11.04', title: 'Maîtriser les rôles et les principes fondamentaux des systèmes d\'exploitation', ressources: ['R202'] },
    { code: 'AC11.05', title: 'Identifier les dysfonctionnements du réseau local',                         ressources: ['R103', 'SAÉ 1.02'] },
    { code: 'AC11.06', title: 'Installer un poste client et expliquer la procédure',                       ressources: ['R202', 'R203'] },
];

const ACS_CONNECTER: ACEntry[] = [
    { code: 'AC12.01', title: 'Mesurer, analyser et commenter les signaux',                                ressources: ['R105', 'R205', 'SAÉ 103'] },
    { code: 'AC12.02', title: 'Caractériser des systèmes de transmissions élémentaires et modélisation',   ressources: ['R205'] },
    { code: 'AC12.03', title: 'Déployer des supports de transmission',                                     ressources: ['HomeLab'] },
    { code: 'AC12.04', title: 'Connecter les systèmes de ToIP',                                            ressources: ['R204'] },
    { code: 'AC12.05', title: 'Communiquer avec un tiers (client, collaborateur…) et adapter son discours', ressources: ['Communication', 'Anglais'] },
];

const ACS_PROGRAMMER: ACEntry[] = [
    { code: 'AC13.01', title: 'Utiliser un système informatique et ses outils',                            ressources: ['R209', 'SAÉ 2.3'] },
    { code: 'AC13.02', title: 'Lire, exécuter, corriger et modifier un programme',                        ressources: ['Python', 'TCP/IP'] },
    { code: 'AC13.03', title: 'Traduire un algorithme, dans un langage et pour un environnement donné',    ressources: ['Python', 'SAÉ 1.3'] },
    { code: 'AC13.04', title: 'Connaître l\'architecture et les technologies d\'un site Web',              ressources: ['SAÉ 104'] },
    { code: 'AC13.05', title: 'Choisir les mécanismes de gestion de données adaptés au développement',     ressources: ['R207', 'SAÉ 15'] },
    { code: 'AC13.06', title: 'S\'intégrer dans un environnement propice au développement et au travail collaboratif', ressources: ['Git', 'GitHub'] },
];

// ─── Data Crédits ─────────────────────────────────────────────────────────────

const CREDITS_ADMINISTRER: CreditsEntry[] = [
    { ref: 'SAÉ 1.02',    title: 'Déploiement d\'une infrastructure PME — Cisco Packet Tracer' },
    { ref: 'R103 · TP1',  title: 'VLANs et segmentation logique' },
    { ref: 'R103 · TP3',  title: 'Spanning Tree Protocol & EtherChannel' },
    { ref: 'R202 · TP3',  title: 'DHCP, DNS, Active Directory — Windows Server' },
    { ref: 'R203',        title: 'Boot réseau PXE — déploiement automatisé de postes' },
    { ref: 'R105 · SAÉ 103', title: 'LTSpice — simulation et analyse de circuits électriques' },
];

const CREDITS_CONNECTER: CreditsEntry[] = [
    { ref: 'R201',        title: 'Filtrage Linux — iptables & nftables' },
    { ref: 'R201',        title: 'NAT/PAT — passerelle Linux from scratch' },
    { ref: 'R103',        title: 'Routage inter-VLAN' },
    { ref: 'R204',        title: 'Téléphonie sur IP — Asterisk, Trunk SIP, IVR' },
    { ref: 'R205 · SAÉ 103', title: 'Signaux électriques — MATLAB & LTSpice' },
];

const CREDITS_PROGRAMMER: CreditsEntry[] = [
    { ref: 'SAÉ 104',     title: 'Portfolio — HTML, CSS, JavaScript, Bootstrap' },
    { ref: 'SAÉ 2.3',     title: 'MiniGPT — Flask, Docker, MySQL' },
    { ref: 'SAÉ 15',      title: 'Données CSV/JSON massives — Python & PostgreSQL' },
    { ref: 'R207',        title: 'Bases de données relationnelles — PostgreSQL' },
    { ref: 'R209 · TP3',  title: 'Flask backend — REST API' },
    { ref: 'notgoogle',   title: 'Moteur de recherche — sockets TCP bruts en Python' },
];

// ─── Data Carousels ───────────────────────────────────────────────────────────

const CAROUSEL_ADMINISTRER: CarouselImage[] = [
    { src: `${BASE}assets/projects/image-illustration-ltspice.png`,
      caption: 'LTSpice — simulation de circuits électriques',
      icon: <Zap size={24} />, title: 'LTSpice · Signaux', vulgaTagline: 'Les ondes électriques', specs: ['R105', 'AC11.01', 'SAÉ 103'] },
    { src: `${BASE}assets/documents/apprentissage/admin-reseau/vlan/vlan-img-tp1.png`,
      caption: 'VLANs — TP1 R103',
      icon: <LayoutGrid size={24} />, title: 'Segmentation VLAN', vulgaTagline: 'Les murs invisibles', specs: ['R103', 'AC11.03', 'SAÉ 1.02'],
      docPath: 'assets/documents/apprentissage/admin-reseau/vlan/tp1.md' },
    { src: `${BASE}assets/documents/apprentissage/sae102/livrable_sae12FINALE/images/showvlan.png`,
      caption: 'show vlan brief — Cisco IOS',
      docPath: 'assets/documents/apprentissage/sae102/livrable_sae12FINALE/compte-rendu.md' },
    { src: `${BASE}assets/documents/apprentissage/admin-reseau/spanning-tree/image.png`,
      caption: 'Spanning Tree Protocol — R103',
      docPath: 'assets/documents/apprentissage/admin-reseau/spanning-tree/tp3.md' },
    { src: `${BASE}assets/documents/apprentissage/admin-reseau/etherchannel/etherchannel.png`,
      caption: 'EtherChannel — agrégation de liens',
      docPath: 'assets/documents/apprentissage/admin-reseau/etherchannel/tp4.md' },
    { src: `${BASE}assets/documents/apprentissage/sae102/livrable_sae12FINALE/images/trunk.png`,
      caption: 'Trunk 802.1q — SAÉ 1.02',
      docPath: 'assets/documents/apprentissage/sae102/livrable_tp3_Briac_lemeillat/compte-rendu.md' },
    { src: `${BASE}assets/projects/windows-admin.webp`,
      caption: 'Windows Server — Active Directory R202',
      icon: <Monitor size={24} />, title: 'Windows Server', vulgaTagline: "L'annuaire d'entreprise", specs: ['R202', 'AC11.04'] },
    { src: `${BASE}assets/documents/apprentissage/sae102/livrable_tp3_Briac_lemeillat/dhcp-verif.png`,
      caption: 'DHCP — vérification des baux',
      icon: <Key size={24} />, title: 'Serveur DHCP', vulgaTagline: "Le réceptionniste d'hôtel", specs: ['R202', 'AC11.04'],
      docPath: 'assets/documents/apprentissage/sae102/livrable_tp3_Briac_lemeillat/compte-rendu.md' },
    { src: `${BASE}assets/documents/apprentissage/sae102/livrable_tp3_Briac_lemeillat/dns-conf.png`,
      caption: 'DNS — configuration de zone',
      icon: <BookOpen size={24} />, title: 'Zone DNS', vulgaTagline: "L'annuaire mondial", specs: ['R202', 'AC11.04'],
      docPath: 'assets/documents/apprentissage/sae102/livrable_tp3_Briac_lemeillat/compte-rendu.md' },
    { src: `${BASE}assets/projects/tp-dhcp-tftp-bootp-pxe-visu.png`,
      caption: 'PXE Boot — installation réseau R203',
      icon: <Server size={24} />, title: 'Boot PXE', vulgaTagline: "L'ordinateur qui démarre du réseau", specs: ['R203', 'AC11.06'],
      docPath: 'assets/documents/apprentissage/bases-services-reseaux/tp-dhcp-tftp-pxe.md' },
    { src: `${BASE}assets/documents/apprentissage/sae102/livrable_briac/SHEMA.png`,
      caption: 'Schéma infrastructure PME — SAÉ 1.02',
      docPath: 'assets/documents/apprentissage/sae102/sae102.md' },
    { src: `${BASE}assets/documents/apprentissage/sae102/livrable_sae12FINALE/images/ssh.png`,
      caption: 'SSH — accès sécurisé au switch',
      docPath: 'assets/documents/apprentissage/sae102/livrable_sae12FINALE/compte-rendu.md' },
];

const CAROUSEL_CONNECTER: CarouselImage[] = [
    { src: `${BASE}assets/projects/image-illustration-ltspice.png`,
      caption: 'LTSpice — analyse de signaux SAÉ 103',
      icon: <Zap size={24} />, title: 'LTSpice · Signaux', vulgaTagline: 'La forme des ondes', specs: ['R105', 'AC12.01', 'SAÉ 103'] },
    { src: `${BASE}assets/projects/Wireshark-Marquer-des-paquets-dans-une-capture.jpg.webp`,
      caption: 'Wireshark — analyse de trames en temps réel',
      icon: <Search size={24} />, title: 'Wireshark', vulgaTagline: 'Voir l\'invisible', specs: ['R101', 'AC11.02'] },
    { src: `${BASE}assets/projects/tp-filtrage-linux-visu.png`,
      caption: 'iptables / nftables — filtrage Linux',
      icon: <ShieldCheck size={24} />, title: 'Pare-feu Linux', vulgaTagline: 'Le videur intraitable', specs: ['R201', 'AC11.04'],
      docPath: 'assets/documents/apprentissage/tech-internet/tp9-filtrage-linux.md' },
    { src: `${BASE}assets/projects/tp-natpat-visu.png`,
      caption: 'NAT/PAT — passerelle Linux',
      docPath: 'assets/documents/apprentissage/tech-internet/tp8-NAT.md' },
    { src: `${BASE}assets/projects/lan-visu.webp`,
      caption: 'HomeLab — câblage physique personnel',
      icon: <Network size={24} />, title: 'HomeLab', vulgaTagline: 'Un vrai réseau dans ma chambre', specs: ['AC12.03'] },
    { src: `${BASE}assets/documents/apprentissage/sae102/livrable_sae12FINALE/images/ping.png`,
      caption: 'Test de connectivité ICMP',
      docPath: 'assets/documents/apprentissage/sae102/livrable_sae12FINALE/compte-rendu.md' },
    { src: `${BASE}assets/documents/apprentissage/sae102/livrable_sae12FINALE/images/pingintervlan.jpg`,
      caption: 'Routage inter-VLAN — R103',
      docPath: 'assets/documents/apprentissage/admin-reseau/vlan-router/tp2.md' },
];

const CAROUSEL_PROGRAMMER: CarouselImage[] = [
    { src: `${BASE}assets/projects/notgoogle-visu.png`,
      caption: 'notgoogle — sockets TCP bruts',
      icon: <Search size={24} />, title: 'notgoogle', vulgaTagline: 'Recoder le web de zéro', specs: ['Python', 'AC13.02'] },
    { src: `${BASE}assets/projects/briac_website.png`,
      caption: 'Portfolio — SAÉ 104',
      icon: <Globe size={24} />, title: 'Portfolio Web', vulgaTagline: 'Architecture HTML/CSS/JS', specs: ['SAÉ 104', 'AC13.04'] },
    { src: `${BASE}assets/projects/minigpt-hero.png`,
      caption: 'MiniGPT — plateforme IA (SAÉ 2.3)',
      icon: <Package size={24} />, title: 'MiniGPT', vulgaTagline: 'Stack web complète', specs: ['Docker', 'AC13.01', 'SAÉ 2.3'] },
    { src: `${BASE}assets/projects/tp3-flask-visuel.png`,
      caption: 'Flask backend — R209',
      docPath: 'assets/documents/apprentissage/dev-web/tp3/tp-flask-3.md' },
    { src: `${BASE}assets/projects/cheat-sheet-postgresql-visu.png`,
      caption: 'PostgreSQL — R207',
      docPath: 'assets/documents/apprentissage/r207-source_donnees/cheet-sheet.md' },
    { src: `${BASE}assets/documents/apprentissage/r207-source_donnees/acteurs-table.png`,
      caption: 'Tables relationnelles — SAÉ 15',
      icon: <Database size={24} />, title: 'SAÉ 15 · Données', vulgaTagline: 'Nettoyer, structurer, requêter', specs: ['R207', 'AC13.05', 'SAÉ 15'],
      docPath: 'assets/documents/apprentissage/r207-source_donnees/cheet-sheet.md' },
    { src: `${BASE}assets/documents/apprentissage/dev-web/tp2/auth-token-security-validated.png`,
      caption: 'Auth JWT — sécurisation API' },
    { src: `${BASE}assets/projects/sae13-visu.png`,
      caption: 'SAÉ 1.3 — algorithme Python',
      icon: <FileText size={24} />, title: 'SAÉ 1.3', vulgaTagline: 'Traduire la logique en code', specs: ['Python', 'AC13.03', 'SAÉ 1.3'] },
];

// ─── Specs Drawer — Types & Données ──────────────────────────────────────────

type ACSpecsKey = 'quoi' | 'pourquoi' | 'comment' | 'difficultes' | 'appris' | 'autrement';

interface ACSpecsEntry {
    titre: string;
    quoi: string;
    pourquoi: string;
    comment: string;
    difficultes: string;
    appris: string;
    autrement: string;
}

const SPECS_QUESTIONS: { key: ACSpecsKey; label: string }[] = [
    { key: 'quoi',        label: 'Ce que j\'ai fait' },
    { key: 'pourquoi',    label: 'Pourquoi' },
    { key: 'comment',     label: 'Comment' },
    { key: 'difficultes', label: 'Difficultés' },
    { key: 'appris',      label: 'Ce que j\'en ai appris' },
    { key: 'autrement',   label: 'Ce que je ferais autrement' },
];

const SPECS_DATA: Record<string, ACSpecsEntry> = {
    // ── Administrer ──
    'AC11.01': {
        titre: 'Électricité en régime variable (R105, SAÉ 103)',
        quoi: 'Simulation de circuits électroniques avec LTSpice pour analyser les signaux en régime alternatif et étude du câble coaxial (SAÉ 103).',
        pourquoi: 'Comprendre la physique du signal explique pourquoi un câble trop long atténue le débit — tout standard réseau a des contraintes physiques.',
        comment: 'LTSpice, diagrammes de Bode, cours R105, travaux SAÉ 103 sur le câble coaxial.',
        difficultes: 'La lecture des déphasages et l\'abstraction mathématique des filtres passe-bas/passe-haut.',
        appris: 'Tout standard réseau (Cat5e, fibre) est défini par des contraintes physiques imposées au câble.',
        autrement: 'Corréler plus tôt les formules théoriques avec des mesures réelles sur câble physique.',
    },
    'AC11.02': {
        titre: 'Architecture et fondements des systèmes numériques (R101, R102)',
        quoi: 'Analyse de trames Ethernet en hexadécimal et binaire avec Wireshark, compréhension de l\'encapsulation des protocoles couche par couche.',
        pourquoi: 'Comprendre comment les données transitent sous forme de bits permet de diagnostiquer n\'importe quel problème réseau à l\'origine.',
        comment: 'Wireshark, captures réseau en cours de TP, cours R101 et R102.',
        difficultes: 'Lire une trame brute en hex demande de comprendre simultanément plusieurs couches du modèle OSI.',
        appris: 'Un paquet réseau est une succession de couches imbriquées — chaque en-tête raconte une étape du voyage.',
        autrement: 'Développer un outil de visualisation de trames plus tôt pour rendre les captures immédiatement lisibles.',
    },
    'AC11.03': {
        titre: 'Configurer les fonctions de base du réseau local (R103, SAÉ 1.02)',
        quoi: 'Déploiement d\'une infrastructure PME complète avec VLANs, Trunk 802.1Q, routage inter-VLAN et SSH sécurisé sur commutateurs Cisco.',
        pourquoi: 'Segmenter un réseau isole les flux, renforce la sécurité et évite qu\'une diffusion de broadcast paralyse l\'ensemble.',
        comment: 'Cisco IOS, Packet Tracer, TPs R103 (TP1 VLANs, TP2 routage), livrable SAÉ 1.02.',
        difficultes: 'La configuration des interfaces Trunk et la résolution des problèmes de connectivité inter-VLAN (route manquante côté routeur).',
        appris: 'Un réseau local bien segmenté est la fondation de toute infrastructure d\'entreprise — impossible à improviser après coup.',
        autrement: 'Dessiner le schéma complet avec les VLAN IDs et les IP avant de toucher la CLI Cisco.',
    },
    'AC11.04': {
        titre: 'Rôles et principes fondamentaux des systèmes d\'exploitation (R202)',
        quoi: 'Configuration de Windows Server avec Active Directory, intégration de postes clients au domaine et gestion des GPO.',
        pourquoi: 'Gérer 50 machines individuellement est impossible — AD centralise l\'identité, les droits et les politiques de l\'organisation.',
        comment: 'VirtualBox, Windows Server 2016, ADUC, éditeur de stratégie de groupe (GPO).',
        difficultes: 'La jonction de domaine échoue silencieusement si le DNS n\'est pas dirigé vers le contrôleur de domaine.',
        appris: 'Un domaine Active Directory est un point de contrôle centralisé pour toute l\'identité d\'une organisation.',
        autrement: 'Documenter chaque étape dans un runbook dès le départ pour pouvoir reproduire l\'installation à l\'identique.',
    },
    'AC11.05': {
        titre: 'Identifier les dysfonctionnements du réseau local (R103, SAÉ 1.02)',
        quoi: 'Diagnostic et résolution de boucles réseau via le Spanning Tree Protocol (STP) et configuration de l\'EtherChannel pour l\'agrégation de liens.',
        pourquoi: 'Une boucle réseau non détectée provoque une tempête de broadcast qui paralyse l\'ensemble du réseau en quelques secondes.',
        comment: 'TPs R103, commutateurs Cisco, commandes show spanning-tree, debug et analyse des ports bloqués.',
        difficultes: 'Identifier quelle interface bloquait le trafic et comprendre le processus d\'élection du pont racine.',
        appris: 'STP est le mécanisme de protection silencieux qu\'active tout switch par défaut — et qu\'il faut savoir lire pour diagnostiquer.',
        autrement: 'Provoquer intentionnellement une boucle en TP pour observer la convergence STP en temps réel.',
    },
    'AC11.06': {
        titre: 'Installer un poste client et expliquer la procédure (R202, R203)',
        quoi: 'Intégration de postes Windows 10 au domaine Active Directory et déploiement réseau automatisé via boot PXE (DHCP + TFTP).',
        pourquoi: 'Dans une entreprise, on ne configure pas chaque machine manuellement — l\'automatisation du déploiement est une nécessité.',
        comment: 'Windows Server, options DHCP pour PXE, serveur TFTP, boot réseau sans disque local.',
        difficultes: 'La chaîne DHCP → TFTP → NFS doit être parfaitement synchronisée — une option mal configurée et aucun poste ne boot.',
        appris: 'Le déploiement automatisé de masse est la base de toute infrastructure IT professionnelle à l\'échelle.',
        autrement: 'Préparer une image de déploiement pré-configurée (avec les drivers) pour réduire les interventions post-install.',
    },

    // ── Connecter ──
    'AC12.01': {
        titre: 'Mesurer, analyser et commenter les signaux (R105, R205, SAÉ 103)',
        quoi: 'Analyse de signaux électriques avec MATLAB et LTSpice, étude des propriétés du câble coaxial en SAÉ 103.',
        pourquoi: 'Mesurer un signal permet de détecter une dégradation de la transmission avant qu\'elle n\'affecte le service réseau.',
        comment: 'MATLAB pour les simulations fréquentielles, LTSpice pour les circuits, fiches R205, oscilloscope virtuel.',
        difficultes: 'Comprendre la transformée de Fourier et son lien avec les fréquences transportées par un câble réseau.',
        appris: 'La qualité d\'une liaison physique dépend entièrement des propriétés du signal qui la traverse — le débit est une conséquence physique.',
        autrement: 'Corréler les mesures théoriques avec des mesures réelles sur câble pour valider les modèles mathématiques.',
    },
    'AC12.02': {
        titre: 'Caractériser des systèmes de transmissions élémentaires (R205)',
        quoi: 'Étude des modèles de transmission (filtres, atténuation, bande passante) via les fiches de révision R205 et calculs de Parseval et Bode.',
        pourquoi: 'Caractériser une transmission permet de choisir le bon support physique selon les contraintes de débit et de distance.',
        comment: 'Fiches de synthèse R205, calculs de Parseval, diagrammes de Bode, cours de mathématiques des télécoms.',
        difficultes: 'L\'abstraction mathématique des modèles en régime sinusoïdal et leur traduction en termes pratiques réseau.',
        appris: 'Chaque support physique a un comportement fréquentiel propre qui définit ses limites d\'utilisation.',
        autrement: 'Construire un tableau comparatif des standards (Cat5e, fibre, coaxial) pour visualiser directement les différences.',
    },
    'AC12.03': {
        titre: 'Déployer des supports de transmission (HomeLab)',
        quoi: 'Câblage physique d\'un réseau LAN personnel : switch, routeur, Raspberry Pi et PC interconnectés avec câbles RJ45 crimpés.',
        pourquoi: 'Pratiquer sur du matériel réel est la seule façon de comprendre les contraintes physiques — un simulateur ne câble pas.',
        comment: 'Câbles RJ45 crimpés, switch Netgear, routeur, rack DIY, outillage réseau.',
        difficultes: 'Gérer les longueurs de câble, prévenir les interférences et maintenir un câblage organisé et démêlable.',
        appris: 'Un réseau physique est aussi fragile que son câblage le moins soigné — chaque connexion imparfaite dégrade le tout.',
        autrement: 'Labelliser tous les câbles dès le départ pour faciliter le dépannage lors des pannes.',
    },
    'AC12.04': {
        titre: 'Connecter les systèmes de ToIP (R204)',
        quoi: 'Configuration d\'un serveur Asterisk avec IVR, messagerie vocale, extensions SIP et interconnexion de deux sites via Trunk SIP.',
        pourquoi: 'La téléphonie sur IP permet de faire passer la voix d\'entreprise sur le même réseau que les données, sans infrastructure dédiée.',
        comment: 'Asterisk, fichiers de configuration SIP/PJSIP, dialplan, TP R204, interconnexion inter-sites.',
        difficultes: 'La syntaxe du dialplan Asterisk est dense — un mauvais contexte empêche silencieusement tout appel d\'aboutir.',
        appris: 'La voix n\'est qu\'un flux de données soumis aux mêmes contraintes réseau — la différence, c\'est l\'exigence temps-réel.',
        autrement: 'Tester les règles de dialplan dans un environnement de staging avant tout déploiement sur le serveur de production.',
    },
    'AC12.05': {
        titre: 'Communiquer avec un tiers et adapter son discours (Bibles Réseaux)',
        quoi: 'Rédaction de deux Bibles Réseaux : synthèses techniques vulgarisées avec analogies (DHCP = réceptionniste d\'hôtel, NAT = boîte postale partagée).',
        pourquoi: 'Savoir faire une chose ne suffit pas — savoir l\'expliquer est la preuve qu\'on l\'a vraiment comprise, et c\'est indispensable en contexte professionnel.',
        comment: 'Markdown, analogies du quotidien, structure progressive du concept simple vers le détail technique.',
        difficultes: 'Trouver l\'analogie juste qui ne trahit pas la réalité technique tout en restant accessible à un non-technicien.',
        appris: 'Enseigner est la meilleure façon d\'apprendre — rédiger une Bible m\'a révélé mes propres zones d\'ombre.',
        autrement: 'Faire relire les Bibles par un étudiant d\'une autre filière pour valider l\'accessibilité avant de les publier.',
    },

    // ── Programmer ──
    'AC13.01': {
        titre: 'Utiliser un système informatique et ses outils (R209, SAÉ 2.3)',
        quoi: 'Déploiement de MiniGPT : plateforme IA complète avec Docker Compose, backend Flask (R209), base MySQL et interface web.',
        pourquoi: 'Maîtriser un environnement de développement complet — conteneurs, API, base de données, frontend — est la norme en entreprise.',
        comment: 'Docker Compose, Flask, MySQL, HTML/CSS, terminal Linux, virtualenv Python.',
        difficultes: 'Faire communiquer les conteneurs Docker entre eux et gérer les variables d\'environnement sans les exposer.',
        appris: 'Un environnement containerisé garantit la reproductibilité — "ça marche sur ma machine" n\'est plus une excuse.',
        autrement: 'Ajouter des tests automatisés dès le début pour détecter les régressions lors des mises à jour de l\'API.',
    },
    'AC13.02': {
        titre: 'Lire, exécuter, corriger et modifier un programme (Python, TCP/IP)',
        quoi: 'Création de notgoogle : moteur de recherche web construit sur des sockets TCP bruts en Python, sans aucune bibliothèque HTTP.',
        pourquoi: 'Recoder un protocole depuis zéro oblige à comprendre chaque octet échangé — aucune bibliothèque ne peut cacher cette complexité.',
        comment: 'Python natif, sockets TCP, parsing HTML manuel, algorithme de scoring par mots-clés.',
        difficultes: 'Gérer la persistance des connexions HTTP/1.1 et parser le HTML sans bibliothèque dédiée (BeautifulSoup interdit).',
        appris: 'HTTP est juste du texte structuré sur un socket — une fois qu\'on l\'a compris ligne par ligne, tout le web devient lisible.',
        autrement: 'Implémenter le support HTTPS (TLS) dès le départ pour pouvoir crawler les sites modernes.',
    },
    'AC13.03': {
        titre: 'Traduire un algorithme dans un langage et pour un environnement donné (Python, SAÉ 1.3)',
        quoi: 'Implémentation d\'algorithmes en Python : scraper de cinéma, générateur CLI de documentation, et travaux SAÉ 1.3.',
        pourquoi: 'Passer d\'une logique abstraite (pseudocode) à du code fonctionnel dans un environnement donné est le cœur du travail de développeur.',
        comment: 'Python, scripts CLI, SAÉ 1.3, projets personnels d\'automatisation.',
        difficultes: 'Gérer les cas limites et les erreurs d\'entrée utilisateur dans les scripts CLI sans crasher.',
        appris: 'Un algorithme bien pensé avant le code prend deux fois moins de temps à déboguer qu\'un algorithme improvisé.',
        autrement: 'Pseudocoder systématiquement avant d\'écrire la première ligne, et tester chaque branche logique séparément.',
    },
    'AC13.04': {
        titre: 'Connaître l\'architecture et les technologies d\'un site Web (SAÉ 104)',
        quoi: 'Création from scratch du portfolio en HTML/CSS/JavaScript/Bootstrap (SAÉ 104), puis refonte complète en React/TypeScript/Tailwind.',
        pourquoi: 'Comprendre les fondamentaux (DOM, CSS box model, requêtes HTTP) avant d\'utiliser un framework évite de construire sur du sable.',
        comment: 'HTML5, CSS3, JavaScript ES6, Bootstrap, puis React + Vite + Tailwind CSS + Framer Motion.',
        difficultes: 'La transition d\'un site statique vers une SPA React avec routage, état global et animations — une refonte totale de la logique.',
        appris: 'Un framework amplifie les problèmes de conception existants — si la base n\'est pas solide, rien ne l\'est.',
        autrement: 'Commencer directement par React/TypeScript pour éviter la migration pénible depuis le HTML statique.',
    },
    'AC13.05': {
        titre: 'Choisir les mécanismes de gestion de données adaptés (R207, SAÉ 15)',
        quoi: 'Nettoyage et requêtage de jeux de données CSV/JSON massifs en Python (SAÉ 15) et administration de bases PostgreSQL (R207) et MySQL (MiniGPT).',
        pourquoi: 'Les données brutes sont inutilisables telles quelles — les structurer, les nettoyer et les requêter est la compétence centrale du backend.',
        comment: 'Python (csv, json, pandas), PostgreSQL, SQL avancé (jointures, agrégats), MySQL pour MiniGPT.',
        difficultes: 'La normalisation de données hétérogènes provenant de sources différentes avec des encodages et des formats inconsistants.',
        appris: 'La qualité d\'une analyse ou d\'une application dépend entièrement de la qualité du nettoyage des données en amont.',
        autrement: 'Automatiser le pipeline de nettoyage (ETL) dès le départ plutôt que de le refaire manuellement à chaque itération.',
    },
    'AC13.06': {
        titre: 'S\'intégrer dans un environnement de développement collaboratif (Git, GitHub)',
        quoi: 'Versionner tous les projets sur GitHub : portfolio, notgoogle, MiniGPT et le référentiel personnel lyrae-shared.',
        pourquoi: 'Sans contrôle de version, tout développement sur la durée — en solo ou en équipe — devient un chaos ingérable.',
        comment: 'Git (commits, branches, merge), GitHub pour l\'hébergement, les releases et la publication des pages statiques.',
        difficultes: 'Comprendre le modèle de branches et gérer proprement les conflits de merge lors de développements parallèles.',
        appris: 'Un bon historique Git est une documentation vivante — chaque commit raconte l\'évolution et les intentions du projet.',
        autrement: 'Adopter une convention de nommage des commits (Conventional Commits) dès le premier projet pour garder un historique lisible.',
    },
};

// ─── ReaderModal ─────────────────────────────────────────────────────────────

function ReaderModal({ proof, onClose }: { proof: Proof; onClose: () => void }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <motion.div
            className="fixed inset-0 z-[300] bg-slate-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
        >
            <div className="fixed top-8 right-8 z-[400]">
                <button
                    onClick={onClose}
                    className="rounded-full bg-white/80 hover:bg-white backdrop-blur-xl w-14 h-14 border border-black/5 shadow-xl transition-all hover:scale-105 flex items-center justify-center"
                >
                    <X size={22} strokeWidth={1.5} />
                </button>
            </div>
            <div className="max-w-4xl mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, ease: EASE }}
                    className="bg-white border border-slate-100 rounded-[3rem] shadow-xl overflow-hidden"
                >
                    <div className="p-10 md:p-20">
                        <ExPage embedded={true} file={proof.path} title={proof.title} />
                        <div className="mt-20 pt-10 border-t border-slate-100 flex justify-center">
                            <button
                                onClick={onClose}
                                className="font-bold rounded-2xl px-14 h-14 bg-zinc-900 text-white hover:bg-zinc-800 transition-all hover:scale-[1.02]"
                            >
                                Terminer la lecture
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

// ─── AcSpecsDrawer ────────────────────────────────────────────────────────────

function AcSpecsDrawer({ isOpen, onClose, comp, acs }: {
    isOpen: boolean;
    onClose: () => void;
    comp: CompetenceDef;
    acs: ACEntry[];
}) {
    const [selectedAC, setSelectedAC] = useState<string>('');

    useEffect(() => {
        if (isOpen) setSelectedAC(acs[0]?.code ?? '');
    }, [isOpen, acs]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    const specs = SPECS_DATA[selectedAC];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-[200]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[201] bg-black/90 backdrop-blur-xl border-t border-white/10 rounded-t-3xl overflow-hidden flex flex-col"
                        style={{ maxHeight: '75vh' }}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 32, stiffness: 340 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-white/[0.07] flex-shrink-0">
                            <div>
                                <p className="font-mono text-[8px] uppercase tracking-[0.5em] mb-1"
                                    style={{ color: comp.accentColor, opacity: 0.55 }}>
                                    {comp.acte} · Exigences SAÉ Portfolio
                                </p>
                                <p className="font-['Paris2024'] text-white text-lg tracking-wide">{comp.label}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-white transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Nav gauche */}
                            <div className="w-56 flex-shrink-0 border-r border-white/[0.07] overflow-y-auto py-3"
                                style={{ scrollbarWidth: 'none' } as React.CSSProperties}>
                                {acs.map(ac => (
                                    <button
                                        key={ac.code}
                                        onClick={() => setSelectedAC(ac.code)}
                                        className={`w-full text-left px-5 py-3 transition-colors ${selectedAC === ac.code ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'}`}
                                    >
                                        <p className="font-mono text-[8px] uppercase tracking-[0.2em] mb-1"
                                            style={{ color: comp.accentColor, opacity: selectedAC === ac.code ? 0.9 : 0.3 }}>
                                            {ac.code}
                                        </p>
                                        <p className={`text-[10px] leading-snug ${selectedAC === ac.code ? 'text-white' : 'text-white'}`}>
                                            {ac.title}
                                        </p>
                                    </button>
                                ))}
                            </div>

                            {/* Contenu droite */}
                            <div className="flex-1 overflow-y-auto px-8 py-6"
                                style={{ scrollbarWidth: 'none' } as React.CSSProperties}>
                                {specs ? (
                                    <>
                                        <p className="font-mono text-[8px] uppercase tracking-[0.35em] mb-5"
                                            style={{ color: comp.accentColor, opacity: 0.4 }}>
                                            {specs.titre}
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {SPECS_QUESTIONS.map(({ key, label }) => (
                                                <div key={key} className="p-4 rounded-2xl border space-y-2"
                                                    style={{
                                                        backgroundColor: `rgba(${comp.accentColorRgb}, 0.04)`,
                                                        borderColor: `rgba(${comp.accentColorRgb}, 0.1)`,
                                                    }}>
                                                    <p className="font-bold text-[10px] uppercase tracking-[0.25em] text-white">{label}</p>
                                                    <p className="font-light text-sm text-white leading-relaxed">{specs[key]}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                                        <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-white">Données à venir</p>
                                        <p className="font-mono text-[10px] text-white">{selectedAC}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─── CompetenceCard ───────────────────────────────────────────────────────────

function CompetenceCard({ comp, isActive, onOpenSpecs }: { comp: CompetenceDef; isActive: boolean; onOpenSpecs?: () => void }) {
    return (
        <section
            className="relative w-full h-screen bg-black flex flex-col items-center justify-center"
            style={{ scrollSnapAlign: 'start' }}
        >
            <div className="pointer-events-none absolute inset-0" style={{
                background: `radial-gradient(ellipse at 50% 55%, ${comp.auraColor} 0%, transparent 65%)`,
                filter: 'blur(60px)',
            }} />

            <motion.div
                className="relative flex flex-col items-center gap-8"
                initial={{ opacity: 0, y: 30 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.2, duration: 0.9, ease: EASE }}
            >
                {/* Card */}
                <div className="relative overflow-hidden" style={{
                    width: 'clamp(280px, 38vw, 420px)',
                    height: 'clamp(280px, 38vw, 420px)',
                    borderRadius: '3rem',
                    backgroundColor: '#0a0a0a',
                    border: '1px solid rgba(63,63,70,0.85)',
                    boxShadow: `inset 0 1px 1px rgba(255,255,255,0.07), 0 40px 90px rgba(0,0,0,0.65)`,
                }}>
                    <div aria-hidden className={`absolute ${comp.shimmerClass} pointer-events-none`} style={{
                        top: '50%', left: '50%', width: '200%', height: '200%',
                        background: comp.shimmerGradient, zIndex: 1,
                    }} />
                    <div aria-hidden className="absolute pointer-events-none" style={{
                        inset: '1px', borderRadius: 'calc(3rem - 1px)', backgroundColor: '#0a0a0a', zIndex: 2,
                    }} />
                    <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
                        zIndex: 3, width: '55%', height: '1px',
                        background: `linear-gradient(to right, transparent, rgba(${comp.accentColorRgb}, 0.4), transparent)`,
                    }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10 px-8 text-center">
                        <p className="font-mono text-[9px] uppercase tracking-[0.45em] opacity-55" style={{ color: comp.accentColor }}>
                            {comp.label}
                        </p>
                        <div style={{ color: comp.accentColor, opacity: 0.9 }}>{comp.icon}</div>
                        <div className="space-y-2">
                            <p className="font-['Paris2024'] font-normal uppercase tracking-widest leading-tight"
                                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.7rem)', color: comp.accentColor }}>
                                {comp.title.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
                                ))}
                            </p>
                        </div>
                        <div style={{ width: '3rem', height: '0.5px', background: `rgba(${comp.accentColorRgb}, 0.3)` }} />
                        <p className="font-mono text-[8px] uppercase tracking-[0.3em] opacity-50" style={{ color: comp.accentColor }}>
                            {comp.referentiel}
                        </p>
                    </div>
                </div>

                {/* Tagline + bouton */}
                <motion.div
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, y: 12 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
                >
                    <p className="font-['Paris2024'] italic text-lg tracking-wide" style={{
                        background: `linear-gradient(to right, #ffffff, ${comp.accentColor})`,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                        {comp.tagline}
                    </p>
                    <button
                        onClick={onOpenSpecs}
                        className="font-mono text-[8px] uppercase tracking-[0.3em] border rounded-full px-5 py-2 transition-all duration-200"
                        style={{ borderColor: `rgba(${comp.accentColorRgb}, 0.25)`, color: `rgba(${comp.accentColorRgb}, 0.5)` }}
                        onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = `rgba(${comp.accentColorRgb}, 0.6)`; b.style.color = `rgba(${comp.accentColorRgb}, 0.95)`; }}
                        onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = `rgba(${comp.accentColorRgb}, 0.25)`; b.style.color = `rgba(${comp.accentColorRgb}, 0.5)`; }}
                    >
                        AC · Référentiel ↓
                    </button>
                </motion.div>
            </motion.div>

            <motion.p className="absolute bottom-10 font-mono text-[7.5px] uppercase tracking-[0.45em]"
                style={{ color: `rgba(${comp.accentColorRgb}, 0.25)` }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.4, duration: 0.7 }}
            >
                ↓ travaux
            </motion.p>
        </section>
    );
}


// ─── PersonalProjectCard ──────────────────────────────────────────────────────

function PersonalProjectCard({ card, color, colorRgb }: { card: PersonalCard; color: string; colorRgb: string }) {
    return (
        <motion.div
            onClick={card.link ? () => window.open(card.link!, '_blank', 'noopener') : undefined}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${card.link ? 'cursor-pointer' : ''}`}
            style={{ borderColor: `rgba(${colorRgb}, 0.2)`, backgroundColor: `rgba(${colorRgb}, 0.05)` }}
            whileHover={card.link ? { x: 3 } : {}}
            transition={{ duration: 0.2 }}
        >
            {card.image ? (
                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden">
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `rgba(${colorRgb}, 0.12)` }}>
                    <span className="text-[8px] font-['Paris2024'] uppercase tracking-wider" style={{ color }}>
                        {card.title.slice(0, 2).toUpperCase()}
                    </span>
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{card.subtitle}</p>
                <p className="text-[9px] font-mono text-white mt-0.5 uppercase tracking-[0.2em]">
                    {card.link ? 'Personnel →' : 'Home Lab'}
                </p>
            </div>
            {card.link && <ExternalLink size={11} className="flex-shrink-0 text-white" />}
        </motion.div>
    );
}

// ─── CompetenceCarousel ───────────────────────────────────────────────────────

function CompetenceCarousel({ images, comp, credits, isActive, onOpenReader }: {
    images: CarouselImage[];
    comp: CompetenceDef;
    credits: CreditsEntry[];
    isActive: boolean;
    onOpenReader?: (img: CarouselImage) => void;
}) {
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            const atEnd   = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
            const atStart = el.scrollLeft <= 8;
            if (e.deltaY > 0 && atEnd)   return;
            if (e.deltaY < 0 && atStart) return;
            e.preventDefault();
            el.scrollBy({ left: e.deltaY * 1.4, behavior: 'smooth' });
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    return (
        <section className="relative w-full h-screen bg-black overflow-hidden" style={{ scrollSnapAlign: 'start' }}>
            <div className="pointer-events-none absolute inset-0" style={{
                background: `radial-gradient(ellipse at 20% 50%, rgba(${comp.accentColorRgb}, 0.09) 0%, transparent 62%)`,
            }} />

            <div className="relative z-10 flex flex-col h-full px-6 lg:px-16 py-12 gap-4 justify-center">

                {/* Badge acte */}
                <motion.p className="text-[9px] font-mono uppercase tracking-[0.6em] flex-shrink-0"
                    style={{ color: comp.accentColor, opacity: 0.7 }}
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 0.7 } : { opacity: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    {comp.acte} · {comp.label}
                </motion.p>

                {/* Carrousel */}
                <div ref={carouselRef}
                    className="flex gap-5 overflow-x-auto pb-2 flex-shrink-0"
                    style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                >
                    {images.map((img, i) => {
                        const enhanced = !!(img.icon || img.vulgaTagline || img.specs?.length);
                        const hasDoc = !!img.docPath;
                        const handleClick = hasDoc ? () => onOpenReader?.(img) : undefined;
                        return (
                            <motion.div key={i} className="flex-shrink-0 w-[305px]"
                                style={{ scrollSnapAlign: 'start' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: EASE }}
                            >
                                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.22 }}>
                                    {enhanced ? (
                                        <div
                                            className={`w-full h-[210px] rounded-2xl overflow-hidden relative bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors ${hasDoc ? 'cursor-pointer' : ''}`}
                                            onClick={handleClick}
                                        >
                                            <img src={img.src} alt={img.caption}
                                                className="w-full h-full object-cover transition-transform duration-500"
                                                loading="lazy" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                            {img.icon && (
                                                <div className="absolute top-3 left-3 text-white">{img.icon}</div>
                                            )}
                                            {hasDoc && (
                                                <div className="absolute top-3 right-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white bg-white/10 backdrop-blur-md border border-white/15 px-2 py-1 rounded-full">
                                                    Lire →
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
                                                <p className="text-sm font-medium text-white leading-tight">
                                                    {img.title ?? img.caption}
                                                </p>
                                                {img.vulgaTagline && (
                                                    <p className="text-xs italic text-white leading-snug">{img.vulgaTagline}</p>
                                                )}
                                                {img.specs && img.specs.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                        {img.specs.map(s => (
                                                            <span key={s} className="bg-white/10 backdrop-blur-md border border-white/10 text-white font-mono text-[10px] px-2 py-1 rounded-full uppercase">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={hasDoc ? 'cursor-pointer group' : ''} onClick={handleClick}>
                                            <div className="w-full h-[175px] rounded-2xl overflow-hidden mb-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors relative">
                                                <img src={img.src} alt={img.caption}
                                                    className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500"
                                                    loading="lazy" />
                                                {hasDoc && (
                                                    <div className="absolute top-3 right-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white bg-white/10 backdrop-blur-md border border-white/15 px-2 py-1 rounded-full">
                                                        Lire →
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[9px] font-mono tracking-[0.25em] uppercase leading-snug text-white">
                                                {img.caption}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                    <div className="flex-shrink-0 w-6" />
                </div>

                {/* Projet perso */}
                {comp.personalCard && (
                    <motion.div className="flex-shrink-0 w-fit"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ delay: 0.8, duration: 0.6, ease: EASE }}
                    >
                        <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white mb-2">Projet personnel</p>
                        <PersonalProjectCard card={comp.personalCard} color={comp.accentColor} colorRgb={comp.accentColorRgb} />
                    </motion.div>
                )}

                {/* Crédits TP & SAÉ */}
                {credits.length > 0 && (
                    <motion.div className="flex-shrink-0"
                        initial={{ opacity: 0 }}
                        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                    >
                        <div style={{ width: '100%', height: '1px', background: `rgba(${comp.accentColorRgb}, 0.08)`, marginBottom: '0.6rem' }} />
                        <p className="font-mono text-[7px] uppercase tracking-[0.45em] mb-2.5"
                            style={{ color: `rgba(${comp.accentColorRgb}, 0.25)` }}>
                            TP & SAÉ
                        </p>
                        <div className="flex gap-7 overflow-x-auto" style={{ scrollbarWidth: 'none' } as React.CSSProperties}>
                            {credits.map((c, i) => (
                                <div key={i} className="flex-shrink-0 flex items-baseline gap-2">
                                    <span className="font-mono text-[8px] uppercase tracking-[0.2em]"
                                        style={{ color: comp.accentColor, opacity: 0.45 }}>
                                        {c.ref}
                                    </span>
                                    <span className="text-[10px] text-white tracking-wide whitespace-nowrap">{c.title}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

// ─── Progress Dots ────────────────────────────────────────────────────────────

function ProgressDots({ current }: { current: number }) {
    const isDark = SLIDE_DARKS[current] ?? true;
    return (
        <div className="fixed right-5 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-[6px] items-center">
            {Array.from({ length: TOTAL }).map((_, i) => (
                <div key={i} className="rounded-full transition-all duration-500" style={{
                    width: '4px',
                    height: i === current ? '20px' : '4px',
                    backgroundColor: i === current
                        ? (isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)')
                        : (isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)'),
                }} />
            ))}
        </div>
    );
}

function ExitBtn({ current }: { current: number }) {
    const isDark = SLIDE_DARKS[current] ?? true;
    return (
        <Link to="/" className={`fixed top-6 left-6 z-[100] flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.35em] transition-all duration-300 group ${isDark ? 'text-white hover:text-white' : 'text-black/20 hover:text-black/60'}`}>
            <Home size={11} className="group-hover:scale-110 transition-transform" />
            Portfolio
        </Link>
    );
}

// ─── Sections fixes ───────────────────────────────────────────────────────────

function Section0({ isActive }: { isActive: boolean }) {
    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-center px-8" style={{ scrollSnapAlign: 'start' }}>
            <motion.p className="font-['Paris2024'] text-white tracking-wide"
                style={{ fontSize: 'clamp(1.2rem, 2.8vw, 2.4rem)', lineHeight: 1.25 }}
                initial={{ opacity: 0, y: 22 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                transition={{ delay: 0.3, duration: 1.0, ease: EASE }}
            >
                Il y a un an, je ne savais pas<br />ce qu'était un switch.
            </motion.p>
            <p className="font-['Paris2024'] text-white tracking-wide mt-10"
                style={{ fontSize: 'clamp(1.8rem, 4.5vw, 4.2rem)' }}
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 2.1, duration: 1.0 }}
                >
                    Aujourd'hui,{' '}
                </motion.span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 3.6, duration: 1.0 }}
                >
                    j'en configure un.
                </motion.span>
            </p>
            <motion.p className="absolute bottom-10 font-mono text-[7.5px] uppercase tracking-[0.55em] text-white"
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 5.5, duration: 0.8 }}
            >
                Soutenance BUT1 · Briac Le Meillat · ↓
            </motion.p>
        </section>
    );
}

const SEARCH_URL = 'https://briactimes.github.io/';

function Section1_Illusion({ isActive }: { isActive: boolean }) {
    const [charIdx, setCharIdx] = useState(0);
    const [typing, setTyping]   = useState(false);
    const [faded, setFaded]     = useState(false);

    useEffect(() => {
        if (!isActive) { setCharIdx(0); setTyping(false); setFaded(false); return; }
        const t = setTimeout(() => setTyping(true), 1300);
        return () => clearTimeout(t);
    }, [isActive]);

    useEffect(() => {
        if (!typing) return;
        if (charIdx >= SEARCH_URL.length) {
            const t = setTimeout(() => setFaded(true), 2000);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => setCharIdx(i => i + 1), 58);
        return () => clearTimeout(t);
    }, [typing, charIdx]);

    const isDone = charIdx >= SEARCH_URL.length;

    return (
        <section className="relative w-full h-screen overflow-hidden" style={{ scrollSnapAlign: 'start' }}>
            {/* Image du site — révélée quand l'overlay s'efface */}
            <img
                src={`${BASE}assets/projects/briactimes.png`}
                alt="briactimes.github.io"
                className="absolute inset-0 w-full h-full object-cover object-top"
            />

            {/* Overlay noir + barre de recherche — s'efface après la frappe */}
            <div
                className="absolute inset-0 bg-black flex items-center justify-center"
                style={{ opacity: faded ? 0 : 1, transition: 'opacity 1.2s ease' }}
            >
                <motion.div className="flex items-center gap-3 border border-blue-500/70 rounded-full px-10 py-4"
                    style={{ minWidth: 'clamp(320px, 58vw, 700px)', boxShadow: '0 0 28px rgba(59,130,246,0.15)' }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
                >
                    <span className="font-mono text-blue-400/50 text-sm select-none">⌕</span>
                    <span className="font-mono text-white tracking-wide" style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)' }}>
                        {SEARCH_URL.slice(0, charIdx)}
                        {!isDone && <span className="v2-cursor text-white">|</span>}
                    </span>
                </motion.div>
            </div>
        </section>
    );
}

function SpecPill({ label, delay = 0, isActive }: { label: string; delay?: number; isActive: boolean }) {
    return (
        <motion.span
            className="bg-white/8 border border-white/20 text-white font-mono text-[15px] px-4 py-1.5 rounded-full uppercase tracking-[0.25em]"
            initial={{ opacity: 0, y: 6 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ delay, duration: 0.5 }}
        >
            {label}
        </motion.span>
    );
}

function SectionMagie({ isActive }: { isActive: boolean }) {
    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-center px-8" style={{ scrollSnapAlign: 'start' }}>
            <motion.p className="font-['Paris2024'] text-white tracking-wide"
                style={{ fontSize: 'clamp(1.2rem, 2.8vw, 2.4rem)', lineHeight: 1.25 }}
                initial={{ opacity: 0, y: 22 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                transition={{ delay: 0.3, duration: 1.0, ease: EASE }}
            >
                Ce n'est pas de la magie.
            </motion.p>
            <motion.p className="font-['Paris2024'] text-white tracking-wide mt-10"
                style={{ fontSize: 'clamp(1.8rem, 4.5vw, 4.2rem)' }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 2.1, duration: 1.0 }}
            >
                C'est de l'ingénierie.
            </motion.p>
        </section>
    );
}

function SectionScrolly({ phase, isActive }: { phase: 1 | 2 | 3; isActive: boolean }) {
    const isNew = (p: number) => phase === p;
    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center gap-14" style={{ scrollSnapAlign: 'start' }}>

            {/* Titre phase 2+ */}
            <motion.div className="absolute text-center" style={{ top: '18%' }}
                initial={{ opacity: 0, y: 14 }}
                animate={isActive && phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ delay: isNew(2) ? 0.25 : 0, duration: isNew(2) ? 0.9 : 0, ease: EASE }}
            >
                <p className="font-['Paris2024'] text-white tracking-wide" style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3.4rem)' }}>
                    Les murs invisibles.
                </p>
                <p className="font-mono text-white text-[13px] uppercase tracking-[0.45em] mt-3">VLAN — Segmentation logique</p>
            </motion.div>


            {/* Diagramme réseau */}
            <div className="flex items-center relative" style={{ gap: 0 }}>
                <motion.div className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                    transition={{ delay: isNew(1) ? 0.35 : 0, duration: isNew(1) ? 0.65 : 0.01, ease: EASE }}
                >
                    <Monitor size={96} className="text-white" strokeWidth={1} />
                    <span className="font-mono text-[13px] text-white uppercase tracking-[0.3em]">PC-01</span>
                </motion.div>

                <motion.div className="h-px origin-left"
                    style={{ width: phase >= 2 ? 148 : 297, background: 'rgba(255,255,255,0.5)' }}
                    initial={{ scaleX: 0 }}
                    animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: isNew(1) ? 0.85 : 0, duration: isNew(1) ? 0.55 : 0.01, ease: 'easeOut' }}
                />

                {phase >= 2 && (
                    <motion.div className="flex flex-col items-center gap-3 relative mx-0"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                        transition={{ delay: isNew(2) ? 0.45 : 0, duration: isNew(2) ? 0.55 : 0.01, ease: 'backOut' }}
                    >
                        {phase >= 3 && (
                            <motion.div className="absolute flex flex-col items-center gap-1.5" style={{ top: -58 }}
                                initial={{ opacity: 0, y: 8 }}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                                transition={{ delay: isNew(3) ? 0.4 : 0, duration: isNew(3) ? 0.55 : 0.01 }}
                            >
                                <CheckCircle2 size={30} className="text-green-400" strokeWidth={1.5} />
                                <span className="font-mono text-[12px] text-white uppercase tracking-[0.2em]">STP</span>
                            </motion.div>
                        )}
                        <Server size={86} className="text-blue-400" strokeWidth={1} />
                        <span className="font-mono text-[13px] text-white uppercase tracking-[0.3em]">Switch</span>
                    </motion.div>
                )}

                <motion.div className="h-px origin-right"
                    style={{ width: phase >= 2 ? 148 : 297, background: 'rgba(255,255,255,0.5)' }}
                    initial={{ scaleX: phase >= 2 ? 0 : 1 }}
                    animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: isNew(2) ? 0.7 : isNew(1) ? 0.85 : 0, duration: isNew(2) ? 0.45 : isNew(1) ? 0.55 : 0.01, ease: 'easeOut' }}
                />

                <motion.div className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                    transition={{ delay: isNew(1) ? 0.55 : 0, duration: isNew(1) ? 0.65 : 0.01, ease: EASE }}
                >
                    <Monitor size={96} className="text-white" strokeWidth={1} />
                    <span className="font-mono text-[13px] text-white uppercase tracking-[0.3em]">PC-02</span>
                </motion.div>
            </div>

            {/* Callout 1 — top-left — câble / fondamentaux */}
            <motion.div className="absolute text-left" style={{ left: '4%', top: '13%' }}
                initial={{ opacity: 0 }}
                animate={isActive && phase === 1 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC11.01 · AC11.02</p>
                <p className="font-mono text-white text-[11px] mt-2">R101 · R102</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Bases communications · Systèmes numériques</p>
            </motion.div>

            {/* Callout 2 — bottom-right — switch / VLAN */}
            <motion.div className="absolute text-right" style={{ right: '4%', bottom: '15%' }}
                initial={{ opacity: 0 }}
                animate={isActive && phase === 2 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC11.03</p>
                <p className="font-mono text-white text-[11px] mt-2">R103 · SAÉ 1.02</p>
                <p className="font-mono text-white text-[10px] mt-0.5">VLAN · Segmentation logique</p>
            </motion.div>

            {/* Callout 3 — top-right — STP / EtherChannel */}
            <motion.div className="absolute text-right" style={{ right: '4%', top: '13%' }}
                initial={{ opacity: 0 }}
                animate={isActive && phase === 3 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC11.05</p>
                <p className="font-mono text-white text-[11px] mt-2">R103 · TP3</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Spanning Tree · EtherChannel</p>
            </motion.div>

            {/* Label bas */}
            <motion.p className="absolute font-mono text-[13px] uppercase tracking-[0.5em] text-white"
                style={{ bottom: '25%' }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: isNew(1) ? 1.5 : isNew(2) ? 1.2 : 1.0, duration: 0.6 }}
            >
                {phase === 1 && '2 ordinateurs · 1 câble'}
                {phase === 2 && 'Le Switch entre en scène'}
                {phase === 3 && 'Stabilisation · Anti-boucle STP'}
            </motion.p>
        </section>
    );
}

function SectionScrollyConnecter({ phase, isActive }: { phase: 1 | 2; isActive: boolean }) {
    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center gap-12" style={{ scrollSnapAlign: 'start' }}>
            <motion.div className="absolute text-center" style={{ top: '18%' }}
                initial={{ opacity: 0, y: 14 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ delay: 0.25, duration: 0.9, ease: EASE }}
            >
                <p className="font-['Paris2024'] text-white tracking-wide" style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3.4rem)' }}>
                    {phase === 1 ? 'Sortir de la ville.' : "Voir l'invisible."}
                </p>
                <p className="font-mono text-white text-[13px] uppercase tracking-[0.45em] mt-3">
                    {phase === 1 ? 'Routeur · Pare-feu Linux' : 'Wireshark · Signaux · R205'}
                </p>
            </motion.div>

            {phase === 1 && (
                <>
                    <div className="flex items-center" style={{ gap: 0 }}>
                        <motion.div className="flex flex-col items-center gap-4"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                            transition={{ delay: 0.3, duration: 0.65, ease: EASE }}
                        >
                            <Server size={72} className="text-blue-400" strokeWidth={1} />
                            <span className="font-mono text-[13px] text-white uppercase tracking-[0.3em]">Switch</span>
                        </motion.div>
                        <motion.div className="h-px origin-left" style={{ width: 130, background: 'rgba(255,255,255,0.5)' }}
                            initial={{ scaleX: 0 }} animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
                            transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }} />
                        <motion.div className="flex flex-col items-center gap-4 relative"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                            transition={{ delay: 0.9, duration: 0.55, ease: 'backOut' }}
                        >
                            <motion.div className="absolute flex flex-col items-center gap-1.5" style={{ top: -62, right: -52 }}
                                initial={{ opacity: 0, y: 8 }}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                                transition={{ delay: 1.3, duration: 0.55 }}
                            >
                                <Shield size={30} className="text-violet-400" strokeWidth={1.5} />
                                <span className="font-mono text-[12px] text-white uppercase tracking-[0.2em]">Firewall</span>
                            </motion.div>
                            <Router size={86} className="text-violet-400" strokeWidth={1} />
                            <span className="font-mono text-[13px] text-white uppercase tracking-[0.3em]">Routeur</span>
                        </motion.div>
                    </div>
                    <motion.p className="font-mono text-[13px] uppercase tracking-[0.5em] text-white"
                        initial={{ opacity: 0 }}
                        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1.6, duration: 0.6 }}
                    >
                        Le LAN rencontre le monde
                    </motion.p>
                </>
            )}

            {phase === 2 && (
                <div className="flex items-end gap-24">
                    {([
                        { icon: <Eye size={96} className="text-violet-400" strokeWidth={1} />, label: 'Wireshark' },
                        { icon: <Zap size={96} className="text-violet-400" strokeWidth={1} />, label: 'Signaux' },
                    ] as { icon: React.ReactNode; label: string }[]).map(({ icon, label }, i) => (
                        <motion.div key={label} className="flex flex-col items-center gap-4"
                            initial={{ opacity: 0, y: 24 }}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                            transition={{ delay: 0.3 + i * 0.2, duration: 0.7, ease: EASE }}
                        >
                            {icon}
                            <span className="font-mono text-[13px] text-white uppercase tracking-[0.3em]">{label}</span>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Callout gauche — phase 1 */}
            <motion.div className="absolute text-left" style={{ left: '4%', bottom: '24%' }}
                initial={{ opacity: 0 }}
                animate={isActive && phase === 1 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC12.03</p>
                <p className="font-mono text-white text-[11px] mt-2">R103 · R201</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Routage · Passerelle Linux</p>
            </motion.div>
            <motion.div className="absolute text-right" style={{ right: '4%', bottom: '12%' }}
                initial={{ opacity: 0 }}
                animate={isActive && phase === 1 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC12.01</p>
                <p className="font-mono text-white text-[11px] mt-2">R201 · TP9 Filtrage</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Iptables · NAT/PAT</p>
            </motion.div>

            {/* Callout gauche — phase 2 */}
            <motion.div className="absolute text-left" style={{ left: '4%', bottom: '24%' }}
                initial={{ opacity: 0 }}
                animate={isActive && phase === 2 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC12.01</p>
                <p className="font-mono text-white text-[11px] mt-2">R101 · R205</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Wireshark · Trames réseau</p>
            </motion.div>
            <motion.div className="absolute text-right" style={{ right: '4%', bottom: '12%' }}
                initial={{ opacity: 0 }}
                animate={isActive && phase === 2 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC12.02</p>
                <p className="font-mono text-white text-[11px] mt-2">R205 · SAÉ 103</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Signaux · Câble coaxial</p>
            </motion.div>

            {phase === 2 && (
                <motion.p className="absolute bottom-10 font-mono text-[13px] uppercase tracking-[0.5em] text-white"
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                >
                    Voir les données transiter
                </motion.p>
            )}
        </section>
    );
}

function SectionScrollyProgrammer({ phase, isActive }: { phase: 1 | 2; isActive: boolean }) {
    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center gap-8" style={{ scrollSnapAlign: 'start' }}>
            {phase === 1 ? (
                <motion.div className="flex flex-col items-center gap-4 cursor-pointer"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                    transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
                    onClick={() => window.open('https://briacl.github.io/notgoogle/', '_blank', 'noopener')}
                    whileHover={{ scale: 1.08 }}
                >
                    <Search size={96} className="text-cyan-400" strokeWidth={1} />
                </motion.div>
            ) : (
                <div className="flex items-center gap-14">
                    {([
                        { Icon: Package, label: 'Docker' },
                        { Icon: Database, label: 'PostgreSQL' },
                    ] as { Icon: React.ElementType; label: string }[]).map(({ Icon, label }, i) => (
                        <motion.div key={label} className="flex flex-col items-center gap-4"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                            transition={{ delay: 0.3 + i * 0.15, duration: 0.7, ease: EASE }}
                        >
                            <Icon size={86} className="text-cyan-400" strokeWidth={1} />
                            <span className="font-mono text-[13px] text-white uppercase tracking-[0.3em]">{label}</span>
                        </motion.div>
                    ))}
                </div>
            )}

            <motion.p className="font-['Paris2024'] text-white tracking-wide text-center"
                style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3.4rem)' }}
                initial={{ opacity: 0, y: 14 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ delay: 0.55, duration: 0.9, ease: EASE }}
            >
                {phase === 1 ? 'Recoder la base.' : 'MiniGPT.'}
            </motion.p>

            <motion.p className="italic text-white text-center max-w-md"
                style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)' }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.85, duration: 0.8 }}
            >
                {phase === 1
                    ? 'notgoogle : un moteur de recherche forgé sur des sockets TCP bruts.'
                    : "Interface de chat administrable démontrant la maîtrise d'une stack web moderne."}
            </motion.p>

            {/* Callout — phase 1 */}
            <motion.div className="absolute text-left" style={{ left: '4%', bottom: '22%' }}
                initial={{ opacity: 0 }}
                animate={isActive && phase === 1 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC13.02</p>
                <p className="font-mono text-white text-[11px] mt-2">Python · Sockets TCP</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Protocoles · TCP brut</p>
            </motion.div>

            {/* Callouts — phase 2 */}
            <motion.div className="absolute text-left" style={{ left: '4%', bottom: '24%' }}
                initial={{ opacity: 0 }}
                animate={isActive && phase === 2 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC13.01</p>
                <p className="font-mono text-white text-[11px] mt-2">Docker · Flask · R209</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Stack web · Conteneurisation</p>
            </motion.div>
            <motion.div className="absolute text-right" style={{ right: '4%', bottom: '12%' }}
                initial={{ opacity: 0 }}
                animate={isActive && phase === 2 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC13.05</p>
                <p className="font-mono text-white text-[11px] mt-2">R207 · MySQL · SAÉ 15</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Données · Bases relationnelles</p>
            </motion.div>
        </section>
    );
}

function SectionBibles({ isActive }: { isActive: boolean }) {
    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-center px-8"
            style={{ scrollSnapAlign: 'start' }}
        >
            <motion.p className="font-['Paris2024'] text-white tracking-wide mb-14"
                style={{ fontSize: 'clamp(2rem, 5.5vw, 5rem)', lineHeight: 1.1 }}
                initial={{ opacity: 0, y: 18 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ delay: 0.25, duration: 1.0, ease: EASE }}
            >
                2 Bibles Réseaux.
            </motion.p>

            <div className="flex gap-14 md:gap-20 items-end">
                {(['Bible Réseau', 'Bible Réseau Vulga'] as const).map((label, i) => (
                    <motion.div key={label} className="flex flex-col items-center gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.9 + i * 0.2, duration: 0.8, ease: EASE }}
                    >
                        <div className="w-28 h-36 md:w-36 md:h-44 rounded-lg shadow-xl flex flex-col justify-end pb-4 px-4"
                            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(255,255,255,0.12)' }}>
                            {[80, 100, 65, 90, 70].map((w, j) => (
                                <div key={j} className="h-[3px] rounded-full bg-black/10 mb-1.5" style={{ width: `${w}%` }} />
                            ))}
                        </div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/40">{label}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="mt-10 flex flex-col gap-1"
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
            >
                <p className="font-['Paris2024'] italic text-white/60 tracking-wide" style={{ fontSize: 'clamp(0.85rem, 1.3vw, 1rem)' }}>
                    « de la méthode »
                </p>
                <p className="font-['Paris2024'] italic text-white/60 tracking-wide" style={{ fontSize: 'clamp(0.85rem, 1.3vw, 1rem)' }}>
                    « M.Merchez »
                </p>
            </motion.div>
        </section>
    );
}

function Section6Impression({ isActive }: { isActive: boolean }) {
    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-8"
            style={{ scrollSnapAlign: 'start', backgroundColor: '#F5F5F7' }}
        >
            <motion.p className="font-['Paris2024'] text-black tracking-wide mb-14"
                style={{ fontSize: 'clamp(2rem, 5.5vw, 5rem)', lineHeight: 1.1 }}
                initial={{ opacity: 0, y: 18 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ delay: 0.25, duration: 1.0, ease: EASE }}
            >
                1 Page de Test<br />d'Impression.
            </motion.p>
            <div className="flex gap-14 md:gap-20 items-end">
                {['Administrateur', 'Utilisateur AD'].map((label, i) => (
                    <motion.div key={label} className="flex flex-col items-center gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.9 + i * 0.2, duration: 0.8, ease: EASE }}
                    >
                        <div className="w-28 h-36 md:w-36 md:h-44 rounded-lg shadow-xl flex flex-col justify-end pb-4 px-4"
                            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.08)' }}>
                            {[80, 100, 65, 90, 70].map((w, j) => (
                                <div key={j} className="h-[3px] rounded-full bg-black/10 mb-1.5" style={{ width: `${w}%` }} />
                            ))}
                        </div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-black/28">{label}</p>
                    </motion.div>
                ))}
            </div>
            <motion.p className="absolute bottom-10 font-mono text-[7.5px] uppercase tracking-[0.5em] text-black/20"
                initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 2.0, duration: 0.7 }}>
                Ressources : R202 · Active Directory Windows Server
            </motion.p>
        </section>
    );
}

function SectionOneMoreThingText({ isActive }: { isActive: boolean }) {
    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-center px-8 gap-4" style={{ scrollSnapAlign: 'start' }}>

            <motion.p className="font-['Paris2024'] text-white tracking-wide"
                style={{ fontSize: 'clamp(2.8rem, 7vw, 7rem)', lineHeight: 1.05 }}
                initial={{ opacity: 0, y: 18 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ delay: 0.8, duration: 1.0, ease: EASE }}
            >
                une dernière chose.
            </motion.p>
            <motion.p className="absolute bottom-10 font-mono text-[7.5px] uppercase tracking-[0.55em] text-white"
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 2.0, duration: 0.7 }}
            >
                ↓
            </motion.p>
        </section>
    );
}

function SectionPortfolio({ isActive }: { isActive: boolean }) {
    const siteUrl = typeof window !== 'undefined'
        ? `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, '') : '';
    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-center px-8 overflow-hidden" style={{ scrollSnapAlign: 'start' }}>
            <motion.div className="absolute inset-8 md:inset-16 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.9, ease: EASE }}
            >
                <img src={`${BASE}assets/projects/website.png`} alt="Portfolio" className="w-full h-full object-cover object-top" />
                <motion.div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent flex items-end justify-center pb-8"
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <a href="/" className="font-mono text-white hover:text-white tracking-[0.2em] text-sm transition-colors">
                        {siteUrl.replace(/^https?:\/\//, '')}
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}

// ─── SectionIdentite ─────────────────────────────────────────────────────────

function SectionIdentite({ isActive }: { isActive: boolean }) {
    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-center px-8 gap-10" style={{ scrollSnapAlign: 'start' }}>
            <motion.div
                className="flex items-end gap-12"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
            >
                <Server size={52} className="text-white" strokeWidth={1} />
                <Users size={80} className="text-white" strokeWidth={1} />
                <Network size={52} className="text-white" strokeWidth={1} />
            </motion.div>

            <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 14 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ delay: 0.55, duration: 0.9, ease: EASE }}
            >
                <p className="font-['Paris2024'] text-white tracking-wide" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}>
                    Nommer et Diriger.
                </p>
                <p className="text-white italic max-w-lg mx-auto" style={{ fontSize: 'clamp(0.85rem, 1.3vw, 1rem)' }}>
                    Centraliser l'identité avec Active Directory, distribuer les accès (DHCP/DNS) et automatiser les déploiements (PXE).
                </p>
            </motion.div>

            <motion.div className="absolute text-left" style={{ left: '4%', bottom: '24%' }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC11.04</p>
                <p className="font-mono text-white text-[11px] mt-2">R202</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Active Directory · DNS · DHCP</p>
            </motion.div>
            <motion.div className="absolute text-right" style={{ right: '4%', bottom: '12%' }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC11.06</p>
                <p className="font-mono text-white text-[11px] mt-2">R202 · R203</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Intégration postes · Boot PXE</p>
            </motion.div>
        </section>
    );
}

// ─── SectionVoixMots ─────────────────────────────────────────────────────────

function SectionVoixMots({ isActive, onOpenSpecs, onOpenDoc }: {
    isActive: boolean;
    onOpenSpecs?: () => void;
    onOpenDoc?: (path: string, title: string) => void;
}) {
    const BIBLES = [
        { path: 'assets/documents/apprentissage/BIBLE_RESEAUX.md', label: 'Bible Réseaux ↗', title: 'BIBLE RÉSEAUX — R&T BUT 1ère Année' },
        { path: 'assets/documents/apprentissage/bible_reseaux_vulga.md', label: 'Version Analogies ↗', title: 'LA BIBLE RÉSEAUX (Version Vulgarisée)' },
    ];
    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-center px-8 gap-10" style={{ scrollSnapAlign: 'start' }}>
            <motion.div
                className="flex items-center gap-16"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
            >
                <Phone size={72} className="text-white" strokeWidth={1} />
                <BookOpen size={72} className="text-white" strokeWidth={1} />
            </motion.div>

            <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 14 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ delay: 0.55, duration: 0.9, ease: EASE }}
            >
                <p className="font-['Paris2024'] text-white tracking-wide" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}>
                    Donner de la voix.
                </p>
                <p className="text-white italic max-w-lg mx-auto" style={{ fontSize: 'clamp(0.85rem, 1.3vw, 1rem)' }}>
                    Faire transiter la voix sur IP et vulgariser l'ingénierie par l'analogie.
                </p>
            </motion.div>

            {onOpenDoc && (
                <motion.div
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ delay: 0.85, duration: 0.6 }}
                >
                    {BIBLES.map(b => (
                        <button
                            key={b.path}
                            onClick={() => onOpenDoc(b.path, b.title)}
                            className="font-mono text-[8px] text-white uppercase tracking-[0.3em] border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 hover:border-white/50 transition-all duration-200"
                        >
                            {b.label}
                        </button>
                    ))}
                </motion.div>
            )}

            {onOpenSpecs && (
                <motion.button
                    onClick={onOpenSpecs}
                    className="font-mono text-[8px] text-white uppercase tracking-[0.3em] border border-white/20 rounded-full px-5 py-2 hover:border-white transition-colors duration-200"
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                >
                    [+ Voir les exigences SAÉ]
                </motion.button>
            )}

            <motion.div className="absolute text-left" style={{ left: '4%', bottom: '24%' }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC12.04</p>
                <p className="font-mono text-white text-[11px] mt-2">R204</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Asterisk · Trunk SIP · IVR</p>
            </motion.div>
            <motion.div className="absolute text-right" style={{ right: '4%', bottom: '12%' }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC12.05</p>
                <p className="font-mono text-white text-[11px] mt-2">Bibles Réseaux</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Vulgarisation · Communication</p>
            </motion.div>
        </section>
    );
}

// ─── SectionUsineLogicielle ───────────────────────────────────────────────────

function SectionUsineLogicielle({ isActive }: { isActive: boolean }) {
    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-center px-8 gap-10" style={{ scrollSnapAlign: 'start' }}>
            <motion.div
                className="flex items-center gap-16"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
            >
                <GitBranch size={72} className="text-white" strokeWidth={1} />
                <Database size={72} className="text-white" strokeWidth={1} />
            </motion.div>

            <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 14 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ delay: 0.55, duration: 0.9, ease: EASE }}
            >
                <p className="font-['Paris2024'] text-white tracking-wide" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}>
                    La Rigueur du Code.
                </p>
                <p className="text-white italic max-w-lg mx-auto" style={{ fontSize: 'clamp(0.85rem, 1.3vw, 1rem)' }}>
                    Manipuler des données massives (PostgreSQL, Python) et versionner chaque ligne d'infrastructure.
                </p>
            </motion.div>

            <motion.div className="absolute text-left" style={{ left: '4%', bottom: '24%' }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC13.06</p>
                <p className="font-mono text-white text-[11px] mt-2">Git · GitHub</p>
                <p className="font-mono text-white text-[10px] mt-0.5">Versionnement · Collaboration</p>
            </motion.div>
            <motion.div className="absolute text-right" style={{ right: '4%', bottom: '12%' }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
            >
                <p className="font-mono text-white text-[13px] tracking-wide leading-none">AC13.05</p>
                <p className="font-mono text-white text-[11px] mt-2">R207 · SAÉ 15</p>
                <p className="font-mono text-white text-[10px] mt-0.5">PostgreSQL · Données massives</p>
            </motion.div>
        </section>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function KeynoteBut1Page() {
    const [current, setCurrent]           = useState(0);
    const [specsOpen, setSpecsOpen]       = useState(false);
    const [specsCompIdx, setSpecsCompIdx] = useState<0 | 1 | 2>(0);
    const [selectedProof, setSelectedProof] = useState<Proof | null>(null);
    const [readerOpen, setReaderOpen]     = useState(false);
    const containerRef                    = useRef<HTMLDivElement>(null);

    const openSpecs = (idx: 0 | 1 | 2) => { setSpecsCompIdx(idx); setSpecsOpen(true); };

    const openReader = (img: CarouselImage) => {
        if (!img.docPath) return;
        setSelectedProof({ title: img.title ?? img.caption, module: img.specs?.[0] ?? '', techs: img.specs ?? [], date: '', path: img.docPath } as unknown as Proof);
        setReaderOpen(true);
    };

    const openDoc = (path: string, title: string) => {
        setSelectedProof({ title, module: '', techs: [], date: '', path } as unknown as Proof);
        setReaderOpen(true);
    };

    useEffect(() => {
        document.title = 'Soutenance BUT1 — Keynote';
        return () => { document.title = 'Briac Le Meillat'; };
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onScroll = () => {
            const idx = Math.round(el.scrollTop / window.innerHeight);
            setCurrent(Math.max(0, Math.min(idx, TOTAL - 1)));
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    const goTo = (idx: number) =>
        containerRef.current?.scrollTo({ top: idx * window.innerHeight, behavior: 'smooth' });

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (specsOpen || readerOpen) return;
            if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(Math.min(current + 1, TOTAL - 1)); }
            else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(Math.max(current - 1, 0)); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [current, specsOpen, readerOpen]);

    return (
        <>
            <style>{SHIMMER_CSS}</style>

            <div ref={containerRef} className="fixed inset-0 overflow-y-scroll"
                style={{ scrollSnapType: 'y mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
            >
                {/* S0 — Écran noir */}
                <section className="w-full h-screen bg-black" style={{ scrollSnapAlign: 'start' }} />

                {/* S1 — Illusion */}
                <Section1_Illusion isActive={current === 1} />

                {/* S2 — Ouverture */}
                <Section0 isActive={current === 2} />

                {/* S3 — Ce n'est pas de la magie */}
                <SectionMagie isActive={current === 3} />

                {/* S4 — Scrollytelling ph1 */}
                <SectionScrolly phase={1} isActive={current === 4} />

                {/* S5 — Scrollytelling ph2 : Switch */}
                <SectionScrolly phase={2} isActive={current === 5} />

                {/* S6 — Scrollytelling ph3 : STP */}
                <SectionScrolly phase={3} isActive={current === 6} />

                {/* S7 — Card Administrer */}
                <CompetenceCard comp={COMPETENCES[0]} isActive={current === 7} onOpenSpecs={() => openSpecs(0)} />

                {/* S8 — Carousel Administrer */}
                <CompetenceCarousel images={CAROUSEL_ADMINISTRER} comp={COMPETENCES[0]} credits={CREDITS_ADMINISTRER} isActive={current === 8} onOpenReader={openReader} />

                {/* S9 — Scrollytelling Connecter ph1 */}
                <SectionScrollyConnecter phase={1} isActive={current === 9} />

                {/* S10 — Scrollytelling Connecter ph2 */}
                <SectionScrollyConnecter phase={2} isActive={current === 10} />

                {/* S11 — Card Connecter */}
                <CompetenceCard comp={COMPETENCES[1]} isActive={current === 11} onOpenSpecs={() => openSpecs(1)} />

                {/* S12 — Carousel Connecter */}
                <CompetenceCarousel images={CAROUSEL_CONNECTER} comp={COMPETENCES[1]} credits={CREDITS_CONNECTER} isActive={current === 12} onOpenReader={openReader} />

                {/* S13 — Donner de la voix */}
                <SectionVoixMots isActive={current === 13} onOpenSpecs={() => openSpecs(1)} onOpenDoc={openDoc} />

                {/* S14 — 2 Bibles Réseaux */}
                <SectionBibles isActive={current === 14} />

                {/* S15 — Nommer et Diriger */}
                <SectionIdentite isActive={current === 15} />

                {/* S16 — Impression (fond blanc) */}
                <Section6Impression isActive={current === 16} />

                {/* S17 — La Rigueur du Code (Git + PostgreSQL) */}
                <SectionUsineLogicielle isActive={current === 17} />

                {/* S18 — Scrollytelling Programmer ph1 */}
                <SectionScrollyProgrammer phase={1} isActive={current === 18} />

                {/* S19 — Scrollytelling Programmer ph2 */}
                <SectionScrollyProgrammer phase={2} isActive={current === 19} />

                {/* S20 — Card Programmer */}
                <CompetenceCard comp={COMPETENCES[2]} isActive={current === 20} onOpenSpecs={() => openSpecs(2)} />

                {/* S21 — Carousel Programmer */}
                <CompetenceCarousel images={CAROUSEL_PROGRAMMER} comp={COMPETENCES[2]} credits={CREDITS_PROGRAMMER} isActive={current === 21} onOpenReader={openReader} />

                {/* S22 — Une dernière chose */}
                <SectionOneMoreThingText isActive={current === 22} />

                {/* S23 — Portfolio */}
                <SectionPortfolio isActive={current === 23} />
            </div>

            <ProgressDots current={current} />
            <ExitBtn current={current} />

            <AnimatePresence>
                {readerOpen && selectedProof && (
                    <ReaderModal proof={selectedProof} onClose={() => setReaderOpen(false)} />
                )}
            </AnimatePresence>

            <AcSpecsDrawer
                isOpen={specsOpen}
                onClose={() => setSpecsOpen(false)}
                comp={COMPETENCES[specsCompIdx]}
                acs={[ACS_ADMINISTRER, ACS_CONNECTER, ACS_PROGRAMMER][specsCompIdx]}
            />
        </>
    );
}
