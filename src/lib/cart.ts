import type { Product } from './types'

export interface CartItem {
  product: Product
  quantity: number
}

const CART_KEY = 'pg_cart'

export function getCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') } catch { return [] }
}

export function addToCart(product: Product): void {
  const cart = getCart()
  const existing = cart.find(i => i.product.id === product.id)
  if (existing) { existing.quantity += 1 } else { cart.push({ product, quantity: 1 }) }
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new CustomEvent('pg_cart_updated'))
}

export function removeFromCart(productId: number): void {
  const cart = getCart().filter(i => i.product.id !== productId)
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new CustomEvent('pg_cart_updated'))
}

export function updateQuantity(productId: number, quantity: number): void {
  const cart = getCart()
  const item = cart.find(i => i.product.id === productId)
  if (item) { item.quantity = Math.max(1, quantity) }
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new CustomEvent('pg_cart_updated'))
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY)
  window.dispatchEvent(new CustomEvent('pg_cart_updated'))
}

export function getCartCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0)
}

export function getCartTotal(): number {
  return getCart().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
}
