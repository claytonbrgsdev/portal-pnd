export default function TestDatabasePage() {
  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Supabase Transaction Pooler Configuration
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Database Configuration</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Pooler Type:</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                Transaction Pooler
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Ideal for:</span>
              <span>Stateless applications, serverless functions</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Connection:</span>
              <span className="font-mono text-xs break-all">
                aws-1-sa-east-1.pooler.supabase.com:6543
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="text-green-600 dark:text-green-400">✓ Configured</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Connection String</h3>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded font-mono text-sm break-all">
            postgresql://postgres.rjgzvsuhjxpppvjzzrpq:password@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <strong>Note:</strong> Replace &apos;password&apos; with your actual Supabase database password in your .env.local file
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Pooler Benefits</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">✅ Advantages</h4>
              <ul className="text-sm space-y-1">
                <li>• Optimized for short-lived connections</li>
                <li>• Automatic connection pooling</li>
                <li>• Ideal for serverless functions</li>
                <li>• Perfect for stateless applications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">ℹ️ Characteristics</h4>
              <ul className="text-sm space-y-1">
                <li>• Port 6543 (not standard 5432)</li>
                <li>• No PREPARE statement support</li>
                <li>• Designed for brief interactions</li>
                <li>• Automatic cleanup of connections</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">🚀 Ready for Production</h3>
          <p className="text-yellow-700 dark:text-yellow-300">
            Your Supabase Transaction Pooler is configured and ready to use! The database utilities are set up
            for optimal performance with serverless applications. Make sure to add your actual database password
            to the .env.local file for full functionality.
          </p>
        </div>
      </div>
    </div>
  );
}
