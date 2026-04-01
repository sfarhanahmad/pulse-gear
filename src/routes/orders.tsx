import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/orders')({ component: OrdersPage })

function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('pg_token')
      if (!token) { setLoading(false); return }
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?order=created_at.desc`, {
          headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` }
        })
        setOrders(await res.json())
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const statusColor: Record<string, string> = {
    pending: '#f59e0b', confirmed: '#8b5cf6', delivered: '#10b981', cancelled: '#f87171'
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (!localStorage.getItem('pg_token')) return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '3rem' }}>🔐</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)' }}>Login to see your orders</h2>
      <Link to="/" className="pg-btn-glow" style={{ textDecoration: 'none' }}>Go Home</Link>
    </main>
  )

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', marginBottom: 32, color: 'var(--text)' }}>
        My <span className="gradient-text">Orders</span>
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '3rem', marginBottom: 16 }}>📦</p>
          <p>No orders yet. Start shopping!</p>
          <Link to="/" className="pg-btn-glow" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 20 }}>Shop Now</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '20px 24px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-border)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <span style={{ color: 'var(--text-faint)', fontSize: '0.75rem' }}>Order #{order.id}</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '2px 0 0' }}>{new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span style={{ background: `${statusColor[order.status] || '#888'}22`, color: statusColor[order.status] || '#888', border: `1px solid ${statusColor[order.status] || '#888'}44`, borderRadius: 99, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>
                  {order.status}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {order.items?.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.name} × {item.quantity}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }} className="gradient-text">Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
