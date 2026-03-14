import { useState } from "react";
import { Field, PredictButton } from "./UIComponents";

const SYMPTOMS = [
  "itching","skin_rash","nodal_skin_eruptions","continuous_sneezing","shivering","chills",
  "joint_pain","stomach_pain","acidity","ulcers_on_tongue","muscle_wasting","vomiting",
  "burning_micturition","spotting_urination","fatigue","weight_gain","anxiety",
  "cold_hands_and_feets","mood_swings","weight_loss","restlessness","lethargy",
  "patches_in_throat","irregular_sugar_level","cough","high_fever","sunken_eyes",
  "breathlessness","sweating","dehydration","indigestion","headache","yellowish_skin",
  "dark_urine","nausea","loss_of_appetite","pain_behind_the_eyes","back_pain",
  "constipation","abdominal_pain","diarrhoea","mild_fever","yellow_urine",
  "yellowing_of_eyes","acute_liver_failure","fluid_overload","swelling_of_stomach",
  "swelled_lymph_nodes","malaise","blurred_and_distorted_vision","phlegm",
  "throat_irritation","redness_of_eyes","sinus_pressure","runny_nose","congestion",
  "chest_pain","weakness_in_limbs","fast_heart_rate","pain_during_bowel_movements",
  "pain_in_anal_region","bloody_stool","irritation_in_anus","neck_pain","dizziness",
  "cramps","bruising","obesity","swollen_legs","swollen_blood_vessels",
  "puffy_face_and_eyes","enlarged_thyroid","brittle_nails","swollen_extremeties",
  "excessive_hunger","extra_marital_contacts","drying_and_tingling_lips","slurred_speech",
  "knee_pain","hip_joint_pain","muscle_weakness","stiff_neck","swelling_joints",
  "movement_stiffness","spinning_movements","loss_of_balance","unsteadiness",
  "weakness_of_one_body_side","loss_of_smell","bladder_discomfort","foul_smell_of_urine",
  "continuous_feel_of_urine","passage_of_gases","internal_itching","toxic_look_(typhos)",
  "depression","irritability","muscle_pain","altered_sensorium","red_spots_over_body",
  "belly_pain","abnormal_menstruation","dischromic_patches","watering_from_eyes",
  "increased_appetite","polyuria","family_history","mucoid_sputum","rusty_sputum",
  "lack_of_concentration","visual_disturbances","receiving_blood_transfusion",
  "receiving_unsterile_injections","coma","stomach_bleeding","distention_of_abdomen",
  "history_of_alcohol_consumption","blood_in_sputum","prominent_veins_on_calf",
  "palpitations","painful_walking","pus_filled_pimples","blackheads","scurring",
  "skin_peeling","silver_like_dusting","small_dents_in_nails","inflammatory_nails",
  "blister","red_sore_around_nose","yellow_crust_ooze",
];

// ── Symptom picker
export function SymptomPicker({ selected, onChange }) {
  const [query, setQuery] = useState("");
  const filtered = SYMPTOMS.filter(s => s.replace(/_/g," ").includes(query.toLowerCase()) && !selected.includes(s)).slice(0, 8);
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", fontSize: "10px", color: "rgba(255,255,255,0.45)", marginBottom: "8px", letterSpacing: "0.8px", textTransform: "uppercase" }}>
        Select Symptoms (min 3)
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px", minHeight: "36px" }}>
        {selected.map(s => (
          <div key={s} onClick={() => onChange(selected.filter(x => x !== s))}
            style={{ padding: "6px 12px", borderRadius: "20px", fontSize: "12px", cursor: "pointer", background: "rgba(0,212,255,0.2)", border: "1px solid rgba(0,212,255,0.5)", color: "#00d4ff", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
            {s.replace(/_/g," ")} <span style={{ opacity: 0.7 }}>×</span>
          </div>
        ))}
      </div>
      <input placeholder="Search symptoms..." value={query} onChange={e => setQuery(e.target.value)}
        style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif", marginBottom: "8px" }} />
      {query && (
        <div style={{ background: "rgba(15,15,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden" }}>
          {filtered.length === 0
            ? <div style={{ padding: "12px 16px", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>No symptoms found</div>
            : filtered.map(s => (
              <div key={s} onClick={() => { onChange([...selected, s]); setQuery(""); }}
                style={{ padding: "10px 16px", fontSize: "13px", cursor: "pointer", color: "rgba(255,255,255,0.8)", borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {s.replace(/_/g," ")}
              </div>
            ))}
        </div>
      )}
      {selected.length > 0 && selected.length < 3 && (
        <div style={{ fontSize: "11px", color: "#ffa502", marginTop: "6px" }}>
          ⚠ Select {3 - selected.length} more symptom{3 - selected.length > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

// ── Disease Forms
export function SymptomForm({ onSubmit, loading, color }) {
  const [symptoms, setSymptoms] = useState([]);
  return (
    <div>
      <SymptomPicker selected={symptoms} onChange={setSymptoms} />
      <PredictButton loading={loading} disabled={symptoms.length < 3} color={color}
        label={symptoms.length < 3 ? `Select ${3-symptoms.length} more symptom${symptoms.length===2?"":"s"}` : "Predict Disease"}
        onClick={() => onSubmit({ symptoms })} />
    </div>
  );
}

export function DiabetesForm({ onSubmit, loading, color }) {
  const [f,setF] = useState({ pregnancies:2, glucose:120, bp:80, skin:20, insulin:80, bmi:25.0, dpf:0.500, age:30 });
  const s = k => v => setF(p=>({...p,[k]:v}));
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <Field label="Pregnancies" value={f.pregnancies} onChange={s("pregnancies")} min={0} />
        <Field label="Glucose (mg/dL)" value={f.glucose} onChange={s("glucose")} min={0} />
        <Field label="Blood Pressure (mmHg)" value={f.bp} onChange={s("bp")} min={0} />
        <Field label="Skin Thickness (mm)" value={f.skin} onChange={s("skin")} min={0} />
        <Field label="Insulin (µU/mL)" value={f.insulin} onChange={s("insulin")} min={0} />
        <Field label="BMI (kg/m²)" value={f.bmi} onChange={s("bmi")} step={0.1} />
        <Field label="Diabetes Pedigree Function" value={f.dpf} onChange={s("dpf")} step={0.001} />
        <Field label="Age" value={f.age} onChange={s("age")} min={1} />
      </div>
      <PredictButton loading={loading} color={color} onClick={() => onSubmit({ pregnancies:+f.pregnancies, glucose:+f.glucose, blood_pressure:+f.bp, skin_thickness:+f.skin, insulin:+f.insulin, bmi:+f.bmi, diabetes_pedigree:+f.dpf, age:+f.age })} />
    </div>
  );
}

export function HeartForm({ onSubmit, loading, color }) {
  const [f,setF] = useState({ age:50, sex:1, cp:0, trestbps:120, chol:200, fbs:0, restecg:0, thalach:150, exang:0, oldpeak:1.0, slope:1, ca:0, thal:1 });
  const s = k => v => setF(p=>({...p,[k]:+v}));
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <Field label="Age" value={f.age} onChange={s("age")} min={1} />
        <Field label="Sex" type="select" value={f.sex} onChange={s("sex")} options={[{value:1,label:"Male"},{value:0,label:"Female"}]} />
        <Field label="Chest Pain Type" type="select" value={f.cp} onChange={s("cp")} options={[{value:0,label:"Typical Angina"},{value:1,label:"Atypical Angina"},{value:2,label:"Non-Anginal"},{value:3,label:"Asymptomatic"}]} />
        <Field label="Resting BP (mmHg)" value={f.trestbps} onChange={s("trestbps")} min={0} />
        <Field label="Cholesterol (mg/dL)" value={f.chol} onChange={s("chol")} min={0} />
        <Field label="Fasting Blood Sugar >120" type="select" value={f.fbs} onChange={s("fbs")} options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
        <Field label="Resting ECG" type="select" value={f.restecg} onChange={s("restecg")} options={[{value:0,label:"Normal"},{value:1,label:"ST-T Abnormality"},{value:2,label:"LV Hypertrophy"}]} />
        <Field label="Max Heart Rate (bpm)" value={f.thalach} onChange={s("thalach")} min={0} />
        <Field label="Exercise Angina" type="select" value={f.exang} onChange={s("exang")} options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
        <Field label="ST Depression (Oldpeak)" value={f.oldpeak} onChange={s("oldpeak")} step={0.1} min={0} />
        <Field label="Peak Exercise ST Slope" type="select" value={f.slope} onChange={s("slope")} options={[{value:0,label:"Upsloping"},{value:1,label:"Flat"},{value:2,label:"Downsloping"}]} />
        <Field label="Major Vessels (0–3)" value={f.ca} onChange={s("ca")} min={0} max={3} />
        <Field label="Thalassemia" type="select" value={f.thal} onChange={s("thal")} options={[{value:0,label:"Normal"},{value:1,label:"Fixed Defect"},{value:2,label:"Reversible Defect"}]} />
      </div>
      <PredictButton loading={loading} color={color} onClick={() => onSubmit(f)} />
    </div>
  );
}

export function ParkinsonForm({ onSubmit, loading, color }) {
  const init = { mdvp_fo:119.99, mdvp_fhi:157.30, mdvp_flo:74.99, mdvp_jitter_pct:0.00784, mdvp_jitter_abs:0.00007, mdvp_rap:0.00370, mdvp_ppq:0.00554, jitter_ddp:0.01109, mdvp_shimmer:0.04374, mdvp_shimmer_db:0.426, shimmer_apq3:0.02182, shimmer_apq5:0.03130, mdvp_apq:0.02971, shimmer_dda:0.06545, nhr:0.02211, hnr:21.033, rpde:0.414783, dfa:0.815285, spread1:-4.813031, spread2:0.266482, d2:2.301442, ppe:0.284654 };
  const [f,setF] = useState(init);
  const s = k => v => setF(p=>({...p,[k]:+v}));
  const fields = [["MDVP: Fo (Hz)","mdvp_fo"],["MDVP: Fhi (Hz)","mdvp_fhi"],["MDVP: Flo (Hz)","mdvp_flo"],["Jitter (%)","mdvp_jitter_pct"],["Jitter (Abs)","mdvp_jitter_abs"],["RAP","mdvp_rap"],["PPQ","mdvp_ppq"],["Jitter DDP","jitter_ddp"],["Shimmer","mdvp_shimmer"],["Shimmer (dB)","mdvp_shimmer_db"],["APQ3","shimmer_apq3"],["APQ5","shimmer_apq5"],["APQ","mdvp_apq"],["DDA","shimmer_dda"],["NHR","nhr"],["HNR","hnr"],["RPDE","rpde"],["DFA","dfa"],["Spread1","spread1"],["Spread2","spread2"],["D2","d2"],["PPE","ppe"]];
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 12px" }}>
        {fields.map(([label,key]) => <Field key={key} label={label} value={f[key]} onChange={s(key)} step={0.00001} />)}
      </div>
      <PredictButton loading={loading} color={color} onClick={() => onSubmit(f)} />
    </div>
  );
}

export function LiverForm({ onSubmit, loading, color }) {
  const [f,setF] = useState({ sex:0, age:40, total_bilirubin:1.0, direct_bilirubin:0.3, alkaline_phosphotase:180, alamine_aminotransferase:30, aspartate_aminotransferase:35, total_proteins:6.5, albumin:3.5, albumin_globulin_ratio:1.0 });
  const s = k => v => setF(p=>({...p,[k]:+v}));
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <Field label="Sex" type="select" value={f.sex} onChange={s("sex")} options={[{value:0,label:"Male"},{value:1,label:"Female"}]} />
        <Field label="Age" value={f.age} onChange={s("age")} min={1} />
        <Field label="Total Bilirubin" value={f.total_bilirubin} onChange={s("total_bilirubin")} step={0.1} />
        <Field label="Direct Bilirubin" value={f.direct_bilirubin} onChange={s("direct_bilirubin")} step={0.1} />
        <Field label="Alkaline Phosphotase" value={f.alkaline_phosphotase} onChange={s("alkaline_phosphotase")} />
        <Field label="Alamine Aminotransferase" value={f.alamine_aminotransferase} onChange={s("alamine_aminotransferase")} />
        <Field label="Aspartate Aminotransferase" value={f.aspartate_aminotransferase} onChange={s("aspartate_aminotransferase")} />
        <Field label="Total Proteins (g/dL)" value={f.total_proteins} onChange={s("total_proteins")} step={0.1} />
        <Field label="Albumin (g/dL)" value={f.albumin} onChange={s("albumin")} step={0.1} />
        <Field label="Albumin/Globulin Ratio" value={f.albumin_globulin_ratio} onChange={s("albumin_globulin_ratio")} step={0.01} />
      </div>
      <PredictButton loading={loading} color={color} onClick={() => onSubmit(f)} />
    </div>
  );
}

export function HepatitisForm({ onSubmit, loading, color }) {
  const [f,setF] = useState({ age:40, sex:1, alb:38.5, alp:52.5, alt:7.7, ast:22.1, bil:7.5, che:6.93, chol:3.23, crea:106.0, ggt:12.1, prot:69.0 });
  const s = k => v => setF(p=>({...p,[k]:+v}));
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <Field label="Age" value={f.age} onChange={s("age")} min={1} />
        <Field label="Sex" type="select" value={f.sex} onChange={s("sex")} options={[{value:1,label:"Male"},{value:2,label:"Female"}]} />
        <Field label="ALB – Albumin (g/L)" value={f.alb} onChange={s("alb")} step={0.1} />
        <Field label="ALP – Alkaline Phosphatase" value={f.alp} onChange={s("alp")} step={0.1} />
        <Field label="ALT – Alanine Aminotransferase" value={f.alt} onChange={s("alt")} step={0.1} />
        <Field label="AST – Aspartate Aminotransferase" value={f.ast} onChange={s("ast")} step={0.1} />
        <Field label="BIL – Bilirubin (µmol/L)" value={f.bil} onChange={s("bil")} step={0.1} />
        <Field label="CHE – Cholinesterase" value={f.che} onChange={s("che")} step={0.01} />
        <Field label="CHOL – Cholesterol (mmol/L)" value={f.chol} onChange={s("chol")} step={0.01} />
        <Field label="CREA – Creatinine (µmol/L)" value={f.crea} onChange={s("crea")} step={0.1} />
        <Field label="GGT – Gamma-Glutamyltransferase" value={f.ggt} onChange={s("ggt")} step={0.1} />
        <Field label="PROT – Total Protein (g/L)" value={f.prot} onChange={s("prot")} step={0.1} />
      </div>
      <PredictButton loading={loading} color={color} onClick={() => onSubmit(f)} />
    </div>
  );
}

export function LungForm({ onSubmit, loading, color }) {
  const [f,setF] = useState({ gender:1, age:50, smoking:"NO", yellow_fingers:"NO", anxiety:"NO", peer_pressure:"NO", chronic_disease:"NO", fatigue:"NO", allergy:"NO", wheezing:"NO", alcohol_consuming:"NO", coughing:"NO", shortness_of_breath:"NO", swallowing_difficulty:"NO", chest_pain:"NO" });
  const s = k => v => setF(p=>({...p,[k]:v}));
  const yn = [{value:"NO",label:"No"},{value:"YES",label:"Yes"}];
  const enc = v => v==="YES" ? 2 : 1;
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 12px" }}>
        <Field label="Gender" type="select" value={f.gender} onChange={v=>setF(p=>({...p,gender:+v}))} options={[{value:1,label:"Male"},{value:2,label:"Female"}]} />
        <Field label="Age" value={f.age} onChange={v=>setF(p=>({...p,age:+v}))} min={1} />
        <Field label="Smoking" type="select" value={f.smoking} onChange={s("smoking")} options={yn} />
        <Field label="Yellow Fingers" type="select" value={f.yellow_fingers} onChange={s("yellow_fingers")} options={yn} />
        <Field label="Anxiety" type="select" value={f.anxiety} onChange={s("anxiety")} options={yn} />
        <Field label="Peer Pressure" type="select" value={f.peer_pressure} onChange={s("peer_pressure")} options={yn} />
        <Field label="Chronic Disease" type="select" value={f.chronic_disease} onChange={s("chronic_disease")} options={yn} />
        <Field label="Fatigue" type="select" value={f.fatigue} onChange={s("fatigue")} options={yn} />
        <Field label="Allergy" type="select" value={f.allergy} onChange={s("allergy")} options={yn} />
        <Field label="Wheezing" type="select" value={f.wheezing} onChange={s("wheezing")} options={yn} />
        <Field label="Alcohol Consuming" type="select" value={f.alcohol_consuming} onChange={s("alcohol_consuming")} options={yn} />
        <Field label="Coughing" type="select" value={f.coughing} onChange={s("coughing")} options={yn} />
        <Field label="Shortness of Breath" type="select" value={f.shortness_of_breath} onChange={s("shortness_of_breath")} options={yn} />
        <Field label="Swallowing Difficulty" type="select" value={f.swallowing_difficulty} onChange={s("swallowing_difficulty")} options={yn} />
        <Field label="Chest Pain" type="select" value={f.chest_pain} onChange={s("chest_pain")} options={yn} />
      </div>
      <PredictButton loading={loading} color={color} onClick={() => onSubmit({ gender:f.gender, age:f.age, smoking:enc(f.smoking), yellow_fingers:enc(f.yellow_fingers), anxiety:enc(f.anxiety), peer_pressure:enc(f.peer_pressure), chronic_disease:enc(f.chronic_disease), fatigue:enc(f.fatigue), allergy:enc(f.allergy), wheezing:enc(f.wheezing), alcohol_consuming:enc(f.alcohol_consuming), coughing:enc(f.coughing), shortness_of_breath:enc(f.shortness_of_breath), swallowing_difficulty:enc(f.swallowing_difficulty), chest_pain:enc(f.chest_pain) })} />
    </div>
  );
}

export function KidneyForm({ onSubmit, loading, color }) {
  const [f,setF] = useState({ age:50, bp:80, sg:1.020, al:0, su:0, rbc:1, pc:1, pcc:0, ba:0, bgr:121, bu:36, sc:1.2, sod:137.5, pot:4.6, hemo:15.4, pcv:44, wc:7800, rc:5.2, htn:0, dm:0, cad:0, appet:1, pe:0, ane:0 });
  const s = k => v => setF(p=>({...p,[k]:+v}));
  const yn=[{value:0,label:"No"},{value:1,label:"Yes"}], na=[{value:1,label:"Normal"},{value:0,label:"Abnormal"}], pnp=[{value:1,label:"Present"},{value:0,label:"Not Present"}];
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 12px" }}>
        <Field label="Age" value={f.age} onChange={s("age")} min={1} />
        <Field label="Blood Pressure (mmHg)" value={f.bp} onChange={s("bp")} min={0} />
        <Field label="Specific Gravity" value={f.sg} onChange={s("sg")} step={0.001} />
        <Field label="Albumin (0–5)" value={f.al} onChange={s("al")} min={0} max={5} />
        <Field label="Sugar (0–5)" value={f.su} onChange={s("su")} min={0} max={5} />
        <Field label="Red Blood Cells" type="select" value={f.rbc} onChange={s("rbc")} options={na} />
        <Field label="Pus Cells" type="select" value={f.pc} onChange={s("pc")} options={na} />
        <Field label="Pus Cell Clumps" type="select" value={f.pcc} onChange={s("pcc")} options={pnp} />
        <Field label="Bacteria" type="select" value={f.ba} onChange={s("ba")} options={pnp} />
        <Field label="Blood Glucose Random" value={f.bgr} onChange={s("bgr")} min={0} />
        <Field label="Blood Urea (mg/dL)" value={f.bu} onChange={s("bu")} min={0} />
        <Field label="Serum Creatinine" value={f.sc} onChange={s("sc")} step={0.1} min={0} />
        <Field label="Sodium (mEq/L)" value={f.sod} onChange={s("sod")} step={0.1} />
        <Field label="Potassium (mEq/L)" value={f.pot} onChange={s("pot")} step={0.1} />
        <Field label="Haemoglobin (g/dL)" value={f.hemo} onChange={s("hemo")} step={0.1} />
        <Field label="Packed Cell Volume (%)" value={f.pcv} onChange={s("pcv")} min={0} />
        <Field label="WBC Count (cells/µL)" value={f.wc} onChange={s("wc")} min={0} />
        <Field label="RBC Count (million/µL)" value={f.rc} onChange={s("rc")} step={0.1} min={0} />
        <Field label="Hypertension" type="select" value={f.htn} onChange={s("htn")} options={yn} />
        <Field label="Diabetes Mellitus" type="select" value={f.dm} onChange={s("dm")} options={yn} />
        <Field label="Coronary Artery Disease" type="select" value={f.cad} onChange={s("cad")} options={yn} />
        <Field label="Appetite" type="select" value={f.appet} onChange={s("appet")} options={[{value:1,label:"Good"},{value:0,label:"Poor"}]} />
        <Field label="Pedal Oedema" type="select" value={f.pe} onChange={s("pe")} options={yn} />
        <Field label="Anaemia" type="select" value={f.ane} onChange={s("ane")} options={yn} />
      </div>
      <PredictButton loading={loading} color={color} onClick={() => onSubmit(f)} />
    </div>
  );
}

export function BreastForm({ onSubmit, loading, color }) {
  const init = { radius_mean:14.13, texture_mean:19.27, perimeter_mean:91.97, area_mean:654.9, smoothness_mean:0.0964, compactness_mean:0.104, concavity_mean:0.0887, concave_points_mean:0.0489, symmetry_mean:0.1812, fractal_dimension_mean:0.0626, radius_se:0.404, texture_se:1.216, perimeter_se:2.866, area_se:40.34, smoothness_se:0.007, compactness_se:0.0253, concavity_se:0.0253, concave_points_se:0.0120, symmetry_se:0.0200, fractal_dimension_se:0.0040, radius_worst:16.27, texture_worst:25.68, perimeter_worst:107.3, area_worst:880.6, smoothness_worst:0.132, compactness_worst:0.254, concavity_worst:0.272, concave_points_worst:0.115, symmetry_worst:0.2852, fractal_dimension_worst:0.0838 };
  const [f,setF] = useState(init);
  const s = k => v => setF(p=>({...p,[k]:+v}));
  const groups = [
    { heading:"Mean Values", keys: Object.keys(init).filter(k=>k.endsWith("_mean")) },
    { heading:"Standard Error", keys: Object.keys(init).filter(k=>k.endsWith("_se")) },
    { heading:"Worst Values", keys: Object.keys(init).filter(k=>k.endsWith("_worst")) },
  ];
  return (
    <div>
      {groups.map(({heading,keys}) => (
        <div key={heading}>
          <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.8px", margin:"14px 0 8px", paddingBottom:"6px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>{heading}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 12px" }}>
            {keys.map(k => <Field key={k} label={k.replace(/_mean|_se|_worst/,"").replace(/_/g," ")} value={f[k]} onChange={s(k)} step={0.001} />)}
          </div>
        </div>
      ))}
      <PredictButton loading={loading} color={color} onClick={() => onSubmit(f)} />
    </div>
  );
}

export const FORMS = { 
  symptom:SymptomForm, 
  diabetes:DiabetesForm, 
  heart:HeartForm, 
  parkinson:ParkinsonForm, 
  liver:LiverForm, 
  hepatitis:HepatitisForm, 
  lung:LungForm, 
  kidney:KidneyForm, 
  breast:BreastForm 
};
