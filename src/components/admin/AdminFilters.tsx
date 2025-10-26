'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Filter, X, RotateCcw } from 'lucide-react'

export interface FilterOption {
  key: string
  label: string
  type: 'text' | 'select' | 'number' | 'date'
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface AdminFiltersProps {
  filters: FilterOption[]
  onFiltersChange: (filters: Record<string, unknown>) => void
  onReset: () => void
}

export function AdminFilters({ filters, onFiltersChange, onReset }: AdminFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({})
  const [showFilters, setShowFilters] = useState(false)

  // Notify parent component only on explicit user actions to avoid mount loops

  const handleFilterChange = (key: string, value: unknown) => {
    const newFilters = { ...activeFilters }

    if (value === '' || value === null || value === undefined) {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }

    setActiveFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleReset = () => {
    setActiveFilters({})
    onReset()
    onFiltersChange({})
  }

  const activeFiltersCount = Object.keys(activeFilters).length

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </div>
      </CardHeader>

      {showFilters && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <Label className="text-sm font-medium">{filter.label}</Label>

                {filter.type === 'text' && (
                  <Input
                    placeholder={filter.placeholder || `Digite ${filter.label.toLowerCase()}...`}
                    value={String(activeFilters[filter.key] || '')}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  />
                )}

                {filter.type === 'select' && filter.options && (
                  <Select
                    value={String(activeFilters[filter.key] || 'all')}
                    onValueChange={(value) => handleFilterChange(filter.key, value === 'all' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Selecione ${filter.label.toLowerCase()}...`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {filter.type === 'number' && (
                  <Input
                    type="number"
                    placeholder={filter.placeholder || `Digite ${filter.label.toLowerCase()}...`}
                    value={String(activeFilters[filter.key] || '')}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value ? Number(e.target.value) : '')}
                  />
                )}

                {filter.type === 'date' && (
                  <Input
                    type="date"
                    value={String(activeFilters[filter.key] || '')}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Filtros ativos:</span>
                {Object.entries(activeFilters).map(([key, value]) => {
                  const filter = filters.find(f => f.key === key)
                  return (
                    <Badge key={key} variant="outline" className="flex items-center gap-1">
                      {filter?.label}: {String(value)}
                      <button
                        onClick={() => handleFilterChange(key, '')}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
