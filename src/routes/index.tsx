import { Link, createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getProducts, getSiteContent, getCategories } from '@/lib/adminStore'
import { addToCart } from '@/lib/cart'
import type { Product, Category } from '@/lib/types'
import type { SiteContent } from '@/lib/adminStore'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export const Route = createFileRoute('/')({ component: HomePage })

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc'

const CATEGORY_IMAGES: Record<string, string> = {
  earbuds: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
  headphones: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
  watch: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80',
  wallet: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
  powerbank: 'https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=600&q=80',
}

const ANIMATED_WORDS = ['Earbuds', 'Headphones', 'Watches', 'Wallets', 'Power Banks']

function AnimatedWord() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIndex(i => (i + 1) % ANIMATED_WORDS.length); setVisible(true) }, 400)
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  return (
    <span className="gradient-text" style={{
      display: 'inline-block', transition: 'opacity 0.4s, transform 0.4s',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-12px)',
    }}>
      {ANIMATED_WORDS[index]}
    </span>
  )
}

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [content, setContent] = useState<SiteContent | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [loading, setLoading] = useState(true)
  useScrollReveal()

  useEffect(() => {
    async function load() {
      const [p, c, s] = await Promise.all([getProducts(), getCategories(), getSiteContent()])
      setProducts(p); setCategories(c); setContent(s); setLoading(false)
    }
    load()
  }, [])

  if (loading || !content) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading PulseGear...</p>
    </div>
  )
  const waLink = `https://wa.me/${content.whatsappNumber}`
  const usedCategories = categories.filter(c => products.some(p => p.category === c.id))
  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory)
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
    return 0
  })
  const grouped = activeCategory === 'all'
    ? categories.filter(c => products.some(p => p.category === c.id)).map(c => ({ ...c, products: sorted.filter(p => p.category === c.id) }))
    : null

  return (
    <main>
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'var(--accent-subtle)', filter: 'blur(80px)', pointerEvents: 'none', animation: 'float 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(16,185,129,0.06)', filter: 'blur(60px)', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite reverse' }} />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 1rem', maxWidth: 900, margin: '0 auto' }} className="animate-fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', borderRadius: 99, padding: '6px 18px', marginBottom: 32 }} className="animate-pulse-glow">
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            <span style={{ color: 'var(--accent2)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{content.heroTagline}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', lineHeight: 1.05, margin: '0 0 12px', letterSpacing: '-0.03em', color: 'var(--text)' }}>Premium</h1>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', lineHeight: 1.05, margin: '0 0 24px', letterSpacing: '-0.03em' }}><AnimatedWord /></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>{content.heroSubtitle}</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#products" className="pg-btn-glow" style={{ textDecoration: 'none', display: 'inline-block' }}>Shop Now →</a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="pg-btn-outline" style={{ textDecoration: 'none', display: 'inline-block' }}>💬 WhatsApp Us</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '24px 1rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }}>
          {content.stats.map((stat, i) => (
            <div key={stat.label} className={`reveal reveal-delay-${i + 1}`}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem' }} className="gradient-text">{stat.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Categories */}
      <section style={{ maxWidth: 1152, margin: '0 auto', padding: '4rem 1rem 2rem' }}>
       <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', marginBottom: 24, color: 'var(--text)', animation: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>
  Shop by{' '}
  <span style={{ background: 'linear-gradient(135deg, #a78bfa, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
    Category
  </span>
</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {usedCategories.map((cat, i) => (
            <div key={cat.id} className={`cat-card reveal reveal-delay-${(i % 4) + 1}`} style={{ height: 200 }}
              onClick={() => { setActiveCategory(cat.id); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }}>
              <img src={CATEGORY_IMAGES[cat.id] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'} alt={cat.label}
                onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }} />
<div className="cat-card-overlay">
  <div>
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{cat.label}</div>
    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{products.filter(p => p.category === cat.id).length} items</div>
  </div>
</div>
      </section>
      {/* Products */}
      <section id="products" style={{ maxWidth: 1152, margin: '0 auto', padding: '2rem 1rem' }}>
        <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[{ id: 'all', label: 'All', icon: '🛍️' }, ...usedCategories].map(cat => {
              const isActive = activeCategory === cat.id
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                  padding: '7px 16px', borderRadius: 99, fontSize: '0.85rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                  background: isActive ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'var(--bg-subtle)',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  border: isActive ? 'none' : '1px solid var(--border)',
                  boxShadow: isActive ? '0 0 16px var(--accent-glow)' : 'none',
                }}>
                  {'icon' in cat ? `${cat.icon} ` : ''}{cat.label}
                </button>
              )
            })}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} className="pg-input" style={{ width: 'auto', padding: '7px 12px' }}>
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name-asc">Name: A → Z</option>
          </select>
        </div>

        {activeCategory === 'all' && grouped ? (
          grouped.map(cat => cat.products.length > 0 && (
            <div key={cat.id} style={{ marginBottom: '4rem' }}>
              <div className="reveal" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', margin: 0 }}>{cat.label}</h2>
                <span style={{ color: 'var(--text-faint)', fontSize: '0.85rem' }}>{cat.products.length} item{cat.products.length !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {cat.products.map((p, i) => <ProductCard key={p.id} product={p} waNumber={content.whatsappNumber} categories={categories} index={i} />)}
              </div>
            </div>
          ))
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '3rem', margin: '0 0 16px' }}>📦</p>
            <p>No products in this category yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {sorted.map((p, i) => <ProductCard key={p.id} product={p} waNumber={content.whatsappNumber} categories={categories} index={i} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="reveal" style={{ maxWidth: 1152, margin: '0 auto', padding: '0 1rem 5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 50%, #6d28d9 100%)', borderRadius: 24, padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: '#fff', margin: '0 0 12px', position: 'relative' }}>{content.ctaBannerTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', margin: '0 0 32px', position: 'relative' }}>{content.ctaBannerSubtitle}</p>
          <a href={`${waLink}?text=Hi!%20I'd%20like%20to%20browse%20your%20products.`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: 'var(--accent)', fontWeight: 700, fontSize: '1rem', padding: '14px 32px', borderRadius: 14, textDecoration: 'none', position: 'relative', fontFamily: 'var(--font-display)' }}>
            💬 Order on WhatsApp
          </a>
        </div>
      </section>
    </main>
  )
}

function ProductCard({ product, waNumber, categories, index }: { product: Product; waNumber: string; categories: Category[]; index: number }) {
  const [added, setAdded] = useState(false)
  const catLabel = categories.find(c => c.id === product.category)?.label ?? product.category

  function handleAddToCart() {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="product-card reveal">
      <Link to="/products/$productId" params={{ productId: product.id.toString() }} style={{ display: 'block', textDecoration: 'none' }}>
        <div className="card-img">
          <img src={product.image} alt={product.name} onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }} />
        </div>
      </Link>
      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ color: 'var(--accent2)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{catLabel}</span>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', margin: '0 0 8px', lineHeight: 1.3, color: 'var(--text)' }}>{product.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, flex: 1, margin: '0 0 20px' }}>{product.short_description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)' }}>Rs. {product.price.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleAddToCart} style={{
            flexShrink: 0, background: added ? 'var(--accent)' : 'var(--accent-subtle)',
            border: '1px solid var(--accent-border)', color: added ? '#fff' : 'var(--accent2)',
            borderRadius: 12, padding: '10px 14px', cursor: 'pointer', fontSize: '1rem',
            transition: 'all 0.2s', fontFamily: 'var(--font-body)',
            boxShadow: added ? '0 0 16px var(--accent-glow)' : 'none',
          }}>
            {added ? '✓' : '🛒'}
          </button>
          <WhatsAppButton productName={product.name} waNumber={waNumber} style={{ flex: 1, justifyContent: 'center' }} />
        </div>
      </div>
    </div>
  )
}
