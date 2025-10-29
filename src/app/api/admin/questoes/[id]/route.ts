import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient } from '@supabase/supabase-js'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const role = user.user_metadata?.user_role
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized: admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { updates } = body as { updates: Record<string, unknown> }
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'updates object is required' }, { status: 400 })
    }

    // Optional: sanitize out undefined values
    const sanitized: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) sanitized[k] = v
    }
    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ success: true, message: 'No changes' })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { error } = await supabaseAdmin
      .from('questions')
      .update(sanitized)
      .eq('id', id)

    if (error) {
      console.error('Error updating question:', error)
      return NextResponse.json({ error: 'Failed to update question', details: error.message }, { status: 500 })
    }

    // Log admin action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('admin_actions').insert({
      admin_id: user.id,
      action: 'question_update',
      payload: { question_id: id, fields: Object.keys(sanitized) }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error in question update API:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

