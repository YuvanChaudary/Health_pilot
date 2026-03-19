from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import sqlite3, os, datetime

vault_bp = Blueprint('vault_bp', __name__)

# ✅ Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', 'dataset', 'healthpilot.db'))
UPLOAD_FOLDER = os.path.abspath(os.path.join(BASE_DIR, '..', 'uploads'))
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

# ✅ Ensure folders and DB table
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_files (
        filename TEXT PRIMARY KEY,
        type TEXT,
        tags TEXT,
        uploaded_at TEXT
    )
''')
conn.commit()
conn.close()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def resolve_filename_conflict(filename):
    base, ext = os.path.splitext(filename)
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    return f"{base}_{timestamp}{ext}"

# 📤 Upload file (public)
@vault_bp.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    tags = request.form.get('tags', '')
    file_type = request.form.get('type', 'unknown')

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        if os.path.exists(filepath):
            filename = resolve_filename_conflict(filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)

        file.save(filepath)

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO user_files (filename, type, tags, uploaded_at)
            VALUES (?, ?, ?, ?)
        ''', (filename, file_type, tags, datetime.datetime.now().isoformat()))
        conn.commit()
        conn.close()

        print(f"✅ Uploaded: {filename}")
        return jsonify({"status": "success", "filename": filename})
    return jsonify({"status": "error", "message": "Invalid file type"}), 400

# 🔍 List files (public)
@vault_bp.route('/files', methods=['GET'])
def list_files():
    query = request.args.get('search', '').strip()
    file_type = request.args.get('type', '').strip()

    print(f"🔎 Incoming filters → search: '{query}', type: '{file_type}'")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    sql = "SELECT filename, type, tags, uploaded_at FROM user_files"
    params = []

    if query and file_type:
        sql += " WHERE (filename LIKE ? OR tags LIKE ?) AND type = ?"
        params.extend([f"%{query}%", f"%{query}%", file_type])
    elif query:
        sql += " WHERE filename LIKE ? OR tags LIKE ?"
        params.extend([f"%{query}%", f"%{query}%"])
    elif file_type:
        sql += " WHERE type = ?"
        params.append(file_type)

    try:
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        files = [{
            "name": r[0],
            "type": r[1],
            "tags": r[2],
            "uploaded_at": r[3]
        } for r in rows]
        print(f"📂 Fetched {len(files)} files")
        return jsonify({"files": files})
    except Exception as e:
        print("❌ Vault fetch error:", e)
        return jsonify({"error": "Failed to fetch files"}), 422
    finally:
        conn.close()

# 🗑️ Delete file (public)
@vault_bp.route('/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT filename FROM user_files WHERE filename = ?", (filename,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({"status": "error", "message": "File not found"}), 404

    if os.path.exists(filepath):
        os.remove(filepath)
        cursor.execute("DELETE FROM user_files WHERE filename = ?", (filename,))
        conn.commit()
        conn.close()
        print(f"🗑️ Deleted: {filename}")
        return jsonify({"status": "deleted"})
    conn.close()
    return jsonify({"status": "error", "message": "File not found"}), 404

# 📄 Preview file (public)
@vault_bp.route('/preview/<filename>', methods=['GET'])
def serve_file(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({"status": "error", "message": "File not found"}), 404
    print(f"👁️ Serving: {filename}")
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=False)

# 📥 Download file (public)
@vault_bp.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({"status": "error", "message": "File not found"}), 404
    print(f"⬇️ Downloading: {filename}")
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)
