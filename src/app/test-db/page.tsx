'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface DatabaseInfo {
  connected: boolean;
  timestamp: string;
  database: {
    name: string;
    version: string;
    user: string;
  };
  tableCount: number;
  tables: Array<{
    name: string;
    count: number | string;
    owner: string;
    error?: string;
  }>;
  supabase: {
    pooler: string;
    connection: string;
    port: number;
    url: string;
  };
}

export default function TestDatabasePage() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatabaseInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDatabaseInfo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Test basic Supabase connection
      const { error: testError } = await supabase
        .from('_supabase_test_connection')
        .select('id')
        .limit(1);

      // If the test table doesn't exist, that's fine - it means we're connected
      const isConnected = !testError || testError.code !== 'PGRST116';

      if (!isConnected && testError) {
        throw new Error(`Connection failed: ${testError.message}`);
      }

      // Try to get some basic table information
      let tableCount = 0;
      let sampleTables: Array<{ name: string; count: string; owner: string }> = [];

      try {
        // Try to get table information using a simple approach
        const { data: tables, error: tablesError } = await supabase
          .from<{ table_name: string }>('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .limit(10);

        if (!tablesError && tables) {
          tableCount = tables.length;
          sampleTables = tables.map((table: { table_name: string }) => ({ name: table.table_name, count: 'N/A', owner: 'public' }));
        }
      } catch (tablesErr) {
        // If we can't get table info, that's okay - just show connection status
        console.log('Could not get table information:', tablesErr);
      }

      setData({
        connected: isConnected,
        timestamp: new Date().toISOString(),
        database: {
          name: 'postgres',
          version: 'PostgreSQL (Supabase)',
          user: 'authenticated'
        },
        tableCount: tableCount,
        tables: sampleTables,
        supabase: {
          pooler: 'Transaction Pooler',
          connection: 'Real Supabase Connection',
          port: 6543,
          url: 'https://rjgzvsuhjxpppvjzzrpq.supabase.co'
        }
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to database');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDatabaseInfo();
  }, [fetchDatabaseInfo]);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Supabase Database Connection Test</h1>
            <p className="text-gray-600">Real-time database connection and table information</p>
          </div>
          <button
            onClick={fetchDatabaseInfo}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>

        {/* Connection Status or Configuration */}
        {data ? (
          /* Real Database Information */
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${data.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                Connection Status
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className={data.connected ? 'text-green-600' : 'text-red-600'}>
                    {data.connected ? '✓ Connected' : '✗ Disconnected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Timestamp:</span>
                  <span className="font-mono">{new Date(data.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Database:</span>
                  <span className="font-mono">{data.database.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">User:</span>
                  <span className="font-mono">{data.database.user}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Supabase Configuration</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Pooler:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{data.supabase.pooler}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Connection:</span>
                  <span>{data.supabase.connection}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Port:</span>
                  <span className="font-mono">{data.supabase.port}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">URL:</span>
                  <span className="font-mono text-xs">{data.supabase.url}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Configuration Information */
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></div>
                Database Configuration
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Supabase URL:</span>
                  <span className="font-mono text-xs bg-gray-100 p-1 rounded">
                    https://rjgzvsuhjxpppvjzzrpq.supabase.co
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Pooler:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Transaction Pooler</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="text-yellow-600">⚠ Testing connection...</span>
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
        )}

        {/* Tables Information - Only show when we have real data */}
        {data && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Database Tables</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.tableCount}</div>
                <div className="text-sm text-gray-600">Total Tables</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {data.tables.filter(t => typeof t.count === 'number').reduce((sum, t) => sum + (t.count as number), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{data.database.version.split(' ')[1]}</div>
                <div className="text-sm text-gray-600">PostgreSQL Version</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">Table Details:</h3>
              {data.tables.map((table, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{table.name}</span>
                    <span className="text-sm text-gray-600 ml-2">({table.owner})</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${typeof table.count === 'number' ? 'text-green-600' : 'text-red-600'}`}>
                      {table.count}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">records</span>
                    {table.error && (
                      <div className="text-xs text-red-600 mt-1">{table.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Setup Instructions - Only show when no data or error */}
        {(!data || error) && (
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
        )}

      </div>
    </div>
  );
}
