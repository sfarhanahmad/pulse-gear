import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCart, removeFromCart, updateQuantity, getCartTotal, clearCart } from '@/lib/cart'
import type { CartItem } from '@/lib/cart'

export const Route = createFileRoute('/cart')({ component: CartPage })

function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [ordering, setOrdering] = useState(false)
  const [ordered, setOrdered] = useState(false)

  useEffect(() => {
    setCart(getCart())
    const onUpdate = () => setCart(getCart())
    window.addEventListener('pg_cart_updated', onUpdate)
    return () => window.removeEventListener('pg_cart_updated', onUpdate)
  }, [])

  async function placeOrder() {
    const token = localStorage.getItem('pg_token')
    const user = JSON.parse(localStorage.getItem('pg_user') || 'null')
    if (!token || !user) {
      window.dispatchEvent(new CustomEvent('pg_open_auth', { detail: 'login' }))
      return
    }
    setOrdering(true)
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          user_id: user.id,
          items: cart.map(i => ({ id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity })),
          total: getCartTotal(),
          status: 'pending',
        }),
      })
      clearCart()
      setOrdered(true)
    } catch { alert('Something went wrong. Try again.') }
    setOrdering(false)
  }

  if (ordered) return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '4rem' }}>✅</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)' }}>Order Placed!</h2>
      <p style={{ color: 'var(--text-muted)' }}>We'll contact you on WhatsApp to confirm delivery.</p>
      <Link to="/" className="pg-btn-glow" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>Continue Shopping</Link>
    </main>
  )

  if (cart.length === 0) return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '4rem' }}>🛒</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)' }}>Your cart is empty</h2>
      <p style={{ color: 'var(--text-muted)' }}>Add some products to get started!</p>
      <Link to="/" className="pg-btn-glow" style={{ textDecoration: 'none', display: 'inline-block' }}>Shop Now</Link>
    </main>
  )

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', marginBottom: 32, color: 'var(--text)' }}>
        Your <span className="gradient-text">Cart</span>
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {cart.map(item => (
          <div key={item.product.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-border)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <img src={item.product.image} alt={item.product.name} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 12, background: 'var(--bg-subtle)', flexShrink: 0 }}
              onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', margin: '0 0 4px', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</h3>
              <p style={{ color: 'var(--accent2)', fontWeight: 700, margin: 0 }}>Rs. {item.product.price.toLocaleString()}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700, color: 'var(--text)' }}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
            <div style={{ minWidth: 90, textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', margin: 0, color: 'var(--text)' }}>Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
            </div>
            <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', fontSize: '1rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-border)', borderRadius: 20, padding: '24px 28px', boxShadow: '0 0 32px var(--accent-glow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>Rs. {getCartTotal().toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>Total</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem' }} className="gradient-text">Rs. {getCartTotal().toLocaleString()}</span>
        </div>
        <button onClick={placeOrder} disabled={ordering} className="pg-btn-glow" style={{ width: '100%', fontSize: '1rem', padding: '14px', opacity: ordering ? 0.7 : 1 }}>
          {ordering ? 'Placing Order...' : '✅ Place Order'}
        </button>
        <p style={{ color: 'var(--text-faint)', fontSize: '0.75rem', textAlign: 'center', marginTop: 12 }}>
          Login required to place order. We'll confirm via WhatsApp.
        </p>
      </div>
    </main>
  )
}
