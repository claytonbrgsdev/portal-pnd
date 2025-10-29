'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

// Versão sem dependência de framer-motion, com transição CSS simples
export function AnswerReveal({ correct }: { correct: 'A'|'B'|'C'|'D' | string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-4">
      <Button onClick={() => setOpen(!open)}>{open ? 'Ocultar resposta' : 'Mostrar resposta'}</Button>
      <div
        className={`transition-all duration-200 ease-out overflow-hidden ${
          open ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-900">
          A alternativa correta é <strong>{String(correct)}</strong>.
        </div>
      </div>
    </div>
  )
}
