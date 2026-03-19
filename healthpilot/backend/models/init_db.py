from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# 🔹 Initialize SQLAlchemy
db = SQLAlchemy()

# 🔹 Hospital Admin model
class HospitalAdmin(db.Model):
    __tablename__ = "hospital_admins"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f"<HospitalAdmin {self.username}>"

# 🔹 Pharmacy Admin model
class PharmacyAdmin(db.Model):
    __tablename__ = "pharmacy_admins"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f"<PharmacyAdmin {self.username}>"

# 🔹 User model
class User(db.Model):
    __tablename__ = "User"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    role = db.Column(db.String, default="User")
    password_hash = db.Column(db.String, nullable=False)

    files = db.relationship("UserFile", backref="user", lazy=True)

    def __repr__(self):
        return f"<User {self.name} ({self.email})>"

# 🔹 Medicine model
class Medicine(db.Model):
    __tablename__ = "medicines"
    id = db.Column(db.Integer, primary_key=True)
    disease = db.Column(db.String)
    medicine = db.Column(db.String)
    cost = db.Column(db.Float)
    annual_cost = db.Column(db.Float)
    symptoms = db.Column(db.String)
    side_effects = db.Column(db.String)
    drug_interactions = db.Column(db.String)

    def __repr__(self):
        return f"<Medicine {self.medicine} for {self.disease}>"

# 🔹 Pharmacy model
class Pharmacy(db.Model):
    __tablename__ = "pharmacies"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    address = db.Column(db.String)
    city = db.Column(db.String)
    medicine = db.Column(db.String)
    price = db.Column(db.Float)

    def __repr__(self):
        return f"<Pharmacy {self.name} in {self.city}>"

# 🔹 Hospital model
class Hospital(db.Model):
    __tablename__ = "hospitals_india"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    address = db.Column(db.String)
    city = db.Column(db.String)
    specialty = db.Column(db.String)
    logo_link = db.Column(db.String)
    website = db.Column(db.String)
    mobile = db.Column(db.String)
    map_link = db.Column(db.String)

    def __repr__(self):
        return f"<Hospital {self.name} ({self.specialty})>"

# 🔹 Health Alert model
class HealthAlert(db.Model):
    __tablename__ = "health_alerts"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.String)
    category = db.Column(db.String)
    image_url = db.Column(db.String)
    timestamp = db.Column(db.String)

    def __repr__(self):
        return f"<Alert {self.title} ({self.category})>"

# 🔹 User file uploads
class UserFile(db.Model):
    __tablename__ = "user_files"
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    upload_time = db.Column(db.DateTime, default=datetime.utcnow)
    user_email = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey("User.id"), nullable=False)

    def __repr__(self):
        return f"<UserFile {self.filename} ({self.type})>"

# 🔹 Specialist model
class Specialist(db.Model):
    __tablename__ = "specialists"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    address = db.Column(db.String)
    specialty = db.Column(db.String)
    area = db.Column(db.String)
    hospital = db.Column(db.String)
    phone = db.Column(db.String)

    def __repr__(self):
        return f"<Specialist {self.name} ({self.specialty})>"
