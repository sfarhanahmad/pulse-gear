export interface Product {
  id: number
  name: string
  image: string
  description: string
  shortDescription: string
  price: number
  category: 'earbuds' | 'watch'
}

const products: Array<Product> = [
  {
    id: 1,
    name: 'M04 TWS Wireless Earbuds',
    image: 'https://priceoye.pk/wireless-earbuds/assorted/m04-tws-wireless-bluetooth-earbuds',
    category: 'earbuds',
    shortDescription: 'Crystal-clear sound with deep bass and 24-hour battery life.',
    description:
      'Experience premium audio with the M04 TWS Wireless Earbuds. Featuring active noise cancellation, deep bass drivers, and a comfortable in-ear fit, these earbuds deliver an immersive listening experience. The charging case provides up to 24 hours of total playtime. IPX5 water resistance keeps them safe during workouts.',
    price: 1500,
  },
  {
    id: 2,
    name: 'Pulse Pro Smart Watch',
    image: '/placeholder.png',
    category: 'watch',
    shortDescription: 'Full HD AMOLED display with health tracking and 7-day battery.',
    description:
      'Stay connected and healthy with the Pulse Pro Smart Watch. The always-on AMOLED display is crisp and bright even in sunlight. Track your heart rate, SpO2, sleep, and workouts with precision. Compatible with Android and iOS. Premium stainless steel build with a silicone sport band.',
    price: 4500,
  },
  {
    id: 3,
    name: 'Urban Classic Wrist Watch',
    image: '/placeholder.png',
    category: 'watch',
    shortDescription: 'Timeless analog design with sapphire glass and leather strap.',
    description:
      'The Urban Classic is a statement piece for the modern professional. Crafted with a stainless steel case and genuine leather strap, it features a Japanese quartz movement and scratch-resistant sapphire glass. Water resistant up to 50 meters. Available in silver and gunmetal finishes.',
    price: 3200,
  },
  {
    id: 4,
    name: 'Titan Sport Watch',
    image: '/placeholder.png',
    category: 'watch',
    shortDescription: 'Rugged design with GPS, altimeter, and 14-day battery life.',
    description:
      'Built for adventure, the Titan Sport Watch is your ultimate outdoor companion. Military-grade durability meets smart functionality — GPS tracking, altimeter, barometer, and compass built in. The high-contrast display is readable in bright sunlight. Up to 14 days battery life in smartwatch mode.',
    price: 5800,
  },
]

export default products
