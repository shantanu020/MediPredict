import { useState } from "react";
import { T } from "../components/UIComponents";
import { DISEASES } from "../constants";

function StepCard({ n, icon, title, desc, color, detail }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: T.bg2,
      border: `1px solid ${open ? color + "44" : T.border}`,
      borderRadius: "12px", overflow: "hidden",
      transition: "all 0.2s",
    }}>
      {/* Top accent */}
      <div style={{ height: "2px", background: `linear-gradient(90deg,${color},${color}44,transparent)` }} />
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "10px", flexShrink: 0,
            background: `${color}15`, border: `1px solid ${color}30`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px",
          }}>{icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ fontFamily: T.fontMono, fontSize: "9px", color, letterSpacing: "1.5px" }}>STEP {n}</span>
            </div>
            <div style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "17px", color: T.textPri, marginBottom: "8px", letterSpacing: "0.3px" }}>{title}</div>
            <p style={{ fontFamily: T.fontBody, fontSize: "13px", color: T.textSec, lineHeight: 1.7 }}>{desc}</p>
          </div>
        </div>
        {detail && (
          <button onClick={() => setOpen(o => !o)}
            style={{
              marginTop: "14px", padding: "7px 14px",
              background: "transparent", border: `1px solid ${T.border}`,
              borderRadius: "6px", cursor: "pointer",
              fontFamily: T.fontBody, fontSize: "12px", color: T.textSec,
              transition: "all 0.15s", display: "flex", alignItems: "center", gap: "6px",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color + "55"; e.currentTarget.style.color = color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSec; }}>
            {open ? "▲ Show less" : "▼ Learn more"}
          </button>
        )}
        {open && detail && (
          <div style={{
            marginTop: "14px", padding: "14px 16px",
            background: T.bg3, borderRadius: "8px",
            borderLeft: `2px solid ${color}55`,
          }}>
            {detail.map((line, i) => (
              <div key={i} style={{
                display: "flex", gap: "10px", alignItems: "flex-start",
                marginBottom: i < detail.length - 1 ? "8px" : 0,
                fontFamily: T.fontBody, fontSize: "12px", color: T.textSec, lineHeight: 1.65,
              }}>
                <span style={{ color, flexShrink: 0, fontSize: "8px", marginTop: "5px" }}>◆</span>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "16px 0",
          background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px",
          textAlign: "left",
        }}>
        <span style={{ fontFamily: T.fontDisp, fontWeight: 600, fontSize: "14px", color: T.textPri, letterSpacing: "0.3px" }}>{q}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.teal, flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <p style={{ fontFamily: T.fontBody, fontSize: "13px", color: T.textSec, lineHeight: 1.7, paddingBottom: "16px" }}>{a}</p>
      )}
    </div>
  );
}

export default function HowItWorks({ setCurrentPage }) {
  const steps = [
    {
      n: "01", icon: "🔍", color: T.teal,
      title: "Choose What to Check",
      desc: "Pick a condition from our 9 available health checks — whether you have specific symptoms, or want to assess risk for conditions like diabetes, heart disease, or cancer.",
      detail: [
        "Symptom Checker: describe your symptoms in plain language and get a predicted condition.",
        "Disease Risk: enter test results like blood glucose, cholesterol, or blood pressure to assess risk.",
        "No medical knowledge needed — we guide you through each step.",
      ],
    },
    {
      n: "02", icon: "📋", color: "#a29bfe",
      title: "Enter Your Information",
      desc: "Fill in a simple form with your health data. Each field has a label so you know exactly what to enter. You can use values from recent blood tests or check-ups.",
      detail: [
        "All values stay private — nothing is stored or sent anywhere outside your local server.",
        "Default values are pre-filled so you can try the tool without real data first.",
        "For the Symptom Checker, just search and select symptoms from a list.",
      ],
    },
    {
      n: "03", icon: "🤖", color: T.amber,
      title: "Our AI Analyses Your Data",
      desc: "A trained machine learning model instantly processes your data and gives a prediction with a confidence percentage. The higher the percentage, the more certain the model is.",
      detail: [
        "Models are trained on real anonymised medical datasets with thousands of patient records.",
        "You also see alternative diagnoses ranked by likelihood — not just a single answer.",
        "Confidence scores show you how certain the model is, so you can make informed decisions.",
      ],
    },
    {
      n: "04", icon: "💬", color: T.green,
      title: "Get an AI Second Opinion",
      desc: "After the prediction, our AI assistant gives you a friendly second opinion — explaining the result, suggesting what kind of doctor to see, and recommending tests.",
      detail: [
        "Powered by one of the most advanced language models available (llama-3.3-70b).",
        "Responses are grounded in real medical reference data, not guesswork.",
        "Written in plain, easy-to-understand language — no medical jargon.",
      ],
    },
    {
      n: "05", icon: "🥗", color: "#fd79a8",
      title: "Receive a Personalised Diet Plan",
      desc: "Based on your prediction, our AI suggests foods to eat, foods to avoid, and practical meal tips tailored specifically to your condition.",
      detail: [
        "Covers foods that support recovery or management of the predicted condition.",
        "Highlights key nutrients your body may need more of.",
        "Practical and actionable — real foods, not abstract medical advice.",
      ],
    },
  ];

  const faqs = [
    {
      q: "Is this a replacement for seeing a doctor?",
      a: "No — and it's important to say this clearly. MediPredict is an educational tool that helps you understand your health data better. It should never replace a qualified doctor's diagnosis or advice. Always consult a healthcare professional for any medical concerns.",
    },
    {
      q: "How accurate are the predictions?",
      a: "Our models achieve between 72% and 100% accuracy on their test datasets depending on the condition. However, accuracy on real-world data can vary. The confidence percentage shown with each result gives you an idea of how certain the model is for your specific input.",
    },
    {
      q: "Is my health data saved or shared?",
      a: "No. All data you enter is processed locally and is never stored in a database or shared with third parties. When you close the browser tab, all your data is gone.",
    },
    {
      q: "What do I do if the prediction says I'm at risk?",
      a: "Don't panic. A positive prediction means the model detected patterns similar to patients who have had that condition — it does not mean you definitely have it. Use it as a prompt to book an appointment with your doctor and share the result with them.",
    },
    {
      q: "Why does the Symptom Checker need at least 3 symptoms?",
      a: "With fewer than 3 symptoms, there are too many possible conditions and the prediction would be unreliable. More symptoms give the model better information to work with, leading to a more accurate result.",
    },
    {
      q: "What is the 'confidence percentage'?",
      a: "It shows how certain the model is about its prediction based on your input values. A 90% confidence means the model strongly matches your data to that condition. A lower confidence (e.g. 60%) means the result is less certain and you should treat it with more caution.",
    },
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>

      {/* Hero */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.teal, letterSpacing: "2.5px", marginBottom: "12px" }}>// HOW IT WORKS</div>
        <h1 style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "40px", color: T.textPri, letterSpacing: "1px", marginBottom: "14px", lineHeight: 1.1 }}>
          Understanding Your<br /><span style={{ color: T.teal }}>Health Made Simple</span>
        </h1>
        <p style={{ fontFamily: T.fontBody, fontSize: "14px", color: T.textSec, lineHeight: 1.75, maxWidth: "560px", margin: "0 auto 24px" }}>
          MediPredict uses machine learning and AI to help you understand your health data in minutes. Here's exactly what happens when you run a prediction.
        </p>
        <button onClick={() => setCurrentPage("predictors")}
          style={{
            padding: "13px 28px",
            background: T.teal, border: "none", borderRadius: "6px",
            color: T.bg, fontFamily: T.fontDisp, fontWeight: 700,
            fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase",
            cursor: "pointer", boxShadow: `0 0 20px ${T.teal}44`, transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 0 30px ${T.teal}66`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0 20px ${T.teal}44`; }}>
          ▶ Try It Now
        </button>
      </div>

      {/* Step-by-step */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "48px" }}>
        {steps.map((step, i) => <StepCard key={i} {...step} />)}
      </div>

      {/* What we check */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "2.5px", marginBottom: "16px" }}>// AVAILABLE HEALTH CHECKS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "10px" }}>
          {DISEASES.map(d => (
            <div key={d.id} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 14px", background: T.bg2,
              border: `1px solid ${T.border}`, borderRadius: "8px",
            }}>
              <span style={{ fontSize: "20px" }}>{d.icon}</span>
              <div>
                <div style={{ fontFamily: T.fontDisp, fontWeight: 600, fontSize: "13px", color: T.textPri }}>{d.label}</div>
                <div style={{ fontFamily: T.fontBody, fontSize: "10px", color: T.textMuted, lineHeight: 1.4 }}>{d.desc.split(" from ")[0]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "2.5px", marginBottom: "20px" }}>// FREQUENTLY ASKED QUESTIONS</div>
        <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "8px 24px" }}>
          {faqs.map((faq, i) => <FaqItem key={i} {...faq} />)}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        padding: "20px 24px", background: "rgba(240,165,0,0.06)",
        border: "1px solid rgba(240,165,0,0.2)", borderRadius: "10px",
        display: "flex", gap: "14px", alignItems: "flex-start",
      }}>
        <span style={{ fontSize: "20px", flexShrink: 0 }}>⚠️</span>
        <div>
          <div style={{ fontFamily: T.fontDisp, fontWeight: 700, fontSize: "13px", color: T.amber, marginBottom: "5px", letterSpacing: "0.5px" }}>Important Disclaimer</div>
          <p style={{ fontFamily: T.fontBody, fontSize: "12px", color: "rgba(240,165,0,0.75)", lineHeight: 1.7 }}>
            MediPredict is for educational and informational purposes only. It is not a medical device and does not provide medical advice, diagnosis, or treatment. Always consult a qualified and licensed healthcare professional before making any health decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
