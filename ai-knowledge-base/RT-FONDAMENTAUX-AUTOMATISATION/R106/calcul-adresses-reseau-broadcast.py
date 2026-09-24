

#!python3

# but : Coder le script Python permettant de retrouver les adresses de réseau et de broadcast en utilisant des opérateurs bit à bit

# Bienvenue dans le programme calcul_adresses_reseau_broadcast

ip_address = [192, 168, 1, 1]
subnet_mask = [255, 255, 255, 0]

network_address = []
for i in range (4):
    network_address.append(ip_address[i] & subnet_mask[i])
print(network_address)

broadcast_address = []
for i in range (4):
    broadcast_address.append(network_address[i] | (subnet_mask[i] ^ 255))
print(broadcast_address)


