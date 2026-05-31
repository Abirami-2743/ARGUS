'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Logo = () => (
  <Link href="/" style={{display:'flex',alignItems:'center',gap:'10px'}}>
    <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#00D4AA,#00A882)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',fontWeight:900,color:'#0D1B3E',boxShadow:'0 4px 12px rgba(0,212,170,0.3)'}}>A</div>
    <span style={{fontWeight:800,fontSize:'18px',letterSpacing:'-0.5px',color:'#1A1A2E'}}>ARGUS</span>
  </Link>
)

export default function Navbar() {
  const p = usePathname()
  const links = [['/',  'Home'],['/dashboard','Dashboard'],['/agents','Agents'],['/threats','Threats'],['/traces','Traces'],['/about','About']]
  return (
    <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,0.92)',backdropFilter:'blur(12px)',borderBottom:'1px solid #E8EDF5',height:'64px',display:'flex',alignItems:'center',padding:'0 48px',gap:'32px',boxShadow:'0 1px 20px rgba(13,27,62,0.06)'}}>
      <Logo />
      <div style={{display:'flex',gap:'4px',flex:1}}>
        {links.map(([href,label])=>(
          <Link key={href} href={href} style={{padding:'6px 14px',borderRadius:'8px',fontSize:'14px',fontWeight:500,color:p===href?'#0D1B3E':'#4A5568',background:p===href?'#F0F4FF':'transparent',transition:'all 0.15s'}}>{label}</Link>
        ))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
        <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#00D4AA',boxShadow:'0 0 8px #00D4AA',animation:'pulse 2s infinite'}}/>
        <span style={{fontSize:'13px',color:'#4A5568',fontWeight:500}}>16 agents online</span>
      </div>
      <Link href="/dashboard" style={{padding:'10px 20px',borderRadius:'10px',background:'linear-gradient(135deg,#00D4AA,#00B894)',color:'#0D1B3E',fontSize:'14px',fontWeight:700,boxShadow:'0 4px 12px rgba(0,212,170,0.3)'}}>Dashboard →</Link>
    </nav>
  )
}