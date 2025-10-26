'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'

type Attempt = { id: string; started_at: string; finished_at: string | null; total_questions: number; correct_answers: number; score: number }

export default function HistoricoSimuladosPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/admin/database/data/simulado_attempts?page=1&limit=100&orderBy=started_at')
      const json = await res.json()
      setAttempts(json?.data || [])
    }
    void load()
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Histórico de Simulados</h1>
          {attempts.length === 0 ? (
            <div>Nenhum simulado encontrado.</div>
          ) : (
            <div className="space-y-3">
              {attempts.map((a: Attempt) => (
                <div key={a.id} className="border rounded p-4 flex justify-between">
                  <div>
                    <div className="font-medium">{new Date(a.started_at).toLocaleString('pt-BR')}</div>
                    <div className="text-sm text-gray-600">{a.finished_at ? 'Finalizado' : 'Em andamento'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{a.correct_answers}/{a.total_questions}</div>
                    <div className="text-sm text-gray-600">{Number(a.score || 0).toFixed(0)}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}


