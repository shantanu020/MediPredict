"""
retrain_all_models.py
=====================
Run this script from inside the  Frontend/  folder:

    cd Frontend
    python retrain_all_models.py

It will:
  1. Read each dataset from  data/
  2. Train a fresh model with your current scikit-learn
  3. Save the .sav file to  models/

Requirements:
    pip install scikit-learn pandas numpy joblib xgboost
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

os.makedirs("models", exist_ok=True)

SEED = 42

# ─────────────────────────────────────────────────────────────────────────────
# Helper
# ─────────────────────────────────────────────────────────────────────────────
def save_model(model, path):
    joblib.dump(model, path)
    print(f"  ✅  Saved → {path}")


def check_csv(path, name):
    if not os.path.exists(path):
        print(f"  ⚠️  SKIPPED {name} — dataset not found at: {path}")
        print(f"      Download it from Kaggle and place it there.\n")
        return False
    return True


# ═════════════════════════════════════════════════════════════════════════════
# 1. DIABETES  (data/diabetes.csv)
#    Kaggle: https://www.kaggle.com/datasets/mathchi/diabetes-data-set
# ═════════════════════════════════════════════════════════════════════════════
def train_diabetes():
    path = "data/diabetes.csv"
    print("\n── Diabetes ──────────────────────────────────────────────────────")
    if not check_csv(path, "Diabetes"):
        return

    df = pd.read_csv(path)
    X = df.drop("Outcome", axis=1)
    y = df["Outcome"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED)

    model = RandomForestClassifier(n_estimators=100, random_state=SEED)
    model.fit(X_train, y_train)
    print(f"  Accuracy: {accuracy_score(y_test, model.predict(X_test)):.4f}")
    save_model(model, "models/diabetes_model.sav")


# ═════════════════════════════════════════════════════════════════════════════
# 2. HEART DISEASE  (data/heart.csv)
#    Kaggle: https://www.kaggle.com/datasets/rishidamarla/heart-disease-prediction
# ═════════════════════════════════════════════════════════════════════════════
def train_heart():
    path = "data/heart.csv"
    print("\n── Heart Disease ─────────────────────────────────────────────────")
    if not check_csv(path, "Heart"):
        return

    df = pd.read_csv(path)
    # common column names in this dataset
    target_col = "target" if "target" in df.columns else df.columns[-1]
    X = df.drop(target_col, axis=1)
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED)

    model = RandomForestClassifier(n_estimators=100, random_state=SEED)
    model.fit(X_train, y_train)
    print(f"  Accuracy: {accuracy_score(y_test, model.predict(X_test)):.4f}")
    save_model(model, "models/heart_disease_model.sav")


# ═════════════════════════════════════════════════════════════════════════════
# 3. PARKINSON'S  (data/parkinsons.csv)
#    Kaggle: https://www.kaggle.com/code/arunkumarpyramid/detection-parkinson-s-disease
# ═════════════════════════════════════════════════════════════════════════════
def train_parkinsons():
    path = "data/parkinsons.csv"
    print("\n── Parkinson's ───────────────────────────────────────────────────")
    if not check_csv(path, "Parkinson's"):
        return

    df = pd.read_csv(path)
    # drop the 'name' column if present
    if "name" in df.columns:
        df = df.drop("name", axis=1)

    X = df.drop("status", axis=1)
    y = df["status"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=SEED)

    model = SVC(kernel="rbf", probability=True, random_state=SEED)
    model.fit(X_train, y_train)
    print(f"  Accuracy: {accuracy_score(y_test, model.predict(X_test)):.4f}")

    # wrap scaler + model together so app.py just calls model.predict()
    from sklearn.pipeline import Pipeline
    pipeline = Pipeline([("scaler", StandardScaler()), ("svc", SVC(kernel="rbf", probability=True, random_state=SEED))])
    pipeline.fit(X, y)
    save_model(pipeline, "models/parkinsons_model.sav")


# ═════════════════════════════════════════════════════════════════════════════
# 4. LIVER  (data/liver.csv)
#    Kaggle: https://www.kaggle.com/code/harisyammnv/liver-disease-prediction
#    Expected columns: Gender, Age, Total_Bilirubin, Direct_Bilirubin,
#                      Alkaline_Phosphotase, Alamine_Aminotransferase,
#                      Aspartate_Aminotransferase, Total_Protiens,
#                      Albumin, Albumin_and_Globulin_Ratio, Dataset
# ═════════════════════════════════════════════════════════════════════════════
def train_liver():
    path = "data/liver.csv"
    print("\n── Liver Disease ─────────────────────────────────────────────────")
    if not check_csv(path, "Liver"):
        return

    df = pd.read_csv(path)
    df.columns = df.columns.str.strip()

    # encode gender
    if "Gender" in df.columns:
        df["Gender"] = LabelEncoder().fit_transform(df["Gender"])

    target_col = "Dataset" if "Dataset" in df.columns else df.columns[-1]
    df[target_col] = (df[target_col] == 1).astype(int)   # 1 = disease, 2 = no disease → 1/0

    df = df.fillna(df.median(numeric_only=True))
    X = df.drop(target_col, axis=1)
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED)

    model = RandomForestClassifier(n_estimators=100, random_state=SEED)
    model.fit(X_train, y_train)
    print(f"  Accuracy: {accuracy_score(y_test, model.predict(X_test)):.4f}")
    save_model(model, "models/liver_model.sav")


# ═════════════════════════════════════════════════════════════════════════════
# 5. HEPATITIS  (data/hepatitis.csv)
#    Kaggle: HCV / Hepatitis dataset
#    Expected columns: Age, Sex, ALB, ALP, ALT, AST, BIL, CHE, CHOL, CREA, GGT, PROT, Category
# ═════════════════════════════════════════════════════════════════════════════
def train_hepatitis():
    path = "data/hepatitis.csv"
    print("\n── Hepatitis ─────────────────────────────────────────────────────")
    if not check_csv(path, "Hepatitis"):
        return

    df = pd.read_csv(path)
    df.columns = df.columns.str.strip()

    # drop unnamed index column if present
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

    # encode Sex: m→1, f→2
    if "Sex" in df.columns:
        df["Sex"] = df["Sex"].map({"m": 1, "f": 2}).fillna(1).astype(int)

    # target: 0=Blood Donor (healthy), 1=Hepatitis/Fibrosis/Cirrhosis
    target_col = "Category" if "Category" in df.columns else df.columns[-1]
    df["target"] = df[target_col].apply(lambda x: 0 if str(x).strip() == "0=Blood Donor" else 1)
    df = df.drop(target_col, axis=1)

    df = df.fillna(df.median(numeric_only=True))
    feature_cols = ["Age", "Sex", "ALB", "ALP", "ALT", "AST", "BIL", "CHE", "CHOL", "CREA", "GGT", "PROT"]
    feature_cols = [c for c in feature_cols if c in df.columns]
    X = df[feature_cols]
    y = df["target"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED)

    model = GradientBoostingClassifier(n_estimators=100, random_state=SEED)
    model.fit(X_train, y_train)
    print(f"  Accuracy: {accuracy_score(y_test, model.predict(X_test)):.4f}")
    save_model(model, "models/hepititisc_model.sav")


# ═════════════════════════════════════════════════════════════════════════════
# 6. LUNG CANCER  (data/lung_cancer.csv)
#    Already in repo — columns: GENDER, AGE, SMOKING, ..., LUNG_CANCER
# ═════════════════════════════════════════════════════════════════════════════
def train_lung_cancer():
    path = "data/lung_cancer.csv"
    print("\n── Lung Cancer ───────────────────────────────────────────────────")
    if not check_csv(path, "Lung Cancer"):
        return

    df = pd.read_csv(path)
    df.columns = df.columns.str.strip()

    # encode GENDER: M→1, F→2
    if "GENDER" in df.columns:
        df["GENDER"] = df["GENDER"].map({"M": 1, "F": 2})

    target_col = "LUNG_CANCER" if "LUNG_CANCER" in df.columns else df.columns[-1]
    X = df.drop(target_col, axis=1)
    y = df[target_col]   # YES / NO strings

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED)

    model = RandomForestClassifier(n_estimators=100, random_state=SEED)
    model.fit(X_train, y_train)
    print(f"  Accuracy: {accuracy_score(y_test, model.predict(X_test)):.4f}")
    save_model(model, "models/lung_cancer_model.sav")


# ═════════════════════════════════════════════════════════════════════════════
# 7. CHRONIC KIDNEY  (data/kidney.csv)
#    Kaggle: chronic kidney disease dataset
#    24 features + classification column
# ═════════════════════════════════════════════════════════════════════════════
def train_chronic_kidney():
    path = "data/kidney.csv"
    print("\n── Chronic Kidney Disease ────────────────────────────────────────")
    if not check_csv(path, "Chronic Kidney"):
        return

    df = pd.read_csv(path)
    df.columns = df.columns.str.strip()
    df = df.drop("id", axis=1, errors="ignore")

    # replace ? with NaN
    df = df.replace("?", np.nan)
    df = df.replace("\t?", np.nan)

    # strip whitespace in string columns
    for col in df.select_dtypes(include="object").columns:
        df[col] = df[col].str.strip()

    # encode binary categoricals
    binary_map = {
        "rbc":   {"normal": 1, "abnormal": 0},
        "pc":    {"normal": 1, "abnormal": 0},
        "pcc":   {"present": 1, "notpresent": 0},
        "ba":    {"present": 1, "notpresent": 0},
        "htn":   {"yes": 1, "no": 0},
        "dm":    {"yes": 1, "no": 0},
        "cad":   {"yes": 1, "no": 0},
        "appet": {"good": 1, "poor": 0},
        "pe":    {"yes": 1, "no": 0},
        "ane":   {"yes": 1, "no": 0},
    }
    for col, mapping in binary_map.items():
        if col in df.columns:
            df[col] = df[col].map(mapping)

    target_col = "classification" if "classification" in df.columns else df.columns[-1]
    df[target_col] = df[target_col].map({"ckd": 1, "notckd": 0, "ckd\t": 1})

    df = df.apply(pd.to_numeric, errors="coerce")
    df = df.fillna(df.median(numeric_only=True))

    X = df.drop(target_col, axis=1)
    y = df[target_col].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED)

    model = RandomForestClassifier(n_estimators=100, random_state=SEED)
    model.fit(X_train, y_train)
    print(f"  Accuracy: {accuracy_score(y_test, model.predict(X_test)):.4f}")
    save_model(model, "models/chronic_model.sav")


# ═════════════════════════════════════════════════════════════════════════════
# 8. BREAST CANCER  (data/breast_cancer.csv)
#    Kaggle: Wisconsin Breast Cancer dataset
#    30 features + diagnosis (M/B)
# ═════════════════════════════════════════════════════════════════════════════
def train_breast_cancer():
    path = "data/breast_cancer.csv"
    print("\n── Breast Cancer ─────────────────────────────────────────────────")
    if not check_csv(path, "Breast Cancer"):
        return

    df = pd.read_csv(path)
    df.columns = df.columns.str.strip()
    df = df.drop(["id", "Unnamed: 32"], axis=1, errors="ignore")

    # M = malignant = 1, B = benign = 0
    target_col = "diagnosis" if "diagnosis" in df.columns else df.columns[0]
    df[target_col] = LabelEncoder().fit_transform(df[target_col])

    X = df.drop(target_col, axis=1)
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED)

    model = RandomForestClassifier(n_estimators=100, random_state=SEED)
    model.fit(X_train, y_train)
    print(f"  Accuracy: {accuracy_score(y_test, model.predict(X_test)):.4f}")
    save_model(model, "models/breast_cancer.sav")


# ═════════════════════════════════════════════════════════════════════════════
# MAIN
# ═════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=" * 65)
    print("  Retraining all models with current scikit-learn version")
    print("=" * 65)

    train_diabetes()
    train_heart()
    train_parkinsons()
    train_liver()
    train_hepatitis()
    train_lung_cancer()
    train_chronic_kidney()
    train_breast_cancer()

    print("\n" + "=" * 65)
    print("  Done! Check models/ folder for the new .sav files.")
    print("  Run:  streamlit run app.py")
    print("=" * 65)
