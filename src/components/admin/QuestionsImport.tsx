'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function QuestionsImport() {
  const [jsonText, setJsonText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>(null)

  const handleFile = async (file: File) => {
    const text = await file.text()
    setJsonText(text)
  }

  const submit = async () => {
    try {
      setLoading(true)
      const body = JSON.parse(jsonText)
      const res = await fetch('/api/admin/import/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setResult({ error: (e as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar Questões</CardTitle>
        <CardDescription>Envie um JSON no formato de `public/sample_1_questao.json` ou cole abaixo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input type="file" accept="application/json" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f) }} />
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full h-48 border rounded p-2 font-mono text-sm"
            placeholder="Cole aqui o JSON ou selecione um arquivo"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={submit} disabled={loading || !jsonText.trim()}>
            {loading ? 'Importando...' : 'Importar'}
          </Button>
          <Button variant="outline" onClick={() => { setJsonText(''); setResult(null) }}>Limpar</Button>
        </div>
        {result && (
          <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-64">{JSON.stringify(result, null, 2)}</pre>
        )}
      </CardContent>
    </Card>
  )
}


