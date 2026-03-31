import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <span className="text-yellow-400 text-sm font-semibold uppercase tracking-widest">Get in Touch</span>
        <h1 className="text-5xl font-black mt-3">Contact Us</h1>
        <p className="text-white/50 mt-4 text-lg">We usually reply within minutes on WhatsApp.</p>
      </div>

      {sent ? (
        <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-2xl p-10 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-black text-yellow-400 mb-2">Message Sent!</h2>
          <p className="text-white/60">
            Thanks for reaching out. Our team will get back to you shortly on WhatsApp.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ali Hassan"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">WhatsApp Number</label>
            <input
              type="tel"
              required
              placeholder="+92 300 0000000"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">Message</label>
            <textarea
              required
              rows={4}
              placeholder="Tell us what you're looking for..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/60 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl text-lg transition-colors"
          >
            Send Message
          </button>
        </form>
      )}

      {/* Direct WhatsApp link */}
      <div className="mt-10 text-center">
        <p className="text-white/40 text-sm mb-3">Or reach us directly:</p>
        <a
          href="https://wa.me/923266570023"
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
        >
          +92 326 6570023 on WhatsApp →
        </a>
      </div>
    </main>
  )
}
