'use client'
import {useState} from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {INDUSTRIES,Industry} from '@/lib/agents'

export default function AgentsPage(){
  const [active,setActive]=useState<Industry>('healthcare')
  const ind=INDUSTRIES[active]
  return(
    <div style={{background:'#F8FAFF',minHeight:'100vh'}}>
      <Navbar/>
      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#0D1B3E,#0A2444)',padding:'48px 48px 0',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-60px',right:'-60px',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,212,170,0.1) 0%,transparent 70%)'}}/>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <p style={{fontSize:'13px',color:'#00D4AA',fontWeight:600,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Agent Console</p>
          <h1 style={{fontSize:'36px',fontWeight:900,color:'#fff',letterSpacing:'-1px',marginBottom:'8px'}}>15 Simulated Agents</h1>
          <p style={{fontSize:'15px',color:'rgba(255,255,255,0.6)',marginBottom:'32px'}}>Select an industry and agent. ARGUS monitors every action in real time.</p>
          {/* Tabs */}
          <div style={{display:'flex',gap:'4px'}}>
            {Object.entries(INDUSTRIES).map(([k,i])=>(
              <button key={k} onClick={()=>setActive(k as Industry)} style={{padding:'12px 20px',borderRadius:'12px 12px 0 0',border:'none',background:active===k?'#F8FAFF':'rgba(255,255,255,0.08)',color:active===k?'#0D1B3E':'rgba(255,255,255,0.7)',fontSize:'14px',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:'7px',borderTop:active===k?`3px solid ${i.color}`:'3px solid transparent',transition:'all 0.15s'}}>
                <span>{i.icon}</span>{i.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'40px 48px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px'}}>
          <span style={{fontSize:'24px'}}>{ind.icon}</span>
          <h2 style={{fontSize:'22px',fontWeight:800,color:'#0D1B3E'}}>{ind.label}</h2>
          <span style={{padding:'4px 12px',borderRadius:'20px',background:ind.color+'15',border:`1px solid ${ind.color}30`,fontSize:'12px',color:ind.color,fontWeight:600}}>3 agents</span>
        </div>
        <p style={{fontSize:'14px',color:'#4A5568',marginBottom:'32px'}}>{ind.description}</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'24px'}}>
          {ind.agents.map((a,i)=>(
            <Link key={a.id} href={`/agents/${a.id}`} style={{display:'block',padding:'28px',background:'#fff',border:'1px solid #E8EDF5',borderRadius:'20px',boxShadow:'0 4px 20px rgba(13,27,62,0.08)',transition:'all 0.2s',position:'relative',overflow:'hidden',textDecoration:'none',animation:`fadeUp 0.4s ease ${i*0.1}s both`}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLElement).style.boxShadow=`0 12px 40px rgba(13,27,62,0.15)`;(e.currentTarget as HTMLElement).style.borderColor=ind.color+'50'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='0 4px 20px rgba(13,27,62,0.08)';(e.currentTarget as HTMLElement).style.borderColor='#E8EDF5'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:`linear-gradient(90deg,${ind.color},${ind.color}50)`}}/>
              <div style={{width:'52px',height:'52px',borderRadius:'14px',background:ind.color+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'26px',marginBottom:'18px'}}>{a.icon}</div>
              <h3 style={{fontSize:'17px',fontWeight:700,color:'#0D1B3E',marginBottom:'8px'}}>{a.name}</h3>
              <p style={{fontSize:'13px',color:'#4A5568',lineHeight:1.6,marginBottom:'18px'}}>{a.description}</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'20px'}}>
                {a.tools.map(t=>(
                  <span key={t} style={{padding:'3px 8px',borderRadius:'6px',background:'#F0F4FF',color:'#4A5568',fontSize:'11px',fontFamily:'JetBrains Mono,monospace'}}>{t}()</span>
                ))}
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:'13px',color:ind.color,fontWeight:700}}>Open agent →</span>
                <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                  <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#00D4AA',animation:'pulse 2s infinite'}}/>
                  <span style={{fontSize:'11px',color:'#8B9DC3'}}>ARGUS watching</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}