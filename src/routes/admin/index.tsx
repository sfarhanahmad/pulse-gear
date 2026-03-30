import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { isAdminAuthenticated, adminLogout } from '@/lib/adminAuth'
import {
  getProducts,
  saveProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getSiteContent,
  saveSiteContent,
  fileToBase64,
  saveImage,
  getImage,
  type SiteContent,
} from '@/lib/adminStore'
import type { Product } from '@/lib/types'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

type Tab = 'products' | 'content' | 'images'

function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null)

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate({ to: '/admin/login' })
      return
    }
    setProducts(getProducts())
    setSiteContent(getSiteContent())
  }, [navigate])

  function handleLogout() {
    adminLogout()
    navigate({ to: '/admin/login' })
  }

  function refreshProducts() {
    setProducts(getProducts())
  }

  function refreshContent() {
    setSiteContent(getSiteContent())
  }

  if (!siteContent) return null

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-yellow-400 font-black text-xl">
              Pulse<span className="text-white">Gear</span>
            </span>
            <span className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1 pt-4">
            {[
              { id: 'products' as Tab, label: 'Products', icon: '📦' },
              { id: 'content' as Tab, label: 'Website Content', icon: '✏️' },
              { id: 'images' as Tab, label: 'Images', icon: '🖼️' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all ${
                  tab === t.id
                    ? 'bg-yellow-400 text-black'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {tab === 'products' && (
          <ProductsTab products={products} onRefresh={refreshProducts} />
        )}
        {tab === 'content' && (
          <ContentTab content={siteContent} onRefresh={refreshContent} />
        )}
        {tab === 'images' && (
          <ImagesTab products={products} onRefresh={refreshProducts} />
        )}
      </div>
    </div>
  )
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab({ products, onRefresh }: { products: Product[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<Product | null>(null)
  const [adding, setAdding] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleDelete(id: number) {
    deleteProduct(id)
    setConfirmDelete(null)
    onRefresh()
    showToast('Product deleted.')
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          ✓ {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black">Products</h2>
          <p className="text-white/40 text-sm mt-1">{products.length} products total</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-400/30 transition-all">
            <div className="aspect-video bg-white/5 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }}
              />
            </div>
            <div className="p-4">
              <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">
                {product.category === 'earbuds' ? 'Earbuds' : 'Watch'}
              </span>
              <h3 className="font-bold mt-1 leading-snug">{product.name}</h3>
              <p className="text-white/40 text-xs mt-1 line-clamp-2">{product.shortDescription}</p>
              <p className="text-yellow-400 font-black text-lg mt-3">Rs. {product.price.toLocaleString()}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditing(product)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(product.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(adding || editing) && (
        <ProductModal
          product={editing}
          onClose={() => { setAdding(false); setEditing(null) }}
          onSave={() => { setAdding(false); setEditing(null); onRefresh(); showToast(editing ? 'Product updated!' : 'Product added!') }}
        />
      )}

      {/* Delete Confirm */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-black mb-2">Delete Product?</h3>
            <p className="text-white/50 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-semibold transition-colors">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductModal({ product, onClose, onSave }: {
  product: Product | null
  onClose: () => void
  onSave: () => void
}) {
  const isEdit = !!product
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: product?.name ?? '',
    category: product?.category ?? 'earbuds' as 'earbuds' | 'watch',
    price: product?.price?.toString() ?? '',
    shortDescription: product?.shortDescription ?? '',
    description: product?.description ?? '',
    image: product?.image ?? '/placeholder.png',
  })
  const [imagePreview, setImagePreview] = useState(product?.image ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const base64 = await fileToBase64(file)
      const key = `product_${Date.now()}`
      saveImage(key, base64)
      setForm(f => ({ ...f, image: base64 }))
      setImagePreview(base64)
    } catch (err) {
      console.error(err)
    }
    setUploading(false)
  }

  function handleSave() {
    if (!form.name || !form.price || !form.description || !form.shortDescription) return
    setSaving(true)
    const data = {
      name: form.name,
      category: form.category,
      price: parseInt(form.price),
      shortDescription: form.shortDescription,
      description: form.description,
      image: form.image,
    }
    if (isEdit && product) {
      updateProduct(product.id, data)
    } else {
      addProduct(data)
    }
    setSaving(false)
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-black">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-white/60 mb-2">Product Image</label>
            <div className="flex items-start gap-4">
              <div className="w-28 h-28 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No image</div>
                )}
              </div>
              <div className="flex-1">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors w-full"
                >
                  {uploading ? 'Uploading...' : '📁 Upload Image'}
                </button>
                <p className="text-white/30 text-xs mt-2">Or enter URL:</p>
                <input
                  type="text"
                  value={form.image.startsWith('data:') ? '' : form.image}
                  onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImagePreview(e.target.value) }}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400/40 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-white/60 mb-2">Product Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. M04 TWS Wireless Earbuds"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/60 transition-colors"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as 'earbuds' | 'watch' }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400/60 transition-colors"
              >
                <option value="earbuds">Wireless Earbuds</option>
                <option value="watch">Wrist Watch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">Price (Rs.) *</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="e.g. 1500"
                min="1"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/60 transition-colors"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-semibold text-white/60 mb-2">Short Description *</label>
            <input
              type="text"
              required
              value={form.shortDescription}
              onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
              placeholder="One-line summary shown on product cards"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/60 transition-colors"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-semibold text-white/60 mb-2">Full Description *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Full product description shown on product page..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/60 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-white/10">
          <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-semibold transition-colors">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.price || !form.description || !form.shortDescription}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-colors"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Content Tab ──────────────────────────────────────────────────────────────

function ContentTab({ content, onRefresh }: { content: SiteContent; onRefresh: () => void }) {
  const [form, setForm] = useState(content)
  const [saved, setSaved] = useState(false)
  const [section, setSection] = useState<'hero' | 'stats' | 'cta' | 'about'>('hero')

  function handleSave() {
    saveSiteContent(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    onRefresh()
  }

  function updateStat(i: number, field: 'value' | 'label', val: string) {
    const stats = [...form.stats]
    stats[i] = { ...stats[i], [field]: val }
    setForm(f => ({ ...f, stats }))
  }

  function updateAboutValue(i: number, field: 'icon' | 'title' | 'desc', val: string) {
    const aboutValues = [...form.aboutValues]
    aboutValues[i] = { ...aboutValues[i], [field]: val }
    setForm(f => ({ ...f, aboutValues }))
  }

  function updateAboutStory(i: number, val: string) {
    const aboutStory = [...form.aboutStory]
    aboutStory[i] = val
    setForm(f => ({ ...f, aboutStory }))
  }

  const sectionTabs = [
    { id: 'hero' as const, label: '🏠 Hero' },
    { id: 'stats' as const, label: '📊 Stats' },
    { id: 'cta' as const, label: '📣 CTA Banner' },
    { id: 'about' as const, label: '📖 About Page' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black">Website Content</h2>
          <p className="text-white/40 text-sm mt-1">Edit all text and content visible to customers</p>
        </div>
        <button
          onClick={handleSave}
          className={`font-bold px-6 py-2.5 rounded-xl text-sm transition-all ${saved ? 'bg-green-400 text-black' : 'bg-yellow-400 hover:bg-yellow-300 text-black'}`}
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sectionTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setSection(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${section === t.id ? 'bg-yellow-400/20 border border-yellow-400/40 text-yellow-400' : 'bg-white/5 text-white/50 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
        {section === 'hero' && (
          <>
            <Field label="Hero Tagline (small badge text)">
              <input
                value={form.heroTagline}
                onChange={e => setForm(f => ({ ...f, heroTagline: e.target.value }))}
                className={inputCls}
                placeholder="New Arrivals Available"
              />
            </Field>
            <Field label="Hero Title (use \\n for line break)">
              <textarea
                rows={2}
                value={form.heroTitle}
                onChange={e => setForm(f => ({ ...f, heroTitle: e.target.value }))}
                className={`${inputCls} resize-none`}
              />
            </Field>
            <Field label="Hero Subtitle">
              <textarea
                rows={3}
                value={form.heroSubtitle}
                onChange={e => setForm(f => ({ ...f, heroSubtitle: e.target.value }))}
                className={`${inputCls} resize-none`}
              />
            </Field>
            <Field label="WhatsApp Number (numbers only, include country code)">
              <input
                value={form.whatsappNumber}
                onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))}
                className={inputCls}
                placeholder="923266570023"
              />
            </Field>
          </>
        )}

        {section === 'stats' && (
          <>
            <p className="text-white/40 text-sm">The 4 stats shown in the bar below the hero section.</p>
            {form.stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 bg-white/5 rounded-xl p-4">
                <Field label={`Stat ${i + 1} Value`}>
                  <input value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} className={inputCls} placeholder="500+" />
                </Field>
                <Field label="Label">
                  <input value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} className={inputCls} placeholder="Happy Customers" />
                </Field>
              </div>
            ))}
          </>
        )}

        {section === 'cta' && (
          <>
            <Field label="CTA Banner Title">
              <input
                value={form.ctaBannerTitle}
                onChange={e => setForm(f => ({ ...f, ctaBannerTitle: e.target.value }))}
                className={inputCls}
              />
            </Field>
            <Field label="CTA Banner Subtitle">
              <input
                value={form.ctaBannerSubtitle}
                onChange={e => setForm(f => ({ ...f, ctaBannerSubtitle: e.target.value }))}
                className={inputCls}
              />
            </Field>
          </>
        )}

        {section === 'about' && (
          <>
            <p className="text-white/40 text-sm mb-2">About page story paragraphs:</p>
            {form.aboutStory.map((para, i) => (
              <Field key={i} label={`Paragraph ${i + 1}`}>
                <textarea
                  rows={3}
                  value={para}
                  onChange={e => updateAboutStory(i, e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            ))}
            <p className="text-white/40 text-sm mt-4 mb-2">About page value cards:</p>
            {form.aboutValues.map((v, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 bg-white/5 rounded-xl p-4">
                <Field label="Icon (emoji)">
                  <input value={v.icon} onChange={e => updateAboutValue(i, 'icon', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Title">
                  <input value={v.title} onChange={e => updateAboutValue(i, 'title', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Description">
                  <input value={v.desc} onChange={e => updateAboutValue(i, 'desc', e.target.value)} className={inputCls} />
                </Field>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Images Tab ───────────────────────────────────────────────────────────────

function ImagesTab({ products, onRefresh }: { products: Product[]; onRefresh: () => void }) {
  const [heroImage, setHeroImage] = useState(getImage('hero_bg') || '')
  const [toast, setToast] = useState('')
  const heroFileRef = useRef<HTMLInputElement>(null)
  const productFileRefs = useRef<Record<number, HTMLInputElement | null>>({})

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await fileToBase64(file)
    saveImage('hero_bg', base64)
    saveSiteContent({ heroImage: base64 })
    setHeroImage(base64)
    showToast('Hero image updated!')
  }

  async function handleProductImageUpload(productId: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await fileToBase64(file)
    updateProduct(productId, { image: base64 })
    onRefresh()
    showToast('Product image updated!')
  }

  return (
    <div>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl shadow-lg z-50">
          ✓ {toast}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-black">Image Manager</h2>
        <p className="text-white/40 text-sm mt-1">Upload and replace images across the website</p>
      </div>

      {/* Hero Image */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h3 className="font-bold mb-1">🏠 Hero Background Image</h3>
        <p className="text-white/40 text-sm mb-4">The main image shown in the hero section of the homepage</p>
        <div className="flex items-start gap-4">
          <div className="w-40 h-24 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
            {heroImage ? (
              <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-xs text-center p-2">No hero image set</div>
            )}
          </div>
          <div>
            <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
            <button
              onClick={() => heroFileRef.current?.click()}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              📁 Upload Hero Image
            </button>
            {heroImage && (
              <button
                onClick={() => { saveSiteContent({ heroImage: '' }); saveImage('hero_bg', ''); setHeroImage(''); showToast('Hero image removed.') }}
                className="ml-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold px-3 py-2.5 rounded-xl transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-bold mb-1">📦 Product Images</h3>
        <p className="text-white/40 text-sm mb-4">Update the image for each product individually</p>
        <div className="space-y-4">
          {products.map(product => (
            <div key={product.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
              <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{product.name}</p>
                <p className="text-white/40 text-xs mt-0.5">{product.category === 'earbuds' ? 'Earbuds' : 'Watch'}</p>
              </div>
              <div>
                <input
                  ref={el => { productFileRefs.current[product.id] = el }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleProductImageUpload(product.id, e)}
                />
                <button
                  onClick={() => productFileRefs.current[product.id]?.click()}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  Change Image
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = 'w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/60 transition-colors text-sm'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
