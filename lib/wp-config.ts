export function validateApiUrl(url: string | undefined): boolean {
  if (!url) return false

  try {
    const parsedUrl = new URL(url)
    return !!parsedUrl.hostname
  } catch (e) {
    return false
  }
}

// Get the base URL for the WordPress site (without the /wp-json part)
export function getWordPressBaseUrl(apiUrl: string | undefined): string {
  if (!apiUrl) return ""

  try {
    const url = new URL(apiUrl)
    // Remove /wp-json/wp/v2 or similar from the path
    const pathParts = url.pathname.split("/")
    const wpJsonIndex = pathParts.findIndex((part) => part === "wp-json")

    if (wpJsonIndex !== -1) {
      // Reconstruct the URL without the wp-json and following parts
      const basePath = pathParts.slice(0, wpJsonIndex).join("/")
      return `${url.protocol}//${url.host}${basePath}`
    }

    return `${url.protocol}//${url.host}`
  } catch (e) {
    return ""
  }
}

// Generate a troubleshooting guide based on the error
export function getTroubleshootingSteps(error: Error): string[] {
  const steps = [
    "Verify your WordPress site is accessible",
    "Check that the REST API is enabled in WordPress",
    "Ensure your environment variables are set correctly",
  ]

  if (error.message.includes("403")) {
    steps.push(
      "Your WordPress site may be blocking REST API access. Check if you need to:",
      "- Install and configure the JWT Authentication plugin",
      "- Add CORS headers to your WordPress site",
      "- Disable any security plugins that might be blocking API access",
    )
  }

  if (error.message.includes("404")) {
    steps.push(
      "The REST API endpoint may not exist. Check if:",
      "- Your WordPress URL is correct",
      "- The REST API is enabled in WordPress",
      "- You're using the correct endpoint path",
    )
  }

  return steps
}

