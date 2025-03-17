import { getAllPosts, getPostsCount } from "@/lib/api"
import PostCard from "@/components/post-card"
import Pagination from "@/components/pagination"

type params= Promise<{ search?: string }>

type Post = {
  id: string;      // or `number`, depending on your data type
  title: string;
  // add other fields here depending on the properties of `post`
}

export default async function Home({ params }: { params: params }) {

  const resolvedParams = await params;  // Resolving the params promise


  // Get search params safely
  const searchParams = new URLSearchParams(resolvedParams?.search || "");
  const page = Number(searchParams.get("page")) || 1;

  const postsPerPage = 9;
  const posts = await getAllPosts(page, postsPerPage);
  const totalPosts = await getPostsCount();
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>

      {posts.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post:Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={page} />}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Unable to fetch posts</h2>
          <p className="text-gray-600 mb-6">
            There might be an issue connecting to your WordPress site. Please check your configuration.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg text-left mb-6">
            <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Verify your WordPress site is accessible</li>
              <li>Check that the REST API is enabled in WordPress</li>
              <li>Ensure your environment variables are set correctly</li>
              <li>Check if your WordPress site requires authentication for the REST API</li>
              <li>Verify CORS is properly configured on your WordPress site</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-left">
            <h3 className="font-semibold mb-2">Sample Data Configuration:</h3>
            <p className="mb-2">
              If you want to continue development with sample data while fixing the API connection, you can create a
              mock data file.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Enable ISR - revalidate content every 60 seconds
export const revalidate = 60

