import os
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

# ── Load Groq API key from environment (set in .env or system env) ────────────
try:
    from dotenv import load_dotenv
    # Load .env from the same directory as api.py regardless of working directory
    _env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    load_dotenv(_env_path)
except ImportError:
    pass  # dotenv optional — can set GROQ_API_KEY as a system env var instead

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# Startup confirmation
if GROQ_API_KEY and len(GROQ_API_KEY) > 10:
    print(f"✓ Groq API key loaded ({GROQ_API_KEY[:8]}…)")
else:
    print("⚠ GROQ_API_KEY not set — AI features will be unavailable.")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import joblib
import pandas as pd
import numpy as np
import sys
sys.path.insert(0, ".")
app = FastAPI(title="MediPredict API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load ML models ────────────────────────────────────────────────────────────
print("Loading models...")
models = {}
model_files = {
    "diabetes":      "models/diabetes_model.sav",
    "heart":         "models/heart_disease_model.sav",
    "parkinson":     "models/parkinsons_model.sav",
    "lung_cancer":   "models/lung_cancer_model.sav",
    "breast_cancer": "models/breast_cancer.sav",
    "chronic":       "models/chronic_model.sav",
    "hepatitis":     "models/hepititisc_model.sav",
    "liver":         "models/liver_model.sav",
}
for name, path in model_files.items():
    try:
        models[name] = joblib.load(path)
        print(f"  ✓ {name}")
    except Exception as e:
        print(f"  ✗ {name}: {e}")

# Load symptom/disease model
try:
    from code.DiseaseModel import DiseaseModel
    from code.helper import prepare_symptoms_array
    disease_model = DiseaseModel()
    disease_model.load_xgboost("model/xgboost_model.json")
    symptom_model_loaded = True
    print("  ✓ symptom/disease model")
except Exception as e:
    symptom_model_loaded = False
    print(f"  ✗ symptom model: {e}")

print("All models loaded.\n")


# ── RAG Knowledge Base ────────────────────────────────────────────────────────
# Built once at startup from the 3 CSV files using local sentence-transformer
# embeddings + FAISS. No external embedding API required.

_rag_store = None   # LangChain FAISS vectorstore
_rag_ready  = False


def _build_rag_documents():
    """
    Parse the 3 CSV files into LangChain Document objects.

    Chunking strategy
    -----------------
    symptom_Description.csv  -> 1 doc per disease  (Disease + Description)
    symptom_precaution.csv   -> 1 doc per disease  (Disease + merged precautions)
    Symptom-severity.csv     -> 1 doc per symptom  (Symptom + weight + severity band)
    """
    try:
        from langchain_core.documents import Document
    except ImportError:
        from langchain.schema import Document
    docs = []

    # 1. Disease descriptions
    try:
        df = pd.read_csv("data/symptom_Description.csv")
        df.columns = [c.strip() for c in df.columns]
        for _, row in df.iterrows():
            d = str(row.get("Disease", "")).strip()
            desc = str(row.get("Description", "")).strip()
            if d and desc:
                docs.append(Document(
                    page_content=f"Disease: {d}\nDescription: {desc}",
                    metadata={"source": "symptom_Description.csv", "disease": d, "type": "description"}
                ))
    except Exception as e:
        print(f"  ⚠ symptom_Description.csv: {e}")

    # 2. Disease precautions
    try:
        df = pd.read_csv("data/symptom_precaution.csv")
        df.columns = [c.strip() for c in df.columns]
        prec_cols = [c for c in df.columns if "Precaution" in c]
        for _, row in df.iterrows():
            d = str(row.get("Disease", "")).strip()
            precs = [str(row[c]).strip() for c in prec_cols
                     if pd.notna(row[c]) and str(row[c]).strip() not in ("", "nan")]
            if d and precs:
                docs.append(Document(
                    page_content=f"Disease: {d}\nPrecautions: {'; '.join(precs)}",
                    metadata={"source": "symptom_precaution.csv", "disease": d, "type": "precaution"}
                ))
    except Exception as e:
        print(f"  ⚠ symptom_precaution.csv: {e}")

    # 3. Symptom severity
    try:
        df = pd.read_csv("data/Symptom-severity.csv")
        df.columns = [c.strip() for c in df.columns]
        df["weight"] = pd.to_numeric(df["weight"], errors="coerce").fillna(1)

        def _band(w):
            if w <= 2:   return "mild"
            elif w <= 4: return "moderate"
            elif w <= 6: return "significant"
            return "severe"

        for _, row in df.iterrows():
            sym = str(row.get("Symptom", "")).strip().replace("_", " ")
            w   = int(row["weight"])
            docs.append(Document(
                page_content=f"Symptom: {sym}\nSeverity: weight={w} ({_band(w)})",
                metadata={"source": "Symptom-severity.csv", "symptom": sym, "type": "severity", "weight": w}
            ))
    except Exception as e:
        print(f"  ⚠ Symptom-severity.csv: {e}")

    return docs


def _init_rag():
    global _rag_store, _rag_ready
    try:
        from langchain_community.vectorstores import FAISS
        from langchain_community.embeddings import HuggingFaceEmbeddings

        print("Building RAG knowledge base from 3 CSV files...")
        docs = _build_rag_documents()
        print(f"  → {len(docs)} documents parsed")

        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
        _rag_store = FAISS.from_documents(docs, embeddings)
        _rag_ready = True
        print(f"  ✓ RAG vectorstore ready ({len(docs)} chunks)\n")
    except Exception as e:
        _rag_ready = False
        print(f"  ✗ RAG init failed: {e}")
        print("    To enable RAG install: pip install langchain langchain-community "
              "faiss-cpu sentence-transformers\n")


_init_rag()


def _retrieve_context(query: str, k: int = 8) -> str:
    """Semantic search over the CSV knowledge base. Returns formatted context block."""
    if not _rag_ready or _rag_store is None:
        return ""
    results = _rag_store.similarity_search(query, k=k)
    blocks = [f"[{doc.metadata.get('source','')}]\n{doc.page_content.strip()}"
              for doc in results]
    return "\n\n".join(blocks)


# ── Pydantic Schemas ───────────────────────────────────────────────────────────
class DiabetesInput(BaseModel):
    pregnancies: float
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree: float
    age: float

class HeartInput(BaseModel):
    age: float; sex: int; cp: int; trestbps: float; chol: float
    fbs: int; restecg: int; thalach: float; exang: int; oldpeak: float
    slope: int; ca: int; thal: int

class ParkinsonInput(BaseModel):
    mdvp_fo: float; mdvp_fhi: float; mdvp_flo: float
    mdvp_jitter_pct: float; mdvp_jitter_abs: float; mdvp_rap: float
    mdvp_ppq: float; jitter_ddp: float; mdvp_shimmer: float
    mdvp_shimmer_db: float; shimmer_apq3: float; shimmer_apq5: float
    mdvp_apq: float; shimmer_dda: float; nhr: float; hnr: float
    rpde: float; dfa: float; spread1: float; spread2: float
    d2: float; ppe: float

class LiverInput(BaseModel):
    sex: int; age: float; total_bilirubin: float; direct_bilirubin: float
    alkaline_phosphotase: float; alamine_aminotransferase: float
    aspartate_aminotransferase: float; total_proteins: float
    albumin: float; albumin_globulin_ratio: float

class HepatitisInput(BaseModel):
    age: float; sex: int
    alb: float; alp: float; alt: float; ast: float
    bil: float; che: float; chol: float; crea: float
    ggt: float; prot: float

class LungCancerInput(BaseModel):
    gender: int; age: float
    smoking: int; yellow_fingers: int; anxiety: int
    peer_pressure: int; chronic_disease: int; fatigue: int
    allergy: int; wheezing: int; alcohol_consuming: int
    coughing: int; shortness_of_breath: int
    swallowing_difficulty: int; chest_pain: int

class ChronicKidneyInput(BaseModel):
    age: float; bp: float; sg: float; al: float; su: float
    rbc: int; pc: int; pcc: int; ba: int
    bgr: float; bu: float; sc: float; sod: float; pot: float
    hemo: float; pcv: float; wc: float; rc: float
    htn: int; dm: int; cad: int; appet: int; pe: int; ane: int

class BreastCancerInput(BaseModel):
    radius_mean: float; texture_mean: float; perimeter_mean: float
    area_mean: float; smoothness_mean: float; compactness_mean: float
    concavity_mean: float; concave_points_mean: float; symmetry_mean: float
    fractal_dimension_mean: float; radius_se: float; texture_se: float
    perimeter_se: float; area_se: float; smoothness_se: float
    compactness_se: float; concavity_se: float; concave_points_se: float
    symmetry_se: float; fractal_dimension_se: float
    radius_worst: float; texture_worst: float; perimeter_worst: float
    area_worst: float; smoothness_worst: float; compactness_worst: float
    concavity_worst: float; concave_points_worst: float; symmetry_worst: float
    fractal_dimension_worst: float

class SymptomInput(BaseModel):
    symptoms: List[str]

class SymptomRAGRequest(BaseModel):
    """Payload for the RAG-powered symptom analysis endpoint."""
    symptoms: List[str]
    predicted_disease: str
    probability: float
    alternatives: List[dict]

class GroqRequest(BaseModel):
    disease: str
    positive: bool
    confidence: float
    summary: str

class DietRequest(BaseModel):
    disease: str
    age: str = "Unknown"
    condition: str


# ── Prediction helper ─────────────────────────────────────────────────────────
def make_prediction(model_name: str, features):
    model = models.get(model_name)
    if not model:
        raise HTTPException(status_code=503, detail=f"Model '{model_name}' not loaded")
    pred = model.predict([features])[0]
    try:
        proba      = model.predict_proba([features])[0]
        confidence = float(max(proba))
    except Exception:
        confidence = 1.0
    return bool(pred == 1 or pred == "YES"), confidence


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status":        "ok",
        "models_loaded": list(models.keys()),
        "symptom_model": symptom_model_loaded,
        "rag_ready":     _rag_ready,
    }


# ── Structured disease predictors ─────────────────────────────────────────────
@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesInput):
    features = [data.pregnancies, data.glucose, data.blood_pressure,
                data.skin_thickness, data.insulin, data.bmi,
                data.diabetes_pedigree, data.age]
    positive, confidence = make_prediction("diabetes", features)
    return {"positive": positive, "confidence": confidence,
            "label": "Diabetic" if positive else "Not Diabetic",
            "summary": f"Glucose={data.glucose}, BMI={data.bmi}, Age={data.age}"}

@app.post("/predict/heart")
def predict_heart(data: HeartInput):
    features = [data.age, data.sex, data.cp, data.trestbps, data.chol,
                data.fbs, data.restecg, data.thalach, data.exang,
                data.oldpeak, data.slope, data.ca, data.thal]
    positive, confidence = make_prediction("heart", features)
    return {"positive": positive, "confidence": confidence,
            "label": "Heart Disease Detected" if positive else "No Heart Disease",
            "summary": f"Age={data.age}, Cholesterol={data.chol}, MaxHR={data.thalach}"}

@app.post("/predict/parkinson")
def predict_parkinson(data: ParkinsonInput):
    features = [data.mdvp_fo, data.mdvp_fhi, data.mdvp_flo,
                data.mdvp_jitter_pct, data.mdvp_jitter_abs, data.mdvp_rap,
                data.mdvp_ppq, data.jitter_ddp, data.mdvp_shimmer,
                data.mdvp_shimmer_db, data.shimmer_apq3, data.shimmer_apq5,
                data.mdvp_apq, data.shimmer_dda, data.nhr, data.hnr,
                data.rpde, data.dfa, data.spread1, data.spread2, data.d2, data.ppe]
    positive, confidence = make_prediction("parkinson", features)
    return {"positive": positive, "confidence": confidence,
            "label": "Parkinson's Detected" if positive else "No Parkinson's Detected",
            "summary": f"HNR={data.hnr}, RPDE={data.rpde}, DFA={data.dfa}"}

@app.post("/predict/liver")
def predict_liver(data: LiverInput):
    features = [data.sex, data.age, data.total_bilirubin, data.direct_bilirubin,
                data.alkaline_phosphotase, data.alamine_aminotransferase,
                data.aspartate_aminotransferase, data.total_proteins,
                data.albumin, data.albumin_globulin_ratio]
    positive, confidence = make_prediction("liver", features)
    return {"positive": positive, "confidence": confidence,
            "label": "Liver Disease Detected" if positive else "No Liver Disease",
            "summary": f"Bilirubin={data.total_bilirubin}, Albumin={data.albumin}"}

@app.post("/predict/hepatitis")
def predict_hepatitis(data: HepatitisInput):
    df = pd.DataFrame([{"Age": data.age, "Sex": data.sex, "ALB": data.alb,
                         "ALP": data.alp, "ALT": data.alt, "AST": data.ast,
                         "BIL": data.bil, "CHE": data.che, "CHOL": data.chol,
                         "CREA": data.crea, "GGT": data.ggt, "PROT": data.prot}])
    model = models.get("hepatitis")
    if not model:
        raise HTTPException(status_code=503, detail="Hepatitis model not loaded")
    pred = model.predict(df)[0]
    try:
        proba      = model.predict_proba(df)[0]
        confidence = float(max(proba))
    except Exception:
        confidence = 1.0
    positive = bool(pred == 1)
    return {"positive": positive, "confidence": confidence,
            "label": "Hepatitis Detected" if positive else "No Hepatitis Detected",
            "summary": f"ALT={data.alt}, AST={data.ast}, BIL={data.bil}, GGT={data.ggt}"}

@app.post("/predict/lung_cancer")
def predict_lung_cancer(data: LungCancerInput):
    df = pd.DataFrame([{
        "GENDER": data.gender, "AGE": data.age,
        "SMOKING": data.smoking, "YELLOW_FINGERS": data.yellow_fingers,
        "ANXIETY": data.anxiety, "PEER_PRESSURE": data.peer_pressure,
        "CHRONICDISEASE": data.chronic_disease, "FATIGUE": data.fatigue,
        "ALLERGY": data.allergy, "WHEEZING": data.wheezing,
        "ALCOHOLCONSUMING": data.alcohol_consuming, "COUGHING": data.coughing,
        "SHORTNESSOFBREATH": data.shortness_of_breath,
        "SWALLOWINGDIFFICULTY": data.swallowing_difficulty,
        "CHESTPAIN": data.chest_pain,
    }])
    model = models.get("lung_cancer")
    if not model:
        raise HTTPException(status_code=503, detail="Lung cancer model not loaded")
    pred = model.predict(df)[0]
    try:
        proba      = model.predict_proba(df)[0]
        confidence = float(max(proba))
    except Exception:
        confidence = 1.0
    positive = bool(pred == "YES" or pred == 1)
    return {"positive": positive, "confidence": confidence,
            "label": "Lung Cancer Risk" if positive else "Low Lung Cancer Risk",
            "summary": f"Age={data.age}, Smoking={'Yes' if data.smoking==2 else 'No'}, "
                       f"Coughing={'Yes' if data.coughing==2 else 'No'}"}

@app.post("/predict/chronic_kidney")
def predict_chronic_kidney(data: ChronicKidneyInput):
    df    = pd.DataFrame([data.dict()])
    model = models.get("chronic")
    if not model:
        raise HTTPException(status_code=503, detail="Chronic kidney model not loaded")
    pred = model.predict(df)[0]
    try:
        proba      = model.predict_proba(df)[0]
        confidence = float(max(proba))
    except Exception:
        confidence = 1.0
    positive = bool(pred == 1)
    return {"positive": positive, "confidence": confidence,
            "label": "CKD Detected" if positive else "No Chronic Kidney Disease",
            "summary": f"Age={data.age}, Hemoglobin={data.hemo}, SerumCreatinine={data.sc}"}

@app.post("/predict/breast_cancer")
def predict_breast_cancer(data: BreastCancerInput):
    d = data.dict()
    d["concave points_mean"]  = d.pop("concave_points_mean")
    d["concave points_se"]    = d.pop("concave_points_se")
    d["concave points_worst"] = d.pop("concave_points_worst")
    df    = pd.DataFrame([d])
    model = models.get("breast_cancer")
    if not model:
        raise HTTPException(status_code=503, detail="Breast cancer model not loaded")
    pred = model.predict(df)[0]
    try:
        proba      = model.predict_proba(df)[0]
        confidence = float(max(proba))
    except Exception:
        confidence = 1.0
    positive = bool(pred == 1)
    return {"positive": positive, "confidence": confidence,
            "label": "Malignant Tumor" if positive else "Benign Tumor",
            "summary": f"RadiusMean={data.radius_mean}, AreaMean={data.area_mean}"}


# ── Symptom Prediction (ML model only) ───────────────────────────────────────
@app.post("/predict/symptoms")
def predict_symptoms(data: SymptomInput):
    if not symptom_model_loaded:
        raise HTTPException(status_code=503, detail="Symptom model not loaded")
    if len(data.symptoms) < 3:
        raise HTTPException(status_code=400, detail="Please provide at least 3 symptoms")

    X = prepare_symptoms_array(data.symptoms)
    pred_disease, prob = disease_model.predict(X)

    # Build differential alternatives via predict_proba
    try:
        proba_array = disease_model.model.predict_proba(X)[0]
        top_indices = proba_array.argsort()[::-1]
        others = []
        for idx in top_indices:
            alt_name = disease_model.diseases[idx]
            p        = float(proba_array[idx])
            if alt_name == pred_disease:
                continue
            if p > 0.03:
                others.append({"disease": alt_name, "probability": p})
            if len(others) >= 3:
                break
    except Exception:
        others = []

    desc  = disease_model.describe_predicted_disease()
    precs = disease_model.predicted_disease_precautions()

    return {
        "disease":      pred_disease,
        "probability":  float(prob),
        "alternatives": others,
        "description":  desc,
        "precautions":  list(precs),
    }


# ── RAG-Powered Symptom Analysis (LangChain + Groq) ───────────────────────────
@app.post("/symptoms/rag_analysis")
async def symptom_rag_analysis(req: SymptomRAGRequest):
    """
    Full RAG chain:
    ① Build a semantic retrieval query from symptoms + ML prediction
    ② Retrieve top-8 relevant chunks from the 3-CSV FAISS vector store
    ③ Compute cumulative severity score from Symptom-severity.csv weights
    ④ Build a grounded prompt: retrieved context + external reference list
    ⑤ Call Groq LLM (max_tokens=600, hard cap for fair use)
    ⑥ Return analysis + RAG metadata + token usage
    """
    try:
        from groq import Groq
    except ImportError:
        raise HTTPException(status_code=501,
            detail="groq package not installed. Run: pip install groq")

    if not GROQ_API_KEY or len(GROQ_API_KEY) < 10:
        raise HTTPException(status_code=503, detail="Groq API key not configured on server. Set GROQ_API_KEY environment variable.")

    # ── ① Retrieval query ────────────────────────────────────────────────────
    clean_syms   = [s.replace("_", " ") for s in req.symptoms]
    symptom_str  = ", ".join(clean_syms)
    alt_str      = ", ".join(
        f"{a['disease']} ({a['probability']*100:.1f}%)"
        for a in req.alternatives[:3]
    ) or "none identified"

    retrieval_query = (
        f"{req.predicted_disease} disease. "
        f"Patient symptoms: {symptom_str}. "
        f"Precautions and clinical description for {req.predicted_disease}."
    )

    # ── ② Retrieve context from vector store ────────────────────────────────
    rag_context = _retrieve_context(retrieval_query, k=8)
    if not rag_context:
        rag_context = (
            "[Local knowledge base unavailable — no CSVs indexed. "
            "Rely on clinical training data only.]"
        )

    # ── ③ Severity score from CSV weights ───────────────────────────────────
    try:
        sev_df = pd.read_csv("data/Symptom-severity.csv")
        sev_df.columns = [c.strip() for c in sev_df.columns]
        sev_map = dict(zip(
            sev_df["Symptom"].str.strip(),
            pd.to_numeric(sev_df["weight"], errors="coerce").fillna(1)
        ))
        total_weight = sum(sev_map.get(s, 1) for s in req.symptoms)
        avg_weight   = total_weight / max(len(req.symptoms), 1)
        if avg_weight <= 2:   severity_label = "Mild"
        elif avg_weight <= 4: severity_label = "Moderate"
        elif avg_weight <= 6: severity_label = "Significant"
        else:                 severity_label = "Severe"
        # Identify the highest-weight symptoms for the prompt
        top_severe = sorted(
            [(s.replace("_", " "), int(sev_map.get(s, 1))) for s in req.symptoms],
            key=lambda x: x[1], reverse=True
        )[:3]
        top_severe_str = ", ".join(f"{s} (w={w})" for s, w in top_severe)
    except Exception:
        total_weight   = len(req.symptoms)
        avg_weight     = 1.0
        severity_label = "Unknown"
        top_severe_str = symptom_str

    # ── ④ Build grounded RAG prompt ──────────────────────────────────────────
    system_prompt = (
        "You are MediPredict AI, a clinical decision support assistant. "
        "You generate evidence-grounded second opinions using a curated medical "
        "knowledge base (retrieved below) plus established external references. "
        "Cite which source informs each point. Be concise. Never fabricate facts. "
        "Always end with a safety disclaimer."
    )

    user_prompt = f"""## Patient Symptom Report

**Reported Symptoms** ({len(req.symptoms)}): {symptom_str}
**Severity Level**: {severity_label} (cumulative score: {total_weight}, avg: {avg_weight:.1f}/symptom)
**Highest-severity symptoms**: {top_severe_str}

**ML Model Prediction**: {req.predicted_disease} — {req.probability*100:.1f}% confidence
**Differential Diagnoses (model)**: {alt_str}

---
## Retrieved Knowledge Base
(Sources: symptom_Description.csv · symptom_precaution.csv · Symptom-severity.csv)

{rag_context}

---
## External Reference Guidelines
- WHO ICD-11 classifications (icd.who.int)
- MedlinePlus patient summaries (medlineplus.gov)
- Mayo Clinic symptom patterns (mayoclinic.org)
- CDC disease factsheets (cdc.gov)

---
## Analysis Required

**1. Diagnosis Assessment**
Does the symptom profile support the ML prediction of {req.predicted_disease}?
Note any red flags or inconsistencies (2-3 sentences).

**2. Severity Interpretation**
Based on the {severity_label} severity score, comment on urgency and the most concerning symptoms.

**3. Key Precautions** (max 5 bullets, drawn from knowledge base)
Prioritise by clinical urgency.

**4. Differential Diagnoses to Rule Out** (max 3)
Brief reasoning for each. Note overlap with model alternatives where relevant.

**5. Recommended Next Steps**
- Specialist to consult
- Diagnostic tests to order
- Urgency: Routine / Within 1 week / Within 24-48h / Emergency

---
⚠️ **Disclaimer**: This AI analysis is for informational purposes only and is NOT a substitute for professional medical diagnosis, advice, or treatment. Always consult a qualified healthcare provider."""

    # ── ⑤ Call Groq LLM (token-capped) ──────────────────────────────────────
    # max_tokens=600  → keeps response focused; prevents runaway token cost
    # temperature=0.2 → factual, low hallucination risk for medical content
    try:
        client   = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_prompt},
            ],
            max_tokens=600,   # hard fair-use cap
            temperature=0.2,
            top_p=0.9,
            stream=False,
        )
        analysis = response.choices[0].message.content
        usage    = response.usage

        # ── ⑥ Return full result + metadata ──────────────────────────────────
        return {
            "analysis":       analysis,
            "rag_used":       _rag_ready,
            "severity":       severity_label,
            "severity_score": int(total_weight),
            "avg_severity":   round(avg_weight, 2),
            "symptoms_count": len(req.symptoms),
            "retrieved_docs": 8 if _rag_ready else 0,
            "tokens_used": {
                "prompt":     usage.prompt_tokens,
                "completion": usage.completion_tokens,
                "total":      usage.total_tokens,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API error: {str(e)}")


# ── Generic second opinion (non-symptom disease predictors) ───────────────────
@app.post("/groq/opinion")
async def groq_opinion(req: GroqRequest):
    """
    Lightweight second opinion for structured biomarker predictors
    (diabetes, heart, parkinson, etc.). No RAG needed — inputs are numeric.
    max_tokens=500 for fair use.
    """
    try:
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY)
        status = ("POSITIVE — condition likely present"
                  if req.positive else "NEGATIVE — condition not detected")

        prompt = f"""You are a clinical decision support assistant providing a second opinion.

ML Model result: {req.disease} — {status} (confidence: {req.confidence*100:.1f}%)
Patient data summary: {req.summary}

Provide a structured second opinion covering:
1. Agreement/disagreement with the ML prediction and brief clinical reasoning
2. Up to 3 alternative conditions to consider
3. Recommended diagnostic tests or examinations
4. Specialist type to consult
5. Immediate lifestyle or safety advice if relevant

Be concise (max 5 bullet points per section). Always include the disclaimer that \
this is NOT a substitute for professional medical advice."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,   # fair-use cap for non-RAG opinion
            temperature=0.25,
        )
        return {
            "opinion":      response.choices[0].message.content,
            "tokens_used":  response.usage.total_tokens,
        }
    except ImportError:
        raise HTTPException(status_code=501,
            detail="groq package not installed. Run: pip install groq")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




# ── Personalized Diet Recommendations (Groq) ──────────────────────────────────
@app.post("/groq/diet")
async def groq_diet(req: DietRequest):
    """
    Generate personalized diet recommendations based on disease and patient condition.
    max_tokens=500 for fair use.
    """
    try:
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY)

        prompt = f"""You are a clinical nutritionist providing personalized diet recommendations.

Patient profile:
- Disease/Condition: {req.disease}
- Age: {req.age}
- Clinical summary: {req.condition}

Provide structured, practical diet recommendations covering:
**Foods to Include**
- List 4-5 specific foods that are beneficial for this condition with brief reasons

**Foods to Avoid**
- List 4-5 specific foods or categories to avoid with brief reasons

**Daily Meal Tips**
- 3 practical tips for meal planning with this condition

**Nutrients to Focus On**
- 3 key nutrients important for this condition

Keep responses concise and actionable. End with a brief note that this is general guidance and a registered dietitian should be consulted for a personalized plan."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.3,
        )
        return {
            "diet_plan":    response.choices[0].message.content,
            "tokens_used":  response.usage.total_tokens,
        }
    except ImportError:
        raise HTTPException(status_code=501,
            detail="groq package not installed. Run: pip install groq")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=False)
