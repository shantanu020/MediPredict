export const DISEASES = [
  { id: "symptom",  label: "Symptom Checker", icon: "🔬", color: "#00d4ff", desc: "AI-powered general disease prediction from symptoms",   endpoint: "/predict/symptoms" },
  { id: "diabetes", label: "Diabetes",         icon: "🩸", color: "#ff6b6b", desc: "Predict diabetes risk from glucose & metabolic data",    endpoint: "/predict/diabetes" },
  { id: "heart",    label: "Heart Disease",    icon: "❤️",  color: "#ff4757", desc: "Cardiac risk assessment from clinical measurements",     endpoint: "/predict/heart" },
  { id: "parkinson",label: "Parkinson's",      icon: "🧠", color: "#a29bfe", desc: "Parkinson's detection via voice biomarkers",             endpoint: "/predict/parkinson" },
  { id: "liver",    label: "Liver Disease",    icon: "🫀", color: "#fd9644", desc: "Liver condition analysis from blood markers",            endpoint: "/predict/liver" },
  { id: "hepatitis",label: "Hepatitis",        icon: "🧬", color: "#26de81", desc: "Hepatitis C detection from liver function tests",        endpoint: "/predict/hepatitis" },
  { id: "lung",     label: "Lung Cancer",      icon: "🫁", color: "#45aaf2", desc: "Lung cancer risk from lifestyle factors",                endpoint: "/predict/lung_cancer" },
  { id: "kidney",   label: "Chronic Kidney",   icon: "💊", color: "#fd79a8", desc: "CKD prediction from urinalysis & blood work",            endpoint: "/predict/chronic_kidney" },
  { id: "breast",   label: "Breast Cancer",    icon: "🎗️", color: "#e84393", desc: "Tumor malignancy prediction from biopsy features",      endpoint: "/predict/breast_cancer" },
];

export const API_BASE = "http://localhost:8000";
