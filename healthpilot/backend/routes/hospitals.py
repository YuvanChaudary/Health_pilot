from flask import Blueprint, request, jsonify
from models.init_db import db, Hospital
import csv
import os

hospital_bp = Blueprint('hospital_bp', __name__, url_prefix="/api")

# 🔹 Disease to specialty mapping
DISEASE_SPECIALTY_MAP = {
    "heart attack": "Cardiology",
    "diabetes": "Endocrinology",
    "arthritis": "Orthopedics",
    "brain tumor": "Neurology",
    "asthma": "Pulmonology",
    "cancer": "Oncology",
    "fracture": "Orthopedics",
    "thyroid": "Endocrinology",
    "epilepsy": "Neurology",
    "pneumonia": "Pulmonology",
    "child health": "Pediatrics",
    "general checkup": "General"
}
# 🔹 Search hospitals
@hospital_bp.route('/hospitals/search', methods=['GET'])
def search_hospitals():
    name = request.args.get('search', '').lower()
    specialty = request.args.get('specialty', '').lower()
    disease = request.args.get('disease', '').lower()

    if disease and not specialty:
        mapped = DISEASE_SPECIALTY_MAP.get(disease)
        if mapped:
            specialty = mapped.lower()

    query = Hospital.query
    if name:
        query = query.filter(Hospital.name.ilike(f"%{name}%"))
    if specialty:
        query = query.filter(Hospital.specialty.ilike(f"%{specialty}%"))

    hospitals = query.all()
    return jsonify({ "hospitals": [serialize_hospital(h) for h in hospitals] })

# 🔹 Autocomplete suggestions
@hospital_bp.route('/hospitals/suggest', methods=['GET'])
def suggest_hospital_names():
    query = request.args.get('query', '').lower()
    if not query or len(query) < 2:
        return jsonify({ "suggestions": [] })

    matches = Hospital.query.filter(Hospital.name.ilike(f"%{query}%")).limit(10).all()
    suggestions = [h.name for h in matches if h.name]
    return jsonify({ "suggestions": suggestions })

# 🔹 Ingest hospitals from CSV
@hospital_bp.route('/hospitals/ingest', methods=['POST'])
def ingest_hospitals():
    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../dataset/hospitals.csv'))
    if not os.path.exists(csv_path):
        return jsonify({ "error": "CSV file not found." }), 404

    Hospital.query.delete()
    db.session.commit()

    with open(csv_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            hospital = Hospital(
                name=row['name'],
                address=row['address'],
                city=row['city'],
                specialty=row['specialty'],
                website=row['website'],
                mobile=row['mobile'],
                map_link=row['map_link']
            )
            db.session.add(hospital)
        db.session.commit()

    return jsonify({ "message": "✅ Hospitals ingested successfully." })

# 🔹 Serialize hospital for frontend
def serialize_hospital(h):
    specialty_key = h.specialty.lower() if h.specialty else ""

    return {
        "id": h.id,
        "name": h.name,
        "address": f"{h.name}, {h.address}",  # ✅ Show hospital name in address
        "city": h.city,
        "specialty": h.specialty,
        "website": h.website,
        "mobile": h.mobile,
        "map": h.map_link
    }
