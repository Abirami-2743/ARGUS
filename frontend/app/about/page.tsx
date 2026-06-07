'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const ArgusLogo=({size=36}:{size?:number})=>(
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradAbout" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00D4AA"/>
        <stop offset="1" stopColor="#0080FF"/>
      </linearGradient>
      <clipPath id="squareClipAbout">
        <rect width="40" height="40" rx="10"/>
      </clipPath>
    </defs>
    <rect width="40" height="40" rx="10" fill="#0A1628"/>
    <g clipPath="url(#squareClipAbout)">
      <circle cx="20" cy="20" r="14" stroke="#00D4AA" strokeWidth="1.2" strokeOpacity="0.4" fill="none"/>
      <circle cx="20" cy="20" r="9" stroke="#00D4AA" strokeWidth="1.2" strokeOpacity="0.65" fill="none"/>
      <circle cx="20" cy="20" r="4.5" stroke="#00D4AA" strokeWidth="1.4" fill="none"/>
      <circle cx="20" cy="20" r="2" fill="url(#bgGradAbout)"/>
      <line x1="20" y1="4" x2="20" y2="12" stroke="#00D4AA" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="20" y1="28" x2="20" y2="36" stroke="#00D4AA" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="4" y1="20" x2="12" y2="20" stroke="#00D4AA" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="28" y1="20" x2="36" y2="20" stroke="#00D4AA" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M20 20 L31 12 A14 14 0 0 1 34 20 Z" fill="url(#bgGradAbout)" fillOpacity="0.18"/>
      <circle cx="29" cy="14" r="1.5" fill="#00D4AA" fillOpacity="0.9"/>
    </g>
  </svg>
)

export default function AboutPage(){
  return(
    <div style={{background:'#F8FAFF',minHeight:'100vh'}}>
      <Navbar/>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.05)}}
        @keyframes rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .card-hover:hover{transform:translateY(-4px)!important;box-shadow:0 12px 40px rgba(13,27,62,0.15)!important}
      `}</style>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#0D1B3E,#0A2444)',padding:'100px 48px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        {/* Animated background rings */}
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'600px',height:'600px',borderRadius:'50%',border:'1px solid rgba(0,212,170,0.08)',animation:'pulse 4s ease infinite'}}/>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'400px',height:'400px',borderRadius:'50%',border:'1px solid rgba(0,212,170,0.12)',animation:'pulse 3s ease infinite 0.5s'}}/>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'200px',height:'200px',borderRadius:'50%',border:'1px solid rgba(0,212,170,0.2)',animation:'pulse 2s ease infinite 1s'}}/>
        <div style={{position:'absolute',top:'-100px',right:'10%',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(66,133,244,0.1) 0%,transparent 70%)'}}/>
        <div style={{position:'absolute',bottom:'-100px',left:'10%',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,212,170,0.1) 0%,transparent 70%)'}}/>

        <div style={{position:'relative',zIndex:1,animation:'fadeUp 0.6s ease'}}>
          {/* Proper logo */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'16px',marginBottom:'32px',animation:'float 3s ease infinite'}}>
            <ArgusLogo size={72}/>
          </div>
          <p style={{fontSize:'13px',color:'#00D4AA',fontWeight:600,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'16px'}}>About ARGUS</p>
          <h1 style={{fontSize:'56px',fontWeight:900,color:'#fff',letterSpacing:'-2px',marginBottom:'20px',lineHeight:1.1}}>Built to win.<br/><span style={{background:'linear-gradient(90deg,#00D4AA,#4285F4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Built to protect.</span></h1>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.6)',maxWidth:'600px',margin:'0 auto',lineHeight:1.8}}>
            ARGUS is an AI safety monitoring system built for the Google Cloud Rapid Agent Hackathon 2026.
            The problem for AI agents — solved by an AI agent.
          </p>
        </div>
      </div>
      <svg viewBox="0 0 1440 60" style={{display:'block',marginTop:'-2px'}}><path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60Z" fill="#F8FAFF"/></svg>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'40px 48px'}}>

        {/* Story */}
        <div className="card-hover" style={{background:'#fff',borderRadius:'20px',padding:'40px',border:'1px solid #E8EDF5',boxShadow:'0 4px 20px rgba(13,27,62,0.08)',marginBottom:'32px',transition:'all 0.2s',animation:'fadeUp 0.5s ease 0.1s both'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'12px',background:'linear-gradient(135deg,#00D4AA,#4285F4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>📖</div>
            <h2 style={{fontSize:'24px',fontWeight:800,color:'#0D1B3E'}}>The Story</h2>
          </div>
          <p style={{fontSize:'16px',color:'#4A5568',lineHeight:1.9,marginBottom:'16px'}}>
            As AI agents proliferate across enterprises, a critical blind spot emerges: <strong style={{color:'#0D1B3E'}}>who watches the agents?</strong>
            They can be hijacked via prompt injection, communicate secretly with each other, or produce dangerous outputs — all without any human noticing.
          </p>
          <p style={{fontSize:'16px',color:'#4A5568',lineHeight:1.9}}>
            ARGUS solves this with an AI agent that monitors other AI agents in real time — using Google ADK, Gemini 3.5 Flash, and Arize Phoenix to detect threats,
            run evaluations, and <strong style={{color:'#0D1B3E'}}>continuously improve its own detection rules</strong> from observability data.
          </p>
        </div>

        {/* Tech stack */}
        <div style={{animation:'fadeUp 0.5s ease 0.2s both'}}>
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
              <div key={i} className="card-hover" style={{padding:'20px',background:'#fff',border:'1px solid #E8EDF5',borderRadius:'14px',boxShadow:'0 2px 8px rgba(13,27,62,0.06)',display:'flex',gap:'14px',alignItems:'flex-start',transition:'all 0.2s',animation:`fadeUp 0.4s ease ${0.3+i*0.05}s both`,cursor:'default'}}>
                <div style={{width:'44px',height:'44px',borderRadius:'12px',background:`linear-gradient(135deg,${t.color}20,${t.color}10)`,border:`1px solid ${t.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',flexShrink:0}}>{t.icon}</div>
                <div>
                  <h3 style={{fontSize:'14px',fontWeight:700,color:'#0D1B3E',marginBottom:'4px'}}>{t.name}</h3>
                  <p style={{fontSize:'12px',color:'#4A5568',lineHeight:1.6}}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Self-improvement loop */}
        <div style={{background:'linear-gradient(135deg,#0D1B3E,#0A2444)',borderRadius:'20px',padding:'40px',marginBottom:'32px',position:'relative',overflow:'hidden',animation:'fadeUp 0.5s ease 0.4s both'}}>
          <div style={{position:'absolute',top:'-60px',right:'-60px',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,212,170,0.1) 0%,transparent 70%)'}}/>
          <div style={{position:'absolute',bottom:'-40px',left:'-40px',width:'200px',height:'200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(66,133,244,0.1) 0%,transparent 70%)'}}/>
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
                <div style={{padding:'20px',background:'rgba(255,255,255,0.06)',border:`1px solid ${s.color}40`,borderRadius:'14px',minWidth:'150px',textAlign:'center',transition:'all 0.2s',backdropFilter:'blur(10px)'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'50%',background:`linear-gradient(135deg,${s.color},${s.color}80)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',fontWeight:800,color:'#0D1B3E',margin:'0 auto 10px',boxShadow:`0 4px 12px ${s.color}40`}}>{s.step}</div>
                  <p style={{fontSize:'13px',fontWeight:700,color:'#fff',marginBottom:'4px'}}>{s.label}</p>
                  <p style={{fontSize:'11px',color:'rgba(255,255,255,0.5)',lineHeight:1.4}}>{s.desc}</p>
                </div>
                {i<4&&<div style={{width:'24px',height:'2px',background:`linear-gradient(90deg,rgba(255,255,255,0.1),rgba(255,255,255,0.3))`,flexShrink:0,margin:'0 2px'}}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Builder */}
        <div className="card-hover" style={{background:'#fff',borderRadius:'20px',padding:'32px',border:'1px solid #E8EDF5',boxShadow:'0 4px 20px rgba(13,27,62,0.08)',marginBottom:'32px',display:'flex',gap:'24px',alignItems:'center',transition:'all 0.2s',animation:'fadeUp 0.5s ease 0.5s both'}}>
          <div style={{width:'80px',height:'80px',borderRadius:'20px',background:'linear-gradient(135deg,#00D4AA,#4285F4)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 8px 24px rgba(0,212,170,0.3)'}}>
            <ArgusLogo size={48}/>
          </div>
          <div style={{flex:1}}>
            <h3 style={{fontSize:'20px',fontWeight:700,color:'#0D1B3E',marginBottom:'4px'}}>Abiraminayagi S</h3>
            <p style={{fontSize:'14px',color:'#4A5568',marginBottom:'12px'}}>3rd Year CSE</p>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              {['Meta x Scaler Grand Finalist','WattWise — Scopus Published','Bug Triage RL — OpenEnv','MarketPulse'].map(b=>(
                <span key={b} style={{padding:'4px 12px',borderRadius:'20px',background:'linear-gradient(135deg,rgba(0,212,170,0.08),rgba(66,133,244,0.08))',border:'1px solid rgba(0,212,170,0.2)',fontSize:'12px',color:'#0D1B3E',fontWeight:500}}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{textAlign:'center',padding:'16px 24px',background:'linear-gradient(135deg,rgba(0,212,170,0.05),rgba(66,133,244,0.05))',borderRadius:'14px',border:'1px solid rgba(0,212,170,0.15)',flexShrink:0}}>
            <div style={{fontSize:'28px',fontWeight:900,color:'#00D4AA',letterSpacing:'-1px'}}>Solo</div>
            <div style={{fontSize:'12px',color:'#8B9DC3',fontWeight:500}}>Builder</div>
          </div>
        </div>

        {/* CTA */}
        <div style={{display:'flex',gap:'16px',justifyContent:'center',paddingBottom:'40px',animation:'fadeUp 0.5s ease 0.6s both'}}>
          <Link href="/dashboard" style={{padding:'14px 28px',borderRadius:'12px',background:'linear-gradient(135deg,#00D4AA,#00B894)',color:'#0D1B3E',fontSize:'15px',fontWeight:700,boxShadow:'0 4px 16px rgba(0,212,170,0.3)',transition:'all 0.2s'}}>Open Dashboard →</Link>
          <a href="https://github.com/Abirami-2743/ARGUS" target="_blank" rel="noreferrer" style={{padding:'14px 28px',borderRadius:'12px',background:'#0D1B3E',color:'#fff',fontSize:'15px',fontWeight:700,transition:'all 0.2s'}}>View on GitHub →</a>
          <Link href="/agents" style={{padding:'14px 28px',borderRadius:'12px',background:'#fff',color:'#0D1B3E',fontSize:'15px',fontWeight:700,border:'1px solid #E8EDF5',boxShadow:'0 2px 8px rgba(13,27,62,0.06)',transition:'all 0.2s'}}>Try Agents →</Link>
        </div>
      </div>
    </div>
  )
}