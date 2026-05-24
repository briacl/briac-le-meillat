# 📄 Compte-Rendu de TP : Switchs et Routeurs : utilisations de base

**Objectif principal :** Configurer des switchs et des routeurs pour des réseaux simples (1 routeur/2 réseaux et 2 routeurs/3 réseaux) et mettre en place le routage statique.

---

## 🛠️ Partie 1 – 1 routeur, 2 réseaux

**Topologie visée :**
`PC1 --- Switch1 --- Routeur --- Switch2 --- PC2`
*(192.168.1.0/24)*          *(192.168.2.0/24)*

### Adressage IP
| Équipement | IP à configurer | Masque | Passerelle |
| :--- | :--- | :--- | :--- |
| PC1 | 192.168.1.10 | 255.255.255.0 | 192.168.1.1 |
| Routeur – GigabitEthernet0/0 (côté PC1) | 192.168.1.1 | 255.255.255.0 | — |
| Routeur – GigabitEthernet0/1 (côté PC2) | 192.168.2.1 | 255.255.255.0 | — |
| PC2 | 192.168.2.10 | 255.255.255.0 | 192.168.2.1 |

### 🔌 1. Branchements Physiques
Réaliser les connexions suivantes :
*   **PC1** --> port Fa0/1 (ou Fa0/x) de Switch1
*   **Switch1** --> port GigabitEthernet0/0 du Routeur (câble droit)
*   **Switch2** --> port GigabitEthernet0/1 du Routeur (câble droit)
*   **PC2** --> port Fa0/1 (ou Fa0/x) de Switch2

*Note : Vérifier les voyants (orange = initialisation, vert = actif)*

### ⚙️ 2. Configuration du Routeur
```bash
Router> enable
Router# configure terminal
Router(config)# hostname R1

# Interface côté PC1 :
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit

# Interface côté PC2 :
R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip address 192.168.2.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# end

R1# write memory    ! ou : copy running-config startup-config
```

### 🖥️ 3. Configuration des PC
**Sur PC1 :**
*   **IP :** 192.168.1.10
*   **Masque :** 255.255.255.0
*   **Passerelle :** 192.168.1.1

**Sur PC2 :**
*   **IP :** 192.168.2.10
*   **Masque :** 255.255.255.0
*   **Passerelle :** 192.168.2.1

### ✅ 4. Vérifications
```bash
R1# show ip interface brief      # toutes les interfaces UP/UP
R1# show ip route                # routes connectées visibles
Switch1# show mac address-table  # adresses MAC apprises

# Depuis PC1 :
ping 192.168.2.10                # doit répondre
```

---

## 🔀 Partie 2 – 2 routeurs, 3 réseaux

### Adressage IP
| Équipement | IP à configurer | Masque | Passerelle |
| :--- | :--- | :--- | :--- |
| PC1 | 192.168.1.10 | 255.255.255.0 | 192.168.1.1 |
| R1 – GigabitEthernet0/0 (vers Switch1) | 192.168.1.1 | 255.255.255.0 | — |
| R1 – GigabitEthernet0/1 (lien R1↔R2) | 192.168.3.1 | 255.255.255.0 | — |
| R2 – GigabitEthernet0/0 (lien R1↔R2) | 192.168.3.2 | 255.255.255.0 | — |
| R2 – GigabitEthernet0/1 (vers Switch2) | 192.168.2.1 | 255.255.255.0 | — |
| PC2 | 192.168.2.10 | 255.255.255.0 | 192.168.2.1 |

### 🔌 1. Branchements Physiques
*   **PC1** --> port Fa0/x de Switch1
*   **Switch1** --> GigabitEthernet0/0 de R1 (câble droit)
*   **R1** --> GigabitEthernet0/1 vers R2 (câble croisé ou droit selon les ports)
*   **R2** --> GigabitEthernet0/1 vers Switch2 (câble droit)
*   **PC2** --> port Fa0/x de Switch2

### ⚙️ 2. Configuration de R1
```bash
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit

R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip address 192.168.3.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# end

R1# write memory
```

### ⚙️ 3. Configuration de R2
```bash
R2(config)# interface GigabitEthernet0/0
R2(config-if)# ip address 192.168.3.2 255.255.255.0
R2(config-if)# no shutdown
R2(config-if)# exit

R2(config)# interface GigabitEthernet0/1
R2(config-if)# ip address 192.168.2.1 255.255.255.0
R2(config-if)# no shutdown
R2(config-if)# end

R2# write memory
```

### 🖥️ 4. Configuration des PC
*   **PC1 :** IP `192.168.1.10` / Masque `255.255.255.0` / Passerelle `192.168.1.1`
*   **PC2 :** IP `192.168.2.10` / Masque `255.255.255.0` / Passerelle `192.168.2.1`

### 🗺️ 5. Routes Statiques (obligatoires)
> [!IMPORTANT]
> Sans cette étape, PC1 et PC2 ne peuvent pas se pinguer. R1 ne sait pas où est 192.168.2.0 et R2 ne sait pas où est 192.168.1.0.

**Sur R1 (pour atteindre le réseau de PC2) :**
```bash
R1(config)# ip route 192.168.2.0 255.255.255.0 192.168.3.2
```
*Explication : réseau dest = 192.168.2.0, masque = 255.255.255.0, next-hop = IP de R2 sur le lien R1-R2 (192.168.3.2)*

**Sur R2 (pour atteindre le réseau de PC1) :**
```bash
R2(config)# ip route 192.168.1.0 255.255.255.0 192.168.3.1
```
*Explication : réseau dest = 192.168.1.0, masque = 255.255.255.0, next-hop = IP de R1 sur le lien R1-R2 (192.168.3.1)*

### ✅ 6. Vérifications
```bash
R1# show ip route              # doit voir une route S vers 192.168.2.0
R2# show ip route              # doit voir une route S vers 192.168.1.0
R1# show ip interface brief    # toutes les interfaces UP/UP

# Depuis PC1 :
ping 192.168.2.10   # doit répondre
```
