"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function OrderStatusPage() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [status, setStatus] = useState<"success" | "failure" | "loading">("loading")
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    // Get order ID from URL or session storage
    const orderIdFromUrl = searchParams.get("order_id")
    const orderIdFromSession = sessionStorage.getItem("pendingOrderId")
    const orderIdToUse = orderIdFromUrl || orderIdFromSession

    if (orderIdToUse) {
      setOrderId(orderIdToUse)
      // Clear from session storage
      sessionStorage.removeItem("pendingOrderId")
    }

    // Check payment status
    const wc_order_id = searchParams.get("wc_order_id")
    const isSuccess = searchParams.get("status") === "success" || searchParams.get("result") === "success"

    if (isSuccess) {
      setStatus("success")
      // Clear the cart on successful payment
      clearCart()

      // Optionally verify the order status with your backend
      if (wc_order_id) {
        fetch(`/api/checkout/verify-order?order_id=${wc_order_id}`)
          .then((res) => res.json())
          .then((data) => {
            if (!data.success) {
              setStatus("failure")
            }
          })
          .catch(() => {
            // If verification fails, still show success as Cybersource confirmed it
            console.error("Failed to verify order status")
          })
      }
    } else if (searchParams.get("status") === "failure" || searchParams.get("result") === "failure") {
      setStatus("failure")
    } else {
      // If no clear status, default to success if we have an order ID
      setStatus(orderIdToUse ? "success" : "failure")
    }
  }, [searchParams, clearCart])

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4">Processing Your Order</h1>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
        {status === "success" ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-2">
              Thank you for your order.{" "}
              {orderId && (
                <span>
                  Your order number is: <span className="font-semibold">#{orderId}</span>
                </span>
              )}
            </p>
            <p className="text-gray-600 mb-6">You will receive a confirmation email shortly with your order details.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again or contact customer support.
            </p>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors">
            Return to Home
          </Link>
          {status === "failure" && (
            <Link
              href="/checkout"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 px-6 rounded-md transition-colors"
            >
              Try Again
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

