'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

type Filters = {
  search?: string
  component?: string
  difficulty?: string
  year?: string
}

export function FiltersBar({
  value,
  onChange,
  components = [],
  difficulties = [],
  years = [],
}: {
  value: Filters
  onChange: (next: Filters) => void
  components?: string[]
  difficulties?: string[]
  years?: number[]
}) {
  const [local, setLocal] = useState<Filters>(value)
  const [mounted, setMounted] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocal(value)
    if (!mounted) setMounted(true)
  }, [value])

  // Debounce: apply search after user stops typing
  useEffect(() => {
    if (!mounted) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      // Only trigger if search actually differs from external value
      if ((local.search || '') !== (value.search || '')) {
        onChange({ ...local })
      }
    }, 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local.search])

  const ALL = '__all__'

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar no enunciado</label>
        <Input
          placeholder="Digite parte do enunciado..."
          value={local.search || ''}
          onChange={(e) => setLocal({ ...local, search: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onChange(local)
          }}
        />
      </div>

      <div className="w-full md:w-52">
        <label className="block text-sm font-medium text-gray-700 mb-1">Componente</label>
        <Select
          value={local.component ?? ALL}
          onValueChange={(v) => {
            const next = { ...local, component: v === ALL ? undefined : v }
            setLocal(next)
            onChange(next)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {components.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-40">
        <label className="block text-sm font-medium text-gray-700 mb-1">Dificuldade</label>
        <Select
          value={local.difficulty ?? ALL}
          onValueChange={(v) => {
            const next = { ...local, difficulty: v === ALL ? undefined : v }
            setLocal(next)
            onChange(next)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas</SelectItem>
            {difficulties.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-32">
        <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
        <Select
          value={local.year ?? ALL}
          onValueChange={(v) => {
            const next = { ...local, year: v === ALL ? undefined : v }
            setLocal(next)
            onChange(next)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            const cleared: Filters = { search: '', component: undefined, difficulty: undefined, year: undefined }
            setLocal(cleared)
            onChange(cleared)
          }}
        >
          Limpar
        </Button>
      </div>
    </div>
  )
}
