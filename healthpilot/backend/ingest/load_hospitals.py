import sqlite3
import csv

def load_hospitals():
    # ✅ Absolute paths (raw strings to avoid backslash issues)
    db_path = r"D:\mini project 1\healthpilot\backend\dataset\healthpilot.db"
    csv_path = r"D:\mini project 1\healthpilot\backend\dataset\hospitals.csv"

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # ✅ Drop and recreate hospitals_india table
    cursor.execute('DROP TABLE IF EXISTS hospitals_india')

    cursor.execute('''
        CREATE TABLE hospitals_india (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            address TEXT,
            city TEXT,
            specialty TEXT,
            website TEXT,
            mobile TEXT,
            map_link TEXT
        )
    ''')

    # ✅ Load from hospitals.csv
    with open(csv_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            cursor.execute('''
                INSERT INTO hospitals_india (name, address, city, specialty, website, mobile, map_link)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                row['name'],
                row['address'],
                row['city'],
                row['specialty'],
                row['website'],
                row['mobile'],
                row['map_link']
            ))

    conn.commit()
    conn.close()
    print("✅ Hospitals loaded successfully into hospitals_india.")

if __name__ == '__main__':
    load_hospitals()
