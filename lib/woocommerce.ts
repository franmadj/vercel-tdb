// Example of authenticated WooCommerce API request with support for different methods
export async function fetchWooCommerceAPI(endpoint: string, options: RequestInit = {}) {
  // For WooCommerce API v3
  const wcApiUrl = `${process.env.WORDPRESS_API_URL.replace("/wp/v2", "")}/wc/v3/${endpoint}`

  // Create authentication string
  const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64")

  // Merge default options with provided options
  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  const res = await fetch(wcApiUrl, fetchOptions)

  if (!res.ok) {
    throw new Error(`Failed to fetch WooCommerce data: ${res.status}`)
  }

  return res.json()
}

// Get all products with pagination
export async function getProducts(page = 1, perPage = 12, category?: number) {
  let endpoint = `products?page=${page}&per_page=${perPage}&_embed`

  if (category) {
    endpoint += `&category=${category}`
  }

  return fetchWooCommerceAPI(endpoint)
}

// Get a single product by ID
export async function getProductById(id: number) {
  return fetchWooCommerceAPI(`products/${id}`)
}

// Get a single product by slug
export async function getProductBySlug(slug: string) {
  const products = await fetchWooCommerceAPI(`products?slug=${slug}`)
  return products[0]
}

// Get featured products
export async function getFeaturedProducts(limit = 4) {
  return fetchWooCommerceAPI(`products?featured=true&per_page=${limit}`)
}

// Get product categories
export async function getProductCategories() {
  return fetchWooCommerceAPI("products/categories")
}

// Get products by category
export async function getProductsByCategory(categoryId: number, page = 1, perPage = 12) {
  return fetchWooCommerceAPI(`products?category=${categoryId}&page=${page}&per_page=${perPage}`)
}

// Search products
export async function searchProducts(searchTerm: string, page = 1, perPage = 12) {
  return fetchWooCommerceAPI(`products?search=${encodeURIComponent(searchTerm)}&page=${page}&per_page=${perPage}`)
}

