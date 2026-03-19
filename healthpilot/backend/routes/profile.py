from flask import Blueprint, request, jsonify
from models.init_db import db, User

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/api/profile", methods=["POST"])
def get_profile():
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({"status": "error", "message": "Username missing"}), 400

    user = db.session.query(User).filter_by(name=username).first()

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    return jsonify({
        "status": "success",
        "profile": {
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    })
