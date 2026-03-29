import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="mb-16 text-center">
        <span className="text-yellow-400 text-sm font-semibold uppercase tracking-widest">Our Story</span>
        <h1 className="text-5xl font-black mt-3">About <span className="text-yellow-400">PulseGear</span></h1>
      </div>

      {/* Story */}
      <div className="space-y-8 text-white/70 text-lg leading-relaxed">
        <p>
          PulseGear was born out of a simple frustration: premium tech accessories were either too expensive or too hard to find in Pakistan. We set out to change that.
        </p>
        <p>
          Founded in Lahore, PulseGear curates high-quality wireless earbuds and stylish wrist watches — products that punch above their price point. We believe everyone deserves great tech without breaking the bank.
        </p>
        <p>
          Every product in our catalog is personally tested by our team. We only sell what we'd happily use ourselves. Orders are placed through WhatsApp for a fast, personal experience — no complicated checkouts, no waiting on hold.
        </p>
      </div>

      {/* Values */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '⚡', title: 'Fast Service', desc: 'Orders processed same day via WhatsApp.' },
          { icon: '✅', title: 'Vetted Products', desc: 'Every item tested before it reaches you.' },
          { icon: '💛', title: 'Customer First', desc: 'Your satisfaction is our only metric.' },
        ].map((v) => (
          <div key={v.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-400/30 transition-colors">
            <div className="text-3xl mb-4">{v.icon}</div>
            <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
            <p className="text-white/50 text-sm">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <p className="text-white/50 mb-6">Have questions? We're one message away.</p>
        <a
          href="https://wa.me/923266570023?text=Hi%20PulseGear!%20I%20have%20a%20question."
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
