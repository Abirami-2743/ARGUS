'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function AboutPage(){
  return(
    <div style={{background:'#F8FAFF',minHeight:'100vh'}}>
      <Navbar/>
      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#0D1B3E,#0A2444)',padding:'80px 48px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-100px',left:'50%',transform:'translateX(-50%)',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,212,170,0.08) 0%,transparent 70%)'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{width:'72px',height:'72px',borderRadius:'20px',background:'linear-gradient(135deg,#00D4AA,#00A882)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'36px',fontWeight:900,color:'#0D1B3E',margin:'0 auto 24px',boxShadow:'0 8px 32px rgba(0,212,170,0.4)'}}>A</div>
          <p style={{fontSize:'13px',color:'#00D4AA',fontWeight:600,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'12px'}}>About ARGUS</p>
          <h1 style={{fontSize:'48px',fontWeight:900,color:'#fff',letterSpacing:'-2px',marginBottom:'16px'}}>Built to win. Built to protect.</h1>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.6)',maxWidth:'600px',margin:'0 auto',lineHeight:1.7}}>
            ARGUS is an AI safety monitoring system built for the Google Cloud Rapid Agent Hackathon 2026. 
            The problem for AI agents — solved by an AI agent.
          </p>
        </div>
      </div>
      <svg viewBox="0 0 1440 60" style={{display:'block',marginTop:'-2px'}}><path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60Z" fill="#F8FAFF"/></svg>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'40px 48px'}}>

        {/* Story */}
        <div style={{background:'#fff',borderRadius:'20px',padding:'40px',border:'1px solid #E8EDF5',boxShadow:'0 4px 20px rgba(13,27,62,0.08)',marginBottom:'32px'}}>
          <h2 style={{fontSize:'24px',fontWeight:800,color:'#0D1B3E',marginBottom:'16px'}}>The Story</h2>
          <p style={{fontSize:'16px',color:'#4A5568',lineHeight:1.8,marginBottom:'16px'}}>
            As AI agents proliferate across enterprises, a critical blind spot emerges: <strong style={{color:'#0D1B3E'}}>who watches the agents?</strong> 
            They can be hijacked via prompt injection, communicate secretly with each other, or produce dangerous outputs — all without any human noticing.
          </p>
          <p style={{fontSize:'16px',color:'#4A5568',lineHeight:1.8}}>
            ARGUS solves this with an AI agent that monitors other AI agents in real time — using Google ADK, Gemini 3.5 Flash, and Arize Phoenix to detect threats, 
            run evaluations, and <strong style={{color:'#0D1B3E'}}>continuously improve its own detection rules</strong> from observability data.
          </p>
        </div>

        {/* Tech stack */}
        <h2 style={{fontSize:'22px',fontWeight:800,color:'#0D1B3E',marginBottom:'20px'}}>Tech Stack</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'32px'}}>
          {[
            {name:'Google ADK',desc:'Agent runtime for all 16 agents including ARGUS monitor',color:'#4285F4',icon:'🤖'},
            {name:'Gemini 3.5 Flash',desc:'LLM powering every agent — fast, capable, agentic',color:'#34A853',icon:'✨'},
            {name:'Arize Phoenix',desc:'Observability platform — traces, spans, evaluations',color:'#FF6B35',icon:'📡'},
            {name:'Phoenix MCP',desc:'ARGUS reads its own traces to self-improve detection',color:'#FF6B35',icon:'🔄'},
            {name:'FastAPI',desc:'Backend API serving all 15 agents + ARGUS endpoints',color:'#00D4AA',icon:'⚡'},
            {name:'Next.js + Tailwind',desc:'Frontend dashboard with real-time threat monitoring',color:'#000',icon:'🎨'},
            {name:'Google Cloud Run',desc:'Serverless hosting for the FastAPI backend',color:'#4285F4',icon:'☁️'},
            {name:'OpenInference',desc:'Instrumentation standard for tracing agent actions',color:'#9C27B0',icon:'🔍'},
            {name:'LLM-as-a-Judge',desc:'ARGUS evaluates every agent response for quality',color:'#FF4444',icon:'⚖️'},
          ].map((t,i)=>(
            <div key={i} style={{padding:'20px',background:'#fff',border:'1px solid #E8EDF5',borderRadius:'14px',boxShadow:'0 2px 8px rgba(13,27,62,0.06)',display:'flex',gap:'14px',alignItems:'flex-start',animation:`fadeUp 0.4s ease ${i*0.05}s both`}}>
              <div style={{width:'40px',height:'40px',borderRadius:'10px',background:t.color+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0}}>{t.icon}</div>
              <div>
                <h3 style={{fontSize:'14px',fontWeight:700,color:'#0D1B3E',marginBottom:'4px'}}>{t.name}</h3>
                <p style={{fontSize:'12px',color:'#4A5568',lineHeight:1.5}}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Architecture */}
        <div style={{background:'linear-gradient(135deg,#0D1B3E,#0A2444)',borderRadius:'20px',padding:'40px',marginBottom:'32px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'-60px',right:'-60px',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,212,170,0.1) 0%,transparent 70%)'}}/>
          <h2 style={{fontSize:'22px',fontWeight:800,color:'#fff',marginBottom:'8px'}}>How the self-improvement loop works</h2>
          <p style={{fontSize:'14px',color:'rgba(255,255,255,0.6)',marginBottom:'32px'}}>ARGUS gets smarter with every interaction</p>
          <div style={{display:'flex',alignItems:'center',gap:'0',overflowX:'auto',paddingBottom:'8px'}}>
            {[
              {step:'1',label:'15 Agents Run',desc:'Process real queries across 5 industries',color:'#4285F4'},
              {step:'2',label:'Traces Captured',desc:'OpenInference sends spans to Phoenix',color:'#00D4AA'},
              {step:'3',label:'ARGUS Reads MCP',desc:'Queries its own traces via Phoenix MCP',color:'#FF6B35'},
              {step:'4',label:'LLM Judge',desc:'Evaluates quality of every response',color:'#FFB347'},
              {step:'5',label:'Rules Updated',desc:'Detection improves autonomously',color:'#00D4AA'},
            ].map((s,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',flexShrink:0}}>
                <div style={{padding:'16px 20px',background:'rgba(255,255,255,0.06)',border:`1px solid ${s.color}30`,borderRadius:'12px',minWidth:'140px',textAlign:'center'}}>
                  <div style={{width:'32px',height:'32px',borderRadius:'50%',background:s.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:800,color:'#0D1B3E',margin:'0 auto 8px'}}>{s.step}</div>
                  <p style={{fontSize:'13px',fontWeight:700,color:'#fff',marginBottom:'4px'}}>{s.label}</p>
                  <p style={{fontSize:'11px',color:'rgba(255,255,255,0.5)',lineHeight:1.4}}>{s.desc}</p>
                </div>
                {i<4&&<div style={{width:'32px',height:'2px',background:'rgba(255,255,255,0.15)',flexShrink:0}}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Builder */}
        <div style={{background:'#fff',borderRadius:'20px',padding:'32px',border:'1px solid #E8EDF5',boxShadow:'0 4px 20px rgba(13,27,62,0.08)',marginBottom:'32px',display:'flex',gap:'24px',alignItems:'center'}}>
          <div style={{width:'72px',height:'72px',borderRadius:'20px',background:'linear-gradient(135deg,#00D4AA,#4285F4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',fontWeight:900,color:'#fff',flexShrink:0}}>A</div>
          <div>
            <h3 style={{fontSize:'18px',fontWeight:700,color:'#0D1B3E',marginBottom:'4px'}}>Abirami Nayagi S</h3>
            <p style={{fontSize:'14px',color:'#4A5568',marginBottom:'8px'}}>2nd Year CSE · Sri Shakthi Institute of Engineering and Technology, Coimbatore</p>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              {['Meta x Scaler Grand Finalist','WattWise — Scopus Published','Bug Triage RL — OpenEnv','SkillScan AI','MarketPulse'].map(b=>(
                <span key={b} style={{padding:'3px 10px',borderRadius:'20px',background:'#F0F4FF',border:'1px solid #E8EDF5',fontSize:'12px',color:'#4A5568',fontWeight:500}}>{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{display:'flex',gap:'16px',justifyContent:'center',paddingBottom:'40px'}}>
          <Link href="/dashboard" style={{padding:'14px 28px',borderRadius:'12px',background:'linear-gradient(135deg,#00D4AA,#00B894)',color:'#0D1B3E',fontSize:'15px',fontWeight:700,boxShadow:'0 4px 16px rgba(0,212,170,0.3)'}}>Open Dashboard →</Link>
          <a href="https://github.com/Abirami-2743/ARGUS" target="_blank" rel="noreferrer" style={{padding:'14px 28px',borderRadius:'12px',background:'#0D1B3E',color:'#fff',fontSize:'15px',fontWeight:700}}>View on GitHub →</a>
          <Link href="/agents" style={{padding:'14px 28px',borderRadius:'12px',background:'#fff',color:'#0D1B3E',fontSize:'15px',fontWeight:700,border:'1px solid #E8EDF5',boxShadow:'0 2px 8px rgba(13,27,62,0.06)'}}>Try Agents →</Link>
        </div>
      </div>
    </div>
  )
}
