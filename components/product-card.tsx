"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

interface ProductCardProps {
  product: any
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number.parseFloat(product.price),
      quantity: 1,
      image: product.images[0]?.src || "/placeholder.svg?height=300&width=300",
      slug: product.slug,
    })
  }

  // Format price with currency symbol
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number.parseFloat(price))
  }

  return (
    <div className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/product/${product.slug}`} className="block relative h-64 overflow-hidden">
        <Image
          src={product.images[0]?.src || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.on_sale && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Sale</span>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-lg font-medium mb-1 hover:text-blue-600 transition-colors">{product.name}</h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          {product.on_sale ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 line-through text-sm">{formatPrice(product.regular_price)}</span>
              <span className="font-semibold text-red-600">{formatPrice(product.sale_price)}</span>
            </div>
          ) : (
            <span className="font-semibold">{formatPrice(product.price)}</span>
          )}

          {product.average_rating && (
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm ml-1">{product.average_rating}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

