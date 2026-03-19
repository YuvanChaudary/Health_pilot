import requests, os, logging
from datetime import datetime
from dotenv import load_dotenv
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter

# 🔹 Flask + SQLAlchemy setup
from flask import Flask
from models.alert import db, HealthAlert

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///health_alerts.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# 🔹 Logging setup
LOG_FILE = os.path.join(os.path.dirname(__file__), "scraper.log")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s: %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler()
    ]
)

# 🔹 Load NewsAPI key
load_dotenv()
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")

# 🔹 Retry-enabled session
def make_session():
    s = requests.Session()
    retry = Retry(total=3, backoff_factor=0.3, status_forcelist=(500, 502, 503, 504), allowed_methods=frozenset(["GET", "POST"]))
    adapter = HTTPAdapter(max_retries=retry)
    s.mount("http://", adapter)
    s.mount("https://", adapter)
    s.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9"
    })
    return s

# 🔹 Parse date safely
def parse_date(text):
    try:
        return datetime.strptime(text[:10], "%Y-%m-%d").strftime("%b %d, %Y")
    except:
        return datetime.now().strftime("%b %d, %Y")

# 🔹 Scrape NewsAPI health alerts
def scrape_newsapi_health():
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "category": "health",
        "language": "en",
        "pageSize": 50,  # ✅ More news
        "apiKey": NEWSAPI_KEY
    }
    s = make_session()
    try:
        r = s.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        logging.error("NewsAPI fetch failed: %s", e)
        return []

    alerts = []
    for article in data.get("articles", []):
        alerts.append({
            "title": article.get("title", ""),
            "summary": article.get("description", ""),
            "url": article.get("url", ""),
            "image": article.get("urlToImage", ""),
            "category": "Health",
            "date": parse_date(article.get("publishedAt", "")),
            "source": article.get("source", {}).get("name", "Unknown")  # ✅ Optional
        })
    logging.info("NewsAPI scraped %d alerts", len(alerts))
    return alerts

# 🔹 Push alerts to SQLite DB
def push_to_db(alerts):
    if not alerts:
        logging.info("No new alerts to push to DB")
        return
    with app.app_context():
        added = 0
        for a in alerts:
            title = a.get("title", "").strip()
            url = a.get("url", "").strip()
            if not title or not url:
                continue
            exists = HealthAlert.query.filter(
                (HealthAlert.title == title) | (HealthAlert.url == url)
            ).first()
            if not exists:
                db.session.add(HealthAlert(
                    title=title,
                    summary=a.get("summary", ""),
                    url=url,
                    image=a.get("image", ""),
                    category=a.get("category", "Health"),
                    date=a.get("date", "")
                ))
                added += 1
        db.session.commit()
        logging.info("✅ Pushed %d alerts to SQLite DB", added)

# 🔹 Run scraper
if __name__ == "__main__":
    alerts = scrape_newsapi_health()
    print(f"NewsAPI alerts: {len(alerts)}")

    push_to_db(alerts)

    print("✅ Done — logs written to:", LOG_FILE)
