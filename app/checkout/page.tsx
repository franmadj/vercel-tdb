import { getPageBySlug } from "@/lib/api"

export default async function AboutPage() {
  // Try to fetch the About page from WordPress
  let aboutPage
  try {
    aboutPage = await getPageBySlug("about")
  } catch (error) {
    console.error("Error fetching About page:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{aboutPage ? aboutPage.title.rendered : "About Us"}</h1>

        {aboutPage ? (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: aboutPage.content.rendered }} />
        ) : (
          <div className="prose max-w-none">
            <p>
              Welcome to our website! We are a company dedicated to providing high-quality products and services to our
              customers.
            </p>
            <p>
              This is a placeholder about page. To replace this content, create an "About" page in your WordPress admin
              dashboard.
            </p>
            <p>
              Our mission is to deliver exceptional value and experiences to our customers through innovative solutions
              and dedicated service.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Enable ISR - revalidate content every 60 seconds
export const revalidate = 60

