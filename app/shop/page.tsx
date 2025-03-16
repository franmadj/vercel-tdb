import { getProducts, getProductCategories } from "@/lib/woocommerce"
import ProductCard from "@/components/product-card"
import Pagination from "@/components/pagination"
import Link from "next/link"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { page: string; category: string }
}) {
  const currentPage = Number(searchParams.page) || 1
  const categoryId = searchParams.category ? Number(searchParams.category) : undefined
  const productsPerPage = 12

  // Fetch products and categories
  const products = await getProducts(currentPage, productsPerPage, categoryId)
  const categories = await getProductCategories()

  // Get total products count
  const totalProducts = products.length > 0 ? Number.parseInt(products[0]?.total || "0", 10) : 0
  const totalPages = Math.ceil(totalProducts / productsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar with categories */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className={`block hover:text-blue-600 ${!categoryId ? "font-semibold text-blue-600" : ""}`}
                >
                  All Products
                </Link>
              </li>
              {categories.map((category: any) => (
                <li key={category.id}>
                  <Link
                    href={`/shop?category=${category.id}`}
                    className={`block hover:text-blue-600 ${categoryId === category.id ? "font-semibold text-blue-600" : ""}`}
                  >
                    {category.name} ({category.count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Products grid */}
        <div className="md:col-span-3">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No products found.</p>
              <Link href="/shop" className="mt-4 inline-block text-blue-600 hover:underline">
                View all products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Enable ISR - revalidate content every 60 seconds
export const revalidate = 60

