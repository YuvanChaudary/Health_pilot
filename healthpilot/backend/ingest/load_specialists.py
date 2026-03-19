import csv
import sqlite3

def load_specialists():
    # ✅ Absolute paths using raw strings
    db_path = r"D:\mini project 1\healthpilot\backend\dataset\healthpilot.db"
    csv_path = r"D:\mini project 1\healthpilot\backend\dataset\specialists.csv"

    # ✅ Connect to SQLite DB
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # ✅ Create table if missing
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS specialists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            address TEXT,
            specialty TEXT,
            area TEXT,
            hospital TEXT,
            phone TEXT
        )
    ''')

    # ✅ Clear old entries
    cursor.execute("DELETE FROM specialists")

    # ✅ Load from CSV
    with open(csv_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        count = 0
        for row in reader:
            try:
                cursor.execute('''
                    INSERT INTO specialists (name, address, specialty, area, hospital, phone)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    row.get('name'),
                    row.get('address'),
                    row.get('specialty'),
                    row.get('area'),
                    row.get('hospital'),
                    row.get('phone')
                ))
                count += 1
            except Exception as e:
                print(f"⚠️ Skipped row due to error: {e}")

    conn.commit()
    conn.close()
    print(f"✅ Ingested {count} rows into specialists table.")

if __name__ == '__main__':
    load_specialists()