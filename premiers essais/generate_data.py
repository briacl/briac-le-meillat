import pandas as pd
from faker import Faker
import random
from datetime import datetime, timedelta
import os

# Initialize Faker
fake = Faker('fr_FR')
random.seed(42)  # For reproducibility

DATA_DIR = 'data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# --- 1. Medications ---
# Hardcoded realistic list
MEDICATIONS_DB = [
    {"name": "Doliprane 1000mg", "type": "Antalgique", "stock_price": 2.50},
    {"name": "Amoxicilline 500mg", "type": "Antibiotique", "stock_price": 5.20},
    {"name": "Kardégic 75mg", "type": "Cardiovasculaire", "stock_price": 3.80},
    {"name": "Spasfon", "type": "Antispasmodique", "stock_price": 3.10},
    {"name": "Ventoline 100µg", "type": "Pneumologie", "stock_price": 6.50},
    {"name": "Levothyrox 100µg", "type": "Endocrinologie", "stock_price": 4.10},
    {"name": "Tahor 20mg", "type": "Cardiovasculaire", "stock_price": 12.30},
    {"name": "Forlax 10g", "type": "Gastro-entérologie", "stock_price": 6.00},
    {"name": "Eludril", "type": "Bain de bouche", "stock_price": 3.50},
    {"name": "Voltène Emulgel", "type": "Anti-inflammatoire", "stock_price": 7.90},
]

def generate_medications():
    print("Generating Medications...")
    df = pd.DataFrame(MEDICATIONS_DB)
    df['id'] = range(1, len(df) + 1)
    df['ean13'] = [fake.ean13() for _ in range(len(df))]
    df.to_csv(f'{DATA_DIR}/medications.csv', index=False)
    return df

# --- 2. Pharmacies ---
def generate_pharmacies(n=5):
    print(f"Generating {n} Pharmacies...")
    pharmacies = []
    for _ in range(n):
        pharmacies.append({
            "id": fake.uuid4(),
            "name": f"Pharmacie {fake.last_name()}",
            "address": fake.address(),
            "city": fake.city(),
            "latitude": fake.latitude(),
            "longitude": fake.longitude()
        })
    df = pd.DataFrame(pharmacies)
    df.to_csv(f'{DATA_DIR}/pharmacies.csv', index=False)
    return df

# --- 3. Doctors ---
def generate_doctors(n=20):
    print(f"Generating {n} Doctors...")
    doctors = []
    specialties = ["Généraliste", "Cardiologue", "Dermatologue", "ORL", "Pédiatre"]
    for _ in range(n):
        doctors.append({
            "id": fake.uuid4(),
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "specialty": random.choice(specialties),
            "address": fake.address(),
            "email": fake.email()
        })
    df = pd.DataFrame(doctors)
    df.to_csv(f'{DATA_DIR}/doctors.csv', index=False)
    return df

# --- 4. Patients ---
def generate_patients(n=100):
    print(f"Generating {n} Patients...")
    patients = []
    for _ in range(n):
        is_senior = random.random() > 0.7  # 30% seniors
        age = random.randint(65, 95) if is_senior else random.randint(18, 64)
        patients.append({
            "id": fake.uuid4(),
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "birth_date": fake.date_of_birth(minimum_age=age, maximum_age=age).isoformat(),
            "email": fake.email(),
            "is_senior": is_senior,
            "address": fake.address()
        })
    df = pd.DataFrame(patients)
    df.to_csv(f'{DATA_DIR}/patients.csv', index=False)
    return df

# --- 5. Prescriptions ---
def generate_prescriptions(patients_df, doctors_df, n_per_patient=2):
    print("Generating Prescriptions...")
    prescriptions = []
    
    for _, patient in patients_df.iterrows():
        # Random number of prescriptions per patient
        num_scripts = random.randint(1, n_per_patient)
        for _ in range(num_scripts):
            doctor = doctors_df.sample(1).iloc[0]
            start_date = fake.date_between(start_date='-60d', end_date='today')
            duration_days = random.choice([7, 14, 30, 90])
            end_date = start_date + timedelta(days=duration_days)
            
            presc_id = fake.uuid4()
            prescriptions.append({
                "id": presc_id,
                "patient_id": patient['id'],
                "doctor_id": doctor['id'],
                "start_date": start_date,
                "end_date": end_date,
                "duration_days": duration_days
            })
            
    df = pd.DataFrame(prescriptions)
    df.to_csv(f'{DATA_DIR}/prescriptions.csv', index=False)
    return df

# --- 6. Prescription Items (Meds in Prescription) ---
def generate_prescription_items(prescriptions_df, medications_df):
    print("Linking Meds to Prescriptions...")
    items = []
    frequencies = ["Mantin", "Matin et Soir", "Matin, Midi, Soir", "Au coucher"]
    
    for _, presc in prescriptions_df.iterrows():
        # 1 to 3 meds per prescription
        meds = medications_df.sample(random.randint(1, 4))
        for _, med in meds.iterrows():
            items.append({
                "prescription_id": presc['id'],
                "medication_id": med['id'],
                "frequency": random.choice(frequencies),
                "qty_per_take": random.randint(1, 2)
            })
    
    df = pd.DataFrame(items)
    df.to_csv(f'{DATA_DIR}/prescription_items.csv', index=False)
    return df

# --- 7. Adherence Logs (The Core Logic) ---
def generate_adherence_logs(prescriptions_df, items_df):
    print("Generating Adherence Logs...")
    logs = []
    
    # Pre-process items for faster lookup
    presc_items_map = items_df.groupby('prescription_id')['medication_id'].apply(list).to_dict()
    
    for _, presc in prescriptions_df.iterrows():
        # Iterate through the duration of the prescription
        start = presc['start_date']
        end = presc['end_date']
        duration = (end - start).days
        
        meds = presc_items_map.get(presc['id'], [])
        
        # Simulate adhering days (until today)
        today = datetime.today().date()
        current_date = start
        
        while current_date <= end and current_date <= today:
            for med_id in meds:
                # 3 "takes" per day simulation for simplicity
                for time_slot in ["Matin", "Midi", "Soir"]:
                    should_take = random.random() > 0.3 # Assume they need to take it 70% of slots usually
                    if should_take:
                        # Did they actually take it?
                        taken = random.random() > 0.1 # 90% adherence if they needed to take it
                        
                        # Did they scan it? (Proof)
                        scanned = taken and (random.random() > 0.2) # Sometimes they take but forget to scan
                        
                        logs.append({
                            "log_id": fake.uuid4(),
                            "prescription_id": presc['id'],
                            "patient_id": presc['patient_id'],
                            "medication_id": med_id,
                            "date": current_date,
                            "time_slot": time_slot,
                            "status": "TAKEN" if taken else "MISSED",
                            "scan_confirmed": scanned,
                            "symptom_reported": None if taken else "Oubli"
                        })
            current_date += timedelta(days=1)
            
    df = pd.DataFrame(logs)
    df.to_csv(f'{DATA_DIR}/adherence_logs.csv', index=False)
    return df

def main():
    print("--- Starting Data Generation for MedConnect ---")
    meds_df = generate_medications()
    pharm_df = generate_pharmacies()
    docs_df = generate_doctors()
    patients_df = generate_patients(n=200) # Increased to 200
    presc_df = generate_prescriptions(patients_df, docs_df)
    items_df = generate_prescription_items(presc_df, meds_df)
    generate_adherence_logs(presc_df, items_df)
    print("--- Data Generation Complete. Check 'data/' folder. ---")

if __name__ == "__main__":
    main()
