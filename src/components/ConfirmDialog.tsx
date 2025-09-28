'use client'

interface ConfirmDialogProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmDialogProps) {
  const getButtonStyles = (isConfirm: boolean) => {
    const baseStyles = 'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50'

    if (isConfirm) {
      switch (variant) {
        case 'danger':
          return `${baseStyles} text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`
        case 'warning':
          return `${baseStyles} text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500`
        case 'info':
          return `${baseStyles} text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`
        default:
          return `${baseStyles} text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`
      }
    } else {
      return `${baseStyles} text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500`
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className={getButtonStyles(false)}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={getButtonStyles(true)}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
