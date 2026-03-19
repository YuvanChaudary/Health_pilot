from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.init_db import db, User
import secrets
import datetime

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Temporary in-memory store for reset tokens (replace with Redis/DB in production)
reset_tokens = {}

# 🔐 Signup
@auth_bp.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not name or not email or not password:
            return jsonify({"success": False, "error": "Missing required fields"}), 400

        if User.query.filter_by(name=name).first():
            return jsonify({"success": False, "error": "Name already exists"}), 409

        if User.query.filter_by(email=email).first():
            return jsonify({"success": False, "error": "Email already registered"}), 409

        hashed_pw = generate_password_hash(password)
        new_user = User(name=name, email=email, role="User", password_hash=hashed_pw)
        db.session.add(new_user)
        db.session.commit()

        print(f"✅ Registered user: {name} ({email})")
        return jsonify({"success": True, "message": "User registered successfully"}), 201

    except Exception as e:
        print("❌ Signup error:", e)
        return jsonify({"success": False, "error": "Internal server error"}), 500


# 🔓 Login
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        name = data.get("name", "").strip()
        password = data.get("password", "")

        if not name or not password:
            return jsonify({"success": False, "error": "Missing name or password"}), 400

        user = User.query.filter_by(name=name).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({"success": False, "error": "Invalid name or password"}), 401

        print(f"🔓 Logged in user: {user.name} (ID: {user.id})")
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "token": "dev-token"  # later replace with JWT
        }), 200

    except Exception as e:
        print("❌ Login error:", e)
        return jsonify({"success": False, "error": "Internal server error"}), 500


# 🔑 Forgot Password (generate token)
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get("email", "").strip().lower()

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"success": False, "error": "Email not found"}), 404

        # Generate secure token
        token = secrets.token_urlsafe(32)
        reset_tokens[token] = {
            "email": email,
            "expires": datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
        }

        print(f"🔑 Reset token for {email}: {token}")
        # In production: send token via email
        return jsonify({"success": True, "message": "Reset link generated", "token": token}), 200

    except Exception as e:
        print("❌ Forgot password error:", e)
        return jsonify({"success": False, "error": "Internal server error"}), 500


# 🔁 Reset Password (with token)
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()
        token = data.get("token", "").strip()
        new_password = data.get("new_password", "")

        if not token or not new_password:
            return jsonify({"success": False, "error": "Missing token or new password"}), 400

        token_data = reset_tokens.get(token)
        if not token_data:
            return jsonify({"success": False, "error": "Invalid or expired token"}), 400

        if token_data["expires"] < datetime.datetime.utcnow():
            return jsonify({"success": False, "error": "Token expired"}), 400

        user = User.query.filter_by(email=token_data["email"]).first()
        if not user:
            return jsonify({"success": False, "error": "User not found"}), 404

        user.password_hash = generate_password_hash(new_password)
        db.session.commit()

        # Remove used token
        reset_tokens.pop(token, None)

        print(f"🔁 Password reset for: {user.email}")
        return jsonify({"success": True, "message": "Password reset successful"}), 200

    except Exception as e:
        print("❌ Reset error:", e)
        return jsonify({"success": False, "error": "Internal server error"}), 500
