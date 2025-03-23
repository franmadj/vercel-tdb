"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import CreditCardForm from "@/components/creditCardForm"

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const [formData, setFormData] = useState({
    // Billing details
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    address_2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    // Shipping details
    shipping_firstName: "",
    shipping_lastName: "",
    shipping_address: "",
    shipping_address_2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postalCode: "",
    shipping_country: "US",
  })
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false)
  const [orderAmount, setOrderAmount] = useState("100.00"); // Example amount
const [orderId, setOrderId] = useState("ORDER-12345"); // Example order ID
const [orderCompleted, setOrderCompleted] = useState(false)

  const handlePaymentSuccess = () => {
    clearCart()
    setOrderCompleted(true)
  }

  // Format price with currency symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleShippingToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipToDifferentAddress(e.target.checked)

    // If unchecked, copy billing details to shipping details
    if (!e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        shipping_firstName: prev.firstName,
        shipping_lastName: prev.lastName,
        shipping_address: prev.address,
        shipping_address_2: prev.address_2,
        shipping_city: prev.city,
        shipping_state: prev.state,
        shipping_postalCode: prev.postalCode,
        shipping_country: prev.country,
      }))
    }
  }

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Prepare line items from cart
      const lineItems = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }))

      // Prepare customer data
      const billing = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address_1: formData.address,
        address_2: formData.address_2,
        city: formData.city,
        state: formData.state,
        postcode: formData.postalCode,
        country: formData.country,
        
      }
      const shipping = {

        shipping_first_name: shipToDifferentAddress ? formData.shipping_firstName : formData.firstName,
        shipping_last_name: shipToDifferentAddress ? formData.shipping_lastName : formData.lastName,
        shipping_address_1: shipToDifferentAddress ? formData.shipping_address : formData.address,
        shipping_address_2: shipToDifferentAddress ? formData.shipping_address_2 : formData.address_2,
        shipping_city: shipToDifferentAddress ? formData.shipping_city : formData.city,
        shipping_state: shipToDifferentAddress ? formData.shipping_state : formData.state,
        shipping_postcode: shipToDifferentAddress ? formData.shipping_postalCode : formData.postalCode,
        shipping_country: shipToDifferentAddress ? formData.shipping_country : formData.country,
      }

      // Create FormData for WordPress admin-ajax
      const formDataObj = new FormData()
      formDataObj.append("action", "create_woocommerce_order")
      formDataObj.append("line_items", JSON.stringify(lineItems))
      formDataObj.append("billing", JSON.stringify(billing))
      formDataObj.append("shipping", JSON.stringify(shipping))

      // Use WordPress admin-ajax.php endpoint
      
      const response = await fetch(`https://staging.texasdebrazil.com/wp-admin/admin-ajax.php`, {
        method: "POST",
        body: formDataObj,
        
      })

      const data = await response.json()

      if (data.success) {
        setOrderAmount(data.data.order_total)
        setOrderId(data.data.order_id)
        setShowPaymentForm(true)
        

        // Scroll to payment section
        setTimeout(() => {
          document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      } else {
        setError(data.message || "Failed to create order. Please try again.")
      }
    } catch (err) {
      console.error("Error creating order:", err)
      setError(`Failed to create order: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">You need to add items to your cart before proceeding to checkout.</p>
          <Link
            href="/shop"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
        {!showPaymentForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleContinueToPayment}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder="House number and street name"
                />
                <input
                  type="text"
                  id="address_2"
                  name="address_2"
                  value={formData.address_2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>

              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="shipToDifferentAddress"
                    checked={shipToDifferentAddress}
                    onChange={handleShippingToggle}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="shipToDifferentAddress" className="ml-2 block text-sm font-medium text-gray-700">
                    Click to ship as a gift or to a different address
                  </label>
                </div>
              </div>

              {shipToDifferentAddress && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-lg font-medium mb-4">Shipping Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="shipping_firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="shipping_firstName"
                        name="shipping_firstName"
                        required={shipToDifferentAddress}
                        value={formData.shipping_firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="shipping_lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="shipping_lastName"
                        name="shipping_lastName"
                        required={shipToDifferentAddress}
                        value={formData.shipping_lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="shipping_address"
                      name="shipping_address"
                      required={shipToDifferentAddress}
                      value={formData.shipping_address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      placeholder="House number and street name"
                    />
                    <input
                      type="text"
                      id="shipping_address_2"
                      name="shipping_address_2"
                      value={formData.shipping_address_2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Apartment, suite, unit, etc. (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="shipping_city"
                        name="shipping_city"
                        required={shipToDifferentAddress}
                        value={formData.shipping_city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        id="shipping_state"
                        name="shipping_state"
                        required={shipToDifferentAddress}
                        value={formData.shipping_state}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="shipping_postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        id="shipping_postalCode"
                        name="shipping_postalCode"
                        required={shipToDifferentAddress}
                        value={formData.shipping_postalCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      id="shipping_country"
                      name="shipping_country"
                      required={shipToDifferentAddress}
                      value={formData.shipping_country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              )}

              
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors disabled:opacity-70"
                >
                  {isLoading ? "Processing..." : "Continue to Payment"}
                </button>
              
            </form>
          </div>
)}
          {showPaymentForm && (
            <div id="payment-section" className="bg-white rounded-lg shadow-sm p-6">
            {!orderCompleted ? (
              <CreditCardForm 
                billingDetails={formData} 
                orderAmount={orderAmount} 
                orderId={orderId}
                onPaymentSuccess={handlePaymentSuccess} // Pass callback 
              />
            ) : (
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <p className="text-green-600 font-bold text-lg">ORDER RECEIVED!</p>
                <p className="text-green-600 font-bold text-lg">THANK YOU FOR YOUR BUSINESS</p>
                <span className="block text-gray-600">Your order is now undergoing a routine security review.</span>
                <span className="block text-gray-600">Most orders are processed within 15 minutes, but can take up to 24 hours.</span>
                <span className="block text-gray-600">Your order email will be sent out as soon as possible.</span>
                
                <div className="mt-4">
                  <span className="block text-gray-500 text-sm">The order reference number is not valid for in-store redemption.</span>
                  <span className="block text-gray-700 font-bold">Order Reference Number</span>
                  <span className="block text-black font-semibold">{orderId}</span>
                </div>
      
                <a href="/shop/" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded">
                  To Shop Page
                </a>
              </div>
            )}
          </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

