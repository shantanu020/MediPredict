import { useState, useEffect } from "react";
import { GlobalStyles, Background, Particles, StatusDot, T } from "./components/UIComponents";
import { useApi } from "./utils";
import { DISEASES, API_BASE } from "./constants";
import Dashboard from "./pages/Dashboard";
import Predictors from "./pages/Predictors";
import Preferences from "./pages/Preferences";
import Home from "./pages/Home";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";

export default function App() {
  const [currentPage, setCurrentPage]     = useState("home");
  const [activeDisease, setActiveDisease] = useState("symptom");
  const [result, setResult]               = useState(null);
  const [groqLoading, setGroqLoading]     = useState(false);
  const [groqResult, setGroqResult]       = useState(null);
  const [groqError, setGroqError]         = useState("");
  const [dietResult, setDietResult]       = useState(null);
  const [dietLoading, setDietLoading]     = useState(false);
  const [dietError, setDietError]         = useState("");
  const [apiStatus, setApiStatus]         = useState("checking");

  // User preferences — load from localStorage if available
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem("medipredict_prefs");
      return saved ? JSON.parse(saved) : { language: "English", units: "Metric", theme: "Dark" };
    } catch {
      return { language: "English", units: "Metric", theme: "Dark" };
    }
  });

  const { call, loading, error: apiError } = useApi();
  const selectedDisease = DISEASES.find(d => d.id === activeDisease);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"));
  }, []);

  // Apply theme as CSS variables on :root — affects entire app instantly
  useEffect(() => {
    const themes = {
      Dark:   { bg: "#050C0F", bg1: "#081218", bg2: "#0C1A22", bg3: "#102030", teal: "#00C8A0", textPri: "#D0EEE8", textSec: "rgba(180,220,210,0.6)", textMuted: "rgba(140,190,180,0.35)" },
      Darker: { bg: "#020609", bg1: "#040d11", bg2: "#071318", bg3: "#0a1a22", teal: "#00E5B8", textPri: "#E8F8F4", textSec: "rgba(200,240,230,0.65)", textMuted: "rgba(150,200,185,0.4)" },
      Light:  { bg: "#F0F4F6", bg1: "#E4EDF1", bg2: "#FFFFFF", bg3: "#EAF2F5", teal: "#007A62", textPri: "#0D2028", textSec: "rgba(20,50,65,0.65)", textMuted: "rgba(20,50,65,0.4)" },
    };
    const t = themes[prefs.theme] || themes.Dark;
    const root = document.documentElement;
    root.style.setProperty("--mp-bg",        t.bg);
    root.style.setProperty("--mp-bg1",       t.bg1);
    root.style.setProperty("--mp-bg2",       t.bg2);
    root.style.setProperty("--mp-bg3",       t.bg3);
    root.style.setProperty("--mp-teal",      t.teal);
    root.style.setProperty("--mp-textPri",   t.textPri);
    root.style.setProperty("--mp-textSec",   t.textSec);
    root.style.setProperty("--mp-textMuted", t.textMuted);
    document.body.style.background = t.bg;
    document.body.style.color = t.textPri;
  }, [prefs.theme]);

  const handleDiseaseChange = id => {
    setActiveDisease(id);
    setResult(null); setGroqResult(null); setGroqError("");
    setDietResult(null); setDietError("");
  };

  const handleSubmit = async body => {
    setGroqError("");
    const res = await call(selectedDisease.endpoint, body);
    if (!res) return;
    setResult(res);
    setGroqResult(null);

    // Fire AI opinion and diet in parallel — both independent
    setGroqLoading(true);
    setDietLoading(true);

    let groq;
    if (activeDisease === "symptom") {
      groq = await call("/symptoms/rag_analysis", {
        symptoms: body.symptoms || [],
        predicted_disease: res.disease || "",
        probability: res.probability || 0.5,
        alternatives: res.alternatives || [],
      });
      if (groq) setGroqResult({ type: "rag", analysis: groq.analysis || groq.opinion || groq.response, tokens_used: groq.tokens_used });
    } else {
      groq = await call("/groq/opinion", {
        disease: selectedDisease.label,
        positive: res.positive ?? false,
        confidence: res.confidence ?? res.probability ?? 0.5,
        summary: res.summary || res.disease || `${selectedDisease.label} assessment`,
      });
      if (groq) setGroqResult({ type: "opinion", analysis: groq.opinion, tokens_used: groq.tokens_used });
    }
    setGroqLoading(false);
    if (!groq) setGroqError("AI analysis unavailable. The server may not have a Groq key configured.");

    // Diet always fires — even if prediction is negative or groq opinion failed
    // For negative results, give general healthy diet for that condition's prevention
    const conditionLabel = res.positive
      ? (res.summary || res.disease || `${selectedDisease.label} patient`)
      : `Prevention and general health for ${selectedDisease.label}`;

    const diet = await call("/groq/diet", {
      disease: selectedDisease.label,
      age: body.age || "Unknown",
      condition: conditionLabel,
    });
    setDietLoading(false);
    if (diet) setDietResult(diet.diet_plan || diet.recommendation || diet.diet);
    else setDietError("Diet recommendations unavailable.");
  };

  const NAV_LABELS = {
    English: { home:"Home", dashboard:"Dashboard", predictors:"Predictors", howitworks:"How It Works", about:"About", preferences:"Preferences" },
    Hindi:   { home:"होम", dashboard:"डैशबोर्ड", predictors:"प्रेडिक्टर्स", howitworks:"यह कैसे काम करता है", about:"के बारे में", preferences:"प्राथमिकताएं" },
    Spanish: { home:"Inicio", dashboard:"Panel", predictors:"Predictores", howitworks:"Cómo Funciona", about:"Acerca de", preferences:"Preferencias" },
    French:  { home:"Accueil", dashboard:"Tableau de bord", predictors:"Prédicteurs", howitworks:"Comment ça marche", about:"À propos", preferences:"Préférences" },
  };
  const L = NAV_LABELS[prefs.language] || NAV_LABELS.English;

  const NAV_LINKS = [
    { id: "home",        label: L.home },
    { id: "dashboard",   label: L.dashboard },
    { id: "predictors",  label: L.predictors },
    { id: "howitworks",  label: L.howitworks },
    { id: "about",       label: L.about },
  ];

  return (
    <>
      <GlobalStyles />
      <Background />
      <Particles />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

        {/* TOP NAVBAR */}
        <header style={{
          height: "56px", flexShrink: 0,
          display: "flex", alignItems: "center",
          padding: "0 28px",
          background: "rgba(8,18,24,0.95)",
          borderBottom: `1px solid ${T.border}`,
          backdropFilter: "blur(12px)",
          position: "relative", zIndex: 50,
        }}>

          {/* Logo */}
          <div onClick={() => setCurrentPage("home")}
            style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer", flexShrink: 0, marginRight: "32px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "6px",
              background: `linear-gradient(135deg,${T.teal},${T.teal}88)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", boxShadow: `0 0 10px ${T.teal}44`,
            }}>⚕</div>
            <div>
              <div style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "15px", color: T.textPri, letterSpacing: "2px", lineHeight: 1 }}>
                MEDI<span style={{ color: T.teal }}>PREDICT</span>
              </div>
              <div style={{ fontFamily: T.fontMono, fontSize: "7px", color: T.textMuted, letterSpacing: "1.5px", marginTop: "1px" }}>
                AI-POWERED DIAGNOSIS
              </div>
            </div>
          </div>

          {/* Center nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1 }}>
            {NAV_LINKS.map(link => {
              const active = currentPage === link.id;
              return (
                <button key={link.id} onClick={() => setCurrentPage(link.id)}
                  style={{
                    padding: "7px 14px",
                    background: active ? `${T.teal}14` : "transparent",
                    border: `1px solid ${active ? T.teal + "44" : "transparent"}`,
                    borderRadius: "6px",
                    fontFamily: T.fontDisp, fontWeight: 600, fontSize: "12px",
                    letterSpacing: "1px", textTransform: "uppercase",
                    color: active ? T.teal : T.textSec,
                    cursor: "pointer", transition: "all 0.15s",
                    position: "relative", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = T.textPri; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = T.textSec; e.currentTarget.style.background = "transparent"; }}}>
                  {link.label}
                  {active && (
                    <span style={{
                      position: "absolute", bottom: "-1px", left: "50%", transform: "translateX(-50%)",
                      width: "24px", height: "1px",
                      background: `linear-gradient(90deg,transparent,${T.teal},transparent)`,
                    }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "5px 10px", borderRadius: "5px",
              background: T.bg3, border: `1px solid ${T.border}`,
            }}>
              <StatusDot status={apiStatus} />
              <span style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "0.8px" }}>
                {apiStatus === "online" ? "ONLINE" : apiStatus === "offline" ? "OFFLINE" : "CONNECTING…"}
              </span>
            </div>

            {/* Preferences */}
            <button onClick={() => setCurrentPage(p => p === "preferences" ? "home" : "preferences")}
              style={{
                padding: "5px 12px", borderRadius: "5px",
                background: currentPage === "preferences" ? `${T.teal}14` : "transparent",
                border: `1px solid ${currentPage === "preferences" ? T.teal + "44" : T.border}`,
                fontFamily: T.fontDisp, fontWeight: 600, fontSize: "11px",
                letterSpacing: "1px", textTransform: "uppercase",
                color: currentPage === "preferences" ? T.teal : T.textMuted,
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = T.textPri; e.currentTarget.style.borderColor = T.borderHi; }}
              onMouseLeave={e => {
                e.currentTarget.style.color = currentPage === "preferences" ? T.teal : T.textMuted;
                e.currentTarget.style.borderColor = currentPage === "preferences" ? T.teal + "44" : T.border;
              }}>
              ◧ {L.preferences}
            </button>
          </div>
        </header>

        {/* DISEASE SUB-NAV — predictors only */}
        {currentPage === "predictors" && (
          <div style={{
            height: "46px", flexShrink: 0,
            display: "flex", alignItems: "center",
            padding: "0 28px", gap: "4px",
            background: T.bg1,
            borderBottom: `1px solid ${T.border}`,
            overflowX: "auto",
          }}>
            <span style={{ fontFamily: T.fontMono, fontSize: "8px", color: T.textMuted, letterSpacing: "1.5px", marginRight: "10px", flexShrink: 0 }}>
              MODULE ›
            </span>
            {DISEASES.map(d => {
              const active = activeDisease === d.id;
              return (
                <button key={d.id} onClick={() => handleDiseaseChange(d.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "5px 12px", borderRadius: "5px", flexShrink: 0,
                    background: active ? `${d.color}18` : "transparent",
                    border: `1px solid ${active ? d.color + "55" : "transparent"}`,
                    fontFamily: T.fontDisp, fontWeight: active ? 600 : 400,
                    fontSize: "11px", letterSpacing: "0.8px",
                    color: active ? d.color : T.textMuted,
                    cursor: "pointer", transition: "all 0.15s",
                    position: "relative",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = T.textSec; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = T.textMuted; e.currentTarget.style.background = "transparent"; }}}>
                  <span style={{ fontSize: "13px" }}>{d.icon}</span>
                  {d.label}
                  {active && (
                    <span style={{
                      position: "absolute", bottom: "-1px", left: "50%", transform: "translateX(-50%)",
                      width: "80%", height: "1px",
                      background: `linear-gradient(90deg,transparent,${d.color},transparent)`,
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minHeight: 0 }}>
          {currentPage === "home"        && <Home setCurrentPage={setCurrentPage} handleDiseaseChange={handleDiseaseChange} prefs={prefs} />}
          {currentPage === "dashboard"   && <Dashboard apiStatus={apiStatus} setCurrentPage={setCurrentPage} handleDiseaseChange={handleDiseaseChange} prefs={prefs} />}
          {currentPage === "predictors"  && (
            <Predictors
              selectedDisease={selectedDisease} activeDisease={activeDisease}
              loading={loading} apiError={apiError} apiStatus={apiStatus}
              result={result}
              groqLoading={groqLoading} groqResult={groqResult} groqError={groqError}
              dietLoading={dietLoading} dietResult={dietResult} dietError={dietError}
              handleSubmit={handleSubmit} handleDiseaseChange={handleDiseaseChange}
              prefs={prefs}
            />
          )}
          {currentPage === "howitworks"  && <HowItWorks setCurrentPage={setCurrentPage} prefs={prefs} />}
          {currentPage === "about"       && <About setCurrentPage={setCurrentPage} prefs={prefs} />}
          {currentPage === "preferences" && <Preferences prefs={prefs} setPrefs={setPrefs} />}
        </main>
      </div>
    </>
  );
}
