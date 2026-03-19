from flask import Blueprint, request, jsonify
from models.init_db import Specialist

specialist_bp = Blueprint("specialist_bp", __name__, url_prefix="/api")

@specialist_bp.route("/specialists", methods=["GET"])
def get_specialists():
    # 🔍 Get query parameters
    specialty = request.args.get("specialty", "").lower()
    hospital = request.args.get("hospital", "").lower()
    area = request.args.get("area", "").lower()

    # 🔎 Build dynamic query
    query = Specialist.query
    if specialty:
        query = query.filter(Specialist.specialty.ilike(f"%{specialty}%"))
    if hospital:
        query = query.filter(Specialist.hospital.ilike(f"%{hospital}%"))
    if area:
        query = query.filter(Specialist.area.ilike(f"%{area}%"))

    specialists = query.all()

    # 🔁 Format response
    result = []
    for s in specialists:
        result.append({
            "id": s.id,
            "name": s.name,
            "address": s.address,
            "specialty": s.specialty,
            "area": s.area,
            "hospital": s.hospital,
            "phone": s.phone
        })
    return jsonify(result)
