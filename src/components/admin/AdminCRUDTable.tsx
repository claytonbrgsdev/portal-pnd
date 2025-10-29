'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SupabaseAdminCRUD } from '@/lib/supabase-admin';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AdminFilters, FilterOption } from './AdminFilters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ColumnConfig {
  key: string;
  label: string;
  render?: (value: unknown, record: Record<string, unknown>) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

interface AdminCRUDTableProps {
  tableName: string;
  title: string;
  description?: string;
  columns: ColumnConfig[];
  crud: SupabaseAdminCRUD;
  createForm?: React.ComponentType<{
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    onCancel: () => void;
    initialData?: Partial<Record<string, unknown>>;
  }>;
  editForm?: React.ComponentType<{
    record: Record<string, unknown>;
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    onCancel: () => void;
  }>;
  searchFields?: string[];
  filters?: FilterOption[];
  actions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
  };
  disableToolbar?: boolean;
  externalFilters?: Record<string, unknown>;
  externalSearch?: string;
  createLabel?: string;
  fixedLayout?: boolean;
  columnClasses?: Record<string, string>; // per column key classes applied to th/td
}

export function AdminCRUDTable({
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
  disableToolbar = false,
  externalFilters,
  externalSearch,
  createLabel,
  fixedLayout = false,
  columnClasses = {},
}: AdminCRUDTableProps) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, unknown> | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<Record<string, unknown> | null>(null);
  const [operationLoading, setOperationLoading] = useState<string | null>(null);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Combine search filters with active filters
      const allFilters: Record<string, unknown> = externalFilters ? { ...externalFilters } : { ...activeFilters };

      // Add text search filters if search term exists
      const searchValue = (externalSearch ?? debouncedSearchTerm)?.trim();
      if (searchValue && searchFields.length > 0) {
        searchFields.forEach(field => {
          allFilters[field] = searchValue;
        });
      }

      const { data: result, error } = await crud.getAll({
        filters: Object.keys(allFilters).length > 0 ? allFilters : undefined,
      });

      if (error) {
        console.error('Detailed error:', error);
        setError(error.message || error.details || 'Erro ao carregar dados');
      } else {
        setData((result as unknown as Record<string, unknown>[]) || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Erro inesperado ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [crud, activeFilters, debouncedSearchTerm, searchFields, externalFilters, externalSearch]);

  useEffect(() => {
    (async () => {
      await loadData();
      setInitialLoaded(true);
    })();
  }, [loadData]);

  // Debounce search typing to avoid spam requests (only for internal search)
  useEffect(() => {
    if (externalSearch !== undefined) return;
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm.trim()), 500);
    return () => clearTimeout(t);
  }, [searchTerm, externalSearch]);

  // Handle create
  const handleCreate = async (formData: Record<string, unknown>) => {
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
      console.error('Error creating record:', err);
      setError('Erro inesperado ao criar registro');
    } finally {
      setOperationLoading(null);
    }
  };

  // Handle edit
  const handleEdit = async (formData: Record<string, unknown>) => {
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
      console.error('Error updating record:', err);
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
      console.error('Error deleting record:', err);
      setError('Erro inesperado ao excluir registro');
    } finally {
      setOperationLoading(null);
    }
  };

  // Data is already filtered by backend, no need for client-side filtering

  if (!initialLoaded && loading) {
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
      {/* Toolbar superior: busca + filtros rápidos + criar */}
      {!disableToolbar && (
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          {searchFields.length > 0 && (
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar questões..."
                value={externalSearch !== undefined ? externalSearch : searchTerm}
                onChange={(e) => externalSearch !== undefined ? undefined : setSearchTerm(e.target.value)}
                className="pl-8"
              />
              {loading && (
                <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          )}

          {filters.slice(0, 3).map((f) => (
            <div key={`quick-${f.key}`} className="w-44">
              {f.type === 'select' && f.options && (
                <Select
                  value={String(activeFilters[f.key] || 'all')}
                  onValueChange={(value) => {
                    const v = value === 'all' ? '' : value
                    const next = { ...activeFilters }
                    if (v === '') delete next[f.key]
                    else next[f.key] = v
                    setActiveFilters(next)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={f.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{f.label === 'Ano' ? 'Todos os anos' : 'Todos'}</SelectItem>
                    {f.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {f.type === 'number' && (
                <Input
                  type="number"
                  placeholder={f.placeholder || f.label}
                  value={String(activeFilters[f.key] ?? '')}
                  onChange={(e) => {
                    const v = e.target.value
                    const next = { ...activeFilters }
                    if (!v) delete next[f.key]
                    else next[f.key] = Number(v)
                    setActiveFilters(next)
                  }}
                />
              )}
              {f.type === 'text' && (
                <Input
                  placeholder={f.placeholder || f.label}
                  value={String(activeFilters[f.key] ?? '')}
                  onChange={(e) => {
                    const v = e.target.value
                    const next = { ...activeFilters }
                    if (!v) delete next[f.key]
                    else next[f.key] = v
                    setActiveFilters(next)
                  }}
                />
              )}
            </div>
          ))}

          {filters.length > 3 && (
            <Button variant="outline" onClick={() => setShowAdvancedFilters((s) => !s)}>
              Mais Filtros
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 hidden md:block">
            {data.length} registros encontrados
          </div>
          {actions.canCreate && CreateForm && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {createLabel || 'Novo Registro'}
            </Button>
          )}
        </div>
      </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                {data.length} registros encontrados
              </div>
              {actions.canCreate && CreateForm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {createLabel || 'Novo Registro'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {showAdvancedFilters && filters.length > 0 && (
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
            <table className={`w-full ${fixedLayout ? 'table-fixed' : ''}`}>
              <thead>
                <tr className="border-b">
                  {columns.map((column) => (
                    <th key={column.key} className={`text-left p-3 font-medium align-top text-sm ${columnClasses[column.key] || ''}`}>
                      {column.label}
                    </th>
                  ))}
                  <th className={`text-left p-3 font-medium align-top text-sm ${columnClasses['__actions'] || ''}`}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.map((record, index) => (
                  <tr
                    key={`${(record as Record<string, unknown>).id ?? (record as Record<string, unknown>).uuid ?? (record as Record<string, unknown>).key ?? (record as Record<string, unknown>).slug ?? `${String(tableName)}-${index}`}`}
                    className="border-b hover:bg-muted/50"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className={`p-3 text-left align-top whitespace-normal break-normal min-w-0 text-sm ${columnClasses[column.key] || ''}`}>
                        {column.render
                          ? column.render((record as Record<string, unknown>)[column.key], record)
                          : String((record as Record<string, unknown>)[column.key] || '-')
                        }
                      </td>
                    ))}
                    <td className={`p-3 text-left align-top ${columnClasses['__actions'] || ''}`}>
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
