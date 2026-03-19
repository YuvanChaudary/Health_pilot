from flask import Blueprint, request, jsonify
from models.alert import HealthAlert
from datetime import datetime

alerts_bp = Blueprint("alerts_bp", __name__, url_prefix="/api")

@alerts_bp.route("/alerts", methods=["GET"])
def get_alerts():
    category = request.args.get("category", "").strip().lower()
    keyword = request.args.get("keyword", "").strip().lower()
    after = request.args.get("after", "").strip()  # format: YYYY-MM-DD

    query = HealthAlert.query

    # 🔍 Filter by category
    if category:
        query = query.filter(HealthAlert.category.ilike(f"%{category}%"))

    # 🔍 Filter by keyword in title or summary
    if keyword:
        query = query.filter(
            (HealthAlert.title.ilike(f"%{keyword}%")) |
            (HealthAlert.summary.ilike(f"%{keyword}%"))
        )

    # 🔍 Filter by date
    if after:
        try:
            datetime.strptime(after, "%Y-%m-%d")  # validate format
            query = query.filter(HealthAlert.date >= after)
        except ValueError:
            print(f"⚠️ Invalid date format: {after} — expected YYYY-MM-DD")

    # 🔁 Sort by newest first
    alerts = query.order_by(HealthAlert.date.desc()).all()

    # ✅ Format response
    result = [
        {
            "id": a.id,
            "title": a.title,
            "summary": a.summary,
            "url": a.url,
            "image": a.image,
            "category": a.category,
            "date": a.date
        }
        for a in alerts
    ]

    return jsonify(result)
