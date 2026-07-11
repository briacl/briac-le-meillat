# Bilan : Environnement VMware ESXi à Roubaix

## Contexte

Session d'exploration de l'environnement de labo virtuel disponible sur le serveur VMware ESXi au datacenter de Roubaix (chez papa). Objectif : valider que cet environnement peut servir de plateforme d'entraînement complète pour les TPs BUT R&T 1A, avec avantages par rapport à l'infrastructure IUT.

---

## 1. Comparaison IUT ↔ Roubaix

### Hyperviseur
- **IUT** : VirtualBox (CLI via script `MachinesVirtuelles`, modèles préconfigurés, état reset à chaque session)
- **Roubaix** : VMware ESXi standalone (ou vCenter selon config papa) — interface web ou remote console via VPN/BIGWALL

**Verdict** : Équivalent fonctionnel. VirtualBox et ESXi exposent les mêmes primitives (création VM, NIC virtuelle, DHCP/DNS, bridge/nat/interne).

### Réseau
- **IUT** : Accès bridge au réseau 172.31.25.0/24 (physique IUT) + réseau interne pour lab isolé
- **Roubaix** : Réseaux virtuels préexistants (papa a configuré 192.168.168.x pour base, 192.168.50.x pour lab client-serveur)

**Verdict** : Équivalent en possibilités. Les IPs changent, la logique est identique. À Roubaix, tout persiste (pas de reset automatique) → avantage pour conserver des configs entre sessions.

### Ressources
- **IUT** : i7 (générations variables), 16 Go RAM, modèles stockés localement, différentiel serveur
- **Roubaix** : Serveur dédié, RAM/stockage sans limite pour tes besoins

**Verdict** : Roubaix **meilleur** — pas de concurrence pour les ressources, pas d'ejection de session.

### Accès
- **IUT** : Console physique directe
- **Roubaix** : Remote console via VPN + VirtualBox/VMware App

**Verdict** : Acceptable. Légère latence mais workable pour les TPs.

---

## 2. Snapshots vs Templates

### Snapshot
État figé d'une VM à un instant T. Sauvegarde tous les disques + RAM (optionnel).

**Usage** :
- Avant une manip risquée → revenir à l'état propre si ça casse
- Sur UNE VM existante : tu as une Ubuntu installée, tu fais un snapshot, puis tu testes des configs, puis tu reload le snapshot

**Limite** : Un snapshot est attaché à une VM. Pour créer une NOUVELLE VM identique, il faut exporter.

### Template OVA/OVF
Export d'une VM complète (disque + config matérielle) en fichier réutilisable.

**Usage** :
- Installe Ubuntu une fois, proprement
- Export en OVA (template)
- Quand tu veux une nouvelle Ubuntu fraîche : déploie depuis le template → 2-3 min et t'as une VM vierge prête
- **C'est exactement ce que le script `MachinesVirtuelles` IUT fait**

**Avantage** : Spawn infini de VMs identiques sans répéter l'installation.

### Workflow recommandé à Roubaix
1. Installe Ubuntu/Windows une fois (30 min-1h)
2. Prépare la VM : sécurité minimale, kernel à jour, outils de base
3. **Exporte en OVA** (ou fais un snapshot) → sauvegarde cette base
4. Quand tu fais un TP :
   - Déploie une Ubuntu fraîche depuis l'OVA
   - Fais le TP
   - Supprime la VM quand c'est fini
5. VM suivante : redéploie, reset complètement

**Résultat** : Environnement identique à l'IUT (VMs jetables, base figée) mais avec persistance optionnelle (tu peux garder une VM entre sessions si tu veux itérer).

---

## 3. Cartes réseau (2 NIC)

### État actuel
- NBWS (Windows Server) : 1 NIC sur 192.168.168.x
- Papa a ajouté un switch virtuel → NBWS + NBWC (Windows Client) maintenant sur 192.168.50.x (réseau isolé pour la topologie AD)

### Architecture à pérenniser

#### NBWS — Configuration cible (2 NIC)
```
NIC 1 (ens192) : 192.168.168.110 → réseau "Roubaix datacenter"
NIC 2 (ens224) : 192.168.50.1    → réseau "Lab AD" (switch virtuel)
```

**Rôle** : Routeur + serveur AD
- NIC 1 = lien vers le monde externe (gestion VMware, backup, accès papa)
- NIC 2 = domaine `networkbriac.local` pour les clients du lab

#### NBWC — Configuration cible (1 NIC)
```
NIC 1 : DHCP sur réseau "Lab AD" (192.168.50.x)
```

**Rôle** : Client du domaine

### Configuration UI ESXi

Pour **ajouter une 2nde NIC** à une VM avant déploiement depuis template :

1. Éditer paramètres VM (avant premier boot)
2. Ajouter NIC → choisir le réseau virtuel (ex: "Lab AD")
3. Boot et configurer dedans (IP statique ou DHCP selon besoin)

Ou directement au déploiement si l'UI le propose.

### À vérifier avec papa
- Quels switches virtuels ESXi existent actuellement ?
- Y a-t-il vCenter ou ESXi standalone ?
- Peut-on exporter/importer les OVA facilement via l'UI web ou faut-il du `ovftool` ?

---

## 4. Plan d'action - Templates multiples

### Modèles à préparer (une fois)
1. **Ubuntu-Base** (minimal install)
   - 2 NIC vierges, configurable après déploiement
   - Outils de base (curl, git, nano, openssh-server)
   - Export en OVA

2. **Windows Server 2025** (ou ta version actuelle)
   - 2 NIC vierges
   - Drivers VMware Tools
   - Export en OVA → template de base pour NBWS, etc.

3. **Windows 10/11 Client** (si besoin client léger)
   - 1 NIC
   - Export en OVA

### Workflow TP (ex: R203 Spanning Tree)
1. Déploie 2× Ubuntu depuis le template → ubuntuSTP-1, ubuntuSTP-2
2. Configure NIC 1 en bridge Roubaix (172.31.25.x), NIC 2 interne (192.168.10.x pour ce TP)
3. Configure les 2 VMs en topologie réseau (statique)
4. Fais le TP (switch virtuel, spanning tree, etc.)
5. Snapshot si tu veux rejouer exactement la même config
6. Supprime après test → VMs jetables

### Workflow Passerelle (ex: R202)
1. Déploie 1× Ubuntu depuis le template → ubuntu-passerelle
2. Configure NIC 1 en bridge Roubaix (accès IUT/Internet)
3. Configure NIC 2 interne (192.168.100.x) → réseau du lab
4. Installe gateway services (iptables/nftables, DHCP, DNS, etc.)
5. Déploie client(s) en interne connectés à NIC 2
6. Teste la passerelle

---

## 5. Avantages Roubaix vs IUT

| Point | IUT | Roubaix |
|------|-----|---------|
| Modèles prêts | ✓ Oui | À préparer une fois |
| Reset auto | ✓ Oui | ✗ Manuel (avantage ou inconvénient ?) |
| Persistance entre sessions | ✗ Non | ✓ Oui (tu peux garder une VM si besoin) |
| RAM/CPU limite | Limité (partage) | ✗ Pas de limite pratique |
| Électricité | Toi | Papa absorbe |
| Éloignement | Localité → latence basse | Roubaix → latence remote console |
| Templates/Snapshots | Prédéfinis | À gérer toi-même |

**Conclusion** : Roubaix est **au moins équivalent**, potentiellement meilleur une fois les templates prépares.

---

## 6. Questions ouvertes

À clarifier avec papa ou en explorant ESXi :

1. **vCenter ou standalone ?** → vCenter = gestion + facile des templates, standalone = script CLI (ovftool)
2. **Espace disque** → Combien pour les OVA? (Ubuntu minimal ≈ 5-10 Go, Windows ≈ 20-30 Go)
3. **Port forwarding NAT** → Possible pour accès SSH/RDP depuis chez toi vers NBWS via VPN ?
4. **Backup** → Comment persiste-t-on les OVA (stockage centralisé, git des configs, etc.) ?
5. **Réseau Roubaix** → BIGWALL/VPN permet-il de pinger VMs Roubaix depuis chez toi directement ?

---

## 7. Next steps

### Court terme (semaine prochaine)
- [ ] Demander à papa : vCenter ou ESXi standalone, espace disque, architecture réseau détaillée
- [ ] Tester export/import OVA sur ESXi
- [ ] Préparer un Ubuntu-base template

### Moyen terme (avant prochain TP)
- [ ] Peupler la "librairie" de templates (Ubuntu, Windows Server)
- [ ] Documenter le workflow de déploiement (copier-coller de commandes ESXi CLI si besoin)

### Long terme
- [ ] Utiliser Roubaix comme plateforme de labo principale pour les TPs R201/R202/R203/R207
- [ ] Snapshots entre étapes (avant/après chaque TP) pour comparaison

---

## Récapitulatif

**Environnement Roubaix = équivalent amélioré de l'IUT**

✓ VMs via hyperviseur (ESXi ≈ VirtualBox)  
✓ Réseaux virtuels (bridge/interne, juste IPs différentes)  
✓ Snapshots (état figé) et Templates (modèles réutilisables)  
✓ 2 NICs configurables par VM  
✓ Ressources illimitées (RAM, CPU, stockage raisonnable)  
✓ Persistance optionnelle  

**Action** : Préparer les templates, valider avec papa la config réseau ESXi, puis utiliser Roubaix pour tous les TPs.

