import { Link, createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getProducts, getSiteContent } from '@/lib/adminStore'
import { CATEGORIES } from '@/lib/types'
import type { Product, Category } from '@/lib/types'
import type { SiteContent } from '@/lib/adminStore'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export const Route = createFileRoute('/')({
  component: HomePage,
})

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc'

function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [content, setContent] = useState<SiteContent | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('default')

  useEffect(() => {
    setProducts(getProducts())
    setContent(getSiteContent())
    function onUpdate() { setProducts(getProducts()); setContent(getSiteContent()) }
    window.addEventListener('pg_products_updated', onUpdate)
    window.addEventListener('pg_content_updated', onUpdate)
    return () => {
      window.removeEventListener('pg_products_updated', onUpdate)
      window.removeEventListener('pg_content_updated', onUpdate)
    }
  }, [])

  if (!content) return null

  const waLink = `https://wa.me/${content.whatsappNumber}`
  const heroTitleLines = content.heroTitle.split('\n')

  // Get categories that actually have products
  const usedCategories = CATEGORIES.filter(c => products.some(p => p.category === c.id))

  // Filter by category
  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory)

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
    return 0
  })

  // Group by category for "all" view
  const groupedByCategory = activeCategory === 'all'
    ? CATEGORIES.filter(c => products.some(p => p.category === c.id)).map(c => ({
        ...c,
        products: sorted.filter(p => p.category === c.id),
      }))
    : null

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        style={content.heroImage ? { backgroundImage: `url(${content.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-black to-black" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            {content.heroTagline}
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            {heroTitleLines.map((line, i) => (
              <span key={i}>
                {i === heroTitleLines.length - 1
                  ? <span className="text-yellow-400">{line}</span>
                  : <>{line}<br /></>}
              </span>
            ))}
          </h1>
          <p className="text-white/60 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">{content.heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-xl text-lg transition-colors">Shop Now</a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="border border-white/20 hover:border-white/50 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors">Chat on WhatsApp</a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {content.stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-yellow-400 font-black text-2xl">{stat.value}</div>
              <div className="text-white/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-16">

        {/* Category Filter + Sort Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeCategory === 'all' ? 'bg-yellow-400 text-black' : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30'}`}
            >
              🛍️ All Products
            </button>
            {usedCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeCategory === cat.id ? 'bg-yellow-400 text-black' : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30'}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-white/40 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-yellow-400/60 cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid - grouped by category when showing all */}
        {activeCategory === 'all' && groupedByCategory ? (
          groupedByCategory.map(cat => (
            cat.products.length > 0 && (
              <div key={cat.id} className="mb-16">
                <div className="mb-8">
                  <span className="text-yellow-400 text-sm font-semibold uppercase tracking-widest">{cat.icon} {cat.label}</span>
                  <h2 className="text-3xl font-black mt-2">{cat.label}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.products.map(product => (
                    <ProductCard key={product.id} product={product} waNumber={content.whatsappNumber} />
                  ))}
                </div>
              </div>
            )
          ))
        ) : (
          <>
            {sorted.length === 0 ? (
              <div className="text-center py-20 text-white/30">
                <p className="text-5xl mb-4">📦</p>
                <p className="text-lg">No products in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map(product => (
                  <ProductCard key={product.id} product={product} waNumber={content.whatsappNumber} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-yellow-400 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-4">{content.ctaBannerTitle}</h2>
          <p className="text-black/70 text-lg mb-8">{content.ctaBannerSubtitle}</p>
          <a
            href={`${waLink}?text=Hi!%20I'd%20like%20to%20browse%20your%20products.`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Order on WhatsApp
          </a>
        </div>
      </section>
    </main>
  )
}

function ProductCard({ product, waNumber }: { product: Product; waNumber: string }) {
  const catLabel = CATEGORIES.find(c => c.id === product.category)?.label ?? product.category

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-400/40 transition-all duration-300 group flex flex-col">
      <Link to="/products/$productId" params={{ productId: product.id.toString() }} className="block">
        <div className="aspect-square overflow-hidden bg-white/5">
          <img
            src={product.image} alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }}
          />
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <span className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-2">{catLabel}</span>
        <h3 className="text-lg font-bold mb-2 leading-snug">{product.name}</h3>
        <p className="text-white/50 text-sm leading-relaxed flex-1">{product.shortDescription}</p>
        <div className="flex items-center justify-between mt-6">
          <span className="text-2xl font-black text-white">Rs. {product.price.toLocaleString()}</span>
        </div>
        <WhatsAppButton productName={product.name} waNumber={waNumber} className="mt-4 w-full justify-center" />
      </div>
    </div>
  )
}
