import { Link, createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getProducts, getSiteContent } from '@/lib/adminStore'
import { getCategories } from '@/lib/adminStore'
import type { Product } from '@/lib/types'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export const Route = createFileRoute('/products/$productId')({ component: RouteComponent })

function RouteComponent() {
  const { productId } = Route.useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [waNumber, setWaNumber] = useState('923266570023')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const found = getProducts().find(p => p.id === parseInt(productId))
    if (found) { setProduct(found) } else { setNotFound(true) }
    setWaNumber(getSiteContent().whatsappNumber)
  }, [productId])

  if (notFound) return (
    <main style={{ maxWidth: 1152, margin: '0 auto', padding: '5rem 1rem', textAlign: 'center' }}>
      <p style={{ fontSize: '3rem' }}>😕</p>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Product Not Found</h1>
      <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Back to shop</Link>
    </main>
  )

  if (!product) return null

  const catLabel = getCategories().find(c => c.id === product.category)?.label ?? product.category

  return (
    <main style={{ maxWidth: 1152, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: 40, transition: 'color 0.2s' }}
        onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text)' }}
        onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-muted)' }}>
        ← Back to all products
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        <div style={{ borderRadius: 24, overflow: 'hidden', background: 'var(--bg-subtle)', border: '1px solid var(--border)', aspectRatio: '1' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }} />
        </div>

        <div>
          <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{catLabel}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', margin: '12px 0 16px', color: 'var(--text)', lineHeight: 1.15 }}>{product.name}</h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', marginBottom: 32 }}>{product.description}</p>

          <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Price</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--accent)' }}>Rs. {product.price.toLocaleString()}</span>
          </div>

          <WhatsAppButton productName={product.name} waNumber={waNumber} style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px 24px' }} />

          <p style={{ color: 'var(--text-faint)', fontSize: '0.8rem', textAlign: 'center', marginTop: 16 }}>
            ⚡ Fast delivery &nbsp;·&nbsp; 🔒 Secure ordering &nbsp;·&nbsp; ✅ Trusted seller
          </p>
        </div>
      </div>
    </main>
  )
}
