'use client';

import React, { useMemo, useState } from 'react';
import { AdminCRUDTable } from './AdminCRUDTable';
import { adminCRUD } from '@/lib/supabase-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, User, Mail, Calendar } from 'lucide-react';
import { FilterOption } from './AdminFilters';

interface ColumnConfig {
  key: string;
  label: string;
  render?: (value: unknown, record: Record<string, unknown>) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

// Profile Details Modal Component
function ProfileDetailsModal({
  profile,
  open,
  onOpenChange,
}: {
  profile: Record<string, unknown> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!profile || !open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Detalhes do Perfil</h2>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                {String(profile.full_name)?.charAt(0).toUpperCase() || String(profile.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {String(profile.full_name) || 'Nome não definido'}
                </h3>
                <p className="text-gray-600">{String(profile.email)}</p>
                <Badge variant={String(profile.role) === 'admin' ? 'default' : 'secondary'} className="mt-1">
                  {String(profile.role) === 'admin' ? 'Administrador' : 'Usuário'}
                </Badge>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <code className="text-sm">{String(profile.email)}</code>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo
                </Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                  {String(profile.full_name) || 'Não definido'}
                </div>
              </div>


              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Função
                </Label>
                <div className="mt-1">
                  <Badge variant={String(profile.role) === 'admin' ? 'default' : 'secondary'}>
                    {String(profile.role) === 'admin' ? 'Administrador' : 'Usuário'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Criado em:</strong><br />
                  {profile.created_at ? new Date(String(profile.created_at)).toLocaleString('pt-BR') : '—'}
                </div>
                <div>
                  <strong>Última atualização:</strong><br />
                  {String(profile.updated_at) !== 'undefined' && String(profile.updated_at) !== ''
                    ? new Date(String(profile.updated_at)).toLocaleString('pt-BR')
                    : 'Nunca atualizado'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create Form Component
function CreateProfileForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = React.useState<Record<string, unknown>>({
    id: '',
    email: '',
    full_name: '',
    role: 'user',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generate UUID for new profile (Supabase will handle this, but we need it for the form)
    const profileData = {
      ...formData,
      id: crypto.randomUUID(), // This should be handled by Supabase, but we need it for the type
    };

    await onSubmit(profileData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="id">ID do Usuário</Label>
          <Input
            id="id"
            value={String(formData.id || '')}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            placeholder="ID do usuário do Supabase Auth"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={String(formData.email || '')}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@exemplo.com"
            required
          />
        </div>


        <div>
          <Label htmlFor="full_name">Nome Completo</Label>
          <Input
            id="full_name"
            value={String(formData.full_name) || ''}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="Nome completo"
          />
        </div>

        <div>
          <Label htmlFor="role">Função</Label>
          <Select value={String(formData.role || 'user')} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Usuário</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Criar Perfil
        </Button>
      </div>
    </form>
  );
}

// Edit Form Component
function EditProfileForm({
  record,
  onSubmit,
  onCancel,
}: {
  record: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = React.useState<Record<string, unknown>>({
    email: record.email || '',
    full_name: record.full_name || '',
    role: record.role || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={String(formData.email) || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>


        <div>
          <Label htmlFor="full_name">Nome Completo</Label>
          <Input
            id="full_name"
            value={String(formData.full_name) || ''}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="role">Função</Label>
          <Select value={String(formData.role || 'user')} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Usuário</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Atualizar Perfil
        </Button>
      </div>
    </form>
  );
}

// Column configuration for profiles table
const profileColumns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    render: (value: unknown) => (
      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
        {String(value)?.substring(0, 8)}...
      </code>
    ),
  },
  {
    key: 'user_info',
    label: 'Usuário',
    render: (value: unknown, record: Record<string, unknown>) => {
      const profileRecord = record as Record<string, unknown>;
      return (
        <div className="space-y-1">
          <div className="font-medium text-sm">{String(profileRecord?.full_name) || 'Nome não definido'}</div>
          <div className="text-xs text-gray-600 truncate max-w-32" title={String(profileRecord?.email)}>
            {String(profileRecord?.email)}
          </div>
        </div>
      );
    },
  },
  {
    key: 'role',
    label: 'Função',
    render: (value: unknown) => (
      <Badge variant={String(value) === 'admin' ? 'default' : 'secondary'}>
        {String(value) === 'admin' ? 'Administrador' : 'Usuário'}
      </Badge>
    ),
  },
  {
    key: 'created_at',
    label: 'Criado em',
    render: (value: unknown) => (
      <div className="text-xs text-gray-600">
        {value ? new Date(String(value)).toLocaleDateString('pt-BR') : '—'}
      </div>
    ),
  },
];

// Filter options for profiles table
const profileFilters: FilterOption[] = [
  {
    key: 'role',
    label: 'Função',
    type: 'select',
    options: [
      { value: 'admin', label: 'Administrador' },
      { value: 'user', label: 'Usuário' },
    ],
  },
];

export function ProfilesManagement() {
  const crud = useMemo(() => adminCRUD.profiles(), []);
  const searchFields = useMemo(() => ['email', 'full_name'], []);
  const [viewingProfile, setViewingProfile] = useState<Record<string, unknown> | null>(null);

  return (
    <>
      <AdminCRUDTable
        tableName="profiles"
        title="Gerenciamento de Perfis"
        description="Gerencie os perfis de usuários do sistema"
        columns={[
          ...profileColumns,
          {
            key: 'actions',
            label: 'Visualizar',
            render: (value: unknown, record: Record<string, unknown>) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingProfile(record)}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                Ver Detalhes
              </Button>
            ),
          },
        ]}
        crud={crud}
        createForm={CreateProfileForm}
        editForm={EditProfileForm}
        searchFields={searchFields}
        filters={profileFilters}
        actions={{
          canCreate: true,
          canEdit: true,
          canDelete: true,
        }}
      />

      {/* Profile Details Modal */}
      <ProfileDetailsModal
        profile={viewingProfile}
        open={!!viewingProfile}
        onOpenChange={(open) => !open && setViewingProfile(null)}
      />
    </>
  );
}
