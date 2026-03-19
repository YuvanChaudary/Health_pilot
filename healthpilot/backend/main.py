import os
import json
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from models.init_db import db, User, Medicine, Pharmacy, Hospital, UserFile, Specialist, HospitalAdmin, PharmacyAdmin
from models.alert import HealthAlert

# 🔹 Import blueprints
from routes.hospitals import hospital_bp
from routes.medicines import medicine_bp
from routes.vault import vault_bp
from routes.pharmacies import pharmacy_bp
from routes.discovery import discovery_bp
from routes.search import search_bp
from routes.diseases import disease_bp
from routes.alerts import alerts_bp
from routes.auth import auth_bp
from routes.specialists import specialist_bp
from routes.expenses import expense_bp
from routes.profile import profile_bp
from routes.admin import admin_bp  # ✅ NEW: Register admin routes

# 🔹 Initialize Flask app
app = Flask(__name__)

# ✅ Enable CORS for React frontend
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
# 🔹 Ensure db folder exists
os.makedirs("db", exist_ok=True)

# 🔹 Configure SQLite database
db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), "db", "healthpilot.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "uploads")

# 🔹 Initialize SQLAlchemy
db.init_app(app)

# 🔹 Register blueprints
app.register_blueprint(hospital_bp)
app.register_blueprint(medicine_bp)
app.register_blueprint(pharmacy_bp)
app.register_blueprint(discovery_bp)
app.register_blueprint(search_bp)
app.register_blueprint(disease_bp)
app.register_blueprint(vault_bp, url_prefix="/api/vault")
app.register_blueprint(alerts_bp)
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(specialist_bp)
app.register_blueprint(expense_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(admin_bp)  # ✅ NEW: Admin login + add routes

# 🔹 Health check
@app.route('/api/ping')
def ping():
    return jsonify({"status": "ok", "message": "Backend is live"})

# 🔹 Teardown session
@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()

# 🔹 Auto-ingest CSVs and JSON
def ingest_csvs():
    dataset_dir = os.path.join(os.path.dirname(__file__), "dataset")
    ingested = False

    def safe_add(instance):
        nonlocal ingested
        try:
            db.session.add(instance)
            db.session.flush()
            ingested = True
        except Exception as e:
            print(f"⚠️ Skipped: {getattr(instance, 'title', getattr(instance, 'name', 'Unknown'))} — {e}")
            db.session.rollback()

    # 🏥 Hospitals
    hospitals_csv = os.path.join(dataset_dir, "hospitals.csv")
    if os.path.exists(hospitals_csv):
        df = pd.read_csv(hospitals_csv)
        for _, row in df.iterrows():
            safe_add(Hospital(
                name=row.get("name"),
                address=row.get("address"),
                city=row.get("city"),
                specialty=row.get("specialty"),
                website=row.get("website"),
                mobile=row.get("mobile"),
                map_link=row.get("map_link")
            ))

    # 💊 Medicines
    medicines_csv = os.path.join(dataset_dir, "medicines.csv")
    if os.path.exists(medicines_csv):
        df = pd.read_csv(medicines_csv)
        for _, row in df.iterrows():
            safe_add(Medicine(
                disease=row.get("disease"),
                medicine=row.get("medicine"),
                cost=row.get("cost"),
                annual_cost=row.get("annual_cost"),
                symptoms=row.get("symptoms"),
                side_effects=row.get("side_effects"),
                drug_interactions=row.get("drug_interactions")
            ))

    # 🏪 Pharmacies
    pharmacies_csv = os.path.join(dataset_dir, "pharmacies.csv")
    if os.path.exists(pharmacies_csv):
        df = pd.read_csv(pharmacies_csv)
        for _, row in df.iterrows():
            safe_add(Pharmacy(
                name=row.get("name"),
                address=row.get("address"),
                city=row.get("city"),
                medicine=row.get("medicine"),
                price=row.get("price")
            ))

    # 👨‍⚕️ Specialists
    specialists_csv = os.path.join(dataset_dir, "specialists.csv")
    if os.path.exists(specialists_csv):
        df = pd.read_csv(specialists_csv)
        for _, row in df.iterrows():
            safe_add(Specialist(
                name=row.get("name"),
                address=row.get("address"),
                specialty=row.get("specialty"),
                area=row.get("area"),
                hospital=row.get("hospital"),
                phone=row.get("phone")
            ))

    # 🚨 Health Alerts
    alerts_json = os.path.join(dataset_dir, "health_alerts.json")
    if os.path.exists(alerts_json):
        with open(alerts_json, "r", encoding="utf-8") as f:
            alerts = json.load(f)
            for alert in alerts:
                safe_add(HealthAlert(
                    title=alert.get("title"),
                    summary=alert.get("summary"),
                    url=alert.get("url"),
                    image=alert.get("image"),
                    category=alert.get("category"),
                    date=alert.get("date")
                ))

    if ingested:
        db.session.commit()
        print("✅ All datasets ingested into database.")
    else:
        print("⚠️ No data ingested. Check dataset files.")

# 🔹 Run app
if __name__ == '__main__':
    with app.app_context():
        print("📂 DB path:", db_path)
        db.create_all()
        try:
            ingest_csvs()
        except Exception as e:
            print("❌ Ingestion failed:", e)
        print("✅ Database and tables created successfully.")
    app.run(debug=True)
