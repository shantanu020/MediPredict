import { useState, useRef } from "react";

// ─── DESIGN TOKENS — reads from CSS variables set by App.js theme effect ──────
export const T = {
  get bg()        { return "var(--mp-bg,#050C0F)"; },
  get bg1()       { return "var(--mp-bg1,#081218)"; },
  get bg2()       { return "var(--mp-bg2,#0C1A22)"; },
  get bg3()       { return "var(--mp-bg3,#102030)"; },
  get teal()      { return "var(--mp-teal,#00C8A0)"; },
  get textPri()   { return "var(--mp-textPri,#D0EEE8)"; },
  get textSec()   { return "var(--mp-textSec,rgba(180,220,210,0.6))"; },
  get textMuted() { return "var(--mp-textMuted,rgba(140,190,180,0.35))"; },
  border:    "rgba(0,200,160,0.12)",
  borderHi:  "rgba(0,200,160,0.35)",
  amber:     "#F0A500",
  amberDim:  "rgba(240,165,0,0.15)",
  red:       "#FF4560",
  redDim:    "rgba(255,69,96,0.15)",
  green:     "#00E396",
  greenDim:  "rgba(0,227,150,0.15)",
  fontMono:  "'JetBrains Mono', 'Fira Code', monospace",
  fontDisp:  "'Rajdhani', sans-serif",
  fontBody:  "'DM Sans', sans-serif",
};

// ── Global styles injected once ───────────────────────────────────────────────
export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    :root {
      --mp-bg:        #050C0F;
      --mp-bg1:       #081218;
      --mp-bg2:       #0C1A22;
      --mp-bg3:       #102030;
      --mp-teal:      #00C8A0;
      --mp-textPri:   #D0EEE8;
      --mp-textSec:   rgba(180,220,210,0.6);
      --mp-textMuted: rgba(140,190,180,0.35);
    }
    html, body, #root { height: 100%; }
    body {
      background: var(--mp-bg);
      color: var(--mp-textPri);
      font-family: ${T.fontBody};
      -webkit-font-smoothing: antialiased;
      transition: background 0.3s ease, color 0.3s ease;
    }
    ::selection { background: rgba(0,200,160,0.3); color: #fff; }
    ::-webkit-scrollbar { width: 3px; height: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(0,200,160,0.25); border-radius: 2px; }
    input[type=number]::-webkit-inner-spin-button { opacity: 0.2; }
    option { background: #0C1A22; color: var(--mp-textPri); }

    @keyframes scanline {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(10px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes pulse {
      0%,100% { opacity:0.4; transform:scale(0.85); }
      50%     { opacity:1;   transform:scale(1.15); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes barFill {
      from { width: 0%; }
    }
  `}</style>
);

// ── Background: hex-grid + scanline + ambient glow ────────────────────────────
export function Background() {
  return (
    <>
      <div style={{
        position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        background:`
          radial-gradient(ellipse 60% 50% at 15% 20%, rgba(0,180,140,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 40% 60% at 85% 75%, rgba(0,120,100,0.05) 0%, transparent 70%)
        `,
        transition: "background 0.3s ease",
      }}/>
      <div style={{
        position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:0.06,
        backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 2 L58 17 L58 35 L30 50 L2 35 L2 17 Z' fill='none' stroke='%2300C8A0' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize:"60px 52px",
      }}/>
      <div style={{
        position:"fixed", left:0, right:0, height:"2px", zIndex:0, pointerEvents:"none",
        background:"linear-gradient(90deg, transparent, rgba(0,200,160,0.15), transparent)",
        animation:"scanline 8s linear infinite",
      }}/>
    </>
  );
}

// ── Panel: glassmorphic card with teal border ─────────────────────────────────
export function Panel({ children, style={}, glow=false, accent=T.teal }) {
  return (
    <div style={{
      background: T.bg2,
      border:`1px solid ${glow ? accent+"55" : T.border}`,
      borderRadius:"12px",
      boxShadow: glow ? `0 0 30px ${accent}18, inset 0 1px 0 ${accent}22` : `inset 0 1px 0 rgba(255,255,255,0.04)`,
      position:"relative", overflow:"hidden",
      ...style,
    }}>
      {/* Top accent line */}
      {glow && <div style={{
        position:"absolute", top:0, left:0, right:0, height:"1px",
        background:`linear-gradient(90deg, transparent, ${accent}88, transparent)`,
      }}/>}
      {children}
    </div>
  );
}

// ── PanelHeader ───────────────────────────────────────────────────────────────
export function PanelHeader({ icon, title, badge, right, accent=T.teal }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:"10px",
      padding:"14px 20px", borderBottom:`1px solid ${T.border}`,
    }}>
      {icon && <span style={{ fontSize:"14px" }}>{icon}</span>}
      <span style={{
        fontFamily:T.fontDisp, fontWeight:700, fontSize:"13px",
        color:T.textPri, letterSpacing:"1.5px", textTransform:"uppercase",
      }}>{title}</span>
      {badge && (
        <span style={{
          fontSize:"9px", fontFamily:T.fontMono, fontWeight:500,
          padding:"2px 7px", borderRadius:"3px",
          background:`${accent}20`, color:accent,
          border:`1px solid ${accent}40`, letterSpacing:"0.5px",
        }}>{badge}</span>
      )}
      {right && <div style={{marginLeft:"auto"}}>{right}</div>}
    </div>
  );
}

// ── StatusDot ─────────────────────────────────────────────────────────────────
export function StatusDot({ status }) {
  const c = status==="online" ? T.green : status==="offline" ? T.red : T.amber;
  return (
    <span style={{
      display:"inline-block", width:"7px", height:"7px", borderRadius:"50%",
      background:c, boxShadow:`0 0 6px ${c}`, flexShrink:0,
    }}/>
  );
}

// ── Particles (hex shards) ────────────────────────────────────────────────────
export function Particles() {
  const pts = useRef([...Array(16)].map(() => ({
    w: Math.random()*2+1, l:Math.random()*100, t:Math.random()*100,
    dur:Math.random()*12+10, del:Math.random()*12, op:Math.random()*0.2+0.05,
  }))).current;
  return (
    <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      {pts.map((p,i)=>(
        <div key={i} style={{
          position:"absolute", width:p.w+"px", height:p.w+"px",
          borderRadius:"2px", transform:"rotate(45deg)",
          background:`rgba(0,200,160,${p.op})`,
          left:p.l+"%", top:p.t+"%",
          animation:`scanline ${p.dur}s ease-in-out ${p.del}s infinite`,
        }}/>
      ))}
    </div>
  );
}

// ── DiseaseCard ───────────────────────────────────────────────────────────────
export function DiseaseCard({ disease, selected, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={()=>onClick(disease.id)}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: selected
          ? `linear-gradient(135deg, ${disease.color}18, ${disease.color}08)`
          : hov ? "rgba(0,200,160,0.06)" : T.bg2,
        border:`1px solid ${selected ? disease.color+"66" : hov ? T.borderHi : T.border}`,
        borderRadius:"10px", padding:"16px", cursor:"pointer",
        transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)",
        transform: selected ? "translateY(-2px)" : hov ? "translateY(-1px)" : "none",
        boxShadow: selected ? `0 6px 24px ${disease.color}22` : "none",
        position:"relative", overflow:"hidden",
      }}>
      {selected && <div style={{
        position:"absolute", top:0, left:0, right:0, height:"1px",
        background:`linear-gradient(90deg,transparent,${disease.color},transparent)`,
      }}/>}
      <div style={{fontSize:"24px", marginBottom:"8px"}}>{disease.icon}</div>
      <div style={{
        fontFamily:T.fontDisp, fontWeight:700, fontSize:"13px",
        letterSpacing:"0.8px", textTransform:"uppercase",
        color: selected ? disease.color : hov ? T.textPri : T.textSec,
        marginBottom:"4px",
      }}>{disease.label}</div>
      <div style={{fontSize:"10px", color:T.textMuted, lineHeight:1.5}}>{disease.desc}</div>
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────
export function Field({ label, type="number", value, onChange, min, max, step, options, span2 }) {
  const [foc, setFoc] = useState(false);
  const base = {
    width:"100%", padding:"9px 12px",
    background: foc ? "rgba(0,200,160,0.06)" : T.bg3,
    border:`1px solid ${foc ? T.teal+"88" : T.border}`,
    borderRadius:"6px", color:T.textPri, fontSize:"13px",
    fontFamily:T.fontMono, outline:"none",
    transition:"all 0.15s", boxSizing:"border-box",
    boxShadow: foc ? `0 0 0 2px ${T.teal}15` : "none",
  };
  return (
    <div style={{marginBottom:"10px", gridColumn:span2?"1/-1":undefined}}>
      <label style={{
        display:"block", fontSize:"9px", fontFamily:T.fontMono,
        color: foc ? T.teal : T.textMuted,
        marginBottom:"4px", letterSpacing:"1.2px", textTransform:"uppercase",
        transition:"color 0.15s",
      }}>{label}</label>
      {type==="select" ? (
        <select value={value} onChange={e=>onChange(e.target.value)}
          onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
          style={{...base, cursor:"pointer"}}>
          {options.map(o=>(
            <option key={o.value??o} value={o.value??o} style={{background:T.bg1}}>{o.label??o}</option>
          ))}
        </select>
      ) : (
        <input type={type} value={value}
          onChange={e=>onChange(type==="number"?(parseFloat(e.target.value)||0):e.target.value)}
          min={min} max={max} step={step}
          onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
          style={base}/>
      )}
    </div>
  );
}

// ── PredictButton ─────────────────────────────────────────────────────────────
export function PredictButton({ onClick, disabled, loading, label="Run Prediction", color=T.teal }) {
  const [hov, setHov] = useState(false);
  const off = disabled || loading;
  return (
    <button onClick={onClick} disabled={off}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        width:"100%", padding:"13px 20px", marginTop:"12px",
        background: off ? "rgba(255,255,255,0.04)"
          : hov ? `${color}` : `${color}cc`,
        border:`1px solid ${off ? T.border : color}`,
        borderRadius:"6px",
        color: off ? T.textMuted : T.bg,
        fontSize:"12px", fontWeight:700, fontFamily:T.fontDisp,
        letterSpacing:"2px", textTransform:"uppercase",
        cursor: off ? "not-allowed" : "pointer",
        transition:"all 0.15s",
        boxShadow: hov && !off ? `0 0 20px ${color}44, 0 4px 12px ${color}33` : "none",
        transform: hov && !off ? "translateY(-1px)" : "none",
        display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
      }}>
      {loading
        ? <>
            <svg width="13" height="13" viewBox="0 0 24 24" style={{animation:"spin 0.8s linear infinite"}}>
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10"/>
            </svg>
            ANALYSING
          </>
        : <>
            <span style={{fontSize:"10px", opacity:0.7}}>▶</span>
            {label}
          </>
      }
    </button>
  );
}

// ── ResultDisplay ─────────────────────────────────────────────────────────────
export function ResultDisplay({ result, disease }) {
  if (!result) return (
    <div style={{padding:"40px 24px", textAlign:"center"}}>
      <div style={{
        fontSize:"48px", marginBottom:"16px", opacity:0.15,
        filter:"grayscale(100%)",
      }}>{disease.icon}</div>
      <div style={{fontFamily:T.fontMono, fontSize:"11px", color:T.textMuted, letterSpacing:"1px"}}>
        — AWAITING INPUT —
      </div>
    </div>
  );

  // Symptom checker
  if (result.disease) {
    const pct = Math.round((result.probability??0)*100);
    return (
      <div style={{animation:"fadeUp 0.35s ease-out"}}>
        {/* Main result */}
        <div style={{
          padding:"20px", marginBottom:"14px",
          background:`linear-gradient(135deg, rgba(0,200,160,0.1), rgba(0,200,160,0.04))`,
          border:`1px solid ${T.teal}44`,
          borderRadius:"10px", position:"relative", overflow:"hidden",
        }}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:`linear-gradient(90deg,transparent,${T.teal},transparent)`}}/>
          <div style={{fontFamily:T.fontMono,fontSize:"9px",color:T.teal,letterSpacing:"2px",marginBottom:"8px"}}>
            PREDICTED CONDITION
          </div>
          <div style={{fontFamily:T.fontDisp,fontWeight:700,fontSize:"26px",color:T.textPri,marginBottom:"4px",letterSpacing:"0.5px"}}>
            {result.disease}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"12px",marginTop:"12px"}}>
            <div style={{flex:1,height:"3px",background:"rgba(255,255,255,0.08)",borderRadius:"2px",overflow:"hidden"}}>
              <div style={{
                height:"100%", width:`${pct}%`, borderRadius:"2px",
                background:`linear-gradient(90deg,${T.teal},${T.teal}aa)`,
                animation:"barFill 0.8s ease-out",
              }}/>
            </div>
            <div style={{fontFamily:T.fontMono,fontSize:"16px",fontWeight:500,color:T.teal,minWidth:"44px",textAlign:"right"}}>
              {pct}<span style={{fontSize:"10px",opacity:0.6}}>%</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {result.description && (
          <div style={{
            padding:"12px 14px", marginBottom:"10px",
            background:T.bg3, borderRadius:"8px",
            borderLeft:`2px solid ${T.teal}44`,
            fontSize:"12px", color:T.textSec, lineHeight:1.65,
          }}>{result.description}</div>
        )}

        {/* Precautions */}
        {result.precautions?.filter(Boolean).length > 0 && (
          <div style={{marginBottom:"10px"}}>
            <div style={{fontFamily:T.fontMono,fontSize:"9px",color:T.textMuted,letterSpacing:"1.5px",marginBottom:"8px"}}>
              PRECAUTIONS
            </div>
            {result.precautions.filter(Boolean).map((p,i)=>(
              <div key={i} style={{
                display:"flex", gap:"10px", alignItems:"flex-start",
                padding:"8px 12px", marginBottom:"5px",
                background:T.bg3, borderRadius:"6px",
                fontSize:"12px", color:T.textSec,
              }}>
                <span style={{
                  fontFamily:T.fontMono, fontSize:"9px", color:T.teal,
                  background:`${T.teal}18`, border:`1px solid ${T.teal}30`,
                  borderRadius:"3px", padding:"2px 5px", flexShrink:0, marginTop:"1px",
                }}>0{i+1}</span>
                {p}
              </div>
            ))}
          </div>
        )}

        {/* Differential */}
        {result.alternatives?.length > 0 && (
          <div style={{marginBottom:"10px"}}>
            <div style={{fontFamily:T.fontMono,fontSize:"9px",color:T.textMuted,letterSpacing:"1.5px",marginBottom:"8px"}}>
              DIFFERENTIAL DIAGNOSIS
            </div>
            {result.alternatives.map((a,i)=>{
              const ap = Math.round(a.probability*100);
              return (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:"10px",
                  padding:"7px 12px", marginBottom:"4px",
                  background:T.bg3, borderRadius:"6px",
                }}>
                  <span style={{fontSize:"12px",color:T.textSec,flex:1}}>{a.disease}</span>
                  <div style={{width:"60px",height:"2px",background:"rgba(255,255,255,0.06)",borderRadius:"1px"}}>
                    <div style={{height:"100%",width:`${ap}%`,background:T.teal+"66",borderRadius:"1px"}}/>
                  </div>
                  <span style={{fontFamily:T.fontMono,fontSize:"10px",color:T.textMuted,minWidth:"30px",textAlign:"right"}}>{ap}%</span>
                </div>
              );
            })}
          </div>
        )}

        <Disclaimer/>
      </div>
    );
  }

  // Binary result
  const isPos = result.positive;
  const pct = Math.round((result.confidence??result.probability??0)*100);
  const c = isPos ? T.red : T.green;
  return (
    <div style={{animation:"fadeUp 0.35s ease-out"}}>
      <div style={{
        padding:"20px", marginBottom:"14px",
        background:`linear-gradient(135deg,${c}12,${c}06)`,
        border:`1px solid ${c}44`, borderRadius:"10px",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:`linear-gradient(90deg,transparent,${c},transparent)`}}/>
        <div style={{display:"flex",alignItems:"flex-start",gap:"14px"}}>
          <div style={{
            width:"44px",height:"44px",borderRadius:"8px",flexShrink:0,
            background:`${c}18`, border:`1px solid ${c}33`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"20px",
          }}>{isPos?"⚠":"✓"}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:T.fontMono,fontSize:"9px",color:c,letterSpacing:"2px",marginBottom:"4px"}}>
              {isPos?"POSITIVE DETECTION":"NEGATIVE — CLEAR"}
            </div>
            <div style={{fontFamily:T.fontDisp,fontWeight:700,fontSize:"22px",color:T.textPri,letterSpacing:"0.3px"}}>
              {result.label}
            </div>
          </div>
          <div style={{
            padding:"4px 10px", borderRadius:"4px", flexShrink:0,
            background:`${c}20`, border:`1px solid ${c}44`,
            fontFamily:T.fontMono, fontSize:"10px", color:c, fontWeight:500,
          }}>{isPos?"POS":"NEG"}</div>
        </div>
        <div style={{marginTop:"14px",display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{flex:1,height:"3px",background:"rgba(255,255,255,0.08)",borderRadius:"2px",overflow:"hidden"}}>
            <div style={{
              height:"100%",width:`${pct}%`,borderRadius:"2px",
              background:`linear-gradient(90deg,${c},${c}88)`,
              animation:"barFill 0.8s ease-out",
            }}/>
          </div>
          <span style={{fontFamily:T.fontMono,fontSize:"14px",color:c,minWidth:"44px",textAlign:"right"}}>
            {pct}<span style={{fontSize:"9px",opacity:0.6}}>%</span>
          </span>
        </div>
      </div>

      {result.summary && (
        <div style={{
          padding:"10px 14px", marginBottom:"10px",
          background:T.bg3, borderRadius:"6px",
          borderLeft:`2px solid ${c}44`,
          fontSize:"12px", color:T.textSec, fontFamily:T.fontMono,
        }}>{result.summary}</div>
      )}
      <Disclaimer/>
    </div>
  );
}

function Disclaimer() {
  return (
    <div style={{
      display:"flex",gap:"8px",alignItems:"flex-start",
      padding:"10px 12px", borderRadius:"6px",
      background:"rgba(240,165,0,0.06)",
      border:"1px solid rgba(240,165,0,0.2)",
    }}>
      <span style={{fontSize:"11px",flexShrink:0,marginTop:"1px"}}>⚠</span>
      <p style={{fontSize:"10px",fontFamily:T.fontMono,color:"rgba(240,165,0,0.7)",lineHeight:1.55,margin:0}}>
        EDUCATIONAL USE ONLY — Not a substitute for professional medical diagnosis or advice.
      </p>
    </div>
  );
}

// ── AiPanel (shared by Groq + Diet) ──────────────────────────────────────────
function AiPanel({ loading, result, error, emptyIcon, emptyText, loadingText, dotColor }) {
  if (error) return (
    <div style={{
      margin:"4px",padding:"12px 14px",
      background:T.redDim,border:`1px solid ${T.red}44`,
      borderRadius:"6px",fontSize:"12px",fontFamily:T.fontMono,color:T.red,
    }}>ERR // {error}</div>
  );
  if (loading) return (
    <div style={{padding:"28px 24px",textAlign:"center"}}>
      <div style={{display:"inline-flex",gap:"5px",alignItems:"center",marginBottom:"10px"}}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{
            width:"6px",height:"6px",borderRadius:"1px",
            background:dotColor,
            animation:`pulse 1.2s ease-in-out ${i*0.15}s infinite`,
          }}/>
        ))}
      </div>
      <div style={{fontFamily:T.fontMono,fontSize:"10px",color:T.textMuted,letterSpacing:"1px"}}>
        {loadingText}
      </div>
    </div>
  );
  if (!result) return (
    <div style={{padding:"28px 24px",textAlign:"center"}}>
      <div style={{fontFamily:T.fontMono,fontSize:"10px",color:T.textMuted,letterSpacing:"1px"}}>
        — AWAITING PREDICTION —
      </div>
    </div>
  );

  const text = result?.analysis || result || "";
  return (
    <div style={{fontSize:"12px",lineHeight:1.7,animation:"fadeUp 0.3s ease-out"}}>
      {text.split("\n").map((line,i)=>{
        if(!line.trim()) return <div key={i} style={{height:"6px"}}/>;
        const clean = line.replace(/\*\*/g,"").replace(/^#+\s*/,"");

        if((line.startsWith("**")&&line.endsWith("**"))||line.match(/^#{1,3}\s/)||line.match(/^\d\.\s[A-Z]/)) return (
          <div key={i} style={{
            fontFamily:T.fontDisp,fontWeight:700,fontSize:"11px",
            letterSpacing:"1.5px",textTransform:"uppercase",
            color:dotColor, marginTop:"16px",marginBottom:"6px",
            paddingBottom:"5px",borderBottom:`1px solid ${dotColor}25`,
          }}>{clean.replace(/^\d\.\s/,"")}</div>
        );
        if(line.startsWith("- ")||line.startsWith("• ")) return (
          <div key={i} style={{
            display:"flex",gap:"8px",alignItems:"flex-start",
            marginBottom:"5px",paddingLeft:"4px",
          }}>
            <span style={{color:dotColor,flexShrink:0,marginTop:"5px",fontSize:"4px"}}>◆</span>
            <span style={{color:T.textSec}}>{clean.replace(/^[-•]\s/,"")}</span>
          </div>
        );
        if(line.match(/^\d\./)) return (
          <div key={i} style={{color:T.textSec,marginBottom:"4px"}}>{line}</div>
        );
        if(line.toLowerCase().includes("not a substitute")||line.toLowerCase().includes("medical advice")||line.startsWith("⚠")) return (
          <div key={i} style={{
            marginTop:"12px",padding:"8px 12px",
            background:"rgba(240,165,0,0.07)",border:"1px solid rgba(240,165,0,0.2)",
            borderRadius:"5px",fontSize:"10px",fontFamily:T.fontMono,
            color:"rgba(240,165,0,0.75)",lineHeight:1.5,
          }}>⚠ {clean.replace(/^⚠\s*/,"")}</div>
        );
        return <p key={i} style={{color:T.textSec,marginBottom:"4px"}}>{clean}</p>;
      })}
    </div>
  );
}

export function GroqPanel(props) {
  return <AiPanel {...props}
    emptyIcon="◈" emptyText="AI SECOND OPINION WILL APPEAR HERE AFTER PREDICTION"
    loadingText="GROQ LLM // GENERATING ANALYSIS…" dotColor={T.teal}
  />;
}

export function DietPanel(props) {
  return <AiPanel {...props}
    emptyIcon="✦" emptyText="DIET RECOMMENDATIONS WILL APPEAR HERE AFTER PREDICTION"
    loadingText="GROQ LLM // GENERATING DIET PLAN…" dotColor={T.green}
  />;
}
