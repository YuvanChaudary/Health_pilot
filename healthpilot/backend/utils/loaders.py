import os
import pandas as pd
import json
import sqlite3

DATASET_DIR = os.path.join(os.path.dirname(__file__), "..", "dataset")

def load_csv(filename):
    path = os.path.join(DATASET_DIR, filename)
    return pd.read_csv(path)

def load_json(filename):
    path = os.path.join(DATASET_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def connect_sqlite(filename):
    path = os.path.join(DATASET_DIR, filename)
    return sqlite3.connect(path)
