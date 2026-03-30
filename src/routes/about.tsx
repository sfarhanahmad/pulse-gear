import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getSiteContent } from '@/lib/adminStore'
import type { SiteContent } from '@/lib/adminStore'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

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
    <main className="max-w-3xl mx-auto px-4 py-20">
      <div className="mb-16 text-center">
        <span className="text-yellow-400 text-sm font-semibold uppercase tracking-widest">Our Story</span>
        <h1 className="text-5xl font-black mt-3">About <span className="text-yellow-400">PulseGear</span></h1>
      </div>

      <div className="space-y-8 text-white/70 text-lg leading-relaxed">
        {content.aboutStory.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.aboutValues.map((v) => (
          <div key={v.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-400/30 transition-colors">
            <div className="text-3xl mb-4">{v.icon}</div>
            <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
            <p className="text-white/50 text-sm">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-white/50 mb-6">Have questions? We're one message away.</p>
        <a
          href={`https://wa.me/${content.whatsappNumber}?text=Hi%20PulseGear!%20I%20have%20a%20question.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-xl transition-colors"
        >
          Chat with Us
        </a>
      </div>
    </main>
  )
}
