# TP2 - SAE 1.02

**Auteur :** Briac Le Meillat  

## Partie 1 : Configuration Switch Cisco 2960

### A. Initialisation des VLANs

Connexion au switch et accès au mode configuration :

```
enable
configure terminal
```

Déclaration des VLANs :

```
vlan 10
name ADMIN
vlan 20
name PERSONNEL
vlan 30
name PRODUCTION
vlan 40
name VIDEO
exit
```

### B. Association ports <-> VLANs

**Port FastEthernet 0/1 (VLAN ADMIN) :**

```
interface fastEthernet 0/1
switchport mode access
switchport access vlan 10
exit
```

**Port FastEthernet 0/2 (VLAN PERSONNEL) :**

```
interface fastEthernet 0/2
switchport mode access
switchport access vlan 20
exit
```

**Port FastEthernet 0/3 (VLAN PRODUCTION) :**

```
interface fastEthernet 0/3
switchport mode access
switchport access vlan 30
exit
```

### C. Configuration liaison Trunk

```
interface gigabitEthernet 0/1
switchport mode trunk
exit
```

### D. Sauvegarde configuration

```
end
write
```

---

## Partie 2 : Configuration Routeur Cisco

### A. Interface physique

Activation de l'interface GigabitEthernet 0/0 :

```
enable
configure terminal
interface gigabitEthernet 0/0
no shutdown
exit
```

### B. Sous-interfaces (802.1Q)

**VLAN 10 - Administration :**

```
interface gigabitEthernet 0/0.10
encapsulation dot1Q 10
ip address 192.168.10.254 255.255.255.0
exit
```

**VLAN 20 - Personnel :**

```
interface gigabitEthernet 0/0.20
encapsulation dot1Q 20
ip address 192.168.20.254 255.255.255.0
exit
```

**VLAN 30 - Production :**

```
interface gigabitEthernet 0/0.30
encapsulation dot1Q 30
ip address 192.168.30.254 255.255.255.0
exit
```

**VLAN 40 - Vidéo :**

```
interface gigabitEthernet 0/0.40
encapsulation dot1Q 40
ip address 192.168.40.254 255.255.255.0
exit
```

### C. Configuration serveur DHCP

**Exclusions d'adresses :**

```
ip dhcp excluded-address 192.168.10.254
ip dhcp excluded-address 192.168.10.10
ip dhcp excluded-address 192.168.20.254
ip dhcp excluded-address 192.168.30.254
ip dhcp excluded-address 192.168.40.254
```

**Pool PERSONNEL :**

```
ip dhcp pool POOL_PERSONNEL
network 192.168.20.0 255.255.255.0
default-router 192.168.20.254
dns-server 192.168.10.10
exit
```

**Pool PRODUCTION :**

```
ip dhcp pool POOL_PRODUCTION
network 192.168.30.0 255.255.255.0
default-router 192.168.30.254
dns-server 192.168.10.10
exit
```

**Enregistrement :**

```
end
write
```

---

## Partie 3 : Serveur (VLAN Admin)

Configuration IP statique :

```
IP : 192.168.10.10
Masque : 255.255.255.0
Gateway : 192.168.10.254
```

---

## Validation

### Schéma Packet Tracer

![Maquette de Cisco](cisco.png)

### Tests de connectivité

![Ping VLAN](ping.png)

---

À compléter lors du TP3 : configuration des services web et DNS.