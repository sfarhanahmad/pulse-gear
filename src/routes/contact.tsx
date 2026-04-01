import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/contact')({ component: ContactPage })

function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '4rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }} className="animate-fade-up">
        <span style={{ color: 'var(--accent2)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Get in Touch</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4rem)', margin: '12px 0 0', lineHeight: 1.1 }}>
          Contact <span className="gradient-text">Us</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: '1.05rem' }}>We usually reply within minutes on WhatsApp.</p>
      </div>

      {sent ? (
        <div className="reveal" style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', borderRadius: 24, padding: '48px 32px', textAlign: 'center', boxShadow: 'var(--shadow-glow)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', marginBottom: 8 }} className="gradient-text">Message Sent!</h2>
          <p style={{ color: 'var(--text-muted)' }}>Thanks for reaching out. Our team will get back to you shortly on WhatsApp.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="reveal" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Your Name</label>
            <input type="text" required placeholder="e.g. Ali Hassan" className="pg-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>WhatsApp Number</label>
            <input type="tel" required placeholder="+92 300 0000000" className="pg-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Message</label>
            <textarea required rows={4} placeholder="Tell us what you're looking for..." className="pg-input" style={{ resize: 'none' }} />
          </div>
          <button type="submit" className="pg-btn-glow" style={{ width: '100%', fontSize: '1rem', padding: '14px' }}>
            Send Message
          </button>
        </form>
      )}

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-faint)', fontSize: '0.875rem', marginBottom: 8 }}>Or reach us directly:</p>
        <a href="https://wa.me/923266570023" target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
          +92 326 6570023 on WhatsApp →
        </a>
      </div>
    </main>
  )
}
