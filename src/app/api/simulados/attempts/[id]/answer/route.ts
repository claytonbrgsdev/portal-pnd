import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const supabase = await createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await request.json()
    const { question_id, selected_letter } = body as { question_id: string; selected_letter: 'A'|'B'|'C'|'D' }
    if (!question_id || !selected_letter) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const { data: q } = await supabase.from('questions').select('id, correct_letter').eq('id', question_id).single()
    const correct = q?.correct_letter as 'A'|'B'|'C'|'D'
    const is_correct = selected_letter === correct

    const { error: insErr } = await supabase.from('simulado_answers').insert({
      attempt_id: id,
      question_id,
      selected_letter,
      correct_letter: correct,
      is_correct
    })
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })

    // Update attempt counters
    await supabase.rpc('exec_sql', `
      UPDATE public.simulado_attempts
      SET total_questions = total_questions + 1,
          correct_answers = correct_answers + ${is_correct ? 1 : 0}
      WHERE id = '${id}'
    `)

    return NextResponse.json({ success: true, is_correct, correct_letter: correct })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


