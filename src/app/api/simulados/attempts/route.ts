import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'

export async function POST() {
  try {
    const supabase = await createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data, error } = await supabase
      .from('simulado_attempts')
      .insert({ user_id: session.user.id, total_questions: 0, correct_answers: 0 })
      .select('id, started_at')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, attempt: data })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || 'Internal server error' }, { status: 500 })
  }
}


