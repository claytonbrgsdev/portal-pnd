'use client'

import { useState, useEffect } from 'react'

interface TableInfo {
  table_name: string
  table_schema: string
}

interface ColumnInfo {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
}

interface TableData {
  [key: string]: unknown
}

export default function DatabaseManager() {
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [tableColumns, setTableColumns] = useState<ColumnInfo[]>([])
  const [tableData, setTableData] = useState<TableData[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'tables' | 'structure' | 'data' | 'sql'>('tables')
  const [sqlQuery, setSqlQuery] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sqlResults, setSqlResults] = useState<any>(null)
  const [editingCell, setEditingCell] = useState<{rowIndex: number, columnName: string} | null>(null)
  const [editValue, setEditValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRows, setTotalRows] = useState(0)
  const [pageSize] = useState(50)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRowData, setNewRowData] = useState<Record<string, string>>({})

  // Fetch all tables
  const fetchTables = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/database/tables')
      const data = await response.json()
      setTables(data.tables || [])
    } catch (error) {
      console.error('Error fetching tables:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch table structure
  const fetchTableStructure = async (tableName: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/database/structure/${tableName}`)
      const data = await response.json()
      setTableColumns(data.columns || [])
      setSelectedTable(tableName)
    } catch (error) {
      console.error('Error fetching table structure:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch table data
  const fetchTableData = async (tableName: string, page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/database/data/${tableName}?page=${page}&limit=${pageSize}`)
      const data = await response.json()

      if (data.success) {
        setTableData(data.data || [])
        setTotalRows(data.pagination?.total || 0)
        setTotalPages(data.pagination?.totalPages || 1)
        setCurrentPage(page)
      } else {
        console.error('Error fetching table data:', data.error)
        setTableData([])
      }
    } catch (error) {
      console.error('Error fetching table data:', error)
      setTableData([])
    } finally {
      setLoading(false)
    }
  }

  // Add new table row
  const addTableRow = async (tableName: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/database/data/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: newRowData }),
      })

      const result = await response.json()

      if (response.ok) {
        setShowAddForm(false)
        setNewRowData({})
        // Refresh table data
        await fetchTableData(tableName, currentPage)
        alert('Row added successfully!')
      } else {
        alert(`Failed to add row: ${result.error}`)
      }
    } catch (error) {
      console.error('Error adding table row:', error)
      alert('Failed to add row')
    } finally {
      setLoading(false)
    }
  }

  // Execute custom SQL
  const executeSQL = async () => {
    if (!sqlQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/admin/database/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sqlQuery }),
      })
      const data = await response.json()
      setSqlResults(data)
    } catch (error) {
      console.error('Error executing SQL:', error)
      setSqlResults({ error: 'Failed to execute query' })
    } finally {
      setLoading(false)
    }
  }

  // Update table data
  const updateTableData = async (tableName: string, rowIndex: number, columnName: string, newValue: string) => {
    const row = tableData[rowIndex]
    if (!row) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/database/data/${tableName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rowId: row.id,
          columnName,
          newValue
        }),
      })

      if (response.ok) {
        // Refresh table data
        await fetchTableData(tableName)
        setEditingCell(null)
      } else {
        alert('Failed to update data')
      }
    } catch (error) {
      console.error('Error updating table data:', error)
      alert('Failed to update data')
    } finally {
      setLoading(false)
    }
  }

  // Delete table row
  const deleteTableRow = async (tableName: string, rowIndex: number) => {
    const row = tableData[rowIndex]
    if (!row || !row.id) return

    if (!confirm(`Are you sure you want to delete this row?`)) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/database/data/${tableName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rowId: row.id
        }),
      })

      if (response.ok) {
        // Refresh table data
        await fetchTableData(tableName)
      } else {
        alert('Failed to delete row')
      }
    } catch (error) {
      console.error('Error deleting table row:', error)
      alert('Failed to delete row')
    } finally {
      setLoading(false)
    }
  }

  // Start editing a cell
  const startEditing = (rowIndex: number, columnName: string, currentValue: string) => {
    setEditingCell({ rowIndex, columnName })
    setEditValue(currentValue)
  }

  // Save edited cell
  const saveEdit = async () => {
    if (!editingCell || !selectedTable) return

    await updateTableData(selectedTable, editingCell.rowIndex, editingCell.columnName, editValue)
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingCell(null)
    setEditValue('')
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const handleTableSelect = (tableName: string) => {
    fetchTableStructure(tableName)
    fetchTableData(tableName, 1) // Reset to first page
    setActiveTab('structure')
    setCurrentPage(1)
    setTotalPages(1)
    setTotalRows(0)
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tables')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tables'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tables
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            disabled={!selectedTable}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'structure'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } ${!selectedTable ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Structure
          </button>
          <button
            onClick={() => setActiveTab('data')}
            disabled={!selectedTable}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'data'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } ${!selectedTable ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Data
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sql'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            SQL Query
          </button>
        </nav>
      </div>

      {/* Tables Tab */}
      {activeTab === 'tables' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Database Tables</h3>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((table) => (
                <button
                  key={table.table_name}
                  onClick={() => handleTableSelect(table.table_name)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <h4 className="font-medium text-gray-900">{table.table_name}</h4>
                  <p className="text-sm text-gray-500">Schema: {table.table_schema}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Structure Tab */}
      {activeTab === 'structure' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Table Structure: {selectedTable}
          </h3>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Column Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nullable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Default
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableColumns.map((column) => (
                    <tr key={column.column_name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {column.column_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {column.data_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {column.is_nullable}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {column.column_default || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Data Tab */}
      {activeTab === 'data' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Table Data: {selectedTable}
            </h3>
            <button
              onClick={() => fetchTableData(selectedTable)}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                setShowAddForm(true)
                setNewRowData({})
              }}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Row
            </button>
          </div>

          {/* Add New Row Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 mb-3">Add New Row</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {tableColumns.map((column) => (
                  <div key={column.column_name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {column.column_name}
                    </label>
                    <input
                      type="text"
                      value={newRowData[column.column_name] || ''}
                      onChange={(e) => setNewRowData({
                        ...newRowData,
                        [column.column_name]: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter ${column.column_name}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => addTableRow(selectedTable)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Row'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewRowData({})
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    {tableColumns.map((column) => (
                      <th
                        key={column.column_name}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.column_name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteTableRow(selectedTable, rowIndex)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                      {tableColumns.map((column) => (
                        <td key={column.column_name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingCell?.rowIndex === rowIndex && editingCell?.columnName === column.column_name ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEdit()
                                  if (e.key === 'Escape') cancelEdit()
                                }}
                                autoFocus
                              />
                              <button
                                onClick={saveEdit}
                                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => startEditing(rowIndex, column.column_name, String(row[column.column_name] || ''))}
                              className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                            >
                              {String(row[column.column_name] || '')}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {activeTab === 'data' && tableData.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Showing page {currentPage} of {totalPages} ({totalRows} total rows)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchTableData(selectedTable, currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchTableData(selectedTable, currentPage + 1)}
                  disabled={currentPage >= totalPages || loading}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SQL Query Tab */}
      {activeTab === 'sql' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">SQL Query Executor</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="sql-query" className="block text-sm font-medium text-gray-700 mb-2">
                SQL Query
              </label>
              <textarea
                id="sql-query"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Enter your SQL query here..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={executeSQL}
              disabled={loading || !sqlQuery.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Executing...' : 'Execute Query'}
            </button>

            {sqlResults && (
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">Results</h4>
                <div className="overflow-x-auto">
                  <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-auto">
                    {JSON.stringify(sqlResults, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
