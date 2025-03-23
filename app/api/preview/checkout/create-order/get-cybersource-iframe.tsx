import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id } = body

    if (!order_id) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 })
    }

    // Get the iframe URL for an existing order
    const response = await fetch(
      `${process.env.WORDPRESS_API_URL!.replace("/wp/v2", "")}/wc-headless/v1/cybersource-iframe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64")}`,
        },
        body: JSON.stringify({
          order_id,
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to get iframe URL: ${response.status} ${errorText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      iframe_url: data.iframe_url,
    })
  } catch (error) {
    console.error("Error getting iframe URL:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Failed to get iframe URL: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}

