import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createAllTables, seedInitialData, checkTablesExist } from "@/lib/database-setup"
import { testDatabaseConnection, isDatabaseAvailable } from "@/lib/database-connection"
import { CheckCircle, AlertCircle, Database, Play, SproutIcon as Seed, Info } from "lucide-react"

export default async function SetupPage() {
  const connectionTest = await testDatabaseConnection()
  const tablesCheck = await checkTablesExist()
  const dbAvailable = isDatabaseAvailable()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Database Setup</h1>
          <p className="text-gray-600">Configure your Portal PND database</p>
        </div>

        {/* Mock Mode Alert */}
        {!dbAvailable && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode Active:</strong> No database connection configured. The app is running with mock data.
              To use a real database, please configure your environment variables with a valid PostgreSQL connection
              string.
              <br />
              <br />
              <strong>Demo Login:</strong> Email: demo@portalpnd.com, Password: demo123
            </AlertDescription>
          </Alert>
        )}

        {/* Connection Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Database Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connectionTest.success ? (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-800 font-medium">Connection Successful</span>
                </div>
                <div className="text-green-700 text-sm space-y-1">
                  <p>Database: {connectionTest.data?.database_name}</p>
                  <p>User: {connectionTest.data?.user_name}</p>
                  <p>Connection: {connectionTest.connectionString}</p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-yellow-800 font-medium">
                    {connectionTest.mockMode ? "Running in Demo Mode" : "Connection Failed"}
                  </span>
                </div>
                <div className="text-yellow-700 text-sm">
                  {connectionTest.mockMode
                    ? "No database configured. Using mock data for demonstration."
                    : connectionTest.error}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tables Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Database Tables</CardTitle>
            <CardDescription>Status of required database tables</CardDescription>
          </CardHeader>
          <CardContent>
            {tablesCheck.mockMode ? (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Info className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-yellow-800 font-medium">Demo Mode - No Database Tables</span>
                </div>
                <div className="text-yellow-700 text-sm">
                  Configure a database connection to create and manage tables.
                </div>
              </div>
            ) : tablesCheck.success ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Tables Status</span>
                  <Badge variant={tablesCheck.allTablesExist ? "default" : "destructive"}>
                    {tablesCheck.allTablesExist ? "All tables exist" : "Missing tables"}
                  </Badge>
                </div>

                {tablesCheck.existingTables.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">Existing Tables:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tablesCheck.existingTables.map((table) => (
                        <Badge key={table} variant="outline" className="text-green-700">
                          {table}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {tablesCheck.missingTables.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">Missing Tables:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tablesCheck.missingTables.map((table) => (
                        <Badge key={table} variant="destructive">
                          {table}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-800 font-medium">Cannot check tables</span>
                </div>
                <div className="text-red-700 text-sm">{tablesCheck.error}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Actions</CardTitle>
            <CardDescription>Initialize your database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createAllTables}>
              <Button type="submit" className="w-full" disabled={!connectionTest.success}>
                <Play className="w-4 h-4 mr-2" />
                Create Database Tables
              </Button>
            </form>

            <form action={seedInitialData}>
              <Button
                type="submit"
                variant="outline"
                className="w-full"
                disabled={!connectionTest.success || !tablesCheck.allTablesExist}
              >
                <Seed className="w-4 h-4 mr-2" />
                Seed Initial Data
              </Button>
            </form>

            {connectionTest.success && tablesCheck.allTablesExist && (
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-800 font-medium">Database is ready!</p>
                <p className="text-green-700 text-sm">You can now use the Portal PND with full functionality</p>
              </div>
            )}

            {!dbAvailable && (
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Info className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-blue-800 font-medium">Demo Mode Active</p>
                <p className="text-blue-700 text-sm">The app is fully functional with mock data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
