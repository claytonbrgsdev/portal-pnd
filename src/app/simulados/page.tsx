'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'

export default function SimuladosStartPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const start = async () => {
    setLoading(true)
    const res = await fetch('/api/simulados/attempts', { method: 'POST' })
    const json = await res.json()
    setLoading(false)
    if (json?.attempt?.id) router.push(`/simulados/${json.attempt.id}`)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow p-8 max-w-xl w-full text-center">
          <h1 className="text-2xl font-bold mb-2">Simulados</h1>
          <p className="text-gray-600 mb-6">Inicie um simulado com questões do banco.</p>
          <Button onClick={start} disabled={loading}>{loading ? 'Preparando...' : 'Começar Simulado'}</Button>
        </div>
      </div>
    </ProtectedRoute>
  )
}


