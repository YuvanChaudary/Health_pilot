from flask import Blueprint, jsonify
import csv
import os

disease_bp = Blueprint('disease_bp', __name__)

@disease_bp.route('/api/diseases', methods=['GET'])
def get_disease_suggestions():
    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../dataset/medicines.csv'))
    suggestions = []

    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            suggestions.append({
                "disease": row["disease"],
                "symptoms": row["symptoms"].split(";")  # ✅ Convert to list
            })

    return jsonify(suggestions)
