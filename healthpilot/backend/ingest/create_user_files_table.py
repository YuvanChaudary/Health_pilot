import sqlite3

# ✅ Raw absolute path to healthpilot.db
db_path = r"D:\mini project 1\healthpilot\backend\dataset\healthpilot.db"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# ✅ Create user_files table if not exists
cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT,
        type TEXT,
        tags TEXT,
        uploaded_at TEXT
    )
''')

conn.commit()
conn.close()
print("✅ user_files table created successfully.")
