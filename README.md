# HealthPilot

HealthPilot is a full-stack application for discovering healthcare facilities and specialists, tracking health alerts, and managing personal health-related records.

## Repository Structure

- `healthpilot/backend/` – Python backend (Flask or FastAPI, database ingestion, API routes)
- `healthpilot/frontend/` – React frontend (Vite + Tailwind CSS)

## Getting Started

### Backend

1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # macOS/Linux
   ```
2. Install dependencies (if requirements file exists):
   ```bash
   pip install -r healthpilot/backend/requirements.txt
   ```
3. Run the backend:
   ```bash
   python healthpilot/backend/main.py
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd healthpilot/frontend
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```

## Notes

- The backend includes database files in `healthpilot/backend/db/` and sample datasets in `healthpilot/backend/dataset/`.
- Update `.gitignore` as needed to exclude local database files or uploads.
