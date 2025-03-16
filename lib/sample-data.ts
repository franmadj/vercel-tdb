export const samplePosts = [
  {
    id: 1,
    title: { rendered: "Welcome to Your Headless WordPress Site" },
    excerpt: {
      rendered: "<p>This is a sample post that appears when your WordPress API connection is being configured.</p>",
    },
    content: {
      rendered:
        "<p>This is a sample post that appears when your WordPress API connection is being configured. Once your connection is working, you'll see your actual WordPress content here.</p><p>If you're seeing this, it means there might be an issue with your WordPress REST API connection. Check the troubleshooting steps on the home page.</p>",
    },
    slug: "welcome-post",
    date: "2023-01-01T12:00:00",
    _embedded: {
      "wp:featuredmedia": [{ source_url: "/placeholder.svg?height=300&width=400" }],
      "wp:term": [[{ id: 1, name: "Sample Category", slug: "sample" }]],
    },
  },
  {
    id: 2,
    title: { rendered: "Getting Started with Headless WordPress" },
    excerpt: { rendered: "<p>Learn how to set up your headless WordPress site with Next.js.</p>" },
    content: {
      rendered:
        "<p>This is another sample post. In a real setup, this content would come from your WordPress site.</p>",
    },
    slug: "getting-started",
    date: "2023-01-02T12:00:00",
    _embedded: {
      "wp:featuredmedia": [{ source_url: "/placeholder.svg?height=300&width=400" }],
      "wp:term": [[{ id: 1, name: "Sample Category", slug: "sample" }]],
    },
  },
  {
    id: 3,
    title: { rendered: "Customizing Your Theme" },
    excerpt: { rendered: "<p>Tips for customizing your headless WordPress theme.</p>" },
    content: {
      rendered:
        "<p>This is a third sample post. Your actual content will appear once the API connection is working.</p>",
    },
    slug: "customizing-theme",
    date: "2023-01-03T12:00:00",
    _embedded: {
      "wp:featuredmedia": [{ source_url: "/placeholder.svg?height=300&width=400" }],
      "wp:term": [[{ id: 1, name: "Sample Category", slug: "sample" }]],
    },
  },
]

export const sampleCategories = [
  { id: 1, name: "Sample Category", slug: "sample", count: 3 },
  { id: 2, name: "Another Category", slug: "another", count: 0 },
]

export const samplePages = [
  {
    id: 1,
    title: { rendered: "About" },
    content: {
      rendered:
        "<p>This is a sample About page. Your actual content will appear once the API connection is working.</p>",
    },
    slug: "about",
  },
  {
    id: 2,
    title: { rendered: "Contact" },
    content: {
      rendered:
        "<p>This is a sample Contact page. Your actual content will appear once the API connection is working.</p>",
    },
    slug: "contact",
  },
]

