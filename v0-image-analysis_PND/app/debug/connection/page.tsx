import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { testDatabaseConnection } from "@/lib/database-connection"
import { CheckCircle, AlertCircle, Database, Info } from "lucide-react"

export default async function ConnectionDebugPage() {
  const connectionTest = await testDatabaseConnection()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Database Connection Test</h1>
          <p className="text-gray-600">Testing the database connection with proper validation</p>
        </div>

        {/* Connection Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {connectionTest.success ? (
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                )}
                <span className="font-semibold">
                  {connectionTest.success ? "Connection Successful" : "Connection Failed"}
                </span>
              </div>
              <Badge variant={connectionTest.success ? "default" : "destructive"}>
                {connectionTest.success ? "Connected" : "Error"}
              </Badge>
            </div>

            {connectionTest.success && connectionTest.data && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Connection Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>User:</strong> {connectionTest.data.user_name}
                  </div>
                  <div>
                    <strong>Database:</strong> {connectionTest.data.database_name}
                  </div>
                  <div className="col-span-2">
                    <strong>Version:</strong> {connectionTest.data.pg_version}
                  </div>
                  <div className="col-span-2">
                    <strong>Connection String:</strong> {connectionTest.connectionString}
                  </div>
                </div>
              </div>
            )}

            {!connectionTest.success && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Connection Error</AlertTitle>
                <AlertDescription className="text-red-700">
                  <div className="mt-2">
                    <strong>Error:</strong> {connectionTest.error}
                  </div>
                  <div className="mt-2">
                    <strong>Connection String:</strong> {connectionTest.connectionString}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Troubleshooting Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Troubleshooting Guide
            </CardTitle>
            <CardDescription>If the connection failed, follow these steps to resolve the issue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-900">1. Check Your Environment Variables</h4>
              <p className="text-sm text-gray-700 mt-1">
                Ensure you have a valid PostgreSQL connection string in one of these environment variables:
              </p>
              <ul className="text-sm text-gray-600 mt-2 ml-4 list-disc">
                <li>NEON_NEON_DATABASE_URL</li>
                <li>DATABASE_URL</li>
                <li>POSTGRES_URL</li>
                <li>NEON_POSTGRES_URL</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-yellow-900">2. Verify Connection String Format</h4>
              <p className="text-sm text-gray-700 mt-1">Your connection string should look like this:</p>
              <code className="block bg-gray-100 p-2 rounded text-xs mt-2">
                postgresql://username:password@host:port/database?sslmode=require
              </code>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-900">3. Get Connection String from Neon</h4>
              <ol className="text-sm text-gray-700 mt-1 ml-4 list-decimal">
                <li>
                  Go to{" "}
                  <a
                    href="https://console.neon.tech/"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Neon Console
                  </a>
                </li>
                <li>Select your project</li>
                <li>Go to "Connection Details"</li>
                <li>Copy the connection string</li>
                <li>Add it to your .env.local file</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
