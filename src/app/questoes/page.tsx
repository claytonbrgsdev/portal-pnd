'use client'

import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { FiltersBar } from './components/FiltersBar'
import { QuestionCard, PublicQuestion } from './components/QuestionCard'

type Filters = {
  search?: string
  component?: string
  difficulty?: string
  year?: string
}
type ViewMode = 'cards' | 'list'

export default function PublicQuestionsPage() {
  const supabase = useMemo(() => createClient(), [])
  const searchParams = useSearchParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<PublicQuestion[]>([])
  const [page, setPage] = useState<number>(Number(searchParams.get('page') || 1))
  const [total, setTotal] = useState<number>(0)
  const [components, setComponents] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])
  const [difficulties, setDifficulties] = useState<string[]>([])
  const [view, setView] = useState<ViewMode>((searchParams.get('view') as ViewMode) || 'cards')

  // Visuals for component placeholders (consistent abbr + pastel color)
  const componentVisuals = useMemo(() => {
    if (!items || items.length === 0) return {}
    const names = Array.from(new Set(items.map(i => (i.component || '').trim()).filter(Boolean))) as string[]
    const used = new Set<string>()

    const toCandidates = (name: string): string[] => {
      const words = name.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean)
      const initials = words.map(w => w[0]!.toUpperCase())
      const cands: string[] = []
      if (initials.length >= 2) cands.push((initials[0] + initials[1]))
      if (words[0]?.length >= 2) cands.push(words[0].slice(0, 2).toUpperCase())
      if (initials.length >= 3) cands.push((initials[0] + initials[1] + initials[2]))
      if (initials.length >= 2 && words[words.length - 1]) cands.push((initials[0] + words[words.length - 1][0]!.toUpperCase()))
      if (words[0]?.length >= 3) cands.push(words[0].slice(0, 3).toUpperCase())
      return Array.from(new Set(cands))
    }

    const hash = (s: string) => {
      let h = 0
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
      return h >>> 0
    }
    const pastel = (s: string) => {
      const h = hash(s) % 360
      return { bg: `hsl(${h} 70% 88%)`, fg: `hsl(${h} 25% 30%)` }
    }

    const map: Record<string, { abbr: string; bg: string; fg: string }> = {}
    for (const name of names) {
      const cands = toCandidates(name)
      const pick = (cands.find(c => !used.has(c)) || cands[0] || name.slice(0, 2).toUpperCase())
      used.add(pick)
      map[name] = { abbr: pick, ...pastel(name) }
    }
    return map
  }, [items])

  const filters: Filters = {
    search: searchParams.get('q') || undefined,
    component: searchParams.get('component') || undefined,
    difficulty: searchParams.get('difficulty') || undefined,
    year: searchParams.get('year') || undefined,
  }

  const pageSize = 20

  const applyQuery = (next: Partial<Filters & { page: number; view: ViewMode }>) => {
    const params = new URLSearchParams(searchParams.toString())

    if ('page' in next && next.page != null) {
      params.set('page', String(next.page))
    }

    if ('search' in next) {
      const v = next.search ?? ''
      v && v.trim().length > 0 ? params.set('q', v) : params.delete('q')
    }
    if ('component' in next) {
      const v = next.component
      v ? params.set('component', v) : params.delete('component')
    }
    if ('difficulty' in next) {
      const v = next.difficulty
      v ? params.set('difficulty', v) : params.delete('difficulty')
    }
    if ('year' in next) {
      const v = next.year
      v ? params.set('year', v) : params.delete('year')
    }
    if ('view' in next && next.view) {
      params.set('view', next.view)
      setView(next.view)
    }

    router.replace(`/questoes?${params.toString()}`)
    if ('page' in next && next.page) setPage(next.page)
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('v_questions_public')
          .select('*', { count: 'exact' })
          .range((page - 1) * pageSize, page * pageSize - 1)

        if (filters.search) {
          query = query.ilike('prompt', `%${filters.search}%`)
        }
        if (filters.component) {
          query = query.eq('component', filters.component)
        }
        if (filters.difficulty) {
          query = query.eq('difficulty', filters.difficulty)
        }
        if (filters.year) {
          const y = Number(filters.year)
          if (!Number.isNaN(y)) query = query.eq('year', y)
        }

        // Add safety timeout to avoid infinite spinner if remote hangs
        const fetchPromise = query as unknown as Promise<{ data: unknown[]; count: number | null; error: any }>
        const timeoutPromise = new Promise<{ data: unknown[]; count: number | null; error: any }>((resolve) => {
          setTimeout(() => resolve({ data: [], count: 0, error: null }), 12000)
        })
        const { data, count, error } = await Promise.race([fetchPromise, timeoutPromise])
        if (error) throw error

        let rows = (data as unknown as (PublicQuestion & { image_url?: string | null })[]) || []
        setTotal(count || 0)

        // If image_url is missing in the public view, resolve it via API route
        const missing = rows.filter((r) => r.image_url == null)
        if (rows.length > 0 && missing.length > 0) {
          try {
            const resp = await fetch('/api/public/questions/images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ids: rows.map((r) => r.id) })
            })
            if (resp.ok) {
              const json = await resp.json()
              const map: Record<string, string | null> = {}
              for (const it of json.data as Array<{ id: string; image_url: string | null }>) {
                map[it.id] = it.image_url
              }
              rows = rows.map((r) => ({ ...r, image_url: map[r.id] ?? r.image_url ?? null }))
            }
          } catch {
            // ignore
          }
        }

        setItems(rows)
      } catch (e) {
        console.error('Erro ao carregar questões públicas:', e)
        setItems([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [supabase, page, filters.search, filters.component, filters.difficulty, filters.year])

  // Load options (components, years) once
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [cRes, yRes, dRes] = await Promise.all([
          supabase
            .from('v_questions_public')
            .select('component')
            .not('component', 'is', null)
            .order('component')
            .limit(1000),
          supabase
            .from('v_questions_public')
            .select('year')
            .not('year', 'is', null)
            .order('year')
            .limit(1000),
          supabase
            .from('v_questions_public')
            .select('difficulty')
            .not('difficulty', 'is', null)
            .order('difficulty')
            .limit(1000),
        ])
        const comps = Array.from(new Set((cRes.data || []).map((r: any) => r.component))).filter(Boolean)
        const yrs = Array.from(new Set((yRes.data || []).map((r: any) => r.year))).filter((n): n is number => typeof n === 'number')
        const diffs = Array.from(new Set((dRes.data || []).map((r: any) => r.difficulty))).filter(Boolean)
        setComponents(comps)
        setYears(yrs)
        setDifficulties(diffs as string[])
      } catch (e) {
        console.error('Erro ao carregar filtros:', e)
      }
    }
    void loadOptions()
  }, [supabase])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Questões</h1>
            <p className="text-gray-600">Explore o banco de questões. Use os filtros para refinar a busca.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Visualização em cards"
              aria-pressed={view === 'cards'}
              className={`p-2 rounded-md border ${view === 'cards' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              onClick={() => applyQuery({ view: 'cards' })}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Visualização em lista"
              aria-pressed={view === 'list'}
              className={`p-2 rounded-md border ${view === 'list' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              onClick={() => applyQuery({ view: 'list' })}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <FiltersBar
          value={{ search: filters.search, component: filters.component, difficulty: filters.difficulty, year: filters.year }}
          onChange={(next) => applyQuery({ ...next, page: 1 })}
          components={components}
          difficulties={difficulties}
          years={years}
        />

        <div className="mt-4">
          {loading ? (
            <div className="py-16 text-center text-gray-500">Carregando…</div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-gray-500">Nenhuma questão encontrada</div>
          ) : view === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((q) => (
                <QuestionCard key={q.id} q={q as any} visuals={componentVisuals as any} />
              ))}
            </div>
          ) : (
            <div className="divide-y rounded-md border bg-white">
              {items.map((q) => (
                <div key={q.id} className="p-4 flex gap-4 items-start">
                  {(() => {
                    const img = (q as any).image_url as string | null
                    const name = (q.component || '').trim()
                    const visual = name ? (componentVisuals as any)[name] : undefined
                    return (
                      <div className="w-24 h-16 flex-shrink-0 border rounded overflow-hidden flex items-center justify-center"
                        style={img ? undefined : visual ? { background: visual.bg, color: visual.fg } : { background: '#f3f4f6', color: '#6b7280' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {img ? (
                          <img src={img} alt="thumb" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold tracking-wide">{visual ? visual.abbr : '—'}</span>
                        )}
                      </div>
                    )
                  })()}
                  <div className="flex-1">
                    <div className="text-sm md:text-base font-medium leading-snug mb-2">
                      {q.prompt?.length > 180 ? q.prompt.slice(0, 180) + '…' : q.prompt || 'Enunciado não disponível'}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {q.component && <span className="px-2 py-0.5 rounded bg-gray-100 border">{q.component}</span>}
                      {q.year != null && <span className="px-2 py-0.5 rounded bg-gray-100 border">{q.year}</span>}
                      {q.difficulty && <span className="px-2 py-0.5 rounded bg-gray-100 border">{q.difficulty}</span>}
                    </div>
                  </div>
                  <div>
                    <a href={`/questoes/${q.id}`} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm">Detalhes</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">
            Exibindo {items.length} de {total} questões
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 disabled:opacity-50"
              disabled={loading || page <= 1}
              onClick={() => applyQuery({ page: page - 1 })}
            >
              Anterior
            </button>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 disabled:opacity-50"
              disabled={loading || page >= totalPages}
              onClick={() => applyQuery({ page: page + 1 })}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
