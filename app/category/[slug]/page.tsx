import { fetchAPI, getPostsByCategory } from "@/lib/api"
import PostCard from "@/components/post-card"
import Pagination from "@/components/pagination"

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { page: string }
}) {
  const currentPage = Number(searchParams.page) || 1
  const postsPerPage = 9

  // Get category by slug
  const categories = await fetchAPI(`categories?slug=${params.slug}`)
  const category = categories[0]

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Category not found</h1>
        <p>The category you're looking for doesn't exist.</p>
        <a href="/" className="text-blue-600 hover:underline">
          Return to home
        </a>
      </div>
    )
  }

  // Get posts for this category
  const posts = await getPostsByCategory(category.id, currentPage, postsPerPage)

  // Get total posts count for this category
  const res = await fetch(`${process.env.WORDPRESS_API_URL}/posts?categories=${category.id}&per_page=1`)
  const totalPosts = Number.parseInt(res.headers.get("X-WP-Total") || "0", 10)
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Category: {category.name}</h1>
      <div className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: category.description || "" }} />

      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No posts found in this category.</p>
          <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to home page
          </a>
        </div>
      )}

      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  )
}

// Enable ISR - revalidate content every 60 seconds
export const revalidate = 60

