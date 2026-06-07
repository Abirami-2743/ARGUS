'use client'
import {useState,useEffect} from 'react'
import Navbar from '@/components/Navbar'
import {getTraces} from '@/lib/api'

const MOCK_TRACES=[
  {id:'tr-001',agent:'patient_intake',model:'gemini-2.5-flash-lite',tokens:847,latency:'2.3s',score:0.92,status:'pass'},
  {id:'tr-002',agent:'fraud_detector',model:'gemini-2.5-flash-lite',tokens:1203,latency:'3.1s',score:0.88,status:'pass'},
  {id:'tr-003',agent:'loan_processor',model:'gemini-2.5-flash-lite',tokens:956,latency:'2.8s',score:0.71,status:'warn'},
  {id:'tr-004',agent:'contract_analyzer',model:'gemini-2.5-flash-lite',tokens:2104,latency:'4.2s',score:0.95,status:'pass'},
  {id:'tr-005',agent:'quality_inspector',model:'gemini-2.5-flash-lite',tokens:634,latency:'1.9s',score:0.97,status:'pass'},
  {id:'tr-006',agent:'argus_monitor',model:'gemini-3.5-flash',tokens:1876,latency:'3.8s',score:0.94,status:'pass'},
]

export default function TracesPage(){
  const [liveData,setLiveData]=useState<string|null>(null)
  const [loading,setLoading]=useState(false)

  const fetchLive=async()=>{
    setLoading(true)
    try{const r=await getTraces();setLiveData(r.traces_analysis)}
    catch{setLiveData('Could not connect to backend. Make sure api/main.py is running.')}
    setLoading(false)
  }

  

  const renderMarkdown=(text:string)=>text.split('\n').map((line,i)=>{
    const clean=line.replace(/\*\*(.*?)\*\*/g,'$1').replace(/^[\*\-]\s/,'• ')
    if(line.startsWith('####'))return <p key={i} style={{fontWeight:700,color:'#0D1B3E',fontSize:'13px',margin:'12px 0 4px'}}>{clean.replace(/#{1,4}\s/,'')}</p>
    if(line.startsWith('###'))return <p key={i} style={{fontWeight:800,color:'#0D1B3E',fontSize:'14px',margin:'16px 0 6px'}}>{clean.replace(/#{1,4}\s/,'')}</p>
    if(line.startsWith('##'))return <p key={i} style={{fontWeight:800,color:'#0D1B3E',fontSize:'15px',margin:'16px 0 6px'}}>{clean.replace(/#{1,4}\s/,'')}</p>
    if(line.trim()==='---')return <hr key={i} style={{border:'none',borderTop:'1px solid #E8EDF5',margin:'12px 0'}}/>
    if(line.trim()==='')return <br key={i}/>
    const isScore=line.includes('THREAT ASSESSMENT')
    const color=isScore&&line.includes('HIGH')?'#FF4444':isScore&&line.includes('MEDIUM')?'#FFB347':isScore&&line.includes('SAFE')?'#00D4AA':'#4A5568'
    return <p key={i} style={{margin:'3px 0',color}}>{clean}</p>
  })

  return(
    <div style={{background:'#F8FAFF',minHeight:'100vh'}}>
      <Navbar/>
      <div style={{background:'linear-gradient(135deg,#0D1B3E,#0a1f3a)',padding:'48px 48px 64px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-60px',right:'5%',width:'350px',height:'350px',borderRadius:'50%',background:'radial-gradient(circle,rgba(66,133,244,0.12) 0%,transparent 70%)'}}/>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <p style={{fontSize:'13px',color:'#4285F4',fontWeight:600,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Observability</p>
          <h1 style={{fontSize:'36px',fontWeight:900,color:'#fff',letterSpacing:'-1px',marginBottom:'8px'}}>Phoenix Traces</h1>
          <p style={{fontSize:'15px',color:'rgba(255,255,255,0.6)',marginBottom:'32px'}}>Every agent interaction traced with OpenInference + Arize Phoenix.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
            {[
              {l:'Total Traces',v:'40+',c:'#4285F4',i:'📡'},
{l:'Avg Latency',v:'~3.2s',c:'#00D4AA',i:'⚡'},
{l:'Avg Score',v:'0.91',c:'#00D4AA',i:'🎯'},
{l:'Models Used',v:'2',c:'#fff',i:'🤖'},
            ].map((s,i)=>(
              <div key={i} style={{padding:'20px',background:'rgba(255,255,255,0.06)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
                  <span style={{fontSize:'12px',color:'rgba(255,255,255,0.6)',fontWeight:500}}>{s.l}</span>
                  <span style={{fontSize:'18px'}}>{s.i}</span>
                </div>
                <div style={{fontSize:'28px',fontWeight:900,color:s.c,letterSpacing:'-1px'}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <svg viewBox="0 0 1440 60" style={{display:'block',marginTop:'-2px'}}><path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60Z" fill="#F8FAFF"/></svg>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'40px 48px'}}>
        {/* Live ARGUS Analysis */}
        <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #E8EDF5',padding:'24px',marginBottom:'32px',boxShadow:'0 4px 20px rgba(13,27,62,0.08)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
            <div>
              <h2 style={{fontSize:'18px',fontWeight:700,color:'#0D1B3E',marginBottom:'4px'}}>Live ARGUS Analysis</h2>
              <p style={{fontSize:'13px',color:'#8B9DC3'}}>Real-time data from Phoenix MCP via ARGUS self-improvement loop</p>
            </div>
            <button onClick={fetchLive} disabled={loading} style={{padding:'10px 20px',borderRadius:'10px',background:'linear-gradient(135deg,#4285F4,#3367D6)',color:'#fff',border:'none',fontSize:'14px',fontWeight:700,cursor:'pointer'}}>
              {loading?'Querying...':'Refresh →'}
            </button>
          </div>
          {loading&&(
            <div style={{padding:'32px',textAlign:'center',color:'#8B9DC3',fontSize:'14px'}}>
              <div style={{display:'inline-flex',gap:'6px',alignItems:'center'}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{width:'8px',height:'8px',borderRadius:'50%',background:'#4285F4',animation:`bounce 1s infinite ${i*0.15}s`}}/>
                ))}
                <span style={{marginLeft:'8px'}}>ARGUS querying Phoenix traces...</span>
              </div>
            </div>
          )}
          {!loading&&liveData&&(
            <div style={{padding:'16px',background:'#F8FAFF',borderRadius:'10px',border:'1px solid #E8EDF5',fontSize:'13px',lineHeight:1.9,fontFamily:'JetBrains Mono,monospace'}}>
              {renderMarkdown(liveData)}
            </div>
          )}
          {!loading&&!liveData&&(
            <div style={{padding:'32px',textAlign:'center',color:'#FF4444',fontSize:'14px'}}>
              Could not connect to backend. Make sure api/main.py is running.
            </div>
          )}
        </div>

        {/* Recent Traces Table */}
        <div style={{display:'flex',gap:'16px',marginBottom:'16px',alignItems:'center'}}>
          <h2 style={{fontSize:'18px',fontWeight:700,color:'#0D1B3E',flex:1}}>Recent Traces</h2>
          <p style={{fontSize:'11px',color:'#8B9DC3',marginBottom:'8px'}}>* Sample trace format — view live traces in Phoenix above</p>
          <div style={{display:'flex',gap:'12px'}}>
            <span style={{fontSize:'11px',padding:'4px 10px',borderRadius:'20px',background:'rgba(0,212,170,0.1)',color:'#00D4AA',fontWeight:600}}>🛡 ARGUS → gemini-3.5-flash</span>
            <span style={{fontSize:'11px',padding:'4px 10px',borderRadius:'20px',background:'rgba(66,133,244,0.1)',color:'#4285F4',fontWeight:600}}>⚙️ Workers → gemini-2.5-flash-lite</span>
          </div>
        </div>
        <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #E8EDF5',overflow:'hidden',boxShadow:'0 4px 20px rgba(13,27,62,0.08)'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid #E8EDF5',display:'grid',gridTemplateColumns:'100px 160px 160px 80px 80px 80px 80px',gap:'12px'}}>
            {['Trace ID','Agent','Model','Tokens','Latency','Score','Status'].map(h=>(
              <span key={h} style={{fontSize:'12px',fontWeight:700,color:'#8B9DC3',textTransform:'uppercase',letterSpacing:'0.5px'}}>{h}</span>
            ))}
          </div>
          {MOCK_TRACES.map((t,i)=>(
            
            <div key={t.id} style={{padding:'14px 20px',borderBottom:'1px solid #E8EDF5',display:'grid',gridTemplateColumns:'100px 160px 160px 80px 80px 80px 80px',gap:'12px',alignItems:'center',background:i%2===0?'#fff':'#FAFBFF'}}>
              <span style={{fontSize:'12px',color:'#4285F4',fontFamily:'JetBrains Mono,monospace'}}>{t.id}</span>
              <span style={{fontSize:'12px',color:'#1A1A2E',fontFamily:'JetBrains Mono,monospace'}}>{t.agent}</span>
              <span style={{fontSize:'11px',color:t.model==='gemini-3.5-flash'?'#00D4AA':'#4285F4',fontWeight:600}}>{t.model}</span>
              <span style={{fontSize:'12px',color:'#4A5568'}}>{t.tokens}</span>
              <span style={{fontSize:'12px',color:'#4A5568'}}>{t.latency}</span>
              <span style={{fontSize:'13px',fontWeight:700,color:t.score>0.85?'#00D4AA':t.score>0.7?'#FFB347':'#FF4444'}}>{t.score}</span>
              <span style={{padding:'3px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:700,color:t.status==='pass'?'#00D4AA':'#FFB347',background:t.status==='pass'?'rgba(0,212,170,0.1)':'rgba(255,179,71,0.1)',display:'inline-block'}}>
                {t.status==='pass'?'PASS':'WARN'}
              </span>
            </div>
          ))}
        </div>

        {/* Phoenix CTA */}
        <div style={{marginTop:'48px',padding:'32px',background:'linear-gradient(135deg,#0D1B3E,#0A2444)',borderRadius:'20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <h3 style={{fontSize:'20px',fontWeight:700,color:'#fff',marginBottom:'6px'}}>View full traces in Arize Phoenix</h3>
            <p style={{fontSize:'14px',color:'rgba(255,255,255,0.6)'}}>app.phoenix.arize.com/s/abiramisgp → project: argus-monitoring</p>
          </div>
          <a href="https://app.phoenix.arize.com/s/abiramisgp" target="_blank" rel="noreferrer" style={{padding:'12px 24px',borderRadius:'12px',background:'linear-gradient(135deg,#00D4AA,#00B894)',color:'#0D1B3E',fontSize:'14px',fontWeight:700}}>Open Phoenix →</a>
        </div>
      </div>
    </div>
  )
}