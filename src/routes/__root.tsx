import { HeadContent, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
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
  }, [])

  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
        <Header />
        {children}
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

  if (logoImage) {
    return <img src={logoImage} alt="PulseGear" className={`${height} w-auto object-contain`} />
  }
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
      <span style={{ color: 'var(--accent)' }}>Pulse</span>
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

  function toggle() { saveTheme(theme === 'dark' ? 'light' : 'dark') ; setTheme(t => t === 'dark' ? 'light' : 'dark') }

  return (
    <button
      onClick={toggle}
      title="Toggle theme"
      style={{
        width: 44, height: 24, borderRadius: 99, border: '1px solid var(--border)',
        background: theme === 'dark' ? 'var(--bg-subtle)' : 'var(--accent)',
        cursor: 'pointer', position: 'relative', transition: 'all 0.3s', flexShrink: 0,
        display: 'flex', alignItems: 'center', padding: '2px',
      }}
    >
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

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
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
            style={{ background: 'var(--accent)', color: 'var(--accent-text)', fontWeight: 700, fontSize: '0.875rem', padding: '8px 18px', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s', marginLeft: 8 }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = 'var(--accent)' }}>
            WhatsApp Us
          </a>
          <ThemeToggle />
        </nav>

        {/* Mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="flex md:hidden">
          <ThemeToggle />
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'var(--text)' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--nav-bg)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[['/', 'Shop'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '10px 12px', borderRadius: 8 }}>
              {label}
            </Link>
          ))}
          <a href="https://wa.me/923266570023" target="_blank" rel="noopener noreferrer"
            style={{ background: 'var(--accent)', color: 'var(--accent-text)', fontWeight: 700, fontSize: '0.875rem', padding: '10px 16px', borderRadius: 10, textDecoration: 'none', marginTop: 8, textAlign: 'center' }}>
            WhatsApp Us
          </a>
        </div>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: '5rem', padding: '3rem 0' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <Logo />
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['/', 'Shop'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
            <Link key={to} to={to} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-muted)' }}>
              {label}
            </Link>
          ))}
          <a href="https://wa.me/923266570023" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.875rem' }}>
            WhatsApp
          </a>
          <Link to="/admin/login" style={{ color: 'var(--text-faint)', textDecoration: 'none', fontSize: '0.75rem' }}>Admin</Link>
        </div>
        <p style={{ color: 'var(--text-faint)', fontSize: '0.8rem', margin: 0 }}>© {new Date().getFullYear()} PulseGear. All rights reserved.</p>
      </div>
    </footer>
  )
}
