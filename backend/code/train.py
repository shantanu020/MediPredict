import os
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn import preprocessing
from sklearn.ensemble import RandomForestClassifier

# ── Load dataset ──────────────────────────────────────────────────────────────
print("Loading dataset...")
dataset_df = pd.read_csv('data/dataset.csv')
dataset_df = dataset_df.apply(lambda col: col.str.strip())

# ── One-hot encode symptoms ───────────────────────────────────────────────────
print("Encoding symptoms...")
test = pd.get_dummies(dataset_df.filter(regex='Symptom'), prefix='', prefix_sep='')

# Fix deprecated groupby axis=1
test = test.T.groupby(level=0).max().T

clean_df = pd.merge(test, dataset_df['Disease'], left_index=True, right_index=True)

os.makedirs('data', exist_ok=True)
clean_df.to_csv('data/clean_dataset.tsv', sep='\t', index=False)
print("✅ Saved → data/clean_dataset.tsv")

# ── Preprocessing ─────────────────────────────────────────────────────────────
X_data = clean_df.iloc[:, :-1]
y_data = clean_df.iloc[:, -1].astype('category')

le = preprocessing.LabelEncoder()
le.fit(y_data)

X_train, X_test, y_train, y_test = train_test_split(
    X_data, y_data, test_size=0.2, random_state=42)

y_train_enc = le.transform(y_train)
y_test_enc  = le.transform(y_test)

# ── Train with RandomForest (lightweight, no OpenBLAS issues) ─────────────────
print("Training model...")
model = RandomForestClassifier(
    n_estimators=100,   # kept low to save memory
    n_jobs=1,          # single thread — avoids OpenBLAS crash
    random_state=42,
)
model.fit(X_train, y_train_enc)

preds = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test_enc, preds):.4f}")

# ── Save as both .sav and .json-compatible format ────────────────────────────
os.makedirs('model', exist_ok=True)
joblib.dump(model, "model/xgboost_model.sav")   # saved as .sav
joblib.dump(le,    "model/label_encoder.sav")    # save encoder too
print("✅ Saved → model/xgboost_model.sav")
print("✅ Saved → model/label_encoder.sav")
