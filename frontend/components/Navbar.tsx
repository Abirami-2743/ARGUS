'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ArgusLogo = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradNav" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00D4AA" />
        <stop offset="1" stopColor="#0080FF" />
      </linearGradient>
      <clipPath id="squareClipNav">
        <rect width="40" height="40" rx="10" />
      </clipPath>
    </defs>
    <rect width="40" height="40" rx="10" fill="#0A1628" />
    <g clipPath="url(#squareClipNav)">
      <circle cx="20" cy="20" r="14" stroke="#00D4AA" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />
      <circle cx="20" cy="20" r="9" stroke="#00D4AA" strokeWidth="1.2" strokeOpacity="0.65" fill="none" />
      <circle cx="20" cy="20" r="4.5" stroke="#00D4AA" strokeWidth="1.4" fill="none" />
      <circle cx="20" cy="20" r="2" fill="url(#bgGradNav)" />
      <line x1="20" y1="4" x2="20" y2="12" stroke="#00D4AA" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="20" y1="28" x2="20" y2="36" stroke="#00D4AA" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="4" y1="20" x2="12" y2="20" stroke="#00D4AA" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="28" y1="20" x2="36" y2="20" stroke="#00D4AA" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M20 20 L31 12 A14 14 0 0 1 34 20 Z" fill="url(#bgGradNav)" fillOpacity="0.18" />
      <circle cx="29" cy="14" r="1.5" fill="#00D4AA" fillOpacity="0.9" />
    </g>
  </svg>
)

const Logo = () => (
  <Link href="/" style={{display:'flex',alignItems:'center',gap:'10px'}}>
    <ArgusLogo size={36} />
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