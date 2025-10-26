'use client';

import React, { useMemo, useState } from 'react';
import { AdminCRUDTable } from './AdminCRUDTable';
import { adminCRUD } from '@/lib/supabase-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, BookOpen, Target, Lightbulb } from 'lucide-react';
import { FilterOption } from './AdminFilters';

interface ColumnConfig {
  key: string;
  label: string;
  render?: (value: unknown, record: Record<string, unknown>) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

// Question Metadata Details Modal Component
function QuestionMetadataDetailsModal({
  metadata,
  open,
  onOpenChange,
}: {
  metadata: Record<string, unknown> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!metadata || !open) return null;

  const hasCompetencyDesc = metadata.competency_desc && String(metadata.competency_desc) !== 'undefined' && String(metadata.competency_desc) !== '';
  const hasSkillDesc = metadata.skill_desc && String(metadata.skill_desc) !== 'undefined' && String(metadata.skill_desc) !== '';
  const hasExtraInfo = metadata.extra_info && String(metadata.extra_info) !== 'undefined' && String(metadata.extra_info) !== '';
  const hasKnowledgeObjects = metadata.knowledge_objects;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Detalhes dos Metadados</h2>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">ID da Questão</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                  <code className="text-sm">{String(metadata.question_id)}</code>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Código da Habilidade</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm">
                  {String(metadata.skill_code || '') ? (
                    <Badge variant="outline">{String(metadata.skill_code)}</Badge>
                  ) : (
                    <span className="text-gray-400">Não definido</span>
                  )}
                </div>
              </div>
            </div>

            {/* Competency Description */}
            {Boolean(hasCompetencyDesc) && (
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Descrição da Competência
                </Label>
                <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-gray-800 leading-relaxed">{String(metadata.competency_desc)}</p>
                </div>
              </div>
            )}

            {/* Skill Description */}
            {Boolean(hasSkillDesc) && (
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Descrição da Habilidade
                </Label>
                <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-gray-800 leading-relaxed">{String(metadata.skill_desc)}</p>
                </div>
              </div>
            )}

            {/* Knowledge Objects */}
            {Boolean(hasKnowledgeObjects) && (
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Objetos de Conhecimento
                </Label>
                <div className="mt-2 p-4 bg-purple-50 border border-purple-200 rounded-md">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                    {JSON.stringify(metadata.knowledge_objects, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Extra Information */}
            {Boolean(hasExtraInfo) && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Informações Extras</Label>
                <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-gray-800 leading-relaxed">{String(metadata.extra_info)}</p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t">
              <div className="text-xs text-gray-500">
                Metadados criados para análise e categorização da questão
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create Form Component
function CreateQuestionMetadataForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = React.useState<Record<string, unknown>>({
    question_id: '',
    competency_desc: '',
    extra_info: '',
    knowledge_objects: null,
    skill_code: '',
    skill_desc: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="question_id">ID da Questão</Label>
          <Input
            id="question_id"
            value={String(formData.question_id || '')}
            onChange={(e) => setFormData({ ...formData, question_id: e.target.value })}
            placeholder="ID da questão relacionada"
            required
          />
        </div>

        <div>
          <Label htmlFor="competency_desc">Descrição da Competência</Label>
          <Textarea
            id="competency_desc"
            value={String(formData.competency_desc) || ''}
            onChange={(e) => setFormData({ ...formData, competency_desc: e.target.value })}
            placeholder="Descrição da competência avaliada..."
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="skill_code">Código da Habilidade</Label>
          <Input
            id="skill_code"
            value={String(formData.skill_code) || ''}
            onChange={(e) => setFormData({ ...formData, skill_code: e.target.value })}
            placeholder="Código da habilidade (ex: H1, H2...)"
          />
        </div>

        <div>
          <Label htmlFor="skill_desc">Descrição da Habilidade</Label>
          <Textarea
            id="skill_desc"
            value={String(formData.skill_desc) || ''}
            onChange={(e) => setFormData({ ...formData, skill_desc: e.target.value })}
            placeholder="Descrição detalhada da habilidade..."
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="extra_info">Informações Extras</Label>
          <Textarea
            id="extra_info"
            value={String(formData.extra_info) || ''}
            onChange={(e) => setFormData({ ...formData, extra_info: e.target.value })}
            placeholder="Informações adicionais..."
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Criar Metadados
        </Button>
      </div>
    </form>
  );
}

// Edit Form Component
function EditQuestionMetadataForm({
  record,
  onSubmit,
  onCancel,
}: {
  record: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = React.useState<Record<string, unknown>>({
    competency_desc: String(record.competency_desc || ''),
    extra_info: String(record.extra_info || ''),
    knowledge_objects: record.knowledge_objects,
    skill_code: String(record.skill_code || ''),
    skill_desc: String(record.skill_desc || ''),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="question_id">ID da Questão</Label>
          <Input
            id="question_id"
            value={String(record.question_id || '')}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">Não pode ser alterado após criação</p>
        </div>

        <div>
          <Label htmlFor="competency_desc">Descrição da Competência</Label>
          <Textarea
            id="competency_desc"
            value={String(formData.competency_desc) || ''}
            onChange={(e) => setFormData({ ...formData, competency_desc: e.target.value })}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="skill_code">Código da Habilidade</Label>
          <Input
            id="skill_code"
            value={String(formData.skill_code) || ''}
            onChange={(e) => setFormData({ ...formData, skill_code: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="skill_desc">Descrição da Habilidade</Label>
          <Textarea
            id="skill_desc"
            value={String(formData.skill_desc) || ''}
            onChange={(e) => setFormData({ ...formData, skill_desc: e.target.value })}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="extra_info">Informações Extras</Label>
          <Textarea
            id="extra_info"
            value={String(formData.extra_info) || ''}
            onChange={(e) => setFormData({ ...formData, extra_info: e.target.value })}
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Atualizar Metadados
        </Button>
      </div>
    </form>
  );
}

// Column configuration for question_metadata table
const questionMetadataColumns: ColumnConfig[] = [
  {
    key: 'question_id',
    label: 'ID da Questão',
    render: (value: unknown) => (
      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
        {String(value)?.substring(0, 8)}...
      </code>
    ),
  },
  {
    key: 'competency_desc',
    label: 'Competência',
    render: (value: unknown) => {
      const stringValue = String(value || '');
      if (!stringValue) {
        return <span className="text-gray-400 text-sm">Não definida</span>;
      }

      const preview = stringValue.length > 60 ? `${stringValue.substring(0, 60)}...` : stringValue;

      return (
        <div className="space-y-1">
          <div className="text-sm leading-tight" title={stringValue}>
            {preview}
          </div>
          {stringValue.length > 60 && (
            <div className="text-xs text-gray-500">
              Clique em &ldquo;Ver Detalhes&rdquo; para ver completo
            </div>
          )}
        </div>
      );
    },
  },
  {
    key: 'skill_code',
    label: 'Código Habilidade',
    render: (value: unknown) => (
      <div className="text-sm">
        {String(value) ? (
          <Badge variant="outline">{String(value)}</Badge>
        ) : (
          <span className="text-gray-400 text-sm">N/A</span>
        )}
      </div>
    ),
  },
  {
    key: 'skill_desc',
    label: 'Habilidade',
    render: (value: unknown) => {
      const stringValue = String(value || '');
      if (!stringValue) {
        return <span className="text-gray-400 text-sm">Não definida</span>;
      }

      const preview = stringValue.length > 60 ? `${stringValue.substring(0, 60)}...` : stringValue;

      return (
        <div className="space-y-1">
          <div className="text-sm leading-tight" title={stringValue}>
            {preview}
          </div>
          {stringValue.length > 60 && (
            <div className="text-xs text-gray-500">
              Clique em &ldquo;Ver Detalhes&rdquo; para ver completo
            </div>
          )}
        </div>
      );
    },
  },
];

// Filter options for question_metadata table
const metadataFilters: FilterOption[] = [
  {
    key: 'skill_code',
    label: 'Código da Habilidade',
    type: 'text',
    placeholder: 'Digite o código da habilidade...',
  },
  {
    key: 'competency_desc',
    label: 'Competência',
    type: 'text',
    placeholder: 'Digite a descrição da competência...',
  },
  {
    key: 'skill_desc',
    label: 'Descrição da Habilidade',
    type: 'text',
    placeholder: 'Digite a descrição da habilidade...',
  },
];

export function QuestionMetadataManagement() {
  const crud = useMemo(() => adminCRUD.question_metadata(), []);
  const searchFields = useMemo(() => ['question_id', 'competency_desc', 'skill_code'], []);
  const [viewingMetadata, setViewingMetadata] = useState<Record<string, unknown> | null>(null);

  return (
    <>
      <AdminCRUDTable
        tableName="question_metadata"
        title="Metadados das Questões"
        description="Gerencie os metadados e competências das questões"
        columns={[
          ...questionMetadataColumns,
          {
            key: 'actions',
            label: 'Visualizar',
            render: (value: unknown, record: Record<string, unknown>) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingMetadata(record)}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                Ver Detalhes
              </Button>
            ),
          },
        ]}
        crud={crud}
        createForm={CreateQuestionMetadataForm}
        editForm={EditQuestionMetadataForm}
        searchFields={searchFields}
        filters={metadataFilters}
        actions={{
          canCreate: true,
          canEdit: true,
          canDelete: true,
        }}
      />

      {/* Metadata Details Modal */}
      <QuestionMetadataDetailsModal
        metadata={viewingMetadata}
        open={!!viewingMetadata}
        onOpenChange={(open) => !open && setViewingMetadata(null)}
      />
    </>
  );
}
