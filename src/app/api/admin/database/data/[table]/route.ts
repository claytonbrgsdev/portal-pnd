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

    // Use service role key for testing
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

    // Get table data (limit to 100 rows for performance)
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .limit(100)

    if (error) {
      console.error('Error fetching table data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch table data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
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

    const body = await request.json()
    const { rowId, columnName, newValue } = body

    if (!rowId || !columnName || newValue === undefined) {
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
        { error: 'Failed to update table data' },
        { status: 500 }
      )
    }

    // Log the admin action
    await supabase.from('admin_actions').insert({
      admin_id: session.user.id,
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

    // Log the admin action
    await supabase.from('admin_actions').insert({
      admin_id: session.user.id,
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
