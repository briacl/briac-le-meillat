import pandas as pd
import os

class MedConnectSystem:
    def __init__(self, data_dir='data'):
        self.data_dir = data_dir
        self.medications = pd.read_csv(f'{data_dir}/medications.csv')
        self.patients = pd.read_csv(f'{data_dir}/patients.csv')
        self.doctors = pd.read_csv(f'{data_dir}/doctors.csv')
        self.prescriptions = pd.read_csv(f'{data_dir}/prescriptions.csv')
        self.items = pd.read_csv(f'{data_dir}/prescription_items.csv')
        self.logs = pd.read_csv(f'{data_dir}/adherence_logs.csv')
        
    def get_patient_summary(self, patient_id):
        """Returns a dict summary of the patient."""
        patient = self.patients[self.patients['id'] == patient_id]
        if patient.empty:
            return None
        return patient.iloc[0].to_dict()

    def calculate_adherence_score(self, patient_id):
        """
        Calculates the adherence score (0-100) based on verified scans.
        Formula: (Scanned / Total "TAKEN" or "MISSED" events) * 100
        """
        user_logs = self.logs[self.logs['patient_id'] == patient_id]
        if user_logs.empty:
            return 0.0
            
        total_events = len(user_logs)
        confirmed_scans = len(user_logs[user_logs['scan_confirmed'] == True])
        
        return round((confirmed_scans / total_events) * 100, 2)

    def get_active_prescriptions(self, patient_id):
        """Returns details of active prescriptions for a patient."""
        # Simple logic: just retrive all linked to patient for now
        # In real world, check current date vs end_date
        user_prescs = self.prescriptions[self.prescriptions['patient_id'] == patient_id]
        results = []
        
        for _, presc in user_prescs.iterrows():
            doc = self.doctors[self.doctors['id'] == presc['doctor_id']].iloc[0]
            # Get meds
            items = self.items[self.items['prescription_id'] == presc['id']]
            med_names = []
            for _, item in items.iterrows():
                med_name = self.medications[self.medications['id'] == item['medication_id']].iloc[0]['name']
                med_names.append(med_name)
                
            results.append({
                "doctor": f"Dr. {doc['last_name']}",
                "start": presc['start_date'],
                "end": presc['end_date'],
                "medications": med_names
            })
        return results

    def get_random_patient_id(self):
        """Helper for demo purposes"""
        return self.patients.sample(1).iloc[0]['id']

    def identify_at_risk_seniors(self, threshold=50.0):
        """
        Finds seniors with adherence score below threshold.
        This corresponds to the 'Botoun SOS Aidant' or monitoring feature.
        """
        seniors = self.patients[self.patients['is_senior'] == True]
        at_risk = []
        
        for _, senior in seniors.iterrows():
            score = self.calculate_adherence_score(senior['id'])
            if score < threshold:
                at_risk.append({
                    "name": f"{senior['first_name']} {senior['last_name']}",
                    "score": score
                })
        return at_risk
