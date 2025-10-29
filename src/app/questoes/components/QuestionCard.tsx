'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export type PublicQuestion = {
  id: string
  prompt: string
  component: string | null
  difficulty: string | null
  year: number | null
  image_url?: string | null
}

type VisualMap = Record<string, { abbr: string; bg: string; fg: string }>

export function QuestionCard({ q, visuals }: { q: PublicQuestion, visuals?: VisualMap }) {
  const preview = q.prompt?.length > 140 ? q.prompt.slice(0, 140) + '…' : q.prompt
  const visual = q.component && visuals ? visuals[q.component] : undefined
  const thumb = (
    <div className="w-20 h-20 rounded-md overflow-hidden border flex items-center justify-center flex-shrink-0"
      style={q.image_url ? undefined : visual ? { background: visual.bg, color: visual.fg } : { background: '#f3f4f6', color: '#6b7280' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {q.image_url ? (
        <img src={q.image_url} alt="thumb" className="w-full h-full object-cover" />
      ) : (
        <span className="text-xs font-semibold tracking-wide">
          {visual ? visual.abbr : '—'}
        </span>
      )}
    </div>
  )

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <div className="p-4 flex gap-4">
        {thumb}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="text-base leading-snug font-medium line-clamp-3">
            {preview || 'Enunciado não disponível'}
          </div>
          <div className="flex flex-wrap gap-2">
            {q.component && <Badge variant="secondary">{q.component}</Badge>}
            {q.year != null && <Badge variant="outline">{q.year}</Badge>}
            {q.difficulty && <Badge>{q.difficulty}</Badge>}
          </div>
          <div className="mt-2">
            <Link
              href={`/questoes/${q.id}`}
              className="inline-block px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Ver Detalhes
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
