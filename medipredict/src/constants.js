import {
  Microscope,
  Droplet,
  Heart,
  Brain,
  Activity,
  Dna,
  Wind,
  Pill,
  Ribbon
} from "lucide-react";
export const DISEASES = [
  {
    id: "symptom",
    label: "Symptom Checker",
    icon: <Microscope size={18} />,
    color: "#00d4ff",
    desc: "AI-powered general disease prediction from symptoms",
    endpoint: "/predict/symptoms"
  },
  {
    id: "diabetes",
    label: "Diabetes",
    icon: <Droplet size={18} />,
    color: "#ff6b6b",
    desc: "Predict diabetes risk from glucose & metabolic data",
    endpoint: "/predict/diabetes"
  },
  {
    id: "heart",
    label: "Heart Disease",
    icon: <Heart size={18} />,
    color: "#ff4757",
    desc: "Cardiac risk assessment from clinical measurements",
    endpoint: "/predict/heart"
  },
  {
    id: "parkinson",
    label: "Parkinson's",
    icon: <Brain size={18} />,
    color: "#a29bfe",
    desc: "Parkinson's detection via voice biomarkers",
    endpoint: "/predict/parkinson"
  },
  {
    id: "liver",
    label: "Liver Disease",
    icon: <Activity size={18} />,
    color: "#fd9644",
    desc: "Liver condition analysis from blood markers",
    endpoint: "/predict/liver"
  },
  {
    id: "hepatitis",
    label: "Hepatitis",
    icon: <Dna size={18} />,
    color: "#26de81",
    desc: "Hepatitis C detection from liver function tests",
    endpoint: "/predict/hepatitis"
  },
  {
    id: "lung",
    label: "Lung Cancer",
    icon: <Wind size={18} />,
    color: "#45aaf2",
    desc: "Lung cancer risk from lifestyle factors",
    endpoint: "/predict/lung_cancer"
  },
  {
    id: "kidney",
    label: "Chronic Kidney",
    icon: <Pill size={18} />,
    color: "#fd79a8",
    desc: "CKD prediction from urinalysis & blood work",
    endpoint: "/predict/chronic_kidney"
  },
  {
    id: "breast",
    label: "Breast Cancer",
    icon: <Ribbon size={18} />,
    color: "#e84393",
    desc: "Tumor malignancy prediction from biopsy features",
    endpoint: "/predict/breast_cancer"
  }
];

export const API_BASE = "https://medipredict-2.onrender.com/";