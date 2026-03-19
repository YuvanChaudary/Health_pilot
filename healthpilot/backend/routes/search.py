from flask import Blueprint, request, jsonify
import sqlite3
import os

search_bp = Blueprint('search_bp', __name__)

# 🔍 Smart Search: Filter specialists by name, specialty, locality
@search_bp.route('/api/search/specialists', methods=['GET'])
def search_specialists():
    name = request.args.get('name', '').lower()
    specialty = request.args.get('specialty', '').lower()
    locality = request.args.get('locality', '').lower()

    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../dataset/healthpilot.db'))
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    query = "SELECT name, address, specialty FROM specialists WHERE 1=1"
    params = []

    if name:
        query += " AND LOWER(name) LIKE ?"
        params.append('%' + name + '%')
    if specialty:
        query += " AND LOWER(specialty) LIKE ?"
        params.append('%' + specialty + '%')
    if locality:
        query += " AND LOWER(address) LIKE ?"
        params.append('%' + locality + '%')

    cursor.execute(query, params)
    results = [{"name": n, "address": a, "specialty": s} for n, a, s in cursor.fetchall()]
    conn.close()

    return jsonify(results)

# ⚡ Autocomplete: List of all diseases
@search_bp.route('/api/autocomplete/diseases', methods=['GET'])
def autocomplete_diseases():
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../dataset/healthpilot.db'))
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT disease FROM medicines")
    diseases = [row[0] for row in cursor.fetchall()]
    conn.close()
    return jsonify(diseases)

# ⚡ Autocomplete: List of all specialties
@search_bp.route('/api/autocomplete/specialties', methods=['GET'])
def autocomplete_specialties():
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../dataset/healthpilot.db'))
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT specialty FROM specialists")
    specialties = [row[0] for row in cursor.fetchall()]
    conn.close()
    return jsonify(specialties)
