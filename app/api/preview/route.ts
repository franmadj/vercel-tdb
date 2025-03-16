import { draftMode } from "next/headers"
import { redirect } from "next/navigation"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")
  const slug = searchParams.get("slug")
  const postType = searchParams.get("type") || "posts"

  // Check the secret and required parameters
  if (secret !== process.env.PREVIEW_SECRET || !slug) {
    //return new Response("Invalid token", { status: 401 })
  }

  // Enable Draft Mode
  draftMode().enable()

  // Redirect to the path from the fetched post
  redirect(`/${postType === "posts" ? "posts" : "pages"}/${slug}`)
}

