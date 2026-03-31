export interface Category {
  id: string
  label: string
  icon: string
}

export interface Product {
  id: number
  name: string
  image: string
  description: string
  short_description: string
  price: number
  category: string
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'earbuds',    label: 'Ear Pods & Earbuds', icon: '🎧' },
  { id: 'headphones', label: 'Headphones',          icon: '🎵' },
  { id: 'watch',      label: 'Watches',             icon: '⌚' },
  { id: 'wallet',     label: 'Wallets',             icon: '👛' },
  { id: 'powerbank',  label: 'Power Banks',         icon: '🔋' },
]
