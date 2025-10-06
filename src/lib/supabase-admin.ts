'use client'

// Minimal client for Admin CRUD operations via internal Next.js API routes.

export interface GetAllOptions {
  filters?: Record<string, unknown>
  page?: number
  limit?: number
  orderBy?: string
  ascending?: boolean
}

export interface CrudResponse<T> {
  data?: T[]
  error?: { message: string; details?: string }
}

export interface MutationResponse {
  error?: { message: string; details?: string }
}

export interface SupabaseAdminCRUD<TTableName extends string> {
  getAll(options?: GetAllOptions): Promise<CrudResponse<Record<string, unknown>>>;
  create(row: Record<string, unknown>): Promise<MutationResponse>;
  update(id: string, updates: Record<string, unknown>): Promise<MutationResponse>;
  delete(id: string): Promise<MutationResponse>;
}

function createCrud<TTableName extends string>(tableName: TTableName): SupabaseAdminCRUD<TTableName> {
  const baseUrl = `/api/admin/database/data/${tableName}`

  return {
    async getAll(options?: GetAllOptions): Promise<CrudResponse<Record<string, unknown>>> {
      const page = options?.page ?? 1
      const limit = options?.limit ?? 50
      const filters = options?.filters ?? {}
      const orderBy = options?.orderBy
      const ascending = options?.ascending ?? false

      const url = new URL(baseUrl, window.location.origin)
      url.searchParams.set('page', String(page))
      url.searchParams.set('limit', String(limit))
      if (filters && Object.keys(filters).length > 0) {
        url.searchParams.set('filters', JSON.stringify(filters))
      }

      if (orderBy) {
        url.searchParams.set('orderBy', orderBy)
        url.searchParams.set('ascending', String(ascending))
      }

      const res = await fetch(url.toString(), { method: 'GET' })
      if (!res.ok) {
        try {
          const err = await res.json()
          return { error: { message: err.error || 'Failed to fetch data', details: err.details } }
        } catch {
          return { error: { message: 'Failed to fetch data' } }
        }
      }

      const json = await res.json()
      return { data: json.data as Record<string, unknown>[] }
    },

    async create(row: Record<string, unknown>): Promise<MutationResponse> {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: row })
      })

      if (!res.ok) {
        try {
          const err = await res.json()
          return { error: { message: err.error || 'Failed to create', details: err.details } }
        } catch {
          return { error: { message: 'Failed to create' } }
        }
      }
      return {}
    },

    async update(id: string, updates: Record<string, unknown>): Promise<MutationResponse> {
      // API expects single-column updates; apply sequentially
      const entries = Object.entries(updates)
      for (const [columnName, newValue] of entries) {
        const res = await fetch(baseUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rowId: id, columnName, newValue })
        })
        if (!res.ok) {
          try {
            const err = await res.json()
            return { error: { message: err.error || 'Failed to update', details: err.details } }
          } catch {
            return { error: { message: 'Failed to update' } }
          }
        }
      }
      return {}
    },

    async delete(id: string): Promise<MutationResponse> {
      const res = await fetch(baseUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowId: id })
      })

      if (!res.ok) {
        try {
          const err = await res.json()
          return { error: { message: err.error || 'Failed to delete', details: err.details } }
        } catch {
          return { error: { message: 'Failed to delete' } }
        }
      }
      return {}
    },
  }
}

export const adminCRUD = {
  questions: () => createCrud('questions'),
  question_metadata: () => createCrud('question_metadata'),
  profiles: () => createCrud('profiles'),
  admin_actions: () => createCrud('admin_actions'),
}


