# Extrait du Compte-Rendu : Configuration de la Passerelle Linux

## 1. Topologie et Objectif

L'objectif est de configurer une machine Linux (Ubuntu) pour servir de passerelle (gateway) entre deux réseaux distincts.

- **Interface LAN (Interne) :** Connectée au réseau local des machines.
    
- **Interface WAN (Externe) :** Connectée au réseau permettant l'accès à l'extérieur (Réseau IUT/Internet).
    

## 2. Configuration des Interfaces

Sur la machine Linux "Passerelle", les interfaces doivent être configurées avec les adresses IP statiques suivantes :

|**Interface**|**Rôle**|**IP / Masque**|
|---|---|---|
|`enp0s3`|WAN|Configurée par DHCP ou IP fixe selon le réseau hôte|
|`enp0s8`|LAN|`192.168.0.1 / 255.255.255.0`|

## 3. Activation du Forwarding (Transfert de paquets)

Pour que la machine accepte de transmettre des paquets d'une interface à l'autre, il faut activer l'IP Forwarding dans le noyau Linux.

**Commande d'activation immédiate :**

Bash

```
sudo echo 1 > /proc/sys/net/ipv4/ip_forward
```

**Vérification :**

Bash

```
cat /proc/sys/net/ipv4/ip_forward
# La sortie doit être "1"
```

## 4. Configuration du NAT (Masquerade)

Les adresses du LAN (`192.168.0.x`) ne sont pas routables sur le réseau extérieur. Il faut donc utiliser `iptables` pour masquer ces adresses derrière l'IP de l'interface de sortie.

**Commande iptables :**

Bash

```
sudo iptables -t nat -A POSTROUTING -o enp0s3 -j MASQUERADE
```

_Note : `enp0s3` correspond ici à l'interface connectée au réseau extérieur._

## 5. Configuration des Clients (H1 / PC)

Pour que les machines du réseau local puissent sortir, elles doivent pointer vers la machine Linux comme passerelle par défaut.

**Configuration sur une machine cliente (ex: H1) :**

- **IP :** `192.168.0.2`
    
- **Masque :** `255.255.255.0`
    
- **Passerelle :** `192.168.0.1`
    

## 6. Tests de Validation

1. **Ping local :** Depuis H1 vers la passerelle (`192.168.0.1`) -> **OK**.
    
2. **Ping externe :** Depuis H1 vers une IP extérieure (ex: `172.31.25.9` ou `8.8.8.8`) -> **OK**.
    
3. **Traceroute :** Vérification que le premier saut passe bien par `192.168.0.1`.


[[Activation_IP_Forwarding]]

