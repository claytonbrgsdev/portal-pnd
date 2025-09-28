import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AdminUserList from '@/components/AdminUserList'
import DatabaseManager from '@/components/DatabaseManager'

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Check if user is admin (check JWT metadata)
  const userRole = session.user.user_metadata?.user_role

  console.log('Admin page - User check:', {
    userId: session.user.id,
    jwtRole: userRole,
    isAdmin: userRole === 'admin'
  })

  if (userRole !== 'admin') {
    console.log('Admin page - User is not admin, redirecting to home')
    redirect('/')
  }

  // Log admin access
  await supabase.from('admin_actions').insert({
    admin_id: session.user.id,
    action: 'admin_page_access',
    payload: { timestamp: new Date().toISOString() }
  })

  // Fetch all profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError)
  }

  // Fetch recent admin actions
  const { data: adminActions, error: actionsError } = await supabase
    .from('admin_actions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (actionsError) {
    console.error('Error fetching admin actions:', actionsError)
  }

  console.log('Admin page - Rendering admin dashboard for user:', session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage user profiles, roles, and view admin actions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
              User Management
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Database Management
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  User Management
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {profiles?.length || 0} total users
                </p>
              </div>
              <div className="p-6">
                <AdminUserList
                  profiles={profiles || []}
                />
              </div>
            </div>
          </div>

          {/* Database Management */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Database Management
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage database tables and data
                </p>
              </div>
              <div className="p-6">
                <DatabaseManager />
              </div>
            </div>
          </div>

          {/* Recent Admin Actions */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Admin Actions
                  </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Last 50 actions
                </p>
              </div>
              <div className="p-6">
                {adminActions && adminActions.length > 0 ? (
                  <div className="space-y-4">
                    {adminActions.map((action) => (
                      <div key={action.id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">
                            {action.action.replace(/_/g, ' ')}
                  </div>
                          <div className="text-xs text-gray-500">
                            {new Date(action.created_at).toLocaleDateString()}
                  </div>
                </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Admin ID: {action.admin_id.substring(0, 8)}...
                          {action.target_user_id && (
                            <span className="ml-2">
                              Target: {action.target_user_id.substring(0, 8)}...
                            </span>
                          )}
                        </div>
                    </div>
                  ))}
                </div>
                ) : (
                  <p className="text-gray-500 text-sm">No admin actions recorded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}