import { getProductBySlug, getFeaturedProducts } from "@/lib/woocommerce"
import AddToCartButton from "@/components/add-to-cart-button"
import ProductCard from "@/components/product-card"
import Image from "next/image"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product images */}
        <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
          <Image
            src={product.images[0]?.src || "/placeholder.svg?height=500&width=500"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>

        {/* Product details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Price */}
          <div className="mb-4">
            {product.on_sale ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through text-lg">{formatPrice(product.regular_price)}</span>
                <span className="text-2xl font-semibold text-red-600">{formatPrice(product.sale_price)}</span>
              </div>
            ) : (
              <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Short description */}
          <div className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: product.short_description }} />

          {/* Add to cart */}
          <AddToCartButton product={product} />

          {/* Additional info */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <ul className="space-y-2 text-gray-600">
              {product.sku && (
                <li>
                  <span className="font-medium">SKU:</span> {product.sku}
                </li>
              )}
              {product.categories && product.categories.length > 0 && (
                <li>
                  <span className="font-medium">Categories:</span>{" "}
                  {product.categories.map((cat: any, index: number) => (
                    <span key={cat.id}>
                      <Link href={`/shop?category=${cat.id}`} className="text-blue-600 hover:underline">
                        {cat.name}
                      </Link>
                      {index < product.categories.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </li>
              )}
              {product.tags && product.tags.length > 0 && (
                <li>
                  <span className="font-medium">Tags:</span>{" "}
                  {product.tags.map((tag: any, index: number) => (
                    <span key={tag.id}>
                      {tag.name}
                      {index < product.tags.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

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

