# SAE 102 : Briac Le Meillat

---

### 1. Caractéristiques de la VM

Pour le déploiement, la machine virtuelle Linux Ubuntu respectera les prérequis suivants :

* **Mémoire RAM :** 1-2 GB.
* **Stockage :** 20 GB de disque.
* **Processeur :** Allocation de 1 ou 2 cœurs.

---

### 2. Sélection des Composants Réseau

#### Switch Cisco Catalyst 2960-24TT-L

Ce commutateur est le point central de l'installation. Il dispose de 24 ports FastEthernet pour les machines et de 2 ports GigabitEthernet pour le lien avec le routeur. Un seul appareil est nécessaire.

#### Routeur Cisco 829

Retenu pour sa fiabilité, il permet d'assurer la communication entre les différents segments (VLANs) grâce à son port Gigabit.

---

### 3. Planification de l'Adressage IP

| Service | VLAN | Passerelle de sortie |
| --- | --- | --- |
| Administration | **10** | 192.168.10.1/24 |
| Personnel | **20** | 192.168.20.1/24 |
| Production | **30** | 192.168.30.1/24 |
| Vidéosurveillance | **40** | 192.168.40.1/24 |
| Serveurs | **800** | 192.168.80.1/24 |

---

### 4. Proposition Commerciale

| Article | Quantité | Prix U. HT | Sous-total |
| --- | --- | --- | --- |
| Cisco 829 (Routeur) | 1 | 450 € | 450 € |
| Cisco 2960-24TT-L (Switch) | 1 | 350 € | 350 € |
| Câblage RJ45 Catégorie 6 (3m) | 10 | 5 € | 50 € |
|  |  | **NET HT** | **850 €** |
|  |  | **TVA (20%)** | **170 €** |
|  |  | **MONTANT TTC** | **1 020 €** |

---

### 5. Schéma

![Schéma complet](SHEMA.png)