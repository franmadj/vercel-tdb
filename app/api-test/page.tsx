import ApiTroubleshooter from "@/components/api-troubleshooter"

export default function ApiTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">WordPress API Connection Test</h1>

      <div className="max-w-2xl mx-auto">
        <ApiTroubleshooter />

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">WordPress REST API Setup Guide</h2>

          <ol className="list-decimal list-inside space-y-4">
            <li>
              <strong>Enable the REST API in WordPress</strong>
              <p className="ml-6 mt-1 text-gray-700">
                The REST API is enabled by default in WordPress 4.7+, but some security plugins might disable it.
              </p>
            </li>

            <li>
              <strong>Configure CORS in WordPress</strong>
              <p className="ml-6 mt-1 text-gray-700">
                Add CORS headers to allow your Next.js app to access the WordPress API.
              </p>
              <div className="ml-6 mt-2 bg-gray-100 p-3 rounded">
                <p className="font-medium mb-1">Add to your theme's functions.php:</p>
                <pre className="text-sm overflow-x-auto">
                  {`add_action('init', function() {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Headers: Authorization, Content-Type');
});`}
                </pre>
              </div>
            </li>

            <li>
              <strong>Check Security Plugins</strong>
              <p className="ml-6 mt-1 text-gray-700">
                Plugins like Wordfence, iThemes Security, or Sucuri might block REST API access. Check their settings or
                temporarily disable them for testing.
              </p>
            </li>

            <li>
              <strong>Verify Environment Variables</strong>
              <p className="ml-6 mt-1 text-gray-700">
                Make sure your .env.local file has the correct WordPress API URL:
              </p>
              <pre className="ml-6 mt-2 bg-gray-100 p-3 rounded text-sm">
                {`WORDPRESS_API_URL=https://your-site.com/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json/wp/v2`}
              </pre>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}

