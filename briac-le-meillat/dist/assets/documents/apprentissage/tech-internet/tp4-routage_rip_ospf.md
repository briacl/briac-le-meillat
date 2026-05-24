# 📄 Compte-Rendu de TP : Routage RIP et OSPF en réel (Cisco physique)

**Objectif principal :** Configurer une topologie réseau réelle avec des switchs et routeurs Cisco (1941/2960) et mettre en place les protocoles de routage dynamique RIP et OSPF.

---

## 🛠️ Architecture

> [!NOTE]
> Modèles : Switch = Cisco 2960-24TT | Routeur = Cisco 1941 | Câbles série (rouge) entre R1↔R2 et R2↔R3.

> [!WARNING]
> Les noms d'interfaces réels peuvent varier. Toujours vérifier avec `show ip interface brief`. PC2 est en `.20` sur ce schéma, vérifier l'adresse réelle avant configuration.

### Adressage IP
| Interface / Machine | IP à configurer | Masque | Remarque |
| :--- | :--- | :--- | :--- |
| PC1 (poste .10) | 192.168.1.10 | 255.255.255.0 | Passerelle : 192.168.1.1 |
| R1 – Gig0/0 → SW1 | 192.168.1.1 | 255.255.255.0 | Vers PC1 |
| R1 – Se0/1/0 → R2 | 10.1.0.1 | 255.255.0.0 | DCE → clock rate obligatoire |
| R2 – Se0/1/0 → R1 | 10.1.0.2 | 255.255.0.0 | Vers R1 |
| R2 – Se0/1/1 → R3 | 10.2.0.2 | 255.255.0.0 | DCE → clock rate obligatoire |
| R3 – Se0/1/0 → R2 | 10.2.0.1 | 255.255.0.0 | Vers R2 |
| R3 – Gig0/0 → SW2 | 192.168.2.1 | 255.255.255.0 | Vers PC2 |
| PC2 (poste .20) | 192.168.2.20 | 255.255.255.0 | Passerelle : 192.168.2.1 |

---

## 🔌 Partie 1 : Préparation et Connexions

### 📝 1. Dessiner le schéma sur papier
Noter les noms réels, adresses IP, interfaces, et ports utilisés avant tout branchement.

### 🔌 2. Branchements Physiques
*   **PC1** --> port Fa0/1 de SW1 (câble droit RJ45)
*   **SW1** --> port Fa0/2 vers R1 Gig0/0 (câble droit RJ45)
*   **R1 Se0/1/0** --> R2 Se0/1/0 (câble série DB60 – câble rouge)
*   **R2 Se0/1/1** --> R3 Se0/1/0 (câble série DB60 – câble rouge)
*   **R3 Gig0/0** --> port Fa0/2 de SW2 (câble droit RJ45)
*   **SW2** --> port Fa0/1 vers PC2 (câble droit RJ45)

### 🖥️ 3. Configurer les PC
**Sur PC1 :** IP `192.168.1.10` / Masque `255.255.255.0` / Passerelle `192.168.1.1`
**Sur PC2 :** IP `192.168.2.20` (ou `.10` selon le poste) / Masque `255.255.255.0` / Passerelle `192.168.2.1`

---

## ⚙️ Partie 2 : Configuration des Routeurs

### 4. Configurer les interfaces de R1 (via console)
```bash
Router> enable
Router# configure terminal
Router(config)# hostname R1

R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit

R1(config)# interface Serial0/1/0
R1(config-if)# ip address 10.1.0.1 255.255.0.0
R1(config-if)# clock rate 128000           ! R1 est côté DCE
R1(config-if)# no shutdown
R1(config-if)# end

R1# copy running-config startup-config
```

### 5. Configurer les interfaces de R2 (via console)
```bash
Router(config)# hostname R2

R2(config)# interface Serial0/1/0          ! vers R1
R2(config-if)# ip address 10.1.0.2 255.255.0.0
R2(config-if)# no shutdown
R2(config-if)# exit

R2(config)# interface Serial0/1/1          ! vers R3
R2(config-if)# ip address 10.2.0.2 255.255.0.0
R2(config-if)# clock rate 128000           ! R2 est côté DCE sur ce lien
R2(config-if)# no shutdown
R2(config-if)# end

R2# copy running-config startup-config
```

### 6. Configurer les interfaces de R3 (via console)
```bash
Router(config)# hostname R3

R3(config)# interface GigabitEthernet0/0
R3(config-if)# ip address 192.168.2.1 255.255.255.0
R3(config-if)# no shutdown
R3(config-if)# exit

R3(config)# interface Serial0/1/0          ! vers R2
R3(config-if)# ip address 10.2.0.1 255.255.0.0
R3(config-if)# no shutdown
R3(config-if)# end

R3# copy running-config startup-config
```

### ✅ 7. Vérifier les interfaces avant RIP/OSPF
```bash
R1# show ip interface brief
R2# show ip interface brief
R3# show ip interface brief
```
*Toutes les interfaces doivent être `UP/UP`.*

---

## 📡 Partie 3 : Routage Dynamique (RIP et OSPF)

### 8. Configurer RIP sur les 3 routeurs
**Sur R1 :**
```bash
R1(config)# router rip
R1(config-router)# version 2
R1(config-router)# no auto-summary
R1(config-router)# network 192.168.1.0
R1(config-router)# network 10.1.0.0
R1(config-router)# end
```

**Sur R2 :**
```bash
R2(config)# router rip
R2(config-router)# version 2
R2(config-router)# no auto-summary
R2(config-router)# network 10.1.0.0
R2(config-router)# network 10.2.0.0
R2(config-router)# end
```

**Sur R3 :**
```bash
R3(config)# router rip
R3(config-router)# version 2
R3(config-router)# no auto-summary
R3(config-router)# network 192.168.2.0
R3(config-router)# network 10.2.0.0
R3(config-router)# end
```

### ✅ 9. Montrer RIP à l'enseignant
```bash
R1# show ip route   # routes R visibles
# Ping PC1 → PC2 : doit fonctionner
```

### 🗑️ 10. Désactiver RIP
```bash
R1(config)# no router rip
R2(config)# no router rip
R3(config)# no router rip
```

### 📡 11. Configurer OSPF sur les 3 routeurs
**Sur R1 :**
```bash
R1(config)# router ospf 1
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# network 10.1.0.0 0.0.255.255 area 0
R1(config-router)# end
```

**Sur R2 :**
```bash
R2(config)# router ospf 1
R2(config-router)# network 10.1.0.0 0.0.255.255 area 0
R2(config-router)# network 10.2.0.0 0.0.255.255 area 0
R2(config-router)# end
```

**Sur R3 :**
```bash
R3(config)# router ospf 1
R3(config-router)# network 192.168.2.0 0.0.0.255 area 0
R3(config-router)# network 10.2.0.0 0.0.255.255 area 0
R3(config-router)# end
```

### ✅ 12. Montrer OSPF à l'enseignant
```bash
R1# show ip route                  # routes O visibles
R1# show ip protocols              # vérifie qu'OSPF est actif
R1# show ip ospf neighbor          # vérifie les voisins OSPF détectés
```

---

### 📝 Mémo – Distances administratives
| Protocole | Distance administrative |
| :--- | :--- |
| Route directement connectée (C) | 0 |
| Route statique (S) | 1 |
| OSPF (O) | 110 |
| RIP (R) | 120 |

> [!NOTE]
> Si OSPF et RIP donnent une route vers la même destination, le routeur prend OSPF (110 < 120).
