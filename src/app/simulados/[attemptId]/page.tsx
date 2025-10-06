'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'

type Question = {
  id: string
  prompt: string
  alt_a_text: string
  alt_b_text: string
  alt_c_text: string
  alt_d_text: string
  correct_letter: 'A'|'B'|'C'|'D'
}

export default function SimuladoRunnerPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, 'A'|'B'|'C'|'D'>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [summary, setSummary] = useState<{ correct: number; total: number } | null>(null)

  // simple fetch of random batch of questions
  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/admin/database/data/questions?page=1&limit=20')
      const json = await res.json()
      const qs: Question[] = (json?.data || []).map((q: any) => ({
        id: q.id,
        prompt: q.prompt,
        alt_a_text: q.alt_a_text,
        alt_b_text: q.alt_b_text,
        alt_c_text: q.alt_c_text,
        alt_d_text: q.alt_d_text,
        correct_letter: q.correct_letter
      }))
      setQuestions(qs)
    }
    void load()
  }, [])

  const current = useMemo(() => questions[index], [questions, index])

  const select = (letter: 'A'|'B'|'C'|'D') => {
    if (!current) return
    setAnswers({ ...answers, [current.id]: letter })
  }

  const submitAnswer = async () => {
    if (!current) return
    setSubmitting(true)
    await fetch(`/api/simulados/attempts/${attemptId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: current.id, selected_letter: answers[current.id] })
    })
    setSubmitting(false)
    if (index + 1 < questions.length) setIndex(index + 1)
    else await finish()
  }

  const finish = async () => {
    setDone(true)
    await fetch(`/api/simulados/attempts/${attemptId}/finish`, { method: 'POST' })
    // calculate summary locally for immediate feedback
    const correct = questions.reduce((acc, q) => acc + (answers[q.id] === q.correct_letter ? 1 : 0), 0)
    setSummary({ correct, total: questions.length })
  }

  if (done && summary) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-4">Resultado do Simulado</h1>
            <p className="mb-4">Pontuação: {summary.correct} / {summary.total} ({((summary.correct * 100)/summary.total).toFixed(0)}%)</p>
            <div className="space-y-4">
              {questions.map((q) => {
                const sel = answers[q.id]
                const correct = q.correct_letter
                const isCorrect = sel === correct
                const letterText: Record<'A'|'B'|'C'|'D', string> = {
                  A: q.alt_a_text, B: q.alt_b_text, C: q.alt_c_text, D: q.alt_d_text
                }
                return (
                  <div key={q.id} className="border rounded p-4">
                    <div className="font-medium mb-2">{q.prompt}</div>
                    <div className="text-sm">
                      <div className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                        Sua resposta: {sel} — {letterText[sel]}
                      </div>
                      {!isCorrect && (
                        <div className="text-green-700 mt-1">Correta: {correct} — {letterText[correct]}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6">
              <Button onClick={() => router.push('/simulados')}>Voltar</Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Questão {index + 1} de {questions.length || 0}</h1>
            <Button variant="outline" onClick={finish} disabled={questions.length === 0}>Finalizar</Button>
          </div>
          {current ? (
            <div>
              <div className="mb-4 text-lg">{current.prompt}</div>
              <div className="space-y-2">
                {(['A','B','C','D'] as const).map((letter) => (
                  <button
                    key={letter}
                    onClick={() => select(letter)}
                    className={`w-full text-left p-3 border rounded ${answers[current.id] === letter ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <span className="font-semibold mr-2">{letter})</span>
                    {letter === 'A' ? current.alt_a_text : letter === 'B' ? current.alt_b_text : letter === 'C' ? current.alt_c_text : current.alt_d_text}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>Anterior</Button>
                <Button onClick={submitAnswer} disabled={!answers[current.id] || submitting}>{index + 1 === questions.length ? 'Finalizar' : 'Responder e Próxima'}</Button>
              </div>
            </div>
          ) : (
            <div>Carregando questões...</div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}


