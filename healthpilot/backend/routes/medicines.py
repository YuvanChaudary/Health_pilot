from flask import Blueprint, request, jsonify
import sqlite3
import os
from difflib import get_close_matches

medicine_bp = Blueprint('medicine_bp', __name__, url_prefix="/api")

# ✅ Route: Get all medicines
@medicine_bp.route('/medicines', methods=['GET'])
def get_all_medicines():
    db_path = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'healthpilot.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT disease, medicine, cost, annual_cost, symptoms, side_effects, drug_interactions
        FROM medicines
    """)
    results = cursor.fetchall()
    conn.close()

    return jsonify([
        {
            "disease": row[0],
            "medicine": row[1],
            "cost": row[2],
            "annual_cost": row[3],
            "symptoms": row[4].split(",") if row[4] else [],
            "side_effects": row[5].split(",") if row[5] else [],
            "drug_interactions": row[6].split(",") if row[6] else []
        }
        for row in results
    ])

# ✅ Route: Search + fuzzy match + filters + sort
@medicine_bp.route('/medicines/search', methods=['GET'])
def search_medicines():
    disease = request.args.get("disease", "").lower()
    medicine = request.args.get("medicine", "").lower()
    symptom = request.args.get("symptom", "").lower()
    side_effect = request.args.get("side_effect", "").lower()
    min_annual = request.args.get("min_annual", "")
    max_annual = request.args.get("max_annual", "")
    sort_by = request.args.get("sort", "").lower()
    sort_order = request.args.get("order", "asc").lower()

    db_path = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'healthpilot.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT disease, medicine, cost, annual_cost, symptoms, side_effects, drug_interactions
        FROM medicines
    """)
    rows = cursor.fetchall()
    conn.close()

    # ✅ Convert to structured dicts
    medicines = []
    for row in rows:
        medicines.append({
            "disease": row[0],
            "medicine": row[1],
            "cost": row[2],
            "annual_cost": row[3],
            "symptoms": row[4].split(",") if row[4] else [],
            "side_effects": row[5].split(",") if row[5] else [],
            "drug_interactions": row[6].split(",") if row[6] else []
        })

    # ✅ Fuzzy match disease/medicine
    def fuzzy_match(value, options):
        matches = get_close_matches(value, options, n=1, cutoff=0.6)
        return matches[0] if matches else value

    if disease:
        all_diseases = [m["disease"].lower() for m in medicines]
        disease = fuzzy_match(disease, all_diseases)
        medicines = [m for m in medicines if disease in m["disease"].lower()]

    if medicine:
        all_meds = [m["medicine"].lower() for m in medicines]
        medicine = fuzzy_match(medicine, all_meds)
        medicines = [m for m in medicines if medicine in m["medicine"].lower()]

    if symptom:
        medicines = [m for m in medicines if any(symptom in s.lower() for s in m["symptoms"])]

    if side_effect:
        medicines = [m for m in medicines if any(side_effect in s.lower() for s in m["side_effects"])]

    if min_annual:
        medicines = [m for m in medicines if m["annual_cost"] and m["annual_cost"] >= float(min_annual)]

    if max_annual:
        medicines = [m for m in medicines if m["annual_cost"] and m["annual_cost"] <= float(max_annual)]

    if sort_by in ["cost", "annual_cost"]:
        medicines.sort(key=lambda m: m.get(sort_by, 0), reverse=(sort_order == "desc"))

    return jsonify(medicines)

# ✅ Route: Autocomplete for disease or medicine
@medicine_bp.route('/medicines/suggest', methods=['GET'])
def suggest_medicine_fields():
    field = request.args.get("field", "").lower()
    query = request.args.get("query", "").lower()

    if field not in ["disease", "medicine"]:
        return jsonify({ "suggestions": [] })

    db_path = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'healthpilot.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute(f"""
        SELECT DISTINCT {field}
        FROM medicines
        WHERE LOWER({field}) LIKE ?
        LIMIT 10
    """, (f"%{query}%",))

    results = [row[0] for row in cursor.fetchall()]
    conn.close()

    return jsonify({ "suggestions": results })

# ✅ Route: Dropdown suggestions for symptoms and side effects
@medicine_bp.route('/medicines/suggest-tags', methods=['GET'])
def suggest_tags():
    field = request.args.get("field", "").lower()
    if field not in ["symptoms", "side_effects"]:
        return jsonify({ "suggestions": [] })

    db_path = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'healthpilot.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute(f"SELECT {field} FROM medicines")
    rows = cursor.fetchall()
    conn.close()

    # ✅ Flatten and deduplicate tags
    tags = set()
    for row in rows:
        if row[0]:
            tags.update([tag.strip() for tag in row[0].split(",")])

    return jsonify({ "suggestions": sorted(tags) })
