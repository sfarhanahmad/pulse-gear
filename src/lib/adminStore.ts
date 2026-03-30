import type { Product } from './types'

const PRODUCTS_KEY = 'pg_products'
const SITE_CONTENT_KEY = 'pg_site_content'
const IMAGES_KEY = 'pg_images'

export interface SiteContent {
  heroTitle: string
  heroSubtitle: string
  heroTagline: string
  ctaBannerTitle: string
  ctaBannerSubtitle: string
  whatsappNumber: string
  stats: Array<{ value: string; label: string }>
  heroImage: string // base64 or url
  aboutStory: string[]
  aboutValues: Array<{ icon: string; title: string; desc: string }>
}

const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: 'Premium Tech,\nAffordable Prices',
  heroSubtitle: 'Discover top-quality wireless earbuds and wrist watches. Order directly on WhatsApp — fast, simple, no hassle.',
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
    'Founded in Lahore, PulseGear curates high-quality wireless earbuds and stylish wrist watches — products that punch above their price point. We believe everyone deserves great tech without breaking the bank.',
    'Every product in our catalog is personally tested by our team. We only sell what we\'d happily use ourselves. Orders are placed through WhatsApp for a fast, personal experience — no complicated checkouts, no waiting on hold.',
  ],
  aboutValues: [
    { icon: '⚡', title: 'Fast Service', desc: 'Orders processed same day via WhatsApp.' },
    { icon: '✅', title: 'Vetted Products', desc: 'Every item tested before it reaches you.' },
    { icon: '💛', title: 'Customer First', desc: 'Your satisfaction is our only metric.' },
  ],
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'M04 TWS Wireless Earbuds',
    image: '/placeholder.png',
    category: 'earbuds',
    shortDescription: 'Crystal-clear sound with deep bass and 24-hour battery life.',
    description: 'Experience premium audio with the M04 TWS Wireless Earbuds. Featuring active noise cancellation, deep bass drivers, and a comfortable in-ear fit, these earbuds deliver an immersive listening experience. The charging case provides up to 24 hours of total playtime. IPX5 water resistance keeps them safe during workouts.',
    price: 1500,
  },
  {
    id: 2,
    name: 'Pulse Pro Smart Watch',
    image: '/placeholder.png',
    category: 'watch',
    shortDescription: 'Full HD AMOLED display with health tracking and 7-day battery.',
    description: 'Stay connected and healthy with the Pulse Pro Smart Watch. The always-on AMOLED display is crisp and bright even in sunlight. Track your heart rate, SpO2, sleep, and workouts with precision. Compatible with Android and iOS. Premium stainless steel build with a silicone sport band.',
    price: 4500,
  },
  {
    id: 3,
    name: 'Urban Classic Wrist Watch',
    image: '/placeholder.png',
    category: 'watch',
    shortDescription: 'Timeless analog design with sapphire glass and leather strap.',
    description: 'The Urban Classic is a statement piece for the modern professional. Crafted with a stainless steel case and genuine leather strap, it features a Japanese quartz movement and scratch-resistant sapphire glass. Water resistant up to 50 meters. Available in silver and gunmetal finishes.',
    price: 3200,
  },
  {
    id: 4,
    name: 'Titan Sport Watch',
    image: '/placeholder.png',
    category: 'watch',
    shortDescription: 'Rugged design with GPS, altimeter, and 14-day battery life.',
    description: 'Built for adventure, the Titan Sport Watch is your ultimate outdoor companion. Military-grade durability meets smart functionality — GPS tracking, altimeter, barometer, and compass built in. The high-contrast display is readable in bright sunlight. Up to 14 days battery life in smartwatch mode.',
    price: 5800,
  },
]

// ─── Products ───────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    if (!raw) return DEFAULT_PRODUCTS
    return JSON.parse(raw)
  } catch {
    return DEFAULT_PRODUCTS
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  // Dispatch event so other components know products changed
  window.dispatchEvent(new CustomEvent('pg_products_updated'))
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  const products = getProducts()
  const maxId = products.reduce((max, p) => Math.max(max, p.id), 0)
  const newProduct = { ...product, id: maxId + 1 }
  saveProducts([...products, newProduct])
  return newProduct
}

export function updateProduct(id: number, updates: Partial<Product>): void {
  const products = getProducts()
  const updated = products.map(p => p.id === id ? { ...p, ...updates } : p)
  saveProducts(updated)
}

export function deleteProduct(id: number): void {
  const products = getProducts()
  saveProducts(products.filter(p => p.id !== id))
}

// ─── Site Content ────────────────────────────────────────────────────────────

export function getSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(SITE_CONTENT_KEY)
    if (!raw) return DEFAULT_SITE_CONTENT
    return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SITE_CONTENT
  }
}

export function saveSiteContent(content: Partial<SiteContent>): void {
  const current = getSiteContent()
  localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify({ ...current, ...content }))
  window.dispatchEvent(new CustomEvent('pg_content_updated'))
}

// ─── Image Storage ───────────────────────────────────────────────────────────

export function saveImage(key: string, base64: string): void {
  try {
    const images = getImages()
    images[key] = base64
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images))
  } catch (e) {
    console.error('Image save failed (may be too large):', e)
  }
}

export function getImages(): Record<string, string> {
  try {
    const raw = localStorage.getItem(IMAGES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getImage(key: string): string | null {
  return getImages()[key] || null
}

// Helper: convert File to base64 data URL
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
