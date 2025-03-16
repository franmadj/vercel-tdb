"use client"

import { useState } from "react"
import { validateApiUrl } from "@/lib/wp-config"

export default function ApiTroubleshooter() {
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "")
  const [testResult, setTestResult] = useState<null | { success: boolean; message: string }>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    if (!validateApiUrl(apiUrl)) {
      setTestResult({
        success: false,
        message: "Please enter a valid URL",
      })
      return
    }

    setIsLoading(true)
    setTestResult(null)

    try {
      // Test the connection to the WordPress API
      const response = await fetch(apiUrl + "/posts?per_page=1", {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Headless WordPress/1.0",
        },
        cache: "no-store",
      })

      if (response.ok) {
        setTestResult({
          success: true,
          message: "Connection successful! The WordPress REST API is accessible.",
        })
      } else {
        setTestResult({
          success: false,
          message: `Connection failed with status: ${response.status} ${response.statusText}`,
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">WordPress API Connection Tester</h2>

      <div className="mb-4">
        <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-1">
          WordPress API URL
        </label>
        <input
          type="text"
          id="apiUrl"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="https://your-site.com/wp-json/wp/v2"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">Example: https://your-wordpress-site.com/wp-json/wp/v2</p>
      </div>

      <button
        onClick={testConnection}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-70"
      >
        {isLoading ? "Testing..." : "Test Connection"}
      </button>

      {testResult && (
        <div
          className={`mt-4 p-4 rounded-md ${testResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
        >
          <p className="font-medium">{testResult.message}</p>

          {!testResult.success && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Verify your WordPress site is accessible</li>
                <li>Check that the REST API is enabled in WordPress</li>
                <li>
                  Add these lines to your WordPress theme's functions.php file:
                  <pre className="bg-gray-100 p-2 mt-1 rounded text-sm overflow-x-auto">
                    {`add_action('init', function() {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Headers: Authorization, Content-Type');
});`}
                  </pre>
                </li>
                <li>Disable any security plugins that might be blocking API access</li>
                <li>Check if your WordPress site requires authentication for the REST API</li>
              </ol>
            </div>
          )}

          {testResult.success && (
            <p className="mt-2">
              Your WordPress REST API is working correctly. If you're still having issues, make sure your environment
              variables are set correctly.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

