import { Link, createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getProducts, getSiteContent, getCategories } from '@/lib/adminStore'
import type { Product, Category } from '@/lib/types'
import type { SiteContent } from '@/lib/adminStore'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export const Route = createFileRoute('/')({ component: HomePage })

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc'

function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [content, setContent] = useState<SiteContent | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [p, c, s] = await Promise.all([getProducts(), getCategories(), getSiteContent()])
      setProducts(p); setCategories(c); setContent(s); setLoading(false)
    }
    load()
  }, [])

  if (loading || !content) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const waLink = `https://wa.me/${content.whatsappNumber}`
  const heroTitleLines = content.heroTitle.split('\n')
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
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...(content.heroImage ? { backgroundImage: `url(${content.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--accent-subtle) 0%, var(--bg) 60%)' }} />
        <div style={{ position: 'absolute', top: '10%', right: '8%', width: 320, height: 320, borderRadius: '50%', background: 'var(--accent-subtle)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 1rem', maxWidth: 900, margin: '0 auto' }} className="animate-fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', borderRadius: 99, padding: '6px 18px', marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{content.heroTagline}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', lineHeight: 1.05, margin: '0 0 24px', letterSpacing: '-0.03em', color: 'var(--text)' }}>
            {heroTitleLines.map((line, i) => (
              <span key={i}>{i === heroTitleLines.length - 1 ? <span style={{ color: 'var(--accent)' }}>{line}</span> : <>{line}<br /></>}</span>
            ))}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>{content.heroSubtitle}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#products" style={{ background: 'var(--accent)', color: 'var(--accent-text)', fontWeight: 700, fontSize: '1rem', padding: '14px 32px', borderRadius: 14, textDecoration: 'none', fontFamily: 'var(--font-display)', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = 'var(--accent-hover)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = 'var(--accent)' }}>
              Shop Now →
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, fontSize: '1rem', padding: '14px 32px', borderRadius: 14, textDecoration: 'none', transition: 'all 0.2s' }}>
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '20px 1rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }}>
          {content.stats.map(stat => (
            <div key={stat.label}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent)' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" style={{ maxWidth: 1152, margin: '0 auto', padding: '4rem 1rem' }}>
        {/* Filter + Sort Bar — always visible */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[{ id: 'all', label: 'All', icon: '🛍️' }, ...usedCategories].map(cat => {
              const isActive = activeCategory === cat.id
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ padding: '7px 16px', borderRadius: 99, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)', background: isActive ? 'var(--accent)' : 'var(--bg-subtle)', color: isActive ? 'var(--accent-text)' : 'var(--text-muted)', border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)' }}>
                  {'icon' in cat ? `${cat.icon} ` : ''}{cat.label}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 10, padding: '7px 12px', fontSize: '0.85rem', outline: 'none', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {activeCategory === 'all' && grouped ? (
          grouped.map(cat => cat.products.length > 0 && (
            <div key={cat.id} style={{ marginBottom: '4rem' }}>
              <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', margin: 0, color: 'var(--text)' }}>{cat.label}</h2>
                <span style={{ color: 'var(--text-faint)', fontSize: '0.85rem' }}>{cat.products.length} item{cat.products.length !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {cat.products.map(p => <ProductCard key={p.id} product={p} waNumber={content.whatsappNumber} categories={categories} />)}
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
            {sorted.map(p => <ProductCard key={p.id} product={p} waNumber={content.whatsappNumber} categories={categories} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1152, margin: '0 auto', padding: '0 1rem 5rem' }}>
        <div style={{ background: 'var(--accent)', borderRadius: 24, padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,0,0,0.08)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: '#000', margin: '0 0 12px', position: 'relative' }}>{content.ctaBannerTitle}</h2>
          <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1.05rem', margin: '0 0 32px', position: 'relative' }}>{content.ctaBannerSubtitle}</p>
          <a href={`${waLink}?text=Hi!%20I'd%20like%20to%20browse%20your%20products.`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#000', color: '#fff', fontWeight: 700, fontSize: '1rem', padding: '14px 32px', borderRadius: 14, textDecoration: 'none', position: 'relative' }}>
            💬 Order on WhatsApp
          </a>
        </div>
      </section>
    </main>
  )
}

function ProductCard({ product, waNumber, categories }: { product: Product; waNumber: string; categories: Category[] }) {
  const [hovered, setHovered] = useState(false)
  const catLabel = categories.find(c => c.id === product.category)?.label ?? product.category

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hovered ? 'var(--shadow)' : 'var(--shadow-card)', borderColor: hovered ? 'var(--accent-border)' : 'var(--border)' }}>
      <Link to="/products/$productId" params={{ productId: product.id.toString() }} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--bg-subtle)' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }} />
        </div>
      </Link>
      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{catLabel}</span>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', margin: '0 0 8px', lineHeight: 1.3, color: 'var(--text)' }}>{product.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, flex: 1, margin: '0 0 20px' }}>{product.short_description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)' }}>Rs. {product.price.toLocaleString()}</span>
        </div>
        <WhatsAppButton productName={product.name} waNumber={waNumber} style={{ width: '100%', justifyContent: 'center' }} />
      </div>
    </div>
  )
}
