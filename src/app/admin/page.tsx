import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AdminTabs } from '@/components/admin/AdminTabs'

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin (check JWT metadata)
  const userRole = user.user_metadata?.user_role

  console.log('Admin page - User check:', {
    userId: user.id,
    jwtRole: userRole,
    isAdmin: userRole === 'admin'
  })

  if (userRole !== 'admin') {
    console.log('Admin page - User is not admin, redirecting to home')
    redirect('/')
  }

  // Log admin access
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('admin_actions').insert({
    admin_id: user.id,
    action: 'admin_page_access',
    payload: { timestamp: new Date().toISOString() }
  })


  console.log('Admin page - Rendering admin dashboard for user:', user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="mt-2 text-gray-600">
            Gerencie perfis, questões, metadados, banco de dados e ações administrativas.
          </p>
        </div>

        <AdminTabs />
      </div>
    </div>
  )
}
