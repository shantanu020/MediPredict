import { Panel, PanelHeader, T } from "../components/UIComponents";

export default function Settings({ groqKey, setGroqKey }) {
  const features = [
    { icon:"◈", label:"Second Opinion Analysis",     desc:"LLM clinical reasoning per prediction",    on:!!groqKey },
    { icon:"✦", label:"Personalized Diet Plans",      desc:"Condition-specific nutrition guidance",     on:!!groqKey },
    { icon:"◉", label:"RAG Symptom Analysis",         desc:"FAISS + CSV knowledge base retrieval",     on:!!groqKey },
    { icon:"◎", label:"Differential Diagnosis",       desc:"ML probability-ranked alternatives",       on:true },
  ];

  return (
    <div style={{padding:"28px", maxWidth:"760px"}}>

      {/* API Key panel */}
      <Panel glow={!!groqKey} style={{marginBottom:"16px"}}>
        <PanelHeader icon="◧" title="Groq API Configuration" badge={groqKey?"ACTIVE":"INACTIVE"}/>
        <div style={{padding:"24px"}}>
          <div style={{
            fontFamily:T.fontMono, fontSize:"9px", color:T.textMuted,
            letterSpacing:"1.5px", marginBottom:"8px",
          }}>API KEY</div>

          <div style={{position:"relative"}}>
            <input
              type="password" placeholder="gsk_…" value={groqKey}
              onChange={e=>setGroqKey(e.target.value)}
              style={{
                width:"100%", padding:"12px 14px",
                background:T.bg3,
                border:`1px solid ${groqKey ? T.teal+"55" : T.border}`,
                borderRadius:"7px", color:T.textPri,
                fontSize:"13px", outline:"none",
                fontFamily:T.fontMono,
                boxSizing:"border-box",
                boxShadow: groqKey ? `0 0 12px ${T.teal}18` : "none",
                transition:"all 0.2s",
              }}
            />
            {groqKey && (
              <div style={{
                position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)",
                fontFamily:T.fontMono, fontSize:"9px", color:T.green,
                padding:"2px 7px", borderRadius:"3px",
                background:`${T.green}18`, border:`1px solid ${T.green}33`,
              }}>VALID</div>
            )}
          </div>

          {groqKey
            ? <div style={{marginTop:"10px",fontFamily:T.fontMono,fontSize:"10px",color:T.green,letterSpacing:"0.5px"}}>
                ✓ Active · llama-3.3-70b-versatile
              </div>
            : <a href="https://console.groq.com" target="_blank" rel="noreferrer"
                style={{
                  display:"inline-block",marginTop:"10px",
                  fontFamily:T.fontMono,fontSize:"10px",color:T.teal,
                  textDecoration:"none",letterSpacing:"0.5px",
                }}>
                GET FREE KEY AT CONSOLE.GROQ.COM →
              </a>
          }
        </div>
      </Panel>

      {/* Features panel */}
      <Panel style={{marginBottom:"16px"}}>
        <PanelHeader icon="◉" title="Feature Status"/>
        <div style={{padding:"16px 20px"}}>
          {features.map((f,i)=>(
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:"14px",
              padding:"12px 0",
              borderBottom: i<features.length-1 ? `1px solid ${T.border}` : "none",
            }}>
              <span style={{
                fontFamily:T.fontMono, fontSize:"14px",
                color: f.on ? T.teal : T.textMuted,
                width:"20px", textAlign:"center",
              }}>{f.icon}</span>
              <div style={{flex:1}}>
                <div style={{
                  fontFamily:T.fontDisp, fontWeight:600, fontSize:"13px",
                  color: f.on ? T.textPri : T.textMuted,
                  letterSpacing:"0.3px",
                }}>{f.label}</div>
                <div style={{fontFamily:T.fontMono, fontSize:"9px", color:T.textMuted, marginTop:"2px"}}>{f.desc}</div>
              </div>
              <div style={{
                fontFamily:T.fontMono, fontSize:"9px",
                padding:"3px 9px", borderRadius:"3px",
                background: f.on ? `${T.green}18` : "rgba(255,255,255,0.04)",
                color: f.on ? T.green : T.textMuted,
                border:`1px solid ${f.on ? T.green+"33" : T.border}`,
                letterSpacing:"0.5px",
              }}>{f.on ? "ENABLED" : "DISABLED"}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* How-to panel */}
      <Panel>
        <PanelHeader icon="ℹ" title="Setup Guide"/>
        <div style={{padding:"20px"}}>
          {[
            {step:"01", title:"Get Free Groq Key", body:"Visit console.groq.com, sign up, and generate an API key. Free tier includes generous usage limits."},
            {step:"02", title:"Start FastAPI Backend", body:"cd backend && python api.py — server starts at http://localhost:8000"},
            {step:"03", title:"Enter Key Above", body:"Paste your gsk_… key into the field above to unlock AI second opinions, diet plans, and RAG analysis."},
            {step:"04", title:"Run Predictions", body:"Navigate to Predictors, select a disease module, fill in the clinical data, and click the predict button."},
          ].map((s,i)=>(
            <div key={i} style={{
              display:"flex", gap:"16px",
              padding:"14px 0",
              borderBottom: i<3 ? `1px solid ${T.border}` : "none",
            }}>
              <div style={{
                fontFamily:T.fontMono, fontSize:"13px", fontWeight:500,
                color:T.teal, flexShrink:0, width:"24px",
              }}>{s.step}</div>
              <div>
                <div style={{fontFamily:T.fontDisp,fontWeight:600,fontSize:"13px",color:T.textPri,marginBottom:"4px"}}>{s.title}</div>
                <div style={{fontFamily:T.fontMono,fontSize:"10px",color:T.textMuted,lineHeight:1.6}}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
