import { useState } from "react";
import { T, Panel, PanelHeader } from "../components/UIComponents";

function TeamCard({ name, role, bio, tags, color, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "24px",
        background: hov ? `${color}08` : T.bg2,
        border: `1px solid ${hov ? color + "44" : T.border}`,
        borderRadius: "12px",
        transition: "all 0.2s",
        position: "relative", overflow: "hidden",
      }}>
      {hov && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg,transparent,${color},transparent)` }} />}
      <div style={{
        width: "48px", height: "48px", borderRadius: "10px",
        background: `${color}18`, border: `1px solid ${color}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: T.fontDisp, fontWeight: 700, fontSize: "18px",
        color, marginBottom: "14px",
      }}>{name[0]}</div>
      <div style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "16px", color: T.textPri, marginBottom: "3px" }}>{name}</div>
      <div style={{ fontFamily: T.fontMono, fontSize: "9px", color, letterSpacing: "1.2px", marginBottom: "10px" }}>{role}</div>
      <p style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, lineHeight: 1.65, marginBottom: "14px" }}>{bio}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {tags.map(t => (
          <span key={t} style={{
            fontFamily: T.fontMono, fontSize: "9px", color,
            padding: "2px 7px", borderRadius: "3px",
            background: `${color}14`, border: `1px solid ${color}28`,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ year, title, desc, color, last }) {
  return (
    <div style={{ display: "flex", gap: "20px", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: "12px", height: "12px", borderRadius: "50%",
          background: color, boxShadow: `0 0 8px ${color}`,
          border: `2px solid ${T.bg2}`,
        }} />
        {!last && <div style={{ width: "1px", flex: 1, background: T.border, marginTop: "4px" }} />}
      </div>
      <div style={{ paddingBottom: last ? "0" : "24px" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", color, letterSpacing: "1px", marginBottom: "4px" }}>{year}</div>
        <div style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "14px", color: T.textPri, marginBottom: "5px" }}>{title}</div>
        <p style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
  );
}

export default function About({ setCurrentPage }) {
  const team = [
    {
      name: "ML Engineering", role: "MACHINE LEARNING", color: T.teal,
      bio: "Responsible for training, evaluating, and deploying all 9 scikit-learn models. Handles feature engineering, hyperparameter tuning, and model persistence.",
      tags: ["scikit-learn", "RandomForest", "SVC", "GradientBoosting", "joblib"],
    },
    {
      name: "AI Integration", role: "LLM + RAG LAYER", color: "#a29bfe",
      bio: "Architected the Groq LLM integration and FAISS-based RAG chain. Built the LangChain pipeline using sentence-transformers for semantic retrieval from medical CSVs.",
      tags: ["Groq", "LangChain", "FAISS", "RAG", "llama-3.3-70b"],
    },
    {
      name: "Backend Systems", role: "FASTAPI ENGINEER", color: T.amber,
      bio: "Designed and implemented the FastAPI REST backend with 11 endpoints, Pydantic validation, model lifecycle management, and automatic OpenAPI documentation.",
      tags: ["FastAPI", "Python", "Pydantic", "Uvicorn", "REST API"],
    },
    {
      name: "Frontend Dev", role: "REACT ENGINEER", color: T.green,
      bio: "Built the multi-page React dashboard with biopunk terminal aesthetic. Implemented the component library, form system, tabbed result panels, and page routing.",
      tags: ["React 18", "Inline CSS", "Rajdhani", "JetBrains Mono", "DM Sans"],
    },
  ];

  const timeline = [
    { year: "PHASE 01", title: "Data Collection & Model Training", color: T.teal, desc: "Curated 9 medical datasets. Trained and evaluated RandomForest, SVC, and GradientBoosting models. Achieved accuracy ranging from 72% (diabetes) to 100% (chronic kidney)." },
    { year: "PHASE 02", title: "FastAPI Backend Development", color: "#a29bfe", desc: "Built a production-grade Python REST API with 11 endpoints. Implemented Pydantic input validation, model loading at startup, and automatic Swagger documentation." },
    { year: "PHASE 03", title: "Groq LLM Integration", color: T.amber, desc: "Integrated llama-3.3-70b via Groq API for structured clinical second opinions and personalized diet recommendations. Added fair-use token caps for all endpoints." },
    { year: "PHASE 04", title: "RAG Chain Implementation", color: T.green, desc: "Built a FAISS vectorstore from 3 medical CSVs (220 chunks) using all-MiniLM-L6-v2 embeddings. LangChain retrieves top-8 semantically relevant chunks per query." },
    { year: "PHASE 05", title: "React Frontend & UI System", color: "#fd79a8", desc: "Designed and built the multi-page biopunk terminal interface with a full component library, animated counters, typewriter effects, and tabbed result panels." },
  ];

  const values = [
    { icon: "◈", title: "Accuracy First", desc: "Every model is evaluated on held-out test data. Confidence scores are shown transparently — no black-box predictions.", color: T.teal },
    { icon: "◎", title: "AI-Augmented, Not AI-Replaced", desc: "ML models predict. LLMs reason. Together they provide a richer picture than either alone — but a physician always has final say.", color: "#a29bfe" },
    { icon: "✦", title: "Grounded in Real Data", desc: "The RAG chain grounds every LLM response in actual medical CSVs, reducing hallucination risk on clinical content.", color: T.amber },
    { icon: "⚡", title: "Open & Transparent", desc: "Full source code, model weights, and API documentation are accessible. Every prediction shows its confidence and differential alternatives.", color: T.green },
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>

      {/* Hero */}
      <div style={{
        padding: "48px", marginBottom: "28px",
        background: T.bg2, border: `1px solid ${T.borderHi}`,
        borderRadius: "16px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg,transparent,${T.teal},transparent)` }} />
        <div style={{ position: "absolute", right: "-80px", top: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: `radial-gradient(circle,${T.teal}06 0%,transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.teal, letterSpacing: "2px", marginBottom: "16px" }}>// ABOUT MEDIPREDICT</div>
        <h1 style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "40px", color: T.textPri, letterSpacing: "1px", marginBottom: "16px", lineHeight: 1.1 }}>
          Clinical AI for<br /><span style={{ color: T.teal }}>the Modern Era</span>
        </h1>
        <p style={{ fontFamily: T.fontBody, fontSize: "14px", color: T.textSec, lineHeight: 1.75, maxWidth: "600px", marginBottom: "28px" }}>
          MediPredict combines trained machine learning models with large language model reasoning to deliver multi-layered disease prediction. It is a research and educational platform demonstrating how ML and LLM technologies can work together in a clinical decision support context.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => setCurrentPage("predictors")}
            style={{
              padding: "11px 22px", background: T.teal, border: "none", borderRadius: "6px",
              color: T.bg, fontFamily: T.fontDisp, fontWeight: 700, fontSize: "12px",
              letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer",
              boxShadow: `0 0 16px ${T.teal}44`, transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
            ▶ Try Predictors
          </button>
          <button onClick={() => setCurrentPage("howitworks")}
            style={{
              padding: "11px 22px", background: "transparent",
              border: `1px solid ${T.borderHi}`, borderRadius: "6px",
              color: T.textSec, fontFamily: T.fontDisp, fontWeight: 600, fontSize: "12px",
              letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.teal + "66"; e.currentTarget.style.color = T.teal; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.textSec; }}>
            ◉ How It Works
          </button>
        </div>
      </div>

      {/* Values */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "2.5px", marginBottom: "16px" }}>// CORE VALUES</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "12px" }}>
          {values.map((v, i) => (
            <div key={i} style={{ padding: "20px", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: "10px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg,transparent,${v.color}55,transparent)` }} />
              <div style={{ fontFamily: T.fontMono, fontSize: "18px", color: v.color, marginBottom: "10px" }}>{v.icon}</div>
              <div style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "14px", color: T.textPri, marginBottom: "7px" }}>{v.title}</div>
              <p style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, lineHeight: 1.65 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "2.5px", marginBottom: "16px" }}>// BUILT BY</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "12px" }}>
          {team.map((m, i) => <TeamCard key={i} {...m} delay={i * 80} />)}
        </div>
      </div>

      {/* Timeline */}
      <Panel style={{ marginBottom: "28px" }}>
        <PanelHeader icon="◎" title="Development Timeline" badge="5 PHASES" />
        <div style={{ padding: "24px 28px" }}>
          {timeline.map((item, i) => (
            <TimelineItem key={i} {...item} last={i === timeline.length - 1} />
          ))}
        </div>
      </Panel>

      {/* Disclaimer */}
      <div style={{
        padding: "20px 24px",
        background: "rgba(240,165,0,0.06)",
        border: "1px solid rgba(240,165,0,0.2)",
        borderRadius: "10px",
      }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.amber, letterSpacing: "1.5px", marginBottom: "8px" }}>⚠ IMPORTANT DISCLAIMER</div>
        <p style={{ fontFamily: T.fontBody, fontSize: "12px", color: "rgba(240,165,0,0.7)", lineHeight: 1.7 }}>
          MediPredict is a research and educational platform. All predictions are generated by machine learning models and should not be used as a substitute for professional medical diagnosis, advice, or treatment. Always consult a qualified and licensed healthcare professional for any medical concerns.
        </p>
      </div>
    </div>
  );
}
