import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createTablesWithEnhancedDiagnostics, seedSampleDataSafely } from "@/lib/database-troubleshoot"
import { CheckCircle, AlertCircle, Database, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function CreateTablesPage() {
  const result = await createTablesWithEnhancedDiagnostics()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/debug/database">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Diagnostics
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Table Creation Results</h1>
          <Badge variant={result.success ? "default" : "destructive"} className="text-lg px-4 py-2">
            {result.success ? "Success" : "Failed"}
          </Badge>
        </div>

        {/* Connection Used */}
        {result.connectionUsed && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Connection Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">
                  Successfully connected using:{" "}
                  <code className="bg-green-100 px-2 py-1 rounded">{result.connectionUsed}</code>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tables Created */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tables Creation Status</CardTitle>
            <CardDescription>Status of each table creation attempt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.tablesCreated.map((table, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="font-medium">{table.name}</span>
                  </div>
                  <Badge variant="default">Created</Badge>
                </div>
              ))}

              {result.tablesCreated.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No tables were created</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Errors */}
        {result.errors.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                Errors Encountered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.errors.map((error, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="font-medium text-red-800 mb-2">
                      {error.table ? `Table: ${error.table}` : error.type}
                    </div>
                    <div className="text-red-700 text-sm">{error.error}</div>
                    {error.sql && (
                      <details className="mt-2">
                        <summary className="text-red-600 cursor-pointer text-sm">Show SQL</summary>
                        <pre className="text-xs bg-red-100 p-2 rounded mt-1 overflow-x-auto">{error.sql}</pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 mb-3">✅ Tables created successfully! You can now:</p>
                  <div className="space-y-2">
                    <form action={seedSampleDataSafely}>
                      <Button type="submit" className="w-full">
                        Seed Sample Data
                      </Button>
                    </form>
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800 mb-3">❌ Table creation failed. Please:</p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Check the error messages above</li>
                  <li>• Verify your database connection</li>
                  <li>• Ensure you have proper permissions</li>
                  <li>• Try running the diagnostics again</li>
                </ul>
                <Link href="/debug/database">
                  <Button variant="outline" className="mt-3">
                    Back to Diagnostics
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
