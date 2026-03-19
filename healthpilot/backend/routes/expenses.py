from flask import Blueprint, request, jsonify
import sqlite3
import os

expense_bp = Blueprint('expense_bp', __name__, url_prefix="/api")

# 🔧 Database path (standardized to /db folder)
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'db', 'healthpilot.db'))
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

# ✅ Route: Add new expense
@expense_bp.route('/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create table if not exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            category TEXT,
            amount REAL,
            description TEXT,
            username TEXT
        )
    ''')

    # Insert new expense
    cursor.execute('''
        INSERT INTO expenses (date, category, amount, description, username)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        data.get("date"),
        data.get("category"),
        data.get("amount"),
        data.get("description"),
        data.get("username")
    ))

    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({ "message": "✅ Expense added successfully.", "id": new_id })

# ✅ Route: Get expenses with filters
@expense_bp.route('/expenses', methods=['GET'])
def get_expenses():
    username = request.args.get("username")
    category = request.args.get("category", "")
    month = request.args.get("month", "")
    year = request.args.get("year", "")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    query = "SELECT id, date, category, amount, description FROM expenses WHERE username = ?"
    params = [username]

    if category:
        query += " AND category = ?"
        params.append(category)

    if month and year:
        query += " AND strftime('%m', date) = ? AND strftime('%Y', date) = ?"
        params.extend([month.zfill(2), year])

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return jsonify([
        {
            "id": row[0],
            "date": row[1],
            "category": row[2],
            "amount": row[3],
            "description": row[4]
        }
        for row in rows
    ])

# ✅ Route: Delete expense by ID
@expense_bp.route('/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    username = request.args.get("username")  # optional if you want to restrict by user
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    if username:
        cursor.execute("DELETE FROM expenses WHERE id = ? AND username = ?", (expense_id, username))
    else:
        cursor.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()

    if deleted == 0:
        return jsonify({ "message": "❌ Expense not found or not owned by user." }), 404

    return jsonify({ "message": f"🗑️ Expense {expense_id} deleted successfully." })
