from flask import Blueprint, request, jsonify
import sqlite3
import os

discovery_bp = Blueprint('discovery_bp', __name__)

@discovery_bp.route('/api/discovery', methods=['GET'])
def discover_health_options():
    disease = request.args.get('disease')
    print("🔍 Requested disease:", disease)

    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../dataset/healthpilot.db'))
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Step 1: Medicines
    cursor.execute("SELECT medicine, cost, annual_cost, side_effects FROM medicines WHERE LOWER(disease) LIKE ?", ('%' + disease.lower() + '%',))
    med_rows = cursor.fetchall()
    medicines = []
    for name, cost, annual, effects in med_rows:
        medicines.append({
            "name": name,
            "cost": cost,
            "annual_cost": annual,
            "side_effects": effects
        })

    # Deduplicate
    unique_meds = {}
    for med in medicines:
        if med["name"] not in unique_meds:
            unique_meds[med["name"]] = med
    medicines = list(unique_meds.values())

    # Step 2: Pharmacies
    pharmacy_results = []
    for med in medicines:
        med_lower = med["name"].lower()
        cursor.execute("SELECT name, address, price FROM pharmacies WHERE LOWER(medicine) LIKE ?", ('%' + med_lower + '%',))
        rows = cursor.fetchall()
        for name, address, price in rows:
            pharmacy_results.append({
                "medicine": med["name"],
                "pharmacy": name,
                "address": address,
                "price": price
            })

    if not pharmacy_results:
        pharmacy_results.append({
            "medicine": "N/A",
            "pharmacy": "No pharmacies found",
            "address": "—",
            "price": "—"
        })

    # Step 3: Hospitals
    disease_to_specialty = {
        "Asthma": "Pulmonology",
        "Diabetes": "Diabetology",
        "Heart Attack": "Cardiology",
        "Skin Rash": "Dermatology",
        "Pregnancy": "Obstetrics",
        "Epilepsy": "Neurology",
        "Cancer": "Oncology",
        "Fever": "General Medicine"
    }
    specialty = disease_to_specialty.get(disease, "General Medicine")
    cursor.execute("SELECT name, address FROM hospitals WHERE LOWER(specialty) LIKE ?", ('%' + specialty.lower() + '%',))
    hospitals = [{"name": name, "address": address} for name, address in cursor.fetchall()]

    # Step 4: Specialists
    try:
        cursor.execute("SELECT name, address FROM specialists WHERE LOWER(specialty) LIKE ?", ('%' + specialty.lower() + '%',))
        specialists = [{"name": name, "address": address} for name, address in cursor.fetchall()]
    except sqlite3.OperationalError:
        specialists = []

    conn.close()

    return jsonify({
        "disease": disease,
        "medicines": medicines,
        "pharmacies": pharmacy_results,
        "hospitalList": hospitals,
        "specialistList": specialists
    })
