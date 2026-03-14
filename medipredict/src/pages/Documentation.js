import { useState } from "react";
import { T, Panel, PanelHeader } from "../components/UIComponents";

function CodeBlock({ code, lang = "bash" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div style={{ position: "relative", marginBottom: "12px" }}>
      <div style={{
        padding: "14px 16px",
        background: T.bg,
        border: `1px solid ${T.border}`,
        borderRadius: "7px",
        fontFamily: T.fontMono, fontSize: "12px", color: T.teal,
        lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre",
      }}>{code}</div>
      <button onClick={copy}
        style={{
          position: "absolute", top: "8px", right: "8px",
          padding: "3px 8px", borderRadius: "4px",
          background: copied ? `${T.green}20` : T.bg3,
          border: `1px solid ${copied ? T.green + "44" : T.border}`,
          fontFamily: T.fontMono, fontSize: "9px",
          color: copied ? T.green : T.textMuted,
          cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.5px",
        }}>
        {copied ? "COPIED" : "COPY"}
      </button>
    </div>
  );
}

function EndpointRow({ method, path, desc, body, response }) {
  const [open, setOpen] = useState(false);
  const methodColor = method === "POST" ? T.teal : method === "GET" ? T.green : T.amber;
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "12px 0", cursor: "pointer",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
        <span style={{
          fontFamily: T.fontMono, fontSize: "9px", fontWeight: 600,
          padding: "3px 8px", borderRadius: "3px", flexShrink: 0,
          background: `${methodColor}18`, color: methodColor,
          border: `1px solid ${methodColor}33`, letterSpacing: "0.5px",
          minWidth: "44px", textAlign: "center",
        }}>{method}</span>
        <code style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textPri, flex: 1 }}>{path}</code>
        <span style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec }}>{desc}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.textMuted, flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 0 16px 56px" }}>
          {body && (
            <>
              <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "1.2px", marginBottom: "6px" }}>REQUEST BODY</div>
              <CodeBlock code={body} />
            </>
          )}
          {response && (
            <>
              <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "1.2px", marginBottom: "6px" }}>RESPONSE</div>
              <CodeBlock code={response} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, badge, children }) {
  return (
    <Panel style={{ marginBottom: "20px" }}>
      <PanelHeader icon="◈" title={title} badge={badge} />
      <div style={{ padding: "20px 24px" }}>{children}</div>
    </Panel>
  );
}

function Step({ n, title, children, color = T.teal }) {
  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "6px", flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: T.fontMono, fontSize: "11px", fontWeight: 600, color,
      }}>{n}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "13px", color: T.textPri, marginBottom: "6px", letterSpacing: "0.3px" }}>{title}</div>
        <div style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  );
}

function ModelRow({ name, file, algo, accuracy, color }) {
  const pct = parseFloat(accuracy);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ flex: "0 0 140px", fontFamily: T.fontDisp, fontWeight: 600, fontSize: "12px", color: T.textPri }}>{name}</div>
      <div style={{ flex: "0 0 180px", fontFamily: T.fontMono, fontSize: "10px", color: T.textMuted }}>{file}</div>
      <div style={{ flex: "0 0 140px", fontFamily: T.fontMono, fontSize: "10px", color: T.textSec }}>{algo}</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ flex: 1, height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "2px", transition: "width 0.8s ease" }} />
        </div>
        <span style={{ fontFamily: T.fontMono, fontSize: "10px", color, minWidth: "38px", textAlign: "right" }}>{accuracy}</span>
      </div>
    </div>
  );
}

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("quickstart");

  const sections = [
    { id: "quickstart",    label: "Quick Start" },
    { id: "installation",  label: "Installation" },
    { id: "api",           label: "API Reference" },
    { id: "models",        label: "ML Models" },
    { id: "rag",           label: "RAG System" },
    { id: "groq",          label: "Groq AI" },
    { id: "config",        label: "Configuration" },
  ];

  const endpoints = [
    { method: "GET",  path: "/health", desc: "Backend health check",
      body: null,
      response: `{ "status": "ok", "models_loaded": 9 }` },
    { method: "POST", path: "/predict/symptoms", desc: "Symptom-based disease prediction",
      body: `{ "symptoms": ["fatigue", "headache", "fever", "nausea"] }`,
      response: `{\n  "disease": "Malaria",\n  "probability": 0.87,\n  "alternatives": [{ "disease": "Dengue", "probability": 0.06 }],\n  "description": "...",\n  "precautions": ["Consult doctor", "Take prescribed medication", ...]\n}` },
    { method: "POST", path: "/predict/diabetes", desc: "Diabetes risk prediction",
      body: `{\n  "pregnancies": 2, "glucose": 138, "blood_pressure": 80,\n  "skin_thickness": 20, "insulin": 80, "bmi": 31.5,\n  "diabetes_pedigree": 0.627, "age": 42\n}`,
      response: `{ "positive": true, "confidence": 0.84, "label": "Diabetic", "summary": "Glucose=138, BMI=31.5, Age=42" }` },
    { method: "POST", path: "/predict/heart", desc: "Heart disease prediction",
      body: `{ "age": 55, "sex": 1, "cp": 3, "trestbps": 145, "chol": 260,\n  "fbs": 0, "restecg": 1, "thalach": 148, "exang": 0,\n  "oldpeak": 1.4, "slope": 1, "ca": 1, "thal": 2 }`,
      response: `{ "positive": true, "confidence": 0.79, "label": "Heart Disease Detected", "summary": "..." }` },
    { method: "POST", path: "/predict/parkinson", desc: "Parkinson's detection via voice biomarkers",
      body: `{ "mdvp_fo": 119.99, "mdvp_fhi": 157.30, "mdvp_flo": 74.99,\n  "hnr": 21.033, "rpde": 0.414783, "dfa": 0.815285, ... }`,
      response: `{ "positive": false, "confidence": 0.91, "label": "No Parkinson's Detected", "summary": "..." }` },
    { method: "POST", path: "/predict/liver", desc: "Liver disease from blood markers",
      body: `{ "sex": 0, "age": 45, "total_bilirubin": 1.8, "direct_bilirubin": 0.5,\n  "alkaline_phosphotase": 220, "albumin": 3.2, ... }`,
      response: `{ "positive": true, "confidence": 0.74, "label": "Liver Disease Detected", "summary": "..." }` },
    { method: "POST", path: "/predict/hepatitis", desc: "Hepatitis C detection",
      body: `{ "age": 40, "sex": 1, "alb": 38.5, "alp": 52.5, "alt": 7.7,\n  "ast": 22.1, "bil": 7.5, "ggt": 12.1, ... }`,
      response: `{ "positive": false, "confidence": 0.92, "label": "No Hepatitis Detected", "summary": "..." }` },
    { method: "POST", path: "/predict/lung_cancer", desc: "Lung cancer risk prediction",
      body: `{ "gender": 1, "age": 58, "smoking": 2, "yellow_fingers": 1,\n  "anxiety": 1, "coughing": 2, "chest_pain": 2, ... }`,
      response: `{ "positive": true, "confidence": 0.97, "label": "Lung Cancer Risk", "summary": "..." }` },
    { method: "POST", path: "/predict/chronic_kidney", desc: "CKD prediction",
      body: `{ "age": 55, "bp": 90, "sg": 1.010, "al": 2, "su": 0,\n  "hemo": 11.2, "sc": 2.4, "htn": 1, "dm": 1, ... }`,
      response: `{ "positive": true, "confidence": 1.0, "label": "CKD Detected", "summary": "..." }` },
    { method: "POST", path: "/predict/breast_cancer", desc: "Tumor malignancy prediction",
      body: `{ "radius_mean": 17.99, "texture_mean": 10.38,\n  "area_mean": 1001.0, "concavity_mean": 0.3001, ... }`,
      response: `{ "positive": true, "confidence": 0.97, "label": "Malignant Tumor", "summary": "..." }` },
    { method: "POST", path: "/symptoms/rag_analysis", desc: "RAG-powered symptom analysis (LangChain + Groq)",
      body: `{\n  "symptoms": ["fatigue", "fever", "headache"],\n  "api_key": "gsk_..."\n}`,
      response: `{\n  "analysis": "...", "rag_used": true,\n  "severity": "Moderate", "severity_score": 18,\n  "retrieved_docs": 8, "tokens_used": { "total": 1240 }\n}` },
    { method: "POST", path: "/groq/opinion", desc: "LLM second opinion for binary predictors",
      body: `{\n  "disease": "Diabetes", "positive": true,\n  "confidence": 0.84, "summary": "Glucose=138, BMI=31.5",\n  "api_key": "gsk_..."\n}`,
      response: `{ "opinion": "...", "tokens_used": 480 }` },
    { method: "POST", path: "/groq/diet", desc: "Personalized diet recommendations",
      body: `{\n  "disease": "Diabetes", "age": "42",\n  "condition": "Diabetic patient with high glucose",\n  "api_key": "gsk_..."\n}`,
      response: `{ "diet_plan": "...", "tokens_used": 460 }` },
  ];

  const models = [
    { name: "Symptom Checker", file: "xgboost_model.sav",     algo: "RandomForest",      accuracy: "100%",  color: T.teal },
    { name: "Diabetes",        file: "diabetes_model.sav",    algo: "RandomForest",      accuracy: "72.1%", color: "#ff6b6b" },
    { name: "Heart Disease",   file: "heart_disease_model.sav",algo: "RandomForest",     accuracy: "79.6%", color: "#ff4757" },
    { name: "Parkinson's",     file: "parkinsons_model.sav",  algo: "SVC Pipeline",      accuracy: "89.7%", color: "#a29bfe" },
    { name: "Liver Disease",   file: "liver_model.sav",       algo: "RandomForest",      accuracy: "74.4%", color: "#fd9644" },
    { name: "Hepatitis C",     file: "hepititisc_model.sav",  algo: "GradientBoosting",  accuracy: "91.9%", color: "#26de81" },
    { name: "Lung Cancer",     file: "lung_cancer_model.sav", algo: "RandomForest",      accuracy: "96.8%", color: "#45aaf2" },
    { name: "Chronic Kidney",  file: "chronic_model.sav",     algo: "RandomForest",      accuracy: "100%",  color: "#fd79a8" },
    { name: "Breast Cancer",   file: "breast_cancer.sav",     algo: "RandomForest",      accuracy: "96.5%", color: "#e84393" },
  ];

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>

      {/* Sticky side nav */}
      <div style={{
        width: "200px", flexShrink: 0,
        padding: "24px 16px",
        borderRight: `1px solid ${T.border}`,
        background: T.bg1,
        position: "sticky", top: 0, height: "100%",
        overflowY: "auto",
      }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "8px", color: T.textMuted, letterSpacing: "2px", marginBottom: "12px" }}>CONTENTS</div>
        {sections.map(s => {
          const active = activeSection === s.id;
          return (
            <div key={s.id} onClick={() => setActiveSection(s.id)}
              style={{
                padding: "8px 10px", borderRadius: "5px", cursor: "pointer",
                background: active ? `${T.teal}14` : "transparent",
                border: `1px solid ${active ? T.teal + "33" : "transparent"}`,
                fontFamily: T.fontDisp, fontWeight: active ? 600 : 400,
                fontSize: "12px", letterSpacing: "0.5px",
                color: active ? T.teal : T.textSec,
                marginBottom: "2px", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
              {s.label}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>

        {/* ── Quick Start ─────────────────────────────────────── */}
        {activeSection === "quickstart" && (
          <>
            <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "2.5px", marginBottom: "8px" }}>// QUICK START</div>
            <h2 style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "28px", color: T.textPri, marginBottom: "20px" }}>Get Running in 5 Minutes</h2>
            <Section title="Prerequisites" badge="REQUIRED">
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                {[["Python", "3.8+"], ["Node.js", "16+"], ["npm", "8+"], ["Groq API Key", "Optional"]].map(([k, v]) => (
                  <div key={k} style={{ padding: "8px 14px", background: T.bg3, border: `1px solid ${T.border}`, borderRadius: "6px" }}>
                    <div style={{ fontFamily: T.fontDisp, fontWeight: 600, fontSize: "12px", color: T.textPri }}>{k}</div>
                    <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.teal }}>{v}</div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Start Backend" badge="TERMINAL">
              <Step n="1" title="Navigate to the Frontend directory">Go to your project's <code style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.teal, background: T.bg3, padding: "1px 5px", borderRadius: "3px" }}>Frontend/</code> folder where <code style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.teal, background: T.bg3, padding: "1px 5px", borderRadius: "3px" }}>api.py</code> lives.</Step>
              <Step n="2" title="Install Python dependencies">
                <CodeBlock code={`pip install fastapi uvicorn scikit-learn pandas numpy groq\npip install langchain langchain-community faiss-cpu sentence-transformers`} />
              </Step>
              <Step n="3" title="Start the FastAPI server">
                <CodeBlock code={`python api.py\n# Server starts at http://localhost:8000\n# ✓ RAG vectorstore ready (220 chunks)`} />
              </Step>
            </Section>
            <Section title="Start Frontend" badge="TERMINAL">
              <Step n="4" title="Navigate to the React app directory">
                <CodeBlock code={`cd C:\\Users\\shant\\OneDrive\\Desktop\\mp\\medipredict`} />
              </Step>
              <Step n="5" title="Install dependencies and start">
                <CodeBlock code={`npm install\nnpm start\n# App opens at http://localhost:3000`} />
              </Step>
              <Step n="6" title="Add your Groq API key" color={T.amber}>Navigate to <strong style={{ color: T.textPri }}>Settings</strong> in the navbar, paste your <code style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.teal, background: T.bg3, padding: "1px 5px", borderRadius: "3px" }}>gsk_…</code> key to unlock AI second opinions and diet plans. Get a free key at <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{ color: T.teal }}>console.groq.com</a>.</Step>
            </Section>
          </>
        )}

        {/* ── Installation ────────────────────────────────────── */}
        {activeSection === "installation" && (
          <>
            <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "2.5px", marginBottom: "8px" }}>// INSTALLATION</div>
            <h2 style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "28px", color: T.textPri, marginBottom: "20px" }}>Full Installation Guide</h2>
            <Section title="Python Backend Dependencies" badge="pip">
              <CodeBlock code={`# Core\npip install fastapi uvicorn pandas numpy scikit-learn joblib\n\n# AI / LLM\npip install groq\n\n# RAG Chain\npip install langchain langchain-community faiss-cpu sentence-transformers torch\n\n# Optional: retrain models\npip install xgboost`} />
            </Section>
            <Section title="Project File Structure" badge="REQUIRED FILES">
              <CodeBlock code={`Frontend/\n├── api.py                      ← FastAPI backend (11 endpoints)\n├── retrain_all_models.py\n├── code/\n│   ├── DiseaseModel.py\n│   ├── helper.py\n│   └── train.py\n├── data/\n│   ├── symptom_Description.csv   ← RAG source\n│   ├── symptom_precaution.csv    ← RAG source\n│   ├── Symptom-severity.csv      ← RAG source\n│   └── clean_dataset.tsv\n├── model/\n│   ├── xgboost_model.sav         ← Symptom model\n│   └── label_encoder.sav\n└── models/\n    ├── diabetes_model.sav\n    ├── heart_disease_model.sav\n    ├── parkinsons_model.sav\n    ├── liver_model.sav\n    ├── hepititisc_model.sav\n    ├── lung_cancer_model.sav\n    ├── chronic_model.sav\n    └── breast_cancer.sav`} />
            </Section>
            <Section title="Retrain Models" badge="OPTIONAL">
              <p style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, lineHeight: 1.65, marginBottom: "12px" }}>To retrain all 8 binary disease models from scratch:</p>
              <CodeBlock code={`cd Frontend\npython retrain_all_models.py`} />
              <p style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, lineHeight: 1.65, marginTop: "8px" }}>To retrain the symptom checker model:</p>
              <CodeBlock code={`cd Frontend\npython code/train.py`} />
            </Section>
          </>
        )}

        {/* ── API Reference ────────────────────────────────────── */}
        {activeSection === "api" && (
          <>
            <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "2.5px", marginBottom: "8px" }}>// API REFERENCE</div>
            <h2 style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "28px", color: T.textPri, marginBottom: "6px" }}>REST API Endpoints</h2>
            <p style={{ fontFamily: T.fontBody, fontSize: "13px", color: T.textSec, marginBottom: "20px" }}>
              Base URL: <code style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.teal, background: T.bg3, padding: "2px 7px", borderRadius: "4px" }}>http://localhost:8000</code>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" style={{ color: T.teal, fontSize: "12px" }}>Swagger UI →</a>
            </p>
            <Panel>
              <PanelHeader icon="◈" title="All Endpoints" badge={`${endpoints.length} TOTAL`} />
              <div style={{ padding: "8px 20px" }}>
                {endpoints.map((ep, i) => <EndpointRow key={i} {...ep} />)}
              </div>
            </Panel>
          </>
        )}

        {/* ── ML Models ────────────────────────────────────────── */}
        {activeSection === "models" && (
          <>
            <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "2.5px", marginBottom: "8px" }}>// ML MODELS</div>
            <h2 style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "28px", color: T.textPri, marginBottom: "20px" }}>Trained Models</h2>
            <Panel style={{ marginBottom: "20px" }}>
              <PanelHeader icon="◎" title="Model Performance" badge="9 MODELS" />
              <div style={{ padding: "8px 20px 16px" }}>
                <div style={{ display: "flex", gap: "12px", padding: "8px 0 12px", borderBottom: `1px solid ${T.border}` }}>
                  {["NAME", "FILE", "ALGORITHM", "ACCURACY"].map(h => (
                    <div key={h} style={{ fontFamily: T.fontMono, fontSize: "8px", color: T.textMuted, letterSpacing: "1.5px", flex: h === "ACCURACY" ? 1 : h === "NAME" ? "0 0 140px" : h === "FILE" ? "0 0 180px" : "0 0 140px" }}>{h}</div>
                  ))}
                </div>
                {models.map((m, i) => <ModelRow key={i} {...m} />)}
              </div>
            </Panel>
            <Section title="Model Notes" badge="INFO">
              <p style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, lineHeight: 1.7, marginBottom: "10px" }}>
                All models are saved as <code style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.teal, background: T.bg3, padding: "1px 5px", borderRadius: "3px" }}>.sav</code> files using joblib. Despite the file name <code style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.teal, background: T.bg3, padding: "1px 5px", borderRadius: "3px" }}>xgboost_model.sav</code>, the symptom checker uses a RandomForest classifier — the name is a legacy artifact from earlier development.
              </p>
              <p style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, lineHeight: 1.7 }}>
                A harmless <code style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.amber, background: T.bg3, padding: "1px 5px", borderRadius: "3px" }}>UserWarning: X does not have valid feature names</code> may appear in the terminal. This does not affect prediction accuracy.
              </p>
            </Section>
          </>
        )}

        {/* ── RAG System ───────────────────────────────────────── */}
        {activeSection === "rag" && (
          <>
            <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "2.5px", marginBottom: "8px" }}>// RAG SYSTEM</div>
            <h2 style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "28px", color: T.textPri, marginBottom: "20px" }}>RAG Chain Architecture</h2>
            <Section title="Overview" badge="LANGCHAIN + FAISS">
              <p style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, lineHeight: 1.7, marginBottom: "12px" }}>
                The Symptom Checker uses a Retrieval-Augmented Generation (RAG) pipeline instead of a direct LLM call. This grounds responses in real medical CSV data, reducing hallucinations.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  ["1", "Build semantic query",    "Combines predicted disease + symptoms into a retrieval string", T.teal],
                  ["2", "FAISS vector search",     "Retrieves top-8 chunks from 220 embedded documents using all-MiniLM-L6-v2", "#a29bfe"],
                  ["3", "Severity scoring",        "Sums symptom severity weights from Symptom-severity.csv → Mild/Moderate/Severe", T.amber],
                  ["4", "Grounded prompt",         "Injects retrieved CSV context + external references (WHO, MedlinePlus, CDC)", T.green],
                  ["5", "Groq LLM call",           "llama-3.3-70b generates response with max_tokens=600, temperature=0.2", "#fd79a8"],
                ].map(([n, title, desc, color]) => (
                  <div key={n} style={{ display: "flex", gap: "12px", padding: "10px 14px", background: T.bg3, borderRadius: "7px", border: `1px solid ${T.border}` }}>
                    <span style={{ fontFamily: T.fontMono, fontSize: "10px", color, flexShrink: 0, minWidth: "16px" }}>{n}.</span>
                    <div>
                      <div style={{ fontFamily: T.fontDisp, fontWeight: 600, fontSize: "12px", color: T.textPri, marginBottom: "2px" }}>{title}</div>
                      <div style={{ fontFamily: T.fontBody, fontSize: "11px", color: T.textSec }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Knowledge Base Files" badge="3 CSV FILES">
              {[
                ["symptom_Description.csv",  "42 diseases with plain-language descriptions",              "1 doc / disease"],
                ["symptom_precaution.csv",   "42 diseases with up to 4 precautions each",                "1 doc / disease"],
                ["Symptom-severity.csv",     "133 symptoms with integer severity weights (1–7)",          "1 doc / symptom"],
              ].map(([file, desc, chunks]) => (
                <div key={file} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                  <code style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.teal, flex: "0 0 240px" }}>{file}</code>
                  <span style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, flex: 1 }}>{desc}</span>
                  <span style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, flexShrink: 0 }}>{chunks}</span>
                </div>
              ))}
            </Section>
          </>
        )}

        {/* ── Groq AI ──────────────────────────────────────────── */}
        {activeSection === "groq" && (
          <>
            <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "2.5px", marginBottom: "8px" }}>// GROQ AI</div>
            <h2 style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "28px", color: T.textPri, marginBottom: "20px" }}>Groq LLM Integration</h2>
            <Section title="Getting a Free API Key" badge="FREE TIER">
              <Step n="1" title="Visit the Groq Console">Go to <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{ color: T.teal }}>console.groq.com</a> and sign up for a free account.</Step>
              <Step n="2" title="Generate an API key">In the console, navigate to API Keys and create a new key. It will start with <code style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.teal, background: T.bg3, padding: "1px 5px", borderRadius: "3px" }}>gsk_</code>.</Step>
              <Step n="3" title="Add it to MediPredict">Click <strong style={{ color: T.textPri }}>Settings</strong> in the navbar and paste your key. The app stores it in React state only — it is never saved to disk.</Step>
            </Section>
            <Section title="Endpoints & Token Limits" badge="FAIR USE">
              {[
                ["/symptoms/rag_analysis", "RAG + LLM symptom analysis",     "600",  "0.2"],
                ["/groq/opinion",          "LLM second opinion for predictors","500", "0.25"],
                ["/groq/diet",             "Personalized diet recommendations","500", "0.3"],
              ].map(([ep, desc, tokens, temp]) => (
                <div key={ep} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${T.border}`, alignItems: "center" }}>
                  <code style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.teal, flex: "0 0 200px" }}>{ep}</code>
                  <span style={{ flex: 1, fontFamily: T.fontBody, fontSize: "12px", color: T.textSec }}>{desc}</span>
                  <span style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.amber, flexShrink: 0 }}>max_tokens={tokens}</span>
                  <span style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.textMuted, flexShrink: 0 }}>temp={temp}</span>
                </div>
              ))}
            </Section>
          </>
        )}

        {/* ── Configuration ─────────────────────────────────────── */}
        {activeSection === "config" && (
          <>
            <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "2.5px", marginBottom: "8px" }}>// CONFIGURATION</div>
            <h2 style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "28px", color: T.textPri, marginBottom: "20px" }}>Configuration</h2>
            <Section title="Frontend Constants" badge="src/constants.js">
              <CodeBlock code={`export const API_BASE = "http://localhost:8000";\n\nexport const DISEASES = [\n  { id: "symptom",  label: "Symptom Checker", endpoint: "/predict/symptoms",       ... },\n  { id: "diabetes", label: "Diabetes",        endpoint: "/predict/diabetes",        ... },\n  { id: "heart",    label: "Heart Disease",   endpoint: "/predict/heart",           ... },\n  // ... 6 more\n];`} />
            </Section>
            <Section title="Backend Port / CORS" badge="api.py">
              <p style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, lineHeight: 1.65, marginBottom: "10px" }}>To change the port or allowed origins, edit the bottom of <code style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.teal, background: T.bg3, padding: "1px 5px", borderRadius: "3px" }}>api.py</code>:</p>
              <CodeBlock code={`# api.py — bottom of file\nif __name__ == "__main__":\n    import uvicorn\n    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)\n\n# CORS is configured to allow all origins by default:\n# app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)`} />
            </Section>
            <Section title="Environment" badge="TESTED ON">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  ["Python", "3.14 (Windows)"],
                  ["scikit-learn", "1.8.0"],
                  ["pandas", "2.3.3"],
                  ["numpy", "2.4.2"],
                  ["Node.js", "16+"],
                  ["React", "18 (CRA 5.1.0)"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: T.bg3, borderRadius: "6px", border: `1px solid ${T.border}` }}>
                    <span style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textSec }}>{k}</span>
                    <span style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.teal }}>{v}</span>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
