'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { QuestionDetail, FullQuestion } from './components/QuestionDetail'

export default function PublicQuestionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const supabase = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState<FullQuestion | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Busca na view pública e tenta agregar metadados se existir
        const { data, error } = await supabase
          .from('v_questions_public')
          .select('*')
          .eq('id', id)
          .single()
        if (error) throw error

        // Fallbacks diretos na tabela questions quando a view pública não inclui campos
        let a: any = {}
        const vd = data as any
        // Se alternativas não vierem na view, buscar alternativas e prompt
        if (!vd?.alt_a_text && !vd?.alt_b_text && !vd?.alt_c_text && !vd?.alt_d_text) {
          try {
            const { data: qfull } = await supabase
              .from('questions')
              .select('alt_a_text,alt_b_text,alt_c_text,alt_d_text,prompt')
              .eq('id', id)
              .single()
            a = { ...a, ...(qfull || {}) }
          } catch {}
        }
        // Se a imagem não vier na view, buscar somente a image_url
        if (!vd?.image_url) {
          try {
            const { data: img } = await supabase
              .from('questions')
              .select('image_url')
              .eq('id', id)
              .single()
            a = { ...a, ...(img || {}) }
          } catch {}
        }

        // Tenta buscar metadados opcionais
        let competency_desc: string | null = null
        let skill_code: string | null = null
        let skill_desc: string | null = null
        try {
          const { data: md } = await supabase
            .from('question_metadata')
            .select('competency_desc,skill_code,skill_desc')
            .eq('question_id', id)
            .maybeSingle()
          if (md) {
            const mda = md as any
            competency_desc = mda.competency_desc
            skill_code = mda.skill_code
            skill_desc = mda.skill_desc
          }
        } catch {}

        setQ({ ...(data as any), ...a, competency_desc, skill_code, skill_desc })
      } catch (e) {
        console.error('Erro ao carregar questão:', e)
        setQ(null)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [id, supabase])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10 px-4 space-y-4">
        <nav className="text-sm text-gray-600">
          <Link href="/" className="hover:underline">Home</Link> /{' '}
          <Link href="/questoes" className="hover:underline">Questões</Link> /{' '}
          <span>{String(id).slice(0, 8)}…</span>
        </nav>

        {loading ? (
          <div className="py-16 text-center text-gray-500">Carregando…</div>
        ) : !q ? (
          <div className="py-16 text-center text-gray-500">Questão não encontrada</div>
        ) : (
          <QuestionDetail q={q} />
        )}
      </div>
    </div>
  )
}
