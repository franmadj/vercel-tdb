import Link from "next/link"
import { CheckCircle } from "lucide-react"
import ClearCart from "./clear-cart"


type searchParams= Promise<{ order_id: string }>

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: searchParams
}) {

    const resolvedSearchParams = await searchParams;
  const orderId = resolvedSearchParams.order_id || "Unknown"

  return (
    <div className="container mx-auto px-4 py-12">
        <ClearCart />
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-2">Your order has been received and is now being processed.</p>
        <p className="text-gray-600 mb-6">
          Your order number is: <span className="font-semibold">#{orderId}</span>
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">What happens next?</h2>
          <ol className="text-left text-gray-600 space-y-2">
            <li>1. You will receive an order confirmation email shortly.</li>
            <li>2. We'll process your order and prepare it for shipping.</li>
            <li>3. Once your order ships, you'll receive a shipping confirmation with tracking information.</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors">
            Return to Home
          </Link>
          <Link
            href="/shop"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 px-6 rounded-md transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

