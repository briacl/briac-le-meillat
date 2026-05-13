

Objectif
Ajouter à la maquette du TP n°1 un routeur pour router les paquets entre les VLAN (On peut choisir les VLAN qui peuvent communiquer entre eux). Méthode 'Router On A Stick' ("un routeur sur un bâton").

on reprend la config du tp1

R1(config)#interface gigabitEthernet 0/0.1
R1(config-subif)#encapsulation dot1q 10
R1(config-subif)#ip address 192.168.10.1 255.255.255.0
R1(config-subif)#interface gigabitEthernet 0/0.2
R1(config-subif)#encapsulation dot1q 20
R1(config-subif)#ip address 192.168.20.1 255.255.255.0
R1(config-subif)#int gigabitEthernet 0/0
R1(config-if)#no shutdown

