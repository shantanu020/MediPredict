import { useState } from "react";
import { Panel, PanelHeader, ResultDisplay, GroqPanel, DietPanel, T } from "../components/UIComponents";
import { FORMS } from "../components/FormComponents";

export default function Predictors({
  selectedDisease, activeDisease, loading, apiError, apiStatus,
  result, groqLoading, groqResult, groqError,
  dietLoading, dietResult, dietError,
  handleSubmit, handleDiseaseChange,
}) {
  const FormCmp = FORMS[activeDisease];
  const [rightTab, setRightTab] = useState("result");

  const tabs = [
    { id:"result", label:"ML RESULT" },
    { id:"ai",     label:"AI OPINION" },
    { id:"diet",   label:"DIET PLAN" },
  ];

  const hasResult = !!result;
  const hasAI     = !!groqResult;
  const hasDiet   = !!dietResult;

  return (
    <div style={{display:"flex", flexDirection:"column"}}>

      {/* Main grid */}
      <div style={{
        padding:"40px",
        maxWidth:"1200px",
        margin:"0 auto",
        width:"100%",
        display:"grid",
        gridTemplateColumns:"minmax(340px,1fr) minmax(360px,1fr)",
        gap:"18px",
        alignItems:"stretch",
      }}>

        {/* LEFT: Form */}
        <div style={{display:"flex", flexDirection:"column", gap:"14px"}}>
          <Panel glow accent={selectedDisease.color}>
            <PanelHeader
              icon={selectedDisease.icon}
              title="Patient Input"
              badge={selectedDisease.label.toUpperCase()}
              accent={selectedDisease.color}
              right={
                <span style={{
                  fontFamily:T.fontMono, fontSize:"9px", color:T.textMuted,
                  padding:"3px 7px", borderRadius:"3px",
                  border:`1px solid ${T.border}`,
                }}>{selectedDisease.specialty||"ML MODEL"}</span>
              }
            />
            <div style={{
              padding:"20px",
            }}>
              <FormCmp onSubmit={handleSubmit} loading={loading} color={selectedDisease.color}/>
            </div>

            {apiError && (
              <div style={{
                margin:"0 20px 16px",
                padding:"10px 14px",
                background:T.redDim, border:`1px solid ${T.red}44`,
                borderRadius:"6px",
                fontFamily:T.fontMono, fontSize:"10px", color:T.red,
              }}>
                ERR // {apiError}
                {apiStatus==="offline" && " — START FASTAPI: python api.py"}
              </div>
            )}
          </Panel>
        </div>

        {/* RIGHT: tabbed results */}
        <div style={{display:"flex", flexDirection:"column"}}>
          <Panel style={{flex:1, display:"flex", flexDirection:"column"}}>
            {/* Tab bar */}
            <div style={{
              display:"flex", alignItems:"stretch",
              borderBottom:`1px solid ${T.border}`,
              padding:"0 16px",
            }}>
              {tabs.map(tab=>{
                const active = rightTab===tab.id;
                const dotted = (tab.id==="result"&&hasResult)||(tab.id==="ai"&&hasAI)||(tab.id==="diet"&&hasDiet);
                return (
                  <button key={tab.id} onClick={()=>setRightTab(tab.id)}
                    style={{
                      padding:"12px 14px", border:"none", background:"none",
                      cursor:"pointer", position:"relative",
                      fontFamily:T.fontDisp, fontWeight:600, fontSize:"11px",
                      letterSpacing:"1.5px",
                      color: active ? T.teal : T.textMuted,
                      transition:"color 0.15s",
                      display:"flex", alignItems:"center", gap:"6px",
                    }}>
                    {tab.label}
                    {dotted && (
                      <span style={{
                        width:"5px", height:"5px", borderRadius:"50%",
                        background: tab.id==="diet" ? T.green : T.teal,
                        display:"inline-block",
                        boxShadow:`0 0 5px ${tab.id==="diet"?T.green:T.teal}`,
                      }}/>
                    )}
                    {active && (
                      <span style={{
                        position:"absolute", bottom:0, left:0, right:0, height:"1px",
                        background:`linear-gradient(90deg,transparent,${T.teal},transparent)`,
                      }}/>
                    )}
                  </button>
                );
              })}

              {/* Loading indicators */}
              {(loading || groqLoading || dietLoading) && (
                <div style={{
                  marginLeft:"auto", alignSelf:"center",
                  display:"flex", gap:"3px",
                }}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{
                      width:"5px", height:"5px", borderRadius:"1px",
                      background: loading ? T.teal : groqLoading ? T.teal : T.green,
                      animation:`pulse 1s ${i*0.15}s ease-in-out infinite`,
                    }}/>
                  ))}
                </div>
              )}
            </div>

            {/* Tab content */}
            <div style={{padding:"20px", flex:1}}>
              {rightTab==="result" && (
                <ResultDisplay result={result} disease={selectedDisease}/>
              )}
              {rightTab==="ai" && (
                <GroqPanel loading={groqLoading} result={groqResult} error={groqError}/>
              )}
              {rightTab==="diet" && (
                <DietPanel loading={dietLoading} result={dietResult} error={dietError}/>
              )}
            </div>
          </Panel>
        </div>
      </div>


    </div>
  );
}
