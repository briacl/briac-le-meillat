# TP 1 : Segmentation par VLAN et Routage Trunk

**Auteur :** Briac Le Meillat

**Date :** Février 2026

**Projet :** Administration Réseau — Cisco IOS

---

## Objectif
Segmenter un réseau à l'aide de VLAN et configurer un trunk entre les deux switchs


Switch> enable
Switch# configure terminal
Switch(config)# hostname SW1
SW1(config)#

SW1(config)# vlan 10
SW1(config-vlan)# name "VLAN 10"
SW1(config-vlan)# exit
SW1(config)#

SW1(config)# interface fastEthernet 0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# no shutdown

SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# switchport mode trunk
SW1(config-if)# no shutdown

SW1# show vlan brief

SW1# show interfaces trunk

