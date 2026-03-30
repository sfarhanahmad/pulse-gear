export interface Product {
  id: number
  name: string
  image: string
  description: string
  shortDescription: string
  price: number
  category: 'earbuds' | 'watch'
}
