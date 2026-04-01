import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getSiteContent } from '@/lib/adminStore'
import type { SiteContent } from '@/lib/adminStore'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  const [content, setContent] = useState<SiteContent | null>(null)

  useEffect(() => {
    getSiteContent().then(setContent)
  }, [])

  const story = content?.aboutStory ?? [
    'PulseGear was born out of a simple frustration: premium tech accessories were either too expensive or too hard to find in Pakistan. We set out to change that.',
    'Founded in Lahore, PulseGear curates high-quality earbuds, headphones, watches, wallets and power banks — products that punch above their price point.',
    'Every product in our catalog is personally tested by our team. Orders are placed through WhatsApp for a fast, personal experience.',
  ]
  const values = content?.aboutValues ?? [
    { icon: '⚡', title: 'Fast Service', desc: 'Orders processed same day via WhatsApp.' },
    { icon: '✅', title: 'Vetted Products', desc: 'Every item tested before it reaches you.' },
    { icon: '💛', title: 'Customer First', desc: 'Your satisfaction is our only metric.' },
  ]

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 64 }} className="animate-fade-up">
        <span style={{ color: 'var(--accent2)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Our Story</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4rem)', margin: '12px 0 0', lineHeight: 1.1 }}>
          About <span className="gradient-text">PulseGear</span>
        </h1>
      </div>

      {/* Story */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 64 }}>
        {story.map((para, i) => (
          <p key={i} className="reveal" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, margin: 0 }}>
            {para}
          </p>
        ))}
      </div>

      {/* Values */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 64 }}>
        {values.map((v, i) => (
          <div key={v.title} className={`reveal reveal-delay-${i + 1}`} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20,
            padding: 24, transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget).style.borderColor = 'var(--accent-border)'; (e.currentTarget).style.boxShadow = 'var(--shadow-glow)' }}
            onMouseLeave={e => { (e.currentTarget).style.borderColor = 'var(--border)'; (e.currentTarget).style.boxShadow = 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: 16 }}>{v.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 8px', color: 'var(--text)' }}>{v.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>{v.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="reveal" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Have questions? We're one message away.</p>
        <a href="https://wa.me/923266570023?text=Hi%20PulseGear!%20I%20have%20a%20question."
          target="_blank" rel="noopener noreferrer" className="pg-btn-glow" style={{ textDecoration: 'none', display: 'inline-block' }}>
          💬 Chat with Us
        </a>
      </div>
    </main>
  )
}
