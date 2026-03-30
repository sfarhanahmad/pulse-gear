import { HeadContent, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'PulseGear — Premium Tech, Affordable Prices' },
      { name: 'description', content: 'Shop premium wireless earbuds and wrist watches at PulseGear. Quality tech at prices you\'ll love.' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black text-white">
      <head>
        <HeadContent />
      </head>
      <body className="bg-black text-white min-h-screen">
        <Header />
        {children}
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-yellow-400 font-black text-2xl tracking-tight">Pulse<span className="text-white">Gear</span></span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-white/70 hover:text-white transition-colors text-sm font-medium no-underline">Shop</Link>
          <Link to="/about" className="text-white/70 hover:text-white transition-colors text-sm font-medium no-underline">About</Link>
          <Link to="/contact" className="text-white/70 hover:text-white transition-colors text-sm font-medium no-underline">Contact</Link>
          <a
            href="https://wa.me/923266570023"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm px-4 py-2 rounded-lg transition-colors no-underline"
          >
            WhatsApp Us
          </a>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24 py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-yellow-400 font-black text-xl">Pulse<span className="text-white">Gear</span></span>
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} PulseGear. All rights reserved.</p>
        <div className="flex gap-4 text-sm">
          <Link to="/about" className="text-white/40 hover:text-white transition-colors no-underline">About</Link>
          <Link to="/contact" className="text-white/40 hover:text-white transition-colors no-underline">Contact</Link>
          <a href="https://wa.me/923266570023" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 transition-colors no-underline">WhatsApp</a>
          <Link to="/admin/login" className="text-white/20 hover:text-white/50 transition-colors no-underline text-xs">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
