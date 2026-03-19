from flask import Blueprint, request, jsonify
from models.init_db import db, Pharmacy  # SQLAlchemy model

pharmacy_bp = Blueprint('pharmacy_bp', __name__, url_prefix="/api")

# ✅ Route: List all pharmacies
@pharmacy_bp.route('/pharmacies', methods=['GET'])
def get_all_pharmacies():
    pharmacies = Pharmacy.query.all()
    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "address": p.address,
            "city": p.city,
            "medicines": p.medicine.split(",") if p.medicine else [],
            "price": p.price
        }
        for p in pharmacies
    ])


# ✅ Route: Search pharmacies with filters + sorting
@pharmacy_bp.route('/pharmacies/search', methods=['GET'])
def search_pharmacies():
    name = request.args.get('name', '').strip().lower()
    city = request.args.get('city', '').strip().lower()
    medicine = request.args.get('medicine', '').strip().lower()
    sort_by = request.args.get('sort', '').lower()
    sort_order = request.args.get('order', 'asc').lower()

    query = Pharmacy.query

    if name:
        query = query.filter(Pharmacy.name.ilike(f"%{name}%"))
    if city:
        query = query.filter(Pharmacy.city.ilike(f"%{city}%"))
    if medicine:
        query = query.filter(Pharmacy.medicine.ilike(f"%{medicine}%"))

    if sort_by == "price":
        query = query.order_by(
            Pharmacy.price.desc() if sort_order == "desc" else Pharmacy.price.asc()
        )

    pharmacies = query.all()

    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "address": p.address,
            "city": p.city,
            "medicines": p.medicine.split(",") if p.medicine else [],
            "price": p.price
        }
        for p in pharmacies
    ])


# ✅ Route: Autocomplete for name or medicine
@pharmacy_bp.route('/pharmacies/suggest', methods=['GET'])
def suggest_pharmacy_fields():
    field = request.args.get("field", "").lower()
    query = request.args.get("query", "").strip().lower()

    if field not in ["medicine", "name"]:
        return jsonify({ "suggestions": [] })

    results = (
        db.session.query(getattr(Pharmacy, field))
        .filter(getattr(Pharmacy, field).ilike(f"%{query}%"))
        .distinct()
        .limit(10)
        .all()
    )

    suggestions = [r[0] for r in results if r[0]]
    return jsonify({ "suggestions": suggestions })
