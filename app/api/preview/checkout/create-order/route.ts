import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { line_items, customer } = body

    // Create an order in WooCommerce
    const response = await fetch(`${process.env.WORDPRESS_API_URL!.replace("/wp/v2", "")}/wc-headless/v1/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify({
        line_items,
        customer,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to create order: ${response.status} ${errorText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      order_id: data.order_id,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Failed to create order: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}

