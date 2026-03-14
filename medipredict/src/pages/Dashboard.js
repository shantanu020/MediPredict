import { Panel, PanelHeader, StatusDot, DiseaseCard, T } from "../components/UIComponents";
import { DISEASES } from "../constants";

export default function Dashboard({ apiStatus, setCurrentPage, handleDiseaseChange }) {
  const stats = [
    { label:"ML MODELS", value:"09", sub:"Active predictors", color:T.teal },
    { label:"DISEASES", value:"42+", sub:"Symptom database", color:T.amber },
    { label:"AI ENGINE", value:"ON", sub:"Groq llama-3.3-70b", color:T.green },
    { label:"BACKEND", value:apiStatus==="online"?"●":"○", sub:`FastAPI ${apiStatus}`, color:apiStatus==="online"?T.green:T.red },
  ];

  return (
    <div style={{padding:"40px", maxWidth:"1200px", margin:"0 auto", width:"100%"}}>

      {/* Stat cards */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"14px", marginBottom:"28px"}}>
        {stats.map((s,i)=>(
          <Panel key={i} style={{padding:"20px 22px"}}>
            <div style={{fontFamily:T.fontMono, fontSize:"8px", color:T.textMuted, letterSpacing:"2px", marginBottom:"10px"}}>{s.label}</div>
            <div style={{
              fontFamily:T.fontDisp, fontWeight:700, fontSize:"32px",
              color:s.color, lineHeight:1, marginBottom:"6px",
              textShadow:`0 0 20px ${s.color}44`,
            }}>{s.value}</div>
            <div style={{fontFamily:T.fontMono, fontSize:"9px", color:T.textMuted, letterSpacing:"0.5px"}}>{s.sub}</div>
          </Panel>
        ))}
      </div>

      {/* Two-col layout */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"28px"}}>

        {/* System status */}
        <Panel>
          <PanelHeader icon="◎" title="System Status" badge="LIVE"/>
          <div style={{padding:"16px 20px"}}>
            {[
              {label:"FastAPI Backend", status:apiStatus, note:`http://localhost:8000`},
              {label:"ML Models (8)", status:"online", note:"All .sav files loaded"},
              {label:"Symptom Model", status:"online", note:"RandomForest · 133 symptoms"},
              {label:"Groq AI", status:"online", note:"llama-3.3-70b · Server-side key"},
              {label:"RAG Chain", status:"online", note:"FAISS vectorstore · 220 chunks"},
            ].map((item,i)=>(
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:"10px",
                padding:"9px 0",
                borderBottom: i<4 ? `1px solid ${T.border}` : "none",
              }}>
                <StatusDot status={item.status}/>
                <div style={{flex:1}}>
                  <div style={{fontFamily:T.fontDisp, fontWeight:600, fontSize:"12px", color:T.textPri, letterSpacing:"0.3px"}}>{item.label}</div>
                  <div style={{fontFamily:T.fontMono, fontSize:"9px", color:T.textMuted, marginTop:"1px"}}>{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Quick actions */}
        <Panel>
          <PanelHeader icon="◈" title="Quick Launch"/>
          <div style={{padding:"16px 20px"}}>
            <div style={{fontFamily:T.fontMono, fontSize:"9px", color:T.textMuted, letterSpacing:"1.5px", marginBottom:"12px"}}>
              FEATURED MODULES
            </div>
            {DISEASES.slice(0,5).map(d=>(
              <div key={d.id}
                onClick={()=>{ handleDiseaseChange(d.id); setCurrentPage("predictors"); }}
                style={{
                  display:"flex", alignItems:"center", gap:"12px",
                  padding:"10px 12px", borderRadius:"7px", cursor:"pointer",
                  marginBottom:"5px", transition:"all 0.15s",
                  border:`1px solid transparent`,
                }}
                onMouseEnter={e=>{
                  e.currentTarget.style.background=`${d.color}10`;
                  e.currentTarget.style.borderColor=`${d.color}33`;
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.background="transparent";
                  e.currentTarget.style.borderColor="transparent";
                }}>
                <span style={{fontSize:"18px"}}>{d.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:T.fontDisp,fontWeight:600,fontSize:"12px",color:T.textPri,letterSpacing:"0.5px"}}>{d.label}</div>
                  <div style={{fontFamily:T.fontMono,fontSize:"9px",color:T.textMuted,marginTop:"1px"}}>{d.desc.slice(0,40)}…</div>
                </div>
                <span style={{fontFamily:T.fontMono,fontSize:"11px",color:d.color}}>›</span>
              </div>
            ))}
            <div
              onClick={()=>setCurrentPage("predictors")}
              style={{
                marginTop:"8px",padding:"9px",borderRadius:"6px",
                border:`1px solid ${T.border}`,textAlign:"center",cursor:"pointer",
                fontFamily:T.fontMono,fontSize:"9px",color:T.textMuted,letterSpacing:"1px",
                transition:"all 0.15s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.teal+"55";e.currentTarget.style.color=T.teal;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textMuted;}}>
              VIEW ALL 9 MODULES →
            </div>
          </div>
        </Panel>
      </div>

      {/* All disease cards grid */}
      <Panel>
        <PanelHeader icon="◉" title="All Prediction Modules" badge={`${DISEASES.length} ACTIVE`}/>
        <div style={{padding:"20px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:"10px"}}>
          {DISEASES.map(d=>(
            <DiseaseCard key={d.id} disease={d} selected={false}
              onClick={id=>{ handleDiseaseChange(id); setCurrentPage("predictors"); }}/>
          ))}
        </div>
      </Panel>
    </div>
  );
}
