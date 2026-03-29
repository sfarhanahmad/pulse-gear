import { Link, createFileRoute } from '@tanstack/react-router'
import products from '../../data/products'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export const Route = createFileRoute('/products/$productId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const product = products.find((p) => p.id === +params.productId)
    if (!product) throw new Error('Product not found')
    return product
  },
})

function RouteComponent() {
  const product = Route.useLoaderData()

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-10 no-underline text-sm">
        ← Back to all products
      </Link>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-1/2">
          <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <span className="text-yellow-400 text-sm font-semibold uppercase tracking-widest">
            {product.category === 'earbuds' ? 'Wireless Earbuds' : 'Wrist Watch'}
          </span>
          <h1 className="text-4xl font-black mt-3 mb-4">{product.name}</h1>
          <p className="text-white/60 leading-relaxed mb-8">{product.description}</p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">Price</span>
              <span className="text-3xl font-black text-yellow-400">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>
          </div>

          <WhatsAppButton productName={product.name} className="w-full justify-center text-lg py-4" />

          <p className="text-white/30 text-sm text-center mt-4">
            Fast delivery · Secure WhatsApp ordering · Trusted seller
          </p>
        </div>
      </div>
    </main>
  )
}
