"use client"

import { useState, useEffect, useRef } from "react"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

interface CybersourceIframeProps {
  customerData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    address_2: string
    city: string
    state: string
    postalCode: string
    country: string
    shipping_firstName: string
    shipping_lastName: string
    shipping_address: string
    shipping_address_2: string
    shipping_city: string
    shipping_state: string
    shipping_postalCode: string
    shipping_country: string
  }
}

export default function CybersourceIframe({ customerData }: CybersourceIframeProps) {
  const { cart, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  const [iframeHeight, setIframeHeight] = useState(600)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchIframeParams = async () => {
      try {
        // Get the pending order ID from session storage
        const pendingOrderId = sessionStorage.getItem("pendingOrderId")

        if (!pendingOrderId) {
          throw new Error("No pending order found. Please try again.")
        }

        // Get iframe URL from our API
        const response = await fetch("/api/checkout/get-cybersource-iframe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: pendingOrderId,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to get iframe URL: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.iframe_url) {
          setIframeUrl(data.iframe_url)
        } else {
          throw new Error(data.message || "Failed to initialize payment form")
        }
      } catch (err) {
        console.error("Error getting iframe URL:", err)
        setError(`Failed to initialize payment form: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIframeParams()

    // Set up message listener for iframe communication
    const handleMessage = (event: MessageEvent) => {
      // Verify the origin of the message (should be from Cybersource)
      const cybersourceOrigins = [
        "https://secureacceptance.cybersource.com",
        "https://testsecureacceptance.cybersource.com",
      ]

      if (!cybersourceOrigins.includes(event.origin)) {
        return
      }

      // Handle iframe height adjustments
      if (event.data && event.data.height) {
        setIframeHeight(event.data.height)
      }

      // Handle payment completion
      if (event.data && event.data.transactionStatus) {
        if (event.data.transactionStatus === "AUTHORIZED" || event.data.transactionStatus === "PENDING") {
          // Payment successful
          clearCart()
          router.push(`/order-status?order_id=${sessionStorage.getItem("pendingOrderId")}&status=success`)
        } else {
          // Payment failed
          router.push(
            `/order-status?status=failure&message=${encodeURIComponent(event.data.message || "Payment failed")}`,
          )
        }
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [cart, customerData, clearCart, router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading payment form...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
        <p className="font-medium">Error</p>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!iframeUrl) {
    return (
      <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md mb-4">
        <p>Unable to load payment form. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Payment Information</h3>
      <p className="text-gray-600 mb-4">Please complete your payment details in the secure form below.</p>

      <div className="border rounded-md overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          width="100%"
          height={iframeHeight}
          frameBorder="0"
          scrolling="no"
          title="Cybersource Payment Form"
          sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
        ></iframe>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Your payment is securely processed by Cybersource. Your card details are not stored on our servers.
      </p>
    </div>
  )
}

