import supabase from './supabase'
import type { Product, Category } from './types'
import { DEFAULT_CATEGORIES } from './types'

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

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await supabase('/products?order=id.asc')
    return data || []
  } catch (e) {
    console.error('getProducts error:', e)
    return []
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const data = await supabase('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  })
  window.dispatchEvent(new CustomEvent('pg_products_updated'))
  return data[0]
}

export async function updateProduct(id: number, updates: Partial<Product>): Promise<void> {
  await supabase(`/products?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
  window.dispatchEvent(new CustomEvent('pg_products_updated'))
}

export async function deleteProduct(id: number): Promise<void> {
  await supabase(`/products?id=eq.${id}`, { method: 'DELETE' })
  window.dispatchEvent(new CustomEvent('pg_products_updated'))
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await supabase('/categories?order=created_at.asc')
    return data?.length ? data : DEFAULT_CATEGORIES
  } catch (e) {
    console.error('getCategories error:', e)
    return DEFAULT_CATEGORIES
  }
}

export async function addCategory(cat: Omit<Category, 'id'>): Promise<Category> {
  const id = cat.label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') + '_' + Date.now()
  const data = await supabase('/categories', {
    method: 'POST',
    body: JSON.stringify({ ...cat, id }),
  })
  window.dispatchEvent(new CustomEvent('pg_categories_updated'))
  return data[0]
}

export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>): Promise<void> {
  await supabase(`/categories?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
  window.dispatchEvent(new CustomEvent('pg_categories_updated'))
}

export async function deleteCategory(id: string): Promise<void> {
  await supabase(`/categories?id=eq.${id}`, { method: 'DELETE' })
  // move orphaned products to 'other'
  await supabase(`/products?category=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ category: 'other' }),
  })
  window.dispatchEvent(new CustomEvent('pg_categories_updated'))
  window.dispatchEvent(new CustomEvent('pg_products_updated'))
}

// ─── Site Content ─────────────────────────────────────────────────────────────

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const data = await supabase('/site_content?key=eq.main')
    if (data?.length && data[0]?.value) {
      return { ...DEFAULT_CONTENT, ...JSON.parse(data[0].value) }
    }
    return DEFAULT_CONTENT
  } catch (e) {
    console.error('getSiteContent error:', e)
    return DEFAULT_CONTENT
  }
}

export async function saveSiteContent(content: Partial<SiteContent>): Promise<void> {
  const current = await getSiteContent()
  const merged = { ...current, ...content }
  await supabase('/site_content', {
    method: 'POST',
    body: JSON.stringify({ key: 'main', value: JSON.stringify(merged) }),
    headers: { 'Prefer': 'resolution=merge-duplicates' },
  })
  window.dispatchEvent(new CustomEvent('pg_content_updated'))
}

// ─── Logo & Theme (still localStorage - these are per-device preferences) ─────

const LOGO_KEY = 'pg_logo_image'

export function getLogoImageLocal(): string {
  try { return localStorage.getItem(LOGO_KEY) || '' } catch { return '' }
}

export function saveLogoImageLocal(base64: string): void {
  localStorage.setItem(LOGO_KEY, base64)
  window.dispatchEvent(new CustomEvent('pg_logo_updated'))
}

// ─── Image Upload — store in Supabase Storage ─────────────────────────────────

export async function uploadImage(file: File, path: string): Promise<string> {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/pulsegear/${path}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': file.type,
      'x-upsert': 'true',
    },
    body: file,
  })

  if (!res.ok) {
    // Fallback to base64 if storage fails
    return fileToBase64(file)
  }

  return `${SUPABASE_URL}/storage/v1/object/public/pulsegear/${path}`
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
