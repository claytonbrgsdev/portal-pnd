'use server'

import { createClient } from '@/utils/supabase/server'

interface AdminActionData {
  action: string
  targetUserId?: string
  payload?: Record<string, unknown>
}

export async function createAdminAction(data: AdminActionData) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Verify user is admin
  const userRole = user.user_metadata?.user_role
  if (userRole !== 'admin') {
    throw new Error('Not authorized: admin access required')
  }

  // Log the admin action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('admin_actions').insert({
    admin_id: user.id,
    action: data.action,
    target_user_id: data.targetUserId || null,
    payload: data.payload || {}
  })

  if (error) {
    console.error('Error logging admin action:', error)
    throw new Error('Failed to log admin action')
  }

  return { success: true }
}

// Convenience functions for common admin actions
export async function logUserUpdate(targetUserId: string, updates: Record<string, unknown>) {
  return createAdminAction({
    action: 'user_profile_update',
    targetUserId,
    payload: { updates }
  })
}

export async function logUserDelete(targetUserId: string) {
  return createAdminAction({
    action: 'user_delete',
    targetUserId,
    payload: { deleted_at: new Date().toISOString() }
  })
}

export async function logUserRoleChange(targetUserId: string, newRole: string, oldRole: string) {
  return createAdminAction({
    action: 'user_role_change',
    targetUserId,
    payload: { new_role: newRole, old_role: oldRole }
  })
}

export async function logAdminAccess() {
  return createAdminAction({
    action: 'admin_page_access',
    payload: { timestamp: new Date().toISOString() }
  })
}
