'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnswerReveal } from './AnswerReveal'

export type FullQuestion = {
  id: string
  prompt: string
  alt_a_text: string
  alt_b_text: string
  alt_c_text: string
  alt_d_text: string
  correct_letter: 'A'|'B'|'C'|'D' | string
  image_url: string | null
  component: string | null
  difficulty: string | null
  year: number | null
  competency_desc?: string | null
  skill_code?: string | null
  skill_desc?: string | null
}

export function QuestionDetail({ q }: { q: FullQuestion }) {
  const alternatives: Array<{ letter: 'A'|'B'|'C'|'D'|string; text: string }> = [
    { letter: 'A', text: q.alt_a_text || '—' },
    { letter: 'B', text: q.alt_b_text || '—' },
    { letter: 'C', text: q.alt_c_text || '—' },
    { letter: 'D', text: q.alt_d_text || '—' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-xl">Questão</CardTitle>
          <div className="flex gap-2">
            {q.component && <Badge variant="secondary">{q.component}</Badge>}
            {q.year != null && <Badge variant="outline">{q.year}</Badge>}
            {q.difficulty && <Badge>{q.difficulty}</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {q.image_url && (
          <div className="mb-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={q.image_url} alt="Imagem da questão" className="max-h-80 object-contain rounded-md border" />
          </div>
        )}

        <div className="text-lg leading-relaxed mb-6 whitespace-pre-line">{q.prompt}</div>

        <div className="space-y-2">
          {alternatives.map((a) => (
            <div key={a.letter} className="flex items-start gap-3 p-3 rounded-md border">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                {a.letter}
              </div>
              <div className="flex-1">{a.text}</div>
            </div>
          ))}
        </div>

        <AnswerReveal correct={q.correct_letter} />

        {(q.competency_desc || q.skill_code || q.skill_desc) && (
          <div className="mt-6 border-t pt-4 text-sm text-gray-700 space-y-1">
            {q.competency_desc && (
              <div><strong>Competência:</strong> {q.competency_desc}</div>
            )}
            {q.skill_code && (
              <div><strong>Habilidade:</strong> {q.skill_code}</div>
            )}
            {q.skill_desc && (
              <div><strong>Descrição da habilidade:</strong> {q.skill_desc}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
