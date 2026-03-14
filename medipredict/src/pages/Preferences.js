import { useEffect } from "react";
import { T, Panel, PanelHeader } from "../components/UIComponents";

// ── Language strings ──────────────────────────────────────────────────────────
export const LANG = {
  English: {
    title: "Your Preferences",
    subtitle: "Personalise how MediPredict looks and displays information for you.",
    appearance: "Appearance", theme: "Theme", themeDesc: "Choose the visual theme for the application.",
    language: "Language & Region", langLabel: "Language", langDesc: "Select your preferred display language.",
    units: "Measurement Units", unitsLabel: "Unit System", unitsDesc: "Choose how clinical measurements are displayed.",
    convRef: "CONVERSION REFERENCE", currentSettings: "CURRENT SETTINGS",
    saved: "Preferences saved",
  },
  Hindi: {
    title: "आपकी प्राथमिकताएं",
    subtitle: "MediPredict को अपनी पसंद के अनुसार अनुकूलित करें।",
    appearance: "दिखावट", theme: "थीम", themeDesc: "एप्लिकेशन के लिए विज़ुअल थीम चुनें।",
    language: "भाषा और क्षेत्र", langLabel: "भाषा", langDesc: "अपनी पसंदीदा भाषा चुनें।",
    units: "माप इकाइयां", unitsLabel: "इकाई प्रणाली", unitsDesc: "नैदानिक माप कैसे दिखाए जाएं, चुनें।",
    convRef: "रूपांतरण संदर्भ", currentSettings: "वर्तमान सेटिंग्स",
    saved: "प्राथमिकताएं सहेजी गईं",
  },
  Spanish: {
    title: "Tus Preferencias",
    subtitle: "Personaliza cómo MediPredict se ve y muestra información.",
    appearance: "Apariencia", theme: "Tema", themeDesc: "Elige el tema visual de la aplicación.",
    language: "Idioma y Región", langLabel: "Idioma", langDesc: "Selecciona tu idioma de visualización preferido.",
    units: "Unidades de Medida", unitsLabel: "Sistema de Unidades", unitsDesc: "Elige cómo se muestran las medidas clínicas.",
    convRef: "REFERENCIA DE CONVERSIÓN", currentSettings: "CONFIGURACIÓN ACTUAL",
    saved: "Preferencias guardadas",
  },
  French: {
    title: "Vos Préférences",
    subtitle: "Personnalisez l'apparence et les informations de MediPredict.",
    appearance: "Apparence", theme: "Thème", themeDesc: "Choisissez le thème visuel de l'application.",
    language: "Langue et Région", langLabel: "Langue", langDesc: "Sélectionnez votre langue d'affichage préférée.",
    units: "Unités de Mesure", unitsLabel: "Système d'unités", unitsDesc: "Choisissez comment les mesures cliniques sont affichées.",
    convRef: "RÉFÉRENCE DE CONVERSION", currentSettings: "PARAMÈTRES ACTUELS",
    saved: "Préférences enregistrées",
  },
};

// ── Theme definitions ─────────────────────────────────────────────────────────
export const THEMES = {
  Dark: {
    bg:      "#050C0F",
    bg1:     "#081218",
    bg2:     "#0C1A22",
    bg3:     "#102030",
    teal:    "#00C8A0",
    textPri: "#D0EEE8",
    textSec: "rgba(180,220,210,0.6)",
    body:    "#050C0F",
  },
  Darker: {
    bg:      "#020609",
    bg1:     "#040d11",
    bg2:     "#071318",
    bg3:     "#0a1a22",
    teal:    "#00E5B8",
    textPri: "#E8F8F4",
    textSec: "rgba(200,240,230,0.65)",
    body:    "#020609",
  },
  Light: {
    bg:      "#F0F4F6",
    bg1:     "#E4EDF1",
    bg2:     "#FFFFFF",
    bg3:     "#EAF2F5",
    teal:    "#007A62",
    textPri: "#0D2028",
    textSec: "rgba(20,50,65,0.65)",
    body:    "#F0F4F6",
  },
};

// ── Unit label maps ───────────────────────────────────────────────────────────
export const UNIT_LABELS = {
  Metric: {
    weight: "Weight (kg)", height: "Height (cm)", glucose: "Glucose (mmol/L)",
    bmi: "BMI (kg/m²)", bp: "Blood Pressure (mmHg)", cholesterol: "Cholesterol (mmol/L)",
    insulin: "Insulin (µU/mL)", creatinine: "Creatinine (µmol/L)",
  },
  Imperial: {
    weight: "Weight (lbs)", height: "Height (in)", glucose: "Glucose (mg/dL)",
    bmi: "BMI (kg/m²)", bp: "Blood Pressure (mmHg)", cholesterol: "Cholesterol (mg/dL)",
    insulin: "Insulin (µU/mL)", creatinine: "Creatinine (mg/dL)",
  },
};

// ── Option group component ────────────────────────────────────────────────────
function OptionGroup({ label, desc, options, value, onChange, color = T.teal }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "14px", color: T.textPri, marginBottom: "3px" }}>{label}</div>
      <div style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, marginBottom: "12px" }}>{desc}</div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {options.map(opt => {
          const active = value === opt.value;
          const disabled = opt.disabled;
          return (
            <button key={opt.value}
              onClick={() => !disabled && onChange(opt.value)}
              style={{
                padding: "10px 18px",
                background: active ? `${color}18` : T.bg3,
                border: `1px solid ${active ? color + "66" : T.border}`,
                borderRadius: "8px",
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.15s", position: "relative",
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px",
                minWidth: "110px", opacity: disabled ? 0.45 : 1,
              }}
              onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.borderColor = T.borderHi; }}
              onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.borderColor = T.border; }}>
              {active && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg,transparent,${color},transparent)` }} />}
              <span style={{ fontSize: "16px" }}>{opt.icon}</span>
              <span style={{ fontFamily: T.fontDisp, fontWeight: 600, fontSize: "12px", color: active ? color : T.textPri, letterSpacing: "0.5px" }}>{opt.label}</span>
              {opt.sub && <span style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted }}>{opt.sub}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Preferences page ─────────────────────────────────────────────────────
export default function Preferences({ prefs, setPrefs }) {
  const L = LANG[prefs.language] || LANG.English;

  // Persist to localStorage whenever prefs change
  useEffect(() => {
    localStorage.setItem("medipredict_prefs", JSON.stringify(prefs));
  }, [prefs]);

  // Apply theme to document body background
  useEffect(() => {
    const theme = THEMES[prefs.theme] || THEMES.Dark;
    document.body.style.background = theme.body;
  }, [prefs.theme]);

  const set = key => val => setPrefs(p => ({ ...p, [key]: val }));

  const conversionTable = [
    [L.convRef,   "Metric",           "Imperial"],
    ["Weight",    "kg",               "lbs (× 2.205)"],
    ["Height",    "cm",               "inches (× 0.394)"],
    ["Glucose",   "mmol/L",           "mg/dL (× 18.02)"],
    ["Cholesterol","mmol/L",          "mg/dL (× 38.67)"],
    ["BMI",       "kg/m²",            "kg/m² (same)"],
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "2.5px", marginBottom: "8px" }}>// PREFERENCES</div>
        <h1 style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "32px", color: T.textPri, letterSpacing: "1px", marginBottom: "8px" }}>{L.title}</h1>
        <p style={{ fontFamily: T.fontBody, fontSize: "13px", color: T.textSec, lineHeight: 1.6 }}>{L.subtitle}</p>
      </div>

      {/* Theme */}
      <Panel style={{ marginBottom: "16px" }}>
        <PanelHeader icon="◎" title={L.appearance} />
        <div style={{ padding: "24px" }}>
          <OptionGroup
            label={L.theme} desc={L.themeDesc}
            value={prefs.theme} onChange={set("theme")} color={T.teal}
            options={[
              { value: "Dark",   icon: "🌑", label: "Dark",   sub: "Default" },
              { value: "Darker", icon: "⬛", label: "Darker",  sub: "High contrast" },
              { value: "Light",  icon: "🌕", label: "Light",   sub: "Coming soon", disabled: true },
            ]}
          />
          {/* Live preview swatch */}
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            {Object.entries(THEMES[prefs.theme] || THEMES.Dark)
              .filter(([k]) => ["bg", "bg1", "bg2", "bg3"].includes(k))
              .map(([k, v]) => (
                <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: v, border: `1px solid ${T.border}` }} />
                  <span style={{ fontFamily: T.fontMono, fontSize: "8px", color: T.textMuted }}>{k}</span>
                </div>
              ))}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: (THEMES[prefs.theme] || THEMES.Dark).teal, border: `1px solid ${T.border}` }} />
              <span style={{ fontFamily: T.fontMono, fontSize: "8px", color: T.textMuted }}>accent</span>
            </div>
          </div>
        </div>
      </Panel>

      {/* Language */}
      <Panel style={{ marginBottom: "16px" }}>
        <PanelHeader icon="◈" title={L.language} />
        <div style={{ padding: "24px" }}>
          <OptionGroup
            label={L.langLabel} desc={L.langDesc}
            value={prefs.language} onChange={set("language")} color="#a29bfe"
            options={[
              { value: "English", icon: "🇬🇧", label: "English", sub: "Default" },
              { value: "Hindi",   icon: "🇮🇳", label: "Hindi",   sub: "हिंदी" },
              { value: "Spanish", icon: "🇪🇸", label: "Spanish", sub: "Español" },
              { value: "French",  icon: "🇫🇷", label: "French",  sub: "Français" },
            ]}
          />
          {/* Live language preview */}
          <div style={{
            padding: "12px 16px", background: T.bg3, borderRadius: "8px",
            border: `1px solid ${"#a29bfe"}33`, marginTop: "4px",
          }}>
            <div style={{ fontFamily: T.fontMono, fontSize: "8px", color: T.textMuted, letterSpacing: "1.2px", marginBottom: "6px" }}>PREVIEW</div>
            <div style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "16px", color: T.textPri }}>{L.title}</div>
            <div style={{ fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, marginTop: "3px" }}>{L.subtitle}</div>
          </div>
        </div>
      </Panel>

      {/* Units */}
      <Panel style={{ marginBottom: "16px" }}>
        <PanelHeader icon="✦" title={L.units} />
        <div style={{ padding: "24px" }}>
          <OptionGroup
            label={L.unitsLabel} desc={L.unitsDesc}
            value={prefs.units} onChange={set("units")} color={T.amber}
            options={[
              { value: "Metric",   icon: "🔬", label: "Metric",   sub: "kg, cm, mmol/L" },
              { value: "Imperial", icon: "📏", label: "Imperial", sub: "lbs, in, mg/dL" },
            ]}
          />
          {/* Conversion table */}
          <div style={{ marginTop: "4px" }}>
            <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "1.5px", marginBottom: "10px" }}>{L.convRef}</div>
            <div style={{ borderRadius: "8px", overflow: "hidden", border: `1px solid ${T.border}` }}>
              {conversionTable.map((row, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                  background: i === 0 ? T.bg3 : i % 2 === 0 ? T.bg2 : `${T.bg2}cc`,
                  borderBottom: i < conversionTable.length - 1 ? `1px solid ${T.border}` : "none",
                }}>
                  {row.map((cell, j) => (
                    <div key={j} style={{
                      padding: "9px 14px",
                      fontFamily: i === 0 ? T.fontMono : T.fontBody,
                      fontSize: i === 0 ? "8px" : "12px",
                      fontWeight: j === 0 && i > 0 ? 600 : 400,
                      color: i === 0 ? T.textMuted
                        : j === 1 && prefs.units === "Metric" ? T.teal
                        : j === 2 && prefs.units === "Imperial" ? T.amber
                        : j === 0 ? T.textPri : T.textSec,
                      letterSpacing: i === 0 ? "1px" : "0",
                    }}>{cell}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* Live summary */}
      <div style={{
        padding: "16px 20px",
        background: `${T.teal}08`, border: `1px solid ${T.teal}22`,
        borderRadius: "10px",
        display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center",
      }}>
        <span style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.teal, letterSpacing: "1.5px", flexShrink: 0 }}>
          {L.currentSettings}
        </span>
        {Object.entries(prefs).map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, textTransform: "uppercase" }}>{k}:</span>
            <span style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "13px", color: T.textPri }}>{v}</span>
          </div>
        ))}
        <span style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.green, marginLeft: "auto" }}>
          ✓ Auto-saved
        </span>
      </div>
    </div>
  );
}
