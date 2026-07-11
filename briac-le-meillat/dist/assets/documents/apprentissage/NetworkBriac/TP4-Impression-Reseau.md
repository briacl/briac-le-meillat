# TP4 - Ajout impression réseau (NetworkBriac)

Suite de NetworkBriac.md, own-proxy.md, partage-reseau.md.
Objectif : permettre à un client (Mac/Linux/Windows) du LAN NetworkBriac d'imprimer sur une imprimante physique connectée au réseau de la maison (réseau parent, derrière le gateway Lenovo1).

## 1. Contexte réseau

Lenovo1 = gateway entre :
- Réseau NetworkBriac (192.168.100.0/24) côté interne
- Réseau maison (BIGWALL router, 192.168.2.0/24) côté externe, où se trouve l'imprimante

Deux cas possibles selon le type d'imprimante :
- **Imprimante réseau (Wi-Fi/Ethernet, a sa propre IP sur 192.168.2.0/24)** → cas traité ici.
- **Imprimante USB branchée sur un PC** → nécessiterait un partage via ce PC, non traité ici.

## 2. Prérequis

- Connaître l'IP de l'imprimante sur le réseau maison (192.168.2.x). Vérifier via l'interface BIGWALL (liste DHCP) ou directement sur l'écran de l'imprimante (Réglages réseau).
- Le forwarding IP est déjà actif sur Lenovo1 (TP1-NetworkBriac), donc le routage entre les deux réseaux fonctionne déjà au niveau IP. Le point bloquant est l'**ACL/NAT** : actuellement nftables MASQUERADE ne fait que de la sortie (NAT sortant), il faut s'assurer que le trafic vers le port d'impression de l'imprimante (souvent port 631 IPP ou 9100 RAW) n'est pas bloqué par la policy drop input/forward.

## 3. Vérification de l'imprimante (sur le réseau maison)

```bash
# Depuis Lenovo1, tester l'accessibilité de l'imprimante
ping 192.168.2.X
nmap -p 631,9100,515 192.168.2.X
```

Ports à connaître :
- **631/tcp** : IPP (Internet Printing Protocol), standard moderne, géré par CUPS
- **9100/tcp** : RAW/JetDirect (le plus simple et universel pour la plupart des imprimantes)
- **515/tcp** : LPD/LPR (ancien protocole)

## 4. Installation de CUPS sur Lenovo1

CUPS va servir de **passerelle d'impression** : les clients du LAN NetworkBriac envoient leurs jobs à Lenovo1 (CUPS), qui les retransmet vers l'imprimante sur le réseau maison.

```bash
sudo apt update
sudo apt install cups cups-client printer-driver-all -y
```

### 4.1 Ajout de l'utilisateur au groupe d'administration CUPS

```bash
sudo usermod -aG lpadmin $USER
```

### 4.2 Activation de l'accès distant à l'interface web CUPS

Éditer `/etc/cups/cupsd.conf` :

```bash
sudo nano /etc/cups/cupsd.conf
```

Modifier la ligne d'écoute :
```
Listen localhost:631
```
en :
```
Port 631
```

Ajouter l'autorisation pour le réseau NetworkBriac dans le bloc `<Location />` :
```
<Location />
  Order allow,deny
  Allow from 192.168.100.0/24
</Location>

<Location /admin>
  Order allow,deny
  Allow from 192.168.100.0/24
</Location>
```

Redémarrer le service :
```bash
sudo systemctl restart cups
sudo systemctl enable cups
```

## 5. Ajout de l'imprimante distante dans CUPS

### 5.1 Via l'interface web (recommandé, plus simple)

Depuis un navigateur sur le LAN NetworkBriac : `https://IP_LENOVO1:631`

- Aller dans **Administration** → **Add Printer**
- S'authentifier (compte Linux avec droits lpadmin)
- CUPS devrait détecter l'imprimante réseau automatiquement si elle est en IPP/Bonjour. Sinon, ajouter manuellement :
  - Sélectionner **AppSocket/HP JetDirect** si port 9100 ouvert
  - URI : `socket://192.168.2.X:9100`
  - Ou pour IPP : `ipp://192.168.2.X:631/ipp/print`

### 5.2 Via ligne de commande (alternative)

```bash
sudo lpadmin -p ImprimanteMaison -E -v socket://192.168.2.X:9100 -m everywhere
```

Vérifier que l'imprimante est bien ajoutée :
```bash
lpstat -p -d
```

## 6. Vérification du routage nftables (point critique)

Si la policy nftables est en `drop` par défaut sur la chain `forward` (TP9-nftables), il faut vérifier que le trafic sortant de Lenovo1 lui-même (donc en `output`, pas en `forward`, car c'est CUPS sur Lenovo1 qui contacte l'imprimante) n'est pas bloqué.

```bash
sudo nft list ruleset
```

Normalement le trafic **output** (Lenovo1 vers l'extérieur) n'est généralement pas filtré par défaut contrairement à `input`/`forward`. Si une règle restrictive existe sur `output`, ajouter :

```bash
sudo nft add rule inet filter output ip daddr 192.168.2.0/24 tcp dport { 631, 9100, 515 } accept
```

Rendre la règle persistante (comme dans TP9) :
```bash
sudo nft list ruleset > /etc/nftables.conf
sudo systemctl enable nftables
```

## 7. Test d'impression d'une page de test

```bash
lp -d ImprimanteMaison /usr/share/cups/data/testprint
```

Ou via l'interface web CUPS : **Imprimante** → **Maintenance** → **Print Test Page**.

## 8. Configuration côté clients du LAN NetworkBriac

### macOS

1. **Réglages Système** → **Imprimantes et scanners** → **Ajouter une imprimante**
2. Si elle n'apparaît pas automatiquement (Bonjour ne traverse pas les sous-réseaux par défaut), ajouter manuellement via IP :
   - Adresse : `IP_LENOVO1`
   - Protocole : **Internet Printing Protocol - IPP**
   - File : `/printers/ImprimanteMaison`

### Linux (autre client)

```bash
sudo apt install cups-client
lpadmin -p ImprimanteMaison -E -v ipp://IP_LENOVO1:631/printers/ImprimanteMaison
```

### Windows

**Paramètres** → **Imprimantes et scanners** → **Ajouter un périphérique** → **L'imprimante que je veux n'est pas répertoriée** → **Sélectionner une imprimante partagée par nom** :
```
http://IP_LENOVO1:631/printers/ImprimanteMaison
```

## 9. Schéma récapitulatif du flux

```
Client (Mac/Linux/Win, 192.168.100.x)
   → IPP port 631 → Lenovo1 (CUPS, passerelle)
        → CUPS retransmet → socket 9100 → Imprimante (192.168.2.x, réseau maison)
```

## 10. Points de vérification en cas d'échec

| Symptôme | Cause probable | Vérification |
|---|---|---|
| Imprimante invisible depuis le client | Bonjour/mDNS ne traverse pas les VLAN/sous-réseaux | Ajout manuel par IP obligatoire |
| Job bloqué en "processing" | nftables bloque le port 9100/631 en sortie de Lenovo1 | `nft list ruleset`, ajouter règle accept |
| "Connection refused" sur CUPS web | cupsd.conf encore en `Listen localhost:631` | Repasser en `Port 631` + redémarrer service |
| Imprimante accepte le job mais n'imprime pas | Mauvais protocole (RAW vs IPP) | Tester l'autre port (9100 vs 631) |
