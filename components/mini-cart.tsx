"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export default function MiniCart() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  // Format price with currency symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className="relative">
      <button
        onClick={toggleCart}
        className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleCart} />

          {/* Mini cart panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-[80vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Your Cart ({cartCount})</h3>
              <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link href="/shop" className="text-blue-600 hover:underline" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item.id} className="p-4 flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg?height=64&width=64"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      <div className="flex-grow">
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-medium hover:text-blue-600 line-clamp-1"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-gray-600 hover:text-gray-800"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-600 hover:text-gray-800"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-600"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Subtotal:</span>
                    <span className="font-semibold">{formatPrice(cartTotal)}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href="/cart"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      View Cart
                    </Link>
                    <Link
                      href="/checkout"
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

