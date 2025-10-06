'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Tables, TablesInsert, TablesUpdate } from '@/lib/database.types';
import { SupabaseAdminCRUD } from '@/lib/supabase-admin';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AdminFilters, FilterOption } from './AdminFilters';

interface ColumnConfig {
  key: string;
  label: string;
  render?: (value: any, record: any) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

interface AdminCRUDTableProps<T extends keyof Tables> {
  tableName: T;
  title: string;
  description?: string;
  columns: ColumnConfig[];
  crud: SupabaseAdminCRUD<T>;
  createForm?: React.ComponentType<{
    onSubmit: (data: TablesInsert[T]) => Promise<void>;
    onCancel: () => void;
    initialData?: Partial<TablesInsert[T]>;
  }>;
  editForm?: React.ComponentType<{
    record: Tables[T];
    onSubmit: (data: TablesUpdate[T]) => Promise<void>;
    onCancel: () => void;
  }>;
  searchFields?: string[];
  filters?: FilterOption[];
  actions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
  };
}

export function AdminCRUDTable<T extends keyof Tables>({
  tableName,
  title,
  description,
  columns,
  crud,
  createForm: CreateForm,
  editForm: EditForm,
  searchFields = [],
  filters = [],
  actions = { canCreate: true, canEdit: true, canDelete: true },
}: AdminCRUDTableProps<T>) {
  const [data, setData] = useState<Tables[T][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Tables[T] | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<Tables[T] | null>(null);
  const [operationLoading, setOperationLoading] = useState<string | null>(null);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Combine search filters with active filters
      const allFilters: Record<string, any> = { ...activeFilters };

      // Add text search filters if search term exists
      if (searchTerm && searchFields.length > 0) {
        searchFields.forEach(field => {
          allFilters[field] = searchTerm;
        });
      }

      const { data: result, error } = await crud.getAll({
        filters: Object.keys(allFilters).length > 0 ? allFilters : undefined,
      });

      if (error) {
        console.error('Detailed error:', error);
        setError(error.message || error.details || 'Erro ao carregar dados');
      } else {
        setData(result || []);
      }
    } catch (err) {
      setError('Erro inesperado ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [crud, activeFilters, searchTerm, searchFields]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle create
  const handleCreate = async (formData: TablesInsert[T]) => {
    setOperationLoading('create');

    try {
      const { error } = await crud.create(formData);

      if (error) {
        setError(error.message || 'Erro ao criar registro');
      } else {
        setShowCreateForm(false);
        await loadData();
      }
    } catch (err) {
      setError('Erro inesperado ao criar registro');
    } finally {
      setOperationLoading(null);
    }
  };

  // Handle edit
  const handleEdit = async (formData: TablesUpdate[T]) => {
    if (!editingRecord) return;

    setOperationLoading('edit');

    try {
      const { error } = await crud.update(editingRecord.id as string, formData);

      if (error) {
        setError(error.message || 'Erro ao atualizar registro');
      } else {
        setEditingRecord(null);
        await loadData();
      }
    } catch (err) {
      setError('Erro inesperado ao atualizar registro');
    } finally {
      setOperationLoading(null);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingRecord) return;

    setOperationLoading('delete');

    try {
      const { error } = await crud.delete(deletingRecord.id as string);

      if (error) {
        setError(error.message || 'Erro ao excluir registro');
      } else {
        setDeletingRecord(null);
        await loadData();
      }
    } catch (err) {
      setError('Erro inesperado ao excluir registro');
    } finally {
      setOperationLoading(null);
    }
  };

  // Data is already filtered by backend, no need for client-side filtering

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Carregando...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              {searchFields.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              )}

              {/* Create button */}
              {actions.canCreate && CreateForm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Filters */}
        {filters.length > 0 && (
          <CardContent className="pt-0">
            <AdminFilters
              filters={filters}
              onFiltersChange={setActiveFilters}
              onReset={() => setActiveFilters({})}
            />
          </CardContent>
        )}

      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
            <div className="font-medium">Erro ao carregar dados</div>
            <div className="text-sm mt-1">{error}</div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs opacity-75 hover:opacity-100">
                  Detalhes técnicos
                </summary>
                <pre className="text-xs mt-2 bg-red-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum registro encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {columns.map((column) => (
                    <th key={column.key} className="text-left p-4 font-medium">
                      {column.label}
                    </th>
                  ))}
                  <th className="text-right p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.map((record, index) => (
                  <tr
                    key={`${(record as any).id ?? (record as any).uuid ?? (record as any).key ?? (record as any).slug ?? `${String(tableName)}-${index}`}`}
                    className="border-b hover:bg-muted/50"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="p-4">
                        {column.render
                          ? column.render((record as any)[column.key], record)
                          : (record as any)[column.key] || '-'
                        }
                      </td>
                    ))}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {actions.canEdit && EditForm && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingRecord(record)}
                            disabled={operationLoading !== null}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}

                        {actions.canDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingRecord(record)}
                            disabled={operationLoading !== null}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Create Form Modal */}
      {showCreateForm && CreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Criar Novo Registro</h2>
              <CreateForm
                onSubmit={handleCreate}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingRecord && EditForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Editar Registro</h2>
              <EditForm
                record={editingRecord}
                onSubmit={handleEdit}
                onCancel={() => setEditingRecord(null)}
              />
            </div>
          </div>
        </div>
      )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={!!deletingRecord}
          onOpenChange={() => setDeletingRecord(null)}
          title="Confirmar Exclusão"
          description={`Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          loading={operationLoading === 'delete'}
        />
      </Card>
    </>
  );
}
