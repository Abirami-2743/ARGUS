'use client'

/**
 * ARGUS — AI Security Monitor Landing Page
 * Single-file Next.js component.
 *
 * Only external dependency: framer-motion
 *   npm install framer-motion
 *   (or: pnpm add framer-motion / yarn add framer-motion)
 *
 * Drop this file anywhere in your Next.js app/pages directory and export default.
 * The file is fully self-contained — no sub-component imports needed.
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// ─── Logo ────────────────────────────────────────────────────────────────────
// Radar scanner — concentric rings with crosshair, representing omniscient surveillance.
function ArgusLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00D4AA" />
          <stop offset="1" stopColor="#0080FF" />
        </linearGradient>
        <clipPath id="squareClip">
          <rect width="40" height="40" rx="10" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="10" fill="#0A1628" />

      <g clipPath="url(#squareClip)">
        {/* Outer ring */}
        <circle cx="20" cy="20" r="14" stroke="#00D4AA" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />
        {/* Mid ring */}
        <circle cx="20" cy="20" r="9" stroke="#00D4AA" strokeWidth="1.2" strokeOpacity="0.65" fill="none" />
        {/* Inner ring */}
        <circle cx="20" cy="20" r="4.5" stroke="#00D4AA" strokeWidth="1.4" fill="none" />
        {/* Center dot */}
        <circle cx="20" cy="20" r="2" fill="url(#bgGrad)" />

        {/* Crosshair lines */}
        <line x1="20" y1="4" x2="20" y2="12" stroke="#00D4AA" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="20" y1="28" x2="20" y2="36" stroke="#00D4AA" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="4" y1="20" x2="12" y2="20" stroke="#00D4AA" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="28" y1="20" x2="36" y2="20" stroke="#00D4AA" strokeWidth="1.4" strokeLinecap="round" />

        {/* Sweep arc (radar sweep effect) */}
        <path
          d="M20 20 L31 12 A14 14 0 0 1 34 20 Z"
          fill="url(#bgGrad)"
          fillOpacity="0.18"
        />
        {/* Blip dot */}
        <circle cx="29" cy="14" r="1.5" fill="#00D4AA" fillOpacity="0.9" />
      </g>
    </svg>
  )
}

// ─── Particle Network ─────────────────────────────────────────────────────────
function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    interface Particle {
      x: number; y: number; vx: number; vy: number; size: number
    }
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      init()
    }

    const init = () => {
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 14000)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          size: Math.random() * 1.8 + 0.5,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 212, 170, 0.55)'
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dist = Math.hypot(p.x - q.x, p.y - q.y)
          if (dist < 110) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(0, 212, 170, ${0.18 * (1 - dist / 110)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  )
}

// ─── Count-Up ─────────────────────────────────────────────────────────────────
function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(ease * end))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

// ─── Live Threat Feed ─────────────────────────────────────────────────────────
const THREAT_LOGS = [
  { type: 'BLOCKED', text: 'Prompt injection detected in Agent-Finance-7', typeColor: '#FF6B6B' },
  { type: 'SAFE',    text: 'Agent-Medical-3 output cleared — no anomalies', typeColor: '#00D4AA' },
  { type: 'ALERT',   text: 'Suspicious inter-agent message: Agent-Legal-2 → Agent-HR-4', typeColor: '#FFB347' },
  { type: 'BLOCKED', text: 'Data exfiltration attempt stopped in Agent-Sales-1', typeColor: '#FF6B6B' },
  { type: 'SAFE',    text: 'Routine telemetry ping from Agent-Ops-9 — cleared', typeColor: '#00D4AA' },
  { type: 'ALERT',   text: 'Unusual query pattern detected in Agent-Support-5', typeColor: '#FFB347' },
  { type: 'BLOCKED', text: 'Jailbreak attempt on Agent-Research-2 neutralised', typeColor: '#FF6B6B' },
  { type: 'SAFE',    text: 'Agent-Logistics-11 output verified — 0ms latency', typeColor: '#00D4AA' },
]

interface LogEntry { id: string; type: string; text: string; typeColor: string; time: string }

function LiveThreatFeed() {
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    THREAT_LOGS.slice(0, 5).map((l, i) => ({ ...l, id: `init-${i}`, time: `${(5 - i) * 2}ms ago` }))
  )

  useEffect(() => {
    let n = 5
    const id = setInterval(() => {
      n++
      const tpl = THREAT_LOGS[Math.floor(Math.random() * THREAT_LOGS.length)]
      setLogs(prev => [
        { ...tpl, id: `log-${n}`, time: `${Math.floor(Math.random() * 9) + 1}ms ago` },
        ...prev,
      ].slice(0, 6))
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      background: '#080E1E',
      border: '1px solid rgba(0,212,170,0.15)',
      borderRadius: '16px',
      overflow: 'hidden',
      fontFamily: 'Menlo, Monaco, monospace',
      fontSize: '13px',
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
    }}>
      {/* Terminal header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.03)',
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
        <span style={{ marginLeft: 12, color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: '0.08em', fontWeight: 600 }}>
          ARGUS // LIVE THREAT CONSOLE
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: '#00D4AA', fontSize: 11 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D4AA', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          LIVE
        </span>
      </div>

      {/* Log area */}
      <div style={{ flex: 1, overflowY: 'hidden', padding: '12px 16px', position: 'relative' }}>
        <div style={{
          position: 'absolute', bottom: 0, insetInline: 0, height: 60,
          background: 'linear-gradient(to top, #080E1E, transparent)',
          pointerEvents: 'none', zIndex: 1,
        }} />
        <AnimatePresence initial={false}>
          {logs.map(log => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}
            >
              <span style={{ color: log.typeColor, fontWeight: 700, whiteSpace: 'nowrap', minWidth: 62 }}>
                [{log.type}]
              </span>
              <span style={{ color: 'rgba(255,255,255,0.65)', flex: 1, lineHeight: 1.5 }}>{log.text}</span>
              <span style={{ color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap', fontSize: 11 }}>{log.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#ffffff', color: '#0F172A', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .section-enter { animation: fadeUp 0.6s ease both; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(8,14,30,0.8)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ArgusLogo size={36} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.4px' }}>
            ARGUS
          </span>
        </div>

        <div style={{ display: 'flex', gap: 36, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>
          {['How It Works', 'Features', 'Threats'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              style={{ transition: 'color 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
              {item}
            </a>
          ))}
        </div>

        <Link href="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '10px 22px', borderRadius: 100,
          background: '#00C896', color: '#fff',
          fontSize: 14, fontWeight: 700,
          boxShadow: '0 4px 24px rgba(0,200,150,0.35)',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,200,150,0.45)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,200,150,0.35)' }}>
          Launch Dashboard →
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative', minHeight: '100dvh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', paddingTop: 96, paddingBottom: 80, paddingInline: 24,
        background: 'linear-gradient(160deg, #06090F 0%, #0F1B35 50%, #081828 100%)',
        overflow: 'hidden',
      }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '38%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 960, height: 640,
          background: 'radial-gradient(ellipse, rgba(0,200,150,0.11) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />

        <ParticleNetwork />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, width: '100%' }}>
          {/* Hackathon badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 18px', borderRadius: 100,
              background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.28)',
              color: '#00D4AA', fontSize: 13, fontWeight: 600, marginBottom: 36,
            }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00D4AA', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            Google Cloud Rapid Agent Hackathon 2026
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(44px, 6.5vw, 88px)',
              fontWeight: 800, lineHeight: 1.06,
              letterSpacing: '-2px', marginBottom: 24,
            }}>
            <span style={{ color: '#FFFFFF' }}>The sentinel</span>
            <br />
            <span style={{ color: '#FFFFFF' }}>for </span>
            <span style={{
              background: 'linear-gradient(135deg, #00D4AA 0%, #4285F4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>AI agents.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 19, color: 'rgba(255,255,255,0.52)', lineHeight: 1.65, maxWidth: 620, margin: '0 auto 44px' }}>
            ARGUS monitors 15 AI agents across 5 industries in real time —
            detecting prompt injection, rogue communications, and dangerous
            outputs before they cause harm.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 72 }}>
            <Link href="/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 100,
              background: '#00C896', color: '#fff',
              fontSize: 16, fontWeight: 700,
              boxShadow: '0 8px 32px rgba(0,200,150,0.35)',
              transition: 'all 0.2s',
            }}>
              Enter Dashboard →
            </Link>
            <button style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '14px 32px', borderRadius: 100,
              background: 'transparent', color: '#fff',
              fontSize: 16, fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.18)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              Watch Demo
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              borderTop: '1px solid rgba(255,255,255,0.09)',
              paddingTop: 36, gap: 16,
            }}>
            {[
              { value: 12, label: 'Threats Blocked', color: '#FF6B6B' },
              { value: 15,   label: 'Agents Monitored', color: '#00D4AA' },
              { value: 40, label: 'Traces Analyzed', color: '#4285F4' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 800, color: s.color, letterSpacing: '-1px' }}>
                  <CountUp end={s.value} />
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding: '100px 48px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <motion.h2
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: '#0F1B35', letterSpacing: '-1px', marginBottom: 16 }}>
              How ARGUS Works
            </motion.h2>
            <p style={{ color: '#64748B', fontSize: 18, maxWidth: 540, margin: '0 auto' }}>
              Real-time protection injected directly into your agent&apos;s execution loop.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Agents Act', desc: 'AI agents operate across their intended tasks — finance, medical, legal, ops — completely normally.', icon: '⚙️' },
              { step: '02', title: 'ARGUS Watches', desc: 'Phoenix MCP captures every trace, reasoning step, and inter-agent message in real time.', icon: '👁' },
              { step: '03', title: 'Threats Blocked', desc: 'Gemini 2.5 Flash classifies and blocks malicious inputs, rogue outputs, and suspicious patterns instantly.', icon: '🛡️' },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }} transition={{ delay: i * 0.18 }}
                style={{
                  padding: 36, borderRadius: 20,
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  position: 'relative', overflow: 'hidden',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                whileHover={{ boxShadow: '0 12px 40px rgba(0,200,150,0.1)', borderColor: 'rgba(0,200,150,0.35)' }}>
                <div style={{
                  position: 'absolute', top: 20, right: 24,
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: 64, fontWeight: 900,
                  color: 'rgba(15,27,53,0.04)', lineHeight: 1,
                }}>{item.step}</div>
                <div style={{ fontSize: 28, marginBottom: 20 }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, color: '#0F1B35', marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: '#64748B', lineHeight: 1.65, fontSize: 15 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '100px 48px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: '#0F1B35', letterSpacing: '-1px', marginBottom: 12 }}>
            Comprehensive Defense
          </motion.h2>
          <p style={{ color: '#64748B', fontSize: 18, marginBottom: 52 }}>Every vector secured. Every token verified.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20}}>
            {[
              { title: 'Prompt Injection Detection', desc: 'Detects malicious inputs and jailbreak attempts in real time before they reach the model.', color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)', icon: '🔒' },
              { title: 'Rogue Communications Monitor', desc: 'Blocks unauthorised inter-agent messages to prevent cascading compromises across your stack.', color: '#FFB347', bg: 'rgba(255,179,71,0.08)', icon: '🔗' },
              { title: 'Output Guard', desc: 'Intercepts dangerous outputs, PII leaks, and harmful instructions before they reach end users.', color: '#4285F4', bg: 'rgba(66,133,244,0.08)', icon: '⚡' },
              { title: 'Self-Learning Defense', desc: 'Uses Phoenix traces to continuously fine-tune threat detection models — ARGUS gets smarter every hour.', color: '#00C896', bg: 'rgba(0,200,150,0.08)', icon: '🧠' },
            ].map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{
                  padding: 32, borderRadius: 20,
                  background: '#fff', border: '1px solid #E2E8F0',
                  transition: 'all 0.25s',
                }}
                whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.08)', y: -4 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, marginBottom: 20,
                }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 17, color: '#0F1B35', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Threat Feed ── */}
      <section id="threats" style={{
        padding: '100px 48px',
        background: 'linear-gradient(160deg, #0A1020 0%, #0F1B35 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '30%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(0,200,150,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 20 }}>
                See threats<br />
                <span style={{ background: 'linear-gradient(135deg, #00D4AA, #4285F4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  as they happen.
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}
                style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>
                The ARGUS Threat Console gives you a live, god&apos;s-eye view of your entire agent ecosystem. Trace malicious behaviour and respond before damage is done.
              </motion.p>
              <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.22 }}>
                <Link href="/dashboard" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 100,
                  background: '#00C896', color: '#fff',
                  fontSize: 15, fontWeight: 700,
                  boxShadow: '0 4px 24px rgba(0,200,150,0.3)',
                }}>
                  Explore Dashboard →
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.93 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.6, type: 'spring' }}>
              <LiveThreatFeed />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section style={{ padding: '80px 48px', background: '#fff', textAlign: 'center', borderBottom: '1px solid #E2E8F0' }}>
        <p style={{ fontSize: 12, color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 36 }}>
          Built with
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          {[
            { name: 'Google ADK',      color: '#4285F4' },
            { name: 'Gemini 2.5 Flash', color: '#34A853' },
            { name: 'Arize Phoenix',   color: '#FF6B35' },
            { name: 'Cloud Run',       color: '#4285F4' },
            { name: 'FastAPI',         color: '#00C896' },
            { name: 'Next.js',         color: '#0F1B35' },
          ].map(t => (
            <div key={t.name} style={{
              padding: '9px 20px', borderRadius: 10,
              background: '#F8FAFC', border: '1px solid #E2E8F0',
              fontSize: 13, fontWeight: 600, color: t.color,
            }}>
              {t.name}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section style={{
        padding: '120px 48px 80px',
        background: 'linear-gradient(180deg, #fff 0%, #F0F7F5 100%)',
        textAlign: 'center',
      }}>
        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(30px,4.5vw,60px)', fontWeight: 800, color: '#0F1B35', letterSpacing: '-1.5px', marginBottom: 20 }}>
          Ready to secure your AI stack?
        </motion.h2>
        <p style={{ color: '#64748B', fontSize: 18, marginBottom: 44 }}>
          Deploy ARGUS in minutes. Monitor forever.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 80 }}>
          <Link href="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '16px 36px', borderRadius: 100,
            background: '#00C896', color: '#fff',
            fontSize: 16, fontWeight: 700,
            boxShadow: '0 8px 32px rgba(0,200,150,0.3)',
          }}>
            Enter Dashboard →
          </Link>
          <a href="https://github.com" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '16px 36px', borderRadius: 100,
            background: 'transparent', color: '#0F1B35',
            fontSize: 16, fontWeight: 600,
            border: '1.5px solid #CBD5E1',
          }}>
            View on GitHub
          </a>
        </div>

        {/* Footer bar */}
        <div style={{
          borderTop: '1px solid #E2E8F0', paddingTop: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#94A3B8',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArgusLogo size={24} />
            <span style={{ fontWeight: 700, color: '#0F1B35', fontSize: 15 }}>ARGUS</span>
          </div>
          <p>© 2026 ARGUS Security. All rights reserved.</p>
          <p style={{ fontWeight: 600 }}>Built for Google Cloud Rapid Agent Hackathon 2026</p>
        </div>
      </section>
    </main>
  )
}
