import { Link, createFileRoute } from '@tanstack/react-router'
import products, { type Product } from '@/data/products'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const earbuds = products.filter((p) => p.category === 'earbuds')
  const watches = products.filter((p) => p.category === 'watch')

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-black to-black" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            New Arrivals Available
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Premium Tech,
            <br />
            <span className="text-yellow-400">Affordable Prices</span>
          </h1>
          <p className="text-white/60 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover top-quality wireless earbuds and wrist watches. Order directly on WhatsApp — fast, simple, no hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#products"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Shop Now
            </a>
            <a
              href="https://wa.me/923266570023"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 hover:border-white/50 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: '500+', label: 'Happy Customers' },
            { value: '4.9★', label: 'Average Rating' },
            { value: '24hr', label: 'WhatsApp Support' },
            { value: 'Fast', label: 'Nationwide Delivery' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-yellow-400 font-black text-2xl">{stat.value}</div>
              <div className="text-white/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Earbuds Section */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-20">
        <div className="mb-12">
          <span className="text-yellow-400 text-sm font-semibold uppercase tracking-widest">Audio</span>
          <h2 className="text-4xl font-black mt-2">Wireless Earbuds</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earbuds.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Watches Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="mb-12">
          <span className="text-yellow-400 text-sm font-semibold uppercase tracking-widest">Timepieces</span>
          <h2 className="text-4xl font-black mt-2">Wrist Watches</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watches.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-yellow-400 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
            Ready to upgrade your tech?
          </h2>
          <p className="text-black/70 text-lg mb-8">
            Message us on WhatsApp and place your order in minutes.
          </p>
          <a
            href="https://wa.me/923266570023?text=Hi!%20I'd%20like%20to%20browse%20your%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Order on WhatsApp
          </a>
        </div>
      </section>
    </main>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-400/40 transition-all duration-300 group flex flex-col">
      <Link
        to="/products/$productId"
        params={{ productId: product.id.toString() }}
        className="block"
      >
        <div className="aspect-square overflow-hidden bg-white/5">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <span className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-2">
          {product.category === 'earbuds' ? 'Wireless Earbuds' : 'Wrist Watch'}
        </span>
        <h3 className="text-lg font-bold mb-2 leading-snug">{product.name}</h3>
        <p className="text-white/50 text-sm leading-relaxed flex-1">{product.shortDescription}</p>
        <div className="flex items-center justify-between mt-6">
          <span className="text-2xl font-black text-white">
            Rs. {product.price.toLocaleString()}
          </span>
        </div>
        <WhatsAppButton productName={product.name} className="mt-4 w-full justify-center" />
      </div>
    </div>
  )
}
