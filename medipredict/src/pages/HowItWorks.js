import { useState } from "react";
import {
  Search,
  ClipboardList,
  Bot,
  MessageSquare,
  Apple,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from "lucide-react";

import { T } from "../components/UIComponents";

function StepCard({ n, icon, title, desc, color, detail }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: T.bg2,
        border: `1px solid ${open ? color + "44" : T.border}`,
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.2s"
      }}
    >
      <div
        style={{
          height: "2px",
          background: `linear-gradient(90deg,${color},${color}44,transparent)`
        }}
      />

      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              flexShrink: 0,
              background: `${color}15`,
              border: `1px solid ${color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {icon}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "6px"
              }}
            >
              <span
                style={{
                  fontFamily: T.fontMono,
                  fontSize: "9px",
                  color,
                  letterSpacing: "1.5px"
                }}
              >
                STEP {n}
              </span>
            </div>

            <div
              style={{
                fontFamily: T.fontDisp,
                fontWeight: 700,
                fontSize: "17px",
                color: T.textPri,
                marginBottom: "8px",
                letterSpacing: "0.3px"
              }}
            >
              {title}
            </div>

            <p
              style={{
                fontFamily: T.fontBody,
                fontSize: "13px",
                color: T.textSec,
                lineHeight: 1.7
              }}
            >
              {desc}
            </p>
          </div>
        </div>

        {detail && (
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              marginTop: "14px",
              padding: "7px 14px",
              background: "transparent",
              border: `1px solid ${T.border}`,
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: T.fontBody,
              fontSize: "12px",
              color: T.textSec,
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {open ? "Show less" : "Learn more"}
          </button>
        )}

        {open && detail && (
          <div
            style={{
              marginTop: "14px",
              padding: "14px 16px",
              background: T.bg3,
              borderRadius: "8px",
              borderLeft: `2px solid ${color}55`
            }}
          >
            {detail.map((line, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  marginBottom: i < detail.length - 1 ? "8px" : 0,
                  fontFamily: T.fontBody,
                  fontSize: "12px",
                  color: T.textSec,
                  lineHeight: 1.65
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: color,
                    marginTop: "6px",
                    flexShrink: 0
                  }}
                />

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
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          padding: "16px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          textAlign: "left"
        }}
      >
        <span
          style={{
            fontFamily: T.fontDisp,
            fontWeight: 600,
            fontSize: "14px",
            color: T.textPri
          }}
        >
          {q}
        </span>

        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <p
          style={{
            fontFamily: T.fontBody,
            fontSize: "13px",
            color: T.textSec,
            lineHeight: 1.7,
            paddingBottom: "16px"
          }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

export default function HowItWorks({ setCurrentPage }) {
  const steps = [
    {
      n: "01",
      icon: <Search size={22} color={T.teal} />,
      color: T.teal,
      title: "Choose What to Check",
      desc: "Pick a condition from our 9 available health checks.",
      detail: [
        "Use symptom checker or disease risk models.",
        "Enter medical test values like glucose or cholesterol.",
        "No medical knowledge needed."
      ]
    },
    {
      n: "02",
      icon: <ClipboardList size={22} color="#a29bfe" />,
      color: "#a29bfe",
      title: "Enter Your Information",
      desc: "Fill in a simple form with your health data.",
      detail: [
        "Data stays private.",
        "Default values help test the tool.",
        "Select symptoms easily."
      ]
    },
    {
      n: "03",
      icon: <Bot size={22} color={T.amber} />,
      color: T.amber,
      title: "AI Analyses Your Data",
      desc: "Machine learning models process the data instantly.",
      detail: [
        "Trained on medical datasets.",
        "Alternative diagnoses shown.",
        "Confidence score provided."
      ]
    },
    {
      n: "04",
      icon: <MessageSquare size={22} color={T.green} />,
      color: T.green,
      title: "AI Second Opinion",
      desc: "AI explains results and recommends doctors/tests.",
      detail: [
        "Powered by advanced LLM.",
        "Grounded in medical references.",
        "Plain language explanations."
      ]
    },
    {
      n: "05",
      icon: <Apple size={22} color="#fd79a8" />,
      color: "#fd79a8",
      title: "Personalised Diet Plan",
      desc: "Get diet recommendations tailored to your condition.",
      detail: [
        "Foods to eat and avoid.",
        "Key nutrients highlighted.",
        "Practical meal suggestions."
      ]
    }
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: T.fontDisp,
            fontWeight: 700,
            fontSize: "40px",
            color: T.textPri
          }}
        >
          Understanding Your Health Made Simple
        </h1>

        <button
          onClick={() => setCurrentPage("predictors")}
          style={{
            padding: "13px 28px",
            background: T.teal,
            border: "none",
            borderRadius: "6px",
            color: T.bg,
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          Try It Now
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {steps.map((step, i) => (
          <StepCard key={i} {...step} />
        ))}
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          background: "rgba(240,165,0,0.06)",
          border: "1px solid rgba(240,165,0,0.2)",
          borderRadius: "10px",
          display: "flex",
          gap: "14px"
        }}
      >
        <AlertTriangle size={22} color={T.amber} />

        <div>
          <div
            style={{
              fontFamily: T.fontDisp,
              fontWeight: 700,
              fontSize: "13px",
              color: T.amber
            }}
          >
            Important Disclaimer
          </div>

          <p
            style={{
              fontFamily: T.fontBody,
              fontSize: "12px",
              color: "rgba(240,165,0,0.75)",
              lineHeight: 1.7
            }}
          >
            MediPredict is for educational purposes only and does not replace
            medical advice. Always consult a qualified healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}