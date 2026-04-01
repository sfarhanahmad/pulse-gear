import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { isAdminAuthenticated, adminLogout } from '@/lib/adminAuth'
import {
  getProducts, addProduct, updateProduct, deleteProduct,
  getSiteContent, saveSiteContent,
  getCategories, addCategory, updateCategory, deleteCategory,
  uploadImage, fileToBase64,
  getLogoImageLocal, saveLogoImageLocal,
  type SiteContent,
} from '@/lib/adminStore'
import type { Product, Category } from '@/lib/types'

export const Route = createFileRoute('/admin/')({ component: AdminDashboard })

type Tab = 'products' | 'categories' | 'content' | 'images'

const S = {
  input: { width: '100%', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 16px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none' } as React.CSSProperties,
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 } as React.CSSProperties,
  card: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' } as React.CSSProperties,
  btn: (accent = false) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', border: accent ? 'none' : '1px solid var(--border)', transition: 'all 0.2s', fontFamily: 'var(--font-body)', background: accent ? 'var(--accent)' : 'var(--bg-subtle)', color: accent ? 'var(--accent-text)' : 'var(--text)' } as React.CSSProperties),
}

function useToast() {
  const [toast, setToast] = useState('')
  function show(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const el = toast ? (
    <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--accent)', color: 'var(--accent-text)', fontWeight: 700, padding: '12px 20px', borderRadius: 12, boxShadow: 'var(--shadow)', zIndex: 999, fontFamily: 'var(--font-body)' }}>
      ✓ {toast}
    </div>
  ) : null
  return { show, el }
}

function Modal({ children, onClose, wide = false }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, width: '100%', maxWidth: wide ? 640 : 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow)' }}>
        {children}
      </div>
    </div>
  )
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadAll() {
    setLoading(true)
    const [p, c, s] = await Promise.all([getProducts(), getCategories(), getSiteContent()])
    setProducts(p); setCategories(c); setSiteContent(s)
    setLoading(false)
  }

  useEffect(() => {
    if (!isAdminAuthenticated()) { navigate({ to: '/admin/login' }); return }
    loadAll()
  }, [navigate])

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'products',   label: 'Products',       icon: '📦' },
    { id: 'categories', label: 'Categories',      icon: '🏷️' },
    { id: 'content',    label: 'Website Content', icon: '✏️' },
    { id: 'images',     label: 'Images & Logo',   icon: '🖼️' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Loading admin panel...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--nav-bg)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent)' }}>Pulse<span style={{ color: 'var(--text)' }}>Gear</span></span>
            <span style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', color: 'var(--accent)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>View Site ↗</a>
            <button onClick={() => { adminLogout(); navigate({ to: '/admin/login' }) }} style={{ ...S.btn(), fontSize: '0.8rem' }}>Logout</button>
          </div>
        </div>
      </header>

      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1rem', display: 'flex', gap: 4, paddingTop: 12 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 18px', borderRadius: '10px 10px 0 0', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s', fontFamily: 'var(--font-body)', background: tab === t.id ? 'var(--accent)' : 'transparent', color: tab === t.id ? 'var(--accent-text)' : 'var(--text-muted)' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1rem' }}>
        {tab === 'products'   && <ProductsTab   products={products}   categories={categories} onRefresh={loadAll} />}
        {tab === 'categories' && <CategoriesTab categories={categories} onRefresh={loadAll} />}
        {tab === 'content'    && siteContent && <ContentTab content={siteContent} onRefresh={loadAll} />}
        {tab === 'images'     && <ImagesTab products={products} onRefresh={loadAll} />}
      </div>
    </div>
  )
}

// ─── Categories Tab ───────────────────────────────────────────────────────────
function CategoriesTab({ categories, onRefresh }: { categories: Category[]; onRefresh: () => void }) {
  const { show, el } = useToast()
  const [editing, setEditing] = useState<Category | null>(null)
  const [adding, setAdding] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function handleDelete(id: string) {
    await deleteCategory(id); setConfirmDelete(null); onRefresh(); show('Category deleted.')
  }

  return (
    <div>
      {el}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', margin: 0, color: 'var(--text)' }}>Categories</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>Changes instantly show on the website and sort menu for all visitors</p>
        </div>
        <button onClick={() => setAdding(true)} style={S.btn(true)}>+ Add Category</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ ...S.card, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', margin: 0, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.label}</p>
                <p style={{ color: 'var(--text-faint)', fontSize: '0.7rem', margin: '2px 0 0', fontFamily: 'monospace' }}>{cat.id}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEditing(cat)} style={{ ...S.btn(), flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>✏️ Edit</button>
              <button onClick={() => setConfirmDelete(cat.id)} style={{ ...S.btn(), color: '#f87171', borderColor: 'rgba(248,113,113,0.3)', fontSize: '0.8rem', padding: '9px 12px' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <CategoryModal category={editing} onClose={() => { setAdding(false); setEditing(null) }}
          onSave={() => { setAdding(false); setEditing(null); onRefresh(); show(editing ? 'Category updated!' : 'Category added!') }} />
      )}

      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(null)}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', margin: '0 0 8px', color: 'var(--text)' }}>Delete Category?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 24px' }}>Products in this category will be moved to "Other".</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setConfirmDelete(null)} style={{ ...S.btn(), flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button onClick={() => handleDelete(confirmDelete)} style={{ ...S.btn(), flex: 1, justifyContent: 'center', background: '#ef4444', color: '#fff', border: 'none' }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
function CategoryModal({ category, onClose, onSave }: { category: Category | null; onClose: () => void; onSave: () => void }) {
  const isEdit = !!category
  const [label, setLabel] = useState(category?.label ?? '')
  const [icon, setIcon] = useState(category?.icon ?? '📦')
  const [image, setImage] = useState((category as any)?.image ?? '')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const EMOJIS = ['🎧','🎵','⌚','👛','🔋','📱','💻','🖥️','⌨️','🖱️','📷','🎮','🔌','🔦','🎒','👓','💡','🔧','📡','🎁']

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, `categories/${Date.now()}_${file.name}`)
      setImage(url)
    } catch {
      const b64 = await fileToBase64(file)
      setImage(b64)
    }
    setUploading(false)
  }

  async function handleSave() {
    if (!label.trim()) return
    setSaving(true)
    if (isEdit && category) { await updateCategory(category.id, { label, icon, image } as any) }
    else { await addCategory({ label, icon, image } as any) }
    setSaving(false)
    onSave()
  }

  return (
    <Modal onClose={onClose}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', margin: '0 0 24px', color: 'var(--text)' }}>{isEdit ? 'Edit Category' : 'Add New Category'}</h2>
      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>Category Name *</label>
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Smart Speakers" style={S.input} autoFocus />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>Category Image</label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ width: 80, height: 80, borderRadius: 12, background: 'var(--bg-subtle)', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
            {image ? <img src={image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: '0.65rem', textAlign: 'center', padding: 4 }}>No image</div>}
          </div>
          <div style={{ flex: 1 }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...S.btn(), width: '100%', justifyContent: 'center', marginBottom: 8 }}>
              {uploading ? 'Uploading...' : '📁 Upload Image'}
            </button>
            <input type="text" value={image.startsWith('data:') ? '' : image} onChange={e => setImage(e.target.value)} placeholder="Or paste image URL..." style={S.input} />
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>Icon (emoji)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: '2rem' }}>{icon}</span>
          <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="Paste any emoji" style={{ ...S.input, flex: 1 }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {EMOJIS.map(e => (
            <button key={e} onClick={() => setIcon(e)} style={{ fontSize: '1.3rem', background: icon === e ? 'var(--accent-subtle)' : 'var(--bg-subtle)', border: `1px solid ${icon === e ? 'var(--accent-border)' : 'var(--border)'}`, borderRadius: 8, padding: '4px 8px', cursor: 'pointer' }}>{e}</button>
          ))}
        </div>
      </div>
      {label && (
        <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          {image && <img src={image} alt="preview" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }} />}
          <span style={{ fontSize: '1.4rem' }}>{icon}</span>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preview</p>
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>{label}</p>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ ...S.btn(), flex: 1, justifyContent: 'center' }}>Cancel</button>
        <button onClick={handleSave} disabled={!label.trim() || saving} style={{ ...S.btn(true), flex: 1, justifyContent: 'center', opacity: label.trim() ? 1 : 0.5 }}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Category'}
        </button>
      </div>
    </Modal>
  )
}

// ─── Products Tab ─────────────────────────────────────────────────────────────
function ProductsTab({ products, categories, onRefresh }: { products: Product[]; categories: Category[]; onRefresh: () => void }) {
  const { show, el } = useToast()
  const [editing, setEditing] = useState<Product | null>(null)
  const [adding, setAdding] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  async function handleDelete(id: number) { await deleteProduct(id); setConfirmDelete(null); onRefresh(); show('Product deleted.') }

  return (
    <div>
      {el}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', margin: 0, color: 'var(--text)' }}>Products</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>{products.length} products — visible to everyone worldwide</p>
        </div>
        <button onClick={() => setAdding(true)} style={S.btn(true)}>+ Add Product</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
        {products.map(product => {
          const cat = categories.find(c => c.id === product.category)
          return (
            <div key={product.id} style={S.card}>
              <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'var(--bg-subtle)' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }} />
              </div>
              <div style={{ padding: 16 }}>
                <span style={{ color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{cat ? `${cat.icon} ${cat.label}` : product.category}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', margin: '6px 0 4px', color: 'var(--text)', lineHeight: 1.3 }}>{product.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '0 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.short_description}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent)', margin: '0 0 14px' }}>Rs. {product.price.toLocaleString()}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setEditing(product)} style={{ ...S.btn(), flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>✏️ Edit</button>
                  <button onClick={() => setConfirmDelete(product.id)} style={{ ...S.btn(), color: '#f87171', borderColor: 'rgba(248,113,113,0.3)', fontSize: '0.8rem', padding: '9px 12px' }}>🗑️</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {(adding || editing) && (
        <ProductModal product={editing} categories={categories}
          onClose={() => { setAdding(false); setEditing(null) }}
          onSave={() => { setAdding(false); setEditing(null); onRefresh(); show(editing ? 'Product updated!' : 'Product added!') }} />
      )}

      {confirmDelete !== null && (
        <Modal onClose={() => setConfirmDelete(null)}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', margin: '0 0 8px', color: 'var(--text)' }}>Delete Product?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 24px' }}>This cannot be undone.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setConfirmDelete(null)} style={{ ...S.btn(), flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button onClick={() => handleDelete(confirmDelete)} style={{ ...S.btn(), flex: 1, justifyContent: 'center', background: '#ef4444', color: '#fff', border: 'none' }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function ProductModal({ product, categories, onClose, onSave }: { product: Product | null; categories: Category[]; onClose: () => void; onSave: () => void }) {
  const isEdit = !!product
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ name: product?.name ?? '', category: product?.category ?? (categories[0]?.id ?? ''), price: product?.price?.toString() ?? '', short_description: product?.short_description ?? '', description: product?.description ?? '', image: product?.image ?? '/placeholder.png' })
  const [imagePreview, setImagePreview] = useState(product?.image ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, `products/${Date.now()}_${file.name}`)
      setForm(f => ({ ...f, image: url })); setImagePreview(url)
    } catch { 
      const b64 = await fileToBase64(file)
      setForm(f => ({ ...f, image: b64 })); setImagePreview(b64)
    }
    setUploading(false)
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.description || !form.short_description) return
    setSaving(true)
    const data = { name: form.name, category: form.category, price: parseInt(form.price), short_description: form.short_description, description: form.description, image: form.image }
    if (isEdit && product) { await updateProduct(product.id, data) } else { await addProduct(data) }
    setSaving(false); onSave()
  }

  return (
    <Modal onClose={onClose} wide>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', margin: '0 0 24px', color: 'var(--text)' }}>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      <div style={{ overflowY: 'auto', maxHeight: '65vh', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={S.label}>Product Image</label>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 100, height: 100, borderRadius: 12, background: 'var(--bg-subtle)', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
              {imagePreview ? <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: '0.7rem' }}>No image</div>}
            </div>
            <div style={{ flex: 1 }}>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...S.btn(), width: '100%', justifyContent: 'center', marginBottom: 8 }}>{uploading ? 'Uploading...' : '📁 Upload Image'}</button>
              <input type="text" value={form.image.startsWith('data:') ? '' : form.image} onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImagePreview(e.target.value) }} placeholder="Or paste image URL..." style={S.input} />
            </div>
          </div>
        </div>
        <div><label style={S.label}>Product Name *</label><input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Sony WH-1000XM5" style={S.input} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={S.label}>Category *</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={S.input}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div><label style={S.label}>Price (Rs.) *</label><input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="1500" min="1" style={S.input} /></div>
        </div>
        <div><label style={S.label}>Short Description *</label><input type="text" value={form.short_description} onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))} placeholder="One-line summary" style={S.input} /></div>
        <div><label style={S.label}>Full Description *</label><textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Full product description..." style={{ ...S.input, resize: 'none' }} /></div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={onClose} style={{ ...S.btn(), flex: 1, justifyContent: 'center' }}>Cancel</button>
        <button onClick={handleSave} disabled={saving || !form.name || !form.price} style={{ ...S.btn(true), flex: 1, justifyContent: 'center', opacity: saving || !form.name || !form.price ? 0.6 : 1 }}>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}</button>
      </div>
    </Modal>
  )
}

// ─── Content Tab ──────────────────────────────────────────────────────────────
function ContentTab({ content, onRefresh }: { content: SiteContent; onRefresh: () => void }) {
  const { show, el } = useToast()
  const [form, setForm] = useState(content)
  const [section, setSection] = useState<'hero' | 'stats' | 'cta' | 'about'>('hero')
  const [saving, setSaving] = useState(false)

  async function handleSave() { setSaving(true); await saveSiteContent(form); setSaving(false); show('Saved!'); onRefresh() }
  function updateStat(i: number, field: 'value' | 'label', val: string) { const s = [...form.stats]; s[i] = { ...s[i], [field]: val }; setForm(f => ({ ...f, stats: s })) }
  function updateAboutValue(i: number, field: 'icon' | 'title' | 'desc', val: string) { const v = [...form.aboutValues]; v[i] = { ...v[i], [field]: val }; setForm(f => ({ ...f, aboutValues: v })) }
  function updateAboutStory(i: number, val: string) { const s = [...form.aboutStory]; s[i] = val; setForm(f => ({ ...f, aboutStory: s })) }

  return (
    <div>
      {el}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', margin: 0, color: 'var(--text)' }}>Website Content</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>Changes saved to database — visible to all visitors</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ ...S.btn(true), opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : '💾 Save Changes'}</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[{ id: 'hero' as const, label: '🏠 Hero' }, { id: 'stats' as const, label: '📊 Stats' }, { id: 'cta' as const, label: '📣 CTA' }, { id: 'about' as const, label: '📖 About' }].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{ ...S.btn(section === s.id), borderRadius: 99 }}>{s.label}</button>
        ))}
      </div>
      <div style={{ ...S.card, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {section === 'hero' && (<>
          <div><label style={S.label}>Hero Tagline</label><input value={form.heroTagline} onChange={e => setForm(f => ({ ...f, heroTagline: e.target.value }))} style={S.input} /></div>
          <div><label style={S.label}>Hero Title (use \n for line break)</label><textarea rows={2} value={form.heroTitle} onChange={e => setForm(f => ({ ...f, heroTitle: e.target.value }))} style={{ ...S.input, resize: 'none' }} /></div>
          <div><label style={S.label}>Hero Subtitle</label><textarea rows={3} value={form.heroSubtitle} onChange={e => setForm(f => ({ ...f, heroSubtitle: e.target.value }))} style={{ ...S.input, resize: 'none' }} /></div>
          <div><label style={S.label}>WhatsApp Number (with country code)</label><input value={form.whatsappNumber} onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))} style={S.input} placeholder="923266570023" /></div>
        </>)}
        {section === 'stats' && form.stats.map((stat, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: 'var(--bg-subtle)', borderRadius: 12, padding: 16 }}>
            <div><label style={S.label}>Stat {i + 1} Value</label><input value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} style={S.input} /></div>
            <div><label style={S.label}>Label</label><input value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} style={S.input} /></div>
          </div>
        ))}
        {section === 'cta' && (<>
          <div><label style={S.label}>CTA Title</label><input value={form.ctaBannerTitle} onChange={e => setForm(f => ({ ...f, ctaBannerTitle: e.target.value }))} style={S.input} /></div>
          <div><label style={S.label}>CTA Subtitle</label><input value={form.ctaBannerSubtitle} onChange={e => setForm(f => ({ ...f, ctaBannerSubtitle: e.target.value }))} style={S.input} /></div>
        </>)}
        {section === 'about' && (<>
          {form.aboutStory.map((para, i) => <div key={i}><label style={S.label}>Paragraph {i + 1}</label><textarea rows={3} value={para} onChange={e => updateAboutStory(i, e.target.value)} style={{ ...S.input, resize: 'none' }} /></div>)}
          {form.aboutValues.map((v, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr 2fr', gap: 10, background: 'var(--bg-subtle)', borderRadius: 12, padding: 14 }}>
              <div><label style={S.label}>Icon</label><input value={v.icon} onChange={e => updateAboutValue(i, 'icon', e.target.value)} style={S.input} /></div>
              <div><label style={S.label}>Title</label><input value={v.title} onChange={e => updateAboutValue(i, 'title', e.target.value)} style={S.input} /></div>
              <div><label style={S.label}>Description</label><input value={v.desc} onChange={e => updateAboutValue(i, 'desc', e.target.value)} style={S.input} /></div>
            </div>
          ))}
        </>)}
      </div>
    </div>
  )
}

// ─── Images Tab ───────────────────────────────────────────────────────────────
function ImagesTab({ products, onRefresh }: { products: Product[]; onRefresh: () => void }) {
  const { show, el } = useToast()
  const [logoImage, setLogoImage] = useState(getLogoImageLocal())
  const logoFileRef = useRef<HTMLInputElement>(null)
  const productFileRefs = useRef<Record<number, HTMLInputElement | null>>({})

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const b64 = await fileToBase64(file); saveLogoImageLocal(b64); setLogoImage(b64); show('Logo updated!')
  }

  async function handleProductImageUpload(productId: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    show('Uploading image...')
    try {
      const url = await uploadImage(file, `products/${productId}_${Date.now()}`)
      await updateProduct(productId, { image: url }); onRefresh(); show('Product image updated!')
    } catch {
      const b64 = await fileToBase64(file)
      await updateProduct(productId, { image: b64 }); onRefresh(); show('Product image updated!')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {el}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', margin: 0, color: 'var(--text)' }}>Images & Logo</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>Product images are saved to Supabase storage — visible to everyone</p>
      </div>

      {/* Logo */}
      <div style={S.card}>
        <div style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, margin: '0 0 4px', color: 'var(--text)' }}>🏷️ Website Logo</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 16px' }}>Replaces "PulseGear" text. Saved in your browser only.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 160, height: 56, borderRadius: 12, background: 'var(--bg-subtle)', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
              {logoImage ? <img src={logoImage} alt="Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} /> : <span style={{ color: 'var(--text-faint)', fontSize: '0.75rem' }}>No logo set</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input ref={logoFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
              <button onClick={() => logoFileRef.current?.click()} style={S.btn(true)}>📁 Upload Logo</button>
              {logoImage && <button onClick={() => { saveLogoImageLocal(''); setLogoImage(''); show('Removed.') }} style={{ ...S.btn(), color: '#f87171' }}>Remove</button>}
            </div>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div style={S.card}>
        <div style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, margin: '0 0 16px', color: 'var(--text)' }}>📦 Product Images</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {products.map(product => (
              <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-subtle)', borderRadius: 12, padding: '10px 14px' }}>
                <div style={{ width: 52, height: 52, borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }} />
                </div>
                <p style={{ flex: 1, margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                <input ref={el => { productFileRefs.current[product.id] = el }} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleProductImageUpload(product.id, e)} />
                <button onClick={() => productFileRefs.current[product.id]?.click()} style={{ ...S.btn(), fontSize: '0.78rem', padding: '7px 12px' }}>Change</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
