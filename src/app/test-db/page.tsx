export default function TestDatabasePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supabase Database Connection Test</h1>
          <p className="text-gray-600">Database configuration and connection testing</p>
        </div>

        {/* Connection Configuration */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></div>
              Database Configuration
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Connection String:</span>
                <span className="font-mono text-xs break-all bg-gray-100 p-1 rounded">
                  postgresql://postgres.rjgzvsuhjxpppvjzzrpq:password@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Pooler:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Transaction Pooler</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="text-yellow-600">⚠ Configured (needs credentials)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Supabase Features</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Optimized for:</span>
                <span>Serverless applications</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Connection Type:</span>
                <span>Stateless, brief interactions</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Port:</span>
                <span className="font-mono">6543</span>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🚀 Database Setup Required</h3>
          <p className="text-blue-800 mb-4">
            To test the real database connection, you need to:
          </p>
          <ol className="text-blue-800 list-decimal list-inside space-y-2 mb-4">
            <li>Add your actual Supabase database password to <code className="bg-blue-100 px-2 py-1 rounded">.env.local</code></li>
            <li>Run the SQL script in <code className="bg-blue-100 px-2 py-1 rounded">database/init-test-tables.sql</code> in your Supabase SQL Editor</li>
            <li>The script will create 3 test tables with sample data</li>
          </ol>
          <p className="text-blue-800">
            Once configured, this page will show real-time database information including table counts and connection status.
          </p>
        </div>

        {/* Expected Results */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Expected Test Results</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Test Tables</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">7</div>
              <div className="text-sm text-gray-600">Sample Records</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">✓</div>
              <div className="text-sm text-gray-600">Connected</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Tables that will be created:</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• <code className="bg-gray-200 px-1 rounded">test_users</code> - 4 sample users</li>
              <li>• <code className="bg-gray-200 px-1 rounded">test_posts</code> - 4 sample posts</li>
              <li>• <code className="bg-gray-200 px-1 rounded">test_categories</code> - 4 sample categories</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
