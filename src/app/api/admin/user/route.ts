import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { logUserUpdate, logUserDelete } from '@/app/actions/createAdminAction'
import { Tables, TablesInsert, TablesUpdate } from '@/lib/database.types'

// This endpoint requires SUPABASE_SERVICE_ROLE_KEY environment variable for DELETE operations

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient()

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
    const { userId, updates } = body

    if (!userId || !updates) {
      return NextResponse.json(
        { error: 'userId and updates are required' },
        { status: 400 }
      )
    }

    // Validate that updates only contain allowed fields
    const allowedFields = ['full_name']
    const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field))

    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: `Invalid fields: ${invalidFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Update the user profile
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user profile:', error)
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      )
    }

    // Log the admin action
    try {
      await logUserUpdate(userId, updates)
    } catch (logError) {
      console.error('Error logging admin action:', logError)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      message: 'User profile updated successfully'
    })

  } catch (error) {
    console.error('Error in user API PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient()

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
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Get user info before deletion for logging
    const { data: userToDelete } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single() as { data: any }

    // Create Supabase admin client using service role key for user deletion
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

    // Delete the user from auth.users (this will cascade to profiles)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      )
    }

    // Log the admin action
    try {
      await logUserDelete(userId)
    } catch (logError) {
      console.error('Error logging admin action:', logError)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      message: `User ${userToDelete?.email || userId} deleted successfully`
    })

  } catch (error) {
    console.error('Error in user API DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
