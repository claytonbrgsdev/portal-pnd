import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'

export async function POST() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('simulado_attempts')
      .insert({ user_id: user.id, total_questions: 0, correct_answers: 0 })
      .select('id, started_at')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, attempt: data })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || 'Internal server error' }, { status: 500 })
  }
}

