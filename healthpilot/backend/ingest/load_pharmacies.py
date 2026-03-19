import sqlite3
import csv

def load_pharmacies():
    # ✅ Absolute paths using raw strings
    db_path = r"D:\mini project 1\healthpilot\backend\dataset\healthpilot.db"
    csv_path = r"D:\mini project 1\healthpilot\backend\dataset\pharmacies.csv"

    # ✅ Connect to SQLite DB
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # ✅ Create table if missing
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pharmacies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            address TEXT,
            city TEXT,
            medicine TEXT,
            price REAL
        )
    ''')

    # ✅ Clear existing data
    cursor.execute('DELETE FROM pharmacies')

    # ✅ Load from CSV
    with open(csv_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        count = 0
        for row in reader:
            try:
                cursor.execute('''
                    INSERT INTO pharmacies (name, address, city, medicine, price)
                    VALUES (?, ?, ?, ?, ?)
                ''', (
                    row['name'],
                    row['address'],
                    row['city'],
                    row['medicine'],
                    float(row['price']) if row['price'] else 0
                ))
                count += 1
            except Exception as e:
                print(f"⚠️ Skipped row due to error: {e}")

    conn.commit()
    conn.close()
    print(f"✅ Ingested {count} rows into pharmacies table.")

if __name__ == '__main__':
    load_pharmacies()
