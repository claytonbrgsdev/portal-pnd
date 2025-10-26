'use client';

import React, { useMemo, useState } from 'react';
import { AdminCRUDTable } from './AdminCRUDTable';
import { adminCRUD } from '@/lib/supabase-admin';
import { Tables, TablesInsert, TablesUpdate } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText, HelpCircle } from 'lucide-react';
import { uploadQuestionImage } from '@/lib/supabase';

// Question Details Modal Component
function QuestionDetailsModal({
  question,
  open,
  onOpenChange,
}: {
  question: Tables<'questions'> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!question || !open) return null;

  const alternatives = [
    { letter: 'A', text: question.alt_a_text, justification: question.alt_a_justification },
    { letter: 'B', text: question.alt_b_text, justification: question.alt_b_justification },
    { letter: 'C', text: question.alt_c_text, justification: question.alt_c_justification },
    { letter: 'D', text: question.alt_d_text, justification: question.alt_d_justification },
  ].filter(alt => alt.text);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Detalhes da Questão</h2>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Image preview */}
            {question.image_url && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Imagem</Label>
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={question.image_url as string} alt="Imagem da questão" className="max-h-64 rounded border" />
                </div>
              </div>
            )}
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">ID</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                  <code className="text-sm">{question.id}</code>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Resposta Correta</Label>
                <div className="mt-1">
                  <Badge variant="default" className="text-lg px-3 py-1">
                    {question.correct_letter}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Componente</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm">
                  {question.component || 'Não definido'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Dificuldade</Label>
                <div className="mt-1">
                  <Badge variant={
                    question.difficulty === 'Fácil' ? 'secondary' :
                    question.difficulty === 'Médio' ? 'default' : 'destructive'
                  }>
                    {question.difficulty}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Ano</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm">
                  {question.year || 'Não definido'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Chave Natural</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm">
                  {question.natural_key || 'Não definida'}
                </div>
              </div>
            </div>

            {/* Prompt */}
            {question.prompt && (
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Enunciado da Questão
                </Label>
                <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-gray-800 leading-relaxed">{question.prompt}</p>
                </div>
              </div>
            )}

            {/* Alternatives */}
            {alternatives.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Alternativas
                </Label>
                <div className="mt-2 space-y-3">
                  {alternatives.map((alt) => {
                    const isCorrect = question.correct_letter === alt.letter;
                    return (
                      <div key={alt.letter} className={`p-4 rounded-md border-2 ${
                        isCorrect
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          <Badge
                            variant={isCorrect ? "default" : "outline"}
                            className={`text-sm px-2 py-1 font-bold ${
                              isCorrect ? 'bg-green-600 text-white' : ''
                            }`}
                          >
                            {alt.letter}
                          </Badge>
                          <div className="flex-1">
                            <p className="text-gray-800 mb-2">{alt.text}</p>
                            {alt.justification && (
                              <div className="text-sm text-gray-600 bg-white bg-opacity-50 p-2 rounded border-l-4 border-gray-300">
                                <strong>Justificativa:</strong> {alt.justification}
                              </div>
                            )}
                          </div>
                          {isCorrect && (
                            <Badge variant="default" className="bg-green-600">
                              Resposta Correta
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Supporting Texts */}
            {(question.text1_title || question.text1_content) && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Texto de Apoio 1</Label>
                <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  {question.text1_title && (
                    <h4 className="font-medium text-gray-800 mb-2">{question.text1_title}</h4>
                  )}
                  {question.text1_content && (
                    <p className="text-gray-700 leading-relaxed">{question.text1_content}</p>
                  )}
                  {question.text1_source && (
                    <p className="text-sm text-gray-500 mt-2">
                      <strong>Fonte:</strong> {question.text1_source}
                    </p>
                  )}
                </div>
              </div>
            )}

            {(question.text2_title || question.text2_content) && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Texto de Apoio 2</Label>
                <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  {question.text2_title && (
                    <h4 className="font-medium text-gray-800 mb-2">{question.text2_title}</h4>
                  )}
                  {question.text2_content && (
                    <p className="text-gray-700 leading-relaxed">{question.text2_content}</p>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t">
              <div className="text-xs text-gray-500">
                Criado em: {new Date(question.created_at || '').toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create Form Component
function CreateQuestionForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: TablesInsert<'questions'>) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = React.useState<TablesInsert<'questions'>>({
    id: '',
    correct_letter: 'A',
    prompt: '',
    alt_a_text: '',
    alt_b_text: '',
    alt_c_text: '',
    alt_d_text: '',
    alt_a_justification: '',
    alt_b_justification: '',
    alt_c_justification: '',
    alt_d_justification: '',
    component: '',
    difficulty: 'Médio',
    natural_key: '',
    text1_content: '',
    text1_source: '',
    text1_title: '',
    text2_content: '',
    text2_title: '',
    year: new Date().getFullYear(),
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const questionData: Record<string, unknown> = {
      ...formData,
      id: crypto.randomUUID(),
    };

    try {
      if (imageFile) {
        const url = await uploadQuestionImage(imageFile);
        questionData.image_url = url;
      }
    } catch (err) {
      console.error('Erro ao enviar imagem:', err);
    }

    await onSubmit(questionData as TablesInsert<'questions'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações Básicas</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="prompt">Enunciado da Questão</Label>
            <Textarea
              id="prompt"
              value={formData.prompt || ''}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              placeholder="Digite o enunciado da questão..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="correct_letter">Resposta Correta</Label>
            <Select value={formData.correct_letter} onValueChange={(value) => setFormData({ ...formData, correct_letter: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="component">Componente</Label>
            <Input
              id="component"
              value={formData.component || ''}
              onChange={(e) => setFormData({ ...formData, component: e.target.value })}
              placeholder="Ex: Matemática, Português..."
            />
          </div>

          <div>
            <Label htmlFor="difficulty">Dificuldade</Label>
            <Select value={formData.difficulty || 'Médio'} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fácil">Fácil</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Difícil">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="year">Ano</Label>
            <Input
              id="year"
              type="number"
              value={formData.year || new Date().getFullYear()}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <Label htmlFor="natural_key">Chave Natural</Label>
            <Input
              id="natural_key"
              value={formData.natural_key || ''}
              onChange={(e) => setFormData({ ...formData, natural_key: e.target.value })}
              placeholder="Identificador único da questão"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="image">Imagem (opcional)</Label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setImageFile(f);
                if (f) {
                  const reader = new FileReader();
                  reader.onload = () => setImagePreview(reader.result as string);
                  reader.readAsDataURL(f);
                } else {
                  setImagePreview(null);
                }
              }}
              className="block mt-1"
            />
            {imagePreview && (
              <div className="mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Prévia" className="max-h-40 rounded border" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alternatives */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Alternativas</h3>
        <div className="grid grid-cols-1 gap-4">
          {[
            { letter: 'A', text: 'alt_a_text', justification: 'alt_a_justification' },
            { letter: 'B', text: 'alt_b_text', justification: 'alt_b_justification' },
            { letter: 'C', text: 'alt_c_text', justification: 'alt_c_justification' },
            { letter: 'D', text: 'alt_d_text', justification: 'alt_d_justification' },
          ].map((alt) => (
            <div key={alt.letter} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={formData.correct_letter === alt.letter ? 'default' : 'secondary'}>
                  {alt.letter}
                </Badge>
                <span className="font-medium">Alternativa {alt.letter}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <Label htmlFor={alt.text}>Texto da Alternativa</Label>
                  <Input
                    id={alt.text}
                    value={formData[alt.text as keyof typeof formData] as string || ''}
                    onChange={(e) => setFormData({ ...formData, [alt.text]: e.target.value })}
                    placeholder={`Texto da alternativa ${alt.letter}...`}
                  />
                </div>
                <div>
                  <Label htmlFor={alt.justification}>Justificativa</Label>
                  <Textarea
                    id={alt.justification}
                    value={formData[alt.justification as keyof typeof formData] as string || ''}
                    onChange={(e) => setFormData({ ...formData, [alt.justification]: e.target.value })}
                    placeholder={`Justificativa da alternativa ${alt.letter}...`}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Textos de Apoio</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="text1_title">Título do Texto 1</Label>
            <Input
              id="text1_title"
              value={formData.text1_title || ''}
              onChange={(e) => setFormData({ ...formData, text1_title: e.target.value })}
              placeholder="Título do primeiro texto..."
            />
          </div>
          <div>
            <Label htmlFor="text1_source">Fonte do Texto 1</Label>
            <Input
              id="text1_source"
              value={formData.text1_source || ''}
              onChange={(e) => setFormData({ ...formData, text1_source: e.target.value })}
              placeholder="Fonte/autor do texto..."
            />
          </div>
          <div>
            <Label htmlFor="text1_content">Conteúdo do Texto 1</Label>
            <Textarea
              id="text1_content"
              value={formData.text1_content || ''}
              onChange={(e) => setFormData({ ...formData, text1_content: e.target.value })}
              placeholder="Conteúdo do primeiro texto..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="text2_title">Título do Texto 2</Label>
            <Input
              id="text2_title"
              value={formData.text2_title || ''}
              onChange={(e) => setFormData({ ...formData, text2_title: e.target.value })}
              placeholder="Título do segundo texto..."
            />
          </div>
          <div>
            <Label htmlFor="text2_content">Conteúdo do Texto 2</Label>
            <Textarea
              id="text2_content"
              value={formData.text2_content || ''}
              onChange={(e) => setFormData({ ...formData, text2_content: e.target.value })}
              placeholder="Conteúdo do segundo texto..."
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Criar Questão
        </Button>
      </div>
    </form>
  );
}

// Edit Form Component (simplified version - similar structure)
function EditQuestionForm({
  record,
  onSubmit,
  onCancel,
}: {
  record: Tables<'questions'>;
  onSubmit: (data: TablesUpdate<'questions'>) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = React.useState<TablesUpdate<'questions'>>({
    correct_letter: record.correct_letter,
    prompt: record.prompt,
    alt_a_text: record.alt_a_text,
    alt_b_text: record.alt_b_text,
    alt_c_text: record.alt_c_text,
    alt_d_text: record.alt_d_text,
    alt_a_justification: record.alt_a_justification,
    alt_b_justification: record.alt_b_justification,
    alt_c_justification: record.alt_c_justification,
    alt_d_justification: record.alt_d_justification,
    component: record.component,
    difficulty: record.difficulty,
    natural_key: record.natural_key,
    text1_content: record.text1_content,
    text1_source: record.text1_source,
    text1_title: record.text1_title,
    text2_content: record.text2_content,
    text2_title: record.text2_title,
    year: record.year,
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Record<string, unknown> = { ...formData };
    try {
      if (imageFile) {
        const url = await uploadQuestionImage(imageFile);
        updates.image_url = url;
      }
    } catch (err) {
      console.error('Erro ao enviar imagem:', err);
    }

    await onSubmit(updates as TablesUpdate<'questions'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prompt">Enunciado</Label>
          <Textarea
            id="prompt"
            value={formData.prompt || ''}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="correct_letter">Resposta Correta</Label>
          <Select value={formData.correct_letter || 'A'} onValueChange={(value) => setFormData({ ...formData, correct_letter: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Image */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Imagem</Label>
          <div className="mt-2">
            {record.image_url && !imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={record.image_url as string} alt="Imagem atual" className="max-h-40 rounded border mb-2" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setImageFile(f);
                if (f) {
                  const reader = new FileReader();
                  reader.onload = () => setImagePreview(reader.result as string);
                  reader.readAsDataURL(f);
                } else {
                  setImagePreview(null);
                }
              }}
              className="block"
            />
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Prévia" className="max-h-40 rounded border mt-2" />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Atualizar Questão
        </Button>
      </div>
    </form>
  );
}

// Column configuration for questions table
const questionColumns = [
  {
    key: 'image_url',
    label: 'Imagem',
    render: (value: string) => (
      value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="miniatura" className="h-12 w-12 object-cover rounded border" />
      ) : (
        <span className="text-gray-400 text-sm">—</span>
      )
    ),
  },
  {
    key: 'id',
    label: 'ID',
    render: (value: string) => (
      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
        {value?.substring(0, 8)}...
      </code>
    ),
  },
  {
    key: 'prompt',
    label: 'Enunciado',
    render: (value: string) => {
      if (!value) {
        return <span className="text-gray-400 text-sm italic">Sem enunciado</span>;
      }

      const preview = value.length > 80 ? `${value.substring(0, 80)}...` : value;

      return (
        <div className="space-y-1">
          <div className="text-sm leading-tight" title={value}>
            {preview}
          </div>
          {value.length > 80 && (
            <div className="text-xs text-gray-500">
              Clique em &ldquo;Ver Detalhes&rdquo; para ver completo
            </div>
          )}
        </div>
      );
    },
  },
  {
    key: 'alternatives',
    label: 'Alternativas',
    render: (value: any, record: any) => {
      const alternatives = [
        { letter: 'A', text: record.alt_a_text },
        { letter: 'B', text: record.alt_b_text },
        { letter: 'C', text: record.alt_c_text },
        { letter: 'D', text: record.alt_d_text },
      ].filter(alt => alt.text);

      if (alternatives.length === 0) {
        return <span className="text-gray-400 text-sm">Sem alternativas</span>;
      }

      const correctAnswer = alternatives.find(alt => alt.letter === record.correct_letter);

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs">
            <Badge variant="outline" className="text-xs px-1 py-0">
              {alternatives.length}
            </Badge>
            <span className="text-gray-600">alternativas</span>
          </div>
          {correctAnswer && (
            <div className="flex items-center gap-1 text-xs">
              <Badge variant="default" className="text-xs px-1 py-0">
                {correctAnswer.letter}
              </Badge>
              <span className="text-gray-600">correta</span>
            </div>
          )}
          <div className="text-xs text-gray-500">
            Clique em &ldquo;Ver Detalhes&rdquo; para ver todas
          </div>
        </div>
      );
    },
  },
  {
    key: 'correct_letter',
    label: 'Resposta',
    render: (value: string) => (
      <Badge variant="default">
        {value}
      </Badge>
    ),
  },
  {
    key: 'component',
    label: 'Componente',
  },
  {
    key: 'difficulty',
    label: 'Dificuldade',
    render: (value: string) => (
      <Badge variant={
        value === 'Fácil' ? 'secondary' :
        value === 'Médio' ? 'default' : 'destructive'
      }>
        {value}
      </Badge>
    ),
  },
  {
    key: 'year',
    label: 'Ano',
  },
  {
    key: 'created_at',
    label: 'Criado em',
    render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
  },
];

// Filter options for questions table
const questionFilters: FilterOption[] = [
  {
    key: 'component',
    label: 'Componente',
    type: 'select',
    options: [
      { value: 'Matemática', label: 'Matemática' },
      { value: 'Português', label: 'Português' },
      { value: 'História', label: 'História' },
      { value: 'Geografia', label: 'Geografia' },
      { value: 'Ciências', label: 'Ciências' },
      { value: 'Física', label: 'Física' },
      { value: 'Química', label: 'Química' },
      { value: 'Biologia', label: 'Biologia' },
      { value: 'Inglês', label: 'Inglês' },
      { value: 'Educação Física', label: 'Educação Física' },
      { value: 'Arte', label: 'Arte' },
      { value: 'Música', label: 'Música' },
    ],
  },
  {
    key: 'difficulty',
    label: 'Dificuldade',
    type: 'select',
    options: [
      { value: 'Fácil', label: 'Fácil' },
      { value: 'Médio', label: 'Médio' },
      { value: 'Difícil', label: 'Difícil' },
    ],
  },
  {
    key: 'correct_letter',
    label: 'Resposta Correta',
    type: 'select',
    options: [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' },
    ],
  },
  {
    key: 'year',
    label: 'Ano',
    type: 'number',
    placeholder: 'Digite o ano...',
  },
];

export function QuestionsManagement() {
  const crud = useMemo(() => adminCRUD.questions(), []);
  const searchFields = useMemo(() => ['prompt', 'component', 'natural_key'], []);
  const [viewingQuestion, setViewingQuestion] = useState<Tables<'questions'> | null>(null);

  return (
    <>
      <AdminCRUDTable
        tableName="questions"
        title="Gerenciamento de Questões"
        description="Gerencie as questões do banco de dados"
        columns={[
          ...questionColumns,
          {
            key: 'actions',
            label: 'Visualizar',
            render: (value: any, record: Tables<'questions'>) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingQuestion(record)}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                Ver Detalhes
              </Button>
            ),
          },
        ]}
        crud={crud}
        createForm={CreateQuestionForm}
        editForm={EditQuestionForm}
        searchFields={searchFields}
        filters={questionFilters}
        actions={{
          canCreate: true,
          canEdit: true,
          canDelete: true,
        }}
      />

      {/* Question Details Modal */}
      <QuestionDetailsModal
        question={viewingQuestion}
        open={!!viewingQuestion}
        onOpenChange={(open) => !open && setViewingQuestion(null)}
      />
    </>
  );
}
