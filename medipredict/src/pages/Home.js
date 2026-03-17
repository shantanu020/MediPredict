import { useState, useEffect } from "react";
import { T } from "../components/UIComponents";
import { DISEASES } from "../constants";
import { Brain, Zap, Database, Server, Activity } from "lucide-react";
import { Stethoscope } from "lucide-react";

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, suffix="" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val}{suffix}</>;
}

// ── Typewriter ────────────────────────────────────────────────────────────────
function Typewriter({ lines, speed=45 }) {
  const [display, setDisplay] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const full = lines[lineIdx];
    if (charIdx < full.length) {
      const t = setTimeout(() => {
        setDisplay(p => p + full[charIdx]);
        setCharIdx(c => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else if (lineIdx < lines.length - 1) {
      const t = setTimeout(() => {
        setDisplay(p => p + "\n");
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }, 400);
      return () => clearTimeout(t);
    } else {
      setDone(true);
    }
  }, [charIdx, lineIdx, done, lines, speed]);

  return (
    <span style={{ whiteSpace: "pre" }}>
      {display}
      {!done && <span style={{ animation: "blink 1s step-end infinite", color: T.teal }}>█</span>}
    </span>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, color, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      padding: "24px 20px",
      background: T.bg2,
      border: `1px solid ${color}33`,
      borderRadius: "10px",
      textAlign: "center",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "all 0.5s ease-out",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: `linear-gradient(90deg,transparent,${color},transparent)`,
      }} />
      <div style={{
        fontFamily: T.fontDisp, fontWeight: 700, fontSize: "36px",
        color, lineHeight: 1, marginBottom: "8px",
        textShadow: `0 0 24px ${color}55`,
      }}>
        {visible ? <Counter target={value} suffix={suffix} /> : "0"}
      </div>
      <div style={{
        fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted,
        letterSpacing: "1.5px", textTransform: "uppercase",
      }}>{label}</div>
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color, tags, delay }) {
  const [hov, setHov] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "24px",
        background: hov ? `${color}09` : T.bg2,
        border: `1px solid ${hov ? color + "55" : T.border}`,
        borderRadius: "12px",
        transition: "all 0.2s ease",
        transform: visible ? (hov ? "translateY(-3px)" : "translateY(0)") : "translateY(20px)",
        opacity: visible ? 1 : 0,
        cursor: "default",
        position: "relative", overflow: "hidden",
      }}>
      {hov && <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: `linear-gradient(90deg,transparent,${color},transparent)`,
      }} />}
      <div style={{
        width: "42px", height: "42px", borderRadius: "8px", marginBottom: "16px",
        background: `${color}15`, border: `1px solid ${color}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px",
      }}>{icon}</div>
      
      <div style={{
        fontFamily: T.fontDisp, fontWeight: 700, fontSize: "15px",
        color: T.textPri, letterSpacing: "0.5px", marginBottom: "8px",
      }}>{title}</div>
      <div style={{
        fontFamily: T.fontBody, fontSize: "13px", color: T.textSec,
        lineHeight: 1.65, marginBottom: "14px",
      }}>{desc}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {tags.map(tag => (
          <span key={tag} style={{
            fontFamily: T.fontMono, fontSize: "9px", color: color,
            padding: "2px 8px", borderRadius: "3px",
            background: `${color}14`, border: `1px solid ${color}30`,
            letterSpacing: "0.5px",
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

// ── Disease tag pill ──────────────────────────────────────────────────────────
function DiseasePill({ disease, delay }) {
  const [hov, setHov] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "10px 14px",
        background: hov ? `${disease.color}12` : T.bg3,
        border: `1px solid ${hov ? disease.color + "55" : T.border}`,
        borderRadius: "8px",
        transition: "all 0.18s",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.92)",
        cursor: "default",
      }}>
      <span style={{ fontSize: "18px" }}>{disease.icon}</span>
      <div>
        <div style={{
          fontFamily: T.fontDisp, fontWeight: 600, fontSize: "12px",
          color: hov ? disease.color : T.textPri, letterSpacing: "0.5px",
          transition: "color 0.18s",
        }}>{disease.label}</div>
        <div style={{
          fontFamily: T.fontMono, fontSize: "8px", color: T.textMuted,
          marginTop: "1px", letterSpacing: "0.5px",
        }}>{disease.desc.split(" ").slice(0, 4).join(" ")}…</div>
      </div>
    </div>
  );
}

// ── Main Home component ───────────────────────────────────────────────────────
export default function Home({ setCurrentPage, setActiveDisease, handleDiseaseChange }) {

  const features = [
    {
      icon: <Activity size={20} />,
      title: "9 ML Prediction Models", color: T.teal,
      desc: "Trained RandomForest, SVC, and GradientBoosting models across diabetes, heart disease, Parkinson's, liver, hepatitis, lung cancer, chronic kidney, breast cancer, and general symptom prediction.",
      tags: ["RandomForest", "SVC", "GradientBoosting", "scikit-learn"],
    },
    {
      
      icon: <Brain size={20} />,
      title: "Groq LLM Second Opinion", color: "#a29bfe",
      desc: "After every prediction, llama-3.3-70b generates a structured clinical second opinion — differential diagnosis, specialist referral, recommended tests, and lifestyle advice.",
      tags: ["llama-3.3-70b", "Groq API", "Clinical Reasoning"],
    },
    {
      icon: <Database size={20} />, title: "RAG Symptom Analysis", color: T.amber,
      desc: "The Symptom Checker uses a FAISS vectorstore built from 3 medical CSVs (descriptions, precautions, severity weights) to ground every LLM response in real data.",
      tags: ["FAISS", "LangChain", "sentence-transformers", "RAG"],
    },
    {
      icon: <Server size={20} />, title: "Personalized Diet Plans", color: T.green,
      desc: "Post-prediction, the AI generates condition-specific nutrition guidance — foods to eat, foods to avoid, key nutrients, and daily meal tips tailored to the diagnosed condition.",
      tags: ["Nutrition AI", "Groq", "Personalized"],
    },
    {
      icon: <Zap size={20} />, title: "FastAPI Backend", color: "#fd9644",
      desc: "A production-grade Python backend with 11 REST endpoints, Pydantic input validation, and automatic Swagger docs. All 9 models load at startup and serve predictions in milliseconds.",
      tags: ["FastAPI", "Python", "Uvicorn", "Swagger"],
    },
    {
       icon: <Stethoscope size={20} />, title: "Real-Time Differential Diagnosis", color: "#ff6b6b",
      desc: "Every prediction returns the top condition plus up to 3 differential alternatives with probability scores — giving a complete probabilistic picture rather than a single binary answer.",
      tags: ["Probability Scores", "Alternatives", "Differential Dx"],
    },
  ];

  const howItWorks = [
    { step: "01", title: "Select a Module", desc: "Choose from 9 disease prediction modules via the sidebar or dashboard. Each module is purpose-built for a specific condition.", color: T.teal },
    { step: "02", title: "Enter Clinical Data", desc: "Fill in the patient's clinical measurements — blood markers, biomarkers, symptoms, or lifestyle factors depending on the selected predictor.", color: "#a29bfe" },
    { step: "03", title: "ML Model Predicts", desc: "The trained scikit-learn model instantly processes the data and returns a prediction with confidence score and differential alternatives.", color: T.amber },
    { step: "04", title: "AI Second Opinion", desc: "Our AI assistant generates a structured clinical second opinion and personalised diet recommendations — automatically, no setup needed.", color: T.green },
  ];

  return (
    <div style={{ padding: "40px 40px 60px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        padding: "52px 48px",
        background: T.bg2,
        border: `1px solid ${T.borderHi}`,
        borderRadius: "16px",
        marginBottom: "32px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: `linear-gradient(90deg,transparent,${T.teal},${T.teal}88,transparent)`,
        }} />
        {/* BG hex */}
        <div style={{
          position: "absolute", right: "-60px", top: "-60px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: `radial-gradient(circle, ${T.teal}08 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", left: "-40px", bottom: "-40px",
          width: "240px", height: "240px", borderRadius: "50%",
          background: `radial-gradient(circle, rgba(162,155,254,0.06) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "5px 12px", borderRadius: "4px", marginBottom: "22px",
          background: `${T.teal}14`, border: `1px solid ${T.teal}33`,
          fontFamily: T.fontMono, fontSize: "9px", color: T.teal, letterSpacing: "1.5px",
        }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.teal, boxShadow: `0 0 6px ${T.teal}`, display: "inline-block" }} />
          ML + LLM CLINICAL DECISION SUPPORT SYSTEM
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: T.fontDisp, fontWeight: 700, fontSize: "52px",
          color: T.textPri, lineHeight: 1.05, letterSpacing: "-0.5px",
          marginBottom: "6px",
        }}>
          MEDI<span style={{ color: T.teal }}>PREDICT</span>
        </h1>
        <h2 style={{
          fontFamily: T.fontDisp, fontWeight: 400, fontSize: "22px",
          color: T.textSec, letterSpacing: "3px", marginBottom: "22px",
        }}>
          AI-POWERED DISEASE PREDICTION
        </h2>

        {/* Typewriter subtitle */}
        <div style={{
          fontFamily: T.fontMono, fontSize: "13px", color: T.textSec,
          lineHeight: 1.8, marginBottom: "32px", minHeight: "48px",
        }}>
          <Typewriter lines={[
            "> Initialising 9 ML prediction models…",
            "> Loading FAISS vectorstore [220 chunks]…",
            "> RAG chain ready. Groq LLM connected.",
            "> System online. Ready for clinical input.",
          ]} />
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => setCurrentPage("predictors")}
            style={{
              padding: "13px 28px",
              background: T.teal, border: "none", borderRadius: "6px",
              color: T.bg, fontFamily: T.fontDisp, fontWeight: 700,
              fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.15s",
              boxShadow: `0 0 20px ${T.teal}44`,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 32px ${T.teal}66`; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 20px ${T.teal}44`; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            ▶ Launch Predictors
          </button>
          <button
            onClick={() => setCurrentPage("dashboard")}
            style={{
              padding: "13px 28px",
              background: "transparent",
              border: `1px solid ${T.borderHi}`, borderRadius: "6px",
              color: T.textSec, fontFamily: T.fontDisp, fontWeight: 600,
              fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.teal + "66"; e.currentTarget.style.color = T.teal; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.textSec; }}
          >
            ◉ View Dashboard
          </button>
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))",
        gap: "12px", marginBottom: "32px",
      }}>
        <StatCard value={9}   suffix=""   label="ML Models"        color={T.teal}    delay={100} />
        <StatCard value={42}  suffix="+"  label="Diseases Covered"  color="#a29bfe"   delay={200} />
        <StatCard value={133} suffix=""   label="Symptoms Indexed"  color={T.amber}   delay={300} />
        <StatCard value={220} suffix=""   label="RAG Chunks"        color={T.green}   delay={400} />
        <StatCard value={11}  suffix=""   label="API Endpoints"     color="#fd9644"   delay={500} />
      </div>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted,
          letterSpacing: "2.5px", marginBottom: "20px",
        }}>// SYSTEM CAPABILITIES</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "14px",
        }}>
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 80} />
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <div style={{
        padding: "32px 36px",
        background: T.bg2,
        border: `1px solid ${T.border}`,
        borderRadius: "12px",
        marginBottom: "32px",
      }}>
        <div style={{
          fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted,
          letterSpacing: "2.5px", marginBottom: "24px",
        }}>// HOW IT WORKS</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0",
        }}>
          {howItWorks.map((step, i) => (
            <div key={i} style={{
              padding: "0 24px",
              borderRight: i < howItWorks.length - 1 ? `1px solid ${T.border}` : "none",
            }}>
              <div style={{
                fontFamily: T.fontMono, fontSize: "28px", fontWeight: 500,
                color: `${step.color}44`, marginBottom: "10px", lineHeight: 1,
              }}>{step.step}</div>
              <div style={{
                fontFamily: T.fontDisp, fontWeight: 700, fontSize: "14px",
                color: step.color, letterSpacing: "0.5px", marginBottom: "8px",
              }}>{step.title}</div>
              <div style={{
                fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, lineHeight: 1.65,
              }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DISEASE MODULES GRID ─────────────────────────────────────────── */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted,
          letterSpacing: "2.5px", marginBottom: "20px",
        }}>// PREDICTION MODULES</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {DISEASES.map((d, i) => (
            <DiseasePill
              key={d.id} disease={d} delay={i * 60}
              onClick={() => { handleDiseaseChange(d.id); setCurrentPage("predictors"); }}
            />
          ))}
        </div>
      </div>

      {/* ── TECH STACK ───────────────────────────────────────────────────── */}
      <div style={{
        padding: "28px 32px",
        background: T.bg2,
        border: `1px solid ${T.border}`,
        borderRadius: "12px",
        marginBottom: "32px",
      }}>
        <div style={{
          fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted,
          letterSpacing: "2.5px", marginBottom: "22px",
        }}>// TECH STACK</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
          gap: "20px",
        }}>
          {[
            { layer: "ML LAYER",      items: ["scikit-learn 1.8", "RandomForest", "SVC", "GradientBoosting", "XGBoost", "joblib .sav"], color: T.teal },
            { layer: "AI LAYER",      items: ["Groq API", "llama-3.3-70b-versatile", "LangChain", "FAISS", "sentence-transformers"], color: "#a29bfe" },
            { layer: "BACKEND",       items: ["FastAPI", "Python 3.14", "Uvicorn", "Pydantic", "pandas", "numpy"], color: T.amber },
            { layer: "FRONTEND",      items: ["React 18", "Syne (display)", "JetBrains Mono", "DM Sans", "Inline CSS"], color: T.green },
          ].map(col => (
            <div key={col.layer}>
              <div style={{
                fontFamily: T.fontMono, fontSize: "8px", color: col.color,
                letterSpacing: "1.5px", marginBottom: "10px", borderBottom: `1px solid ${col.color}22`, paddingBottom: "6px",
              }}>{col.layer}</div>
              {col.items.map(item => (
                <div key={item} style={{
                  fontFamily: T.fontMono, fontSize: "11px", color: T.textSec,
                  padding: "4px 0",
                  borderBottom: `1px solid ${T.border}`,
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <span style={{ color: col.color, fontSize: "6px" }}>◆</span>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER CTA ───────────────────────────────────────────────────── */}
      <div style={{
        padding: "36px 40px",
        background: `linear-gradient(135deg, ${T.teal}0A, rgba(162,155,254,0.06))`,
        border: `1px solid ${T.teal}33`,
        borderRadius: "12px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: `linear-gradient(90deg,transparent,${T.teal},transparent)`,
        }} />
        <div style={{
          fontFamily: T.fontMono, fontSize: "9px", color: T.teal,
          letterSpacing: "2px", marginBottom: "14px",
        }}>READY TO DIAGNOSE</div>
        <h3 style={{
          fontFamily: T.fontDisp, fontWeight: 700, fontSize: "28px",
          color: T.textPri, letterSpacing: "1px", marginBottom: "12px",
        }}>START YOUR FIRST PREDICTION</h3>
        <p style={{
          fontFamily: T.fontBody, fontSize: "13px", color: T.textSec,
          maxWidth: "480px", margin: "0 auto 24px", lineHeight: 1.7,
        }}>
          Select a disease module, enter the clinical parameters, and get an instant ML prediction
          backed by AI second opinion and personalized diet recommendations.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => { handleDiseaseChange("symptom"); setCurrentPage("predictors"); }}
            style={{
              padding: "12px 24px",
              background: T.teal, border: "none", borderRadius: "6px",
              color: T.bg, fontFamily: T.fontDisp, fontWeight: 700,
              fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.15s",
              boxShadow: `0 0 16px ${T.teal}44`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 0 28px ${T.teal}66`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0 16px ${T.teal}44`; }}>
            ▶ Symptom Checker
          </button>
          {DISEASES.filter(d => d.id !== "symptom").slice(0, 3).map(d => (
            <button key={d.id}
              onClick={() => { handleDiseaseChange(d.id); setCurrentPage("predictors"); }}
              style={{
                padding: "12px 20px",
                background: "transparent",
                border: `1px solid ${d.color}44`, borderRadius: "6px",
                color: T.textSec, fontFamily: T.fontDisp, fontWeight: 600,
                fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = d.color + "88"; e.currentTarget.style.color = d.color; e.currentTarget.style.background = `${d.color}0A`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = d.color + "44"; e.currentTarget.style.color = T.textSec; e.currentTarget.style.background = "transparent"; }}>
              {d.icon} {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
