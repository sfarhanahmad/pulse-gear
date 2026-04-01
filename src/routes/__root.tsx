import { HeadContent, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import '../styles.css'

const LOGO_KEY = 'pg_logo_image'
const THEME_KEY = 'pg_theme'

export function getLogoImage(): string {
  try { return localStorage.getItem(LOGO_KEY) || '' } catch { return '' }
}
export function saveLogoImage(base64: string): void {
  localStorage.setItem(LOGO_KEY, base64)
  window.dispatchEvent(new CustomEvent('pg_logo_updated'))
}
export function getTheme(): 'dark' | 'light' {
  try { return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark' } catch { return 'dark' }
}
export function saveTheme(t: 'dark' | 'light'): void {
  localStorage.setItem(THEME_KEY, t)
  document.documentElement.setAttribute('data-theme', t)
  window.dispatchEvent(new CustomEvent('pg_theme_updated'))
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'PulseGear — Premium Tech, Affordable Prices' },
      { name: 'description', content: 'Shop premium wireless earbuds, headphones, watches, wallets and power banks at PulseGear.' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', getTheme())
    // Scroll reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
        <Header />
        <div className="page-enter">{children}</div>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}

export function Logo({ height = 'h-9' }: { height?: string }) {
  const [logoImage, setLogoImage] = useState('')
  useEffect(() => {
    setLogoImage(getLogoImage())
    function onUpdate() { setLogoImage(getLogoImage()) }
    window.addEventListener('pg_logo_updated', onUpdate)
    return () => window.removeEventListener('pg_logo_updated', onUpdate)
  }, [])

  if (logoImage) return <img src={logoImage} alt="PulseGear" className={`${height} w-auto object-contain`} />
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
      <span className="gradient-text">Pulse</span>
      <span style={{ color: 'var(--text)' }}>Gear</span>
    </span>
  )
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  useEffect(() => {
    setTheme(getTheme())
    function onUpdate() { setTheme(getTheme()) }
    window.addEventListener('pg_theme_updated', onUpdate)
    return () => window.removeEventListener('pg_theme_updated', onUpdate)
  }, [])
  function toggle() { saveTheme(theme === 'dark' ? 'light' : 'dark'); setTheme(t => t === 'dark' ? 'light' : 'dark') }
  return (
    <button onClick={toggle} title="Toggle theme" style={{
      width: 44, height: 24, borderRadius: 99, border: '1px solid var(--border)',
      background: theme === 'dark' ? 'var(--bg-subtle)' : 'var(--accent)',
      cursor: 'pointer', position: 'relative', transition: 'all 0.3s', flexShrink: 0,
      display: 'flex', alignItems: 'center', padding: '2px',
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%',
        background: theme === 'dark' ? 'var(--text-muted)' : 'var(--accent-text)',
        transition: 'transform 0.3s',
        transform: theme === 'dark' ? 'translateX(0)' : 'translateX(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
      }}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  )
}

export function AuthModal({ mode, onClose }: { mode: 'login' | 'register'; onClose: () => void }) {
  const [tab, setTab] = useState<'login' | 'register'>(mode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSubmit() {
    setLoading(true); setMsg('')
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
    const endpoint = tab === 'register' ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password'
    const body = tab === 'register'
      ? { email, password, data: { full_name: name } }
      : { email, password }
    try {
      const res = await fetch(`${SUPABASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.error) { setMsg(data.error.message || data.msg); setLoading(false); return }
      if (tab === 'register') {
        setMsg('✅ Account created! Check your email to confirm.')
      } else {
        localStorage.setItem('pg_user', JSON.stringify(data.user))
        localStorage.setItem('pg_token', data.access_token)
        window.dispatchEvent(new CustomEvent('pg_auth_updated'))
        onClose()
      }
    } catch { setMsg('Something went wrong. Try again.') }
    setLoading(false)
  }

  async function handleGoogle() {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
    window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${window.location.origin}`
  }

  return (
    <div className="auth-modal" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="auth-modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <Logo />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-subtle)', borderRadius: 12, padding: 4, marginBottom: 24, border: '1px solid var(--border)' }}>
          {(['login', 'register'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'var(--font-body)', transition: 'all 0.2s',
              background: tab === t ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'transparent',
              color: tab === t ? '#fff' : 'var(--text-muted)',
              boxShadow: tab === t ? '0 0 16px var(--accent-glow)' : 'none',
            }}>
              {t === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        {tab === 'register' && (
          <input className="pg-input" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: 12 }} />
        )}
        <input className="pg-input" placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: 12 }} />
        <input className="pg-input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: 16 }} />

        {msg && <p style={{ fontSize: '0.8rem', color: msg.startsWith('✅') ? 'var(--green)' : '#f87171', marginBottom: 12, textAlign: 'center' }}>{msg}</p>}

        <button className="pg-btn-glow" onClick={handleSubmit} disabled={loading} style={{ width: '100%', marginBottom: 14, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create Account'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ color: 'var(--text-faint)', fontSize: '0.75rem' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <button onClick={handleGoogle} style={{
          width: '100%', padding: '11px', background: 'var(--bg-subtle)', border: '1px solid var(--border)',
          borderRadius: 12, color: 'var(--text)', fontSize: '0.875rem', fontWeight: 600,
          cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}>
          🔵 Continue with Google
        </button>
      </div>
    </div>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    function loadUser() {
      try { setUser(JSON.parse(localStorage.getItem('pg_user') || 'null')) } catch { setUser(null) }
    }
    loadUser()
    window.addEventListener('pg_auth_updated', loadUser)
    return () => window.removeEventListener('pg_auth_updated', loadUser)
  }, [])

  function logout() {
    localStorage.removeItem('pg_user')
    localStorage.removeItem('pg_token')
    setUser(null)
    window.dispatchEvent(new CustomEvent('pg_auth_updated'))
  }

  return (
    <>
      <header className="pg-nav" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 1rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link to="/" style={{ textDecoration: 'none' }}><Logo /></Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden md:flex">
            {[['/', 'Shop'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
              <Link key={to} to={to} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, padding: '6px 12px', borderRadius: 8, transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text)'; (e.target as HTMLElement).style.background = 'var(--bg-subtle)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; (e.target as HTMLElement).style.background = 'transparent' }}>
                {label}
              </Link>
            ))}
            <a href="https://wa.me/923266570023" target="_blank" rel="noopener noreferrer"
              style={{ background: 'var(--green)', color: '#fff', fontWeight: 700, fontSize: '0.875rem', padding: '8px 18px', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s', marginLeft: 4, boxShadow: '0 0 16px var(--green-glow)' }}>
              💬 WhatsApp
            </a>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hi, {use
