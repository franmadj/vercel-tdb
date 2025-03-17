import { getAllPosts, getPostBySlug } from "@/lib/api"
import Link from "next/link"


type Post = {
  slug: string;      // or `number`, depending on your data type
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts()

  return posts.map((post:Post) => ({
    slug: post.slug,
  }))
}

type params= Promise<{ slug: string }>


export default async function Post({ params }: { params: params }) {

  const resolvedParams = await params;  // Resolving the params promise


  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to home
      </Link>

      <article className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

        {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
          <img
            src={post._embedded["wp:featuredmedia"][0].source_url || "/placeholder.svg"}
            alt={post.title.rendered}
            className="w-full h-64 object-cover mb-6 rounded-lg"
          />
        )}

        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </article>
    </main>
  )
}

// Enable ISR - revalidate content every 60 seconds
export const revalidate = 60

