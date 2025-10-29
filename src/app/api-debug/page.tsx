export default function ApiDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Debug Page</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test API Endpoints</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Test Endpoint</h3>
              <a
                href="/api/test"
                target="_blank"
                className="text-blue-600 hover:text-blue-800"
              >
                /api/test
              </a>
            </div>

            <div>
              <h3 className="font-medium">Database Tables API</h3>
              <a
                href="/api/admin/database/tables"
                target="_blank"
                className="text-blue-600 hover:text-blue-800"
              >
                /api/admin/database/tables
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Browser Console Test</h2>
          <p className="text-gray-600 mb-4">
            Open browser console and run:
          </p>
          <pre className="bg-gray-100 p-4 rounded text-sm">
{`fetch('/api/test')
  .then(r => r.json())
  .then(console.log)`}
          </pre>
        </div>
      </div>
    </div>
  )
}








