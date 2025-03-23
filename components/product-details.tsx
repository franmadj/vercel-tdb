"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Check } from "lucide-react"

interface Attribute {
  id: number
  name: string
  option: string
}

interface Variation {
  id: number
  attributes: Attribute[]
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  purchasable: boolean
  stock_status: string
  stock_quantity: number | null
  image: {
    id: number
    src: string
  }
}

interface ProductDetailsProps {
  product: any
  variations: Variation[]
}

export default function ProductDetails({ product, variations }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null)
  const [currentImage, setCurrentImage] = useState(product.images[0]?.src || "/placeholder.svg?height=500&width=500")
  const [price, setPrice] = useState(product.price)
  const [regularPrice, setRegularPrice] = useState(product.regular_price)
  const [salePrice, setSalePrice] = useState(product.sale_price)
  const [onSale, setOnSale] = useState(product.on_sale)
  const [inStock, setInStock] = useState(product.stock_status === "instock")
  const { addToCart } = useCart()

  // Add the formatPrice function here
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number.parseFloat(price))
  }

  // Get unique attributes from variations
  const getAttributes = () => {
    if (!variations || variations.length === 0) return []

    const attributesMap = new Map()

    variations.forEach((variation) => {
      variation.attributes.forEach((attr) => {
        if (!attributesMap.has(attr.name)) {
          attributesMap.set(attr.name, new Set())
        }
        attributesMap.get(attr.name).add(attr.option)
      })
    })

    return Array.from(attributesMap).map(([name, options]) => ({
      name,
      options: Array.from(options as Set<string>),
    }))
  }

  const attributes = getAttributes()

  // Handle attribute selection
  const handleAttributeChange = (attributeName: string, value: string) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attributeName]: value,
    }
    setSelectedAttributes(newSelectedAttributes)

    // Find matching variation
    findMatchingVariation(newSelectedAttributes)
  }

  // Find variation that matches selected attributes
  const findMatchingVariation = (attrs: Record<string, string>) => {
    // Check if we have selected all required attributes
    const allAttributesSelected = attributes.every((attr) => attrs[attr.name] && attrs[attr.name] !== "")

    if (!allAttributesSelected) {
      setSelectedVariation(null)
      // Reset to default product values
      setPrice(product.price)
      setRegularPrice(product.regular_price)
      setSalePrice(product.sale_price)
      setOnSale(product.on_sale)
      setInStock(product.stock_status === "instock")
      setCurrentImage(product.images[0]?.src || "/placeholder.svg?height=500&width=500")
      return
    }

    // Find matching variation
    const matchingVariation =
      variations.find((variation) => {
        return variation.attributes.every((attr) => {
          return attrs[attr.name] === attr.option
        })
      }) || null

    setSelectedVariation(matchingVariation)

    // Update product details based on selected variation
    if (matchingVariation) {
      setPrice(matchingVariation.price)
      setRegularPrice(matchingVariation.regular_price)
      setSalePrice(matchingVariation.sale_price)
      setOnSale(matchingVariation.on_sale)
      setInStock(matchingVariation.stock_status === "instock")

      // Update image if variation has one
      if (matchingVariation.image && matchingVariation.image.src) {
        setCurrentImage(matchingVariation.image.src)
      }
    }
  }

  const handleAddToCart = () => {
    const productToAdd = {
      id: selectedVariation ? selectedVariation.id : product.id,
      name: product.name,
      price: Number.parseFloat(price),
      quantity,
      image: currentImage || "/placeholder.svg?height=300&width=300",
      slug: product.slug,
      variation: selectedVariation
        ? Object.entries(selectedAttributes)
            .map(([name, value]) => `${name}: ${value}`)
            .join(", ")
        : undefined,
    }

    addToCart(productToAdd)

    // Show success message
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {/* Product images */}
      <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
        <Image
          src={currentImage || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
        />
      </div>

      {/* Product details */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

        {/* Price */}
        <div className="mb-4">
          {onSale ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 line-through text-lg">{formatPrice(regularPrice)}</span>
              <span className="text-2xl font-semibold text-red-600">{formatPrice(salePrice)}</span>
            </div>
          ) : (
            <span className="text-2xl font-semibold">{formatPrice(price)}</span>
          )}
        </div>

        {/* Short description */}
        <div className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: product.short_description }} />

        {/* Variations */}
        {product.type === "variable" && attributes.length > 0 && (
          <div className="mb-6 space-y-4">
            {attributes.map((attribute) => (
              <div key={attribute.name}>
                <label htmlFor={`attribute-${attribute.name}`} className="block text-sm font-medium text-gray-700 mb-1">
                  {attribute.name}
                </label>
                <select
                  id={`attribute-${attribute.name}`}
                  value={selectedAttributes[attribute.name] || ""}
                  onChange={(e) => handleAttributeChange(attribute.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose {attribute.name}</option>
                  {attribute.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Stock status */}
        <div className="mb-4">
          {inStock ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Quantity selector */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="px-3 py-2 text-gray-600 hover:text-gray-800"
              aria-label="Decrease quantity"
              disabled={!inStock}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
              className="w-12 text-center border-x py-2"
              disabled={!inStock}
            />
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="px-3 py-2 text-gray-600 hover:text-gray-800"
              aria-label="Increase quantity"
              disabled={!inStock}
            >
              +
            </button>
          </div>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md transition-colors ${
            isAdded
              ? "bg-green-600 hover:bg-green-700 text-white"
              : inStock
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 cursor-not-allowed text-gray-500"
          }`}
          disabled={!inStock || (product.type === "variable" && !selectedVariation)}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              {!inStock
                ? "Out of Stock"
                : product.type === "variable" && !selectedVariation
                  ? "Select options"
                  : "Add to Cart"}
            </>
          )}
        </button>

        {/* Additional info */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-2">Product Details</h3>
          <ul className="space-y-2 text-gray-600">
            {product.sku && (
              <li>
                <span className="font-medium">SKU:</span> {product.sku}
              </li>
            )}
            {product.categories && product.categories.length > 0 && (
              <li>
                <span className="font-medium">Categories:</span>{" "}
                {product.categories.map((cat: any, index: number) => (
                  <span key={cat.id}>
                    <Link href={`/shop?category=${cat.id}`} className="text-blue-600 hover:underline">
                      {cat.name}
                    </Link>
                    {index < product.categories.length - 1 ? ", " : ""}
                  </span>
                ))}
              </li>
            )}
            {product.tags && product.tags.length > 0 && (
              <li>
                <span className="font-medium">Tags:</span>{" "}
                {product.tags.map((tag: any, index: number) => (
                  <span key={tag.id}>
                    {tag.name}
                    {index < product.tags.length - 1 ? ", " : ""}
                  </span>
                ))}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

