import { getProductBySlug, getFeaturedProducts, getProductVariations } from "@/lib/woocommerce"
import ProductDetails from "@/components/product-details"
import ProductCard from "@/components/product-card"
import Link from "next/link"

type params= Promise<{ slug: string }>

export default async function ProductPage({
  params,
}: {
  params: params
}) {

  const resolvedParams = await params;  // Resolving the params promise


  // Fetch product data
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Product not found</h1>
        <p>The product you're looking for doesn't exist.</p>
        <Link href="/shop" className="text-blue-600 hover:underline">
          Return to shop
        </Link>
      </div>
    )
  }

  // Fetch variations if this is a variable product
  let variations = []
  if (product.type === "variable") {
    variations = await getProductVariations(product.id)
  }

  // Fetch related products
  const relatedProducts = await getFeaturedProducts(4)

  // Format price with currency symbol
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number.parseFloat(price))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/shop" className="text-blue-600 hover:underline">
          ← Back to shop
        </Link>
      </div>

      <ProductDetails product={product} variations={variations} />

      

      {/* Product description */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts
              .filter((related: any) => related.id !== product.id)
              .slice(0, 4)
              .map((related: any) => (
                <ProductCard key={related.id} product={related} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Enable ISR - revalidate content every 60 seconds
export const revalidate = 60

