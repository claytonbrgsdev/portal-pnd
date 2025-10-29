import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ table: string }> }
) {
  const params = await context.params
  try {
    const tableName = params.table
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 1000) // Max 1000 rows
    const offset = (page - 1) * limit
    const filtersParam = searchParams.get('filters')
    const orderBy = searchParams.get('orderBy')
    const ascendingParam = searchParams.get('ascending')
    const ascending = ascendingParam ? ascendingParam === 'true' : false
    let filters: Record<string, unknown> = {}
    try {
      filters = filtersParam ? JSON.parse(filtersParam) : {}
    } catch {
      // ignore bad filters
      filters = {}
    }

    // Use server client with authentication context
    const supabase = await createServerClient()

    // Check if user is authenticated and is admin (use getUser for authenticated data)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userRole = user.user_metadata?.user_role
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized: admin access required' },
        { status: 403 }
      )
    }

    console.log('Data API - User authenticated:', {
      userId: user.id,
      role: userRole,
      tableName
    })

    // Create admin client with service role for data access
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

    // Build query with optional filters
    let query = supabaseAdmin
      .from(tableName)
      .select('*', { count: 'exact' })

    // Apply filters (basic heuristics: ilike for strings, eq otherwise)
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '') continue
      if (typeof value === 'string') {
        // partial, case-insensitive match
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query = (query as any).ilike(key, `%${value}%`)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query = (query as any).eq(key, value)
      }
    }

    // Ordering
    if (orderBy) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query = (query as any).order(orderBy, { ascending })
    }

    // Pagination
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error, count } = await (query as any).range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching table data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch table data', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: offset + limit < (count || 0),
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error in database data API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ table: string }> }
) {
  const params = await context.params
  try {
    const tableName = params.table

    // Use server client with authentication context
    const supabase = await createServerClient()

    // Check if user is authenticated and is admin (use getUser for authenticated data)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userRole = user.user_metadata?.user_role
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized: admin access required' },
        { status: 403 }
      )
    }

    console.log('Data API - User authenticated:', {
      userId: user.id,
      role: userRole,
      tableName
    })

    const body = await request.json()
    const { rowId, columnName, newValue } = body as { rowId?: string; columnName?: string; newValue?: unknown }

    if (!rowId || !columnName || typeof columnName !== 'string' || newValue === undefined) {
      return NextResponse.json(
        { error: 'rowId, columnName, and newValue are required' },
        { status: 400 }
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

    // Update the specific row and column
    const { error } = await supabaseAdmin
      .from(tableName)
      .update({ [columnName]: newValue })
      .eq('id', rowId)

    if (error) {
      console.error('Error updating table data:', error)
      return NextResponse.json(
        { error: 'Failed to update table data', details: error.message },
        { status: 500 }
      )
    }

    // Log the admin action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('admin_actions').insert({
      admin_id: user.id,
      action: 'database_data_update',
      payload: {
        table_name: tableName,
        row_id: rowId,
        column_name: columnName,
        new_value: newValue
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Data updated successfully'
    })

  } catch (error) {
    console.error('Error in database data update API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ table: string }> }
) {
  const params = await context.params
  try {
    const tableName = params.table

    // Use server client with authentication context
    const supabase = await createServerClient()

    // Check if user is authenticated and is admin (use getUser for authenticated data)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userRole = user.user_metadata?.user_role
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized: admin access required' },
        { status: 403 }
      )
    }

    console.log('Data API - User authenticated:', {
      userId: user.id,
      role: userRole,
      tableName
    })

    const body = await request.json()
    const { rowId } = body

    if (!rowId) {
      return NextResponse.json(
        { error: 'rowId is required' },
        { status: 400 }
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

    // Delete the specific row
    const { error } = await supabaseAdmin
      .from(tableName)
      .delete()
      .eq('id', rowId)

    if (error) {
      console.error('Error deleting table row:', error)
      return NextResponse.json(
        { error: 'Failed to delete table row' },
        { status: 500 }
      )
    }

    // Best-effort: cleanup companion metadata for known tables
    try {
      if (tableName === 'questions') {
        const { error: metaDelErr } = await supabaseAdmin
          .from('question_metadata')
          .delete()
          .eq('question_id', rowId)
        if (metaDelErr) {
          console.warn('Cleanup metadata warning:', metaDelErr)
        }
      }
    } catch (e) {
      console.warn('Cleanup metadata exception:', e)
    }

    // Log the admin action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('admin_actions').insert({
      admin_id: user.id,
      action: 'database_data_delete',
      payload: {
        table_name: tableName,
        row_id: rowId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Row deleted successfully'
    })

  } catch (error) {
    console.error('Error in database data delete API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ table: string }> }
) {
  const params = await context.params
  try {
    const tableName = params.table

    // Use server client with authentication context
    const supabase = await createServerClient()

    // Check if user is authenticated and is admin (use getUser for authenticated data)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userRole = user.user_metadata?.user_role
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized: admin access required' },
        { status: 403 }
      )
    }

    console.log('Data API - User authenticated:', {
      userId: user.id,
      role: userRole,
      tableName
    })

    const body = await request.json()
    const { data: newRow } = body

    if (!newRow) {
      return NextResponse.json(
        { error: 'New row data is required' },
        { status: 400 }
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

    // Insert the new row
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .insert(newRow)
      .select()

    if (error) {
      console.error('Error inserting table data:', error)
      return NextResponse.json(
        { error: 'Failed to insert table data', details: error.message },
        { status: 500 }
      )
    }

    // Auto-create companion records for known tables
    try {
      if (tableName === 'questions') {
        const newId = data?.[0]?.id as string | undefined
        if (newId) {
          const { error: metaErr } = await supabaseAdmin
            .from('question_metadata')
            .upsert({ question_id: newId }, { onConflict: 'question_id' })
          if (metaErr) {
            console.warn('Auto-create metadata warning:', metaErr)
          }
        }
      }
    } catch (e) {
      console.warn('Auto-create metadata exception:', e)
    }

    // Log the admin action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('admin_actions').insert({
      admin_id: user.id,
      action: 'database_data_insert',
      payload: {
        table_name: tableName,
        new_row_id: data?.[0]?.id || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Row inserted successfully'
    })

  } catch (error) {
    console.error('Error in database data insert API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
