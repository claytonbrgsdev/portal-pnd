import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Public endpoint to resolve image_url for a given list of question IDs.
// Returns only { id, image_url } and limits input size to prevent abuse.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const ids = (body?.ids as unknown[])?.filter((v) => typeof v === 'string') as string[] | undefined
    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'ids is required' }, { status: 400 })
    }
    if (ids.length > 100) {
      return NextResponse.json({ error: 'too many ids' }, { status: 400 })
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data, error } = await admin
      .from('questions')
      .select('id,image_url')
      .in('id', ids)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch images', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

