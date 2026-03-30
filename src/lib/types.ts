export type Category = 'earbuds' | 'headphones' | 'watch' | 'wallet' | 'powerbank'

export interface Product {
  id: number
  name: string
  image: string
  description: string
  shortDescription: string
  price: number
  category: Category
}

export const CATEGORIES: Array<{ id: Category; label: string; icon: string }> = [
  { id: 'earbuds',    label: 'Ear Pods & Earbuds', icon: '🎧' },
  { id: 'headphones', label: 'Headphones',          icon: '🎵' },
  { id: 'watch',      label: 'Watches',             icon: '⌚' },
  { id: 'wallet',     label: 'Wallets',             icon: '👛' },
  { id: 'powerbank',  label: 'Power Banks',         icon: '🔋' },
]
