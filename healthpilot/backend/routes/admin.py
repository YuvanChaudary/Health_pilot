from flask import Blueprint, request, jsonify
from models.init_db import db, HospitalAdmin, PharmacyAdmin, Hospital, Pharmacy

# 🔹 Create Blueprint
admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# 🏥 Hospital Admin Login
@admin_bp.route("/hospital/login", methods=["POST"])
def hospital_admin_login():
    data = request.json or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    print("Hospital login attempt:", username, password)  # 🔍 Debug

    admin = HospitalAdmin.query.filter_by(username=username, password=password).first()
    print("Hospital admin found:", admin)  # 🔍 Debug

    if admin:
        return jsonify({"message": "Hospital admin login successful", "role": "hospital"}), 200
    return jsonify({"error": "Invalid hospital admin credentials"}), 401


# 💊 Pharmacy Admin Login
@admin_bp.route("/pharmacy/login", methods=["POST"])
def pharmacy_admin_login():
    data = request.json or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    print("Pharmacy login attempt:", username, password)  # 🔍 Debug

    admin = PharmacyAdmin.query.filter_by(username=username, password=password).first()
    print("Pharmacy admin found:", admin)  # 🔍 Debug

    if admin:
        return jsonify({"message": "Pharmacy admin login successful", "role": "pharmacy"}), 200
    return jsonify({"error": "Invalid pharmacy admin credentials"}), 401


# 💊 Pharmacy Admin: Add Pharmacy
@admin_bp.route("/pharmacy/add", methods=["POST"])
def add_pharmacy():
    data = request.json or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    print("Pharmacy add attempt:", data)  # 🔍 Debug

    # ✅ Validate pharmacy admin
    admin = PharmacyAdmin.query.filter_by(username=username, password=password).first()
    if not admin:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        pharmacy = Pharmacy(
            name=data.get("name"),
            address=data.get("address"),
            city=data.get("city"),
            medicine=data.get("medicine"),
            price=data.get("price")
        )
        db.session.add(pharmacy)
        db.session.commit()
        return jsonify({"message": "Pharmacy added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print("❌ Error adding pharmacy:", e)
        return jsonify({"error": "Failed to add pharmacy"}), 500


# 🏥 Hospital Admin: Add Hospital
@admin_bp.route("/hospital/add", methods=["POST"])
def add_hospital():
    data = request.json or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    print("Hospital add attempt:", data)  # 🔍 Debug

    # ✅ Validate hospital admin
    admin = HospitalAdmin.query.filter_by(username=username, password=password).first()
    if not admin:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        hospital = Hospital(
            name=data.get("name"),
            address=data.get("address"),
            city=data.get("city"),
            specialty=data.get("specialty"),
            website=data.get("website"),
            mobile=data.get("mobile"),
            map_link=data.get("map_link")
        )
        db.session.add(hospital)
        db.session.commit()
        return jsonify({"message": "Hospital added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print("❌ Error adding hospital:", e)
        return jsonify({"error": "Failed to add hospital"}), 500
