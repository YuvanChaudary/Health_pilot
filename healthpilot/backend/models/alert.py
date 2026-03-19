from models.init_db import db  # ✅ shared instance

class HealthAlert(db.Model):
    __tablename__ = "health_alert"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), unique=True, nullable=False)
    summary = db.Column(db.String(500))
    url = db.Column(db.String(500))
    image = db.Column(db.String(500))
    category = db.Column(db.String(100))
    date = db.Column(db.String(50))
