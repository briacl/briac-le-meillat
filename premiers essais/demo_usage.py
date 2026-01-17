from medconnect_system import MedConnectSystem

def main():
    print("Initializing MedConnect System...")
    try:
        system = MedConnectSystem()
    except FileNotFoundError:
        print("Error: Data files not found. Run 'generate_data.py' first.")
        return

    print("\n--- DEMO 1: Individual Patient Check ---")
    # Pick a random patient
    pid = system.get_random_patient_id()
    summary = system.get_patient_summary(pid)
    
    print(f"Patient: {summary['first_name']} {summary['last_name']} (Senior: {summary['is_senior']})")
    
    score = system.calculate_adherence_score(pid)
    print(f"Adherence Score (Scan validés): {score}%")
    
    print("Active Prescriptions:")
    prescs = system.get_active_prescriptions(pid)
    for p in prescs:
        print(f"  - Dr. {p['doctor']} ({p['start']} to {p['end']})")
        print(f"    Meds: {', '.join(p['medications'])}")

    print("\n--- DEMO 2: High Risk Senior Detection ---")
    print("Scanning for seniors with < 60% adherence (potential SOS case)...")
    at_risk = system.identify_at_risk_seniors(threshold=60.0)
    
    if at_risk:
        print(f"Found {len(at_risk)} seniors at risk. Top 5:")
        for p in at_risk[:5]:
            print(f"  [ALERT] {p['name']} - Score: {p['score']}%")
    else:
        print("No high-risk seniors found.")

if __name__ == "__main__":
    main()
