import sqlite3
import csv

def load_medicines():
    # ✅ Absolute paths (raw strings to avoid backslash issues)
    db_path = r"D:\mini project 1\healthpilot\backend\dataset\healthpilot.db"
    csv_path = r"D:\mini project 1\healthpilot\backend\dataset\medicines.csv"

    # ✅ Connect to SQLite DB
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # ✅ Create table if missing
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medicines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disease TEXT,
            medicine TEXT,
            cost REAL,
            annual_cost REAL,
            symptoms TEXT,
            side_effects TEXT,
            drug_interactions TEXT
        )
    ''')

    # ✅ Clear existing data
    cursor.execute('DELETE FROM medicines')

    # ✅ Load from CSV
    with open(csv_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        count = 0
        for row in reader:
            try:
                cursor.execute('''
                    INSERT INTO medicines (disease, medicine, cost, annual_cost, symptoms, side_effects, drug_interactions)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    row['disease'],
                    row['medicine'],
                    float(row['cost']) if row['cost'] else 0,
                    float(row['annual_cost']) if row['annual_cost'] else 0,
                    row['symptoms'],
                    row['side_effects'],
                    row['drug_interactions']
                ))
                count += 1
            except Exception as e:
                print(f"⚠️ Skipped row due to error: {e}")

    conn.commit()
    conn.close()
    print(f"✅ Ingested {count} rows into medicines table.")

if __name__ == '__main__':
    load_medicines()
