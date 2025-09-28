import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const supabase = await createServerClient()
    const tableName = params.table

    // Check if user is authenticated and is admin
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userRole = session.user.user_metadata?.user_role
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized: admin access required' },
        { status: 403 }
      )
    }

    // Create Supabase admin client using service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Query to get table structure from information_schema
    const { data: columns, error } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', tableName)
      .eq('table_schema', 'public')
      .order('ordinal_position')

    if (error) {
      console.error('Error fetching table structure:', error)
      return NextResponse.json(
        { error: 'Failed to fetch table structure' },
        { status: 500 }
      )
    }

    // Log the admin action
    await supabase.from('admin_actions').insert({
      admin_id: session.user.id,
      action: 'database_structure_view',
      payload: { table_name: tableName, columns_count: columns?.length || 0 }
    })

    return NextResponse.json({
      success: true,
      columns: columns || []
    })

  } catch (error) {
    console.error('Error in database structure API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
