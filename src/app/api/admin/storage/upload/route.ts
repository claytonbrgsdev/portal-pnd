import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    // Use getUser to validate the session against Supabase Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userRole = user.user_metadata?.user_role
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Not authorized: admin access required' }, { status: 403 })
    }

    const form = await request.formData()
    const file = form.get('file') as File | null
    const bucket = (form.get('bucket') as string) || 'questions-images'
    const prefix = (form.get('prefix') as string) || 'questions'

    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    const safeName = (file.name || 'image.bin')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '')
    const path = `${prefix}/${Date.now()}-${safeName}`

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Upload via service role to bypass Storage RLS
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, {
        upsert: false,
        cacheControl: '3600',
        contentType: file.type || undefined,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message || 'Upload failed' }, { status: 500 })
    }

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)
    if (!data?.publicUrl) {
      return NextResponse.json({ error: 'Failed to get public URL' }, { status: 500 })
    }

    return NextResponse.json({ success: true, url: data.publicUrl, path })
  } catch (err) {
    console.error('Error in storage upload API:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

