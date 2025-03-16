"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

interface CybersourceCheckoutProps {
  customerData: {
    firstName: string
    lastName: string
    email: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export default function CybersourceCheckout({ customerData }: CybersourceCheckoutProps) {
  const { cart, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Prepare line items from cart
      const lineItems = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }))

      // Prepare customer data
      const customer = {
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        email: customerData.email,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        postcode: customerData.postalCode,
        country: customerData.country,
      }

      // Send request to our Next.js API route
      const response = await fetch("/api/checkout/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          line_items: lineItems,
          customer: customer,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store order ID in session storage for retrieval after redirect
        sessionStorage.setItem("pendingOrderId", data.order_id)

        // Redirect to Cybersource payment page
        window.location.href = data.redirect
      } else {
        setError(data.message || "Payment processing failed")
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setError("An error occurred during checkout. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Payment with Cybersource</h3>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">{error}</div>}

      <p className="text-gray-600 mb-4">
        You will be redirected to Cybersource's secure payment page to complete your purchase.
      </p>

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors disabled:opacity-70"
      >
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  )
}

