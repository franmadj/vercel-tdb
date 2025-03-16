import Link from "next/link"
import Image from "next/image"

interface PostCardProps {
  post: any
}

export default function PostCard({ post }: PostCardProps) {
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0]
  const imageUrl = featuredMedia?.source_url || "/placeholder.svg?height=300&width=400"
  const categories = post._embedded?.["wp:term"]?.[0] || []
  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="border rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={post.title.rendered || "Post featured image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
        <h2
          className="text-xl font-semibold mb-2 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div className="text-gray-600 mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{date}</span>
          <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:underline text-sm font-medium">
            Read more
          </Link>
        </div>
      </div>
    </article>
  )
}

