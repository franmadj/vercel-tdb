"use client"

import { useEffect } from "react"
import { useCart } from "@/contexts/cart-context"

export default function ClearCart() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
    
  }, [])

  return null
}

