"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Check } from "lucide-react"

interface AddToCartButtonProps {
  product: any
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number.parseFloat(product.price),
      quantity,
      image: product.images[0]?.src || "/placeholder.svg?height=300&width=300",
      slug: product.slug,
    })

    // Show success message
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center border rounded-md">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="px-3 py-2 text-gray-600 hover:text-gray-800"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
            className="w-12 text-center border-x py-2"
          />
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="px-3 py-2 text-gray-600 hover:text-gray-800"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md transition-colors ${
          isAdded ? "bg-green-600 hover:bg-green-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isAdded ? (
          <>
            <Check className="w-5 h-5" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  )
}

