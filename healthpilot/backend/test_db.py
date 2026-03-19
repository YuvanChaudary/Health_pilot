import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

os.makedirs("db", exist_ok=True)

app = Flask(__name__)
db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), "db", "test.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Dummy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

with app.app_context():
    db.create_all()
    print("✅ test.db created")
    print("📂 Test DB path:", db_path)