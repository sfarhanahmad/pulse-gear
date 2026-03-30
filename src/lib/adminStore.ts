import type { Product, Category } from './types'
import { DEFAULT_CATEGORIES } from './types'

const PRODUCTS_KEY    = 'pg_products'
const CONTENT_KEY     = 'pg_site_content'
const IMAGES_KEY      = 'pg_images'
const CATEGORIES_KEY  = 'pg_categories'

export interface SiteContent {
  heroTitle: string
  heroSubtitle: string
  heroTagline: string
  ctaBannerTitle: string
  ctaBannerSubtitle: string
  whatsappNumber: string
  stats: Array<{ value: string; label: string }>
  heroImage: string
  aboutStory: string[]
  aboutValues: Array<{ icon: string; title: string; desc: string }>
}

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: 'Premium Tech,\nAffordable Prices',
  heroSubtitle: 'Discover top-quality gadgets and accessories. Order directly on WhatsApp — fast, simple, no hassle.',
  heroTagline: 'New Arrivals Available',
  ctaBannerTitle: 'Ready to upgrade your tech?',
  ctaBannerSubtitle: 'Message us on WhatsApp and place your order in minutes.',
  whatsappNumber: '923266570023',
  stats: [
    { value: '500+', label: 'Happy Customers' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '24hr', label: 'WhatsApp Support' },
    { value: 'Fast', label: 'Nationwide Delivery' },
  ],
  heroImage: '',
  aboutStory: [
    'PulseGear was born out of a simple frustration: premium tech accessories were either too expensive or too hard to find in Pakistan. We set out to change that.',
    'Founded in Lahore, PulseGear curates high-quality earbuds, headphones, watches, wallets and power banks — products that punch above their price point.',
    'Every product in our catalog is personally tested by our team. Orders are placed through WhatsApp for a fast, personal experience.',
  ],
  aboutValues: [
    { icon: '⚡', title: 'Fast Service', desc: 'Orders processed same day via WhatsApp.' },
    { icon: '✅', title: 'Vetted Products', desc: 'Every item tested before it reaches you.' },
    { icon: '💛', title: 'Customer First', desc: 'Your satisfaction is our only metric.' },
  ],
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: 'M04 TWS Wireless Earbuds', image: '/placeholder.png', category: 'earbuds', shortDescription: 'Crystal-clear sound with deep bass and 24-hour battery life.', description: 'Experience premium audio with the M04 TWS Wireless Earbuds. Featuring active noise cancellation, deep bass drivers, and a comfortable in-ear fit.', price: 1500 },
  { id: 2, name: 'Pulse Pro Smart Watch',    image: '/placeholder.png', category: 'watch',    shortDescription: 'Full HD AMOLED display with health tracking and 7-day battery.', description: 'Stay connected and healthy with the Pulse Pro Smart Watch. The always-on AMOLED display is crisp and bright even in sunlight.', price: 4500 },
  { id: 3, name: 'Urban Classic Wrist Watch',image: '/placeholder.png', category: 'watch',    shortDescription: 'Timeless analog design with sapphire glass and leather strap.', description: 'The Urban Classic is a statement piece for the modern professional. Crafted with a stainless steel case and genuine leather strap.', price: 3200 },
  { id: 4, name: 'Titan Sport Watch',        image: '/placeholder.png', category: 'watch',    shortDescription: 'Rugged design with GPS, altimeter, and 14-day battery life.', description: 'Built for adventure, the Titan Sport Watch is your ultimate outdoor companion. Military-grade durability meets smart functionality.', price: 5800 },
]

// ─── Categories ───────────────────────────────────────────────────────────────

export function getCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    if (!raw) return DEFAULT_CATEGORIES
    return JSON.parse(raw)
  } catch { return DEFAULT_CATEGORIES }
}

export function saveCategories(cats: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats))
  window.dispatchEvent(new CustomEvent('pg_categories_updated'))
}

export function addCategory(cat: Omit<Category, 'id'>): Category {
  const cats = getCategories()
  // generate a slug id from label
  const id = cat.label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') + '_' + Date.now()
  const newCat = { ...cat, id }
  saveCategories([...cats, newCat])
  return newCat
}

export function updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>): void {
  saveCategories(getCategories().map(c => c.id === id ? { ...c, ...updates } : c))
}

export function deleteCategory(id: string): void {
  saveCategories(getCategories().filter(c => c.id !== id))
  // move orphan products to uncategorized
  const products = getProducts()
  const updated = products.map(p => p.category === id ? { ...p, category: 'other' } : p)
  saveProducts(updated)
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    if (!raw) return DEFAULT_PRODUCTS
    return JSON.parse(raw)
  } catch { return DEFAULT_PRODUCTS }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  window.dispatchEvent(new CustomEvent('pg_products_updated'))
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  const products = getProducts()
  const maxId = products.reduce((m, p) => Math.max(m, p.id), 0)
  const newProduct = { ...product, id: maxId + 1 }
  saveProducts([...products, newProduct])
  return newProduct
}

export function updateProduct(id: number, updates: Partial<Product>): void {
  saveProducts(getProducts().map(p => p.id === id ? { ...p, ...updates } : p))
}

export function deleteProduct(id: number): void {
  saveProducts(getProducts().filter(p => p.id !== id))
}

// ─── Site Content ─────────────────────────────────────────────────────────────

export function getSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(CONTENT_KEY)
    if (!raw) return DEFAULT_CONTENT
    return { ...DEFAULT_CONTENT, ...JSON.parse(raw) }
  } catch { return DEFAULT_CONTENT }
}

export function saveSiteContent(content: Partial<SiteContent>): void {
  localStorage.setItem(CONTENT_KEY, JSON.stringify({ ...getSiteContent(), ...content }))
  window.dispatchEvent(new CustomEvent('pg_content_updated'))
}

// ─── Images ───────────────────────────────────────────────────────────────────

export function saveImage(key: string, base64: string): void {
  try {
    const images = getImages(); images[key] = base64
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images))
  } catch (e) { console.error('Image save failed:', e) }
}

export function getImages(): Record<string, string> {
  try { const raw = localStorage.getItem(IMAGES_KEY); return raw ? JSON.parse(raw) : {} } catch { return {} }
}

export function getImage(key: string): string | null {
  return getImages()[key] || null
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
