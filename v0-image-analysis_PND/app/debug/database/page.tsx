import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { comprehensiveDatabaseDiagnostics, createTablesWithEnhancedDiagnostics } from "@/lib/database-troubleshoot"
import { AlertCircle, CheckCircle, Database, Info, AlertTriangle, Clock, Settings, ExternalLink } from "lucide-react"

export default async function DatabaseDebugPage() {
  const diagnostics = await comprehensiveDatabaseDiagnostics()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Database Connection Diagnostics & Troubleshooting</h1>
          <p className="text-gray-600">Comprehensive analysis to resolve "Tenant or user not found" errors</p>
          <Badge variant="outline" className="mt-2">
            <Clock className="w-3 h-3 mr-1" />
            Generated: {new Date(diagnostics.timestamp).toLocaleString()}
          </Badge>
        </div>

        {/* Critical Issues Alert */}
        {diagnostics.criticalIssues.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Critical Issues Detected</AlertTitle>
            <AlertDescription className="text-red-700">
              {diagnostics.criticalIssues.map((issue, index) => (
                <div key={index} className="mt-2">
                  <strong>{issue.type}:</strong> {issue.message}
                  {issue.affectedConnections && (
                    <div className="text-sm mt-1">Affected: {issue.affectedConnections.join(", ")}</div>
                  )}
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Connection Test Results */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Connection Test Results
            </CardTitle>
            <CardDescription>Testing all available database connection strings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diagnostics.connectionTests.map((test, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {test.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <span className="font-semibold">{test.variable}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={test.success ? "default" : "destructive"}>
                        {test.success ? "Connected" : "Failed"}
                      </Badge>
                      <span className="text-sm text-gray-500">{test.timing}ms</span>
                    </div>
                  </div>

                  {test.success && test.details && (
                    <div className="bg-green-50 p-3 rounded text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <strong>User:</strong> {test.details.user_name}
                        </div>
                        <div>
                          <strong>Database:</strong> {test.details.database_name}
                        </div>
                        <div className="col-span-2">
                          <strong>Version:</strong> {test.details.pg_version}
                        </div>
                      </div>
                    </div>
                  )}

                  {test.error && (
                    <div className="bg-red-50 p-3 rounded text-sm">
                      <div>
                        <strong>Error:</strong> {test.error.message}
                      </div>
                      {test.error.code && (
                        <div>
                          <strong>Code:</strong> {test.error.code}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {diagnostics.connectionTests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No database connection strings found in environment variables</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Environment Variables Analysis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Environment Variables Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(diagnostics.environmentCheck).map(([varName, details]) => (
                <div key={varName} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">{varName}</span>
                    <Badge variant={details.exists ? "default" : "secondary"}>
                      {details.exists ? "Set" : "Missing"}
                    </Badge>
                  </div>

                  {details.exists && (
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Preview: {details.preview}</div>
                      <div>Length: {details.length} chars</div>
                      <div>
                        Format:
                        <Badge
                          variant={details.format.format === "valid" ? "default" : "destructive"}
                          className="ml-1 text-xs"
                        >
                          {details.format.format}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Solutions */}
        {diagnostics.solutions.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Recommended Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {diagnostics.solutions.map((solution, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      {solution.title}
                      <Badge className="ml-2" variant={solution.priority === "CRITICAL" ? "destructive" : "default"}>
                        {solution.priority}
                      </Badge>
                    </h4>
                    <ol className="text-sm text-gray-700 space-y-1">
                      {solution.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Automated tools to help resolve database issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <form action={createTablesWithEnhancedDiagnostics}>
                <Button type="submit" className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Create Tables (Safe Mode)
                </Button>
              </form>

              <Button variant="outline" className="w-full" asChild>
                <a href="https://console.neon.tech/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Neon Console
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Step-by-Step Troubleshooting Guide</CardTitle>
            <CardDescription>Follow these steps to resolve "Tenant or user not found" errors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-900">🚨 Immediate Actions</h4>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>• Check if your Neon project is active (not suspended)</li>
                <li>• Verify you're using the correct project ID in the connection string</li>
                <li>• Ensure your database user exists and has proper permissions</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-yellow-900">⚠️ Connection String Issues</h4>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>• Copy the connection string exactly from Neon dashboard</li>
                <li>• Ensure it includes ?sslmode=require at the end</li>
                <li>• Check for any extra spaces or characters</li>
                <li>• Verify the format: postgresql://user:pass@host/db?sslmode=require</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-900">🔧 Environment Setup</h4>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>• Create .env.local file in your project root</li>
                <li>• Add: NEON_NEON_DATABASE_URL=your_connection_string</li>
                <li>• Restart your development server</li>
                <li>• Test the connection using the diagnostic tools above</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-900">✅ Verification Steps</h4>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>• Run the connection test above to verify it works</li>
                <li>• Create tables using the safe mode button</li>
                <li>• Test basic database operations</li>
                <li>• Monitor for any recurring issues</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
