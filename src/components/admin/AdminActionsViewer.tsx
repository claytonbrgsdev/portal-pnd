'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { adminCRUD } from '@/lib/supabase-admin';
import { Tables } from '@/lib/database.types';
import { Trash2, Search, Calendar, User, Activity } from 'lucide-react';

type AdminAction = Tables<'admin_actions'>;

export function AdminActionsViewer() {
  const [data, setData] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [deletingRecord, setDeletingRecord] = useState<AdminAction | null>(null);

  // Memoize CRUD instance to avoid re-creating it every render (prevents refetch loops)
  const crud = useMemo(() => adminCRUD.admin_actions(), []);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filters: Record<string, any> = {};

      if (searchTerm) {
        filters.action = searchTerm;
      }

      const { data: result, error } = await crud.getAll({
        orderBy: 'created_at',
        ascending: false,
        limit: 100,
        filters,
      });

      if (error) {
        setError(error.message || 'Erro ao carregar ações administrativas');
      } else {
        setData(result || []);
      }
    } catch (err) {
      setError('Erro inesperado ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [crud, searchTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle delete
  const handleDelete = async () => {
    if (!deletingRecord) return;

    try {
      const { error } = await crud.delete(deletingRecord.id.toString());

      if (error) {
        setError(error.message || 'Erro ao excluir registro');
      } else {
        setDeletingRecord(null);
        await loadData();
      }
    } catch (err) {
      setError('Erro inesperado ao excluir registro');
    }
  };

  // Filter data by action type
  const filteredData = data.filter((record) => {
    if (actionFilter === 'all') return true;
    return record.action.includes(actionFilter);
  });

  // Get unique action types for filter
  const actionTypes = Array.from(new Set(data.map(record => record.action.split('_')[0])));

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></div>
          <span>Carregando...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Ações Administrativas
            </CardTitle>
            <CardDescription>
              Histórico de ações realizadas pelos administradores ({filteredData.length} registros)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as ações</SelectItem>
              {actionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma ação administrativa encontrada.
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredData.map((record) => (
              <div key={record.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {record.action.replace(/_/g, ' ')}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(record.created_at || '').toLocaleString('pt-BR')}
                      </div>
                    </div>

                    <div className="space-y-1 text-sm">
                      {record.admin_id && (
                        <div className="flex items-center text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          Admin: {record.admin_id.substring(0, 8)}...
                        </div>
                      )}

                      {record.target_user_id && (
                        <div className="text-muted-foreground">
                          Usuário alvo: {record.target_user_id.substring(0, 8)}...
                        </div>
                      )}

                      {record.payload && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                            Detalhes do payload
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                            {JSON.stringify(record.payload, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingRecord(record)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingRecord}
        onOpenChange={() => setDeletingRecord(null)}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este registro de ação administrativa? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
      />
    </Card>
  );
}
