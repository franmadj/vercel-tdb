import { NextResponse } from "next/server"
import { fetchWooCommerceAPI } from "@/lib/woocommerce"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { line_items, customer } = body

    // Create an order in WooCommerce
    const orderData = {
      payment_method: "cybersource",
      payment_method_title: "Credit Card (Cybersource)",
      set_paid: false,
      billing: {
        first_name: customer.first_name,
        last_name: customer.last_name,
        address_1: customer.address,
        city: customer.city,
        state: customer.state,
        postcode: customer.postcode,
        country: customer.country,
        email: customer.email,
        phone: customer.phone || "",
      },
      shipping: {
        first_name: customer.first_name,
        last_name: customer.last_name,
        address_1: customer.address,
        city: customer.city,
        state: customer.state,
        postcode: customer.postcode,
        country: customer.country,
      },
      line_items: line_items,
      // Add any additional required fields
    }

    // Create the order in WooCommerce
    const order = await fetchWooCommerceAPI("orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })

    // Now get the payment URL from WooCommerce
    // This endpoint will depend on your WooCommerce Cybersource plugin
    const paymentData = await fetchWooCommerceAPI(`payment_gateways/cybersource/process/${order.id}`, {
      method: "POST",
    })

    return NextResponse.json({
      success: true,
      order_id: order.id,
      redirect: paymentData.redirect_url,
    })
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ success: false, message: "Failed to process payment" }, { status: 500 })
  }
}

