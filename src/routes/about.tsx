import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getSiteContent } from '@/lib/adminStore'
import type { SiteContent } from '@/lib/adminStore'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  const [content, setContent] = useState<SiteContent | null>(null)
  useEffect(() => {
    setContent(getSiteContent())
    function onUpdate() { setContent(getSiteContent()) }
    window.addEventListener('pg_content_updated', onUpdate)
    return () => window.removeEventListener('pg_content_updated', onUpdate)
  }, [])
  if (!content) return null

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 1rem 6rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Our Story</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 6vw, 3.5rem)', margin: '12px 0 0', color: 'var(--text)' }}>
          About <span style={{ color: 'var(--accent)' }}>PulseGear</span>
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: '4rem' }}>
        {content.aboutStory.map((para, i) => (
          <p key={i} style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>{para}</p>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: '4rem' }}>
        {content.aboutValues.map(v => (
          <div key={v.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 24px', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>{v.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', margin: '0 0 8px', color: 'var(--text)' }}>{v.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>{v.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Have questions? We're one message away.</p>
        <a href={`https://wa.me/${content.whatsappNumber}?text=Hi%20PulseGear!%20I%20have%20a%20question.`}
          target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent)', color: 'var(--accent-text)', fontWeight: 700, padding: '14px 32px', borderRadius: 14, textDecoration: 'none', fontSize: '1rem', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-hover)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)' }}>
          💬 Chat with Us
        </a>
      </div>
    </main>
  )
}
