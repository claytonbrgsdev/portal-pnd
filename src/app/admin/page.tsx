'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatabaseInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDatabaseInfo();
  }, []);

  const fetchDatabaseInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test basic Supabase connection
      const { error: testError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      // If we can query profiles, we're connected
      const isConnected = !testError;

      if (!isConnected && testError) {
        throw new Error(`Connection failed: ${testError.message}`);
      }

      // Get detailed table information
      let tableCount = 0;
      let detailedTables: Array<{ name: string; count: number; owner: string; error?: string }> = [];

      try {
        // Define known tables to check (instead of relying on information_schema.tables)
        const knownTables = [
          'profiles',
          'test_users',
          'test_posts',
          'test_categories'
        ];

        tableCount = knownTables.length;

        // Get row count for each known table
        for (const tableName of knownTables) {
          try {
            const { count, error: countError } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });

            detailedTables.push({
              name: tableName,
              count: countError ? 'N/A' : (count || 0),
              owner: 'public',
              error: countError?.message
            });
          } catch (countErr) {
            detailedTables.push({
              name: tableName,
              count: 'Error',
              owner: 'public',
              error: 'Could not count rows'
            });
          }
        }

        // Also try to get tables from information_schema as fallback
        try {
          const { data: schemaTables, error: schemaError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .limit(20);

          if (!schemaError && schemaTables) {
            // Add any additional tables found in schema
            for (const schemaTable of schemaTables) {
              const tableExists = detailedTables.some(t => t.name === schemaTable.table_name);
              if (!tableExists) {
                try {
                  const { count } = await supabase
                    .from(schemaTable.table_name)
                    .select('*', { count: 'exact', head: true });

                  detailedTables.push({
                    name: schemaTable.table_name,
                    count: count || 0,
                    owner: 'public'
                  });
                } catch {
                  detailedTables.push({
                    name: schemaTable.table_name,
                    count: 'N/A',
                    owner: 'public',
                    error: 'Could not access'
                  });
                }
              }
            }
          }
        } catch (schemaErr) {
          console.log('Could not access information_schema.tables:', schemaErr);
        }
      } catch (tablesErr) {
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
        tables: detailedTables,
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
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">Gerencie o sistema e monitore o banco de dados</p>
              </div>
              <button
                onClick={fetchDatabaseInfo}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Carregando...' : 'Atualizar Dados'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Erro de Conexão</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {data ? (
            <>
              {/* Connection Status */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${data.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    Status da Conexão
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className={data.connected ? 'text-green-600' : 'text-red-600'}>
                        {data.connected ? '✓ Conectado' : '✗ Desconectado'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Última verificação:</span>
                      <span className="font-mono">{new Date(data.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Banco:</span>
                      <span className="font-mono">{data.database.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Usuário:</span>
                      <span className="font-mono">{data.database.user}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Configuração Supabase</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Pooler:</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{data.supabase.pooler}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Conexão:</span>
                      <span>{data.supabase.connection}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Porta:</span>
                      <span className="font-mono">{data.supabase.port}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">URL:</span>
                      <span className="font-mono text-xs">{data.supabase.url}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tables Information */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Tabelas do Banco de Dados</h2>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{data.tableCount}</div>
                    <div className="text-sm text-gray-600">Total de Tabelas</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {data.tables.filter(t => typeof t.count === 'number').reduce((sum, t) => sum + (t.count as number), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total de Registros</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{data.database.version.split(' ')[1]}</div>
                    <div className="text-sm text-gray-600">PostgreSQL Version</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Detalhes das Tabelas:</h3>
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
                        <span className="text-sm text-gray-600 ml-1">registros</span>
                        {table.error && (
                          <div className="text-xs text-red-600 mt-1">{table.error}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Loading State */
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando informações do banco de dados...</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
