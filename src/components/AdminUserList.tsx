'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminEditUser from './AdminEditUser'
import { ConfirmDialog } from './ConfirmDialog'

interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

interface AdminUserListProps {
  profiles: Profile[]
}

export default function AdminUserList({ profiles }: AdminUserListProps) {
  console.log('AdminUserList - Rendering with profiles:', profiles?.length || 0, 'users')

  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    show: boolean
    title: string
    message: string
    onConfirm: () => void
  } | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleEdit = (user: Profile) => {
    setEditingUser(user)
  }

  const handleDelete = async (user: Profile) => {
    setShowConfirmDialog({
      show: true,
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.email}? This action cannot be undone.`,
      onConfirm: async () => {
        setLoading(user.id)
        try {
          const response = await fetch('/api/admin/user', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id }),
          })

          if (response.ok) {
            // Refresh the page to show updated data
            router.refresh()
          } else {
            alert('Failed to delete user')
          }
        } catch (error) {
          console.error('Error deleting user:', error)
          alert('Failed to delete user')
        } finally {
          setLoading(null)
          setShowConfirmDialog(null)
        }
      }
    })
  }

  const handlePromote = async (user: Profile) => {
    const userRole = user.email === 'admin@example.com' ? 'admin' : 'user' // This should come from actual user metadata
    const newRole = userRole === 'admin' ? 'user' : 'admin'

    setShowConfirmDialog({
      show: true,
      title: `${newRole === 'admin' ? 'Promote' : 'Demote'} User`,
      message: `Are you sure you want to ${newRole === 'admin' ? 'promote' : 'demote'} ${user.email} to ${newRole}?`,
      onConfirm: async () => {
        setLoading(user.id)
        try {
          const response = await fetch('/api/admin/promo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              newRole: newRole,
            }),
          })

          if (response.ok) {
            // Refresh the page to show updated data
            router.refresh()
            // Show success message
            alert(`User ${newRole === 'admin' ? 'promoted' : 'demoted'} successfully`)
          } else {
            alert('Failed to update user role')
          }
        } catch (error) {
          console.error('Error updating user role:', error)
          alert('Failed to update user role')
        } finally {
          setLoading(null)
          setShowConfirmDialog(null)
        }
      }
    })
  }

  const getUserRole = (user: Profile) => {
    // In a real implementation, this would check the user's metadata
    // For demo purposes, we'll assume admin@example.com is an admin
    if (user.email === 'admin@example.com') return 'admin'
    return 'user'
  }

  const handleUpdateUser = async (userId: string, updates: Partial<Profile>) => {
    setLoading(userId)
    try {
      const response = await fetch('/api/admin/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, updates }),
      })

      if (response.ok) {
        setEditingUser(null)
        router.refresh()
      } else {
        alert('Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user')
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {profiles.map((profile) => {
          const userRole = getUserRole(profile)
          const isLoading = loading === profile.id

          return (
            <div key={profile.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {profile.full_name || 'No name'}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      userRole === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {userRole}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{profile.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Criado em: {profile.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '—'}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(profile)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handlePromote(profile)}
                    disabled={isLoading}
                    className={`px-3 py-1 text-sm rounded disabled:opacity-50 ${
                      userRole === 'admin'
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {userRole === 'admin' ? 'Demote' : 'Promote'}
                  </button>

                  <button
                    onClick={() => handleDelete(profile)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {editingUser && (
        <AdminEditUser
          user={editingUser}
          onSave={(updates) => handleUpdateUser(editingUser.id, updates)}
          onCancel={() => setEditingUser(null)}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          open={showConfirmDialog.show}
          onOpenChange={(open) => {
            if (!open) setShowConfirmDialog(null)
          }}
          title={showConfirmDialog.title}
          description={showConfirmDialog.message}
          onConfirm={showConfirmDialog.onConfirm}
          onCancel={() => setShowConfirmDialog(null)}
          loading={!!loading}
        />
      )}
    </>
  )
}
