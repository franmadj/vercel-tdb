import { samplePosts, sampleCategories, samplePages } from "./sample-data"

// Fetch data from WordPress REST API with better error handling and authentication options
export async function fetchAPI(endpoint: string) {
  try {
    // Build the full URL
    const apiUrl = `${process.env.WORDPRESS_API_URL}/${endpoint}`
    console.log(`Fetching from: ${apiUrl}`)

    // Make the request with proper headers
    const res = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        // Add this line to identify your application to the WordPress site
        "User-Agent": "Headless WordPress/1.0",
      },
      // This is important for handling cookies if your WordPress site requires them
      credentials: "same-origin",
      // Add a cache control directive
      cache: "no-store",
    })

    // Check if the response is ok (status in the range 200-299)
    if (!res.ok) {
      // Log detailed error information
      console.error(`API error: ${res.status} ${res.statusText}`)

      // For 403 errors, provide more specific information
      if (res.status === 403) {
        throw new Error(
          `Access forbidden. Your WordPress site may require authentication or have REST API restrictions.`,
        )
      }

      throw new Error(`Failed to fetch data: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("API fetch error:", error)
    // Return empty data instead of throwing to prevent page from crashing
    return { posts: [], pages: [] }
  }
}

// Get all posts with fallback for errors
export async function getAllPosts(page = 1, perPage = 9) {
  try {
    const data = await fetchAPI(`posts?_embed&page=${page}&per_page=${perPage}`)
    return data || []
  } catch (error) {
    console.error("Error fetching posts:", error)
    console.log("Using sample data as fallback")
    // Return sample data as fallback
    return samplePosts
  }
}

// Get total number of posts with fallback
export async function getPostsCount() {
  try {
    const res = await fetch(`${process.env.WORDPRESS_API_URL}/posts?per_page=1`)
    return Number.parseInt(res.headers.get("X-WP-Total") || "0", 10)
  } catch (error) {
    console.error("Error fetching post count:", error)
    return 0
  }
}

// Get a single post by slug with fallback
export async function getPostBySlug(slug: string) {
  try {
    const posts = await fetchAPI(`posts?slug=${slug}&_embed`)
    return posts[0] || null
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error)
    // Return matching sample post if available
    return samplePosts.find((post) => post.slug === slug) || null
  }
}

// Get all pages with fallback
export async function getAllPages() {
  try {
    const pages = await fetchAPI("pages?_embed")
    return pages || []
  } catch (error) {
    console.error("Error fetching pages:", error)
    console.log("Using sample pages as fallback")
    return samplePages
  }
}

// Get a single page by slug with fallback
export async function getPageBySlug(slug: string) {
  try {
    const pages = await fetchAPI(`pages?slug=${slug}&_embed`)
    return pages[0] || null
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error)
    // Return matching sample page if available
    return samplePages.find((page) => page.slug === slug) || null
  }
}

// Get all categories with fallback
export async function getAllCategories() {
  try {
    const categories = await fetchAPI("categories")
    return categories || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    console.log("Using sample categories as fallback")
    return sampleCategories
  }
}

// Get posts by category with fallback
export async function getPostsByCategory(categoryId: number, page = 1, perPage = 9) {
  try {
    const posts = await fetchAPI(`posts?categories=${categoryId}&_embed&page=${page}&per_page=${perPage}`)
    return posts || []
  } catch (error) {
    console.error(`Error fetching posts for category ${categoryId}:`, error)
    return []
  }
}

// Get all tags with fallback
export async function getAllTags() {
  try {
    const tags = await fetchAPI("tags")
    return tags || []
  } catch (error) {
    console.error("Error fetching tags:", error)
    return []
  }
}

// Get posts by tag with fallback
export async function getPostsByTag(tagId: number, page = 1, perPage = 9) {
  try {
    const posts = await fetchAPI(`posts?tags=${tagId}&_embed&page=${page}&per_page=${perPage}`)
    return posts || []
  } catch (error) {
    console.error(`Error fetching posts for tag ${tagId}:`, error)
    return []
  }
}

// Search posts with fallback
export async function searchPosts(searchTerm: string, page = 1, perPage = 9) {
  try {
    const posts = await fetchAPI(
      `posts?search=${encodeURIComponent(searchTerm)}&_embed&page=${page}&per_page=${perPage}`,
    )
    return posts || []
  } catch (error) {
    console.error(`Error searching posts for "${searchTerm}":`, error)
    return []
  }
}

