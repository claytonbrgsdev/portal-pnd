import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { logUserRoleChange } from '@/app/actions/createAdminAction'

// This endpoint requires SUPABASE_SERVICE_ROLE_KEY environment variable
// Never expose this key to the client-side

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Check if user is authenticated and is admin
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

    const body = await request.json()
    const { userId, newRole } = body

    if (!userId || !newRole) {
      return NextResponse.json(
        { error: 'userId and newRole are required' },
        { status: 400 }
      )
    }

    if (!['admin', 'user'].includes(newRole)) {
      return NextResponse.json(
        { error: 'Invalid role: must be admin or user' },
        { status: 400 }
      )
    }

    // Create Supabase admin client using service role key
    // This requires SUPABASE_SERVICE_ROLE_KEY environment variable
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

    // Get current user metadata to determine old role
    const { data: currentUser, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (fetchError || !currentUser.user) {
      console.error('Error fetching current user:', fetchError)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const oldRole = currentUser.user.user_metadata?.user_role || 'user'

    // Update user metadata with new role
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...currentUser.user.user_metadata,
          user_role: newRole
        }
      }
    )

    if (updateError) {
      console.error('Error updating user role:', updateError)
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: 500 }
      )
    }

    // Log the admin action
    try {
    await logUserRoleChange(userId, newRole, oldRole)
    } catch (logError) {
      console.error('Error logging admin action:', logError)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      message: `User role updated from ${oldRole} to ${newRole}`,
      oldRole,
      newRole
    })

  } catch (error) {
    console.error('Error in promo API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
